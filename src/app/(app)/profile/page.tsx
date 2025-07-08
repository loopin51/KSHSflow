'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getQuestions } from '@/lib/mock-data';
import type { Question, Answer } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading, logout, updateUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [isContributionsLoading, setIsContributionsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      
      const fetchUserContributions = async () => {
        setIsContributionsLoading(true);
        const allQuestions = await getQuestions();
        const uQuestions = allQuestions.filter(q => q.author.id === user.id);
        
        const allAnswers: Answer[] = [];
        for (const q of allQuestions) {
            if (q.answers) {
              allAnswers.push(...q.answers);
            }
        }
        const uAnswers = allAnswers.filter(a => a.author.id === user.id);

        setUserQuestions(uQuestions);
        setUserAnswers(uAnswers);
        setIsContributionsLoading(false);
      };

      fetchUserContributions();
    }
  }, [user]);

  if (isAuthLoading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const handleSave = async () => {
    if (name.trim()) {
      await updateUser({ name, bio });
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Name cannot be empty.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (nameStr: string) => (nameStr || '').split(' ').map(n => n[0]).join('');

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 space-y-0">
            <Avatar className="h-24 w-24" data-ai-hint="person avatar">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                {isEditing ? (
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="text-3xl font-bold h-auto p-0 border-0 shadow-none focus-visible:ring-0"
                  />
                ) : (
                  <CardTitle className="text-3xl">{user.name}</CardTitle>
                )}
                <p className="text-muted-foreground">Joined recently</p>
            </div>
            <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
                <Button variant="outline" onClick={logout}>Log Out</Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">About</h3>
                 {isEditing ? (
                    <Textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        placeholder="Tell us a little about yourself..."
                        className="min-h-[100px]"
                    />
                ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{bio || 'No bio yet.'}</p>
                )}
            </div>

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
                {isContributionsLoading ? <Loader2 className="animate-spin" /> : userQuestions.length > 0 ? (
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
