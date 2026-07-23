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
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { createClient } from '@/utils/supabase/client';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }
    setLoading(true);

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
    const notificationTemplateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''; // Template para notificar o admin
    const autoresponderTemplateID = process.env.NEXT_PUBLIC_EMAILJS_AUTORESPONDER_ID ?? ''; // Template para o visitante
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

    // Parâmetros para o template de notificação (que você recebe)
    const notificationParams = {
        name: name,
        email: email,
        message: message,
    };

    // Parâmetros para o template de auto-resposta (que o usuário recebe)
    const autoresponderParams = {
        name: name,
        from_email: email, // Corrigido para corresponder ao template {{from_email}}
    };

    // Guarda a mensagem no banco (sem .select() — contact_messages so tem
    // policy de leitura para admin, encadear select() daria erro de RLS
    // mesmo com o insert valido).
    const supabase = createClient();
    supabase.from('contact_messages').insert({ name, email, message }).then(({ error }) => {
      if (error) console.error('Falha ao registrar mensagem de contato:', error.message);
    });

    // 1. Envia o e-mail de notificação para a plataforma Elos
    emailjs.send(serviceID, notificationTemplateID, notificationParams, publicKey)
      .then(() => {
          // 2. Após o sucesso, envia o e-mail de auto-resposta para o visitante
          emailjs.send(serviceID, autoresponderTemplateID, autoresponderParams, publicKey)
            .then(() => {
              console.log("E-mail de auto-resposta enviado com sucesso para o visitante.");
              toast({
                title: "Mensagem Enviada!",
                description: "Obrigado pelo seu contato. Você receberá uma confirmação no seu e-mail.",
              });
            }, (error) => {
              console.error('Falha ao enviar auto-resposta:', error.text);
               toast({
                variant: "destructive",
                title: "Mensagem recebida, mas falha na confirmação",
                description: "Recebemos sua mensagem, mas houve um erro ao enviar o e-mail de confirmação para você.",
              });
            });
      }, (error) => {
          console.error('Falha ao enviar notificação:', error.text);
          toast({
            variant: "destructive",
            title: "Ocorreu um erro",
            description: "Não foi possível enviar sua mensagem. Tente novamente.",
          });
      })
      .finally(() => {
        // Limpa o formulário apenas após todas as operações de envio
        setName('');
        setEmail('');
        setMessage('');
        setLoading(false);
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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        placeholder="Seu nome completo" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        placeholder="seu@email.com" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Mensagem</Label>
                                    <Textarea 
                                        id="message" 
                                        name="message" 
                                        placeholder="Escreva sua mensagem aqui..." 
                                        className="min-h-[120px]" 
                                        required 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                  {loading ? 'Enviando...' : 'Enviar Mensagem'}
                                </Button>
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
