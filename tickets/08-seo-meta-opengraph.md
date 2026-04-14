# TICKET 08 — SEO, Meta Tags e Open Graph

## Prioridade: Baixa
## Tipo: Melhoria

## Contexto
A MARA pode ser compartilhada entre membros de CEPs por link. As meta tags atuais são básicas. Adicionar Open Graph e melhorar os metadados para que o link fique apresentável ao ser compartilhado no WhatsApp, e-mail, etc.

## O que fazer

### 1. Atualizar metadata no layout.tsx
Adicionar em `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "MARA — Matriz de Avaliação de Risco Algorítmico",
  description: "Ferramenta de apoio à avaliação ética de protocolos de pesquisa que utilizam sistemas de inteligência artificial, destinada aos Comitês de Ética em Pesquisa (CEP).",
  keywords: ["MARA", "risco algorítmico", "IA", "inteligência artificial", "ética em pesquisa", "CEP", "CONEP", "LGPD"],
  authors: [{ name: "MARA" }],
  openGraph: {
    title: "MARA — Matriz de Avaliação de Risco Algorítmico",
    description: "Avaliação ética de protocolos de pesquisa com IA para Comitês de Ética em Pesquisa.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 2. Criar imagem Open Graph
Criar uma imagem simples (1200x630px) com o logo e nome da MARA para usar como `og:image`. Pode ser um SVG convertido ou uma imagem estática em `public/og-image.png`.

## Critérios de aceite
- [ ] Meta tags atualizadas
- [ ] Open Graph configurado
- [ ] Link compartilhado mostra título e descrição corretos
- [ ] Favicon aponta para logo local (dependência do Ticket 01)

## Arquivos envolvidos
- `src/app/layout.tsx`
- `public/og-image.png` (novo)
