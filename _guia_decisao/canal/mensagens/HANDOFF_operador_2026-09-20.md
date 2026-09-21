# HANDOFF ao operador → Claude (Engenharia) — destravar P1 e abrir o canal

**#H1 · 2026-09-20 · Kimi → Operador (colar para o Claude) · [handoff]**
**Pré-condição:** nenhuma. Não toca em código, só versiona documentos de governança.

---

## Mensagem para colar ao Claude

> Engenharia: a Arquitetura abriu o canal triplo em `_guia_decisao/canal/` (protocolo no `README.md` da pasta, estado vivo em `QUADRO.md`, fluxo em `LOG.md`). Leia os três arquivos + `mensagens/HANDOFF_operador_2026-09-20.md` antes de qualquer código.
>
> Confirmação do aceite 3.1: sua nota E2-complemento foi **aprovada com 2 emendas** (`../ACEITE_arquitetura_E2-complemento_2026-09-20.md`). As emendas viraram pendências P1–P5 no QUADRO. Resumo operacional:
> - **Allowlist do `label()`**: universo traduzível da spec = **344 nós** (332 da sua nota + `description`×4 + `motivoEliminatorio`×8); `obs`×1 excluído por decisão; vocabulário controlado e referências normativas (`riskAnswer`, `efeito`, `nivel`, `refEliminatoria`…) **nunca** entram.
> - **Inventário reproduzível**: seu método de contagem vira `scripts/inventory-strings.ts`, commitado junto ao 1º commit de extração (âncora do gate B2/B6 para o Z).
> - **Ordem travada**: (1) commit destes documentos → (2) baseline NDTI congelada em `gate/baseline-ndti/` → (3) só então 1º commit de extração.
>
> Confirme recebimento com um `aviso` curto no `LOG.md` (próximo número livre) e reporte o resultado do bloco abaixo.

## Bloco 1 — commitar governança (P1)

```bash
cd /Users/fabianotonacoborges/Dev/MARIA
git add _guia_decisao/
git commit -m "docs(governanca): nota E2-complemento, aceite da arquitetura e canal triplo de comunicacao"
```

**Verificação esperada:** `git status --short` **não** lista mais `_guia_decisao/`; `git log --oneline -1` mostra o commit.

## Bloco 2 — reportar os untracked restantes (P2 — NÃO commitar ainda)

```bash
git status --short
```

**Esperado restarem exatamente 3:** `consentimento-re-consentimento.patch`, `public/inaep-logo.png`, `spec/i18n/glossario-es.json`. Disposição:
- `spec/i18n/glossario-es.json` → **aguarda o Z** (rascunho dele; branch de idioma bloqueada — memorando item 6). Não commitar nesta branch sem posição dele no canal.
- `.patch` e logo → Engenharia informa origem/propósito no LOG; Direção decide commit ou descarte **antes** da baseline (árvore limpa é pré-requisito do 3.2-ii).

## Fora deste handoff (próximos passos, aguardar)

Baseline NDTI (`gate/baseline-ndti/`) e 1º commit de extração só entram depois que P1+P2 fecharem e o operador colar as saídas. Não antecipar.
