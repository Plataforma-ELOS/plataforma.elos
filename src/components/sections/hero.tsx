import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full py-20 md:py-24 bg-gradient-to-b from-background to-primary/10 dark:to-primary/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">Sua jornada de cuidado começa aqui.</span>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground font-headline">
              Cuidar de alguém começa por cuidar de si.
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
              Cuidar é ajudar quem você ama a viver melhor. Aqui, você encontra recursos, comunidade e profissionais que entendem sua jornada.
            </p>
          </div>
          <div className="relative flex items-center justify-end min-h-[500px]">
            <div
              className="absolute w-full h-full"
              style={{
                clipPath: 'path("M449,278Q429,306,420.5,338.5Q412,371,385,389Q358,407,329,417Q300,427,275,441Q250,455,219.5,450.5Q189,446,165,426Q141,406,104,396Q67,386,52,357Q37,328,48,299.5Q59,271,46,242Q33,213,42,183.5Q51,154,82,136.5Q113,119,136,98.5Q159,78,187.5,69Q216,60,245.5,50.5Q275,41,302,56.5Q329,72,360,82.5Q391,93,412.5,119.5Q434,146,444,179.5Q454,213,456.5,244Q459,275,449,278Z")',
              }}
            >
              <Image
                src="https://i.ibb.co/nszMMxbm/Screenshot-2025-09-09-07-38-39.png"
                alt="Mãos segurando outras em um gesto de cuidado e apoio"
                width={800}
                height={800}
                data-ai-hint="caring hands"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}