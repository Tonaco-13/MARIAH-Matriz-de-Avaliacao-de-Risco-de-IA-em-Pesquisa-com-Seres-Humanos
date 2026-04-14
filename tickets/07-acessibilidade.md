# TICKET 07 — Melhorias de Acessibilidade (a11y)

## Prioridade: Média
## Tipo: Acessibilidade

## Contexto
A MARA é uma ferramenta institucional para CEPs — deve ser acessível. O shadcn/ui já traz boa base de acessibilidade via Radix, mas há ajustes necessários nos componentes customizados.

## O que fazer

### 1. Roles e aria-labels nos botões de resposta
- Os botões Sim/Não nas questões devem ter `aria-label` descritivo: "Questão 1.1 — Responder Sim" / "Questão 1.1 — Responder Não".
- O estado selecionado deve usar `aria-pressed="true"`.

### 2. Indicadores de risco acessíveis
- As cores de nível de risco (verde/amarelo/laranja/vermelho) não devem ser o único indicador. Já existe texto "Nível I — Baixo", o que é bom. Verificar que os badges e barras de progresso têm `aria-label` adequado.

### 3. Navegação por teclado
- Verificar que a navegação entre eixos/blocos funciona com Tab e Enter.
- Os tooltips de dica (HelpCircle) devem ser acessíveis — o `TooltipTrigger` do Radix já suporta, mas verificar que funciona com teclado.

### 4. Landmarks e headings
- Adicionar `role="main"` ao `<main>` (já existe como tag semântica).
- Verificar hierarquia de headings (h1 → h2 → h3) — não pular níveis.
- O header deve ter `role="banner"`.

### 5. Contraste de cores
- Verificar contraste WCAG AA (4.5:1 para texto normal) nos textos `text-muted-foreground` sobre backgrounds claros.
- Os badges de nível (ex.: bg-green-100 text-green-700) devem atender contraste mínimo.

### 6. Skip link
- Adicionar "Pular para o conteúdo" como primeiro elemento focável da página.

## Critérios de aceite
- [ ] Todos os botões de resposta têm aria-label descritivo
- [ ] Navegação completa possível apenas com teclado
- [ ] Hierarquia de headings correta
- [ ] Skip link funcional
- [ ] Contraste WCAG AA nos textos principais

## Arquivos envolvidos
- `src/components/mara/QualitativeAssessment.tsx`
- `src/components/mara/QuantitativeAssessment.tsx`
- `src/components/mara/Results.tsx`
- `src/components/mara/VersionSelector.tsx`
- `src/components/mara/EntryFilter.tsx`
- `src/app/layout.tsx` (skip link)
