# DESPACHO DA DIREÇÃO — autorização formal da feat/i18n-es

**Data:** 2026-09-22 · **De:** Direção (Fabiano), redação da Arquitetura (Kimi) · **Para:** Engenharia (Claude Code 4.8, sessão Cowork conta MS PRO)
**Ato:** autorização formal de abertura e execução da `feat/i18n-es`, nos termos do `MEMORANDO_execucao_i18n-es_2026-09-21.md`.

---

## 1. Pré-condições do memorando — SATISFEITAS

| Pré-condição | Estado |
|---|:--:|
| (i) `feat/i18n-architecture` aprovada na auditoria do Z | ✅ `RELATORIO_Z_conformidade_i18n-infra_2026-09-22.md` — **APROVA sem ressalvas, DoD 10/10** (LOG #17/#18) |
| (ii) Sinal da Direção | ✅ Este despacho |
| Glossário es v0.2.0 `aprovado-z` (64/64) | ✅ `REGISTRO_destrave_glossario-es_2026-09-20.md` |
| Anexo Normativo es borrador 0.1.0 | ✅ `spec/i18n/anexo-normativo-es.md` |

O memorando deixa de ser borrador: **vale como ordem de execução integral** — escopo (§1), contrato terminológico (§2), approved-list de 8 pontos (§3), processo em lotes (§4) e fora de escopo (§5), **incluída a EMENDA 2026-09-21** (religação de `label(...)` e threading de locale entram nesta branch).

## 2. Condições vinculantes do Z (relatório §6) — incorporadas à ordem

As 4 condições do veredito passam a fazer parte do DoD desta branch:

1. **B2 pleno desde o primeiro commit de conteúdo:** paridade de chaves entre locales (`pt-BR` × `es`) como check de CI — implementar o check **antes** do primeiro commit de tradução (sugestão: estender o `i18n-no-literal` ou script irmão `i18n-key-parity`, integrado ao `gate`).
2. **Glossário versionado antes da tradução:** `spec/i18n/` (hoje untracked — pendência P2) deve ser **commitado na `feat/i18n-es` antes do primeiro commit de conteúdo es**, incluindo `glossario-es.json` v0.2.0. *Passo 0 da branch.*
3. **Relatórios por locale no path do A1:** `spec/i18n/relatorios/conformidade-es-v<n>.md`, append-only, 7 seções — o relatório de conformidade do es segue este path (o da infra ficou em `_guia_decisao/` por convenção da casa).
4. **Camadas 1–4 do protocolo A2 completas:** retroversão independente pelo Z (memorando §4.4 — preparar o pacote de retroversão das classes normativas ao final).

## 3. Base e primeiro passo

- **Base:** criar `feat/i18n-es` a partir do HEAD de `feat/i18n-architecture` (HEAD substantivo `68fa106`; housekeeping docs-only acima é inócuo — pode ramificar do HEAD atual `f9fe925` ou do `68fa106`, tanto faz: o diff entre eles é só `_guia_decisao/`).
- **Passo 0 (antes de qualquer tradução):** commitar `spec/i18n/` (glossário + anexo borrador) + implementar o check de paridade de chaves B2 no gate. Gates verdes → avisar no canal.
- **Sequência de lotes:** conforme memorando §4.1 (`ui.*` → páginas → `fichas.*` → `results.*` → exports → spec `i18n`), commit + verificação por lote, aviso no QUADRO/LOG por bloco.
- **Merge em `main` permanece vedado** — a vitrine serve `main`; a publicação é decisão separada da Direção após o veredito do Z nesta branch.

## 4. Lembretes de regime (inalterados)

- Regra de ouro B7: números/ids/`matrixVersion` nunca derivam de texto traduzível; tetos/cortes/ids inalterados (approved-list §3.8).
- Paridade flag-off verde a cada lote (B6): `npm run parity:locale` após build; pt-BR DOM-idêntico à baseline NDTI.
- Dúvida terminológica não coberta pelo glossário → **parar e consultar** a arquitetura; termo com consequência operacional vira entrada `status: proposto` e sobe ao Z (memorando §4.2).
- Pseudolocalização só local, sem commit (stress de layout +40%).

---

**Encerramento:** a infra está aprovada e o caminho pavimentado. Bom trabalho na tradução, Engenharia — a arquitetura acompanha pelo operador, e o Z espera o pacote de retroversão ao final.

*Registrado no canal como LOG #19.*
