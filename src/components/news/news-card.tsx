// src/components/news/news-card.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

type Article = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  date: string;
};

type NewsCardProps = {
  article: Article;
  index: number;
};

export default function NewsCard({ article, index }: NewsCardProps) {
  return (
    <Link href={`/noticias/${article.slug}`} className="group block">
      <Card 
        className="overflow-hidden rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border-border/60 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: `${index * 100}ms`}}
      >
        <div className="relative">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={600}
            height={400}
            className="w-full h-56 object-cover"
            data-ai-hint={article.imageHint}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <Badge variant="secondary" className="mb-2 self-start">{article.category}</Badge>
          <h3 className="text-xl font-bold mb-2 flex-grow group-hover:text-primary transition-colors">{article.title}</h3>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground">{article.date}</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
