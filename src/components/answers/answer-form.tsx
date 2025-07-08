'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { createAnswer } from '@/actions/question';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

const answerSchema = z.object({
  content: z.string().min(20, { message: '답변은 20자 이상이어야 합니다.' }),
});

interface AnswerFormProps {
    questionId: string;
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof answerSchema>) {
    if (!user) {
        toast({
            title: '로그인되지 않음',
            description: '답변을 게시하려면 로그인해야 합니다.',
            variant: 'destructive'
        });
        return;
    }

    startTransition(async () => {
        try {
            await createAnswer({ content: values.content, questionId, author: user });
            toast({
                title: "답변 등록됨!",
                description: "기여해 주셔서 감사합니다."
            });
            form.reset();
            router.refresh();
        } catch (error) {
            toast({
                title: "오류",
                description: "답변을 게시할 수 없습니다.",
                variant: "destructive"
            });
        }
    });
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
                  placeholder="자세한 답변을 제공해주세요..."
                  rows={8}
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            답변 등록하기
        </Button>
      </form>
    </Form>
  );
}
