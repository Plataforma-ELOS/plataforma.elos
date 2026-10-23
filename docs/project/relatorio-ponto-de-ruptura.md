# Relatório de ponto de ruptura — modelo

> Um relatório por rodada de testes de estresse (`stress/`). Copie este
> arquivo para `docs/project/estresse/<data>-<ambiente>.md` e preencha.
> Segue o ciclo da apostila: **documentar os pontos de falha → análise de
> impacto no negócio (BIA) → plano de continuidade (PCOC) → limites no CI**.

## 1. Identificação

| Campo | Valor |
|---|---|
| Data | |
| Commit | |
| Ambiente | `stress/ambiente` local · CI (run #) · outro isolado |
| Máquina | vCPUs / RAM — **números absolutos só valem para esta máquina** |
| Cenários rodados | `fumaca` · `carga` · `pico` · `estresse` · `ruptura` · `dependencia` |
| Escalas | `ESCALA_TEMPO` · `ESCALA_CARGA` |
| Volume de dados | usuárias · posts · comentários/post · curtidas/post |
| Limites do banco | `DB_MAX_CONEXOES` · `PGRST_POOL` |

## 2. Linha de base (zona verde)

| Grupo de rota | p95 | p99 | Erros | Degradação silenciosa |
|---|---|---|---|---|
| Dinâmica | | | | |
| ISR | | | | |
| Estática | | | | |

## 3. Evolução por etapa (`estresse`)

| Etapa | Usuários | Vazão (req/s) | p95 | Erros | Degradação | CPU Next | CPU banco | Zona |
|---|---|---|---|---|---|---|---|---|
| 1 — base | | | | | | | | 🟢 |
| 2 — degraus | | | | | | | | |
| 3 — degradação | | | | | | | | 🟡 |
| 4 — ruptura | | | | | | | | 🔴 |
| Recuperação | | | | | | | | |

## 4. Ponto de ruptura (`ruptura`)

- **Volume em que quebrou** (`taxa_alvo_rps` no momento do abort):
- **Sintoma** (5xx · *timeout* · degradação silenciosa · latência):
- **Primeiro grupo a degradar**:
- **Componente saturado** (evidência em `recursos.csv` / `gateway.txt`):

## 5. Causa raiz e gargalos

Evidências concretas — linha do log, métrica, momento no painel. "Lento" não
é causa raiz.

## 6. Falha de dependência e efeito dominó (`dependencia`)

| Fase | p95 dinâmica | p95 ISR | Erros | Degradação dinâmica | Degradação ISR | Consultas ao banco por requisição |
|---|---|---|---|---|---|---|
| 1 — normal | | | | | | |
| 2 — banco lento | | | | | | |
| 3 — banco fora | | | | | | |
| 4 — recuperado | | | | | | |

- O que o usuário **vê** em cada fase:
- Houve contrapressão (fila crescendo com o banco lento)?
- O retry amplificou a carga com o banco fora?

## 7. Recuperação

- Voltou à linha de base **sozinho**, sem reiniciar nada?
- Em quanto tempo?

## 8. Análise de impacto no negócio (BIA)

Criticidade de 1 (baixa) a 5 (máxima — retomada obrigatória em até 6 h).
**RTO**: tempo máximo tolerável fora do ar. **RPO**: perda de dados tolerável.

| Função | Criticidade | RTO | RPO | Justificativa |
|---|---|---|---|---|
| Leitura de conteúdo (notícias, profissionais, acervo) | | | | |
| Comunidade (feed, posts, comentários) | | | | |
| Login e cadastro | | | | |
| Área do cuidador (dependentes, diário) | | | | |
| Suporte IA | | | | |

## 9. Plano de continuidade (PCOC)

| Plano | Para este sistema |
|---|---|
| **PAE** — ação de emergência | Voltado a vidas e estrutura física; num app web, só se aplica a quem opera (não ao software). Registrar "não se aplica" ou o equivalente. |
| **PCE** — contingência emergencial | O que segue funcionando com a dependência fora (ex.: páginas ISR servindo o último cache bom) |
| **PGC** — crise e comunicação | Quem decide, como os usuários são avisados, por qual canal |
| **PRD** — recuperação de desastre | Rollback na Vercel; restauração do banco (conferir o que o plano do Supabase oferece de backup) |
| **PCO** — continuidade operacional | Critério objetivo de "voltou a 100%" (ex.: linha de base da seção 2) |

## 10. Ações

| Ação | Prioridade | Responsável | Status |
|---|---|---|---|
| | | | |

## 11. Limites para o CI

Valores que viram *thresholds* em `stress/lib/config.js` (`LIMITES`), para a
esteira reprovar automaticamente uma regressão:

| Métrica | Limite |
|---|---|
| `http_req_duration` p95 | |
| `http_req_failed` | |
| `degradacao_silenciosa` | |
