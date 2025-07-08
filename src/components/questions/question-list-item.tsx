import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Question } from '@/lib/mock-data';
import { UserCard } from '@/components/shared/user-card';

interface QuestionListItemProps {
  question: Question;
}

export function QuestionListItem({ question }: QuestionListItemProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="hidden sm:flex flex-col items-center justify-center text-center w-24 flex-shrink-0">
            <div className="text-lg font-bold">{question.votes}</div>
            <div className="text-sm text-muted-foreground">투표</div>
            <div className={`mt-2 text-lg font-bold ${question.answersCount > 0 ? 'text-primary' : 'text-inherit'}`}>{question.answersCount}</div>
            <div className="text-sm text-muted-foreground">답변</div>
             <div className="mt-2 text-sm text-muted-foreground">{question.views} 조회</div>
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/questions/${question.id}`}>
              <h2 className="text-lg font-semibold text-primary hover:underline truncate">{question.title}</h2>
            </Link>
            <div className="flex flex-wrap gap-2 my-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <div className="flex justify-end mt-2">
                <UserCard user={question.author} timestamp={question.createdAt} action="asked" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
