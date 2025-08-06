export default function Stats() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center space-y-8">
           <div className="flex flex-col sm:flex-row items-baseline justify-center gap-x-12 gap-y-4">
              <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-primary tracking-tighter">2,5%</div>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-accent">6 milhões</h3>
           </div>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Cerca de 6 milhões de brasileiros vivem com TEA, mas apenas 2,5% têm acesso a tratamento de qualidade.
          </p>
        </div>
      </div>
    </section>
  );
}
