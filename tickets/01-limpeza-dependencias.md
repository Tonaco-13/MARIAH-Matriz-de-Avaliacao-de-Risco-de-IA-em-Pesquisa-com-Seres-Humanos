# TICKET 01 — Limpeza de Dependências e Boilerplate

## Prioridade: Alta
## Tipo: Manutenção / Housekeeping

## Contexto
O projeto foi criado a partir de um template do Z AI que inclui muitas dependências e arquivos que não são usados pela MARA. Isso infla o bundle, confunde a leitura do package.json e pode causar conflitos futuros.

## O que fazer

### 1. Remover dependências não utilizadas do package.json
Verificar uso real (grep no src/) e remover as que não são importadas em nenhum lugar:
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (drag and drop — não usado)
- `@mdxeditor/editor` (editor markdown — não usado)
- `@tanstack/react-query` (data fetching — não usado)
- `@tanstack/react-table` (tabelas — não usado)
- `framer-motion` (animações — não usado)
- `react-markdown` (renderização markdown — não usado)
- `react-resizable-panels` (painéis redimensionáveis — não usado)
- `react-syntax-highlighter` (syntax highlighting — não usado)
- `recharts` (gráficos — não usado atualmente)
- `zustand` (state management — não usado, app usa useReducer)
- `next-auth` (autenticação — não configurado)
- `next-intl` (internacionalização — não usado)
- `next-themes` (temas — não usado)
- `react-hook-form`, `@hookform/resolvers` (formulários — não usado, app usa estado direto)
- `zod` (validação — não usado)
- `uuid` (geração de IDs — não usado)
- `sharp` (processamento de imagem — não usado)
- `z-ai-web-dev-sdk` (SDK do Z AI — não necessário em produção)
- `@reactuses/core` (hooks utilitários — verificar se usado)

**IMPORTANTE**: Antes de remover, fazer `grep -r "PACOTE" src/` para confirmar que não é usado. Alguns componentes do shadcn/ui podem importar Radix internamente.

### 2. Limpar schema Prisma
O arquivo `prisma/schema.prisma` contém models genéricos (User, Post) que não têm relação com a MARA. Por enquanto, manter apenas a configuração base do datasource sem models, ou remover Prisma inteiramente se não for necessário nesta fase.

### 3. Limpar API route boilerplate
Verificar `src/app/api/route.ts` — se for boilerplate sem funcionalidade MARA, remover.

### 4. Substituir favicon
Em `src/app/layout.tsx`, o ícone aponta para `https://z-cdn.chatglm.cn/z-ai/static/logo.svg` (CDN do ChatGLM/Z AI). Substituir por `/logo.svg` (que já existe em `public/logo.svg`).

### 5. Verificar componentes shadcn/ui não utilizados
Há ~40 componentes em `src/components/ui/`. Verificar quais são importados nos componentes MARA e remover os não utilizados. Componentes usados confirmados:
- card, button, badge, progress, separator, tabs, tooltip, textarea, label, input, form, dialog, alert, sheet, scroll-area, toaster/toast, select, checkbox, radio-group, popover, slider, accordion

## Critérios de aceite
- [ ] `bun install` sem dependências desnecessárias
- [ ] `bun run build` passa sem erros
- [ ] `bun run lint` passa sem erros
- [ ] Favicon aponta para `/logo.svg`
- [ ] Nenhum import quebrado

## Arquivos envolvidos
- `package.json`
- `bun.lock` (regerado após remover deps)
- `prisma/schema.prisma`
- `src/app/api/route.ts`
- `src/app/layout.tsx` (favicon)
- `src/components/ui/*.tsx` (limpeza)
