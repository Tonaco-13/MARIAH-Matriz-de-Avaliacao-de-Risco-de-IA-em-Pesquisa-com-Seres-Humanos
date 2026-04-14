# TICKET 05 — Confirmação antes de Reiniciar Avaliação

## Prioridade: Média
## Tipo: UX / Segurança

## Contexto
O botão "Nova Avaliação" na tela de resultados (e potencialmente ao clicar "Voltar" repetidamente) limpa todo o estado e volta ao início. Não há confirmação. O avaliador pode perder todo o trabalho acidentalmente com um clique.

## O que fazer

### 1. Adicionar diálogo de confirmação ao reiniciar
Usar o componente `AlertDialog` do shadcn/ui (já existe em `src/components/ui/alert-dialog.tsx`).

Quando o usuário clicar em "Nova Avaliação":
- Abrir diálogo: "Tem certeza que deseja iniciar uma nova avaliação? Todas as respostas serão apagadas."
- Botão primário: "Sim, reiniciar" (destructive)
- Botão secundário: "Cancelar"

### 2. Proteger navegação para trás
Na tela de avaliação (assessment), o botão "Voltar" no primeiro eixo/bloco volta para a tela de contexto — isso é OK. Mas adicionar confirmação se o usuário tentar sair da avaliação (ex.: clicar no logo ou voltar para seleção de versão com respostas já preenchidas).

## Critérios de aceite
- [ ] "Nova Avaliação" pede confirmação antes de limpar
- [ ] O diálogo usa o AlertDialog do shadcn/ui
- [ ] Cancelar não limpa nada
- [ ] Confirmar limpa estado e localStorage

## Arquivos envolvidos
- `src/components/mara/Results.tsx` (botão Nova Avaliação)
- `src/app/page.tsx` (handler handleRestart)
