// src/app/fale-conosco/page.tsx
"use client";

import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef.current) return;

    const serviceID = 'service_r3l495y';
    const templateID = 'template_nr2llgd';
    const publicKey = '4FHqCvo8kcV6WkAQ3';

    emailjs.sendForm(serviceID, templateID, formRef.current, publicKey)
      .then((result) => {
          toast({
            title: "Mensagem Enviada!",
            description: "Obrigado pelo seu contato. Responderemos em breve.",
          });
          formRef.current?.reset();
      }, (error) => {
          console.error('FAILED...', error.text);
          toast({
            variant: "destructive",
            title: "Ocorreu um erro",
            description: "Não foi possível enviar sua mensagem. Tente novamente.",
          });
      });
  };


  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <HeaderSecondary />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Mail className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Entre em Contato</h1>
                <p className="max-w-[700px] text-foreground/80 md:text-xl">
                    Tem alguma dúvida, sugestão ou precisa de suporte? Nossa equipe está pronta para ajudar.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Nossas Informações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                             <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Email</h3>
                                    <p>Para dúvidas e suporte geral.</p>
                                    <a href="mailto:elosplataforma@gmail.com" className="text-primary hover:underline">elosplataforma@gmail.com</a>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Telefone</h3>
                                    <p>Disponível em horário comercial.</p>
                                    <a href="tel:+5511999998888" className="text-primary hover:underline">(11) 99999-8888</a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Envie uma Mensagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nome</Label>
                                        <Input id="firstName" name="from_name" placeholder="Seu nome" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Sobrenome</Label>
                                        <Input id="lastName" name="from_lastname" placeholder="Seu sobrenome" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="from_email" type="email" placeholder="seu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Mensagem</Label>
                                    <Textarea id="message" name="message" placeholder="Escreva sua mensagem aqui..." className="min-h-[120px]" required />
                                </div>
                                <Button type="submit" className="w-full">Enviar Mensagem</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
