import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, HelpCircle, Search, AppWindow } from 'lucide-react';

const supportCards = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Conheça seus direitos',
    description: 'Veja o que te lei garante e onde pedir.',
    href: '#',
  },
  {
    icon: <AppWindow className="h-8 w-8 text-primary" />,
    title: 'Seus benefícios',
    description: 'Programas e serviços que você pode acessar.',
    href: '#',
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: 'Perguntas frequentes',
    description: 'Talvez sua dúvida já tenha resposta aqui.',
    href: '#',
  },
];

export default function AiSupport() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
            Como podemos te ajudar hoje?
          </h1>
          <p className="max-w-[700px] text-foreground/80 md:text-xl">
            A ponte entre você e seus direitos, benefícios e próximos passos.
          </p>
          <div className="w-full max-w-2xl relative">
            <Input
              type="search"
              placeholder="Deixe sua dúvida aqui..."
              className="w-full h-14 pl-6 pr-14 rounded-full text-base"
            />
            <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-10 w-10">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
        </div>
        <div className="relative pt-16">
           <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 bg-white"
            style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 100%)',
                transform: 'translateX(-50%) perspective(100px) rotateX(4deg) scaleY(0.8)',
                opacity: '0.8'
            }}
          ></div>
           <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 bg-white/50"
             style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 100%)',
                transform: 'translateX(-50%) perspective(150px) rotateX(3deg) scaleY(0.7)',
                top: '-2rem',
                opacity: '0.6'
            }}
          ></div>
          <div className="grid gap-8 md:grid-cols-3 relative">
            {supportCards.map((card, index) => (
              <Card key={index} className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between">
                <div>
                  <CardHeader className="flex flex-col items-start gap-4 p-0">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {card.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-left">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 text-left">
                    <p className="text-foreground/80">{card.description}</p>
                  </CardContent>
                </div>
                <div className="mt-6 text-left">
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}