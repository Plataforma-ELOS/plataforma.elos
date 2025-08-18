
// src/app/login/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const SocialButton = ({ children, icon }: { children: React.ReactNode, icon: React.ReactNode }) => (
    <Button variant="outline" className="w-full justify-center gap-3">
        {icon}
        {children}
    </Button>
);

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-background shadow-2xl rounded-2xl overflow-hidden grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="mx-auto grid w-full max-w-md gap-8">
            <div className="grid gap-2 text-center">
              <Link href="/home" className="flex items-center justify-center gap-2 text-3xl font-bold">
                  <span className="text-foreground">Plataforma</span>
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                      E.L.O.S
                  </span>
              </Link>
              <h1 className="text-3xl font-bold mt-4">Bem-vindo(a) de volta!</h1>
              <p className="text-balance text-muted-foreground">
                Faça login para continuar sua jornada de cuidado.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                      Lembrar de mim
                  </label>
              </div>
              <Button type="submit" className="w-full rounded-full" asChild>
                  <Link href="/home">Entrar</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                  </span>
              </div>
            </div>
              <div className="grid grid-cols-2 gap-4">
                 <SocialButton icon={
                      <svg role="img" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.79 2.04-5.87 0-9.47-4.82-9.47-9.8s3.6-9.8 9.47-9.8c2.62 0 4.5.96 6.17 2.18l-2.43 2.37c-.99-1-2.2-1.92-3.74-1.92-3.58 0-6.17 2.95-6.17 6.1s2.59 6.1 6.17 6.1c3.22 0 4.5-1.84 4.79-3.28h-4.79z"></path></svg>
                  }>
                      Google
                  </SocialButton>
                   <SocialButton icon={
                      <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 fill-[#1877F2]"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.692v-3.622h3.126V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z"></path></svg>
                  }>
                      Facebook
                  </SocialButton>
              </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="#" className="underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center p-6">
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="Image"
              width="1920"
              height="1080"
              data-ai-hint="mother child smiling"
              className="h-full w-full object-cover rounded-xl"
            />
        </div>
      </div>
    </div>
  );
}
