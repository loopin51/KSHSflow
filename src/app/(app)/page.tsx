import { getQuestions } from '@/lib/mock-data';
import { QuestionListItem } from '@/components/questions/question-list-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const questions = getQuestions();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Button asChild>
          <Link href="/ask">Ask Question</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionListItem key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
