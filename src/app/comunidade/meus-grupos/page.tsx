
// src/app/comunidade/meus-grupos/page.tsx
'use client';
import { useState } from 'react';
import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Search } from 'lucide-react';
import Link from 'next/link';

// Mock data, em uma aplicação real viria do backend
const userGroupsData = [
  // O usuário não participa de nenhum grupo inicialmente
]; 

export default function MyGroupsPage() {
  const [userGroups, setUserGroups] = useState<any[]>(userGroupsData);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/comunidade" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Comunidade
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-primary">Meus Grupos</h1>
                    <p className="text-muted-foreground mt-1">Seus espaços para conversas e conexões.</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/comunidade/explorar-grupos">
                    <Search className="mr-2 h-4 w-4" />
                    Explorar novos grupos
                  </Link>
                </Button>
            </div>

            {userGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* O mapeamento dos grupos do usuário iria aqui */}
              </div>
            ) : (
              <Card className="text-center p-12 border-dashed shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Você ainda não faz parte de nenhum grupo</h2>
                <p className="text-muted-foreground mb-6">Que tal explorar os grupos existentes ou criar o seu próprio?</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/comunidade/explorar-grupos">
                      Explorar Grupos
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                     <Link href="/comunidade/criar-grupo">Criar um Grupo</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    