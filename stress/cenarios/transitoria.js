// Falha TRANSITÓRIA do banco: o caso que o retry de consultarComRetry deveria
// resolver. Carga moderada e constante enquanto o Toxiproxy (no caminho
// app -> banco) derruba uma fração das conexões, e o banco segue de pé:
//   normal -> ~30% das conexões cortadas -> normal
//
// O que mede, por fase:
//   - degradacao_silenciosa: respostas 200 SEM os dados (o que o usuário vê
//     como lista vazia). Com um retry que funciona, uma falha de 30% por
//     consulta cai para ~3% (0,3 ao cubo, com 3 tentativas); sem retry
//     efetivo, fica perto de 30% por consulta.
//   - as consultas que chegam ao banco por requisição (gateway.txt): é onde
//     se vê se as tentativas realmente reconsultam ou são devolvidas de
//     memória pelo Next.
//
// Rodar ANTES e DEPOIS de qualquer mudança no retry e comparar.
import http from 'k6/http';
import { sleep } from 'k6';
import exec from 'k6/execution';
import { visitar, tempo, carga } from '../lib/config.js';

const TOXIPROXY = (__ENV.TOXIPROXY_URL || 'http://127.0.0.1:8474').replace(/\/$/, '');
const PROXY = `${TOXIPROXY}/proxies/postgrest`;
// Fração das conexões cortadas durante a fase de falha (0 a 1).
const TOXICIDADE = Number(__ENV.TOXICIDADE || 0.3);

// [nome, duração em segundos na escala 1]
const FASES = [
  ['1-normal', 45],
  ['2-falha-transitoria', 90],
  ['3-recuperado', 45],
];
const TOTAL = FASES.reduce((soma, f) => soma + f[1], 0);
const escalaTempo = Number(__ENV.ESCALA_TEMPO || 1);

export const options = {
  scenarios: {
    usuarios: {
      executor: 'constant-arrival-rate',
      rate: carga(10),
      timeUnit: '1s',
      duration: tempo(TOTAL),
      preAllocatedVUs: 20,
      maxVUs: carga(300),
    },
    caos: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      exec: 'caos',
      maxDuration: tempo(TOTAL + 30),
    },
  },
  // Limites de fachada: existem só para o k6 listar as métricas por fase no
  // resumo. O objetivo é comparar antes e depois, não aprovar ou reprovar.
  thresholds: Object.fromEntries(
    FASES.flatMap(([f]) => [
      [`http_req_duration{fase:${f}}`, ['p(95)<999999']],
      [`http_req_failed{fase:${f}}`, ['rate<=1']],
      [`degradacao_silenciosa{fase:${f}}`, ['rate<=1']],
      [`degradacao_silenciosa{fase:${f},grupo:dinamica}`, ['rate<=1']],
      [`degradacao_silenciosa{fase:${f},grupo:isr}`, ['rate<=1']],
    ]),
  ),
};

function faseAtual() {
  const s = exec.instance.currentTestRunDuration / 1000 / escalaTempo;
  let acumulado = 0;
  for (const [nome, duracao] of FASES) {
    acumulado += duracao;
    if (s < acumulado) return nome;
  }
  return FASES[FASES.length - 1][0];
}

export default function () {
  visitar({ fase: faseAtual() });
}

function chamarToxiproxy(metodo, url, corpo) {
  const res = http.request(metodo, url, corpo ? JSON.stringify(corpo) : null, {
    headers: { 'Content-Type': 'application/json' },
    tags: { controle: 'toxiproxy' },
  });
  // 404 ao remover uma falha que não existe é esperado.
  if (res.status >= 300 && !(metodo === 'DELETE' && res.status === 404)) {
    throw new Error(`Toxiproxy ${metodo} ${url} -> ${res.status} ${res.body}`);
  }
}

function restaurar() {
  chamarToxiproxy('DELETE', `${PROXY}/toxics/transitoria`);
}

export function caos() {
  restaurar();
  sleep(FASES[0][1] * escalaTempo);
  console.warn(`FASE 2: ${Math.round(TOXICIDADE * 100)}% das conexões com o banco cortadas`);
  // "timeout" com 1 ms fecha a conexão logo depois de aberta, sem entregar
  // dado nenhum. É o que o Toxiproxy 2.1.x oferece; versões novas têm também
  // "reset_peer".
  chamarToxiproxy('POST', `${PROXY}/toxics`, {
    name: 'transitoria',
    type: 'timeout',
    stream: 'downstream',
    toxicity: TOXICIDADE,
    attributes: { timeout: 1 },
  });
  sleep(FASES[1][1] * escalaTempo);
  console.warn('FASE 3: conexões normais de novo');
  restaurar();
}

// Garante que o ambiente não fica "quebrado" se o teste for interrompido.
export function teardown() {
  restaurar();
}
