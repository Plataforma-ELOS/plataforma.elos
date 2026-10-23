// Configuração compartilhada pelos cenários de k6.
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

export const BASE_URL = (__ENV.BASE_URL || 'http://127.0.0.1:9100').replace(/\/$/, '');

// ---------------------------------------------------------------- trava de segurança
// Por padrão o k6 só roda contra a própria máquina. Produção e previews da
// Vercel usam o MESMO Supabase de produção, e o plano Hobby tem cota mensal:
// um teste de estresse ali derruba o app real e consome o limite. Para um
// alvo remoto isolado, é preciso confirmar o host exato:
//   ALVO_CONFIRMADO=meu-ambiente-isolado.exemplo.com
const host = BASE_URL.replace(/^https?:\/\//, '').split(/[/:]/)[0];
const local = ['127.0.0.1', 'localhost', '0.0.0.0'].includes(host);
if (!local && __ENV.ALVO_CONFIRMADO !== host) {
  throw new Error(
    `Alvo "${host}" recusado. O teste de estresse roda só contra o ambiente isolado ` +
      `(stress/ambiente). Para outro alvo isolado, defina ALVO_CONFIRMADO=${host}.`,
  );
}
if (/vercel\.app$/.test(host) || host.startsWith('plataforma-elos')) {
  throw new Error(`"${host}" é da Vercel e usa o Supabase de produção — não é um alvo de estresse.`);
}

// ---------------------------------------------------------------- escala
// ESCALA_TEMPO=0.25 roda tudo em um quarto do tempo; ESCALA_CARGA=2 dobra os
// usuários. Permite rodar rápido para validar e ajustar à máquina disponível.
const ESCALA_TEMPO = Number(__ENV.ESCALA_TEMPO || 1);
const ESCALA_CARGA = Number(__ENV.ESCALA_CARGA || 1);
export const tempo = (segundos) => `${Math.max(1, Math.round(segundos * ESCALA_TEMPO))}s`;
export const carga = (n) => Math.max(1, Math.round(n * ESCALA_CARGA));

// ---------------------------------------------------------------- rotas
// Cada rota tem uma "marca": um texto que só aparece quando os dados vieram
// do banco. As rotas dinâmicas degradam para lista vazia com status 200
// quando o Supabase falha — sem a marca, o teste contaria essa falha como
// sucesso.
//
// Fora dos cenários, de propósito: /noticias-ai e /suporte-ia (cada acesso
// chama o Gemini), /login e /cadastro (limite de requisições do Supabase Auth
// e envio de e-mails reais) e /fale-conosco (EmailJS).
export const ROTAS = [
  // Dinâmicas: cada visita consulta o banco.
  { grupo: 'dinamica', rota: '/comunidade', marca: 'Post de estresse', peso: 30 },
  { grupo: 'dinamica', rota: '/acervo-digital', marca: 'Entendendo o Comportamento no TEA', peso: 15 },
  { grupo: 'dinamica', rota: '/comunidade/explorar-grupos', marca: 'Grupo de estresse', peso: 15 },
  // ISR: servidas do cache, revalidadas a cada 5 min — grupo de controle.
  { grupo: 'isr', rota: '/profissionais', marca: 'Dra. Cristiane', peso: 15 },
  { grupo: 'isr', rota: '/noticias', marca: 'Nova Lei Amplia', peso: 10 },
  // Estáticas: não tocam o banco — mostram o limite do próprio servidor.
  { grupo: 'estatica', rota: '/home', marca: 'E.L.O.S', peso: 15 },
];

const PESO_TOTAL = ROTAS.reduce((total, r) => total + r.peso, 0);

function sortearRota() {
  let alvo = Math.random() * PESO_TOTAL;
  for (const r of ROTAS) {
    alvo -= r.peso;
    if (alvo < 0) return r;
  }
  return ROTAS[ROTAS.length - 1];
}

// 200 sem os dados esperados: a falha que o status HTTP esconde.
export const degradacaoSilenciosa = new Rate('degradacao_silenciosa');

const LIMITE_LENTA_MS = Number(__ENV.LIMITE_LENTA_MS || 3000);

export function visitar(tagsExtras = {}) {
  const r = sortearRota();
  const tags = { grupo: r.grupo, rota: r.rota, ...tagsExtras };
  const res = http.get(`${BASE_URL}${r.rota}`, { tags, timeout: '30s' });

  const status200 = res.status === 200;
  const comDados = status200 && typeof res.body === 'string' && res.body.includes(r.marca);
  check(res, { 'status 200': () => status200, 'dados presentes': () => comDados }, tags);
  if (status200) degradacaoSilenciosa.add(!comDados, tags);

  // Correlation ID: na Vercel toda resposta traz x-vercel-id, que localiza a
  // requisição nos runtime logs. Só as problemáticas são registradas.
  if (!comDados || res.timings.duration > LIMITE_LENTA_MS) {
    const id = res.headers['X-Vercel-Id'] || '-';
    console.warn(`${res.status} ${r.rota} ${Math.round(res.timings.duration)}ms dados=${comDados} correlacao=${id}`);
  }
  return res;
}

// Limites das zonas (apostila): verde = dentro destes números; amarela =
// latência subindo além deles; vermelha = erros 5xx ou degradação silenciosa.
export const LIMITES = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<800', 'p(99)<1500'],
  degradacao_silenciosa: ['rate<0.01'],
  // Linhas por grupo, só para o resumo mostrar cada grupo separado.
  'http_req_duration{grupo:dinamica}': ['p(95)<800'],
  'http_req_duration{grupo:isr}': ['p(95)<800'],
  'http_req_duration{grupo:estatica}': ['p(95)<800'],
};
