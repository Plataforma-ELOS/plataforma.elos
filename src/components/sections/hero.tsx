import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-gradient-to-b from-background to-white overflow-hidden">
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
          <div className="relative flex items-center justify-center min-h-[400px]">
            <svg
              className="absolute w-full h-full opacity-30 top-4 left-4"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              id="blobSvgShadow"
            >
              <defs>
                <linearGradient id="gradient-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "hsl(var(--primary) / 0.8)" }}></stop>
                  <stop offset="100%" style={{ stopColor: "hsl(var(--secondary) / 0.8)" }}></stop>
                </linearGradient>
              </defs>
              <path
                d="M449,278Q429,306,420.5,338.5Q412,371,385,389Q358,407,329,417Q300,427,275,441Q250,455,219.5,450.5Q189,446,165,426Q141,406,104,396Q67,386,52,357Q37,328,48,299.5Q59,271,46,242Q33,213,42,183.5Q51,154,82,136.5Q113,119,136,98.5Q159,78,187.5,69Q216,60,245.5,50.5Q275,41,302,56.5Q329,72,360,82.5Q391,93,412.5,119.5Q434,146,444,179.5Q454,213,456.5,244Q459,275,449,278Z"
                fill="url(#gradient-shadow)"
              ></path>
            </svg>
            <div
              className="absolute w-full h-full"
              style={{
                clipPath: 'path("M449,278Q429,306,420.5,338.5Q412,371,385,389Q358,407,329,417Q300,427,275,441Q250,455,219.5,450.5Q189,446,165,426Q141,406,104,396Q67,386,52,357Q37,328,48,299.5Q59,271,46,242Q33,213,42,183.5Q51,154,82,136.5Q113,119,136,98.5Q159,78,187.5,69Q216,60,245.5,50.5Q275,41,302,56.5Q329,72,360,82.5Q391,93,412.5,119.5Q434,146,444,179.5Q454,213,456.5,244Q459,275,449,278Z")',
              }}
            >
              <Image
                src="https://placehold.co/600x600.png"
                alt="Cuidadora e criança sorrindo"
                width={600}
                height={600}
                data-ai-hint="mother child"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
