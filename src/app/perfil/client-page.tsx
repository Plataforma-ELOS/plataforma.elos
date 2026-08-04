// src/app/perfil/client-page.tsx
"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Bookmark, Settings, Users, Edit, HeartHandshake, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { atualizarPerfil } from '@/app/actions/profile';
import { createClient } from '@/lib/supabase/client';

type ProfilePageClientProps = {
  userId: string;
  email: string;
  fullName: string;
  bio: string;
  avatarUrl?: string;
};

const TAMANHO_MAXIMO_AVATAR = 2 * 1024 * 1024;

export default function ProfilePageClient({ userId, email, fullName, bio, avatarUrl }: ProfilePageClientProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(fullName);
  const [bioTexto, setBioTexto] = useState(bio);
  const [avatarAtual, setAvatarAtual] = useState(avatarUrl);
  const [arquivoAvatar, setArquivoAvatar] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const previewAvatar = useMemo(() => (arquivoAvatar ? URL.createObjectURL(arquivoAvatar) : null), [arquivoAvatar]);
  useEffect(() => {
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  const handleArquivoSelecionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAXIMO_AVATAR) {
      toast({ variant: 'destructive', title: 'Imagem muito grande', description: 'Escolha uma imagem de até 2MB.' });
      return;
    }
    setArquivoAvatar(arquivo);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);
    try {
      let novoAvatarUrl: string | undefined;
      if (arquivoAvatar) {
        const supabase = createClient();
        const extensao = arquivoAvatar.name.split('.').pop();
        const caminho = `${userId}/${crypto.randomUUID()}.${extensao}`;
        const { error: erroUpload } = await supabase.storage.from('avatars').upload(caminho, arquivoAvatar, { upsert: true });
        if (erroUpload) {
          toast({ variant: 'destructive', title: 'Não foi possível enviar a imagem', description: erroUpload.message });
          return;
        }
        novoAvatarUrl = supabase.storage.from('avatars').getPublicUrl(caminho).data.publicUrl;
      }

      const { ok, erro } = await atualizarPerfil(nome, bioTexto, novoAvatarUrl);

      if (!ok) {
        toast({ variant: 'destructive', title: 'Não foi possível salvar', description: erro });
        return;
      }

      if (novoAvatarUrl) setAvatarAtual(novoAvatarUrl);
      setArquivoAvatar(null);
      toast({ title: 'Perfil atualizado com sucesso!' });
      setOpen(false);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarAtual ?? 'https://placehold.co/96x96.png'} alt={fullName} />
                  <AvatarFallback className="text-3xl">{fullName.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{fullName || 'Sem nome cadastrado'}</CardTitle>
                  <CardDescription>{email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  {bio || 'Você ainda não escreveu uma bio. Conte um pouco sobre você para a comunidade.'}
                </p>
                <div className="flex justify-center">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <Button onClick={() => setOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                        <DialogDescription>
                          Atualize seu nome e sua bio. Essas informações aparecem para outros membros da comunidade.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-col items-center gap-2">
                            <Avatar className="h-20 w-20">
                              <AvatarImage
                                src={previewAvatar ?? avatarAtual ?? 'https://placehold.co/96x96.png'}
                                alt={fullName}
                              />
                              <AvatarFallback className="text-2xl">{fullName.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                            </Avatar>
                            <Label htmlFor="avatar-file" className="inline-flex items-center gap-2 text-sm text-primary-strong cursor-pointer hover:underline">
                              <Camera className="h-4 w-4" />
                              Trocar foto
                            </Label>
                            <Input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleArquivoSelecionado} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Nome completo</Label>
                            <Input
                              id="full-name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              maxLength={120}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={bioTexto}
                              onChange={(e) => setBioTexto(e.target.value)}
                              maxLength={500}
                              rows={4}
                              placeholder="Conte um pouco sobre você..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                          </DialogClose>
                          <Button type="submit" disabled={salvando || nome.trim().length < 2}>
                            {salvando ? 'Salvando...' : 'Salvar alterações'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/salvos">
                <Card className="hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                  <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                    <Bookmark className="h-6 w-6 text-primary-strong" />
                    <span className="font-medium">Itens Salvos</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/configuracoes">
                <Card className="hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                  <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                    <Settings className="h-6 w-6 text-primary-strong" />
                    <span className="font-medium">Configurações</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/comunidade/meus-grupos">
                <Card className="hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                  <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                    <Users className="h-6 w-6 text-primary-strong" />
                    <span className="font-medium">Meus Grupos</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/meu-espaco">
                <Card className="hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                  <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                    <HeartHandshake className="h-6 w-6 text-primary-strong" />
                    <span className="font-medium">Meu Espaço</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
