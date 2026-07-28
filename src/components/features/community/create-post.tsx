
"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCircle, Image as ImageIcon, X } from "lucide-react";
import { AuthContext } from "@/components/common/providers";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

const TAMANHO_MAXIMO_IMAGEM = 2 * 1024 * 1024;

interface CreatePostProps {
  onCreatePost: (content: string, imageUrl?: string) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const previewImage = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      toast({ variant: 'destructive', title: 'Imagem muito grande', description: 'Escolha uma imagem de até 2MB.' });
      return;
    }
    setImageFile(arquivo);
  };

  const handlePublish = async () => {
    if (!user) return;
    setEnviando(true);

    let imageUrl: string | undefined;
    if (imageFile) {
      const supabase = createClient();
      const extensao = imageFile.name.split('.').pop();
      const caminho = `${user.id}/${crypto.randomUUID()}.${extensao}`;
      const { error: erroUpload } = await supabase.storage.from('posts').upload(caminho, imageFile);
      if (erroUpload) {
        setEnviando(false);
        toast({ variant: 'destructive', title: 'Não foi possível enviar a imagem', description: erroUpload.message });
        return;
      }
      imageUrl = supabase.storage.from('posts').getPublicUrl(caminho).data.publicUrl;
    }

    onCreatePost(postContent, imageUrl);
    setPostContent('');
    setImageFile(null);
    setEnviando(false);
  };

  return (
    <div className="bg-card p-4 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 border">
      <div className="flex gap-4">
        <Avatar className="hidden md:inline-flex h-12 w-12 cursor-pointer">
          <AvatarImage src="https://placehold.co/48x48.png" alt="Avatar" data-ai-hint="user avatar" />
          <AvatarFallback>
            <UserCircle className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Textarea
            placeholder="No que você está pensando?"
            className="w-full bg-muted border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary mb-2"
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          {previewImage && (
            <div className="relative mb-2 inline-block">
              <Image src={previewImage} alt="Prévia da imagem" width={120} height={120} className="rounded-lg object-cover h-24 w-24" unoptimized />
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow"
                aria-label="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="post-image-file" className="inline-flex">
                <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
                  <span>
                    <ImageIcon className="h-5 w-5" />
                  </span>
                </Button>
              </Label>
              <Input id="post-image-file" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageSelected} />
            </div>
            <Button onClick={handlePublish} disabled={!postContent.trim() || enviando}>
              {enviando ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
