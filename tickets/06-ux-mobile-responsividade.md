# TICKET 06 — Melhorias de Responsividade Mobile

## Prioridade: Média
## Tipo: UX

## Contexto
Avaliadores de CEP podem usar tablets ou celulares durante reuniões. A UI atual tem design responsivo básico, mas há pontos que podem ser melhorados.

## O que fazer

### 1. Barra de navegação de eixos/blocos
- Em telas pequenas, a barra de botões de eixos/blocos pode quebrar em várias linhas. Converter para scroll horizontal com `overflow-x-auto` e `flex-nowrap`, ou usar um dropdown/select em mobile.

### 2. Barra de score ao vivo (Versão B)
- O layout `flex` com pontuação + nível + cláusula pode comprimir em telas estreitas. Testar em 320px e ajustar para empilhar verticalmente em mobile.

### 3. Botões Sim/Não nas questões
- Garantir que os botões tenham tamanho de toque adequado (mínimo 44x44px) em mobile.
- O texto auxiliar (resposta de risco, pontos) deve quebrar graciosamente.

### 4. Tabela de comparação na tela de seleção
- A tabela comparativa no VersionSelector pode ficar apertada em mobile. Considerar converter para cards empilhados em telas < 640px.

### 5. Relatório de resultados
- Garantir que as barras de progresso e os cards de eixo/bloco nos resultados são legíveis em mobile.

## Critérios de aceite
- [ ] UI funcional e legível em viewport 320px (iPhone SE)
- [ ] Botões Sim/Não com área de toque >= 44px
- [ ] Sem overflow horizontal indesejado
- [ ] Score ao vivo legível em mobile
- [ ] `bun run build` passa

## Arquivos envolvidos
- `src/components/mara/QualitativeAssessment.tsx`
- `src/components/mara/QuantitativeAssessment.tsx`
- `src/components/mara/VersionSelector.tsx`
- `src/components/mara/Results.tsx`
