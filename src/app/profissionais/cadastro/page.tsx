// src/app/profissionais/cadastro/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const MAX_WORDS = 200;

export default function ProfessionalSignUpPage() {
  const [registrationType, setRegistrationType] = useState('liberal');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experienceText, setExperienceText] = useState('');

  const wordCount = useMemo(() => {
    return experienceText.trim().split(/\s+/).filter(Boolean).length;
  }, [experienceText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
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
          // Truncate the text to the allowed word count
          const truncatedText = words.slice(0, MAX_WORDS).join(' ');
          setExperienceText(truncatedText);
      }
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
            <Link href="/login" className="w-full">
                <AlertDialogAction className="w-full">
                    Ok, entendi!
                </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full max-w-5xl bg-background shadow-2xl rounded-2xl overflow-hidden grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="mx-auto grid w-full max-w-lg gap-8">
             <Button variant="ghost" asChild className="justify-start p-0 h-auto text-muted-foreground w-fit absolute top-8 left-8">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
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
                <Label htmlFor="full-name">Nome Completo</Label>
                <Input id="full-name" placeholder="Seu nome ou nome da clínica" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
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
              
              <div className={`grid gap-2 transition-all duration-300 ease-in-out ${registrationType === 'clinic' ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" required={registrationType === 'clinic'} disabled={registrationType !== 'clinic'} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="professional-id">Número do Registro Profissional (apenas números)</Label>
                <Input id="professional-id" placeholder="Ex: 06123456" required onChange={handleNumericInput} maxLength={7} minLength={7} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Compartilhe um pouco de sua experiência</Label>
                <Textarea 
                    id="experience" 
                    placeholder="Descreva sua especialidade, abordagem e experiência com TEA." 
                    required 
                    value={experienceText}
                    onChange={handleExperienceChange}
                    className="min-h-[120px]"
                />
                 <p className="text-sm text-muted-foreground text-right">
                    {wordCount}/{MAX_WORDS} palavras
                </p>
              </div>
              <Button type="submit" className="w-full rounded-full" size="lg">Enviar Inscrição</Button>
            </form>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center p-6">
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="Profissional da saúde sorrindo"
              width="1920"
              height="1080"
              data-ai-hint="doctor healthcare smiling"
              className="h-full w-full object-cover rounded-xl"
            />
        </div>
      </div>
    </div>
  );
}
