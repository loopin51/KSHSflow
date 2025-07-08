import { AskQuestionForm } from '@/components/questions/ask-question-form';

export default function AskQuestionPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ask a Public Question</h1>
        <AskQuestionForm />
      </div>
    </div>
  );
}
