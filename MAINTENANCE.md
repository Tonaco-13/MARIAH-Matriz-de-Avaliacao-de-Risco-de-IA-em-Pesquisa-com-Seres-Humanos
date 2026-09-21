# MARIAH — Manutenção

Notas de manutenção da MARIAH (Matriz de Avaliação de Risco de Inteligência
Artificial em Pesquisa com Seres Humanos). Este documento descreve a
infraestrutura de internacionalização (i18n) introduzida na branch
`feat/i18n-architecture`. **Regra soberana:** a matriz (números, pesos, cortes,
ids, `matrixVersion`) é a fonte de verdade; nada de i18n pode alterá-la.

## Internacionalização (i18n)

### Visão geral

A MARIAH usa **next-intl 4** sobre Next.js 16 (App Router). O objetivo da
arquitetura i18n é permitir traduções futuras **sem** alterar o pt-BR atual: na
branch de infraestrutura, **nada visível muda** — este é o critério de sucesso.

- **Idiomas previstos:** `pt-BR` (padrão) · `es` · `en` · `de` · `fr` · `zh`.
- **URLs:** `localePrefix: "as-needed"`. O pt-BR fica **sem prefixo**
  (`/`, `/instrucoes`, `/transparencia`, `/validacao`); os demais idiomas, quando
  habilitados, ganham prefixo (`/es/...`).
- **Estrutura:** todas as páginas vivem sob `src/app/[locale]/`. O arquivo de
  middleware chama-se **`src/proxy.ts`** (renome do `middleware.ts` a partir do
  Next.js 16).

### Flag de habilitação — `LOCALES_ENABLED`

A exposição dos idiomas é controlada por uma flag lida **em runtime** dentro do
`proxy.ts` (`process.env.LOCALES_ENABLED === "true"`). **Não** é `NEXT_PUBLIC_*`
— para poder ser alternada sem rebuild no ambiente standalone/Vercel.

- **OFF (padrão):** qualquer caminho com prefixo de idioma gated
  (`/es`, `/en`, `/de`, `/fr`, `/zh`) é redirecionado (307) ao equivalente pt-BR
  sem prefixo; `/pt-BR` também redireciona para `/`. As rotas pt-BR são servidas
  normalmente. Resultado: a aplicação se comporta exatamente como antes do i18n.
- **ON:** o roteamento next-intl passa a servir também os idiomas prefixados.

Configuração adicional em `src/i18n/routing.ts` (fixada nesta branch):
`localeDetection: false` (locale só pela URL — não redireciona por
`Accept-Language`), `localeCookie: false` (sem cookie `NEXT_LOCALE`),
`alternateLinks: false` (sem header `Link`/`hreflang`). Isso mantém o
comportamento idêntico ao pré-i18n para todos os visitantes e evita cookies/SEO
de localidade nesta fase.

> **Servidor standalone:** `node .next/standalone/server.js` (usado pelo
> `npm start` via bun) tem um defeito conhecido de não consumir o rewrite interno
> do middleware, gerando laço nas rotas pt-BR sem prefixo. Em **`next dev`** e na
> **Vercel** o rewrite é interno e `/` responde 200. É um detalhe do runtime
> standalone avulso, alheio ao código i18n.

### Modelo de conteúdo: campo-canônico + `i18n`

Duas fontes de texto, deliberadamente separadas:

1. **Casca de UI e narrativa das páginas** → `messages/pt-BR.json`, acessada por
   `useTranslations()` / `getTranslations()` (`t()`, `t.rich()`, plural ICU).
   É a "casca" da interface; **não** contém conteúdo da matriz.
2. **Conteúdo da matriz** (enunciados, dicas, nomes de eixo/bloco, rótulos de
   nível, requisitos) → permanece **canônico pt-BR na spec**
   (`spec/mariah-spec.json`, exposto por `src/components/maria/data.ts`). Cada nó
   pode ganhar, no futuro, um campo **opcional** `i18n: { "<locale>": { "<campo>": "…" } }`.
   O acesso a esse conteúdo se dá pelo helper **`label(node, campo, locale)`**
   (em `data.ts`), com **fallback ao canônico pt-BR** quando não houver tradução.

Nesta branch **nenhum nó tem `i18n`** — logo `label()` é comprovadamente um
no-op (ver gate abaixo). A **religação** dos componentes a `label()` (e o
threading de locale no `utils.ts` para nomes de eixo/bloco computados) ocorre na
branch de tradução `feat/i18n-es`, em bloco, junto das traduções reais.

### Regra de ouro (B7)

Números, pesos, cortes (`58/127/208`; `64/141/230`), somas de bloco (`62/77`),
teto (`297`), **ids de questão** e **`matrixVersion`** **nunca** entram em
arquivos de mensagem nem em campos `i18n` como texto traduzível. Nenhuma chave de
persistência (`localStorage['maria-assessment-state-v2']`), export (`.json`) ou
gate deriva de string traduzível — as respostas são chaveadas por **id**.

### Critério de verificação: DOM-texto idêntico

"Nada muda" é verificado, não afirmado:

- **`scripts/parity-locale.py`** — normaliza as 4 rotas pré-renderizadas
  (nós de texto + `<title>`/`meta description` + hrefs de conteúdo, ignorando
  scripts/estilos e assets hasheados) e compara com a **baseline NDTI congelada**
  em `gate/baseline-ndti/` (gerada no 1º commit da branch, **imutável**).
  `python3 scripts/parity-locale.py check` deve dar **4/4 OK** com a flag off.
- **`scripts/i18n-identity.ts`** (roda no `npm run gate`) — prova que
  `label()` é no-op sobre a **allowlist de 344 entradas** de conteúdo traduzível:
  `label(node, campo, 'pt-BR')` e `label(node, campo, 'es')` (com `i18n` ausente)
  retornam ambos o canônico. A allowlist (332 base + `description`×4 +
  `motivoEliminatorio`×8; `exibicaoCondicional.descricao`×4 na base;
  `referenciaNormativa`, `obs`, `opcoes`, ids e números **fora**) está
  documentada no cabeçalho do script.
- **`scripts/i18n-no-literal.ts`** (roda no `npm run gate`) — guarda de regressão
  com dois checks nomeados. **(A) zero-literal JSX:** nenhum literal de texto
  pt-BR (acento ou palavra-domínio inequívoca) em `src/**/*.tsx` — a casca vem de
  `messages/` via `t()`, o conteúdo da matriz vem de `data.ts` por expressão.
  **(B) golden-rule:** números de corte/teto, ids de questão e `matrixVersion`
  não viram texto traduzível — regra **completa** nos campos `i18n` da spec (B1)
  e, nos `messages/*.json` (B2), falha por número de corte/`matrixVersion`
  (ids de questão em narrativa de ajuda são âncoras legítimas — listadas como
  aviso informativo, não bloqueiam). Os tokens proibidos são lidos da spec, não
  fixados no script.
- Telas do wizard (não pré-renderizadas) são conferidas por e2e no preview da
  Vercel contra a vitrine.

### `matrixVersion`

`spec.matrixVersion` sobe quando o **schema** da matriz muda. A infra i18n levou
`2.1.0 → 2.2.0` (o schema ganhou o campo `i18n` opcional; o **conteúdo** da
matriz não mudou). Ao alterar, atualize **no mesmo commit**:
`spec/mariah-spec.json`, `scripts/build-spec-v2.ts` (constante que ele grava) e a
expectativa em `scripts/verify-math.ts` — cada commit deve ser reproduzível verde.

### Gates (rodar antes de cada merge)

```
npm run verify      # matemática/estrutura da matriz (tsx)
npm run parity      # paridade spec × guia (128/0)
npm run gate        # vetores de nível/pontuação + i18n-identity (no-op de label) + i18n-no-literal (A: zero-literal JSX; B: golden-rule)
npm run build       # build de produção
python3 scripts/parity-locale.py check   # pt-BR idêntico à baseline NDTI (flag off)
```

### Fluxo de tradução futura (`feat/i18n-es`)

1. Preencher `messages/<locale>.json` (casca de UI/narrativa) e os campos `i18n`
   dos nós da spec (conteúdo da matriz), sem tocar em números/ids/`matrixVersion`.
2. Religar os componentes a `label()` (e threading de locale no `utils.ts`).
3. Ligar a flag `LOCALES_ENABLED=true` no ambiente desejado.
4. Rodar os gates; o `parity-locale check` continua a proteger o pt-BR.
