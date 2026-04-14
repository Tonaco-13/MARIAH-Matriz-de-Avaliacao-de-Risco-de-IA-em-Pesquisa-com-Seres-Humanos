# TICKET 09 — Enriquecer Conteúdo Contextual das Questões

## Prioridade: Baixa
## Tipo: Conteúdo / UX

## Contexto
As dicas (tooltips) das questões já existem e são úteis. Porém, para avaliadores menos experientes com IA, pode ser útil expandir o conteúdo contextual — exemplos práticos, referências normativas, e links para os documentos-base da MARA.

## O que fazer

### 1. Expandir tooltips para painel lateral (opcional)
Em vez de apenas tooltip hover (que é difícil em mobile), oferecer um botão que abre um painel lateral (Sheet do shadcn/ui) com:
- A dica completa
- Exemplo prático quando relevante
- Referência normativa (ex.: "Art. 11 da LGPD", "Resolução CNS 466/12")

### 2. Adicionar campo `referencia` ao tipo de questão
Em `data.ts`, adicionar campo opcional `referencia?: string` nos tipos `QualitativeQuestion` e `QuantitativeQuestion`. Preencher gradualmente com referências normativas.

### 3. Implementar painel de ajuda
- Ao clicar no ícone de help (HelpCircle), abrir um Sheet lateral com a dica expandida.
- Em desktop, manter o tooltip para hover rápido.
- Em mobile, o clique no ícone sempre abre o Sheet.

## Critérios de aceite
- [ ] Painel lateral funcional com dica expandida
- [ ] Funciona em mobile (toque) e desktop (hover + clique)
- [ ] Campo `referencia` adicionado ao tipo (mesmo que vazio inicialmente)
- [ ] Pelo menos 5 questões com referências normativas como exemplo

## Arquivos envolvidos
- `src/components/mara/data.ts` (tipo + dados)
- `src/components/mara/QualitativeAssessment.tsx`
- `src/components/mara/QuantitativeAssessment.tsx`
