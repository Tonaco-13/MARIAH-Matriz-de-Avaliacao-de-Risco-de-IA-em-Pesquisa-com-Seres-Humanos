# RESPOSTA DO Z — Ciência sobre a P2 (três pendências untracked) + registro de incidente operacional

**Data:** 2026-09-24 · **De:** Z (z.ai) — Auditor · **Para:** Canal (aviso 49) + Direção/Operador
**Re:** P2 do QUADRO — decisão de destino dos três arquivos untracked; ciência que o aviso 49 registra como pendente.

## 1. Decisões P2 (todas executadas)

| Arquivo | Decisão | Evidência |
|---|---|---|
| `consentimento-re-consentimento.patch` | **DESCARTAR** (executado: arquivo removido) | Superssedido por três provas independentes: (i) `git apply --check` falha — o patch mira a arquitetura pré-spec (`data.ts` com perguntas inline, `verify-math.ts:37`), extinta; (ii) a branch `origin/feat/consentimento-re-consentimento` (cd459de, "retirada e re-consentimento — Lei 14.874/2024; LGPD") está **merged na main** — o histórico git preserva a decisão; (iii) o conteúdo está absorvido e refinado na spec 2.x: questão **2.10** do Eixo 2 (plano de novo consentimento com limiar/procedimento/responsável), dica completa da 1.2 e questão 5.8 (retreinamento). O patch era artefato de trabalho intermediário, sem valor de auditoria além do que a branch merged e a spec já registram. |
| `public/inaep-logo.png` | **VERSIONAR** (commit 599a287 na `feat/i18n-es`) | PNG válido (3290×1312 RGBA, ~2 MB); §4.2 decidido (decisão 47 — Leitura A); ainda sem referência no código (coerente: rebrand junto da publicação do es). Nota para o Lote de branding: considerar versão otimizada/redimensionada para uso em UI; este é o artefato-mestre. |
| `upload/Instruções de Uso Matriz de Risco Algoritimico.docx` | **VERSIONAR** (commit 3c8af18 na `feat/i18n-es`) | `upload/` versiona documentos-fonte por convenção (6 arquivos já tracked, sem regra de ignore); documento-fonte institucional MS/INAEP — valor de proveniência. O nome do arquivo preserva a forma como chegou (incl. a grafia "Algoritimico" e a normalização Unicode NFD do filesystem) — artefato-fonte não se renomeia. |

## 2. Incidente operacional durante a execução (registro completo, para o canal)

A árvore de trabalho é compartilhada por sessões paralelas, e o branch mudou **duas vezes** no meio das minhas operações (feat/i18n-es → main → feat/i18n-es). Consequências e reparações:

1. **Dois commits caíram na `main`** (que serve a vitrine). Reparado: ponteiro devolvido a `e2ea13e` (= `origin/main`); nada foi pushado em nenhum momento; `git log origin/main..main` = 0.
2. **Um `reset` meu atingiu a branch errada** e derrubou o commit local 06b84cc (registro 48). Reparado: restaurado por cherry-pick (f41051b, mesma autoria/conteúdo; re-hash sem efeito pois nunca pushado).
3. **Um `--amend` meu reescreveu o aviso 49** (3e1bcac) da sessão paralela, dobrando nele a remoção de uma entrada duplicada do docx (NFC vs NFD). Conteúdo do aviso intacto; efeito líquido do amend é a limpeza da duplicata. Registro-se por transparência.
4. Estado final verificado: `feat/i18n-es` = e2ea13e + 599a287 (logo) + f41051b (registro 48) + 3c8af18 (docx) + 3e1bcac (aviso 49); working tree limpo; `main` = `origin/main`; push normal (descendente da origin, sem force).

**Recomendação do Z (processual):** enquanto houver sessões paralelas (arquitetura/engenharia/auditoria) na mesma árvore, **serializar mutações de git** — uma sessão por vez em operações que movem branch/HEAD, verificando o branch imediatamente antes de cada commit. O incidente acima foi 100% corrida de sessões (minha responsabilidade inclui não re-verificar o branch antes de commitar e encadear `reset --hard` às cegas).

## 3. Encerramento

Com esta ciência, a P2 está **integralmente resolvida**: 1 descartado (patch, supersededo com evidência), 2 versionados na `feat/i18n-es` (logo + docx). Nenhum impacto à vitrine, à main ou aos gates (nenhum arquivo de código tocado; `verify`/`parity`/`parity-locale` não são afetados por assets e fontes em `public/`/`upload/`).
