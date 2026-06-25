
'use server';
/**
 * @fileOverview Fluxos de IA para a seção de notícias.
 * 
 * - getNewsSummary: Gera um resumo das notícias do dia.
 * - askAboutArticle: Responde a uma pergunta sobre um artigo específico.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Flow para resumir as notícias
const newsSummaryFlow = ai.defineFlow(
  {
    name: 'newsSummaryFlow',
    inputSchema: z.array(z.string()),
    outputSchema: z.string(),
  },
  async (titles) => {
    const llmResponse = await ai.generate({
      prompt: `Você é um editor de notícias para a plataforma E.L.O.S., focada em cuidadores de pessoas com TEA. Abaixo está uma lista de títulos de notícias recentes na plataforma. Sua tarefa é escrever um parágrafo curto, acolhedor e informativo (cerca de 40-50 palavras) que resuma os principais tópicos abordados hoje, convidando os usuários a explorarem o conteúdo.

Títulos das notícias:
- ${titles.join('\n- ')}

Baseado nestes títulos, gere um resumo do dia.`,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.7,
      },
    });

    return llmResponse.text;
  }
);

export async function getNewsSummary(titles: string[]): Promise<string> {
  return await newsSummaryFlow(titles);
}


// Flow para responder perguntas sobre um artigo
const ArticleQuerySchema = z.object({
  article: z.string().describe("O conteúdo completo do artigo de notícia."),
  question: z.string().describe("A pergunta do usuário sobre o artigo."),
});

const articleAssistantFlow = ai.defineFlow(
  {
    name: 'articleAssistantFlow',
    inputSchema: ArticleQuerySchema,
    outputSchema: z.string(),
  },
  async ({ article, question }) => {
    const llmResponse = await ai.generate({
      system: `Você é um assistente de IA da plataforma E.L.O.S. Sua função é responder perguntas sobre um artigo de notícia específico. Seja direto, claro e baseie sua resposta estritamente no conteúdo do artigo fornecido. Não invente informações. Se a resposta não estiver no texto, diga que a informação não foi encontrada no artigo.

**Artigo:**
{{{article}}}
`,
      prompt: `**Pergunta do usuário:**
{{{question}}}

**Sua Resposta:**`,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.3,
      },
    });

    return llmResponse.text;
  }
);

export async function askAboutArticle(input: z.infer<typeof ArticleQuerySchema>): Promise<string> {
  return await articleAssistantFlow(input);
}
