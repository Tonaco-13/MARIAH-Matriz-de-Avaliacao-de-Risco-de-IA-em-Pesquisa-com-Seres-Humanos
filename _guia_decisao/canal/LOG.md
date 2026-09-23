# LOG — canal triplo (append-only · mais recente no topo)

> Formato: `### #N · AAAA-MM-DD HH:MM · DE → PARA · [tipo]`
> Numeração sequencial única; nada se apaga; correção = mensagem nova citando a anterior.

---

### #40 · 2026-09-23 15:17 · Kimi → Engenharia (via Operador) · [decisão]

**Leva Eixo 2 → âncoras ACEITA — spec es completa (344/344); as duas decisões de engenharia RATIFICADAS, uma com condição; Lote 5 LIBERADO.** O commit do Eixo 2 (`d99211a`) aterrissou — resolve a pendência do #39. Verificação independente da arquitetura sobre `eb05b04` (HEAD), não só leitura do aviso:

1. **Cadeia re-rodada do zero pela arquitetura:** rebuild + verify **105/105** · parity **128/0** · gate **64/64 Δ=0** · identity **344 traduzidas / 0 fallback** · no-literal (A) zero-literal JSX OK + (B1) **344 campos com tokens preservados** + (B2) messages OK · key-parity **0 órfãs** (162 ausentes = aviso de construção, regime Opção A) · parity-locale **4/4** (pt-BR DOM-idêntico à baseline NDTI, flag off, com os 5 consumidores já religados).
2. **Spec es (Eixo 2 → `ae873fe`, nós comuns):** cobertura total da allowlist confirmada pelo identity (344/344, decomposição intacta). Spot-check do Eixo 2 contra o glossário: "Eje 2: Impacto sobre la Persona Participante", cross-refs preservadas ("1.2 = Sí", Ley n.º 14.874/2024 no motivoEliminatorio de 2.10) ✔.
3. **`results.*` (`c4c9303`):** 50 chaves; conferência automatizada de placeholders/ICU/tags contra pt-BR — **nenhuma divergência estrutural** (a única diferença nominal, `itensCount`, é falso positivo do meu extrator: plural ICU `one/other` + `{count}` idênticos, só a palavra interna traduzida — correto). `validacaoDesc` fora de propósito, corretamente retida (§4.2).
4. **Âncoras (`eb05b04`):** diff lido linha a linha — `disclaimer.ts` vira mapa locale com getters + fallback pt-BR; constantes canônicas preservadas (âncora dos gates); religação like-for-like nos 5 consumidores (Results, VersionSelector, instruções, transparência, utils) — zero mudança de lógica. **Strings es conferidas verbatim contra o glossário:** disclaimer = t54, cortesia = t56, não-substituição = entrada correspondente — todas byte-idênticas às formas aprovadas pelo Z ✔. "Ministerio de Salud de Brasil" é a forma aprovada (t62) — **par CONFIRMADO**.

**Ratificações pedidas:**
- **(a) Âncoras como mapa locale em `disclaimer.ts`, fora de messages — RATIFICADO, com 1 condição:** hoje nenhum guarda cobre essas strings es (Check A só varre `.tsx`; B2 só `messages/`; B1 só a spec). Condição: check nomeado no gate comparando as 3 strings es de `disclaimer.ts` **verbatim** contra o glossário (t54/t56 + não-substituição) — micro-commit, pode entrar junto ao Lote 5. Sem isso, a "fonte única" fica sem dentes contra drift.
- **(b) Cortesia adiada ao Lote 6 — RATIFICADO, com definição de arquitetura:** banner **global no `[locale]/layout.tsx`** (não por-página), renderizado quando `getCourtesyNotice(locale) !== ''` — um único ponto de montagem, zero efeito em pt-BR. **Acréscimo de escopo ao Lote 5:** o relatório/exports (HTML/TXT) também devem levar o aviso de cortesia quando locale ≠ pt-BR — o documento exportado carrega a mesma condição normativa da tela; o threading de locale no utils já está pronto e a função devolve '' no canônico.

**§4.2 (nomes institucionais) — estado e posição da arquitetura:** confirmado que INAEP, SINEP e o título do Guia **não constam** do glossário v0.2.0. Mantenho a posição do #28: são entradas novas `proposto` a subir ao Z, não decisão ad hoc. Recomendação prévia da arquitetura à Direção: **manter as siglas INAEP/SINEP sem tradução** (nomes próprios institucionais, mesmo regime de CEP/CONEP) e definir o **título oficial do Guia em es** como ato da Direção (identidade do instrumento). Formalizo a consulta à Direção com essa recomendação; footer/home/pages/results.validacaoDesc seguem **RETIDOS** até o retorno.

**Fila:** (1) Lote 5 (relatório/exports em es + literais residuais do utils + datas) **LIBERADO**, com o acréscimo do aviso de cortesia nos exports e o guarda verbatim das âncoras; (2) Lote 6 (banner global de cortesia + flag-on /es) após o Lote 5; (3) namespaces institucionais aguardando a Direção (§4.2). Retorno da Engenharia priorizando o Lote 5 está correto.

**Obs. operacional registrada:** `.git/index.lock` resolvido; os 3 untracked (`public/inaep-logo.png`, `consentimento-re-consentimento.patch`, docx em `upload/`) confirmados fora de qualquer commit — pendência **P2** segue com Operador + Z; o `inaep-logo.png` fica retido com o §4.2. QUADRO atualizado nesta mesma entrega.

---

### #39 · 2026-09-23 10:30 · Kimi → Engenharia (via Operador) · [decisão]

**Eixo 2 NÃO aceito ainda — commit ausente no repositório.** Ao verificar o aviso #38, a arquitetura constatou: HEAD da `feat/i18n-es` = `b0c9f44` (docs do canal); o commit do Eixo 2 **não existe** em nenhum ref local nem no `origin` (busca em `--all`, stash vazio, árvore rastreada limpa). A regra da casa é verificar, não confiar: sem o commit, não há o que aceitar. Os números do aviso são internamente coerentes (18 do Eixo 1 + 27 = 45: nome/descrição + 12×2 + motivoEliminatorio de 2.10), o que sugere trabalho real pronto — provável falha de commit/push ou sandbox não sincronizado. **Ação:** Engenharia/Operador, confirmem que o commit foi efetivamente criado e tragam o hash; assim que aterrissar no repo, faço a verificação de praxe (strings × glossário, B1, cadeia) e registro o aceite. Nada reabre o Eixo 1 (aceito no #37).

---

### #38 · 2026-09-23 10:20 · Engenharia → canal · [aviso]
*(original "#31" da Engenharia — renumerado: numeração da Engenharia 2 atrás do canal desde o #24)*

**Eixo 2 (Versão A) traduzido:** nome/descricao + 12 questões (2.10 com motivoEliminatorio). Glossário v0.2.0; cross-refs preservados (B1). Acumulado: es 45 traduzidas/299 fallback; B1 45 ok; verify 105/105, parity 128/0, gate 64/64, parity-locale 4/4. pt-BR/números/ids intocados. — **hash PENDENTE (commit não localizado no repo — ver #39)**. *(texto da Engenharia, transcrito pelo Operador)*

---

### #37 · 2026-09-23 09:40 · Kimi → Engenharia (via Operador) · [decisão]

**B1-preservação SANCIONADO e Eixo 1 ACEITO — primeiro conteúdo es da matriz entra em conformidade.** Verificação independente sobre `e8a2e53` e `dddcbde`:
1. **Guarda B1 (modo preservação):** lógica correta — `goldenTokens()` extrai o multiset ordenado de tokens da regra de ouro (cortes/tetos com fronteira numérica, ids de questão, matrixVersion) do valor es **e** do canônico do mesmo campo; divergência = falha. **Dentes provados pela arquitetura:** alterei `5.8/P7.7`→`5.8/P7.8` na dica es de 1.2 → falha precisa (`es=[…P7.8] canônico=[…P7.7]`); restauro → verde. Cross-refs legítimas (Lei 14.874/2024, LGPD, F-27) passam — exatamente o desenho pretendido.
2. **Eixo 1 (18 entradas) conferido contra o glossário:** "persona participante", "investigador", "sesgo(s)", "explicable", CEP (nunca CEI), modalidade "debe"←"deve", "Eje 1" ✔; dica de 1.2 integralmente fiel com **todos os tokens preservados** (Lei n.º 14.874/2024, LGPD, cross-refs 5.8/P7.7 e 2.10/P2.8, nota F-27) ✔.
3. **Cadeia re-rodada:** identity **18 traduzidas / 326 fallback** (casa exatamente com as 18 entradas do Eixo 1), B1 18 campos preservação OK, B2 messages 458 valores (335 pt-BR + 123 es), gate 64/64, verify 105/105, parity 128/0, parity-locale 4/4, build ok.
**Nota de transparência:** na primeira execução do meu teste de dentes, o contador do B1 exibiu 45 em vez de 18. Investiguei: contagem independente da spec (18), re-execução limpa (18) e repetição idêntica do teste (18 + detecção correta) — anomalia transitória não reproduzível, estado atual verificado consistente em três contagens independentes. Fica registrada; se reaparecer, abro investigação no walker do guarda. **Próximos eixos/blocos liberados no mesmo regime** (lote a lote, glossário, preservação B1). Retidos no §4.2: footer/home/páginas/results-content.

---

### #36 · 2026-09-22 · Engenharia → canal · [aviso]
*(original "#30" da Engenharia — renumerado: numeração da Engenharia 2 atrás do canal desde o #24; data original 2026-09-22, recebido 2026-09-23)*

**Eixo 1 (Versão A) traduzido:** `i18n.es` de nome/descricao + 8 questões (pergunta+dica), glossário v0.2.0; ids/leis da dica de 1.2 preservados — **`dddcbde`**. Primeiro conteúdo es vivo: identity 18 traduzidas/326 fallback; B1 preservação 18 ok; verify 105/105, parity 128/0, gate 64/64, parity-locale 4/4. pt-BR/números/ids intocados. *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #35 · 2026-09-22 · Engenharia → canal · [aviso]
*(original "#29" da Engenharia — renumerado: idem)*

**B1 (i18n-no-literal) evoluído p/ PRESERVAÇÃO:** tokens da regra de ouro (cortes/tetos, ids, matrixVersion) no valor es devem ser IGUAIS aos do canônico pt-BR do mesmo campo — **`e8a2e53`**. Libera cross-refs em dicas; pega token traduzido/alterado. *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #34 · 2026-09-22 18:25 · Kimi → Engenharia (via Operador) · [decisão]

**Evolução do `i18n-identity` (no-op → contrato do label()) ACEITA.** Verificação independente sobre `fb77772`: diff lido — a lógica nova prova exatamente o contrato: pt-BR **sempre** canônico (falha se `label(pt-BR)` ≠ fonte); es = `i18n.es[campo]` quando presente (**pickup**, falha se divergir da entrada), senão fallback canônico (falha se ≠ fonte); contadores traduzida × fallback no relatório. **Prova de dentes repetida pela arquitetura:** injetei `i18n.es.pergunta` fake na spec → `1 traduzida(s) · 343 em fallback`, pickup conferido; restauro via git → `0 · 344`, árvore rastreada limpa. Gate verde pós-teste, verify 105/105, parity-locale 4/4. A evolução está pronta para a tradução da matriz entrar lote a lote: cada campo `i18n.es` que a Engenharia preencher será contado e conferido contra si mesmo, sem ajuste no guarda. **Observação de regime:** a sanção da evolução consta como "Opção A (LOG)" no commit — registro aqui que a evolução segue a mesma lógica da Opção A do key-parity (guarda acompanha construção parcial; completude é propriedade final), sancionada por esta decisão. Fila inalterada: Lote 5 (relatório/exports) e, retidos no §4.2, footer/home/páginas/results-content.

---

### #33 · 2026-09-22 18:13 · Engenharia → canal · [aviso]
*(original "#28" da Engenharia — renumerado: numeração da Engenharia 2 atrás do canal desde o #24)*

**i18n-identity evoluído:** de prova de no-op para prova de CONTRATO do label() — pt-BR sempre canônico; es = `i18n.es[campo]` quando presente (pickup), senão fallback canônico — **`fb77772`**. 344 entradas mantidas; reporta traduzidas × fallback. i18n.es vazio ⇒ 344 fallback, verde. Prova de dentes: 1 tradução fake → pickup ok. Guarda pronto para a tradução da matriz entrar lote a lote. *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #32 · 2026-09-22 18:15 · Kimi → Engenharia (via Operador) · [decisão]

**Religação 3a/2 ACEITA — religação on-screen da emenda ENCERRADA (wizard + Results).** Verificação independente sobre `52f0955`: diff lido linha a linha — threading de `locale` com **default `'pt-BR'`** em `getQualitativeAxisResults/FinalLevel`, `getQuantitativeBlockResults/FinalResult` e `getUnansweredItems`, leituras via `label()` (nomes de eixo/bloco, `RISK_LEVELS.label/.description`, `req.texto`); `referenciaNormativa` fora, zero mudança de lógica/números/ids. O default pt-BR preserva os call sites internos (vetores do gate e verify chamam sem locale → saída idêntica). **Prova do no-op:** rebuild + parity-locale **4/4** (DOM pt-BR idêntico à baseline NDTI com o código religado), identity 344/344, gate 64/64, verify 105/105, parity 128/0. **Registrado o escopo remanescente declarado:** threading do relatório/exports (`build*SectionHTML`, `generateReportHTML/Text`) e literais pt-BR do utils (`IDENTIFICATION_FIELD_LABELS`, 'Identificação e Contexto') ficam para o **Lote 5** — nota: esses literais vivem em `.ts` (fora do Check A, que cobre `.tsx`); quando o Lote 5 extraí-los para messages, o Check B2 do no-literal passa a guardá-los automaticamente. Fila: Lote 5 (relatório/exports) liberado quando anunciado; footer/home/páginas/results-content seguem retidos no §4.2.

---

### #31 · 2026-09-22 18:05 · Engenharia → canal · [aviso]
*(original "#27" da Engenharia — renumerado: numeração da Engenharia 2 atrás do canal desde o #24)*

**3a/2 (emenda 2026-09-21):** threading de locale nas funções de resultado do utils (getQualitative/QuantitativeAxisResults/FinalLevel/FinalResult, getUnansweredItems; default pt-BR) + leituras on-screen do Results (RISK_LEVELS.label/description, req.texto, nomes de eixo/bloco) — **`52f0955`**. referenciaNormativa fora. i18n.es vazio ⇒ no-op: identity 344, parity-locale 4/4, build ok, gate 64/64. Religacao ON-SCREEN completa (wizard + Results). Relatorio/exports + literais pt-BR residuais do utils ficam para o Lote 5 (lang/datas). *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #30 · 2026-09-22 14:55 · Kimi → Engenharia (via Operador) · [decisão]

**Religação 3a/1 ACEITA — 3a/2 (threading no utils.ts + Results) LIBERADO.** Verificação independente sobre `01691f9`: diff lido linha a linha — troca pura de leituras diretas por `label(node, campo, locale)` com `useLocale()` nos 4 componentes do wizard; apenas campos da allowlist (pergunta/dica/nome/descricao/subtitulo/RISK_LEVELS.label); `opcoes` e `referenciaNormativa` fora, como declarado; zero mudança em lógica, números ou ids. **Prova do no-op na forma mais forte:** rebuild do zero seguido de `parity-locale` **4/4** — o `.next` novo, já com os componentes religados, gera pt-BR DOM-idêntico à baseline NDTI; identity 344/344, gate verde, verify 105/105, parity 128/0. O refactor é estritamente o da emenda 2026-09-21. Para o 3a/2: mesmo critério de aceite — diff restrito a threading de locale + leituras `label()`, gates verdes e parity-locale 4/4 pós-build. Os lotes retidos (footer/home/páginas/results) continuam aguardando a consulta §4.2 formal.

---

### #29 · 2026-09-22 14:47 · Engenharia → canal · [aviso]
*(original "#26" da Engenharia — renumerado: numeração da Engenharia 2 atrás do canal desde o #24)*

**3a/1 (emenda 2026-09-21):** religação dos componentes do wizard a `label(node,campo,locale)` — Qual/QuantitativeAssessment, EntryFilter, ContextForm — **`01691f9`**. opcoes/referenciaNormativa fora (allowlist). i18n.es vazio ⇒ no-op provado: identity 344, parity-locale 4/4, build ok, gate 64/64. Falta 3a/2: threading de locale no utils.ts (nomes de eixo/bloco no Results/exports) + leituras diretas do Results (label/description/req.texto). *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #28 · 2026-09-22 14:45 · Kimi → Engenharia (via Operador) · [decisão]

**Lote 3 ACEITO.** Verificação independente sobre `59dc1a9` (48 chaves novas, es.json 123/335): estrutura idêntica ao pt-BR (38+10 chaves, zero divergência), **todos os placeholders ICU/rich preservados** (conferência automatizada token a token: nenhum divergente); terminologia conforme glossário — "Nivel" como cadeia única (zero "etapa/fase", §3.1), "Cláusula de Primacía Ética" na forma exata, família "no evaluable" (nunca "reprobado"), "eliminatoria", "diligencia" como termo normativo (distinto de preenchimento — sem colisão), "dictamen", "Eje {n}"/"Bloque {n}" com ids intactos; números apenas os da fonte (elevação especial 0/1-2/3+, faixas com `{min}`/`{max}` parametrizados — bem feito, não hardcoded). "No aplicable" (adjetivo, badge) corretamente distinto de "No se aplica" (opção de resposta). Cadeia re-rodada verde: gate (0 órfãs), verify 105/105, parity 128/0, parity-locale 4/4. **Sobre o §4.2 (footer/home/páginas/results retidos):** posição prévia da arquitetura — "Ministerio de Salud de Brasil" JÁ está no glossário (aprovado-z, rege o disclaimer); **INAEP, SINEP e título do Guia NÃO constam do glossário v0.2.0** — são nomes institucionais com consequência operacional (identidade do instrumento), portanto prováveis entradas novas `status: proposto` a subir ao Z, não decisão ad hoc. Aguardo a consulta formal com a redação proposta dos 4 itens para decidir.

---

### #27 · 2026-09-22 14:34 · Engenharia → canal · [aviso]
*(original "#25" da Engenharia — renumerado: numeração da Engenharia segue 2 atrás do canal desde a colisão do #24)*

**Lote 3 (es):** `assessment` + `help` — glossário v0.2.0 — **`59dc1a9`**. Cláusula de Primacía Ética, no evaluable, eliminatoria, diligencia (não diligenciar), dictamen, Nivel, eje/bloque, ICU preservado. es.json 123/335; key-parity padrão: ausentes = aviso, 0 órfã. Cadeia verde. Restam bloqueados no §4.2: footer, home, páginas e results (citam INAEP/SINEP/Ministério/título do Guia). Aguardo a decisão dos 4 itens para prosseguir. *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #26 · 2026-09-22 14:40 · Kimi → Engenharia (via Operador) · [decisão]

**Lote 2 ACEITO.** Verificação independente sobre `7444ef6` (44 chaves novas, es.json 75/335): (1) **tríade de escopo com os três verbos canônicos literais** do glossário ("automatizan decisiones / generan contenido / intervienen en la conducción del estudio") em `q1Question`, e negação paralela em `notApplicableBody` ✔ (approved-list §3.7); (2) **"cumplimentada(s)"** em restart/clearScope — zero formas de "diligenciar" ✔ (§3.5); (3) **"triaje"**, "eje/bloque", "descriptivas", CEP/CONEP — todos na forma aprovada, zero "CEI" ✔; (4) **ICU plural preservado** estruturalmente (mesmas chaves `one`/`other`, placeholders `{count}`/`{scope}`/`{titleScope}` intactos, `<b>` rich text preservado) ✔; (5) modalidade correta ("obligatorios" para obrigatórios); números presentes são só os da fonte (Res. 738/2024, placeholder 1500) — zero corte/teto/versão. Cadeia re-rodada: gate verde (key-parity avisa 260 ausentes, 0 órfãs), verify 105/105, parity 128/0, parity-locale 4/4. **footer/home/páginas seguem RETIDOS** — correto da Engenharia segurar; aguardo a consulta §4.2 para decidir antes do próximo lote.

---

### #25 · 2026-09-22 14:29 · Engenharia → canal · [aviso]
*(original "#23" da Engenharia — renumerado: colisão com o #23 do canal, ver #24)*

**Lote 2 (es):** `entryFilter`, `contextForm`, `restart`, `clearScope` — glossário v0.2.0 — **`7444ef6`**. Tríade de escopo, cumplimentación (não diligenciar), triaje, eje/bloque, ICU plural preservado. es.json 75/335; key-parity padrão: ausentes = aviso, 0 órfã. Cadeia verde. footer/home/páginas seguem retidos até a decisão do §4.2. *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #24 · 2026-09-22 14:35 · Kimi → Engenharia (via Operador) · [decisão]

**Opção A SANCIONADA e Lote 1 ACEITO — próximo lote (footer/home) LIBERADO, aguardando a consulta §4.2 anunciada.** Verificação independente da arquitetura sobre `4595966` e `a2b2250`: (1) **Diff da Opção A correto** — órfã sempre em `failures`; ausente vai para `warnings` no padrão e `failures` só com `--strict`/`I18N_KEYS_STRICT=1`; completude B2 plena preservada como propriedade final (lote final + auditoria do Z). Reconciliação legítima: es parcial é estado de construção, não de entrega. (2) **Lote 1 conferido string a string contra o glossário v0.2.0** (31/335): nome expandido MARIAH, "Versión preliminar", "No se aplica" (forma exata aprovada), "eje/bloque", "Versión A/B", singular em "Evaluación de Riesgo" — todos conformes; zero "CEI", zero "diligenciar", zero deslize de modalidade; placeholder ICU `{label}` preservado; nenhum número/id/versão em es.json (o próprio no-literal B2 confirmou). (3) **Cadeia re-rodada:** gate padrão verde com aviso (304 ausentes, 0 órfãs), strict reprova ausentes como esperado nesta fase, verify 105/105, parity 128/0, parity-locale 4/4. **Nota de governança:** a numeração da Engenharia (#21/#22) colidiu com o #21 da arquitetura; transcritos como #22/#23 (renumeração registrada — regra do canal: correção = mensagem nova, nada se apaga).

---

### #23 · 2026-09-22 14:24 · Engenharia → canal · [aviso]
*(original "#22" da Engenharia — renumerado: colisão com o #21 da arquitetura, ver #24)*

**Lote 1 (es):** `messages/es.json` namespaces `app` + `ui`, conforme glossário v0.2.0 — **`a2b2250`**. es.json parcial por desenho (31/335); key-parity padrão: 304 ausentes = aviso, 0 órfã. Cadeia verde. Próximo: footer/home (traz consulta §4.2). *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura)*

---

### #22 · 2026-09-22 14:23 · Engenharia → canal · [aviso]
*(original "#21" da Engenharia — renumerado: colisão com o #21 da arquitetura, ver #24)*

**Reconciliação key-parity × lotes (Opção A, decidida pela Direção):** órfã sempre reprova; ausente = aviso no gate padrão, reprova só no `--strict` (lote final + auditoria). `scripts/i18n-key-parity.ts` + `npm run i18n:key-parity:strict` — **`4595966`**. *(texto da Engenharia, transcrito pelo Operador; hash preenchido pela arquitetura; classificação original "[decisão registrada]" ajustada para [aviso] — decisões de regime são registradas pela arquitetura/Direção, aqui sancionada no #24)*

---

### #21 · 2026-09-22 14:25 · Kimi → Engenharia (via Operador) · [decisão]

**Passo 0 da `feat/i18n-es` VERIFICADO independentemente e ACEITO — Lote 1 (`ui.*`) LIBERADO.** Verificação da arquitetura sobre `9ae0837` (não só leitura do aviso): (1) glossário `spec/i18n/glossario-es.json` v0.2.0 com **64/64 `aprovado-z`**, versionado em `0d087c8` **antes** de qualquer tradução — condição 2.2 do Z cumprida na ordem correta (glossário → guarda → conteúdo); parte do glossário da pendência P2 resolvida. (2) Guarda B2 `i18n-key-parity.ts` está na cadeia do `gate` e tem **dentes provados pela arquitetura**: injetei um `es.json` descartável com 329 chaves ausentes + 1 órfã → exit 1 com as duas classes acusadas; removido → exit 0. Lógica correta: compara topologia de chaves contra pt-BR (referência), não compara valores, não lê números da matriz (B7 preservada no próprio guarda). (3) Cadeia re-rodada na branch: verify **105/105**, parity **128/0**, gate verde com key-parity armado (0 locales), parity-locale **4/4** (pt-BR DOM-idêntico à baseline). Lembrete para o Lote 1: o 1º commit de `messages/es.json` já nasce gated — chave ausente ou órfã quebra o build do gate; e a cada lote, `parity:locale` após build (B6). Dúvida terminológica fora do glossário → parar e consultar (memorando §4.2).

---

### #20 · 2026-09-22 14:13 · Engenharia → canal · [aviso]

**feat/i18n-es aberta do HEAD da infra. Passo 0 cumprido (despacho §3 / condições 6.1 e 2.2 do Z):** (1) `spec/i18n` versionado — glossario-es.json v0.2.0 (aprovado-z, 64 termos), glossario-es.md e anexo-normativo-es.md — **`0d087c8`**; (2) guarda B2 no gate — `scripts/i18n-key-parity.ts` compara chaves de cada `messages/<locale>` contra pt-BR (ausente/órfã = falha); hoje 0 locales, verde e armado; o 1º commit de es.json passa a ser gated — **`9ae0837`**. Cadeia verde: verify 105/105, parity 128/0, gate 64/64 + identity 344 + no-literal + key-parity, parity-locale 4/4. Sem tocar pt-BR/números/ids. Próximo: Lote 1 (ui.* em es). *(texto da Engenharia, transcrito pelo Operador; hashes preenchidos pela arquitetura na transcrição)*

---

### #19 · 2026-09-22 11:00 · Kimi → Engenharia (via Operador) · [decisão]

**`feat/i18n-es` AUTORIZADA — despacho da Direção emitido** (`DESPACHO_direcao_i18n-es_2026-09-22.md`). Pré-condições do memorando satisfeitas: infra APROVA pelo Z (10/10, #17) + sinal da Direção. O `MEMORANDO_execucao_i18n-es_2026-09-21.md` deixa de ser borrador e vale como ordem integral (incluída a emenda da religação `label()`/threading de locale). **Incorporadas as 4 condições vinculantes do Z (relatório §6):** (1) B2 pleno — paridade de chaves pt-BR×es como check no gate **antes do 1º commit de conteúdo**; (2) **Passo 0:** commitar `spec/i18n/` (glossario-es v0.2.0 + anexo borrador) antes de qualquer tradução — resolve a parte do glossário da pendência P2; (3) relatório de conformidade do es no path A1 `spec/i18n/relatorios/`; (4) camadas A2 1–4 completas com retroversão pelo Z. Base: HEAD da `feat/i18n-architecture` (housekeeping docs-only inócuo). Merge em `main` segue vedado. Sequência de lotes e regime conforme memorando §4.

---

### #18 · 2026-09-22 10:40 · Kimi → canal · [decisão]

**Item 10 do DoD FECHADO — ciclo da infra i18n ENCERRADO (10/10).** A arquitetura conferiu o relatório do Z contra os 4 bloqueantes com superfície nesta branch: **B2** (fonte única, sem órfãs), **B6** (parity 4/4 sobre baseline imutável), **B7** (golden-rule verde, guarda deriva tokens da spec), **B9** (lang/redirects/headers limpos nos dois regimes) — todos cobertos na seção 5 do relatório com 0 achados, e as 7 seções do A1 estão completas. As afirmações verificáveis localmente foram re-conferidas pela arquitetura na transcrição: diff housekeeping `68fa106..b54953b` = exatamente 4 arquivos/317 inserções em `_guia_decisao/`; sha256 dos 3 artefatos batem; trilha = 18 substantivos + 1 alias + 3 housekeeping (22 total). Relatório arquivado em `_guia_decisao/RELATORIO_Z_conformidade_i18n-infra_2026-09-22.md`. **Efeitos (memorando §5 + relatório §6):** `feat/i18n-es` **desbloqueada** — com as 4 condições vinculantes (B2 pleno como CI desde o 1º commit; glossário-es versionado antes da tradução; relatórios por locale no path A1; camadas A2 1–4 completas). **Merge em `main` segue vedado** sem autorização expressa da Direção. Pendência remanescente do ciclo: **P2** (disposição dos untracked, Operador + Z).

---

### #17 · 2026-09-22 10:36 · Z → canal · [decisão]

**Relatório de conformidade da infra i18n EMITIDO — veredito APROVA sem ressalvas (item 10 do DoD: 10/10).** O Z re-executou a cadeia completa de forma independente no ambiente do operador (Node 20): verify 105/105 · parity 128/0 · gate 64/64 + identity 344/344 + no-literal OK · parity:locale 4/4 · runtime duplo (OFF: gated 307→pt-BR; ON: 200 com lang correto) · headers sem hreflang/cookie/content-language nos dois regimes · dentes do guarda 6/6. Hashes dos 3 artefatos conferidos byte a byte; zero achados B/G/M. Condições para feat/i18n-es: B2 pleno como CI desde o 1º commit de conteúdo; glossário-es versionado antes da tradução; relatórios por locale no path A1. Merge em main segue vedado (Direção). Artefato: `_guia_decisao/RELATORIO_Z_conformidade_i18n-infra_2026-09-22.md`. *(relatório do Z, transcrito pelo Operador — texto sugerido pelo próprio Z, conferido e formatado pela arquitetura)*

---

### #16 · 2026-09-22 10:12 · Kimi → canal · [decisão]

**Ciclo da infra i18n FECHADO; pacote liberado para o Z.** Ao transcrever o #15, a arquitetura conferiu o delta e encontrou **um residual**: o comentário inline da cadeia (§7) ainda dizia "19 commits". Corrigido pela própria arquitetura como housekeeping (`0b9e685`, docs-only), junto com a precisão do §1 (HEAD **substantivo** = `68fa106`; housekeeping acima sem efeito sobre evidências). Zero ocorrências de "19 commits" restantes. Não houve re-conferência de gates (LOG #13 §6 mantido) — apenas a correção factual. **Estado final:** DoD 9/9 executáveis reproduzidos; HEAD da branch `0b9e685` (housekeeping) sobre `68fa106` (alias) sobre 18 substantivos. O pacote `PACOTE_auditoria_Z_i18n_2026-09-21.md` está íntegro e segue ao Z pela Direção. Resta o item 10: relatório de conformidade do Z (7 seções do A1), veredito "aprova".

---

### #15 · 2026-09-22 10:09 · Engenharia → canal · [aviso]

**Ciclo da infra i18n fechado do lado da Engenharia, cumprido o LOG #14:** (1) alias `npm run parity:locale` = `python3 scripts/parity-locale.py check`, sem aninhar no gate (gate é lógica pura; parity-locale consome o `.next`) — **`68fa106`**; (2) pacote de auditoria do Z versionado em `_guia_decisao/PACOTE_auditoria_Z_i18n_2026-09-21.md` (`12134ad`), com as correções factuais do #14 (18 commits substantivos; HEAD=`68fa106`). DoD: 9/9 executáveis reproduzidos em verde; resta o item 10 (relatório do Z). Cadeia verde no commit. *(texto da Engenharia, transcrito pelo Operador; hashes preenchidos pela arquitetura na transcrição)*

---

### #14 · 2026-09-22 10:05 · Kimi → Engenharia (via Operador) · [decisão]

**Executa os 2 micro-ajustes do LOG #13, nesta ordem, antes do pacote seguir ao Z:**

1. **Alias `parity:locale`** — micro-commit único `chore(i18n): alias npm run parity:locale` adicionando ao `package.json`: `"parity:locale": "python3 scripts/parity-locale.py check"`. Sem aninhar no `gate` (passo explícito após o build, conforme decisão #13). Gates verdes após o commit (o alias não toca código, mas confirma).
2. **Correção factual no pacote** — em `PACOTE_auditoria_Z_i18n_2026-09-21.md`: trocar "19 commits" por **"18 commits"** nos dois pontos (§1 "Trilha auditável" e §7 comentário da cadeia) e atualizar o **HEAD no §1** para o novo hash após o commit do alias.

Cumpridos os dois, avisa no canal (#15) e o pacote segue **direto ao Z** — a arquitetura já conferiu e não re-confere (LOG #13 §6). Fecha-se assim o ciclo da infra i18n: DoD 9/9 executáveis reproduzidos, restando só o ato do Z (item 10).

---

### #13 · 2026-09-22 09:50 · Kimi → Engenharia (via Operador) · [decisão]

**Pacote de auditoria Z CONFERIDO contra o DoD (memorando §4) — APROVADO com 2 micro-ajustes formais.** Verificação independente (não só leitura): rebuild + re-execução completa pela arquitetura — verify **105/105**, parity **128/0**, gate **64/64** + identity **344/344** + no-literal OK, parity-locale **4/4**, build duplo runtime reproduzido (OFF: gated **307**→pt-BR; ON: gated **200**; `lang` correto por rota). Hashes sha256 dos 3 artefatos conferem byte a byte; baseline NDTI intacta (único commit `d7e10d5`); diff do `verify-math.ts` = apenas a linha `MATRIX_VERSION`, atômica no bump (`3c4e9c2`); spec com **0** campos `i18n`. DoD: 9/9 itens executáveis cumpridos e reproduzidos; item 10 é o ato do Z. Detalhes em `VERIFICACAO_arquitetura_pacote-Z_2026-09-22.md`. **Micro-ajustes antes do envio:** (1) o pacote diz "19 commits" em §1/§7, mas `main..HEAD` e a própria lista do §7 têm **18** — corrigir; (2) **sancionada** a recomendação do §5: criar o alias `npm run parity:locale` (micro-commit) e manter `parity-locale` como **passo explícito após o build**, sem aninhar no `gate`; atualizar o HEAD no §1 do pacote no mesmo ajuste. Cumpridos os dois, segue direto ao Z, sem re-conferência da arquitetura.

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
