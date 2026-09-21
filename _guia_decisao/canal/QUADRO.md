# QUADRO VIVO — ciclo i18n (feat/i18n-architecture)

**Última atualização:** 2026-09-21 16:35 · Kimi (arquitetura) — passos 6–8 verificados e aceitos (LOG #9–#12)
**Fase atual:** 🟡 **Passo 9 (DoD + pacote de auditoria)** — antes: P8 (i18n-no-literal, 2 checks) + chore version 2.2.0, nesta ordem (LOG #12).

## Pendências abertas

| # | Pendência | Dono | Desde | Ref. |
|---|---|---|---|---|
| P2 | Disposição de `consentimento-re-consentimento.patch` e `public/inaep-logo.png` | Operador + Z | 2026-09-20 | Aceite, emenda 2.2 |
| P8 | `scripts/i18n-no-literal.ts` no gate com **2 checks nomeados**: (A) zero-literal JSX (B2); (B) golden-rule em messages/i18n (B1/B7) | Engenharia | 2026-09-21 | LOG #7/#8/#12 |
| P9 | `package.json` version 2.1.0 → **2.2.0** em commit `chore` próprio (após P8) | Engenharia | 2026-09-21 | LOG #12 |

## Pendências fechadas

| # | Pendência | Fechamento |
|---|---|---|
| P1 | `_guia_decisao/` versionado | ✅ `96477fb` |
| P4 | inventory-strings | ✅ proposta aceita (LOG #7/#8) → virou P8 |
| P5 | Allowlist 344 sancionada | ✅ LOG #8 |
| P6 | Datas locale-aware | ✅ `2e9667d` (`utils.ts:652/872`), verificado pela arquitetura |
| P7 | Atomicidade bump 2.2.0 | ✅ `3c4e9c2` |

## Passos da branch

1. ✅ Baseline NDTI congelada — `d7e10d5`
2. ✅ Estrutura next-intl + flag runtime — `c2b0706`
3. ✅ 4a componentes — `cde3470`…`1b4a995`
4. ✅ 4b páginas + zero-literal — `8a874de`, `c233095`
5. ✅ Passo 5 enxuto (contrato-spec + identidade 344 + bump atômico) — `3c4e9c2`
6. ✅ MAINTENANCE.md — `4e2d22f` · ✅ jspdf removido + CHANGELOG [2.2.0] — `93321f5` · ✅ relatório locale-aware — `2e9667d` · ✅ build duplo flag off↔on provado em runtime
7. 🔨 **Passo 9**: P8 (i18n-no-literal, 2 checks) → P9 (version 2.2.0) → DoD completo → pacote do Z (**passa pela arquitetura antes** — LOG #12.3)
8. ⬜ Auditoria de conformidade do Z → veredito
9. ⬜ Decisão de publicação: **Direção**

## Semáforo dos gates

| Gate | Estado |
|---|---|
| `verify` | 🟢 105/105 — re-rodado pela arquitetura em `2e9667d` |
| `parity` | 🟢 128/0 |
| `gate` (vetores + i18n-identity) | 🟢 64/64 + 344/344 — re-rodado pela arquitetura |
| `parity:locale` | 🟢 4/4 (flag off) reportado por bloco |
| Build duplo flag off↔on | 🟢 provado em runtime (OFF: gated 307→pt-BR; ON: gated 200) |

---
*Quem mudar qualquer linha deste quadro registra `aviso` ou `decisão` no LOG citando a linha.*
