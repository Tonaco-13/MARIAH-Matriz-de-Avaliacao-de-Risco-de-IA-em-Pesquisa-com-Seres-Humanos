# MEMORANDO DE EXECUÇÃO — feat/i18n-es (para Claude Code / Opus 4.8, conta MS)

**Data:** 2026-09-21 · **De:** Kimi (arquitetura), por determinação da Direção (Fabiano) · **Para:** Engenharia (Claude Code 4.8 Extra, sessão Cowork conta MS PRO)
**Status:** BORRADOR PRONTO — a autorização formal é emitida quando (i) a `feat/i18n-architecture` passar na auditoria de conformidade do Z **e** (ii) a Direção der o sinal. Este documento existe para zero tempo morto nesse momento.
**Pré-condições já satisfeitas:** glossário `es` aprovado (`spec/i18n/glossario-es.json` v0.2.0 — **64/64 `aprovado-z`**, contrato terminológico vinculante); Anexo Normativo es em borrador 0.1.0 (`spec/i18n/anexo-normativo-es.md`).
**Documentos do ciclo:** ler o MEMORANDO_execucao_i18n_infra_2026-09-20.md (modo de trabalho do item 0 vale aqui integralmente) + REGISTRO_destrave_glossario-es_2026-09-20.md (approved-list de auditoria, item 4).

---

## 1. Escopo da branch

Criar `feat/i18n-es` a partir da `feat/i18n-architecture` **aprovada**. A branch entrega o espanhol completo como primeira localidade viva:

1. **`messages/es.json`** — todos os namespaces extraídos na infra, sem chave ausente nem órfã (CI do item 5.2).
2. **Spec:** preencher `i18n: { "es": "…" }` nos nós de conteúdo de `spec/mariah-spec.json` e `spec/fichas/` — via modelo campo-canônico + `label(node, locale)`; **campo pt-BR e números intocados** (B1/B7).
3. **Páginas:** `instrucoes`, `transparencia`, `validacao` em es.
4. **Anexo Normativo:** instalar `anexo-normativo-es.md` como rota `/es/normativa` (renderização markdown da casa; em pt-BR a rota não existe — o anexo é artefato por localidade, decisão do despacho item 4b).
5. **Âncoras:** `MARIA_DISCLAIMER`, `MARIA_NAO_SUBSTITUI` e a **cláusula de cortesia** (redação exata do glossário — já `aprovado-z`, não redigir de novo) nos mesmos pontos do pt-BR: Resultados, seletor de versão, print/PDF e export TXT.
6. **Templates de export:** `lang="es"` no HTML do relatório; datas via locale ativo (next-intl), não fixas.

**Vedado nesta branch:** mexer em pt-BR (a paridade flag-off deve seguir verde — B6), tocar números/ids (B1), criar aparência de adaptação jurisdicional (B8), emitir hreflang/metadados de localidade com a flag desligada (B9), antecipar qualquer outro idioma.

## 2. Contrato terminológico (glossario-es.json v0.2.0)

- O glossário é **vinculante**: termo aprovado não se varia. `consequenciaOperacional` (pt-BR) é o gabarito — a tradução deve sustentar exatamente aquela consequência.
- **Tabela de modalidade:** deve→debe · pode→puede · vedado→prohibido · obrigatório→obligatorio · facultativo→facultativo. Confundir requisito/recomendación ou amolecer vedado = B3.
- **Decisões fixadas pelo Z (não reabrir):** CEP (nunca CEI) no corpo; "Cláusula de Primacía Ética" + "Salvaguarda Decisoria" (P4.1/P4.2 → Nível IV); "Salvaguarda de la Res. 738" (Eixo 3.b → Nível III); "Salvaguarda de Inevaluabilidad" (P6.b.2 → suspensão); "no evaluable por la MARIAH" (nunca "reprobado"); "cumplimentación" (nunca formas de "diligenciar" para preenchimento); "Ministerio de Salud de Brasil"; "ni exime de la deliberación colegiada"; tríade de escopo com os três verbos literais; "No se aplica".

## 3. Critérios de aceite (a approved-list do Z — será cobrada na auditoria)

1. Cadeia "nivel" única — sem "etapa/fase" (B3).
2. Contagem das **três** Salvaguardas por namespace, coerente com o pt-BR.
3. "Primacía Ética" nos Resultados + "Salvaguarda Decisoria" nas fichas P4.1/P4.2.
4. **CEP (nunca CEI)** em todo o corpo, incluindo exports TXT/print.
5. Nenhuma forma de "diligenciar" significando preenchimento.
6. "Ministerio de Salud de Brasil" no disclaimer.
7. Tríade de escopo literal: *automatizan decisiones / generan contenido / intervienen en la conducción del estudio*.
8. Tetos (275/304; 297 avaliável), cortes (58/127/208; 64/141/230), ids e matrixVersion **inalterados** (B1).

**Mais os gates de sempre:** `verify` verde; `parity` pt-BR × gabarito v46 verde; `parity:locale` verde (flag off ⇒ pt-BR DOM-idêntico; `/es` redireciona com flag off; com flag on, `/es` vivo com `lang="es"`); vetores gate com saída numérica idêntica rodando sob `es`; teste de stress de layout (+40%) nas fichas, StepIndicator, badges e tabelas.

## 4. Processo

1. Tradução em lotes por namespace (sugestão: `ui.*` → páginas → `fichas.*` → `results.*` → exports → spec `i18n`), commit por lote, verificação por lote — mesmo regime do memorando da infra (passos sequenciais, operador executa, engenharia confere a saída).
2. Dúvida terminológica não coberta pelo glossário → **parar e consultar** (a arquitetura responde; se for termo com consequência operacional, vira entrada nova de glossário com `status: proposto` e sobe ao Z — nunca decidir ad hoc).
3. Entrega final: relatório de auto-verificação contra os 8 pontos + saídas dos gates.
4. **Retroversão (camada 2 do A2):** você traduz, **o Z retroverte** — não retroverter o próprio texto. Preparar, ao final, o pacote de retroversão: lista das strings das classes normativas (enunciados, níveis, requisitos, disclaimers, instruções) em formato que o Z consuma direto.
5. Auditoria do Z (relatório de conformidade, 7 seções) → veredito → arquitetura registra → Direção decide publicação.

## 5. Fora de escopo

Resumo executivo dos cadernos (fase 2 do despacho, item 4c); tradução de documentos do `_guia_decisao`; qualquer outro idioma; mudanças de layout além do necessário ao stress +40%.

---

**Nota de sequência:** este memorando assume a infra aprovada. Se a auditoria da infra exigir ajustes que mudem o esquema de chaves, a arquitetura emenda este memorando antes da autorização.

**EMENDA 2026-09-21 (decisão de escopo do Passo 5 da infra, LOG #6):** a infra entrega o contrato de dados **enxuto** — campo `i18n` opcional nos tipos + helper `label(node, campo, locale)` + bump 2.2.0 — **sem** religar componentes (no-op com zero tradução; religar reabriria todos os arquivos sem ganho). Portanto, **entra no escopo desta branch `feat/i18n-es`**: (i) a religação das leituras de conteúdo da matriz nos componentes para `label(...)` com o locale ativo (`q.pergunta`, `axis.nome`, `RISK_LEVELS.label`, `req.texto`, `block.*`, `DATABASE_FILTER_QUESTION.*`, contexto); (ii) o threading de locale no `utils.ts` (nomes de eixo/bloco no Results/exports) — feito em bloco, junto das traduções reais. A propriedade "fallback ≡ canônico" chega aqui **provada** pelo teste de identidade da infra (condição da arquitetura no LOG #6).
