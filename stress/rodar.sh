#!/usr/bin/env bash
# Roda um cenário de estresse contra o ambiente ISOLADO (nunca produção).
#
#   stress/rodar.sh <fumaca|carga|pico|estresse|ruptura|dependencia>
#
# Variáveis opcionais:
#   ESCALA_TEMPO=0.25  ESCALA_CARGA=2   encurta o tempo / multiplica a carga
#   SEM_BUILD=1                         reaproveita o .next já buildado contra o ambiente
#   PORTA_APP=9100                      porta do `next start`
#   DERRUBAR=1                          derruba os contêineres no fim
#   IMAGEM_TOXIPROXY=...                outra imagem (ex.: mirror.gcr.io/shopify/toxiproxy:latest)
#
# Saída em stress/resultados/<cenario>-<data>/:
#   relatorio.html   painel do k6 (gráficos de latência, vazão e erros)
#   resumo.json      métricas finais do k6
#   recursos.csv     CPU/memória do Next e dos contêineres durante o teste
#   gateway.txt      cada consulta que chegou ao "banco" (status e tempos)
#   next.log         log do servidor da aplicação
set -euo pipefail
cd "$(dirname "$0")/.."

CENARIO="${1:-}"
case "$CENARIO" in
  fumaca|carga|pico|estresse|ruptura|dependencia) ;;
  *) echo "uso: stress/rodar.sh <fumaca|carga|pico|estresse|ruptura|dependencia>" >&2; exit 2 ;;
esac

PORTA="${PORTA_APP:-9100}"
SAIDA="stress/resultados/${CENARIO}-$(date +%Y%m%d-%H%M%S)"
COMPOSE=(docker compose -f stress/ambiente/docker-compose.yml)
IMAGEM_K6="${IMAGEM_K6:-grafana/k6:0.57.0}"
mkdir -p "$SAIDA"

# shellcheck source=ambiente/ambiente.env
source stress/ambiente/ambiente.env

echo "==> Subindo o ambiente isolado (Postgres + PostgREST + Toxiproxy + gateway)"
"${COMPOSE[@]}" up -d --wait

if [ "${SEM_BUILD:-0}" != 1 ]; then
  echo "==> Build da aplicação apontando para o ambiente isolado"
  # NEXT_PUBLIC_* entram no bundle em tempo de build: o .next resultante só
  # serve para este ambiente. Rode `npm run build` de novo antes de usar o app
  # normalmente.
  npm run build > "$SAIDA/build.log" 2>&1 || { tail -30 "$SAIDA/build.log"; exit 1; }
fi

echo "==> Iniciando a aplicação em http://127.0.0.1:${PORTA}"
npx next start -p "$PORTA" -H 127.0.0.1 > "$SAIDA/next.log" 2>&1 &
NEXT_PID=$!
MONITOR_PID=""
encerrar() {
  [ -n "$MONITOR_PID" ] && kill "$MONITOR_PID" 2>/dev/null || true
  pkill -P "$NEXT_PID" 2>/dev/null || true
  kill "$NEXT_PID" 2>/dev/null || true
  if [ "${DERRUBAR:-0}" = 1 ]; then "${COMPOSE[@]}" down -v; fi
}
trap encerrar EXIT

for _ in $(seq 1 90); do
  curl -sf -o /dev/null "http://127.0.0.1:${PORTA}/home" && break
  sleep 1
done
curl -sf -o /dev/null "http://127.0.0.1:${PORTA}/home" || { echo "A aplicação não subiu"; tail -30 "$SAIDA/next.log"; exit 1; }

# Observabilidade durante o teste: CPU e memória a cada 5 s, do processo do
# Next e de cada contêiner, para correlacionar com o painel do k6.
(
  echo "momento,alvo,cpu_pct,memoria"
  while true; do
    agora=$(date +%H:%M:%S)
    for pid in $(pgrep -f "next-server|next start" || true); do
      ps -o %cpu=,rss= -p "$pid" 2>/dev/null | awk -v t="$agora" '{printf "%s,next,%s,%.0fMiB\n", t, $1, $2/1024}'
    done
    docker stats --no-stream --format "{{.Name}},{{.CPUPerc}},{{.MemUsage}}" 2>/dev/null \
      | grep elos-estresse | sed "s/^/${agora},/; s/%//" | awk -F, '{split($4,m," "); print $1","$2","$3","m[1]}'
    sleep 5
  done
) > "$SAIDA/recursos.csv" &
MONITOR_PID=$!

INICIO=$(date -u +%Y-%m-%dT%H:%M:%SZ)
echo "==> k6: cenário ${CENARIO}"
set +e
docker run --rm --network host --user "$(id -u):$(id -g)" \
  -v "$PWD/stress:/stress" \
  -e BASE_URL="http://127.0.0.1:${PORTA}" \
  -e ESCALA_TEMPO -e ESCALA_CARGA -e LIMITE_LENTA_MS \
  -e K6_WEB_DASHBOARD=true \
  -e K6_WEB_DASHBOARD_EXPORT="/${SAIDA}/relatorio.html" \
  "$IMAGEM_K6" run --summary-export "/${SAIDA}/resumo.json" "/stress/cenarios/${CENARIO}.js" \
  2>&1 | tee "$SAIDA/k6.log"
RESULTADO=${PIPESTATUS[0]}
set -e

"${COMPOSE[@]}" logs --no-log-prefix --since "$INICIO" gateway 2>/dev/null | grep '/' > "$SAIDA/gateway.txt" || true
REQ_K6=$(grep -oE 'http_reqs[^0-9]+[0-9]+' "$SAIDA/k6.log" | grep -oE '[0-9]+$' | head -1 || echo "?")
CONSULTAS=$(wc -l < "$SAIDA/gateway.txt" | tr -d ' ')
echo
echo "==> Consultas que chegaram ao banco: ${CONSULTAS} (requisições do k6: ${REQ_K6})"
echo "    Por status (502 = banco fora; cada retry conta de novo):"
awk '{print "      " $2}' "$SAIDA/gateway.txt" | sort | uniq -c | sort -rn | head -5
echo "==> Resultados em ${SAIDA}/"
[ "$RESULTADO" = 99 ] && echo "    (k6 saiu com 99: algum limite foi ultrapassado — esperado no cenário de ruptura)"
exit "$RESULTADO"
