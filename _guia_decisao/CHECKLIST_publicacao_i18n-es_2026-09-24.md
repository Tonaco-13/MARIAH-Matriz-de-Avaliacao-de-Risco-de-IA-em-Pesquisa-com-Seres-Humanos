# CHECKLIST DE PUBLICAÇÃO — versão espanhola da MARIAH (+ faxina de branches)

**Data:** 2026-09-24 · **De:** Kimi (arquitetura) · **Para:** Direção/Operador · **Ref.:** trilha itens 10–11; LOG #58
**Princípio:** cada etapa só começa com a anterior verde. Rollback instantâneo em qualquer falha = `LOCALES_ENABLED=false` na Vercel (o pt-BR nunca sai do ar — provado pelo parity-locale 4/4 em todos os lotes).

---

## Etapa 0 — Veredito final do Z (BLOQUEIO)

- [x] Veredito final do ciclo i18n-es emitido e **favorável** (condições já cumpridas: #58). Se vier com ajustes, micro-commits antes de prosseguir. — **✅ #60 APROVADO + aditamento #65 cobrindo C.8/C5**

## Etapa 1 — C5: seletor de idioma (recomendado ANTES da flag)

**Resposta à consulta da Direção (2026-09-24):** hoje **não existe** seletor na UI — o `/es` é alcançável só por URL direta, com a flag ligada. Sem seletor, ninguém descobre o espanhol. Proposta mínima: *(executada — ver #63/#64; `bae0d6e`)*

- [x] Direção: C5 entra antes da flag — **EXECUTADO e ACEITO (#64), aditado pelo Z (#65)**

- Link discreto no **footer**, ao lado dos links institucionais: pt-BR mostra `Versión en español — traducción de cortesía`; es mostra `Versão em português — versão normativa` (essa segunda formulação reforça a hierarquia normativa, coerente com o banner).
- Renderizado **somente quando `LOCALES_ENABLED=true`** (flag off = UI pt-BR 100% atual, zero mudança; parity-locale segue 4/4).
- 2 chaves novas em messages (`footer.linkEs`, `footer.linkPt`) → strict passa a 436/436; navegação por link comum para `/es` e `/` (o proxy já resolve).
- Commit único, cadeia completa, smoke flag-on/off. **Aceite rápido do Z** (o veredito final pode já cobrir, ou aditamento de 1 parágrafo).

- [ ] Direção: C5 entra antes da flag (recomendado) ou publica sem seletor (soft launch por URL)?

## Etapa 2 — Push (Operador)

- [ ] `git push origin feat/i18n-es` — 21+ commits locais (Lotes 5–7, C4, canal). Push normal, sem force (histórico íntegro, verificado #50).

## Etapa 3 — Merge final (Direção)

- [ ] PR `feat/i18n-es` → `main` (a branch já contém a main por re-ancoragem — merge limpo esperado). Checks verdes no PR. Merge por ato da Direção, citando o veredito do Z no corpo.

## Etapa 4 — Flag na Vercel (Direção/Operador)

- [ ] `LOCALES_ENABLED=true` nas envs de **Production** do projeto `mariah-inaep` → Redeploy do deployment da main. **Caveat de rollback (engenharia, #63):** `LOCALES_ENABLED=false` sem rebuild derruba o `/es` (307→pt-BR) mas o link do footer pt-BR estático permanece até o rebuild — degradado, sem quebra; rollback completo exige redeploy.

## Etapa 5 — Smoke em produção (arquitetura ou Operador, reportar no canal)

- [ ] `https://mariah-inaep.vercel.app/` → pt-BR, redação nova da META-DESC, **sem** banner
- [ ] `https://mariah-inaep.vercel.app/es` → 200, `<html lang="es">`, banner de cortesia presente, footer/home em es, seletor (se C5 feito)
- [ ] `/es/instrucoes`, `/es/transparencia`, `/es/validacao` → 200 em es
- [ ] Fluxo completo em es: preencher Versão A mínima → resultados em es → relatório HTML/TXT com cláusula de cortesia
- [ ] `pt-BR` DOM-idêntico à baseline (parity-locale em produção, se aplicável, ou spot-check visual)

## Etapa 6 — Faxina de branches (Direção aprova a lista; Operador executa)

Branches **merged na main** (verificado 2026-09-24), locais e remotas — candidatas a `git branch -d` + `git push origin --delete`:

`chore/badge-c-dot` · `chore/fase0-baseline` · `chore/gate-verify-ci` · `chore/renomeia-guia-uso-etico` · `chore/public-docs-v2` (remota) · `docs/maintenance` · `docs/worklog-0807` · `feat/consentimento-re-consentimento` (remota; conteúdo absorvido na spec 2.x — LOG #50) · `feat/context-widgets` · `feat/fase05-spec-noop` · `feat/fase2-spec-v2` · `feat/i18n-architecture` · `feat/mariah-v2-fixes` · `feat/mecanismos-score-v2` · `feat/notas-mhra-v2.1` · `feat/padroniza-logo-headers` · `feat/rename-mariah` (remota) · `fix/planilha-cortes-v2` · `fix/relatorio-contexto-e-naoaplica` · `fix/results-espelho-relatorio` · `style/logo-somente-home`

`feat/i18n-es` **só após** a Etapa 3 (merge final) — e recomendo manter até o fim do ciclo de auditoria documental.

- [ ] Direção aprova a lista acima (ou marca exceções)
- [ ] Registro final no canal: publicação + faxina (entrada de LOG, QUADRO encerrado)

## Fora deste checklist (ciclos seguintes)

- Pendência ANX (Anexo Normativo es §1 no paradigma antigo + regra registral×descritiva no `glossario-es.md`) — LOG #55
- Rebrand visual com `public/inaep-logo.png` (gerar versão otimizada para UI — nota do Z, #50)
- Próximos locales (en/de/fr/zh): a infra já os comporta — cada um é um ciclo de glossário próprio
