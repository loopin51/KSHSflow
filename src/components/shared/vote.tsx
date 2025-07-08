'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteProps {
  votes: number;
}

export function Vote({ votes }: VoteProps) {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      // Undo vote
      setUserVote(null);
      setCurrentVotes(votes);
    } else {
      let newVoteCount = votes;
      if (userVote === 'up') newVoteCount -=1;
      if (userVote === 'down') newVoteCount +=1;
      
      if (type === 'up') newVoteCount += 1;
      if (type === 'down') newVoteCount -=1;
      
      setUserVote(type);
      setCurrentVotes(newVoteCount);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote('up')}
        className={cn("h-10 w-10 rounded-full hover:bg-accent", userVote === 'up' && 'bg-accent text-accent-foreground')}
        aria-label="Upvote"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
      <span className="text-xl font-bold py-1">{currentVotes}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote('down')}
        className={cn("h-10 w-10 rounded-full hover:bg-accent", userVote === 'down' && 'bg-accent text-accent-foreground')}
        aria-label="Downvote"
      >
        <ArrowDown className="h-6 w-6" />
      </Button>
    </div>
  );
}
