# PACOTE DE AUDITORIA — feat/i18n-architecture (para o Z)

**Data:** 2026-09-21 · **De:** Engenharia (Claude Code 4.8, conta MS) · **Para:** Z (auditor independente), via arquitetura (Kimi) e Direção (Fabiano)
**Objeto:** atestado de *Definition of Done* da branch de infraestrutura i18n e dossiê de evidências para o relatório de conformidade do Z (7 seções do A1).
**Rito:** este pacote passa **primeiro pela arquitetura** (confere contra o DoD do memorando §4) e só então segue ao Z — conforme LOG #12.3.

> **Natureza da branch (invariante):** infraestrutura de localidades com **ZERO tradução**. Critério de sucesso: **nada visível muda** em pt-BR. Nenhuma localidade ≠ pt-BR foi preenchida. Logo, os bloqueantes de *conteúdo traduzido* (B1/B3/B4/B5/B8) não têm superfície nesta branch; os relevantes são **B2, B6, B7, B9** (ver §3).

---

## 1. Metadados de auditoria (seção 1 do relatório do Z)

| Campo | Valor |
|---|---|
| Locale auditado | `pt-BR` (único preenchido; demais são rótulos de rota, gated) |
| Branch | `feat/i18n-architecture` |
| HEAD substantivo no envio ao Z | `68fa106` (alias `parity:locale`) — sobre `f3b35bd` (chore version); commits housekeeping (pacote e correções formais) acima, sem efeito sobre código, gates ou evidências |
| Trilha auditável | `git log main..feat/i18n-architecture` — 18 commits substantivos (§7); alias e este pacote entram como housekeeping sobre o HEAD |
| `matrixVersion` (spec) | **2.2.0** (bump de schema; conteúdo da matriz inalterado) |
| `version` (package.json) | 2.2.0 (alinhado ao ciclo — cosmético; `f3b35bd`) |
| sha256 `spec/mariah-spec.json` | `4e03e7a7c8a13aae6043914faf6c79e988ee4d597dd631ffaf9484769459ca10` |
| sha256 `messages/pt-BR.json` | `5da13d9cd9551ad56055af12066731058987a5fb685410e5b040eb3cc323bc4b` |
| sha256 `scripts/i18n-no-literal.ts` | `f22977f033fbc445d58b24b6e2040d7fd0b659deeeffc536267df27c5609d97c` |
| Ferramental | Next.js 16.2.4 (Turbopack), Node 22, `tsx`; gates `verify`/`parity`/`gate`/`i18n-identity`/`i18n-no-literal`/`parity-locale.py`; Node 20 no dev do operador |
| Stack i18n | next-intl 4.14.5, `localePrefix: as-needed`, middleware em `src/proxy.ts`, flag runtime `LOCALES_ENABLED` |

---

## 2. Definition of Done — checklist do memorando §4 (item a item)

| # | Item do DoD | Estado | Evidência |
|---|---|:--:|---|
| 1 | Nota E2-complemento commitada e aprovada pela arquitetura | ✅ | `NOTA_engenharia_E2-complemento_2026-09-20.md`; aprovada em `ACEITE_arquitetura_E2-complemento` (allowlist 344 = 332 + `description`×4 + `motivoEliminatorio`×8) |
| 2 | Baseline NDTI gerada e **congelada** em `gate/baseline-ndti/` | ✅ | `d7e10d5` — 4 rotas normalizadas, imutável |
| 3 | **Zero string pt-BR em JSX** (grep — o Z roda) | ✅ | Formalizado como `i18n-no-literal` **Check A** (parser TS, 31 `.tsx`, 0 literal). Fecha P4 (LOG #7/#8) |
| 4 | `messages/pt-BR.json` fonte única do pt-BR; spec com `i18n` **vazio/ausente** em todos os nós | ✅ | `i18n-identity` (344 nós → `label()` devolve o canônico em pt-BR **e** es); `i18n-no-literal` **B1** (0 valores em campos `i18n`) |
| 5 | `verify` verde; `parity` verde; vetores do gate com saída numérica idêntica | ✅ | `verify` **105/105**, `parity` **128/0**, `gate` **64/64**. Única alteração em `verify-math.ts`: expectativa de `MATRIX_VERSION` 2.1.0→2.2.0, **atômica no bump** (P7, `3c4e9c2`) — matemática intacta |
| 6 | `parity:locale` verde nos 4 itens do 3.2 | 🟡 | `parity-locale.py check` cobre (i)+(ii): **4/4** flag-off idêntico à baseline. (iii) redirect e (iv) flag-on/`lang` cobertos por runtime + construção — ver §5 |
| 7 | `jspdf` removido; CHANGELOG; `matrixVersion` 2.2.0 | ✅ | `93321f5` (0 imports em `src/`; PDF por `window.print()`); CHANGELOG `[2.2.0]`; `matrixVersion` 2.2.0 |
| 8 | `MAINTENANCE.md` com seção i18n | ✅ | `4e2d22f` (flag, campo-canônico, B7, critério DOM-idêntico, política de versão, fluxo `feat/i18n-es`) + guarda no-literal documentado (`e406e68`) |
| 9 | Build standalone com flag off **e** on; nas duas, pt-BR navegável e idêntico | ✅ | Build duplo em runtime: OFF → gated `307`→pt-BR, pt-BR `200`; ON → gated `200`. pt-BR idêntico (DOM) nos dois |
| 10 | Relatório de conformidade emitido pelo **Z** com veredito "aprova" | ⬜ | **Pendente** — é o ato do Z; este pacote o alimenta |

**Resumo:** 8 itens ✅, 1 🟡 (item 6 — cobertura completa mas repartida entre script e runtime; §5), 1 ⬜ (item 10 — ato do Z).

---

## 3. Regra de ouro (B7) e bloqueantes B1–B9 — mapa de conformidade da infra

| Bloqueante | Aplicável agora? | Situação / guarda |
|---|:--:|---|
| **B1** divergência numérica/id vs spec | superfície nula (zero tradução) | Números/ids/`matrixVersion` inalterados: `verify` 105/105, `parity` 128/0, `gate` 64/64, `i18n-identity` 344 (no-op) |
| **B2** chave de mensagem ausente/órfã | parcial | `messages/pt-BR.json` é fonte única; `next-intl` resolve todo `t()`; build verde (chave ausente lança). Só pt-BR existe → sem órfã cruzada. *Paridade de chaves entre locales* vira relevante em `feat/i18n-es* |
| **B3/B4/B5/B8** conteúdo traduzido | **N/A** | Nenhuma localidade preenchida. Âncoras prontas (disclaimer fonte única `disclaimer.ts`); guarda de conteúdo (`i18n-no-literal` B1) armado |
| **B6** paridade flag-off vs baseline NDTI | sim | `parity-locale.py check` **4/4 OK**; baseline imutável (`d7e10d5`) |
| **B7** chave derivada de texto traduzível | sim | `i18n-no-literal` **B1** (campos `i18n`: número/id/versão proibidos) + **B2** (messages: número de corte/teto e `matrixVersion` proibidos). Persistência keyed por **id** (`maria-assessment-state-v2`) — inalterada |
| **B9** `lang` errado / hreflang com flag off | sim | `routing.ts`: `alternateLinks:false`, `localeCookie:false`, `localeDetection:false`. `proxy.ts` redireciona gated→pt-BR com flag off. `lang={locale}` por construção (`layout.tsx:53`). Runtime: OFF sem prefixo servido, gated 307 |

O guarda `i18n-no-literal` lê os tokens proibidos (números de corte, `matrixVersion`) e o conjunto de **ids reais** diretamente da spec — não fixa nenhum número próprio (B7 respeitada no próprio guarda).

---

## 4. Verificações automatizadas (alimenta a seção 3 do relatório do Z)

| Check | Resultado | Evidência / comando |
|---|:--:|---|
| Matemática/estrutura da matriz | **105/105** | `npm run verify` |
| Paridade spec × gabarito v46 | **128 / 0 divergências** | `npm run parity` |
| Vetores de nível/pontuação (A+B) | **64/64** | `tsx scripts/gate-run.ts` |
| `label()` no-op sobre a allowlist | **344/344** (pt-BR e es → canônico) | `tsx scripts/i18n-identity.ts` |
| Zero-literal JSX (Check A) | **OK** (31 `.tsx`, parser TS) | `tsx scripts/i18n-no-literal.ts` |
| Golden-rule campos `i18n` (Check B1) | **OK** (0 campos) | idem |
| Golden-rule messages (Check B2) | **OK** (335 valores; 8 âncoras de id real — informativo) | idem |
| Identidade pt-BR flag-off vs baseline | **4/4 OK** | `python3 scripts/parity-locale.py check` |
| Redirect gated→pt-BR (flag off) | `307` p/ `/`, `/instrucoes`… | build duplo (runtime) |
| Rotas de localidade vivas (flag on) | `200` em `/es`, `/es/instrucoes`, `/zh/validacao` | build duplo (runtime) |
| `lang` correto por rota | por construção `lang={locale}` (`layout.tsx:53`) | inspeção de código |

---

## 5. Cobertura do 3.2 (parity-locale i–iv) e decisão de *wiring* pendente

O `scripts/parity-locale.py` cobre hoje os itens **(i)** build com flag off e **(ii)** identidade DOM das 4 rotas pt-BR vs baseline (**4/4**). Os itens **(iii)** redirect gated→pt-BR e **(iv)** flag-on (rotas vivas + `lang`) estão cobertos por evidência de **runtime** (build duplo: `307`/`200`) somada à amarração estática `lang={locale}`. A cobertura é completa; o que está repartido é a **forma** (script vs. runtime + construção).

**Decisão aberta para a Direção/arquitetura** (não executada — aguarda OK):

- **(a)** criar o alias `npm run parity:locale` (o comando nomeado no DoD passa a existir literalmente); custo nulo, sem mudança de comportamento.
- **(b)** manter `parity-locale` como **passo explícito após o build** na cadeia de verificação (recomendado) em vez de aninhá-lo em `npm run gate`. Motivo: `npm run gate` é *pura lógica* (`tsx`, sem artefato de build), enquanto `parity-locale` consome o `.next` de um build. Aninhar acoplaria o `gate` a um build prévio e mudaria seu contrato — hoje reproduzível sozinho. A cadeia única fica como em §7.

Recomendação da Engenharia: **(a) sim** + **(b) passo explícito**. Se a arquitetura preferir o `gate` como comando único absoluto, faço o aninhamento — é reversível e trivial.

---

## 6. Prova de dentes do guarda (teste negativo, reproduzível)

Em cópia descartável, injetadas 6 violações; `i18n-no-literal` acusou todas e voltou a verde após restauro:

```
✗ [A]  atributo title="…" com literal pt-BR: "Avaliação de risco"
✗ [A]  text-node JSX com literal pt-BR: "Selecione o nível"
✗ [B1] campo i18n: número de corte da matriz: 208
✗ [B1] campo i18n: id de questão: P6.b.2
✗ [B2] messages: número de corte/teto da matriz: 127
✗ [B2] messages: matrixVersion (2.2.0) em texto de UI
→ exit 1 (com violações) · exit 0 (após restauro)
```

---

## 7. Cadeia reproduzível (para o Z rodar)

```
cd ~/Dev/MARIA
git checkout feat/i18n-architecture
git log --oneline main..HEAD          # 18 commits substantivos (+ housekeeping: alias, pacote, correções)
npm ci
npm run build
npm run verify        # 105/105
npm run parity        # 128/0
npm run gate          # 64/64 + identity 344 + no-literal (A/B1/B2)
python3 scripts/parity-locale.py check    # 4/4 flag off

# runtime — build duplo (itens iii/iv do 3.2)
HOSTNAME=127.0.0.1 npx next start -p 3210 &      # flag OFF (padrão)
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://127.0.0.1:3210/es   # 307 -> /
HOSTNAME=127.0.0.1 LOCALES_ENABLED=true npx next start -p 3211 &   # flag ON
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3211/es  # 200
```

**Trilha `main..feat/i18n-architecture` — 18 commits substantivos** (o HEAD no envio é o commit do alias `parity:locale` e, sobre ele, o commit deste pacote — ambos housekeeping, não substantivos):

```
f3b35bd chore: package.json 2.1.0 -> 2.2.0 (alinha ao ciclo i18n)
e406e68 test(i18n): guarda i18n-no-literal no gate — (A) zero-literal JSX + (B) golden-rule
44d16e0 docs(canal): avisos #9-#11 engenharia (passos 6-8), decisão #12
2e9667d feat(i18n): relatorio locale-aware (lang dinamico + font-stack CJK + datas por locale)
93321f5 chore(i18n): remove jspdf (dep morta) + CHANGELOG 2.2.0
4e2d22f docs(i18n): MAINTENANCE.md — secao de internacionalizacao
8e99144 docs(canal): aviso #7 engenharia, decisão #8 — passos 6-8 liberados
96477fb docs(governanca): ciclo i18n — despacho, pareceres, memorandos, canal
3c4e9c2 feat(i18n): campo i18n opcional na spec + helper label() + bump matrixVersion 2.2.0
c233095 feat(i18n): extrai skip link do layout (fecha conformidade zero-literal JSX)
8a874de feat(i18n): extrai as 3 paginas (instrucoes/transparencia/validacao) para messages
1b4a995 feat(i18n): extrai tela de Results para messages
07087ac feat(i18n): extrai avaliacoes e HelpPanel para messages (rich/ICU)
9dbf172 feat(i18n): extrai dialogos Restart/ClearScope para messages (plural ICU + t.rich)
62778a1 feat(i18n): extrai formularios do wizard para messages (EntryFilter, ContextForm)
cde3470 feat(i18n): extrai chrome coberto por parity para messages (Footer, StepIndicator, VersionSelector)
c2b0706 feat(i18n): estrutura next-intl (infra, zero traducao)
d7e10d5 chore(i18n): baseline NDTI + parity-locale (infra, zero traducao)
```

---

## 8. Ressalvas e decisões abertas (transparência)

1. **P2** (fora deste pacote) — disposição de `consentimento-re-consentimento.patch` e `public/inaep-logo.png`: pendência de Operador + Z, sem efeito sobre a infra i18n.
2. **Wiring `parity:locale`** — decisão de §5 (recomendação: alias + passo explícito). Micro-commit pronto quando a arquitetura decidir.
3. **Paridade de chaves entre locales (B2 pleno)** — só ganha superfície quando um segundo locale for preenchido; entra como check de CI na `feat/i18n-es` (não é exigível nesta branch, que só tem pt-BR).
4. **Fontes CJK (E3)** — sem `jspdf`, o PDF é `window.print()` sobre as fontes do sistema; o template já tem font-stack com fallback `Noto Sans SC`. Limitação declarada (correção factual §0.3 do parecer Z): dispositivo sem fonte CJK renderiza tofu — indecidível client-side; não é bug.
5. **`verify-math.ts` alterado** — única mudança é a expectativa de `MATRIX_VERSION` (2.1.0→2.2.0), atômica ao bump (P7). Sugestão estrutural do Z (A1) de derivar a versão de fonte única fica registrada para ciclo futuro; não bloqueia.

---

## 9. O que falta para o merge

- **Item 10 do DoD:** relatório de conformidade do Z (7 seções do A1), veredito "aprova".
- **Merge em `main`:** vedado por processo (a vitrine serve `main`) — só com autorização da **Direção**. Destino imediato pós-auditoria: manter a branch aprovada como base das branches de idioma (`feat/i18n-es` etc.).

---

*Engenharia atesta que os 9 itens executáveis do DoD estão cumpridos e reproduzíveis em verde; o item 10 é o ato do Z. Aguardando conferência da arquitetura contra o definition of done antes do envio.*
