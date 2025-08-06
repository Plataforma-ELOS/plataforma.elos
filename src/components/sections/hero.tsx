import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full pt-12 pb-20 md:pb-24 lg:pb-32 bg-gradient-to-b from-background to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground font-headline">
              Cuidar de alguém começa por cuidar de si.
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
              Cuidar é ajudar quem você ama a viver melhor. Aqui, você encontra recursos, comunidade e profissionais que entendem sua jornada.
            </p>
          </div>
          <div className="flex items-center justify-center relative">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Ilustração acolhedora"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover shadow-2xl shadow-primary/20"
              data-ai-hint="family support"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
