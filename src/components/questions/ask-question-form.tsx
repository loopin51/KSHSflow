'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { debounce } from '@/lib/utils';
import { suggestTags } from '@/ai/flows/suggest-tags';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const questionSchema = z.object({
  title: z.string().min(15, { message: 'Title must be at least 15 characters.' }).max(130),
  body: z.string().min(30, { message: 'Body must be at least 30 characters.' }),
  tags: z.string().min(1, { message: 'Please enter at least one tag.' }),
});

export function AskQuestionForm() {
  const [isPending, startTransition] = useTransition();
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: '',
    },
  });

  const { watch, setValue, getValues } = form;

  const handleSuggestTags = useCallback((body: string) => {
    if (body.length < 50) {
      setSuggestedTags([]);
      return;
    }
    if (isSuggesting) return;
    
    setIsSuggesting(true);
    startTransition(async () => {
      try {
        const result = await suggestTags({ question: body });
        setSuggestedTags(result.tags);
      } catch (error) {
        console.error('Error suggesting tags:', error);
        toast({
          title: "Error",
          description: "Could not suggest tags.",
          variant: "destructive"
        });
      } finally {
        setIsSuggesting(false);
      }
    });
  }, [isSuggesting, toast]);

  const debouncedSuggestTags = useCallback(debounce(handleSuggestTags, 1000), [handleSuggestTags]);
  
  const questionBody = watch('body');
  
  useEffect(() => {
    if (questionBody) {
        debouncedSuggestTags(questionBody);
    }
  }, [questionBody, debouncedSuggestTags]);
  
  const addTag = (tag: string) => {
    const currentTags = getValues('tags').split(' ').filter(Boolean);
    if (!currentTags.includes(tag)) {
      setValue('tags', [...currentTags, tag].join(' '));
    }
  };

  function onSubmit(values: z.infer<typeof questionSchema>) {
    console.log(values);
    // Here you would call a server action to submit the question
    toast({
      title: "Question Posted!",
      description: "Your question has been successfully posted."
    });
    form.reset();
    setSuggestedTags([]);
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Be specific and imagine you’re asking a question to another person.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g. How does a blockchain work?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Body</CardTitle>
            <CardDescription>Include all the information someone would need to answer your question.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Type your question details here..." rows={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add up to 5 tags to describe what your question is about. Separate tags with a space.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g. science technology career" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(isSuggesting || suggestedTags.length > 0) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Suggested Tags:</h4>
                {isSuggesting ? (
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Loader2 className="h-4 w-4 animate-spin" />
                     <span>Generating tags...</span>
                   </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => addTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending || isSuggesting}>
            {(isPending || isSuggesting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Your Question
        </Button>
      </form>
    </Form>
  );
}
