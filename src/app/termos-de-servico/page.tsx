
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <FileText className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Termos de Serviço</h1>
                <p className="max-w-[700px] text-foreground/80 md:text-xl">
                    Ao utilizar nossa plataforma, você concorda com os seguintes termos e condições.
                </p>
                 <p className="text-sm text-muted-foreground">Última atualização: 1 de Agosto de 2024</p>
            </div>

            <div className="max-w-3xl mx-auto prose prose-lg text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <h2>1. Uso da Plataforma</h2>
                <p>
                    Você concorda em usar a plataforma Elos apenas para fins legais e de acordo com estes Termos de Serviço. Você é responsável por toda a atividade que ocorre em sua conta.
                </p>
                
                <h2>2. Conteúdo do Usuário</h2>
                <p>
                    Ao postar conteúdo na plataforma (por exemplo, na Comunidade), você nos concede uma licença mundial, não exclusiva e isenta de royalties para usar, reproduzir e distribuir esse conteúdo. Você garante que possui os direitos sobre o conteúdo que posta.
                </p>
                
                <h2>3. Conduta Proibida</h2>
                <p>
                    É estritamente proibido usar a plataforma para qualquer finalidade ilegal, para assediar outros usuários, para postar conteúdo odioso ou para violar os direitos de propriedade intelectual de terceiros.
                </p>

                <h2>4. Isenção de Responsabilidade</h2>
                <p>
                   As informações fornecidas pela Elos, incluindo o Suporte IA, são para fins informativos e não constituem aconselhamento médico ou jurídico. Sempre consulte um profissional qualificado para questões específicas.
                </p>

                <h2>5. Limitação de Responsabilidade</h2>
                <p>
                    A Elos não será responsável por quaisquer danos indiretos, incidentais ou consequenciais resultantes do seu uso da plataforma.
                </p>

                <h2>6. Encerramento</h2>
                <p>
                    Reservamo-nos o direito de suspender ou encerrar seu acesso à plataforma a qualquer momento, sem aviso prévio, por qualquer motivo, incluindo a violação destes Termos.
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
