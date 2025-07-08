import { Separator } from '@/components/ui/separator';
import { Vote } from '@/components/shared/vote';
import { UserCard } from '@/components/shared/user-card';
import type { Answer as AnswerType } from '@/lib/mock-data';
import { CheckCircle2 } from 'lucide-react';
import { ContentDisplay } from '@/components/shared/content-display';
import { cn } from '@/lib/utils';

interface AnswerProps {
  answer: AnswerType;
}

export function Answer({ answer }: AnswerProps) {
  return (
    <>
    <div className={cn("py-6", answer.isAccepted && "rounded-lg bg-accent p-4 -m-4")}>
      <div className="flex gap-4 md:gap-8">
        <div className="flex flex-col items-center gap-2">
          <Vote votes={answer.votes} />
          {answer.isAccepted && (
            <div className="mt-2" title="Accepted Answer">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <ContentDisplay content={answer.body} />
          <div className="flex justify-end mt-4">
            <UserCard user={answer.author} timestamp={answer.createdAt} action="answered" />
          </div>
        </div>
      </div>
    </div>
    <Separator />
    </>
  );
}
