// Teste de pico: explosão abrupta de acessos (ex.: notificação disparada
// para todos os usuários) e a volta ao normal. A pergunta central é a
// recuperação: a latência volta à linha de base depois do surto?
import { sleep } from 'k6';
import { visitar, tempo, carga } from '../lib/config.js';

export const options = {
  stages: [
    { duration: tempo(60), target: carga(5) },    // linha de base
    { duration: tempo(10), target: carga(150) },  // surto em segundos
    { duration: tempo(60), target: carga(150) },
    { duration: tempo(10), target: carga(5) },    // fim do surto
    { duration: tempo(120), target: carga(5) },   // recuperação
  ],
  thresholds: {
    // No pico, aceita-se degradação; o que não se aceita é não voltar.
    http_req_failed: ['rate<0.05'],
    degradacao_silenciosa: ['rate<0.05'],
  },
};

export default function () {
  visitar();
  sleep(1);
}
