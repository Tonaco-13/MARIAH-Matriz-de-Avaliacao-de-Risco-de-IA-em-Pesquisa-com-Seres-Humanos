# DESPACHO — Leva institucional i18n-es (Lote 7) + correção do placeholder CEP/CONEP

**Data:** 2026-09-24 · **De:** Kimi (arquitetura), por decisão da Direção (LOG #47) · **Para:** Engenharia (execução via regime excepcional, LOG #41) · **Base:** `feat/i18n-es`, HEAD `3c8af18`
**Fundamentos:** DOSSIE §4.2 de 2026-09-24 (decisão §8) · parecer do Z (LOG #46) · Errata §7 do dossiê.

> **Atualização 2026-09-24 18:25 (LOG #48/#49):** PR #31 (feat/i18n-es) e PR #32 (espelho do relatório) foram mergeados na main pela Direção, e o Operador já **re-ancorou a `feat/i18n-es` sobre `e2ea13e`** (logo INAEP e docx versionados em `599a287`/`3c8af18`) — ou seja, **o antigo "passo 0" (merge main→branch) já está cumprido**; a branch parte direto para C1. Escopo revisto: **172 chaves** (não 162) — o PR #32 acrescentou 10 chaves pt-BR (tela-espelho do relatório), conferido pelo key-parity na main: 172/430 ausentes. O `--strict` continua sendo o critério final: 0 ausentes.

---

## 1. Escopo autorizado (nada além disto)

1. **Glossário-es v0.3.0** (`spec/i18n/glossario-es.json`): acrescentar as 3 entradas institucionais exatamente nas minutas do §5 do dossiê (formas com **"Investigación"**, `status: "proposto"`); bump `versao` → `0.3.0`, `data`, entrada de `changelog` citando LOG #47. Nenhuma entrada existente se altera (CEP/CONEP/MS/MARIAH permanecem verbatim).
2. **Leva institucional — 172 chaves** (footer 8 + home 45 + pages 108 + results.validacaoDesc 1, composição conferida pelo Z, **+ 10 chaves novas do PR #32** — tela-espelho do relatório): traduzir em `messages/es.json` conforme glossário v0.2.0 + as 3 entradas novas. Regras de sempre: estrutura idêntica ao pt-BR, placeholders/ICU/tags preservados, terminologia do glossário, números só os da fonte.
3. **Reconciliação `report.footerDev` (es):** substituir a forma extensa do SINEP hoje em pt ("…Ética em Pesquisa com Seres Humanos…", incluindo preposições) pela forma aprovada na entrada nova: "Sistema Nacional de Ética en Investigación con Seres Humanos (SINEP)".
4. **Placeholder (decisão 3 da Direção):** `contextForm.cepPlaceholder` — pt `"Ex: CEP/CONEP"` → `"Ex: CEP da sua instituição"`; es `"Ej.: CEP/CONEP"` → `"Ej.: CEP de su institución"`. **pt e es no mesmo commit** (acréscimo do Z, Errata §7). Se a Direção trocar a formulação no aceite do diff, vale a nova redação.
5. **Regeneração da baseline NDTI:** a mudança pt do item 4 altera o DOM pt-BR → rodar o `parity-locale` em modo de atualização, verificar que o **único** diff contra a baseline antiga é o placeholder, e commitar a baseline nova no mesmo commit do item 4, com nota no corpo do commit (baseline regenerada por decisão 3, LOG #47).

## 2. Estrutura de commits (separados, nesta ordem)

- **C1** — glossário v0.3.0 (só `spec/i18n/glossario-es.json`).
- **C2** — leva institucional (`messages/es.json`; inclui a reconciliação de `report.footerDev`).
- **C3** — placeholder pt+es + baseline NDTI regenerada (`messages/pt-BR.json`, `messages/es.json`, `gate/baseline-ndti/*`).

## 3. Critérios de aceite (cadeia completa, re-rodada pela arquitetura)

- `npm run build` ✔ · `verify` 105/105 · `parity` 128/0 · `gate` 64/64 Δ=0
- `i18n-identity` 344/344 (spec não se toca)
- `i18n-no-literal` A+B1+B2+C ✔ (âncoras verbatim — intocadas)
- `i18n-key-parity`: **0 órfãs e 0 ausentes** no padrão; **`npm run i18n:key-parity:strict` verde** (fecha o regime Opção A de construção)
- `parity:locale` 4/4 sobre a baseline **nova**
- Smoke flag-on: `/es` renderiza footer/home/páginas em es com INAEP/SINEP/Guia nas formas decididas; `/` (pt-BR) sem banner e sem nenhuma mudança além do placeholder.

## 4. Vedações

- Não tocar `spec/mariah-spec.json`, números, ids, `matrixVersion`, pt-BR (exceto o placeholder do item 4), âncoras de `disclaimer.ts`.
- Não traduzir `referenciaNormativa` da spec (allowlist).
- `public/inaep-logo.png` **não** entra nesta leva — permanece na pendência P2 (Operador + Z).
- Merge em `main` continua VEDADO (decisão de publicação, Direção — trilha item 11).

## 5. Ao concluir

Aviso no canal com hashes C1–C3 e números da cadeia; a arquitetura re-roda a verificação independente e registra o aceite; em seguida o ciclo entra na etapa de auditoria de conformidade do Z (que incluirá a revisão formal das 3 entradas `proposto` na forma "Investigación").
