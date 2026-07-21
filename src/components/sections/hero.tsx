"use client";

export default function Hero() {
  return (
    /* Reduzimos o padding superior (pt-12 md:pt-16) para o texto subir */
    <section className="relative w-full pt-12 md:pt-16 pb-16 md:pb-20 bg-gradient-to-b from-background to-primary/10 dark:to-primary/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 z-10 flex flex-col items-center justify-center">
        
        {/* Container do texto 100% centralizado */}
        <div className="relative flex flex-col items-center justify-center space-y-6 text-center w-full max-w-4xl mx-auto z-10">
          <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Sua jornada de cuidado começa aqui.
          </span>
          
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground font-headline">
            Cuidar de alguém <br />
            começa por cuidar de si.
          </h1>
          
          <p className="max-w-3xl text-foreground/80 md:text-xl mx-auto leading-relaxed">
            Cuidar é ajudar quem você ama a viver melhor. Aqui, você encontra recursos, <br className="hidden sm:inline" />
            comunidade e profissionais que entendem sua jornada.
          </p>
        </div>

      </div>
    </section>
  );
}