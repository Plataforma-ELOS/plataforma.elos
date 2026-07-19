
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
    {
        question: "O que é o Transtorno do Espectro Autista (TEA)?",
        answer: "O Transtorno do Espectro Autista (TEA) é um distúrbio do neurodesenvolvimento que afeta a comunicação, a interação social e o comportamento. As características podem variar muito de pessoa para pessoa, e é por isso que é chamado de 'espectro'. Inclui dificuldades na comunicação social e padrões de comportamento restritos e repetitivos."
    },
    {
        question: "Quais são os primeiros sinais do TEA?",
        answer: "Os sinais podem aparecer nos primeiros anos de vida. Alguns deles incluem: dificuldade em manter contato visual, não responder ao próprio nome, atraso na fala, repetição de palavras ou frases (ecolalia), interesses muito específicos e intensos, e sensibilidade a sons, luzes ou texturas."
    },
    {
        question: "Como solicitar o Benefício de Prestação Continuada (BPC/LOAS)?",
        answer: "O BPC é um benefício de um salário mínimo para pessoas com deficiência de qualquer idade que comprovem não possuir meios de se sustentar. Para solicitar, a renda por pessoa da família deve ser inferior a 1/4 do salário mínimo. É preciso estar inscrito no Cadastro Único (CadÚnico) e fazer o pedido junto ao INSS, onde será agendada uma avaliação médica e social."
    },
    {
        question: "Meu filho tem direito a um professor de apoio na escola?",
        answer: "Sim. A Lei Berenice Piana (nº 12.764/2012) garante o direito a um acompanhante especializado (ou professor de apoio) em salas de aula regulares para alunos com TEA, caso seja comprovada a necessidade. A escola, seja pública ou privada, é responsável por fornecer esse profissional sem custo adicional para a família."
    },
    {
        question: "O que é o Plano de Ensino Individualizado (PEI)?",
        answer: "O PEI é um documento que planeja e acompanha o desenvolvimento educacional do aluno com necessidades especiais. Ele é elaborado pela equipe pedagógica da escola em conjunto com a família e, se possível, com os terapeutas da criança. O PEI estabelece metas, estratégias de ensino, adaptações de materiais e formas de avaliação personalizadas."
    },
    {
        question: "Como a plataforma Elos pode me ajudar?",
        answer: "A Elos é uma plataforma de apoio completa para cuidadores de pessoas com TEA. Aqui você encontra: um Acervo Digital com materiais selecionados, uma Comunidade para se conectar com outros cuidadores, um Suporte com IA para tirar dúvidas sobre direitos e benefícios, e uma lista de Profissionais avaliados."
    }
];

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <HelpCircle className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Perguntas Frequentes (FAQ)</h1>
                <p className="max-w-[700px] text-foreground/80 md:text-xl">
                    Respostas rápidas para as dúvidas mais comuns da nossa comunidade.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                 <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
