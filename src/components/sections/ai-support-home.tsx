
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AiSupportHome() {
  return (
    <section className="w-full py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-75 animate-pulse-slow"></div>
          <Card className="relative w-full text-center p-8 shadow-xl rounded-2xl">
            <CardHeader className="mb-8">
               <div className="flex items-center justify-center mb-6">
                <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User 1" data-ai-hint="woman portrait" />
                        <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User 2" data-ai-hint="man portrait" />
                        <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User 3" data-ai-hint="person portrait" />
                        <AvatarFallback>U3</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background bg-muted">
                        <AvatarFallback><Plus className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                </div>
                <p className="text-sm text-muted-foreground ml-3">Tiraram suas dúvidas</p>
              </div>
              <CardTitle className="text-3xl font-bold font-headline">Tire suas dúvidas aqui</CardTitle>
              <CardDescription className="text-lg text-foreground/80 pt-2">
                A IA que te ajuda com a parte jurídica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full items-center space-x-2">
                <Input type="text" placeholder="Deixe sua dúvida aqui..." className="h-12 text-base" />
                <Button type="submit" size="icon" className="rounded-full h-12 w-12 flex-shrink-0">
                  <ArrowRight className="h-6 w-6 text-white" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
