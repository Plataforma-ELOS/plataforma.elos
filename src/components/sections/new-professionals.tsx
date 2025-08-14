
import Image from 'next/image';

const professionals = [
  { name: 'Dra. Cristiane', role: 'Psiquiatra', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman doctor portrait' },
  { name: 'Dr. Fernando', role: 'Acompanhante terapêutico', imageUrl: 'https://placehold.co/200x200.png', hint: 'man therapist portrait' },
  { name: 'Dra. Vera', role: 'Psicopedagoga', imageUrl: 'https://placehold.co/200x200.png', hint: 'woman teacher portrait' },
];

export default function NewProfessionals() {
  return (
    <section className="w-full relative py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Profissionais de segurança
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-foreground/80 md:text-xl">
            Onde o cuidado é valorizado e mantido.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16">
          {professionals.map((prof, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Image
                  src={prof.imageUrl}
                  alt={`Foto de ${prof.name}`}
                  width={200}
                  height={200}
                  className="rounded-full object-cover ring-8 ring-background"
                  data-ai-hint={prof.hint}
                />
              </div>
              <h3 className="text-xl font-bold">{prof.name}</h3>
              <p className="text-muted-foreground">{prof.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
