'use client';

import { useTransition, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Users, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { createQuestion } from '@/actions/question';
import { recommendUsers } from '@/ai/flows/recommend-users';
import { suggestTags } from '@/ai/flows/suggest-tags';
import { debounce } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const questionSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  body: z.string().min(1, { message: '본문을 입력해주세요.' }),
  tags: z.string().min(1, { message: '태그를 하나 이상 입력해주세요.' }),
  manualMentions: z.string().optional(),
});

export function AskQuestionForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  
  const [recommendedUsers, setRecommendedUsers] = useState<string[]>([]);
  const [isRecommendingUsers, setIsRecommendingUsers] = useState(false);

  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: { title: '', body: '', tags: '', manualMentions: '' },
  });

  const debouncedMentionUpdate = useCallback(
    debounce((body: string, manualMentions: string) => {
        const mentionsFromBody = body.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];
        const mentionsFromInput = (manualMentions || '').split(' ').filter(Boolean);
        
        const allMentions = [...mentionsFromBody, ...mentionsFromInput];
        const uniqueMentions = [...new Set(allMentions)];
        setMentionedUsers(uniqueMentions);
    }, 300),
    []
  );

  const bodyValue = form.watch('body');
  const manualMentionsValue = form.watch('manualMentions');

  useEffect(() => {
    if(bodyValue !== undefined && manualMentionsValue !== undefined) {
      debouncedMentionUpdate(bodyValue, manualMentionsValue);
    }
  }, [bodyValue, manualMentionsValue, debouncedMentionUpdate]);
  
  const handleRecommendUsers = async () => {
    const { body } = form.getValues();
    if (!body) {
        toast({ title: '먼저 질문 본문을 입력해주세요.', variant: 'destructive' });
        return;
    }
    setIsRecommendingUsers(true);
    try {
        const result = await recommendUsers({ question: body });
        setRecommendedUsers(result.recommendedUsernames);
    } catch (error) {
        toast({ title: '사용자를 추천할 수 없습니다.', variant: 'destructive' });
    } finally {
        setIsRecommendingUsers(false);
    }
  };

  const addMention = (username: string) => {
    const currentBody = form.getValues('body');
    if (!currentBody.includes(`@${username}`)) {
      const newBody = `${currentBody} @${username}`.trim();
      form.setValue('body', newBody, { shouldValidate: true });
    }
  }

  const handleSuggestTags = async () => {
    const { title, body } = form.getValues();
    if (!title && !body) {
      toast({ title: '제목과 본문을 먼저 입력해주세요.', variant: 'destructive' });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const result = await suggestTags({ question: `${title}\n\n${body}` });
      setSuggestedTags(result.tags);
    } catch (error) {
      toast({ title: '태그를 추천할 수 없습니다.', variant: 'destructive' });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags').trim();
    const tagsArray = currentTags ? currentTags.split(' ').filter(Boolean) : [];
    if (!tagsArray.includes(tag)) {
      form.setValue('tags', [...tagsArray, tag].join(' '), { shouldValidate: true });
    }
  };


  function onSubmit(values: z.infer<typeof questionSchema>) {
    if (!user) {
      toast({ title: '오류', description: '질문을 하려면 로그인해야 합니다.', variant: 'destructive' });
      return;
    }
    
    startTransition(async () => {
      try {
        await createQuestion({ ...values, author: user, mentionedUsernames: mentionedUsers });
        toast({ title: "질문 등록됨!", description: "질문이 성공적으로 등록되었습니다." });
        router.push('/');
      } catch (error) {
        toast({ title: "오류", description: "질문을 등록하지 못했습니다. 다시 시도해주세요.", variant: "destructive" });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>제목</CardTitle>
            <CardDescription>다른 사람에게 질문하는 것처럼 구체적으로 작성해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="예: 블록체인은 어떻게 작동하나요?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>본문</CardTitle>
            <CardDescription>다른 사람이 답변하는 데 필요한 모든 정보를 포함해주세요. @를 사용하여 사용자를 언급할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="질문 내용을 여기에 입력하세요..."
                      rows={10}
                      {...field}
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
                    <h3 className="text-lg font-semibold">사용자 언급</h3>
                </div>
              <CardDescription>
                @로 언급된 사용자에게 알림이 갑니다. 아래 버튼을 사용하여 AI 추천을 받아보세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
                 <FormField
                  control={form.control}
                  name="manualMentions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>수동으로 사용자 언급</FormLabel>
                      <FormControl>
                        <Input placeholder="사용자 이름을 공백으로 구분하여 입력 (예: user1 user2)" {...field} />
                      </FormControl>
                      <FormDescription>
                        '@' 기호 없이 사용자 이름을 입력해주세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {mentionedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        <FormLabel className="w-full text-sm">감지된 언급:</FormLabel>
                        {mentionedUsers.map((user) => (
                            <Badge key={user} variant="secondary">@{user}</Badge>
                        ))}
                    </div>
                )}
                {isRecommendingUsers ? <Loader2 className="h-5 w-5 animate-spin mt-4"/> : recommendedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        <FormLabel className="w-full text-sm">추천:</FormLabel>
                        {recommendedUsers.filter(u => !mentionedUsers.includes(u)).map((user) => (
                           <Button key={user} type="button" size="sm" variant="outline" onClick={() => addMention(user)}>
                               @{user} 추가
                           </Button>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button type="button" variant="outline" onClick={handleRecommendUsers} disabled={isRecommendingUsers}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    언급할 사용자 찾기
                </Button>
            </CardFooter>
          </Card>


        <Card>
          <CardHeader>
            <CardTitle>태그</CardTitle>
            <CardDescription>질문에 대해 설명하는 태그를 최대 5개까지 추가하세요. 태그는 공백으로 구분합니다. AI 추천을 받아보세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="예: 과학 기술 진로" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSuggestingTags ? <Loader2 className="h-5 w-5 animate-spin mt-4"/> : suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    <FormLabel className="w-full text-sm">추천 태그:</FormLabel>
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
                AI 태그 추천
            </Button>
          </CardFooter>
        </Card>

        <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            질문 등록하기
        </Button>
      </form>
    </Form>
  );
}
