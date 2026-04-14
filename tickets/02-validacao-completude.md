# TICKET 02 — Validação de Completude antes do Resultado

## Prioridade: Alta
## Tipo: Bug / UX

## Contexto
Atualmente, o botão "Ver Resultado" na última página de avaliação (tanto na Versão A quanto na B) está sempre habilitado, mesmo que o avaliador não tenha respondido todas as perguntas. Isso permite gerar um resultado incompleto, o que invalida a avaliação.

## O que fazer

### 1. Bloquear avanço sem completude na Versão A (QualitativeAssessment.tsx)
- O botão "Ver Resultado" (que aparece no último eixo) deve ser desabilitado se nem todas as 41 questões foram respondidas.
- Mostrar mensagem indicando quantas questões faltam: "Faltam X questões para concluir a avaliação".
- Permitir navegar entre eixos livremente (não bloquear navegação entre eixos).

### 2. Bloquear avanço sem completude na Versão B (QuantitativeAssessment.tsx)
- Mesmo comportamento: botão "Ver Resultado" desabilitado até todas as 53 questões respondidas.
- Mostrar contagem de questões pendentes.

### 3. Feedback visual de eixos/blocos incompletos
- Na barra de navegação de eixos/blocos, já existe indicador de completude (CheckCircle2 vs Circle). Adicionar um indicador visual mais forte (ex.: contorno vermelho ou badge de alerta) nos eixos/blocos que têm questões sem resposta quando o usuário tenta avançar para o resultado.

## Critérios de aceite
- [ ] Não é possível ver o resultado sem responder todas as questões da versão ativa
- [ ] Mensagem clara indicando quantas questões faltam
- [ ] Navegação entre eixos/blocos permanece livre
- [ ] `bun run lint` e `bun run build` passam

## Arquivos envolvidos
- `src/components/mara/QualitativeAssessment.tsx`
- `src/components/mara/QuantitativeAssessment.tsx`
