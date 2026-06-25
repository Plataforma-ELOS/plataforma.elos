
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderSecondary />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Shield className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Política de Privacidade</h1>
                <p className="max-w-[700px] text-foreground/80 md:text-xl">
                    Sua privacidade é fundamental para nós. Entenda como coletamos, usamos e protegemos suas informações.
                </p>
                <p className="text-sm text-muted-foreground">Última atualização: 1 de Agosto de 2024</p>
            </div>

            <div className="max-w-3xl mx-auto prose prose-lg text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <h2>1. Coleta de Informações</h2>
                <p>
                    Coletamos informações que você nos fornece diretamente, como ao criar uma conta, preencher um formulário ou se comunicar conosco. Isso pode incluir seu nome, email e outras informações de contato. Também coletamos dados de uso anônimos para melhorar a plataforma.
                </p>
                
                <h2>2. Uso das Informações</h2>
                <p>
                    Utilizamos as informações para operar, manter e melhorar nossos serviços, para nos comunicarmos com você, para personalizar o conteúdo e para fins de segurança. Não compartilharemos suas informações pessoais com terceiros, exceto conforme descrito nesta política ou com o seu consentimento.
                </p>
                
                <h2>3. Segurança dos Dados</h2>
                <p>
                    Empregamos medidas de segurança padrão do setor para proteger seus dados contra acesso não autorizado, alteração ou destruição. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro.
                </p>

                <h2>4. Cookies</h2>
                <p>
                    Usamos cookies e tecnologias semelhantes para rastrear a atividade em nosso serviço e reter certas informações. Os cookies são arquivos com uma pequena quantidade de dados que podem incluir um identificador exclusivo anônimo.
                </p>

                <h2>5. Seus Direitos</h2>
                <p>
                    Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode se opor ao processamento de seus dados. Para exercer esses direitos, entre em contato conosco através dos canais fornecidos.
                </p>

                <h2>6. Alterações nesta Política</h2>
                <p>
                    Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações, publicando a nova Política de Privacidade nesta página.
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
