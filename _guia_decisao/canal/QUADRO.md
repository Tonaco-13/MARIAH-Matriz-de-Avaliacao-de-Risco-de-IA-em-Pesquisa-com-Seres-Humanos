# QUADRO VIVO — ciclo i18n (feat/i18n-architecture)

**Última atualização:** 2026-09-21 16:15 · Kimi (arquitetura) — Passos 6–8 liberados (LOG #8), gates re-rodados pela arquitetura no `3c4e9c2`
**Fase atual:** 🟢 **Passos 6–8 liberados** — Engenharia executa na ordem: MAINTENANCE → jspdf → relatório locale-aware (P6) → build duplo.

## Pendências abertas

| # | Pendência | Dono | Desde | Ref. |
|---|---|---|---|---|
| P2 | Disposição de `consentimento-re-consentimento.patch` e `public/inaep-logo.png` | Operador + Z | 2026-09-20 | Aceite, emenda 2.2 |
| P6 | Datas locale-aware (`utils.ts:650/868`) — entra no item 3 do plano 6–8, pré-auditoria | Engenharia | 2026-09-21 | LOG #5/#6/#8 |
| P8 | Formalizar conformidade zero-literal como `scripts/i18n-no-literal.ts` no gate (Passo 9) — proposta aceita no LOG #8 | Engenharia | 2026-09-21 | LOG #7/#8 |

## Pendências fechadas neste ciclo

| # | Pendência | Fechamento |
|---|---|---|
| P1 | `_guia_decisao/` versionado | ✅ `96477fb` (38 arquivos) |
| P4 | inventory-strings no 4a | ✅ resolvida por proposta (LOG #7/#8): nota E2 + grep formalizado (P8) + identity 344 |
| P5 | Allowlist 344 documentada e sancionada | ✅ LOG #8 (cabeçalho de `i18n-identity.ts` + gate 344/344) |
| P7 | Atomicidade do bump 2.2.0 | ✅ `3c4e9c2` — verify-math no mesmo commit; 105/105 |

## Passos da branch (ordem real de execução)

1. ✅ Baseline `gate/baseline-ndti/` congelada — `d7e10d5`
2. ✅ Estrutura next-intl + flag runtime + rotas `[locale]` — `c2b0706`
3. ✅ **4a**: extração componentes — `cde3470`…`1b4a995`
4. ✅ **4b**: extração páginas + zero-literal JSX — `8a874de`, `c233095`
5. ✅ **Passo 5 (enxuto)**: `i18n?` + `label()` + identidade 344 + bump 2.2.0 atômico — `3c4e9c2` (gates re-rodados pela arquitetura: tudo verde)
6. 🔨 MAINTENANCE.md (seção i18n) → remoção `jspdf` → relatório locale-aware (P6) → build duplo flag off/on
7. ⬜ Pacote de auditoria do Z (7 seções do A1) → veredito
8. ⬜ Decisão de publicação: **Direção**

## Semáforo dos gates

| Gate | Estado |
|---|---|
| `verify` (matemática) | 🟢 105/105 — re-rodado pela arquitetura em `3c4e9c2` |
| `parity` (spec × gabarito v46) | 🟢 0 divergências — re-rodado pela arquitetura |
| `gate` (vetores + identidade) | 🟢 64/64 + i18n-identity 344/344 — re-rodado pela arquitetura |
| `parity:locale` | 🟢 4/4 reportado; reexecutar ao fim do build duplo |
| Zero-literal JSX | 🟢 reportado (grep); formalização no gate = P8 |

---
*Quem mudar qualquer linha deste quadro registra `aviso` ou `decisão` no LOG citando a linha.*
