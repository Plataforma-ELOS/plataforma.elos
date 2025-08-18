// src/app/cadastro-profissional/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const MAX_WORDS = 200;

export default function ProfessionalSignUpPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experienceText, setExperienceText] = useState('');
  const [registrationType, setRegistrationType] = useState('liberal');

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas números e limita o comprimento
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 7) {
      e.target.value = numericValue;
    } else {
      e.target.value = numericValue.slice(0, 7);
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
  
  const wordCount = useMemo(() => {
    return experienceText.trim().split(/\s+/).filter(Boolean).length;
  }, [experienceText]);

  const handleProfessionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação final do campo de registro
    const professionalIdInput = document.getElementById('professional-id') as HTMLInputElement;
    if (professionalIdInput.value.length !== 7) {
      alert('O número do registro profissional deve ter exatamente 7 dígitos.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 p-4 sm:p-6 lg:p-8">
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
                  <AlertDialogAction onClick={() => { setIsSubmitted(false); router.push('/home'); }} className="w-full">
                      Ok, entendi!
                  </AlertDialogAction>
              </AlertDialogFooter>
      </AlertDialogContent></AlertDialog>

      <div className="w-full max-w-4xl mx-auto bg-background shadow-2xl rounded-2xl flex flex-col p-8 sm:p-12">
        <div className="mx-auto grid w-full max-w-lg gap-8">
            <div className="grid gap-4 text-center">
                <Link href="/home" className="flex items-center justify-center gap-2 text-2xl font-bold">
                    <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Logo" className="rounded-full" />
                    <span className="text-foreground">Plataforma</span>
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                </Link>
                <h1 className="text-3xl font-bold mt-4">Cadastro Profissional</h1>
                <p className="text-balance text-muted-foreground">
                    Submeta sua inscrição para participar do time de perfis profissionais da plataforma E.L.O.S.
                </p>
                 <Link href="/cadastro" className="text-sm text-muted-foreground hover:text-foreground mt-2">
                    &larr; Não é um profissional? Voltar para o cadastro de usuário
                  </Link>
            </div>
            <form className="grid gap-6" onSubmit={handleProfessionalSubmit}>
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
                
                <div className={cn('grid gap-2 transition-opacity duration-300', registrationType === 'clinic' ? 'opacity-100' : 'opacity-50 pointer-events-none')}>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="00.000.000/0000-00" required={registrationType === 'clinic'} disabled={registrationType !== 'clinic'} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="professional-id">Número do Registro Profissional (exatamente 7 dígitos)</Label>
                    <Input id="professional-id" placeholder="Ex: 1234567" required onChange={handleNumericInput} maxLength={7} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="experience">Compartilhe um pouco de sua experiência</Label>
                    <Textarea id="experience" placeholder="Descreva sua especialidade, abordagem e experiência com TEA." required value={experienceText} onChange={handleExperienceChange} className="min-h-[120px]" />
                    <p className="text-sm text-muted-foreground text-right">{wordCount}/{MAX_WORDS} palavras</p>
                </div>
                <Button type="submit" className="w-full rounded-full" size="lg">Enviar Inscrição</Button>
            </form>
        </div>
      </div>
    </div>
  );
}
