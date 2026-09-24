# VERIFICAÇÃO ESTÁTICA — feat/i18n-architecture em andamento (checkpoints contra o memorando)

**Data:** 2026-09-21 ~15:00 · **De:** Kimi (arquitetura) · **Objeto:** estado do repo no momento em que a Engenharia pausou por tokens
**Método:** inspeção estática de `git log/diff/status`, `routing.ts`, `proxy.ts`, `next.config.ts`, `messages/pt-BR.json`, `gate/baseline-ndti/`, e execução de `verify` e `parity`. Nada foi alterado no código.

## Veredito: CONSTRUÇÃO SAUDÁVEL — nenhum desvio de arquitetura; 1 gate vermelho transitório explicado; 1 risco de escopo cair (datas)

## ✅ Conforme (verificado item a item contra o memorando)

1. **Roteamento exatamente como prescrito** (`src/i18n/routing.ts`): `localePrefix: "as-needed"` (pt-BR nas URLs de hoje), `localeDetection: false` (nenhum redirect por Accept-Language — pt-BR servido a todos, como hoje), `localeCookie: false`, `alternateLinks: false` (zero hreflang com flag off — **B9 blindado já na config**). Comentários do arquivo citam o memorando e a regra de ouro B7.
2. **Flag de runtime** (`src/proxy.ts`): `LOCALES_ENABLED` lida em runtime (não NEXT_PUBLIC), como decidido; com a flag off, qualquer prefixo `es|en|de|fr|zh` redireciona para o equivalente pt-BR sem prefixo. Correto.
3. **Baseline NDTI congelada** (`gate/baseline-ndti/`, 4 rotas, commit `d7e10d5`) e `scripts/parity-locale.py` criado — condição 3.2 atendida em estrutura.
4. **`parity` verde agora**: 128 enunciados conferidos, 0 divergências contra o gabarito v46.
5. **Extração em diffs limpos**, na granularidade aprovada (LOG #4): 4a componentes (`cde3470`, `62778a1`, `9dbf172`, `1b4a995`), 4b páginas (`8a874de`, `c233095` — "fecha conformidade zero-literal JSX"). `messages/pt-BR.json` com 12 namespaces.
6. **4c em trabalho, no modelo decidido**: diff não commitado mostra `I18nMap` opcional, **campos canônicos pt-BR intocados** (string segue string), bump `2.1.0→2.2.0` no gerador (`build-spec-v2.ts`) e na spec — exatamente o modelo campo-canônico do fechamento de ciclo (§2).
7. `disclaimer.ts` permanece fonte única do aviso (literal pt-BR só lá — correto: "edita só aqui", agora por localidade).

## ⚠ Achados

**A1 — verify vermelho transitório, explicado (não é bug da extração).** `verify` = 104/105; a única falha é `MATRIX_VERSION`: o script espera o literal `"2.1.0"` e a spec em trabalho já diz `2.2.0`. É o ripple do bump do 4c. **Exigência de atomicidade:** o commit 4c deve atualizar a expectativa no `scripts/verify-math.ts` **no mesmo commit** do bump — caso contrário o gate fica vermelho entre commits e a auditoria do Z herda um estado impossível de reproduzir. Sugestão estrutural (não bloqueante): a versão esperada deveria vir de fonte única (ou o check virar "versão ≥ 2.2.0 e igual à spec"), para não exigir edição manual a cada bump futuro.

**A2 — risco de escopo cair: as duas datas fixas.** `toLocaleDateString('pt-BR')` em `utils.ts:650` e `:868` continua hardcoded e **não consta dos passos 6–8 do QUADRO** (está no memorando, item 2.6). Registrada como pendência P6 — sem ela, o relatório/export TXT saem com data em pt-BR mesmo nas rotas de idioma.

**A3/A4 — pendências conhecidas, na ordem certa:** `jspdf` ainda no `package.json` (passo 7) e `MAINTENANCE.md` sem a seção i18n (passo 6, condição 3.3). Nenhuma ação além de seguir o plano.

**A5 — processo:** o QUADRO parou em 2026-09-20 16:12 e não reflete os 7 commits de extração. Regra do canal: quem muda o estado atualiza o quadro na mesma entrega. Atualizei pela arquitetura desta vez (LOG #5).

**P1 segue aberta:** `_guia_decisao/` continua untracked (e cresceu — canal, aceite, registros, memorandos). Commitar junto ao próximo ciclo de terminal (Bloco 1 do handoff #3).

## Recomendação à Engenharia (quando retornar)

1. Fechar o 4c em commit isolado **com a expectativa do verify atualizada no mesmo diff** (A1).
2. Tratar as datas (A2/P6) — idealmente já no 4c, pois tocam `utils.ts` e o locale ativo.
3. Atualizar QUADRO + `aviso` no LOG ao fim de cada bloco (A5).
4. Seguir para passos 6–8 (MAINTENANCE, jspdf, build duplo flag off/on) e então o pacote de auditoria do Z.

---
*Registrado no canal como LOG #5; QUADRO atualizado pela arquitetura.*
