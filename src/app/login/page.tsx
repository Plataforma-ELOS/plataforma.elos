// src/app/login/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useContext, Suspense } from 'react';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';
import { AuthContext } from '@/components/providers';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { ok, erro } = await login(email, password);

    if (ok) {
      setShowSuccessDialog(true);
    } else {
      setMensagemErro(erro ?? 'Dados inválidos.');
      setShowErrorDialog(true);
    }
  };

  const handleContinue = () => {
    setShowSuccessDialog(false);
    const destino = searchParams.get('redirect') || '/home';
    router.push(destino);
  };

  return (
    <>
      {/* Pop-up de Sucesso */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">Login Realizado com Sucesso!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground px-4">
              Seja bem-vindo(a) de volta! Você será redirecionado para a página inicial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleContinue} className="w-full">
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop-up de Erro */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">Dados inválidos</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground px-4">
              {mensagemErro}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>Tentar Novamente</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/cadastro')}>
              Criar Conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-5xl bg-card shadow-2xl rounded-2xl grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 sm:p-12">
                <div className="mx-auto grid w-full max-w-md gap-6">
                <div className="grid gap-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <span className="text-foreground">Plataforma</span>
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                    </div>
                    <h1 className="text-3xl font-bold mt-4">Bem-vindo(a) de volta!</h1>
                    <p className="text-balance text-muted-foreground">
                    Entre com sua conta para continuar.
                    </p>
                </div>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Senha</Label>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
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
                    <Button type="submit" className="w-full rounded-full">
                        Entrar
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <p>
                        Não tem uma conta?{' '}
                        <button onClick={() => router.push('/cadastro')} className="underline font-semibold">
                            Crie uma agora
                        </button>
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
                    data-ai-hint="community support smiling"
                    className="h-full w-full object-cover rounded-xl"
                />
            </div>
        </div>
      </div>
    </>
  );
}

// useSearchParams exige Suspense boundary no Next 15.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
