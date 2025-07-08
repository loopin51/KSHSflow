
'use client';

import { useTransition, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Users, Tags, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { createQuestion } from '@/actions/question';
import { automaticMentions } from '@/ai/flows/automatic-mentions';
import { recommendUsers } from '@/ai/flows/recommend-users';
import { suggestTags } from '@/ai/flows/suggest-tags';
import { debounce } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const questionSchema = z.object({
  title: z.string().min(15, { message: 'Title must be at least 15 characters.' }).max(130),
  body: z.string().min(30, { message: 'Body must be at least 30 characters.' }),
  tags: z.string().min(1, { message: 'Please enter at least one tag.' }),
});

export function AskQuestionForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [isDetectingMentions, setIsDetectingMentions] = useState(false);

  const [recommendedUsers, setRecommendedUsers] = useState<string[]>([]);
  const [isRecommendingUsers, setIsRecommendingUsers] = useState(false);

  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: { title: '', body: '', tags: ''},
  });

  const handleBodyChange = useCallback(
    debounce(async (body: string) => {
        if (body.trim().length < 20) {
            setMentionedUsers([]);
            return;
        }
        setIsDetectingMentions(true);
        try {
            const result = await automaticMentions({ question: body });
            setMentionedUsers(result.mentionedUsernames);
        } catch (error) {
            console.error("Error detecting mentions:", error);
        } finally {
            setIsDetectingMentions(false);
        }
    }, 500),
    []
  );

  const handleSuggestTags = async () => {
      const { title, body } = form.getValues();
      if (!title && !body) {
          toast({ title: 'Please provide a title or body first.', variant: 'destructive' });
          return;
      }
      setIsSuggestingTags(true);
      try {
        const result = await suggestTags({ question: `${title}\n${body}`});
        setSuggestedTags(result.tags);
      } catch (error) {
          toast({ title: 'Could not suggest tags.', variant: 'destructive' });
      } finally {
          setIsSuggestingTags(false);
      }
  };
  
  const handleRecommendUsers = async () => {
    const { body } = form.getValues();
    if (!body) {
        toast({ title: 'Please provide a question body first.', variant: 'destructive' });
        return;
    }
    setIsRecommendingUsers(true);
    try {
        const result = await recommendUsers({ question: body });
        setRecommendedUsers(result.recommendedUsernames);
    } catch (error) {
        toast({ title: 'Could not recommend users.', variant: 'destructive' });
    } finally {
        setIsRecommendingUsers(false);
    }
  };

  const addTag = (tag: string) => {
      const currentTags = form.getValues('tags');
      const newTags = currentTags ? `${currentTags} ${tag}` : tag;
      form.setValue('tags', newTags, { shouldValidate: true });
  }

  const addMention = (username: string) => {
    const currentBody = form.getValues('body');
    const newBody = `${currentBody} @${username}`;
    form.setValue('body', newBody, { shouldValidate: true });
    handleBodyChange(newBody); // re-run mention detection
  }

  function onSubmit(values: z.infer<typeof questionSchema>) {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to ask a question.', variant: 'destructive' });
      return;
    }
    startTransition(async () => {
      try {
        await createQuestion({ ...values, author: user });
        toast({ title: "Question Posted!", description: "Your question has been successfully posted." });
        router.push('/');
      } catch (error) {
        toast({ title: "Error", description: "Failed to post your question. Please try again.", variant: "destructive" });
      }
    });
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
            <CardDescription>Include all the information someone would need to answer your question. Use @ to mention users.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type your question details here..."
                      rows={10}
                      {...field}
                      onChange={(e) => {
                          field.onChange(e);
                          handleBodyChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">User Mentions</h3>
                    {isDetectingMentions && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              <CardDescription>
                Users mentioned with @ will be notified. Use the button below to get AI recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {mentionedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        <FormLabel className="w-full text-sm">Detected Mentions:</FormLabel>
                        {mentionedUsers.map((user) => (
                            <Badge key={user} variant="secondary">@{user}</Badge>
                        ))}
                    </div>
                )}
                {isRecommendingUsers ? <Loader2 className="h-5 w-5 animate-spin"/> : recommendedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <FormLabel className="w-full text-sm">Recommendations:</FormLabel>
                        {recommendedUsers.map((user) => (
                           <Button key={user} type="button" size="sm" variant="outline" onClick={() => addMention(user)}>
                               Add @{user}
                           </Button>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button type="button" variant="outline" onClick={handleRecommendUsers} disabled={isRecommendingUsers}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Find User to Mention
                </Button>
            </CardFooter>
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
             {isSuggestingTags ? <Loader2 className="mt-4 h-5 w-5 animate-spin"/> : suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {suggestedTags.map((tag) => (
                        <Button key={tag} type="button" size="sm" variant="outline" onClick={() => addTag(tag)}>
                            {tag}
                        </Button>
                    ))}
                </div>
             )}
          </CardContent>
          <CardFooter>
             <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggestingTags}>
                <Sparkles className="mr-2 h-4 w-4" />
                Suggest Tags
            </Button>
          </CardFooter>
        </Card>

        <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Your Question
        </Button>
      </form>
    </Form>
  );
}
