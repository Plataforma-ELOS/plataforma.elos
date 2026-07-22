
'use server';
/**
 * @fileOverview Um assistente de IA para responder a perguntas legais.
 * 
 * - askLegalAssistant - Uma função que lida com o processo de resposta a perguntas legais.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import fs from 'fs/promises';
import path from 'path';

// Função para ler o contexto da plataforma de um arquivo
async function getPlatformContext() {
  const filePath = path.join(process.cwd(), 'src', 'ai', 'context', 'elos-platform-context.md');
  try {
    const context = await fs.readFile(filePath, 'utf-8');
    return context;
  } catch (error) {
    console.error("Erro ao ler o arquivo de contexto:", error);
    return "Contexto da plataforma E.L.O.S não pôde ser carregado.";
  }
}

const legalAssistantFlow = ai.defineFlow(
  {
    name: 'legalAssistantFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const platformContext = await getPlatformContext();
    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      config: {
        temperature: 0.5,
      },
      system: `Você é um assistente virtual empático e especializado da plataforma E.L.O.S. Sua função é estritamente focada nos tópicos da plataforma E.L.O.S e nos aspectos legais e de direitos relacionados ao TEA no Brasil. Recuse educadamente responder perguntas sobre qualquer outro tópico (conhecimentos gerais, matemática, história, etc.), informando ao usuário que seu foco é auxiliar a comunidade TEA dentro do contexto da plataforma.
      Sua missão é fornecer informações claras, confiáveis e práticas sobre direitos,
      benefícios e serviços para cuidadores de pessoas com Transtorno do Espectro Autista (TEA) no Brasil.
      Responda de forma acolhedora, objetiva e direta.
      Use uma linguagem simples e evite jargões legais.
      Se a pergunta for muito complexa ou fora do seu escopo, recomende que o usuário procure um profissional especializado (advogado, assistente social) ou o serviço de mentoria da plataforma.
      NUNCA forneça conselhos legais ou médicos diretos. Sempre enquadre suas respostas como informação e orientação.
      
      Utilize o seguinte contexto sobre a plataforma E.L.O.S para guiar suas respostas:
      ---
      ${platformContext}
      ---
      `,
    });

    return llmResponse.text;
  }
);


export async function askLegalAssistant(question: string) {
  const platformContext = await getPlatformContext();

  const { stream } = ai.generateStream({
      prompt: question,
      model: 'googleai/gemini-2.5-flash',
      config: {
        temperature: 0.5,
      },
      system: `Você é um assistente virtual empático e especializado da plataforma E.L.O.S. Sua função é estritamente focada nos tópicos da plataforma E.L.O.S e nos aspectos legais e de direitos relacionados ao TEA no Brasil. Recuse educadamente responder perguntas sobre qualquer outro tópico (conhecimentos gerais, matemática, história, etc.), informando ao usuário que seu foco é auxiliar a comunidade TEA dentro do contexto da plataforma.
      Sua missão é fornecer informações claras, confiáveis e práticas sobre direitos,
      benefícios e serviços para cuidadores de pessoas com Transtorno do Espectro Autista (TEA) no Brasil.
      Responda de forma acolhedeira, objetiva e direta.
      Use uma linguagem simples e evite jargões legais.
      Se a pergunta for muito complexa ou fora do seu escopo, recomende que o usuário procure um profissional especializado (advogado, assistente social) ou o serviço de mentoria da plataforma.
      NUNCA forneça conselhos legais ou médicos diretos. Sempre enquadre suas respostas como informação e orientação.

      Utilize o seguinte contexto sobre a plataforma E.L.O.S para guiar suas respostas:
      ---
      ${platformContext}
      ---
      `,
    });

  const newStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if (chunk.text) {
          controller.enqueue(encoder.encode(chunk.text));
        }
      }
      controller.close();
    },
  });

  return newStream;
}
