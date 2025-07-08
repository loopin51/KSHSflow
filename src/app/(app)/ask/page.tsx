'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AskQuestionForm } from '@/components/questions/ask-question-form';
import { Loader2 } from 'lucide-react';

export default function AskQuestionPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user data is not loaded yet, do nothing.
    // If it has loaded and is null, then redirect.
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  // While waiting for user data or redirecting, show a loading state.
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ask a Public Question</h1>
        <AskQuestionForm />
      </div>
    </div>
  );
}
