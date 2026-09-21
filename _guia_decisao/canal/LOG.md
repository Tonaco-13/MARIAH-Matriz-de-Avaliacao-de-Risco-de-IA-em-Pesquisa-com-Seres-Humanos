# LOG — canal triplo (append-only · mais recente no topo)

> Formato: `### #N · AAAA-MM-DD HH:MM · DE → PARA · [tipo]`
> Numeração sequencial única; nada se apaga; correção = mensagem nova citando a anterior.

---

### #12 · 2026-09-21 16:35 · Kimi → Engenharia (via Operador) · [decisão]

**Passos 6–8 verificados independentemente e aceitos** (commits `4e2d22f`, `93321f5`, `2e9667d` conferidos; verify 105/105 e gate 344/344 re-rodados pela arquitetura; jspdf fora do package.json; MAINTENANCE com a seção i18n; datas locale-aware em `utils.ts:652/872` — **P6 fechado**). Respostas aos dois pontos:

1. **P8 — atenção a um drift de escopo entre teu #7 e tua pergunta de agora:** no #7 propuseste formalizar o **grep zero-literal JSX**; na pergunta, descreveste um **guarda da regra de ouro** (número/id/matrixVersion não vira string traduzível). São **dois checks distintos e ambos necessários**. Decisão: um único `scripts/i18n-no-literal.ts` no gate com **duas verificações nomeadas** — (A) *zero-literal*: nenhum literal pt-BR de UI em JSX (B2); (B) *golden-rule*: nenhuma chave de `messages/*.json` nem campo `i18n` da spec casa padrão numérico/id de questão/matrixVersion (B1/B7). Nomeadas separadamente na saída, para o relatório do Z ler limpo. **Executa primeiro.**
2. **package.json `version`:** alinha para **2.2.0** em commit `chore` próprio, minúsculo. A divergência package/spec é exatamente o tipo de pergunta que a auditoria faria; a política continua governando o `matrixVersion`, e o commit registra que o alinhamento é cosmético de versão, não de conteúdo. **Depois do P8.**
3. Em seguida: monta o DoD completo (checklist do memorando, item 4) + pacote de auditoria do Z — **me traz antes de enviar ao Z**, que eu confiro contra o definition of done.

---

### #11 · 2026-09-21 16:28 · Engenharia → canal · [aviso]

**Bloco 3/Passo 8 — relatório locale-aware (`2e9667d`).** generateReportHTML/generateReportText recebem locale (default pt-BR): `<html lang>` dinâmico, font-stack com Noto Sans/Noto Sans SC (fallback CJK) e datas via `toLocaleDateString(locale)` (utils.ts:652/872 — fecha P6). Results passa o locale ativo (useLocale). Em pt-BR o relatório é byte-a-byte o de antes; o relatório não é pré-renderizado, logo fica fora do parity (coberto por e2e). **Bloco 4/Passo 8 — build duplo flag off↔on (runtime, sem commit):** mesmo build, OFF → gated 307→pt-BR e pt-BR 200; ON (`LOCALES_ENABLED=true`) → gated 200. Flag puramente runtime confirmada. Evidência por bloco: build ok · verify 105/105 · parity 128/0 · gate 64/64 + i18n-identity 344 · parity-locale 4/4 (flag off). *(texto da Engenharia, transcrito pelo Operador)*

---

### #10 · 2026-09-21 16:25 · Engenharia → canal · [aviso]

**Bloco 2/Passo 7 — remoção do jspdf + CHANGELOG (`93321f5`).** jspdf removido das dependências (0 imports em src/; o relatório usa `window.print()`). CHANGELOG ganha `[2.2.0]` — infraestrutura de i18n. Build/gates verdes pós-remoção. Superfície de dependências menor, sem impacto funcional. *(texto da Engenharia, transcrito pelo Operador)*

---

### #9 · 2026-09-21 16:20 · Engenharia → canal · [aviso]

**Bloco 1/Passo 6 — MAINTENANCE.md (`4e2d22f`).** Documentada a arquitetura i18n: flag `LOCALES_ENABLED` (runtime, off por padrão), modelo campo-canônico + `label()`, regra de ouro B7, critério DOM-idêntico (parity-locale + i18n-identity 344), política de matrixVersion e fluxo futuro (`feat/i18n-es`). Sem mudança de código de produção. Gates verdes no commit. *(texto da Engenharia, transcrito pelo Operador)*

---

### #8 · 2026-09-21 16:15 · Kimi → Engenharia (via Operador) · [decisão]

**Passos 6–8 LIBERADOS.** Antes de liberar, a arquitetura re-rodou os gates independentemente no `3c4e9c2`: verify **105/105** ✔ · parity **0 divergências** ✔ · gate com `i18n-identity` **344/344 no-op provado** (pt-BR e es → canônico) ✔. Condições 1 e 2 do Passo 5 satisfeitas; **P5 sancionada** (allowlist 344 documentada no cabeçalho do script e provada no gate). **P4 resolvida pela proposta da Engenharia:** inventário não entrou no 4a; aceito formalizar a conformidade zero-literal como `scripts/i18n-no-literal.ts` no gate (entra no Passo 9) — o Z decide na auditoria se o conjunto (nota E2 + grep formalizado + identity 344) é suficiente. **Ordem liberada** (conforme plano da Engenharia): (1) MAINTENANCE.md seção i18n (cond. 3.3); (2) remoção `jspdf` + CHANGELOG; (3) relatório locale-aware: `lang` dinâmico + font-stack CJK + datas (P6, `utils.ts:650/868`); (4) build duplo flag off/on. Sandbox verde a cada item; QUADRO + aviso no LOG por bloco; pacote do Z ao final.

---

### #7 · 2026-09-21 16:05 · Engenharia → canal · [aviso]

**Passo 5 enxuto entregue e verde** (`3c4e9c2`). Condição 1 provada: `scripts/i18n-identity.ts` no gate confirma `label()` no-op sobre a **allowlist de 344** (pt-BR e es → canônico; decomposição 332 + `description`×4 + `motivoEliminatorio`×8 bate; allowlist documentada no cabeçalho do script). Condição 2 (P7): `verify-math` atualizado para 2.2.0 **no mesmo commit** do bump — verify **105/105**. Demais gates: parity 128/0 · gate 64/64 · parity-locale 4/4. **P1 fechado** (`96477fb`, acervo versionado). **P4:** `inventory-strings.ts` não entrou no 4a; inventário está na Nota E2 (`d7e10d5`) e a conformidade zero-literal foi provada por grep — proponho formalizá-la como `scripts/i18n-no-literal.ts` no gate do Passo 9. **P6 (datas):** aceito, entra no Passo 6. *(texto da Engenharia, transcrito pelo Operador; #7 cedido pela numeração do #6 — ver nota no #6)*

---

### #6 · 2026-09-21 15:55 · Kimi → Engenharia (via Operador) · [decisão]

**Passo 5 enxuto APROVADO com 2 condições** (proposta da Engenharia na mensagem pré-limite de tokens): tipos com `i18n` opcional + helper `label()` + bump 2.2.0, **sem** religar componentes agora (no-op com zero tradução; religação + threading de locale no `utils.ts` migram formalmente para a `feat/i18n-es` — emenda registrada no memorando dela). Condições: (1) teste/script de **identidade** provando `label(...)` ≡ canônico sobre a allowlist dos 344 nós (P5 sancionada sobre esse artefato), rodando no gate — a propriedade no-op sai **provada**, não afirmada; (2) **P7**: `verify-math.ts` atualizado **no mesmo commit** do bump (verify hoje 104/105 por causa disso). P6 (datas) aceito no Passo 6 da Engenharia, pré-auditoria. Z pode vetar na auditoria de conformidade. Handoff completo: `mensagens/HANDOFF_operador_passo5_2026-09-21.md`. **Nota de numeração:** a confirmação de recebimento da Engenharia (pedida em H2 como #6) passa a ser **#7** — esta decisão tomou o #6.

---

### #5 · 2026-09-21 15:05 · Kimi → todos · [aviso]

**Verificação estática da infra em andamento** (pedida pela Direção durante a pausa de tokens da Engenharia) — relatório completo em `../VERIFICACAO_arquitetura_infra_2026-09-21.md`. Veredito: **construção saudável, nenhum desvio de arquitetura.** Pontos:
- ✅ routing/proxy/baseline/parity conforme o memorando; extração 4a+4b em diffs limpos; 4c em trabalho seguindo o modelo campo-canônico.
- 🟡 verify 104/105 — falha única é a expectativa hardcoded `MATRIX_VERSION=2.1.0` vs bump 2.2.0 em trabalho. **O commit 4c deve atualizar `verify-math.ts` no mesmo diff (P7).**
- ⚠ Escopo quase caindo do quadro: datas fixas `toLocaleDateString('pt-BR')` ×2 (`utils.ts:650/868`) — registrado como **P6**; memorando item 2.6.
- ⚠ Confirmar se `inventory-strings.ts` entrou no 4a (P4 do quadro anterior).
- Processo: QUADRO estava parado em 16:12 apesar de 7 commits — regra do canal é atualizar na mesma entrega; atualizado pela arquitetura.

---

### #4 · 2026-09-20 16:12 · Kimi → Operador/Engenharia · [decisão]

**Granularidade do Passo 4 (extração de strings): aprovada a Opção 1 (2 blocos: componentes / páginas)**, com 3 condições vinculantes:
1. `scripts/inventory-strings.ts` entra no commit 4a (aceite, emenda 2.1) — saída do inventário commitada como artefato para o Z auditar contagens (B2).
2. Cada bloco só chega ao operador com sandbox verde: build + parity-locale (4 itens) + verify/parity/gate + grep zero-pt-BR no escopo do bloco.
3. O contrato da spec (`label()` + allowlist dos 344 nós + bump `matrixVersion 2.1.0→2.2.0` + CHANGELOG) vai em **commit próprio isolado** (4c), separado dos diffs de extração de UI — três diffs limpos para o Z: componentes, páginas, contrato-spec.

Verificação da arquitetura sobre Passos 2–3: baseline NDTI congelada corretamente (`d7e10d5`, 4 rotas em `gate/baseline-ndti/`); `c2b0706` respeita todos os vinculantes (localePrefix as-needed, flag runtime em `proxy.ts`, sem cookie/hreflang — B9; verify 105/105, parity 128/0, gate 64/64). **P1 segue aberta**: `_guia_decisao/` continua untracked — rodar o Bloco 1 do handoff #3 junto ao próximo ciclo de terminal.

---

### #3 · 2026-09-20 15:38 · Kimi → Operador · [handoff]

Operador está em sessão com o Claude no terminal. Handoff completo (mensagem para colar + Bloco 1 commit de governança + Bloco 2 reporte de untracked) em `mensagens/HANDOFF_operador_2026-09-20.md`. Destrava P1; P2 depende do retorno. Confirmações de canal pedidas em #2 passam a ser #4 (Engenharia) e #5 (Z).

---

### #2 · 2026-09-20 15:34 · Kimi → todos · [aviso]

Canal triplo aberto a pedido da Direção. Protocolo em `README.md`, estado vivo em `QUADRO.md`. Primeira rodada de pendências (P1–P5) já lançada no quadro, derivadas do aceite de hoje. Peço à Engenharia e ao Z que confirmem recebimento com um `aviso` curto (#3, #4) para validar o fluxo.

---

### #1 · 2026-09-20 15:34 · Kimi → Engenharia · [handoff]

Contexto do ciclo em um parágrafo, para quem chegar agora: nota E2-complemento verificada e **aprovada com 2 emendas** (`ACEITE_arquitetura_E2-complemento_2026-09-20.md`). Achado principal da verificação: a contagem 332 da spec é **exata** (`pergunta`137+`dica`137+`texto`19+`descricao`18+`nome`14+`label`4+`subtitulo`3), mas há **+12 nós narrativos** user-facing fora dela (`description`×4 níveis I–IV, `motivoEliminatorio`×8) — entram na allowlist do `label()`; `obs`×1 excluído por decisão. Autorizado o 1º commit de extração **depois** da baseline NDTI congelada e da árvore limpa (P1, P2 no QUADRO).
