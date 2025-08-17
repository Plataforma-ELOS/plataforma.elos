
// src/app/comunidade/criar-grupo/page.tsx
"use client";

import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check, Copy, Users } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [groupLink, setGroupLink] = useState('');
  const { toast } = useToast();

  const handleCreateGroup = () => {
    if (groupName.trim() && groupDescription.trim() && agreedToRules) {
      // Lógica de criação do grupo (simulada)
      const newLink = `${window.location.origin}/comunidade/grupos/${groupName.toLowerCase().replace(/\s+/g, '-')}`;
      setGroupLink(newLink);
      setIsCreated(true);
      toast({
        title: "Grupo criado com sucesso!",
        description: `O grupo "${groupName}" agora está ativo.`,
      });
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(groupLink);
    toast({
        title: "Link copiado!",
        description: "O link de convite foi copiado para a área de transferência.",
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Link href="/comunidade" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Comunidade
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary flex items-center gap-3">
                        <Users className="h-8 w-8" />
                        Criar Novo Grupo
                    </CardTitle>
                    <CardDescription>
                        Preencha as informações abaixo para criar um novo espaço de conversa na comunidade.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isCreated ? (
                        <div className="text-center p-8 border-dashed border-2 rounded-lg bg-primary/5">
                            <Check className="mx-auto h-16 w-16 text-green-500 mb-4 bg-green-100 rounded-full p-2" />
                            <h2 className="text-2xl font-semibold mb-2">Grupo Criado com Sucesso!</h2>
                            <p className="text-muted-foreground mb-6">O grupo "{groupName}" está pronto. Convide outras pessoas para participar!</p>
                            <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
                                <Input value={groupLink} readOnly className="flex-1 bg-transparent border-0" />
                                <Button size="icon" onClick={handleCopyLink}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                             <Button asChild className="mt-6">
                                <Link href="/comunidade/meus-grupos">Ir para Meus Grupos</Link>
                            </Button>
                        </div>
                    ) : (
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="group-name">Nome do Grupo</Label>
                                <Input 
                                    id="group-name" 
                                    placeholder="Ex: Dicas de Terapia Ocupacional em Casa" 
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group-description">Descrição</Label>
                                <Textarea 
                                    id="group-description" 
                                    placeholder="Descreva o objetivo do grupo. Qual é o tópico principal? Para quem ele se destina?"
                                    className="min-h-[100px]"
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                />
                            </div>
                             <div className="items-top flex space-x-2">
                                <Checkbox 
                                    id="terms1" 
                                    checked={agreedToRules}
                                    onCheckedChange={(checked) => setAgreedToRules(Boolean(checked))}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                    Entendo e concordo com os regulamentos
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                    Você leu e concorda com as <Link href="/termos-de-servico" className="text-primary hover:underline">regras da comunidade</Link> para criação de grupos.
                                    </p>
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                className="w-full" 
                                disabled={!groupName.trim() || !groupDescription.trim() || !agreedToRules}
                                onClick={handleCreateGroup}
                            >
                                Criar Grupo
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
