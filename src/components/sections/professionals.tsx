import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const professionals = [
  { name: 'Dra. Cristiane', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman doctor' },
  { name: 'Dr. Fernando', imageUrl: 'https://placehold.co/128x128.png', hint: 'man doctor' },
  { name: 'Dra. Beatriz', imageUrl: 'https://placehold.co/128x128.png', hint: 'woman psychologist' },
  { name: 'Dr. Ricardo', imageUrl: 'https://placehold.co/128x128.png', hint: 'man therapist' },
];

export default function Professionals() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Profissionais capacitados e avaliados</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {professionals.map((prof, index) => (
            <Card key={index} className="flex flex-col items-center p-6 border-0 shadow-none bg-transparent transition-transform transform hover:-translate-y-2">
              <Image
                src={prof.imageUrl}
                alt={`Foto de ${prof.name}`}
                width={128}
                height={128}
                className="rounded-full object-cover mb-4 ring-4 ring-primary/20 hover:ring-primary/40 transition-all"
                data-ai-hint={prof.hint}
              />
              <CardContent className="text-center p-0">
                <h4 className="text-lg font-semibold">{prof.name}</h4>
                <Button asChild variant="link" className="text-primary p-0 h-auto">
                  <Link href="#">Ver perfil</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
