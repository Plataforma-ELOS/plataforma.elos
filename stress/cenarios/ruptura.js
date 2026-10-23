// Ponto de ruptura (breakpoint): a taxa de chegada sobe sem parar até o
// sistema quebrar, e o teste ABORTA sozinho quando os limites estouram. A
// métrica "taxa_alvo_rps" no resumo é a taxa em que isso aconteceu.
//
// Usa taxa de chegada (requisições/s) em vez de usuários: o gerador não
// desacelera quando o servidor fica lento — é assim que a fila (backpressure)
// aparece.
import exec from 'k6/execution';
import { Gauge } from 'k6/metrics';
import { visitar, tempo, carga } from '../lib/config.js';

const INICIO_RPS = carga(5);
const FIM_RPS = carga(400);

const taxaAlvo = new Gauge('taxa_alvo_rps');

export const options = {
  scenarios: {
    ruptura: {
      executor: 'ramping-arrival-rate',
      startRate: INICIO_RPS,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: carga(800),
      stages: [{ duration: tempo(600), target: FIM_RPS }],
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '20s' }],
    degradacao_silenciosa: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '20s' }],
    http_req_duration: [{ threshold: 'p(95)<5000', abortOnFail: true, delayAbortEval: '20s' }],
    taxa_alvo_rps: ['value>0'],
  },
};

export default function () {
  taxaAlvo.add(Math.round(INICIO_RPS + (FIM_RPS - INICIO_RPS) * exec.scenario.progress));
  visitar();
}
