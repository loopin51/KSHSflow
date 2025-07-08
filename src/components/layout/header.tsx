import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircleQuestion } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MessageCircleQuestion className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">CampusOverflow</span>
        </Link>
        <div className="flex-1 px-4 sm:px-8 lg:px-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="w-full rounded-full pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
