import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Feather, ListTodo, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';

const communities = [
  {
    icon: <Feather className="h-8 w-8 text-accent" />,
    title: 'Cuidando com leveza',
    description: 'Espaço para compartilhar vitórias e desafios.',
  },
  {
    icon: <ListTodo className="h-8 w-8 text-accent" />,
    title: 'Dicas & Rotinas',
    description: 'Ideias práticas para o dia a dia.',
  },
  {
    icon: <MessageSquareHeart className="h-8 w-8 text-accent" />,
    title: 'Desabafos sem julgamentos',
    description: 'Conversa livre e acolhimento.',
  },
];

export default function Community() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Você não está sozinho(a)!</h2>
          <p className="max-w-[700px] text-foreground/80 md:text-xl">
            Junte-se a uma comunidade de apoio que entende suas necessidades e celebra cada conquista ao seu lado.
          </p>
          <h3 className="text-2xl font-semibold pt-6">Nossas comunidades:</h3>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {communities.map((community, index) => (
            <Card key={index} className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-accent/20 transition-shadow duration-300 transform hover:-translate-y-2">
              <CardHeader className="flex flex-row items-center gap-4 p-0">
                <div className="bg-accent/10 p-3 rounded-full">
                  {community.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{community.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <p className="text-foreground/80">{community.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="#">Quero fazer parte</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
