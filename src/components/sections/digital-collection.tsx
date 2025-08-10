import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';

const collectionItems = [
  { type: 'Vídeo', title: 'Entendendo a sobrecarga sensorial', imageUrl: 'https://placehold.co/400x225.png', hint: 'child playing' },
  { type: 'Jogo', title: 'Jogo das Emoções', imageUrl: 'https://placehold.co/400x225.png', hint: 'kids emotions' },
  { type: 'Documento', title: 'Guia de Rotinas Visuais', imageUrl: 'https://placehold.co/400x225.png', hint: 'planner schedule' },
];

export default function DigitalCollection() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Acervo Digital</h2>
          <p className="max-w-[700px] text-foreground/80 md:text-xl">
            Explore nossa biblioteca de recursos cuidadosamente selecionados para apoiar sua jornada.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionItems.map((item, index) => (
            <Link key={index} href="/acervo-digital" className="group">
              <Card className="overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 group h-full">
                <div className="relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={400}
                    height={225}
                    className="w-full h-auto object-cover"
                    data-ai-hint={item.hint}
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                  <Badge className="absolute top-3 right-3 bg-primary/80 text-primary-foreground" variant="default">{item.type}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
            <Button size="lg" className="rounded-full px-8 transition-transform duration-300 ease-out hover:scale-105" asChild>
                <Link href="/acervo-digital">Ver acervo completo</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
