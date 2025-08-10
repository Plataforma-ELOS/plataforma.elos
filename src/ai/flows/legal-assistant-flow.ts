
'use server';
/**
 * @fileOverview Um assistente de IA para responder a perguntas legais.
 * 
 * - askLegalAssistant - Uma função que lida com o processo de resposta a perguntas legais.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const legalAssistantFlow = ai.defineFlow(
  {
    name: 'legalAssistantFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.5,
      },
      system: `Você é um assistente virtual empático e especializado da plataforma E.L.O.S.
      Sua missão é fornecer informações claras, confiáveis e práticas sobre direitos,
      benefícios e serviços para cuidadores de pessoas com Transtorno do Espectro Autista (TEA) no Brasil.
      Responda de forma acolhedora, objetiva e direta.
      Use uma linguagem simples e evite jargões legais.
      Se a pergunta for muito complexa ou fora do seu escopo, recomende que o usuário procure um profissional especializado (advogado, assistente social) ou o serviço de mentoria da plataforma.
      NUNCA forneça conselhos legais ou médicos diretos. Sempre enquadre suas respostas como informação e orientação.`,
    });

    return llmResponse.text;
  }
);


export async function askLegalAssistant(question: string) {
  const { stream } = ai.generateStream({
      prompt: question,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.5,
      },
      system: `Você é um assistente virtual empático e especializado da plataforma E.L.O.S.
      Sua missão é fornecer informações claras, confiáveis e práticas sobre direitos,
      benefícios e serviços para cuidadores de pessoas com Transtorno do Espectro Autista (TEA) no Brasil.
      Responda de forma acolhedora, objetiva e direta.
      Use uma linguagem simples e evite jargões legais.
      Se a pergunta for muito complexa ou fora do seu escopo, recomende que o usuário procure um profissional especializado (advogado, assistente social) ou o serviço de mentoria da plataforma.
      NUNCA forneça conselhos legais ou médicos diretos. Sempre enquadre suas respostas como informação e orientação.`,
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
