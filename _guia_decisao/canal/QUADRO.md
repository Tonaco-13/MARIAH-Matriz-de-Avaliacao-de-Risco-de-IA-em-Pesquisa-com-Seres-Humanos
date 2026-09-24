# QUADRO VIVO — ciclo i18n-es (feat/i18n-es)

**Última atualização:** 2026-09-24 18:10 · Kimi — PR #31 (feat/i18n-es) e PR #32 (espelho do relatório) mergeados na main pela Direção (LOG #48); produção pt-BR intacta, flag de locales OFF.
**Fase atual:** 🟢 **Infra i18n publicada na main** (espanhol ainda invisível — flag OFF). Restam: Lote 7 (leva institucional, 162 chaves) → `--strict` → auditoria do Z → decisão de ligar a flag (Direção).
**Regime até 26/09:** Kimi executa código; Operador (Fabiano) revisa e commita (LOG #41). Claude retorna 26/09.

## Pendências abertas

| # | Pendência | Dono | Desde | Ref. |
|---|---|---|---|---|
| RET | footer.*, home.*, pages.*, results.validacaoDesc + 10 chaves do PR #32 (**172/430**) — **LIBERADO** pela decisão §4.2; branch já re-ancorada sobre `e2ea13e` (passo 0 cumprido pelo Operador) | Engenharia | 2026-09-22 | LOG #47–#49; DESPACHO leva-institucional 2026-09-24 (atualizado 18:25) |

## Pendências fechadas

| # | Pendência | Fechamento |
|---|---|---|
| P1 | `_guia_decisao/` versionado | ✅ `96477fb` |
| P2 | Disposição dos 3 untracked (patch, logo INAEP, docx `upload/`) | ✅ LOG #50 — ciência do Z: patch descartado (supersededo, tripla prova), logo `599a287`, docx `3c8af18` |
| P4–P7 | Ciclo infra i18n | ✅ LOG #12 |
| Passo 9 + DoD infra | Pacote Z + auditoria | ✅ LOG #15–#18 (Z: APROVA 10/10) |
| Passo 0 feat/i18n-es | Glossário v0.2.0 + key-parity no gate | ✅ LOG #20/#21 |
| Lotes 1–3 (messages es) | app/ui, entryFilter/contextForm/restart/clearScope, assessment/help | ✅ LOG #24/#26/#28 (es.json 123/335) |
| Religação 3a/1 + 3a/2 | wizard + Results on-screen | ✅ LOG #30/#32 |
| Guarda B1 preservação + i18n-identity contrato | dentes provados | ✅ LOG #34/#37 |
| Spec es completa (Eixo 1 → nós comuns) | 344/344 traduzidas, 0 fallback, B1 344 preservados | ✅ LOG #37/#40 (`d99211a`…`ae873fe`) |
| results.* (50 chaves) + âncoras locale-aware | placeholders ICU íntegros; âncoras verbatim × glossário | ✅ LOG #40 (`c4c9303`, `eb05b04`) |
| Lote 5 (relatório/exports locale-aware + cortesia nos exports + Check C) | namespace `report` 78 chaves pt+es; pt-BR byte-idêntico por snapshot; Check C com dentes provados | ✅ LOG #43 |
| Lote 6 (merge de messages + banner global cortesia + /es alcançável) | smoke flag-on OK; fallback Opção A ao vivo; flag permanece OFF por padrão | ✅ LOG #44 |
| §4.2 | Nomes institucionais INAEP/SINEP/título do Guia + diretriz "tudo INAEP/SINEP" | ✅ DECIDIDO pela Direção (LOG #47): Leitura A; minutas com "Investigación" (→ glossário v0.3.0 `proposto`, revisão formal do Z pendente); placeholder "Ex: CEP/CONEP" corrigido agora (C3 + baseline NDTI) |

## Trilha da branch feat/i18n-es

1. ✅ Passo 0: glossário v0.2.0 (`0d087c8`) + key-parity no gate (`9ae0837`)
2. ✅ Lotes messages 1–3 (`a2b2250`, `7444ef6`, `59dc1a9`) · Opção A sancionada (`4595966`)
3. ✅ Religação on-screen (`01691f9`, `52f0955`) + identity-contrato (`fb77772`) + B1-preservação (`e8a2e53`)
4. ✅ Spec es: Eixo 1 (`dddcbde`) → Eixo 2 (`d99211a`) → … → nós comuns (`ae873fe`) — **344/344**
5. ✅ results.* (`c4c9303`) + âncoras (`eb05b04`)
6. ✅ Merge main→branch (`7a13ece`): fix do relatório (PR #30: C.3–C.8 + seção 'Não se aplica') absorvido e adaptado a `label(q,'pergunta',locale)` — LOG #42
7. ✅ **Lote 5** (relatório/exports locale-aware via `createTranslator` + cortesia nos exports + Check C âncoras×glossário) — LOG #43
8. ✅ **Lote 6** (merge es→pt-BR no `request.ts` + banner global de cortesia no layout + /es alcançável com flag on) — LOG #44
9. ⬜ **Lote 7 — leva institucional (§4.2 decidido, LOG #47):** glossário v0.3.0 + 162 chaves + reconciliação footerDev + placeholder pt/es + baseline NDTI (despacho 2026-09-24) → key-parity `--strict`
10. ⬜ Auditoria de conformidade do Z (camadas A2 1–4, retroversão) → veredito
11. ⬜ Decisão de publicação: **Direção** (merge em `main` VEDADO até lá)

## Semáforo dos gates (re-rodados pela arquitetura no Lote 6, 2026-09-24 — working tree pré-commit)

| Gate | Estado |
|---|---|
| `verify` | 🟢 105/105 |
| `parity` | 🟢 128/0 |
| `gate` (vetores) | 🟢 64/64 Δ=0 |
| `i18n-identity` | 🟢 344 traduzidas / 0 fallback |
| `i18n-no-literal` (A+B1+B2+C) | 🟢 zero-literal JSX · 344 campos B1 preservados · messages OK · âncoras 3/3 verbatim |
| `i18n-key-parity` (padrão) | 🟢 0 órfãs · 162 ausentes = aviso (Opção A; strict reprova até o lote final) |
| `parity:locale` (flag off) | 🟢 4/4 pt-BR DOM-idêntico à baseline NDTI |
| Build | 🟢 |

---
*Quem mudar qualquer linha deste quadro registra `aviso` ou `decisão` no LOG citando a linha.*
