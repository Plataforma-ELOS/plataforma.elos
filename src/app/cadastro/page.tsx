
// src/app/cadastro/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext, type ProvedorOAuth } from '@/components/common/providers';
import { GoogleIcon } from '@/components/icons/social-icons';

const SocialButton = ({
  children,
  icon,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Button type="button" variant="outline" className="w-full justify-center gap-3" onClick={onClick} disabled={disabled}>
    {icon}
    {children}
  </Button>
);

export default function CadastroPage() {
  const router = useRouter();
  const { register, loginWithProvider } = useContext(AuthContext);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: ProvedorOAuth) => {
    setErro(null);
    setLoading(true);
    try {
      const { ok, erro: mensagemErro } = await loginWithProvider(provider);
      if (!ok) setErro(mensagemErro ?? 'Não foi possível iniciar o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setErro(null);
    setLoading(true);
    try {
      const { ok, erro: mensagemErro } = await register(name, email, password);

      if (!ok) {
        setErro(mensagemErro ?? 'Não foi possível criar sua conta.');
        return;
      }

      // Após o cadastro, leva o usuário para a tela de login
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-background p-4 animate-in fade-in-0 slide-in-from-top-4 slide-in-from-left-4 duration-500">
      <div className="w-full max-w-5xl bg-card shadow-2xl rounded-2xl grid lg:grid-cols-2">
        
        {/* Coluna da Esquerda (Formulário) */}
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="mx-auto grid w-full max-w-md gap-6">
                <div className="grid gap-2 text-center">
                    <Link href="/home" className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Image src="https://i.ibb.co/Sw75Xd7Q/Chat-GPT-Image-6-de-set-de-2025-17-17-42-20250911-063055-0000-removebg-preview.png" alt="Logo Elos" width={40} height={40} className="rounded-full" data-ai-hint="logo" />
                        <span className="text-foreground">Plataforma</span>
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                    </Link>
                    <h1 className="text-3xl font-bold mt-4">Crie sua conta</h1>
                    <p className="text-balance text-muted-foreground">
                        É rápido, simples e abre as portas para um mundo de apoio.
                    </p>
                </div>
                <form className="grid gap-4" onSubmit={handleUserSubmit}>
                    {erro && (
                      <p className="text-sm text-destructive text-center">{erro}</p>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" name="name" placeholder="Seu nome completo" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" required placeholder="••••••••" minLength={6}/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me" />
                        <label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Lembrar de mim
                        </label>
                    </div>
                    <Button type="submit" className="w-full rounded-full" disabled={loading}>
                        Criar Conta
                    </Button>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                    </div>
                </div>
                <SocialButton icon={<GoogleIcon />} onClick={() => handleSocialLogin('google')} disabled={loading}>
                    Google
                </SocialButton>
                <div className="mt-4 text-center text-sm space-y-4">
                    <p>
                        Já tem uma conta?{' '}
                        <Link href="/login" className="underline font-semibold">Faça Login</Link>
                    </p>
                    <p className="border-t pt-4">
                        É um profissional ou clínica?{' '}
                        <Link href="/cadastro-profissional" className="underline font-semibold text-primary-strong">Cadastre-se aqui</Link>
                    </p>
                </div>
            </div>
        </div>

        {/* Coluna da Direita (Imagem) */}
        <div className="hidden lg:flex items-center justify-center p-6 bg-background">
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
