"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const professionals = [
  { name: 'Dra. Cristiane', href:"/profissionais/dra-cristiane", imageUrl: 'https://placehold.co/128x128.png', hint: 'woman doctor' },
  { name: 'Dr. Fernando', href:"/profissionais/dr-fernando", imageUrl: 'https://placehold.co/128x128.png', hint: 'man doctor' },
  { name: 'Dra. Beatriz', href:"/profissionais/dra-beatriz", imageUrl: 'https://placehold.co/128x128.png', hint: 'woman psychologist' },
  { name: 'Dr. Ricardo', href:"/profissionais/dr-ricardo", imageUrl: 'https://placehold.co/128x128.png', hint: 'man therapist' },
];

export default function Professionals() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Profissionais capacitados e avaliados</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {professionals.map((prof, index) => (
            <Link href={prof.href} key={index} className="group">
                <Card className="flex flex-col items-center p-6 border-0 shadow-none bg-transparent">
                    <Image
                      src={prof.imageUrl}
                      alt={`Foto de ${prof.name}`}
                      width={128}
                      height={128}
                      className="rounded-full object-cover mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-110"
                      data-ai-hint={prof.hint}
                    />
                    <CardContent className="text-center p-0">
                      <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {prof.name}
                      </h4>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}