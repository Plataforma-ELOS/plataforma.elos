// Falha de dependência e efeito dominó: carga moderada e constante enquanto o
// Toxiproxy (no caminho app -> banco) muda o comportamento do "Supabase":
//   normal -> lento (3 s por consulta) -> fora do ar -> recuperado
// Mostra, por fase: a latência que a contrapressão gera quando o banco fica
// lento, o que cada tipo de rota entrega quando o banco cai (ISR deve seguir
// servindo o cache; dinâmicas degradam), e se tudo volta sozinho.
import http from 'k6/http';
import { sleep } from 'k6';
import exec from 'k6/execution';
import { visitar, tempo, carga } from '../lib/config.js';

const TOXIPROXY = (__ENV.TOXIPROXY_URL || 'http://127.0.0.1:8474').replace(/\/$/, '');
const PROXY = `${TOXIPROXY}/proxies/postgrest`;
const FASE = Number(__ENV.ESCALA_TEMPO || 1) * 90; // segundos por fase
const FASES = ['1-normal', '2-banco-lento', '3-banco-fora', '4-recuperado'];

export const options = {
  scenarios: {
    usuarios: {
      executor: 'constant-arrival-rate',
      rate: carga(10),
      timeUnit: '1s',
      duration: tempo(90 * FASES.length),
      preAllocatedVUs: 20,
      maxVUs: carga(300),
    },
    caos: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      exec: 'caos',
      maxDuration: tempo(90 * FASES.length + 30),
    },
  },
  thresholds: Object.fromEntries(
    FASES.flatMap((f) => [
      [`http_req_duration{fase:${f}}`, ['p(95)<999999']],
      [`http_req_failed{fase:${f}}`, ['rate<=1']],
      [`degradacao_silenciosa{fase:${f}}`, ['rate<=1']],
      [`http_req_duration{fase:${f},grupo:dinamica}`, ['p(95)<999999']],
      [`http_req_duration{fase:${f},grupo:isr}`, ['p(95)<999999']],
      [`degradacao_silenciosa{fase:${f},grupo:dinamica}`, ['rate<=1']],
      [`degradacao_silenciosa{fase:${f},grupo:isr}`, ['rate<=1']],
    ]),
  ),
};

function faseAtual() {
  const s = exec.instance.currentTestRunDuration / 1000;
  return FASES[Math.min(FASES.length - 1, Math.floor(s / FASE))];
}

export default function () {
  visitar({ fase: faseAtual() });
}

function toxiproxy(metodo, url, corpo) {
  const res = http.request(metodo, url, corpo ? JSON.stringify(corpo) : null, {
    headers: { 'Content-Type': 'application/json' },
    tags: { controle: 'toxiproxy' },
  });
  if (res.status >= 300) throw new Error(`Toxiproxy ${metodo} ${url} -> ${res.status} ${res.body}`);
}

function restaurar() {
  http.del(`${PROXY}/toxics/lento`, null, { tags: { controle: 'toxiproxy' } });
  http.post(PROXY, JSON.stringify({ enabled: true }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { controle: 'toxiproxy' },
  });
}

export function caos() {
  restaurar();
  sleep(FASE);
  console.warn('FASE 2: banco lento (+3 s por consulta)');
  toxiproxy('POST', `${PROXY}/toxics`, {
    name: 'lento',
    type: 'latency',
    stream: 'downstream',
    attributes: { latency: 3000, jitter: 300 },
  });
  sleep(FASE);
  console.warn('FASE 3: banco fora do ar');
  toxiproxy('DELETE', `${PROXY}/toxics/lento`);
  toxiproxy('POST', PROXY, { enabled: false });
  sleep(FASE);
  console.warn('FASE 4: banco de volta');
  toxiproxy('POST', PROXY, { enabled: true });
}

// Garante que o ambiente não fica "quebrado" se o teste for interrompido.
export function teardown() {
  restaurar();
}
