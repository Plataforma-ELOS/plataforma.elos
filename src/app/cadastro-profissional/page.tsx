
// src/app/cadastro-profissional/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useContext, useEffect } from 'react';
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
import { CheckCircle, ArrowLeft, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { inscreverProfissional } from '@/app/actions/professional-signup';
import { AuthContext } from '@/components/common/providers';
import { createClient } from '@/lib/supabase/client';
import { ESPECIALIDADES } from '@/lib/data/specialties';

const TAMANHO_MAXIMO_FOTO = 2 * 1024 * 1024;

const MAX_WORDS = 200;
const OUTRA_ESPECIALIDADE = 'Outro';

export default function ProfessionalSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [experienceText, setExperienceText] = useState('');
  const [registrationType, setRegistrationType] = useState<'liberal' | 'clinic_professional' | 'clinic'>('liberal');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [specialty, setSpecialty] = useState('');
  const [customSpecialty, setCustomSpecialty] = useState('');

  const previewPhoto = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : null), [photoFile]);
  useEffect(() => {
    return () => {
      if (previewPhoto) URL.revokeObjectURL(previewPhoto);
    };
  }, [previewPhoto]);

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAXIMO_FOTO) {
      toast({ variant: 'destructive', title: 'Imagem muito grande', description: 'Escolha uma imagem de até 2MB.' });
      return;
    }
    setPhotoFile(arquivo);
  };

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    const truncated = numericValue.slice(0, 7);
    e.target.value = truncated;
    setRegistrationNumber(truncated);
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

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registrationType !== 'clinic' && registrationNumber.length !== 7) {
      toast({
        variant: 'destructive',
        title: 'Registro inválido',
        description: 'O número do registro profissional deve ter exatamente 7 dígitos.',
      });
      return;
    }

    const especialidadeFinal =
      registrationType === 'clinic'
        ? specialty.trim()
        : specialty === OUTRA_ESPECIALIDADE
          ? customSpecialty.trim()
          : specialty;

    if (!especialidadeFinal) {
      toast({
        variant: 'destructive',
        title: 'Especialidade obrigatória',
        description:
          registrationType === 'clinic'
            ? 'Informe a especialidade/área de atuação da clínica.'
            : 'Selecione uma especialidade.',
      });
      return;
    }

    setEnviando(true);
    try {
      let imageUrl: string | undefined;
      if (photoFile && user) {
        const supabase = createClient();
        const extensao = photoFile.name.split('.').pop();
        const caminho = `${user.id}/${crypto.randomUUID()}.${extensao}`;
        const { error: erroUpload } = await supabase.storage.from('professionals').upload(caminho, photoFile);
        if (erroUpload) {
          toast({ variant: 'destructive', title: 'Não foi possível enviar a foto', description: erroUpload.message });
          return;
        }
        imageUrl = supabase.storage.from('professionals').getPublicUrl(caminho).data.publicUrl;
      }

      const { ok, erro } = await inscreverProfissional({
        fullName,
        email,
        registrationType,
        cnpj,
        registrationNumber,
        specialty: especialidadeFinal,
        experience: experienceText,
        imageUrl,
      });

      if (!ok) {
        toast({ variant: 'destructive', title: 'Não foi possível enviar', description: erro });
        return;
      }

      setIsSubmitted(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in-0 slide-in-from-top-4 slide-in-from-left-4 duration-500">
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
      </AlertDialogContent>
      </AlertDialog>
      
      <div className="w-full max-w-5xl bg-background shadow-2xl rounded-2xl grid lg:grid-cols-2">

        {/* Coluna da Esquerda (Formulário) */}
        <div className="flex flex-col justify-center p-8 sm:p-12 relative">
            <Link href="/cadastro" className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="mx-auto grid w-full max-w-md gap-8 mt-16 lg:mt-0">
                <div className="grid gap-4 text-center">
                    <Link href="/home" className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Image src="https://i.ibb.co/Sw75Xd7Q/Chat-GPT-Image-6-de-set-de-2025-17-17-42-20250911-063055-0000-removebg-preview.png" alt="Logo Elos" width={40} height={40} className="rounded-full" data-ai-hint="logo" />
                        <span className="text-foreground">Plataforma</span>
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">E.L.O.S</span>
                    </Link>
                    <h1 className="text-3xl font-bold mt-4">Cadastro Profissional</h1>
                    <p className="text-balance text-muted-foreground">
                        Submeta sua inscrição para participar do time de perfis profissionais da plataforma E.L.O.S.
                    </p>
                </div>
                <form className="grid gap-6" onSubmit={handleProfessionalSubmit}>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          {previewPhoto ? (
                            <Image src={previewPhoto} alt="Prévia da foto" width={80} height={80} className="h-full w-full object-cover" unoptimized />
                          ) : (
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <Label htmlFor="prof-photo-file" className="inline-flex items-center gap-2 text-sm text-primary-strong cursor-pointer hover:underline">
                          <Camera className="h-4 w-4" />
                          Adicionar foto (opcional)
                        </Label>
                        <Input id="prof-photo-file" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePhotoSelected} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="prof-full-name">Nome Completo</Label>
                        <Input id="prof-full-name" placeholder="Seu nome ou nome da clínica" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="prof-email">Email</Label>
                        <Input id="prof-email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="registration-type">Tipo de Cadastro</Label>
                        <Select onValueChange={(value) => setRegistrationType(value as typeof registrationType)} defaultValue="liberal">
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

                    {registrationType === 'clinic' ? (
                      <div className="grid gap-2">
                        <Label htmlFor="specialty">Especialidade/Área de Atuação</Label>
                        <Input
                          id="specialty"
                          placeholder="Ex: Neurodesenvolvimento, Multidisciplinar..."
                          required
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="specialty">Especialidade</Label>
                        <Select value={specialty} onValueChange={setSpecialty}>
                          <SelectTrigger id="specialty">
                            <SelectValue placeholder="Selecione sua especialidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {ESPECIALIDADES.map((especialidade) => (
                              <SelectItem key={especialidade} value={especialidade}>
                                {especialidade}
                              </SelectItem>
                            ))}
                            <SelectItem value={OUTRA_ESPECIALIDADE}>Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        {specialty === OUTRA_ESPECIALIDADE && (
                          <Input
                            id="specialty-custom"
                            placeholder="Qual especialidade?"
                            required
                            value={customSpecialty}
                            onChange={(e) => setCustomSpecialty(e.target.value)}
                          />
                        )}
                      </div>
                    )}

                    <div className={cn('grid gap-2 transition-opacity duration-300', registrationType === 'clinic' ? 'opacity-100' : 'opacity-50 pointer-events-none')}>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" placeholder="00.000.000/0000-00" required={registrationType === 'clinic'} disabled={registrationType !== 'clinic'} value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                    </div>

                    <div className={cn('grid gap-2 transition-opacity duration-300', registrationType === 'clinic' ? 'opacity-50 pointer-events-none' : 'opacity-100')}>
                        <Label htmlFor="professional-id">Número do Registro Profissional (exatamente 7 dígitos)</Label>
                        <Input id="professional-id" placeholder="Ex: 1234567" required={registrationType !== 'clinic'} disabled={registrationType === 'clinic'} onChange={handleNumericInput} value={registrationNumber} maxLength={7} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="experience">Compartilhe um pouco de sua experiência</Label>
                        <Textarea id="experience" placeholder="Descreva sua especialidade, abordagem e experiência com TEA." required value={experienceText} onChange={handleExperienceChange} className="min-h-[120px]" />
                        <p className="text-sm text-muted-foreground text-right">{wordCount}/{MAX_WORDS} palavras</p>
                    </div>
                    <Button type="submit" className="w-full rounded-full" size="lg" disabled={enviando}>
                      {enviando ? 'Enviando...' : 'Enviar Inscrição'}
                    </Button>
                </form>
            </div>
        </div>

        {/* Coluna da Direita (Imagem) */}
        <div className="hidden lg:flex items-center justify-center p-6 bg-background">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Image"
            width="1920"
            height="1080"
            data-ai-hint="doctor consulting"
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

    