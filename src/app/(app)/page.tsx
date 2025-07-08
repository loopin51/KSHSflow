import { getQuestions } from '@/lib/mock-data';
import { QuestionListItem } from '@/components/questions/question-list-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const questions = await getQuestions();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">모든 질문</h1>
        <Button asChild>
          <Link href="/ask">질문하기</Link>
        </Button>
      </div>
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionListItem key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">아직 질문이 없습니다</h2>
          <p className="text-muted-foreground">첫 번째 질문을 등록해보세요!</p>
        </div>
      )}
    </div>
  );
}
