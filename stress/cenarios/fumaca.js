// Teste de fumaça: 1 usuário, poucos segundos. Valida o script e o ambiente
// antes de qualquer carga — se falhar aqui, o resto não significa nada.
import { sleep } from 'k6';
import { visitar, tempo } from '../lib/config.js';

export const options = {
  vus: 1,
  duration: tempo(30),
  thresholds: {
    checks: ['rate==1'],
    degradacao_silenciosa: ['rate==0'],
  },
};

export default function () {
  visitar();
  sleep(1);
}
