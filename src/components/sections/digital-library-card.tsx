
// src/components/sections/digital-library-card.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, PlayCircle, Bookmark } from 'lucide-react';
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

type DigitalLibraryCardProps = {
  item: LibraryItem;
};

export default function DigitalLibraryCard({ item }: DigitalLibraryCardProps) {
  return (
    <Card className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full border animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative">
          {item.type === 'video' && item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={600}
              height={400}
              className="object-cover w-full h-48"
              data-ai-hint={item.imageHint}
            />
          ) : (
            <div className="h-48 bg-muted flex items-center justify-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
           <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full capitalize flex items-center gap-1">
             {item.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            <span>{item.type === 'video' ? 'Vídeo' : 'Documento'}</span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-base mb-2 flex-grow">{item.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.avatarUrl} alt={item.author} data-ai-hint={item.avatarHint} />
              <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{item.author} &middot; {item.date}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
        </div>
         <div className="p-4 pt-0 mt-auto">
             <div className='flex gap-2'>
                <Button asChild className="w-full">
                  <Link href={item.actionUrl} target="_blank">
                    {item.actionText}
                  </Link>
                </Button>
                <FeatureInProgress>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </FeatureInProgress>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
