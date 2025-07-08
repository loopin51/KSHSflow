import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getQuestions } from '@/lib/mock-data';
import { QuestionListItem } from '@/components/questions/question-list-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const questions = getQuestions();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Questions</h1>
        <Button asChild>
          <Link href="/ask">Ask Question</Link>
        </Button>
      </div>

      <Tabs defaultValue="newest" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>
        <TabsContent value="newest">
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionListItem key={question.id} question={question} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="popular">
          <div className="space-y-4">
            {questions.slice().sort((a, b) => b.votes - a.votes).map((question) => (
              <QuestionListItem key={question.id} question={question} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="unanswered">
          <div className="space-y-4">
            {questions.filter(q => q.answersCount === 0).map((question) => (
              <QuestionListItem key={question.id} question={question} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
