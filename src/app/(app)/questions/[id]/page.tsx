import { getQuestionById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Vote } from '@/components/shared/vote';
import { UserCard } from '@/components/shared/user-card';
import { Answer } from '@/components/answers/answer';
import { AnswerForm } from '@/components/answers/answer-form';
import { ContentDisplay } from '@/components/shared/content-display';

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = getQuestionById(params.id);

  if (!question) {
    notFound();
  }

  const acceptedAnswer = question.answers.find(a => a.isAccepted);
  const otherAnswers = question.answers.filter(a => !a.isAccepted);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{question.title}</h1>
        <div className="text-sm text-muted-foreground mt-1">
          Asked {question.createdAt}
        </div>
      </div>
      <Separator />

      <div className="flex gap-4 md:gap-8 py-6">
        <Vote votes={question.votes} />
        <div className="flex-1 min-w-0">
          <ContentDisplay content={question.body} />
          <div className="flex flex-wrap gap-2 my-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-end">
            <UserCard user={question.author} timestamp={question.createdAt} action="asked" />
          </div>
        </div>
      </div>

      {question.answersCount > 0 && <Separator />}
      
      <div className="my-6">
        {question.answersCount > 0 && (
           <h2 className="text-xl font-bold mb-4">{question.answersCount} {question.answersCount === 1 ? 'Answer' : 'Answers'}</h2>
        )}
        
        {acceptedAnswer && <Answer answer={acceptedAnswer} />}
        {otherAnswers.map(answer => <Answer key={answer.id} answer={answer} />)}
      </div>

      <Separator />

      <div className="my-6">
        <h2 className="text-xl font-bold mb-4">Your Answer</h2>
        <AnswerForm questionId={question.id} />
      </div>
    </div>
  );
}
