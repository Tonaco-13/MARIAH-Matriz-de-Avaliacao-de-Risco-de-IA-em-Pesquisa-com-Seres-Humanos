# VERIFICAÇÃO DA ARQUITETURA — pacote de auditoria Z (feat/i18n-architecture)

**Data:** 2026-09-22 · **De:** Arquitetura (Kimi) · **Sobre:** `PACOTE_auditoria_Z_i18n_2026-09-21.md`
**Rito:** conferência contra o DoD do memorando §4 (`MEMORANDO_execucao_i18n_infra_2026-09-20.md`), conforme LOG #12.3, antes do envio ao Z.
**Método:** verificação independente na branch `feat/i18n-architecture` (HEAD `f3b35bd`, árvore limpa), incluindo rebuild e re-execução completa dos gates pela arquitetura — não apenas leitura das evidências declaradas.

---

## 1. Conferência item a item do DoD (memorando §4)

| # | Item do DoD | Pacote | Verificação independente da arquitetura |
|---|---|:--:|---|
| 1 | Nota E2-complemento + aceite | ✅ | Confirmado — aceite já registrado pela arquitetura (`ACEITE_arquitetura_E2-complemento_2026-09-20.md`, allowlist 344) |
| 2 | Baseline NDTI congelada | ✅ | `git log -- gate/baseline-ndti/` mostra **um único commit** (`d7e10d5`); 4 rotas presentes; imutabilidade confirmada |
| 3 | Zero string pt-BR em JSX | ✅ | Re-rodado: Check A do `i18n-no-literal`, 31 `.tsx` via parser TS, **OK** |
| 4 | `messages/pt-BR.json` fonte única; `i18n` ausente na spec | ✅ | `grep '"i18n"' spec/mariah-spec.json` → **0 ocorrências**; identity **344/344** no-op (pt-BR e es → canônico); B1 → 0 valores em campos `i18n` |
| 5 | `verify`/`parity`/`gate` verdes | ✅ | Re-rodados: **verify 105/105**, **parity 128/0**, **gate 64/64** (0 falhas) + identity 344 + no-literal OK. Diff `main..HEAD` de `verify-math.ts`: **apenas** a linha `MATRIX_VERSION` 2.1.0→2.2.0, **atômica no commit do bump** (`3c4e9c2`) — matemática intacta confirmada |
| 6 | `parity:locale` nos 4 itens do 3.2 | 🟡 | `parity-locale.py check` re-rodado: **4/4 OK** (i, ii). Itens (iii)/(iv) reproduzidos **pela arquitetura em runtime** — ver §2. Cobertura completa; forma repartida (script + runtime + construção). Alias `npm run parity:locale` ainda **não existe** no package.json — ver §4, decisão |
| 7 | jspdf removido; CHANGELOG; `matrixVersion` 2.2.0 | ✅ | 0 refs a jspdf no `package.json` (diff: linha removida), 0 imports em `src/`; CHANGELOG `[2.2.0]` presente; `matrixVersion` = 2.2.0; `version` = 2.2.0 (`f3b35bd`) |
| 8 | `MAINTENANCE.md` seção i18n | ✅ | Presente (`4e2d22f`), documenta flag, campo-canônico, B7, DOM-idêntico |
| 9 | Build duplo flag off/on | ✅ | **Reproduzido pela arquitetura** — ver §2 |
| 10 | Relatório do Z | ⬜ | Corretamente pendente — é o ato do Z |

## 2. Build duplo — reprodução independente (itens iii/iv do 3.2)

Rebuild do zero (`npm run build`, Next 16.2.4) seguido de runtime duplo, executado pela arquitetura:

```
FLAG OFF (porta 3210):  / → 200 · /es → 307→/ · /es/instrucoes → 307→/instrucoes · /zh/validacao → 307→/validacao
FLAG ON  (porta 3211):  / → 200 · /es → 200 · /es/instrucoes → 200 · /zh/validacao → 200
lang por rota (flag ON): <html lang="es"> · <html lang="zh"> · <html lang="pt-BR">
```

B9 confirmado em runtime e por construção: `routing.ts` com `alternateLinks:false`, `localeCookie:false`, `localeDetection:false`; `lang={locale}` em `src/app/[locale]/layout.tsx:53`. Servidores de teste encerrados ao final.

## 3. Hashes e metadados

Os três sha256 declarados conferem **byte a byte**: `spec/mariah-spec.json` (`4e03e7a7…`), `messages/pt-BR.json` (`5da13d9c…`), `scripts/i18n-no-literal.ts` (`f22977f0…`). HEAD `f3b35bd` confirmado.

**Nota de robustez (informativa):** a re-execução da arquitetura ocorreu em **Node v24.15.0** (metadados do pacote citam Node 22 / operador em Node 20). Todos os gates e o build duplo passaram também nesse ambiente — a cadeia é reproduzível em Node 20/22/24.

## 4. Divergência encontrada (correção exigida, trivial)

**A contagem de commits está errada.** O pacote afirma "19 commits" em dois lugares (§1 "Trilha auditável" e §7 comentário da cadeia), mas `git log --oneline main..HEAD` retorna **18 commits**, e a própria lista do §7 contém **18 hashes**. O Z rodará o comando e encontrará 18 — divergência factual evitável no dossiê.

**Correção:** trocar "19" por "18" nos dois pontos. Nenhuma outra inconsistência factual foi encontrada.

## 5. Decisão da arquitetura sobre o ponto aberto do §5 (wiring `parity:locale`)

Sancionada a recomendação da Engenharia, nos dois itens:

- **(a) SIM — criar o alias** `npm run parity:locale` → `python3 scripts/parity-locale.py check`. O DoD nomeia o comando; o alias o faz existir literalmente, custo nulo, e o item 6 do checklist deixa de ser 🟡.
- **(b) Passo explícito após o build** — **não** aninhar em `npm run gate`. O argumento da Engenharia está correto: `gate` é pura lógica (`tsx`, reproduzível sem artefato), enquanto `parity-locale` consome o `.next`. Aninhar mudaria o contrato do `gate`. A cadeia fica: `build → verify → parity → gate → parity:locale`.

Micro-commit único (sugestão: `chore(i18n): alias npm run parity:locale`), depois do qual o §1 do pacote atualiza o HEAD e a contagem de commits (§4 acima) no mesmo ajuste.

## 6. Veredito

**APROVADO para envio ao Z, condicionado a dois micro-ajustes formais** (nenhum toca código, gates ou evidências):

1. correção "19" → "18" commits (§4);
2. micro-commit do alias `parity:locale` + atualização do HEAD no §1 do pacote (§5).

Cumpridos esses dois itens, a arquitetura não precisa re-conferir: o pacote pode seguir direto ao Z. Dos 10 itens do DoD, **9 estão cumpridos e reproduzidos independentemente pela arquitetura**; o item 10 é o ato do Z, que este pacote agora alimenta corretamente.

---

*Registrado no canal como LOG #13.*
