// Teste de estresse: as 4 etapas da apostila, mais a recuperação.
//   1. linha de base  2. ramp-up em degraus  3. degradação  4. ruptura
// Cada degrau dura o suficiente para comparar com o anterior.
import { sleep } from 'k6';
import exec from 'k6/execution';
import { visitar, tempo, carga, LIMITES } from '../lib/config.js';

const ETAPAS = [
  { nome: '1-base', alvo: carga(5) },
  { nome: '2-degrau-20', alvo: carga(20) },
  { nome: '2-degrau-50', alvo: carga(50) },
  { nome: '3-degrau-100', alvo: carga(100) },
  { nome: '4-degrau-200', alvo: carga(200) },
  { nome: '5-recuperacao', alvo: carga(5) },
];
const SUBIDA = 20;
const PATAMAR = 160;

export const options = {
  stages: ETAPAS.flatMap((e) => [
    { duration: tempo(SUBIDA), target: e.alvo },
    { duration: tempo(PATAMAR), target: e.alvo },
  ]),
  // Os limites não abortam: o objetivo é atravessar a ruptura e ver a volta.
  thresholds: {
    ...LIMITES,
    ...Object.fromEntries(ETAPAS.map((e) => [`http_req_duration{etapa:${e.nome}}`, ['p(95)<999999']])),
    ...Object.fromEntries(ETAPAS.map((e) => [`http_req_failed{etapa:${e.nome}}`, ['rate<=1']])),
    ...Object.fromEntries(ETAPAS.map((e) => [`degradacao_silenciosa{etapa:${e.nome}}`, ['rate<=1']])),
  },
};

const DURACAO_ETAPA = SUBIDA + PATAMAR;

export default function () {
  // Etiqueta cada requisição com a etapa em que foi feita, para o resumo
  // mostrar a evolução degrau a degrau.
  const decorrido = exec.instance.currentTestRunDuration / 1000 / Number(__ENV.ESCALA_TEMPO || 1);
  const indice = Math.min(ETAPAS.length - 1, Math.floor(decorrido / DURACAO_ETAPA));
  visitar({ etapa: ETAPAS[indice].nome });
  sleep(1);
}
