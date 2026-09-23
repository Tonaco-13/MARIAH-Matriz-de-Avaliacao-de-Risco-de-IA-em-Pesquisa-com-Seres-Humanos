# QUADRO VIVO — ciclo i18n-es (feat/i18n-es)

**Última atualização:** 2026-09-23 15:17 · Kimi (arquitetura) — leva Eixo 2 → âncoras aceita (LOG #40); spec es 344/344; Lote 5 liberado.
**Fase atual:** 🟡 **Lote 5 (relatório/exports em es + guarda verbatim das âncoras)** — ciclo anterior (infra i18n, v2.2.0) encerrado 10/10 com APROVA do Z (LOG #17/#18).

## Pendências abertas

| # | Pendência | Dono | Desde | Ref. |
|---|---|---|---|---|
| P2 | Disposição de `consentimento-re-consentimento.patch`, `public/inaep-logo.png` e docx em `upload/` (3 untracked confirmados) | Operador + Z | 2026-09-20 | Aceite E2, emenda 2.2; LOG #40 |
| §4.2 | Nomes institucionais: INAEP/SINEP (recomendação Kimi: manter siglas) + título oficial do Guia em es + par Ministério da Saúde→Ministerio de Salud de Brasil (**confirmado**, glossário t62) | **Direção** | 2026-09-22 | LOG #28, #40 |
| L5 | Lote 5: relatório/exports em es + literais residuais do utils + datas + **aviso de cortesia nos exports** + **guarda verbatim disclaimer×glossário** (condição do #40) | Engenharia | 2026-09-23 | LOG #40 |
| L6 | Lote 6: banner global de cortesia no `[locale]/layout.tsx` (decidido: global, não por-página) + flag-on /es | Engenharia | 2026-09-23 | LOG #40 |
| RET | footer.*, home.*, pages.*, results.validacaoDesc — **RETIDOS** até decisão §4.2 (162/335 chaves ausentes) | Engenharia (bloqueado na Direção) | 2026-09-22 | LOG #27/#28/#40 |

## Pendências fechadas

| # | Pendência | Fechamento |
|---|---|---|
| P1 | `_guia_decisao/` versionado | ✅ `96477fb` |
| P4–P7 | Ciclo infra i18n | ✅ LOG #12 |
| Passo 9 + DoD infra | Pacote Z + auditoria | ✅ LOG #15–#18 (Z: APROVA 10/10) |
| Passo 0 feat/i18n-es | Glossário v0.2.0 + key-parity no gate | ✅ LOG #20/#21 |
| Lotes 1–3 (messages es) | app/ui, entryFilter/contextForm/restart/clearScope, assessment/help | ✅ LOG #24/#26/#28 (es.json 123/335) |
| Religação 3a/1 + 3a/2 | wizard + Results on-screen | ✅ LOG #30/#32 |
| Guarda B1 preservação + i18n-identity contrato | dentes provados | ✅ LOG #34/#37 |
| Spec es completa (Eixo 1 → nós comuns) | 344/344 traduzidas, 0 fallback, B1 344 preservados | ✅ LOG #37/#40 (`d99211a`…`ae873fe`) |
| results.* (50 chaves) + âncoras locale-aware | placeholders ICU íntegros; âncoras verbatim × glossário | ✅ LOG #40 (`c4c9303`, `eb05b04`) |

## Trilha da branch feat/i18n-es

1. ✅ Passo 0: glossário v0.2.0 (`0d087c8`) + key-parity no gate (`9ae0837`)
2. ✅ Lotes messages 1–3 (`a2b2250`, `7444ef6`, `59dc1a9`) · Opção A sancionada (`4595966`)
3. ✅ Religação on-screen (`01691f9`, `52f0955`) + identity-contrato (`fb77772`) + B1-preservação (`e8a2e53`)
4. ✅ Spec es: Eixo 1 (`dddcbde`) → Eixo 2 (`d99211a`) → … → nós comuns (`ae873fe`) — **344/344**
5. ✅ results.* (`c4c9303`) + âncoras (`eb05b04`) — **HEAD**
6. 🔨 **Lote 5** (relatório/exports + cortesia nos exports + guarda verbatim âncoras)
7. ⬜ Lote 6 (banner global cortesia + flag-on /es)
8. ⬜ Namespaces institucionais (§4.2 — Direção) + lote final com key-parity `--strict`
9. ⬜ Auditoria de conformidade do Z (camadas A2 1–4, retroversão) → veredito
10. ⬜ Decisão de publicação: **Direção** (merge em `main` VEDADO até lá)

## Semáforo dos gates (re-rodados pela arquitetura em `eb05b04`, 2026-09-23 15:17)

| Gate | Estado |
|---|---|
| `verify` | 🟢 105/105 |
| `parity` | 🟢 128/0 |
| `gate` (vetores) | 🟢 64/64 Δ=0 |
| `i18n-identity` | 🟢 344 traduzidas / 0 fallback |
| `i18n-no-literal` (A+B1+B2) | 🟢 zero-literal JSX · 344 campos B1 preservados · messages OK |
| `i18n-key-parity` (padrão) | 🟢 0 órfãs · 162 ausentes = aviso (Opção A; strict reprova até o lote final) |
| `parity:locale` (flag off) | 🟢 4/4 pt-BR DOM-idêntico à baseline NDTI |
| Build | 🟢 |

---
*Quem mudar qualquer linha deste quadro registra `aviso` ou `decisão` no LOG citando a linha.*
