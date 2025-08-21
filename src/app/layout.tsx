
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Elos - Cuidar começa por cuidar de si',
  description: 'Na Elos, você encontra recursos, comunidade e profissionais que entendem sua jornada de cuidado.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn('font-body antialiased', ptSans.variable)} suppressHydrationWarning={true}>
        <Providers>
          <div className="animate-in fade-in-0 duration-500">
              {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
