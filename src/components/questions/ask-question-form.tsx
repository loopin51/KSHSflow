
'use client';

import { useTransition, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { createQuestion } from '@/actions/question';
import { automaticMentions } from '@/ai/flows/automatic-mentions';
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

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: '',
    },
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
            setMentionedUsers([]);
        } finally {
            setIsDetectingMentions(false);
        }
    }, 500),
    []
  );

  function onSubmit(values: z.infer<typeof questionSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to ask a question.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        await createQuestion({ ...values, author: user });
        toast({
          title: "Question Posted!",
          description: "Your question has been successfully posted."
        });
        form.reset();
        router.push('/');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to post your question. Please try again.",
          variant: "destructive"
        });
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
            {(isDetectingMentions || mentionedUsers.length > 0) && (
                <div className="mt-4 p-4 border rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                        <Users className="h-4 w-4" />
                        <span>Mentioned Users</span>
                        {isDetectingMentions && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    {mentionedUsers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {mentionedUsers.map((user) => (
                                <Badge key={user} variant="outline">@{user}</Badge>
                            ))}
                        </div>
                    ) : (
                        !isDetectingMentions && <p className="text-sm text-muted-foreground">No users mentioned yet.</p>
                    )}
                </div>
            )}
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
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Your Question
        </Button>
      </form>
    </Form>
  );
}
