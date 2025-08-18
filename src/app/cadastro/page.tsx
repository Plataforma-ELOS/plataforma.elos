// src/app/cadastro/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';


const SocialButton = ({ children, icon }: { children: React.ReactNode, icon: React.ReactNode }) => (
    <Button variant="outline" className="w-full justify-center gap-3">
        {icon}
        {children}
    </Button>
);

const MAX_WORDS = 200;

export default function CadastroPage() {
    const [formType, setFormType] = useState('user'); // 'user' or 'professional'
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [experienceText, setExperienceText] = useState('');
    const [registrationType, setRegistrationType] = useState('liberal');

    const wordCount = useMemo(() => {
        return experienceText.trim().split(/\s+/).filter(Boolean).length;
    }, [experienceText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) {
            e.target.value = value.replace(/\D/g, '');
        }
    };
    
    const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/).filter(Boolean);
        if (words.length <= MAX_WORDS) {
            setExperienceText(text);
        } else {
            const truncatedText = words.slice(0, MAX_WORDS).join(' ');
            setExperienceText(truncatedText);
        }
    };

    const UserForm = (
        <div className="mx-auto grid w-full max-w-md gap-6">
            <div className="grid gap-2 text-center">
                <Link href="/home" className="flex items-center justify-center gap-2 text-2xl font-bold">
                    <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Logo" className="rounded-full" />
                    <span className="text-foreground">Plataforma</span>
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                </Link>
                <h1 className="text-3xl font-bold mt-4">Crie sua conta</h1>
                <p className="text-balance text-muted-foreground">
                    É rápido, simples e abre as portas para um mundo de apoio.
                </p>
            </div>
            <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Seu nome completo" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" required placeholder="••••••••"/>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Lembrar de mim
                    </label>
                </div>
                <Button type="submit" className="w-full rounded-full" asChild>
                    <Link href="/home">Criar Conta</Link>
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
            <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={<svg role="img" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.7503 1.165 15.0553 0 12.0003 0C7.31028 0 3.25527 2.725 1.25027 6.55L4.93528 9.32498C5.87528 6.56502 8.65528 4.75 12.0003 4.75Z" /><path fill="currentColor" d="M23.49 12.275C23.49 11.49 23.415 10.73 23.285 10H12V14.51H18.47C18.18 15.99 17.34 17.255 16.08 18.105L16.08 18.145L19.835 20.91C22.02 18.965 23.49 15.92 23.49 12.275Z" /><path fill="currentColor" d="M4.93028 9.32498L1.25027 6.54998C0.465271 8.22498 0.000274658 10.06 0.000274658 12C0.000274658 13.94 0.465271 15.775 1.25027 17.45L4.93028 14.675C4.51528 13.565 4.25027 12.35 4.25027 11.995C4.25027 11.235 4.43528 10.26 4.93028 9.32498Z" /><path fill="currentColor" d="M12.0003 24C15.2403 24 17.9653 22.935 19.8353 20.91L16.0803 18.105C14.9603 18.845 13.6203 19.25 12.0003 19.25C8.65528 19.25 5.87528 17.435 4.93528 14.675L1.25527 17.455C3.25527 21.275 7.31028 24 12.0003 24Z" /></svg>}>
                    Google
                </SocialButton>
                <SocialButton icon={<svg role="img" viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M17.153 22.5c-2.43 0-3.32-1.353-5.03-1.353-1.713 0-2.733 1.353-5.034 1.353-4.22 0-6.09-4.26-6.09-9.273 0-5.62 4.155-8.227 8.3-8.227 2.1 0 3.52 1.092 4.938 1.092 1.355 0 3.038-1.092 5.03-1.092 4.468 0 7.856 3.654 7.856 8.358 0 4.148-2.615 7.02-5.32 8.784-1.28.84-2.738 1.38-4.43 1.358zM12.02 3.064c-1.575 0-3.153 1.06-4.023 2.147-2.18 2.654-2.115 6.692-2.115 6.692.93 0 2.183-1.38 4.14-1.38s2.87 1.38 4.023 1.38c2.146 0 3.33-2.454 3.394-2.52.067-.066-2.147-3.41-5.42-3.319z"/></svg>}>
                    Apple
                </SocialButton>
            </div>
            <div className="mt-4 text-center text-sm space-y-4">
                <p>
                    Já tem uma conta?{' '}
                    <Link href="/login" className="underline font-semibold">Faça Login</Link>
                </p>
                <p className="border-t pt-4">
                    É um profissional ou clínica?{' '}
                    <button onClick={() => setFormType('professional')} className="underline font-semibold text-primary">Cadastre-se aqui</button>
                </p>
            </div>
        </div>
    );

    const ProfessionalForm = (
        <div className="mx-auto grid w-full max-w-lg gap-8">
            <Button variant="ghost" onClick={() => setFormType('user')} className="justify-start p-0 h-auto text-muted-foreground w-fit absolute top-8 left-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
            <div className="grid gap-2 text-center mt-12">
               <Link href="/home" className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Logo" className="rounded-full" />
                  <span className="text-foreground">Plataforma</span>
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
              </Link>
              <h1 className="text-3xl font-bold mt-4">Cadastro Profissional</h1>
              <p className="text-balance text-muted-foreground">
                Submeta sua inscrição para participar do time de perfis profissionais da plataforma E.L.O.S.
              </p>
            </div>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="prof-full-name">Nome Completo</Label>
                <Input id="prof-full-name" placeholder="Seu nome ou nome da clínica" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prof-email">Email</Label>
                <Input id="prof-email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registration-type">Tipo de Cadastro</Label>
                <Select onValueChange={setRegistrationType} defaultValue="liberal">
                  <SelectTrigger id="registration-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liberal">Profissional Liberal</SelectItem>
                    <SelectItem value="clinic_professional">Profissional de Clínica</SelectItem>
                    <SelectItem value="clinic">Clínica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className={cn('grid gap-2 transition-all duration-300 ease-in-out', registrationType === 'clinic' ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden')}>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" required={registrationType === 'clinic'} disabled={registrationType !== 'clinic'} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="professional-id">Número do Registro Profissional (apenas números)</Label>
                <Input id="professional-id" placeholder="Ex: 06123456" required onChange={handleNumericInput} minLength={7} maxLength={7} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Compartilhe um pouco de sua experiência</Label>
                <Textarea id="experience" placeholder="Descreva sua especialidade, abordagem e experiência com TEA." required value={experienceText} onChange={handleExperienceChange} className="min-h-[120px]" />
                <p className="text-sm text-muted-foreground text-right">{wordCount}/{MAX_WORDS} palavras</p>
              </div>
              <Button type="submit" className="w-full rounded-full" size="lg">Enviar Inscrição</Button>
            </form>
          </div>
    );

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 p-4 sm:p-6 lg:p-8 overflow-hidden">
            <AlertDialog open={isSubmitted} onOpenChange={setIsSubmitted}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-center text-2xl">Inscrição Realizada com Sucesso!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-muted-foreground px-4">
                        Sua inscrição foi recebida e será analisada pela nossa equipe. Você receberá uma resposta em seu e-mail em um período de até 2 semanas. Agradecemos o seu interesse em fazer parte da E.L.O.S!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => { setIsSubmitted(false); setFormType('user'); }} className="w-full">
                            Ok, entendi!
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="w-full max-w-5xl bg-background shadow-2xl rounded-2xl grid lg:grid-cols-2 relative h-[90vh] max-h-[700px]">
                <div className={cn(
                    "absolute top-0 flex items-center justify-center p-8 sm:p-12 h-full w-full lg:w-1/2 transition-all duration-700 ease-in-out",
                    formType === 'user' ? 'left-0' : 'left-full lg:left-1/2'
                )}>
                    {formType === 'user' ? UserForm : ProfessionalForm}
                </div>
                <div className={cn(
                    "absolute top-0 p-6 h-full w-full lg:w-1/2 transition-all duration-700 ease-in-out",
                    formType === 'user' ? 'left-full lg:left-1/2' : 'left-0'
                )}>
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
