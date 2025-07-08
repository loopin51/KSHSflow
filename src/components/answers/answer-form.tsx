'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const answerSchema = z.object({
  content: z.string().min(20, { message: 'Answer must be at least 20 characters long.' }),
});

interface AnswerFormProps {
    questionId: string;
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof answerSchema>) {
    console.log({ ...values, questionId });
    // Here you would call a server action to submit the answer
    toast({
        title: "Answer Posted!",
        description: "Thank you for contributing."
    });
    form.reset();
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed answer..."
                  rows={8}
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Post Your Answer</Button>
      </form>
    </Form>
  );
}
