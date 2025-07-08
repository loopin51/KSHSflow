import React from 'react';

interface ContentDisplayProps {
  content: string;
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  return (
    <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
      {content.split('\n').map((line, lineIndex) => (
        <p key={lineIndex} className="my-2">
          {line.split(/(@\w+)/g).map((part, partIndex) => {
            if (part.startsWith('@')) {
              return (
                <span key={partIndex} className="bg-primary/10 text-primary font-medium rounded-md px-1 py-0.5">
                  {part}
                </span>
              );
            }
            return <React.Fragment key={partIndex}>{part}</React.Fragment>;
          })}
        </p>
      ))}
    </div>
  );
}
