# TICKET 04 — Permitir Desmarcar Resposta (Toggle)

## Prioridade: Média
## Tipo: UX

## Contexto
Atualmente, ao clicar em "Sim" ou "Não", a resposta fica marcada permanentemente — não há como desmarcar. Se o avaliador clicar errado, ele precisa clicar na outra opção para mudar, mas não consegue voltar ao estado "sem resposta". Isso é importante porque uma questão sem resposta é diferente de uma resposta "Não".

## O que fazer

### 1. Implementar toggle no dispatch de respostas
Em `page.tsx`, nos reducers `SET_QUALITATIVE_ANSWER` e `SET_QUANTITATIVE_ANSWER`:
- Se o valor atual já é igual ao valor clicado, setar como `undefined` (desmarcar).
- Caso contrário, setar o novo valor normalmente.

### 2. Atualizar handlers nos componentes
Em `QualitativeAssessment.tsx` e `QuantitativeAssessment.tsx`:
- Passar a lógica de toggle para os botões Sim/Não.
- Quando a resposta for desmarcada, o card da questão volta ao estilo neutro (sem borda verde/vermelha).

### 3. Feedback visual
- Ao desmarcar, animar suavemente a transição de volta ao estado neutro.

## Critérios de aceite
- [ ] Clicar no mesmo botão já selecionado desmarca a resposta
- [ ] A contagem de respostas atualiza corretamente ao desmarcar
- [ ] O score ao vivo (Versão B) recalcula ao desmarcar
- [ ] A validação de completude (Ticket 02) reconhece a questão como não respondida

## Arquivos envolvidos
- `src/app/page.tsx` (reducer)
- `src/components/mara/QualitativeAssessment.tsx`
- `src/components/mara/QuantitativeAssessment.tsx`
