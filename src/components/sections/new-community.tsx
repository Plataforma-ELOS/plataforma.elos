
"use client";

import { Button } from "@/components/ui/button";
import { Check, Star, UserCircle } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const communityPoints = [
  {
    title: 'Conexões que Acolhem',
    text: 'Encontre e converse com outros cuidadores que entendem sua realidade, em um ambiente seguro e sem julgamentos.',
  },
  {
    title: 'Informação Confiável',
    text: 'Acesse um acervo de materiais selecionados e uma lista de profissionais avaliados, tudo em um só lugar.',
  },
  {
    title: 'Ferramentas que Capacitam',
    text: 'Desde um assistente com IA para tirar dúvidas sobre direitos até recursos práticos para o dia a dia.',
  },
];

const testimonials = [
  {
    name: 'Ana P.',
    avatar: 'https://placehold.co/48x48.png',
    hint: 'woman portrait',
    text: 'Encontrei na Plataforma E.L.O.S um porto seguro. A comunidade é incrível e os recursos me ajudaram a entender e garantir os direitos do meu filho.'
  },
  {
    name: 'João M.',
    avatar: 'https://placehold.co/48x48.png',
    hint: 'man portrait',
    text: 'A ferramenta de IA para tirar dúvidas jurídicas é simplesmente revolucionária. Economizei tempo e obtive informações claras e diretas. Recomendo!'
  },
  {
    name: 'Carla F.',
    avatar: 'https://placehold.co/48x48.png',
    hint: 'woman smiling',
    text: 'O acervo digital é fantástico! Encontrei atividades, guias e vídeos que fizeram toda a diferença no desenvolvimento da minha filha. Sou muito grata!'
  },
  {
    name: 'Marcos R.',
    avatar: 'https://placehold.co/48x48.png',
    hint: 'man smiling',
    text: 'Finalmente um lugar onde me sinto compreendido. Trocar experiências com outros cuidadores que passam pelo mesmo que eu não tem preço.'
  },
]

export default function NewCommunity() {
  return (
    <section className="w-full py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">O seu lugar ideal</h2>
            </div>
            <ul className="space-y-8">
              {communityPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg">
                      <Check className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{point.title}</h3>
                    <p className="text-muted-foreground mt-1">{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>
             <div className="pt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                        Veja o que dizem sobre nós
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl bg-card border-primary/20 p-8 sm:p-10">
                      <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-center mb-4 font-headline">Depoimentos da nossa comunidade</DialogTitle>
                      </DialogHeader>
                      <div className="relative px-8">
                          <Carousel
                            opts={{ align: "start", loop: true, }}
                            plugins={[
                              Autoplay({ delay: 4000, stopOnInteraction: true, playOnInit: true }),
                            ]}
                            className="w-full"
                          >
                            <CarouselContent>
                              {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                  <div className="text-center flex flex-col items-center justify-between min-h-[16rem]">
                                    <div className="w-full flex items-center gap-3">
                                      <Avatar className="h-10 w-10">
                                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                                          <AvatarFallback>
                                              <UserCircle className="h-10 w-10 text-muted-foreground" />
                                          </AvatarFallback>
                                      </Avatar>
                                      <h4 className="font-bold text-base">{testimonial.name}</h4>
                                    </div>
                                    <p className="text-lg text-muted-foreground italic text-center max-w-md mx-auto pt-8 flex-grow flex items-center">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex text-yellow-400 gap-1 mt-4">
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-[-16px] sm:left-[-24px] top-1/2 -translate-y-1/2 z-10 bg-background/50 border-none text-foreground/50 hover:text-foreground/90 h-10 w-10" />
                            <CarouselNext className="absolute right-[-16px] sm:right-[-24px] top-1/2 -translate-y-1/2 z-10 bg-background/50 border-none text-foreground/50 hover:text-foreground/90 h-10 w-10" />
                          </Carousel>
                      </div>
                  </DialogContent>
                </Dialog>
            </div>
          </div>
           <div className="relative flex items-center justify-center min-h-[500px]">
              <div
              className="absolute w-full h-full"
              style={{
                clipPath: 'path("M443.5,296.5Q437,343,405,372Q373,401,338,411.5Q303,422,276.5,431Q250,440,219,436Q188,432,152.5,423.5Q117,415,82.5,392.5Q48,370,51,335Q54,300,38.5,275Q23,250,40,224.5Q57,199,65,168.5Q73,138,98,114.5Q123,91,152,81Q181,71,215.5,60.5Q250,50,277.5,65.5Q305,81,341,89.5Q377,98,397.5,125.5Q418,153,429.5,186Q441,219,444,257.5Q447,296,443.5,296.5Z")',
              }}
            >
               <Image
                src="https://i.ibb.co/Kz0yn5b/O-seu-lugar-ideal.png"
                alt="Comunidade unida"
                width={800}
                height={800}
                data-ai-hint="community people"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
