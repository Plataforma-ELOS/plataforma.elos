// Teste de carga (zona verde): o volume esperado no uso rotineiro, mantido
// por um tempo. Responde "o app aguenta o dia a dia com folga?".
import { sleep } from 'k6';
import { visitar, tempo, carga, LIMITES } from '../lib/config.js';

export const options = {
  stages: [
    { duration: tempo(60), target: carga(20) },   // subida
    { duration: tempo(300), target: carga(20) },  // carga sustentada
    { duration: tempo(30), target: 0 },
  ],
  thresholds: LIMITES,
};

export default function () {
  visitar();
  sleep(1);
}
