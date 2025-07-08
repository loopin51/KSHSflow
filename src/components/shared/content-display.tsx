import React from 'react';

interface ContentDisplayProps {
  content: string;
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  const parts = content.split(/(@\w+)/g);

  return (
    <div className="prose dark:prose-invert max-w-none text-foreground">
        {parts.map((part, index) => {
          if (part.startsWith('@')) {
            return (
              <span key={index} className="bg-primary/10 text-primary font-medium rounded-md px-1 py-0.5">
                {part}
              </span>
            );
          }
          return <React.Fragment key={index}>{part.split('\n').map((line, i) => <p key={i} className='my-2'>{line}</p>)}</React.Fragment>;
        })}
    </div>
  );
}
