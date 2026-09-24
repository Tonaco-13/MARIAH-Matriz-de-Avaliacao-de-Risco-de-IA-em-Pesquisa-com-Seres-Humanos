# NOTA DE ENGENHARIA — Complemento ao E2 (extração de strings i18n)

**Data:** 2026-09-20 · **De:** Engenharia · **Para:** Arquitetura (Kimi) + Auditor (Z)
**Branch:** `feat/i18n-architecture` · **Pré-requisito:** artefato 3.1 do memorando de execução (antes do 1º commit de extração).

## 1. Adesão ao modelo campo-canônico + `i18n` (item 2.3)

A Engenharia **adere integralmente** ao modelo decidido pela Arquitetura:

- Os campos de conteúdo da spec (`pergunta`, `dica`, `nome`, `descricao`, `subtitulo`, `enunciado`, `label`…) **permanecem string pt-BR canônica**.
- Cada nó ganha, quando/se traduzido, um campo **opcional** `i18n: { "<locale>": "…" }`. Nesta branch nenhum locale é preenchido (`i18n` ausente em todos os nós).
- O acesso passa a ser via helper **`label(node, locale)`** com **fallback ao canônico** (pt-BR) quando não houver tradução.
- Os **5 consumidores** da spec **não são rewired** nesta branch e permanecem verdes: `parity-check.ts`, `build-spec-v2.ts`, `extract-gate-vectors.py`, `gen-instrucoes-preenchimento.py`, `data.ts`.
- **Regra de ouro (B7):** nenhuma chave de persistência, export ou gate deriva de string traduzível. Números, pesos, cortes (58/127/208; 64/141/230), somas de bloco (62/77), teto (297), ids de questão e `matrixVersion` **nunca** entram em arquivos de mensagem.

## 2. Inventário de strings por arquivo (contagem aproximada)

Método: contagem de nós de texto em JSX (`>texto<`) + atributos textuais (`title`/`placeholder`/`aria-label`/`description`), por análise estática; `data.ts`/`disclaimer.ts` são constantes TypeScript (não JSX), inventariadas qualitativamente.

| Arquivo | Strings (aprox.) | Observação |
|---|---:|---|
| `src/components/maria/data.ts` | ~10 blocos | `CONTEXT_QUESTIONS` (perguntas/dicas C.x) + rótulos; conteúdo canônico vem da spec |
| `src/components/maria/disclaimer.ts` | 2 constantes | `MARIA_DISCLAIMER` / `MARIA_NAO_SUBSTITUI` — "edita só aqui", agora por locale |
| `src/app/instrucoes/page.tsx` | 22 | narrativa + metadados |
| `src/app/transparencia/page.tsx` | 56 | narrativa (3 camadas, 4 gatilhos) + metadados |
| `src/app/validacao/page.tsx` | 52 | narrativa + metadados |
| `src/components/maria/Results.tsx` | 60 | rótulos de resultado, relatório, disclaimers |
| `src/components/maria/VersionSelector.tsx` | 49 | seleção de versão A/B/triagem |
| `src/components/maria/EntryFilter.tsx` | 32 | filtro de entrada (Passo 0) |
| `src/components/maria/QuantitativeAssessment.tsx` | 19 | rótulos Versão B |
| `src/components/maria/QualitativeAssessment.tsx` | 15 | rótulos Versão A |
| `src/components/maria/ContextForm.tsx` | 22 | Passo 1 (descritivas C.1–C.8) |
| `src/components/maria/HelpPanel.tsx` | 13 | ajuda |
| `src/components/maria/StepIndicator.tsx` | 7 | passos do wizard |
| `src/components/maria/RestartButton.tsx` | 8 | confirmação de reinício |
| `src/components/maria/Footer.tsx` | 7 | rodapé institucional |
| `src/components/maria/ClearScopeButton.tsx` | 4 | limpeza de escopo |
| **Subtotal UI/páginas** | **~366** | |
| `spec/mariah-spec.json` | **332** nós | `pergunta`/`dica`/`nome`/`descricao`/`enunciado`… (via campo `i18n`, não em `messages/`) |
| **TOTAL aprox.** | **~698** | |

## 3. Chaves namespacadas previstas (`messages/pt-BR.json`)

Convenção: `<namespace>.<sub>.<chave>`, estável, uma chave nasce em pt-BR e propaga como *missing key* (gate falha se ausente/órfã).

- `ui.stepIndicator.*` (rótulos dos passos), `ui.buttons.*` (voltar/avançar/reiniciar/limpar/imprimir), `ui.badges.*`
- `home.*` (VersionSelector: títulos, descrições A/B/triagem)
- `entryFilter.*` (Passo 0), `contextForm.*` (Passo 1; rótulos C.1–C.8 de exibição, **não** os enunciados — estes vêm da spec via `label()`)
- `assessment.a.*` / `assessment.b.*` (rótulos de UI da avaliação; enunciados/dicas via spec)
- `results.*` (resultado, faixas, `results.disclaimer`, relatório imprimível)
- `pages.instrucoes.*`, `pages.transparencia.*`, `pages.validacao.*` (narrativa das 3 rotas)
- `disclaimer.naoSubstitui`, `disclaimer.completo` (fonte única do aviso)
- `footer.*`, `help.*`

Conteúdo normativo da matriz (enunciados, dicas, nomes de eixo/bloco) **não** entra em `messages/`: fica na spec sob `i18n`, acessado por `label(node, locale)`. Assim, `messages/` cobre só a "casca" de UI e a narrativa das páginas; a matriz permanece fonte única.

## 4. Risco de persistência — NENHUM (reconfirmado)

O estado persistido (`localStorage['maria-assessment-state-v2']`, `page.tsx`) guarda **versão, filtro, `usesDatabase` e respostas por ID de questão** (`contextAnswers[id]`, `qualitativeAnswers[id]`='sim/nao/na', `quantitativeAnswers[id]`). **Nenhum texto de rótulo é chave.** Mover strings para `messages/` **não quebra dado salvo**. As respostas de contexto em texto livre são input do usuário, chaveadas por id — intactas. (Diferente do precedente `contexto1`→`C.1`, que era ID e por isso foi resolvido por rótulo de exibição, sem rename.)
