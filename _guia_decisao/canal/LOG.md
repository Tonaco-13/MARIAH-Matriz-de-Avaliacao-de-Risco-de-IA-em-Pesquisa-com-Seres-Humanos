# LOG — canal triplo (append-only · mais recente no topo)

> Formato: `### #N · AAAA-MM-DD HH:MM · DE → PARA · [tipo]`
> Numeração sequencial única; nada se apaga; correção = mensagem nova citando a anterior.

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
