# QUADRO VIVO — ciclo i18n (feat/i18n-architecture)

**Última atualização:** 2026-09-21 15:55 · Kimi (arquitetura) — decisão Passo 5 enxuto (LOG #6, handoff H3)
**Fase atual:** 🟡 **Passo 5 (contrato-spec enxuto) aprovado, em trabalho** — tipos + `label()` + bump 2.2.0, sem religação (migra p/ feat/i18n-es, emenda no memorando dela). Engenharia retoma pós-pausa de tokens.

## Pendências abertas

| # | Pendência | Dono | Desde | Ref. |
|---|---|---|---|---|
| P1 | Commitar `_guia_decisao/` (governança) — Bloco 2 do handoff H3 | Operador (via Engenharia) | 2026-09-20 | LOG #3/#6 |
| P2 | Disposição de `consentimento-re-consentimento.patch` e `public/inaep-logo.png` | Operador + Z | 2026-09-20 | Aceite, emenda 2.2 |
| P4 | Confirmar `scripts/inventory-strings.ts` no 4a (ou incluir no Passo 5) | Engenharia | 2026-09-20 | LOG #4/#5 |
| P5 | Allowlist 344 documentada **no commit do Passo 5** — Kimi sanciona sobre o artefato (cond. 1 do LOG #6) | Engenharia → Kimi | 2026-09-20 | Aceite, emenda 1 |
| P6 | Datas `toLocaleDateString('pt-BR')` ×2 (`utils.ts:650/868`) → locale ativo; aceito no Passo 6 da Engenharia, **pré-auditoria** | Engenharia | 2026-09-21 | LOG #5/#6 |
| P7 | Atomicidade: `verify-math.ts` no **mesmo commit** do bump 2.2.0 (verify 104/105 até lá) | Engenharia | 2026-09-21 | LOG #5/#6 |

## Perguntas/bloqueios abertos no LOG

_(nenhum — aguardando confirmação #7 da Engenharia e retomada do Passo 5)_

## Passos da branch (ordem real de execução)

1. ✅ Baseline `gate/baseline-ndti/` congelada — `d7e10d5`
2. ✅ Estrutura next-intl + flag runtime + rotas `[locale]` — `c2b0706`
3. ✅ **4a**: extração componentes — `cde3470`, `62778a1`, `9dbf172`, `1b4a995` (⚠ P4: inventory-strings?)
4. ✅ **4b**: extração páginas + zero-literal JSX — `8a874de`, `c233095` (Engenharia reporta 0 literais pt-BR em JSX, parity-locale 4/4, e2e no preview)
5. 🔨 **Passo 5 (enxuto, LOG #6)**: tipos `i18n?` + `label()` + **teste de identidade 344** + allowlist documentada (P5) + bump 2.2.0 **com verify no mesmo commit** (P7) + CHANGELOG — commit isolado
6. ⬜ Passo 6: relatório/exports — datas locale-aware (P6) + seção i18n no `MAINTENANCE.md` (3.3)
7. ⬜ Remoção `jspdf` + CHANGELOG
8. ⬜ Build standalone flag off/on, pt-BR idêntico nas duas
9. ⬜ Relatório de conformidade do Z (7 seções do A1) → veredito
10. ⬜ Decisão de publicação: **Direção** (merge em `main` só com autorização dela)

## Semáforo dos gates

| Gate | Estado |
|---|---|
| `verify` (matemática) | 🟡 104/105 — expectativa "2.1.0" vs bump 2.2.0 em trabalho; fecha no commit do Passo 5 (P7) |
| `parity` (spec × gabarito v46) | 🟢 128/0 — reconfirmado 2026-09-21 |
| `parity:locale` | 🟢 4/4 reportado pela Engenharia no 4b; reexecutar após Passo 5 |
| Inventário de strings (B2) | ⚠ P4 em confirmação |
| Identidade `label()` (344 nós) | ⬜ novo — entra no Passo 5 (cond. 1, LOG #6) |

---
*Quem mudar qualquer linha deste quadro registra `aviso` ou `decisão` no LOG citando a linha.*
