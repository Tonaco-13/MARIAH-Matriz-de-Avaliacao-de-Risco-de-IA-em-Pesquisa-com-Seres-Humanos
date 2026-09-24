# MEMORANDO DE EXECUÇÃO — feat/i18n-architecture (para Claude Code / Opus 4.8, conta MS)

**Data:** 2026-09-20 · **De:** Kimi (arquitetura), por determinação da Direção (Fabiano) · **Para:** Engenharia (Claude Code 4.8 Extra, sessão Cowork conta MS PRO)
**Status:** AUTORIZAÇÃO FORMAL DE EXECUÇÃO da branch `feat/i18n-architecture`, nos termos do ciclo de decisão encerrado em 2026-09-19.
**Documentos do ciclo (ler antes de começar — todos em `_guia_decisao/`):**
1. `DESPACHO_arquitetura_i18n_2026-09-19.md` — decisões de arquitetura (com as emendas dos itens 2 e 3 abaixo)
2. `PARECER_engenharia_i18n_2026-09-19.txt` — seu parecer E1–E4, acolhido
3. `RESPOSTA_engenharia_i18n_2026-09-19.md` — acolhimento + emenda do critério 3.2
4. `PARECER_auditor_Z_i18n_2026-09-19.txt` — A1–A4, condições de aceitação e política B1–B9
5. `RESPOSTA_auditor_Z_i18n_2026-09-19.md` — fechamento do ciclo + decisão do modelo campo-canônico

---

## 0. Modo de trabalho (operacional)

O operador (Fabiano) executa os comandos no terminal; você não tem acesso direto ao repo. Portanto:

- Entregue o trabalho em **passos sequenciais e verificáveis**; cada passo = bloco de comandos + verificação esperada (saída de grep, build, gate). Não avance um passo sem a verificação do anterior.
- Ao final de cada passo, o operador cola a saída; você confere e autoriza o próximo.
- Commits: mensagens em pt-BR, convenção do repo, um commit lógico por passo. Autoria conforme a conta git já configurada na máquina (conta MS).
- Repo: `/Users/fabianotonacoborges/Dev/MARIA` (git do Fabiano). **A `main` não recebe i18n.** Vitrine https://mariah-inaep.vercel.app/ serve `main` — intocada.
- Dúvidas de âncora ou conflito entre este memorando e o código: **pare e pergunte** (a arquitetura responde via operador). Não improvisar decisão normativa.

## 1. Escopo da branch (infra — ZERO tradução)

Criar `feat/i18n-architecture` a partir da `main`. A branch entrega a infraestrutura de localidades **sem nenhum conteúdo traduzido**: pt-BR é extraído para arquivos de mensagem e re-encaminhado por eles. Resultado visível para o usuário: **nenhum** — esse é o critério de sucesso.

## 2. Decisões técnicas vinculantes (não reabrir sem parecer)

1. **Biblioteca:** next-intl, `localePrefix: "as-needed"` — pt-BR sem prefixo nas URLs de hoje (`/`, `/instrucoes`, `/transparencia`, `/validacao`); demais localidades com prefixo (`/es/...`), hoje inexistentes.
2. **Flag dark-launch:** env de **runtime** `LOCALES_ENABLED` lida no middleware (não `NEXT_PUBLIC_*` — o app é `output:"standalone"`; o mesmo build liga/desliga sem rebuild). Flag off ⇒ qualquer `/es|/en|/de|/fr|/zh` redireciona para `/`; somente pt-BR alcançável; **nenhum** hreflang/metadado de localidade emitido com a flag off (B9).
3. **Modelo de spec multilíngue (DECISÃO DA ARQUITETURA — substitui o item 5.3 do despacho e a formulação do seu E2):** campos de conteúdo da spec (`pergunta`, `dica`, `nome`, `descricao`, `enunciado`…) **permanecem string pt-BR canônica**; cada nó ganha campo opcional `i18n: { "es": "…", … }`; acesso via função `label(node, locale)` com fallback ao canônico. Os 5 consumidores atuais (`parity-check.ts`, `build-spec-v2.ts`, `extract-gate-vectors.py`, `gen-instrucoes-preenchimento.py`, `data.ts`) **não são rewired nesta branch** e devem permanecer verdes. Bump `matrixVersion 2.1.0 → 2.2.0` documentando o contrato novo (mudança de estrutura, zero mudança de conteúdo da matriz).
4. **Critério de identidade pt-BR (emenda ao 3.2):** DOM/texto-idêntico ao baseline, **não** byte-literal. Ver item 3.2 abaixo.
5. **Remoção de dependência morta:** remover `jspdf` do `package.json` (0 imports em `src/` — verificado três vezes no ciclo). Nota no CHANGELOG: remoção sem mudança funcional. O fluxo de PDF é e permanece `printWindow.print()` sobre HTML (`Results.tsx:151–155`); nesta branch, apenas preparar o template do relatório para receber `lang` dinâmico e font-stack com fallback CJK (`-apple-system, "Segoe UI", "Noto Sans", "Noto Sans SC", sans-serif`) — sem conteúdo zh ainda.
6. **Datas:** os dois `toLocaleDateString('pt-BR')` fixos (`utils.ts:650` e `utils.ts:868`) passam a usar o locale ativo via next-intl (com a flag off, comportamento idêntico ao atual).
7. **Regra de ouro:** números, pesos, cortes (58/127/208; 64/141/230), somas de bloco (62/77), teto (297), ids de questão e `matrixVersion` nunca entram em arquivos de mensagem como texto traduzível. Nenhuma chave de persistência, export ou gate pode derivar de string traduzível (B7 — regra permanente).

## 3. Condições de entrega (as 3 do fechamento de ciclo)

**3.1 — Complemento de E2 (PRIMEIRO ARTEFATO, antes do 1º commit de extração):**
Nota curta commitada em `_guia_decisao/` (sugestão: `NOTA_engenharia_E2-complemento_2026-09-20.md`) contendo:
- inventário com **contagem de strings por arquivo** (data.ts, disclaimer.ts, ~10 componentes, 3 páginas, spec/fichas);
- confirmação explícita de adesão ao modelo campo-canônico + `i18n` (item 2.3);
- lista das chaves namespacadas previstas (`fichas.<id>.label`, `results.disclaimer`, `ui.stepIndicator`, …).

**3.2 — `parity-locale` (na forma do §5.E4 do Z):**
Script (integrado ao `gate`/CI, ex.: `scripts/parity-locale.ts` + `npm run parity:locale`) que:
- (i) builda com `LOCALES_ENABLED` ausente/off;
- (ii) compara o render pt-BR das 4 rotas contra **baseline versionada e imutável, gerada do commit exato entregue ao NDTI** (gerar o snapshot como primeiro artefato da branch, commitá-lo em `gate/baseline-ndti/`, e nunca mais alterá-lo);
- (iii) verifica redirect `/es|/en|/de|/fr|/zh → /` com flag off;
- (iv) com flag on, verifica rotas de localidade vivas e `lang` correto por rota;
- critério de diff: nós de texto + estrutura do DOM, tolerando atributos benignos do framework (`lang="pt-BR"` etc.). Divergência = gate vermelho.

**3.3 — Documentação da flag:**
`MAINTENANCE.md` ganha seção "Internacionalização (i18n)": o que é `LOCALES_ENABLED`, como ligar/desligar em dev, no standalone e no Vercel, e o procedimento no cenário de transplante ao NDTI (flag ausente = comportamento entregue).

## 4. Definition of done da branch (checklist de merge)

- [ ] Nota E2-complemento commitada (3.1) e aprovada pela arquitetura
- [ ] Baseline NDTI gerada e congelada em `gate/baseline-ndti/` (3.2)
- [ ] Zero string pt-BR em JSX (verificável por grep — o Z rodará)
- [ ] `messages/pt-BR.json` como fonte única do pt-BR renderizado; spec com `i18n` opcional vazio/ausente em todos os nós (nenhuma localidade preenchida nesta branch)
- [ ] `verify` (matemática) verde e **inalterado**; `parity` (spec × gabarito v46) verde e **inalterado**; `gate/vetores-*.json` regenerados com saída numérica idêntica
- [ ] `parity:locale` verde nos 4 itens do 3.2
- [ ] `jspdf` removido; CHANGELOG atualizado; `matrixVersion` 2.2.0
- [ ] `MAINTENANCE.md` com a seção i18n (3.3)
- [ ] Build standalone produzido com flag off e com flag on; nas duas, pt-BR navegável e idêntico
- [ ] Relatório de conformidade da infra emitido pelo Z (template das 7 seções do A1) com veredito "aprova"

## 5. Política de merge que o Z aplicará (conhecimento prévio)

Bloqueantes relevantes à infra: **B2** (chave ausente/órfã), **B6** (paridade flag-off divergente da baseline), **B7** (chave derivada de texto traduzível), **B9** (vazamento de localidade/hreflang com flag off). B reprova sem ressalva. Grave (G) admite prazo; menor (M) registra. Após o veredito do Z, a arquitetura autoriza o merge em `main`? — **NÃO**: merge da infra será em `main` somente com autorização da Direção (a vitrine serve `main`); o destino imediato pós-auditoria é manter a branch aprovada como base das branches de idioma, até decisão de publicação.

## 6. Fora de escopo nesta branch (vedado antecipar)

Qualquer tradução (mesmo de teste); Anexo Normativo; glossários; cláusulas de cortesia nos outros idiomas; hreflang/metadados de localidade; pseudolocalização como conteúdo commitado (pode ser usada localmente para o teste de stress de layout +40%, sem commit). Branches de idioma seguem bloqueadas até: infra aprovada pelo Z + glossário do idioma com `status: aprovado-z`.

---

**Símbolo de encerramento do ciclo:** os três papéis estão alinhados e o caminho está pavimentado. Bom trabalho, Engenharia — a arquitetura acompanha pelo operador.
