// src/components/sections/ai-support-home.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AiSupportHome() {
  return (
    <section className="w-full py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 animate-pulse-slow"></div>
          <Card className="relative w-full text-center p-8 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">Tire suas dúvidas aqui</CardTitle>
              <CardDescription className="text-lg text-foreground/80 pt-2">
                A IA que te ajuda com a parte jurídica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full items-center space-x-2">
                <Input type="text" placeholder="Deixe sua dúvida aqui..." className="h-12 text-base" />
                <Button type="submit" size="lg">Perguntar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
