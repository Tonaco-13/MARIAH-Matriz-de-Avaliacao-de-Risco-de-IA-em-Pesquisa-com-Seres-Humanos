# HANDOFF ao operador → Claude (Engenharia) — retomada: Passo 5 enxuto APROVADO com 2 condições

**#H3 · 2026-09-21 · Kimi → Operador (colar para o Claude) · [handoff]**
**Contexto:** sua última mensagem antes do limite de tokens propôs o Passo 5 enxuto (tipos + `label()` + bump, sem religação). A arquitetura decidiu — ver abaixo. Referências: LOG #5 (verificação estática) e #6 (esta decisão); emenda formal no `MEMORANDO_execucao_i18n-es_2026-09-21.md`.

---

## Mensagem para colar ao Claude

> Engenharia: decisão da Arquitetura sobre o seu ponto de julgamento do Passo 5 (LOG #6):
>
> **Passo 5 enxuto APROVADO** — campo `i18n` opcional nos tipos + helper `label(node, campo, locale)` + bump 2.2.0, **sem** religar componentes agora. Justificativa aceita: com zero tradução, religar é no-op que reabre todos os arquivos (risco sem ganho) e o threading de locale no `utils.ts` é invasivo; a religação migra **formalmente** para a `feat/i18n-es` (emenda já registrada no memorando dela), onde entra em bloco junto das traduções reais. O Z pode vetar na auditoria — o compromisso fica explícito no commit, como você propôs.
>
> **Duas condições vinculantes:**
>
> 1. **A propriedade no-op sai provada, não afirmada.** Junto ao helper, entrega um teste/script de identidade: para todos os nós da allowlist (344), `label(node, campo, 'pt-BR')` retorna o canônico, e `label(node, campo, 'es')` com `i18n` ausente também retorna o canônico. Esse script roda no gate e é a âncora que o Z auditara no lugar de uma religação inexistente. A allowlist dos 344 nós (332 + `description`×4 + `motivoEliminatorio`×8; `obs` excluído; vocabulário controlado fora) entra documentada no mesmo commit — pendência P5, que eu sanciono sobre esse artefato.
> 2. **P7 — atomicidade do bump:** o `verify-math.ts` (expectativa `2.1.0`) é atualizado **no mesmo commit** do bump para 2.2.0. Hoje o verify está 104/105 exatamente por isso; cada commit deve ser reproduzível verde para a auditoria. (Opcional, bem-vindo: verify ler a versão de fonte única em vez de literal.)
>
> **Confirmações pendentes da verificação estática (LOG #5):**
> - **P4:** `scripts/inventory-strings.ts` entrou no 4a? Aponte commit + saída commitada; se não entrou, inclui agora.
> - **P6 (datas):** aceito no seu Passo 6 (relatório/exports) — mas é pré-auditoria: sem datas locale-aware em `utils.ts:650/868`, o pacote do Z não sobe.
>
> Seu aviso de recebimento no LOG passa a ser **#7** (a decisão tomou o #6). Depois do Passo 5: passos 6–8 do QUADRO (MAINTENANCE → jspdf → build duplo flag off/on) e pacote de auditoria. QUADRO + `aviso` no LOG ao fim de cada bloco.

## Bloco 1 — após o commit do Passo 5 (operador roda)

```bash
cd /Users/fabianotonacoborges/Dev/MARIA
npm run verify && npm run parity && npm run gate && python3 scripts/parity-locale.py
```

**Esperado:** verify **105/105** (P7 fechado) · parity **128/0** · gate verde · parity-locale **4/4** (flag off idêntico à baseline NDTI). Colar as 4 saídas no canal. Se tudo verde, a Arquitetura autoriza os passos 6–8 no mesmo ciclo.

## Bloco 2 — governança (ponto natural, junto ao Passo 5 ou logo após)

```bash
cd /Users/fabianotonacoborges/Dev/MARIA
git add _guia_decisao/
git commit -m "docs(governanca): ciclo i18n — despacho, pareceres, memorandos, canal e verificacao estatica"
```

**Fecha P1.** Esperado: `git status --short` limpo de `_guia_decisao/` (restam apenas `consentimento-re-consentimento.patch`, `public/inaep-logo.png`, `spec/i18n/` e o docx em `upload/` — P2 segue aberta para disposição com o Z).

## Lembretes ao operador

- Proposta fora destes blocos → não executar; colar no canal (regra do memorando, item 0).
- Se o Passo 5 vier com os 4 gates verdes, me traga as saídas que eu libero 6–8 na hora.
