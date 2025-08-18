// src/app/profissionais/cadastro/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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

export default function ProfessionalSignUpPage() {
  const [registrationType, setRegistrationType] = useState('liberal');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 p-4 sm:p-6 lg:p-8">
      <AlertDialog open={isSubmitted} onOpenChange={setIsSubmitted}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">Inscrição Realizada com Sucesso!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
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
          <div className="mx-auto grid w-full max-w-md gap-6">
            <div className="grid gap-2 text-center">
                 <Button variant="ghost" asChild className="justify-start p-0 h-auto text-muted-foreground w-fit absolute top-8 left-8">
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Link>
                </Button>
              <h1 className="text-3xl font-bold mt-12">Cadastro Profissional</h1>
              <p className="text-balance text-muted-foreground">
                Submeta sua inscrição para participar do time de perfis profissionais da plataforma E.L.O.S.
              </p>
            </div>
            <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
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
              
              <div className={`grid gap-2 transition-all duration-300 ease-in-out ${registrationType === 'clinic' ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" required={registrationType === 'clinic'} disabled={registrationType !== 'clinic'} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="professional-id">Número do Registro Profissional</Label>
                <Input id="professional-id" placeholder="Ex: CRP 06/123456" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Compartilhe um pouco de sua experiência</Label>
                <Textarea id="experience" placeholder="Descreva sua especialidade, abordagem e experiência com TEA." required />
              </div>
              <Button type="submit" className="w-full rounded-full">Enviar Inscrição</Button>
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
