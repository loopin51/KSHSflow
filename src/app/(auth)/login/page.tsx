import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>계정에 로그인하려면 아래에 이메일을 입력하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        계정이 없으신가요?&nbsp;
        <Link href="/signup" className="underline text-primary">가입하기</Link>
      </CardFooter>
    </Card>
  );
}
