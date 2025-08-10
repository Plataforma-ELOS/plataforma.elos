
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, HeartHandshake, ClipboardList } from 'lucide-react';
import FeatureInProgress from '@/components/feature-in-progress';

const features = [
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: 'Aprendizado',
    description: 'Materiais sensoriais, jogos e cursos práticos.',
  },
  {
    icon: <HeartHandshake className="h-10 w-10 text-primary" />,
    title: 'Conexão',
    description: 'Rede de cuidadores e profissionais avaliados.',
  },
  {
    icon: <ClipboardList className="h-10 w-10 text-primary" />,
    title: 'Organização',
    description: 'Ferramentas para planejar e acompanhar seu dia a dia.',
  },
];

export default function Features() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">O que você encontra aqui?</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-full mb-4 inline-flex">
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
