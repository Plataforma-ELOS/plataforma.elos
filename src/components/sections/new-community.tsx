// src/components/sections/new-community.tsx
import { Check } from "lucide-react";

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
    <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">O seu lugar ideal</h2>
            <ul className="space-y-6">
              {communityPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
          </div>
           <div className="flex items-center justify-center relative">
            <svg
              className="w-full h-auto max-w-lg"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              id="blobSvg"
            >
              <defs>
                <linearGradient id="gradient-community" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.3 }}></stop>
                  <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 0.3 }}></stop>
                </linearGradient>
              </defs>
              <path
                d="M443.5,296.5Q437,343,405,372Q373,401,338,411.5Q303,422,276.5,431Q250,440,219,436Q188,432,152.5,423.5Q117,415,82.5,392.5Q48,370,51,335Q54,300,38.5,275Q23,250,40,224.5Q57,199,65,168.5Q73,138,98,114.5Q123,91,152,81Q181,71,215.5,60.5Q250,50,277.5,65.5Q305,81,341,89.5Q377,98,397.5,125.5Q418,153,429.5,186Q441,219,444,257.5Q447,296,443.5,296.5Z"
                fill="url(#gradient-community)"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
