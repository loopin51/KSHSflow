'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuestions } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
  const userQuestions = getQuestions().filter(q => q.author.id === user.id);
  const userAnswers = getQuestions().flatMap(q => q.answers).filter(a => a.author.id === user.id);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 space-y-0">
            <Avatar className="h-24 w-24" data-ai-hint="person avatar">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <p className="text-muted-foreground">Joined recently</p>
            </div>
            <Button variant="outline" onClick={logout}>Log Out</Button>
        </CardHeader>
        <CardContent>
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{userQuestions.length}</p>
                        <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{userAnswers.length}</p>
                        <p className="text-sm text-muted-foreground">Answers</p>
                    </div>
                </div>
            </div>
             <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Questions Asked</h3>
                {userQuestions.length > 0 ? (
                    <ul className="space-y-2">
                        {userQuestions.map(q => (
                            <li key={q.id} className="text-primary hover:underline">
                                <Link href={`/questions/${q.id}`}>{q.title}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">No questions asked yet.</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
