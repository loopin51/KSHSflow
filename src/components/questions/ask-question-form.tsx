'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { createQuestion } from '@/actions/question';

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

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: '',
    },
  });

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
