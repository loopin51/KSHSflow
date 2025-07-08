import Link from 'next/link';
import { MessageCircleQuestion } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
       <Link href="/" className="flex items-center gap-2 mb-8">
          <MessageCircleQuestion className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">CampusOverflow</span>
        </Link>
      {children}
    </div>
  );
}
