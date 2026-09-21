# ACEITE DA ARQUITETURA — NOTA E2-complemento (artefato 3.1)

**Data:** 2026-09-20 · **De:** Arquitetura (Kimi) · **Para:** Engenharia (Claude Code 4.8) + Auditor (Z) + Direção (Fabiano)
**Referência:** `NOTA_engenharia_E2-complemento_2026-09-20.md` · Memorando de execução, item 3.1
**Veredito:** **APROVADO COM DUAS EMENDAS DE REGISTRO** (não bloqueantes para o 1º commit de extração; item 1 deve constar do contrato documentado do `label()` antes do bump `matrixVersion 2.2.0`).

---

## 1. Verificação independente (arquitetura, 2026-09-20, branch `feat/i18n-architecture`, HEAD = `b59f49d`)

| Afirmação da nota | Verificação | Resultado |
|---|---|---|
| 5 consumidores não rewired | `scripts/parity-check.ts`, `build-spec-v2.ts`, `extract-gate-vectors.py`, `gen-instrucoes-preenchimento.py` e `src/components/maria/data.ts` presentes; branch sem diff contra `main` | **Confere** |
| Persistência não deriva de texto | `page.tsx:148` (`maria-assessment-state-v2`); estado chaveado por id (`contextAnswers`/`qualitativeAnswers`/`quantitativeAnswers`, linhas 26–28); nenhum rótulo como chave | **Confere** |
| Spec com 332 nós traduzíveis | Contagem exata por campo: `pergunta` 137 + `dica` 137 + `texto` 19 + `descricao` 18 + `nome` 14 + `label` 4 + `subtitulo` 3 = **332**; zero campos `i18n`; `matrixVersion` 2.1.0 | **Confere — é exato, não aproximado** |
| `disclaimer.ts` = 2 constantes | `MARIA_DISCLAIMER` + `MARIA_NAO_SUBSTITUI`, fonte única | **Confere** |
| Inventário UI ~366 strings | Não reproduzível por grep ingênuo de JSX (`>texto<`): parte relevante mora em constantes TS internas aos `.tsx` (ex.: array de passos em `StepIndicator.tsx:15–19`, que o grep de JSX conta como 0). Ordens de grandeza plausíveis | **Plausível — ver emenda 2** |

## 2. Emenda 1 (registro de contrato) — conjunto de campos da spec sob o helper `label()`

A nota lista os campos por amostragem ("`pergunta`, `dica`, `nome`, `descricao`…"). O contrato do `label(node, locale)` precisa de **allowlist explícita**, porque a spec contém três campos narrativos pt-BR **fora** dos 332 contados e um conjunto de vocabulário controlado que **jamais** pode ser tratado como traduzível:

**Entram no contrato `i18n` opcional (user-facing, hoje fora da contagem):**
- `description` (4 nós) — descrições dos níveis I–IV ("Risco baixo — requisitos mínimos…"), exibidas nos Resultados;
- `motivoEliminatorio` (8 nós) — texto exibido quando o protocolo é não-avaliável;
- `obs` (1 nó) — nota interna sobre o teto teórico; **decisão**: documentação, não entra em `i18n`, mas deve constar da allowlist como "excluído por decisão" para o Z não flagrar como string perdida.

**Nunca entram (vocabulário controlado / normativo / regra de ouro B7):**
`riskAnswer` (128, `sim/nao/na`), `efeito`, `nivel`, `tipoEntrada`, `operador`, `valor`, `campo`, `origem`, `condicional`, `geradoEm`, `color/bgColor/borderColor/textColor`, `referenciaNormativa` e `refEliminatoria` — referências normativas ("Res. CNS n.º 738/2024", "Lei n.º 14.874/2024 · LGPD") são camada b do despacho: **regulação não se traduz**.

Total revisado do universo traduzível da spec: **332 + 12 = 344 nós** (332 da nota + `description` 4 + `motivoEliminatorio` 8). Como nesta branch nenhum locale é preenchido, a emenda é de **documentação de contrato** (allowlist no código do helper e no CHANGELOG do bump 2.2.0), não de código.

## 3. Emenda 2 (higiene de auditoria) — inventário reproduzível + árvore limpa

1. **Script do inventário commitado.** O método de contagem da nota deve virar script em `scripts/` (ex.: `inventory-strings.ts`) e ser commitado junto ao 1º commit de extração. Razão: o DoD exige "zero string pt-BR em JSX verificável por grep — o Z rodará"; sem o script, o número ~366 não é auditável e o critério vira disputa de regex. O script passa a ser a âncora do gate B2/B6.
2. **Árvore com pendências antes do baseline.** Hoje há 4 itens não rastreados: `_guia_decisao/` inteira (incluindo esta nota — o 3.1 exige nota **commitada**), `spec/i18n/glossario-es.json` (rascunho do Z, 32 KB), `consentimento-re-consentimento.patch` e `public/inaep-logo.png`. Disposição exigida antes do snapshot da baseline NDTI (item 3.2 do memorando):
   - commitar `_guia_decisao/` (nota + este aceite) — pré-requisito formal do checklist de merge;
   - `spec/i18n/glossario-es.json`: o glossário es é artefato do Z e **branch de idioma está bloqueada** (item 6 do memorando); decidir com o Z se entra nesta branch como rascunho versionado ou aguarda `feat/i18n-es` — não deixar solto na árvore;
   - o `.patch` e o logo: commitar ou descartar, mas não conviver com untracked durante a geração da baseline — o snapshot 3.2 deve nascer de árvore limpa para que "commit exato entregue ao NDTI" seja defensável em auditoria.

## 4. Autorização

Cumprido o 3.1. **Autorizado o 1º commit de extração** (ordem sugerida: baseline `gate/baseline-ndti/` primeiro, como manda o 3.2-ii, depois a extração), observadas as emendas 1 e 2. O helper `label(node, locale)` nasce com a allowlist da emenda 1 documentada em comentário de código e no CHANGELOG.

Lembrete de âncora: nenhuma chave de persistência, export ou gate deriva de string traduzível (B7); números, pesos, cortes, somas de bloco, teto, ids e `matrixVersion` fora de `messages/` — a nota reafirma corretamente, e a verificação confirma que o estado persistido hoje obedece.

---
*Kimi não commita. Operador (Fabiano) executa; dúvidas de âncora param e perguntam.*
