import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

const communityPoints = [
  {
    title: 'Título primeiro',
    text: 'Texto primeiro',
  },
  {
    title: 'Título segundo',
    text: 'Texto segundo',
  },
  {
    title: 'Título terceiro',
    text: 'Texto terceiro',
  },
];

export default function NewCommunity() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-white">
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
                <Button variant="secondary" size="lg" className="rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                    Veja o que dizem sobre nós
                </Button>
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
                src="https://placehold.co/800x800.png"
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
