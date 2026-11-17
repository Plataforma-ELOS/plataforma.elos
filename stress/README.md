# Testes de estresse — Plataforma E.L.O.S

Suíte de testes de carga, pico, estresse, ponto de ruptura e falha de
dependência, feita com [k6](https://k6.io) e
[Toxiproxy](https://github.com/Shopify/toxiproxy), rodando contra um ambiente
**isolado** que reproduz o banco de produção a partir das migrations do
repositório.

> ⚠️ **Nunca rode contra produção nem contra previews da Vercel.** Os dois usam
> o **mesmo Supabase de produção**, e o plano Hobby tem cota mensal: um teste
> de estresse ali derruba o app real e consome o limite. Por isso
> `stress/lib/config.js` **recusa** qualquer alvo que não seja a própria
> máquina e qualquer host `*.vercel.app`.

## Como funciona

```
k6 ──► app (next start, :9100) ──► gateway (:54321) ──► Toxiproxy ──► PostgREST ──► Postgres
                                       │                    ▲
                                       └ log de cada        └ API :8474 — injeta lentidão
                                         consulta ao banco    e queda (cenário "dependencia")
```

- **Postgres** aplica **as 25 migrations de `supabase/migrations`** (as mesmas de
  produção) sobre um "chão" que simula o que o Supabase já entrega pronto —
  papéis `anon`/`authenticated`, `auth.uid()`, schema `storage`
  (`ambiente/db/00-bootstrap.sql`). A RLS é a real.
- **Massa de dados sintética** (`ambiente/db/02-dados-estresse.sh`): 200
  usuárias, 600 posts, 3.600 comentários, 7.200 curtidas, grupos e eventos.
  Produção tem 0 posts hoje — testar com o banco vazio mediria um sistema que
  não existe.
- **PostgREST** é o mesmo componente que o Supabase usa por trás de
  `/rest/v1`; o **gateway** (nginx) faz o papel do gateway do Supabase e
  registra cada consulta.
- A app é buildada com `ambiente/ambiente.env`, que aponta para o gateway com
  um JWT anônimo assinado por um segredo **local** — não dá acesso a nada real.

## Pré-requisitos

- **Docker** (Docker Desktop no Windows/macOS).
- **Node.js** (o mesmo do projeto) e `npm install` já rodado.
- Um shell **bash**: Linux, macOS, ou no Windows **WSL2** ou **Git Bash**
  (o `rodar.sh` não roda no PowerShell).
- O k6 **não precisa ser instalado**: roda pela imagem oficial `grafana/k6`.

## Rodando

```bash
npm run stress -- fumaca          # sempre primeiro: valida script e ambiente (30 s)
npm run stress -- estresse        # as 4 etapas da apostila + recuperação (~18 min)
ESCALA_TEMPO=0.25 npm run stress -- estresse   # versão rápida (~5 min)
SEM_BUILD=1 npm run stress -- ruptura          # reaproveita o build anterior
DERRUBAR=1 npm run stress -- carga             # derruba os contêineres no fim

npm run stress:resumo                          # tabelas por etapa/fase da última execução
npm run stress:resumo -- stress/resultados/<cenario>-<data>
```

Com o teste rodando, o painel do k6 abre ao vivo em http://127.0.0.1:5665.
`npm run stress:resumo` mostra o que o painel não mostra: as métricas **por
etapa ou por fase**, as consultas que chegaram ao banco por requisição e a
CPU de cada componente.

O script sobe o ambiente, builda a app apontando para ele, roda o cenário e
salva tudo em `stress/resultados/<cenario>-<data>/`.

> O build fica em `.next` apontando para o ambiente local. Antes de voltar a
> usar o app normalmente, rode `npm run build` (ou `npm run dev`) de novo.

## Cenários

| Cenário | Tipo (apostila) | O que faz | Responde |
|---|---|---|---|
| `fumaca` | — | 1 usuário por 30 s | O script e o ambiente funcionam? |
| `carga` | Teste de carga | 20 usuários por 5 min | Aguenta o uso rotineiro com folga? (zona verde) |
| `pico` | Teste de pico | 5 → **150 usuários em 10 s** → 5 | Sobrevive a um surto e **volta ao normal**? |
| `estresse` | Teste de estresse | Degraus 5 → 20 → 50 → 100 → 200 → 5 | Onde começa a degradação, onde quebra, e se recupera |
| `ruptura` | Ponto de ruptura | Taxa de chegada sobe até 400 req/s e **aborta sozinho** ao estourar os limites | Qual o volume exato do *breakpoint*? (métrica `taxa_alvo_rps`) |
| `dependencia` | Falha de dependência | Carga constante enquanto o banco fica **lento** (+3 s) e depois **fora do ar** | Efeito dominó, contrapressão, o que cada rota entrega sem banco |
| `transitoria` | Falha transitória | Carga constante enquanto **~30% das conexões** com o banco são cortadas (`TOXICIDADE=0.3`), com o banco de pé | O **retry** recupera falhas passageiras? (compare a degradação silenciosa antes e depois de mexer nele) |

`ESCALA_TEMPO` e `ESCALA_CARGA` multiplicam durações e usuários de qualquer
cenário — para rodar rápido ou adaptar à máquina.

### Rotas testadas

Ponderadas por peso, em `lib/config.js`:

- **Dinâmicas** (`/comunidade`, `/acervo-digital`, `/comunidade/explorar-grupos`):
  cada visita consulta o banco.
- **ISR** (`/profissionais`, `/noticias`): servidas do cache, revalidadas a cada
  5 min — **grupo de controle**.
- **Estáticas** (`/home`): não tocam o banco — mostram o limite do servidor.

**Fora de propósito:** `/noticias-ai` e `/suporte-ia` (chamam o Gemini — cota e
custo), `/login`/`/cadastro` (limite do Supabase Auth e e-mails reais) e
`/fale-conosco` (EmailJS).

## Lendo os resultados

| Arquivo | O que mostra |
|---|---|
| `relatorio.html` | Painel do k6: latência, vazão e erros ao longo do tempo (gerado em execuções de 30 s ou mais) |
| `resumo.json` / `k6.log` | Métricas finais, **separadas por grupo, etapa ou fase** |
| `recursos.csv` | CPU e memória do Next e de cada contêiner a cada 5 s. No Linux a CPU do Next é **instantânea** (lida de `/proc`); no macOS só existe a média desde o início do processo, e a coluna `next(media-desde-o-inicio)` avisa isso — `ps %cpu` esconde o gargalo na média |
| `gateway.txt` | Cada consulta que chegou ao banco, com status e tempo |

As métricas que importam, conforme a apostila:

- **Vazão** — `http_reqs` por segundo.
- **Latência por percentis** — `p(95)` e `p(99)` de `http_req_duration`.
- **Taxa de erro** — `http_req_failed` (5xx e falhas de conexão).
- **Degradação silenciosa** — `degradacao_silenciosa`: resposta **200 sem os
  dados**. As rotas dinâmicas degradam para lista vazia quando o banco falha;
  sem essa métrica, o teste contaria a falha como sucesso. Cada rota tem uma
  "marca" de conteúdo que só aparece quando os dados vieram do banco.

**Zonas operacionais** (limites em `LIMITES`, `lib/config.js`):
🟢 verde — p95 < 800 ms e erros < 1% · 🟡 amarela — latência subindo além disso ·
🔴 vermelha — erros 5xx, *timeouts* ou degradação silenciosa.

**Amplificação de consultas:** no fim, o script compara as requisições do k6
com as consultas que chegaram ao banco (`gateway.txt`). Com o banco fora do ar,
cada requisição pode virar várias consultas por causa do retry de
`consultarComRetry` — é o efeito dominó medido.

**Correlation ID:** em ambientes na Vercel, o k6 registra o `x-vercel-id` das
respostas lentas ou com falha, que localiza a requisição nos runtime logs.

## Ajustando o ambiente

Variáveis lidas por `ambiente/docker-compose.yml` (defina antes do
`npm run stress`; para mudar a massa de dados, recrie o banco com
`docker compose -f stress/ambiente/docker-compose.yml down -v`):

| Variável | Padrão | Para que serve |
|---|---|---|
| `DB_MAX_CONEXOES` | 60 | `max_connections` do Postgres |
| `PGRST_POOL` | 10 | Pool de conexões do PostgREST |
| `ESTRESSE_USUARIOS` | 200 | Usuárias sintéticas |
| `ESTRESSE_POSTS` | 600 | Posts |
| `ESTRESSE_COMENTARIOS_POR_POST` | 6 | Comentários por post (volume de cada página do feed) |
| `ESTRESSE_CURTIDAS_POR_POST` | 12 | Curtidas por post |
| `IMAGEM_TOXIPROXY` | `ghcr.io/shopify/toxiproxy:2.12.0` | Imagem alternativa, se o ghcr.io estiver inacessível |

## No CI

`.github/workflows/estresse.yml` roda qualquer cenário **sob demanda**
(Actions → Estresse → Run workflow), dentro do próprio runner, e publica os
resultados como artefato. Não roda em PR nem em push: cada execução sobe um
banco inteiro e leva de minutos a dezenas de minutos.

## Limites deste ambiente (leia antes de concluir algo)

- **É uma máquina só.** Na Vercel, cada requisição roda numa função que escala
  sozinha; aqui, um único `next start` divide a CPU com o banco e com o k6.
  Os **números absolutos** não valem para produção — o que se transfere é o
  **comportamento**: qual rota degrada primeiro, se o retry amplifica a carga,
  se a ISR segura o banco fora do ar, se o sistema se recupera sozinho.
- **A ISR não é exercitada pela falha de banco.** `/profissionais` e `/noticias`
  revalidam a cada 300 s, e as fases de falha duram 60–90 s: o cache nunca
  expira durante o teste, então ele **não prova** que o `falharSeRuntime`
  preserva a última página boa quando a revalidação falha. Para isso seria
  preciso manter o banco fora por mais de 5 minutos com tráfego contínuo.
- **Os números de CPU do Next valem para um processo só.** O gargalo medido
  (um núcleo saturado) é do `next start` único deste ambiente; na Vercel cada
  requisição roda numa invocação própria.
- **Só tráfego anônimo.** Não há GoTrue (Supabase Auth) no ambiente; fluxos
  logados e escritas (criar post, curtir) ficam fora.
- O registro de cada execução segue o modelo em
  [`docs/project/relatorio-ponto-de-ruptura.md`](../docs/project/relatorio-ponto-de-ruptura.md).
  A primeira rodada está em
  [`docs/project/estresse/2026-11-17-local.md`](../docs/project/estresse/2026-11-17-local.md).
