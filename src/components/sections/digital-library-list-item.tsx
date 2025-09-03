// src/components/sections/digital-library-list-item.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Bookmark, PlayCircle } from 'lucide-react';
import FeatureInProgress from '../feature-in-progress';

type LibraryItem = {
  type: 'video' | 'document';
  imageUrl?: string;
  imageHint?: string;
  icon?: string;
  title: string;
  author: string;
  avatarUrl: string;
  avatarHint: string;
  date: string;
  tags: string[];
  actionText: string;
  actionUrl: string;
  downloadable?: boolean;
};

type DigitalLibraryListItemProps = {
  item: LibraryItem;
};

export default function DigitalLibraryListItem({ item }: DigitalLibraryListItemProps) {
  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-48 flex-shrink-0">
          {item.type === 'video' && item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={300}
              height={160}
              className="object-cover w-full h-auto rounded-md aspect-video"
              data-ai-hint={item.imageHint}
            />
          ) : (
            <div className="h-32 sm:h-full bg-muted flex items-center justify-center rounded-md">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-grow w-full">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span className="capitalize flex items-center gap-1">
             {item.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
             {item.type === 'video' ? 'Vídeo' : 'Documento'}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.avatarUrl} alt={item.author} data-ai-hint={item.avatarHint} />
              <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{item.author} &middot; {item.date}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal border-accent text-accent-foreground">{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="flex sm:flex-col lg:flex-row gap-2 self-start sm:self-center ml-auto flex-shrink-0">
          <Button asChild className="w-full lg:w-auto">
            <Link href={item.actionUrl} target="_blank">
              {item.actionText}
            </Link>
          </Button>
          <FeatureInProgress>
            <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Favoritar</span>
            </Button>
          </FeatureInProgress>
        </div>
      </CardContent>
    </Card>
  );
}
