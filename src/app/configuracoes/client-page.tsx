// src/app/configuracoes/client-page.tsx
"use client";

import { useContext, useState } from 'react';
import { useTheme } from 'next-themes';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings, Sun, Moon, CaseLower, CaseSensitive, CaseUpper, Bell, Lock } from 'lucide-react';
import { FontSizeContext } from '@/components/common/providers';
import { useToast } from '@/hooks/use-toast';
import { atualizarPreferencias } from '@/app/actions/profile';

type SettingsPageClientProps = {
  notifyEmail: boolean;
  notifyPush: boolean;
  profilePublic: boolean;
};

export default function SettingsPageClient({ notifyEmail, notifyPush, profilePublic }: SettingsPageClientProps) {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const { toast } = useToast();

  const [prefs, setPrefs] = useState({ notifyEmail, notifyPush, profilePublic });

  const salvarPreferencia = async (novo: typeof prefs) => {
    const anterior = prefs;
    setPrefs(novo);
    const { ok, erro } = await atualizarPreferencias(novo.notifyEmail, novo.notifyPush, novo.profilePublic);
    if (!ok) {
      setPrefs(anterior);
      toast({ variant: 'destructive', title: 'Não foi possível salvar', description: erro });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Settings className="h-6 w-6 text-primary-strong" />
              </div>
              <h1 className="text-3xl font-bold font-headline">Configurações</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Ajuste o tema e o tamanho do texto da plataforma.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Claro
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Escuro
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tamanho do texto</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={fontSize === 'sm' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setFontSize('sm')}
                    >
                      <CaseLower className="mr-2 h-4 w-4" />
                      Pequeno
                    </Button>
                    <Button
                      variant={fontSize === 'base' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setFontSize('base')}
                    >
                      <CaseSensitive className="mr-2 h-4 w-4" />
                      Normal
                    </Button>
                    <Button
                      variant={fontSize === 'lg' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setFontSize('lg')}
                    >
                      <CaseUpper className="mr-2 h-4 w-4" />
                      Grande
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>Escolha como você quer ser avisado sobre novidades.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-email" className="font-normal">Receber por e-mail</Label>
                  <Switch
                    id="notify-email"
                    checked={prefs.notifyEmail}
                    onCheckedChange={(checked) => salvarPreferencia({ ...prefs, notifyEmail: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-push" className="font-normal">Notificações no navegador</Label>
                  <Switch
                    id="notify-push"
                    checked={prefs.notifyPush}
                    onCheckedChange={(checked) => salvarPreferencia({ ...prefs, notifyPush: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacidade
                </CardTitle>
                <CardDescription>Controle a visibilidade do seu perfil para outros membros.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-public" className="font-normal">Perfil visível para a comunidade</Label>
                  <Switch
                    id="profile-public"
                    checked={prefs.profilePublic}
                    onCheckedChange={(checked) => salvarPreferencia({ ...prefs, profilePublic: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
