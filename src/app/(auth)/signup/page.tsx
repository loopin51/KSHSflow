import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">가입하기</CardTitle>
        <CardDescription>계정을 만들려면 정보를 입력하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        이미 계정이 있으신가요?&nbsp;
        <Link href="/login" className="underline text-primary">로그인</Link>
      </CardFooter>
    </Card>
  );
}
