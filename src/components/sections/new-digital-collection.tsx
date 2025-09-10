
import { Card } from '@/components/ui/card';
import { ArrowRight, BookOpen, MessageSquareHeart, Sparkles } from 'lucide-react';
import Link from 'next/link';

const collectionItems = [
  { 
    icon: <MessageSquareHeart className="h-8 w-8 text-primary" />, 
    title: 'Conecte-se na Comunidade', 
    description: 'Um espaço seguro para compartilhar vitórias, desafios e encontrar apoio mútuo.',
    href: '/comunidade',
  },
  { 
    icon: <Sparkles className="h-8 w-8 text-primary" />, 
    title: 'Tire suas dúvidas com a IA',
    description: 'Receba orientações claras sobre direitos, laudos e o BPC de forma instantânea.',
    href: '/suporte-ia',
  },
  { 
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Explore o Acervo Digital', 
    description: 'Acesse nossa biblioteca com palestras, artigos e materiais selecionados por especialistas.',
    href: '/acervo-digital',
  },
];

export default function NewDigitalCollection() {
  return (
    <section className="w-full py-20 md:py-24 bg-primary/10 dark:bg-primary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Recursos feitos para você
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-foreground/80 md:text-xl">
            Ferramentas e espaços pensados para fortalecer sua jornada de cuidado.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {collectionItems.map((item, index) => (
            <Card key={index} className="group overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col p-8 aspect-square justify-between">
                <div className="bg-primary/10 p-3 rounded-xl mb-4 self-start">
                    {item.icon}
                </div>
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-card-foreground">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 flex-grow">{item.description}</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <Link href={item.href}>
                        <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
