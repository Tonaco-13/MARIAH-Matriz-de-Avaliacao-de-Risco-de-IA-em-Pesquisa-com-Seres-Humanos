# TICKET A — Campos de Identificação do Protocolo

## Prioridade: CRÍTICA (apresentação ao MS)
## Tipo: Feature

## Contexto
A MARA será apresentada ao Ministério da Saúde na entrega do Guia de Diretrizes Éticas. O relatório gerado precisa ter identidade: saber qual protocolo foi avaliado, por qual CEP e de qual instituição. Atualmente o formulário de contexto tem apenas 2 campos descritivos. Precisamos adicionar 3 campos de identificação.

## O que fazer

### 1. Adicionar campos ao formulário de contexto (ContextForm.tsx)
Adicionar ANTES das perguntas descritivas existentes, numa seção separada "Identificação do Protocolo":

| Campo | ID | Tipo | Obrigatório |
|-------|-----|------|-------------|
| Título do Projeto | titulo | input text | Sim |
| Instituição | instituicao | input text | Sim |
| Nome do CEP | cep_nome | input text | Sim |

Usar o componente Input do shadcn/ui (já existe em src/components/ui/input.tsx).

Layout sugerido:
- Seção "Identificação do Protocolo" com Card
- Título do Projeto em linha cheia
- Instituição e Nome do CEP lado a lado (grid 2 cols em desktop)
- Depois, seção "Caracterização do Contexto de Uso" com as perguntas existentes

### 2. Atualizar validação
O botão "Continuar" já verifica se as perguntas de contexto foram preenchidas (allFilled). Incluir os 3 novos campos na mesma validação.

### 3. Atualizar tipo no estado (page.tsx)
Os novos campos serão salvos no mesmo contextAnswers: Record<string, string> que já existe. Os IDs titulo, instituicao, cep_nome serão chaves nesse Record.

### 4. Atualizar o relatório HTML (utils.ts > generateReportHTML)
Na seção de cabeçalho do relatório HTML, adicionar:
- Título do Projeto em destaque (após o cabeçalho MARA)
- Instituição e CEP na linha de metadados (ao lado da versão e data)

### 5. Atualizar o relatório texto (utils.ts > generateReportText)
Incluir os mesmos campos no relatório em texto puro.

### 6. Atualizar Results.tsx
Na seção "Caracterização do Contexto" nos resultados, mostrar os 3 campos de identificação antes das respostas descritivas.

## IMPORTANTE
- NÃO adicionar esses campos ao data.ts como CONTEXT_QUESTIONS. Eles são campos de input simples, não perguntas com dica/tooltip.
- Manter os CONTEXT_QUESTIONS existentes (contexto1, contexto2) como estão.

## Critérios de aceite
- [ ] 3 campos novos no formulário de contexto: título, instituição, CEP
- [ ] Campos são obrigatórios (não avança sem preencher)
- [ ] Campos aparecem no relatório HTML e texto
- [ ] Campos aparecem na seção de contexto da tela de resultados
- [ ] bun run build e bun run lint passam

## Arquivos envolvidos
- src/components/mara/ContextForm.tsx (campos novos)
- src/components/mara/utils.ts (relatórios)
- src/components/mara/Results.tsx (exibição)
