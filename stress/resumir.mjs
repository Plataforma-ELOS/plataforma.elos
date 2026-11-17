#!/usr/bin/env node
// Resume uma execução de stress/rodar.sh em tabelas legíveis, por etapa ou fase.
//
//   npm run stress:resumo -- stress/resultados/<cenario>-<data>
//   npm run stress:resumo                 (usa a execução mais recente)
//
// O painel HTML do k6 mostra o teste inteiro misturado; o que responde "onde
// começou a degradar" é a quebra por etapa (cenário estresse) ou por fase
// (dependencia, transitoria), que está no resumo.json — e é isso que sai aqui.
// Sem dependências: só Node.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = join(import.meta.dirname, 'resultados');

function maisRecente() {
  if (!existsSync(RAIZ)) return null;
  const pastas = readdirSync(RAIZ)
    .map((nome) => join(RAIZ, nome))
    .filter((p) => statSync(p).isDirectory() && existsSync(join(p, 'resumo.json')))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return pastas[0] ?? null;
}

const dir = process.argv[2] ?? maisRecente();
if (!dir || !existsSync(join(dir, 'resumo.json'))) {
  console.error('Uso: npm run stress:resumo -- stress/resultados/<cenario>-<data>');
  console.error('(nenhuma execução com resumo.json encontrada)');
  process.exit(1);
}

const metricas = JSON.parse(readFileSync(join(dir, 'resumo.json'), 'utf8')).metrics ?? {};
const ms = (v) => (v == null ? '      -' : String(Math.round(v)).padStart(7));
const pct = (v) => (v == null ? '     -' : `${(v * 100).toFixed(1)}`.padStart(6));

// "http_req_duration{fase:1-normal,grupo:dinamica}" -> { base, tags: {fase, grupo} }
function analisar(nome) {
  const m = nome.match(/^([^{]+)\{(.+)\}$/);
  if (!m) return null;
  const tags = Object.fromEntries(m[2].split(',').map((t) => t.split(/:(.*)/s).slice(0, 2)));
  return { base: m[1], tags };
}

const entradas = Object.entries(metricas)
  .map(([nome, valores]) => ({ ...analisar(nome), valores }))
  .filter((e) => e.base);

const dimensao = ['etapa', 'fase'].find((d) => entradas.some((e) => e.tags[d]));

console.log(`\nExecução: ${dir}`);
const total = metricas.http_reqs?.count;
const dur = metricas.http_req_duration;
console.log(
  `Geral: ${total ?? '?'} requisições · vazão média ${metricas.http_reqs?.rate?.toFixed(1) ?? '?'} req/s` +
    ` · p95 ${ms(dur?.['p(95)']).trim()} ms · mediana ${ms(dur?.med).trim()} ms` +
    ` · erro HTTP ${pct(metricas.http_req_failed?.value).trim()}%` +
    ` · degradação silenciosa ${pct(metricas.degradacao_silenciosa?.value).trim()}%`,
);
if (metricas.dropped_iterations?.count) {
  console.log(`Iterações descartadas (o gerador não conseguiu manter a taxa): ${metricas.dropped_iterations.count}`);
}
if (metricas.taxa_alvo_rps) {
  console.log(`Taxa-alvo no momento em que o teste terminou/abortou: ${metricas.taxa_alvo_rps.value} req/s`);
}

// ---------------------------------------------------------------- CPU e memória
const arquivoRecursos = join(dir, 'recursos.csv');
if (existsSync(arquivoRecursos)) {
  const porAlvo = {};
  for (const linha of readFileSync(arquivoRecursos, 'utf8').split('\n').slice(1)) {
    const [, alvo, cpu, mem] = linha.split(',');
    if (!alvo || Number.isNaN(Number(cpu))) continue;
    (porAlvo[alvo.replace('elos-estresse-', '').replace(/-1$/, '')] ??= []).push({ cpu: Number(cpu), mem });
  }
  console.log('\nCPU (% de 1 núcleo; Node passa de 100% com threads auxiliares) e memória final:');
  for (const [alvo, v] of Object.entries(porAlvo)) {
    const cpus = v.map((x) => x.cpu);
    const media = cpus.reduce((a, b) => a + b, 0) / cpus.length;
    const aviso = alvo.includes('media-desde') ? '  ⚠ média desde o início do processo, não é instantâneo' : '';
    console.log(`  ${alvo.padEnd(30)} máx ${String(Math.round(Math.max(...cpus))).padStart(4)}%  média ${String(Math.round(media)).padStart(4)}%  memória ${v.at(-1).mem}${aviso}`);
  }
}

if (!dimensao) {
  console.log('\n(este cenário não quebra por etapa/fase; veja relatorio.html)');
  process.exit(0);
}

const valoresDimensao = [...new Set(entradas.filter((e) => e.tags[dimensao]).map((e) => e.tags[dimensao]))].sort();
const procurar = (base, filtro) =>
  entradas.find(
    (e) => e.base === base && Object.entries(filtro).every(([k, v]) => e.tags[k] === v) &&
      Object.keys(e.tags).length === Object.keys(filtro).length,
  )?.valores;

console.log(`\nPor ${dimensao}:`);
console.log(`${dimensao.padEnd(22)}${'reqs'.padStart(7)}${'mediana'.padStart(9)}${'p95 ms'.padStart(9)}${'erro %'.padStart(8)}${'degrad %'.padStart(10)}`);
for (const v of valoresDimensao) {
  const filtro = { [dimensao]: v };
  const duracao = procurar('http_req_duration', filtro);
  const falha = procurar('http_req_failed', filtro);
  const degr = procurar('degradacao_silenciosa', filtro);
  const n = (falha?.passes ?? 0) + (falha?.fails ?? 0);
  console.log(
    `${v.padEnd(22)}${String(n).padStart(7)}${ms(duracao?.med).padStart(9)}${ms(duracao?.['p(95)']).padStart(9)}` +
      `${pct(falha?.value).padStart(8)}${pct(degr?.value).padStart(10)}`,
  );
}

const grupos = [...new Set(entradas.filter((e) => e.tags.grupo && e.tags[dimensao]).map((e) => e.tags.grupo))].sort();
if (grupos.length) {
  console.log(`\nPor ${dimensao} e grupo de rota (dinâmica = consulta o banco; isr = cache; estatica = sem banco):`);
  console.log(`${dimensao.padEnd(22)}${'grupo'.padEnd(11)}${'reqs'.padStart(7)}${'p95 ms'.padStart(9)}${'degrad %'.padStart(10)}`);
  for (const v of valoresDimensao) {
    for (const g of grupos) {
      const filtro = { [dimensao]: v, grupo: g };
      const duracao = procurar('http_req_duration', filtro);
      const degr = procurar('degradacao_silenciosa', filtro);
      const n = (degr?.passes ?? 0) + (degr?.fails ?? 0);
      if (!n) continue;
      console.log(`${v.padEnd(22)}${g.padEnd(11)}${String(n).padStart(7)}${ms(duracao?.['p(95)']).padStart(9)}${pct(degr?.value).padStart(10)}`);
    }
  }
}

// ---------------------------------------------------------------- consultas ao banco
// Cada linha do gateway.txt é uma consulta que chegou ao "banco". Comparar com
// as requisições dinâmicas mostra se o retry reconsulta (>1 por requisição) ou
// é engolido pela deduplicação de fetch do Next (≈1).
const arquivoGateway = join(dir, 'gateway.txt');
const arquivoK6 = join(dir, 'k6.log');
if (dimensao === 'fase' && existsSync(arquivoGateway) && existsSync(arquivoK6)) {
  const marcos = [...readFileSync(arquivoK6, 'utf8').matchAll(/time="([^"]+)".*msg="FASE (\d)/g)].map((m) => ({
    t: Date.parse(m[1]),
    n: Number(m[2]),
  }));
  const linhas = readFileSync(arquivoGateway, 'utf8')
    .split('\n')
    .map((l) => l.match(/^(\S+) (\d{3}) \S+ \S+ "GET \/rest\/v1\/(\w+)/))
    .filter(Boolean)
    .map((m) => ({ t: Date.parse(m[1]), status: m[2], tabela: m[3] }));
  if (marcos.length && linhas.length) {
    const nomeFase = (n) => valoresDimensao.find((v) => v.startsWith(`${n}-`));
    const limites = [{ n: 1, de: -Infinity }, ...marcos.map((m) => ({ n: m.n, de: m.t }))];
    console.log('\nConsultas que chegaram ao banco, por fase (comparar com as requisições dinâmicas acima):');
    console.log(`${'fase'.padEnd(22)}${'consultas'.padStart(10)}${'por req dinâm.'.padStart(16)}  status`);
    limites.forEach((lim, i) => {
      const ate = limites[i + 1]?.de ?? Infinity;
      const dessaFase = linhas.filter((l) => l.t >= lim.de && l.t < ate);
      const nome = nomeFase(lim.n);
      const degr = nome && procurar('degradacao_silenciosa', { fase: nome, grupo: 'dinamica' });
      const reqs = (degr?.passes ?? 0) + (degr?.fails ?? 0);
      const status = {};
      for (const l of dessaFase) status[l.status] = (status[l.status] ?? 0) + 1;
      const porReq = reqs ? (dessaFase.length / reqs).toFixed(2) : '-';
      console.log(`${(nome ?? `fase ${lim.n}`).padEnd(22)}${String(dessaFase.length).padStart(10)}${String(porReq).padStart(16)}  ${JSON.stringify(status)}`);
    });
  }
}
console.log('');
