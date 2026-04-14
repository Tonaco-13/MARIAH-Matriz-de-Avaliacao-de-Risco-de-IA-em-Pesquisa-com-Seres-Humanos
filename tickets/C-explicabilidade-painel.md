# TICKET C — Explicabilidade: Painel Lateral de Ajuda

## Prioridade: CRÍTICA (apresentação ao MS)
## Tipo: Feature / Conteúdo

## Contexto
A explicabilidade é um dos pilares da MARA — cada questão tem uma razão ética e normativa. Atualmente as dicas aparecem apenas como tooltip no hover do ícone (?). Isso tem dois problemas: (1) em mobile/tablet não funciona bem, (2) numa demonstração ao vivo é invisível para a plateia. Precisamos de um painel lateral que mostre a fundamentação de cada questão de forma clara e apresentável.

## O que fazer

### 1. Criar componente HelpPanel.tsx
Usar o componente Sheet do shadcn/ui (já existe em src/components/ui/sheet.tsx).

Criar src/components/mara/HelpPanel.tsx com as seguintes props:
- open: boolean
- onClose: () => void
- questionId: string
- questionText: string
- dica: string
- referencia?: string (referência normativa, quando disponível)
- efeito?: risco | mitigacao (para Versão B)
- pontos?: number (para Versão B)
- riskAnswer?: sim | nao

O painel deve mostrar:
- ID e texto da questão no topo
- "Por que esta questão importa" (campo dica existente)
- Resposta de risco: qual resposta aumenta o risco e por quê
- Efeito (apenas Versão B): se é questão de risco ou mitigação, com quantos pontos
- Referência normativa (quando disponível): ex. "Art. 11, LGPD"
- Ícone visual: alerta para risco, escudo para mitigação

### 2. Adicionar campo referencia aos tipos em data.ts
Adicionar campo opcional nos tipos QualitativeQuestion e QuantitativeQuestion:
  referencia?: string

### 3. Preencher referências nas questões mais importantes
Não precisa preencher todas. Priorizar as que serão demonstradas:

Versão A:
- 1.1 (autonomia): Resolução CNS 466/12, item III.1
- 2.1 (decisões clínicas): Resolução CNS 466/12, item V
- 2.4 (populações vulneráveis): Resolução CNS 466/12, item III.2.i; Resolução CNS 510/16
- 3.1 (dados sensíveis): LGPD, Art. 11
- 3.4 (conformidade LGPD): LGPD, Arts. 7, 11 e 41
- 5.1 (supervisão humana): EU AI Act, Art. 14; Resolução CNS 466/12
- 5.2 (único determinante): Cláusula de Prevalência Ética — Capítulo 7 do Guia

Versão B:
- P4.1 (único determinante): Cláusula de Prevalência Ética — Capítulo 7 do Guia
- P4.2 (dano irreversível): Cláusula de Prevalência Ética — Capítulo 7 do Guia
- P6.1 (dados sensíveis): LGPD, Art. 11
- P6.5 (conformidade LGPD): LGPD, Arts. 7, 11 e 41
- P7.3 (supervisão humana mitigação): EU AI Act, Art. 14

### 4. Integrar nos componentes de avaliação
Em QualitativeAssessment.tsx e QuantitativeAssessment.tsx:
- Manter o ícone HelpCircle (?)
- Ao clicar, abrir o HelpPanel lateral (não mais tooltip como ação principal)
- Em desktop, TAMBÉM manter o tooltip no hover para acesso rápido (dual behavior)
- Gerenciar estado: const [helpQuestion, setHelpQuestion] = useState(null)

### 5. Estilo do painel
- Largura: sm:max-w-md (não ocupar tela toda)
- Abre pela direita
- Fundo branco, texto legível
- Seções separadas visualmente
- Botão de fechar claro

## Critérios de aceite
- [ ] Clicar no ícone (?) abre painel lateral com explicação completa
- [ ] Painel mostra: questão, fundamentação, resposta de risco, efeito (Versão B)
- [ ] Pelo menos 12 questões com referência normativa preenchida
- [ ] Funciona em mobile (toque) e desktop (clique)
- [ ] Tooltip de hover mantido em desktop como atalho
- [ ] bun run build e bun run lint passam

## Arquivos envolvidos
- src/components/mara/HelpPanel.tsx (novo)
- src/components/mara/data.ts (campo referencia + dados)
- src/components/mara/QualitativeAssessment.tsx (integração)
- src/components/mara/QuantitativeAssessment.tsx (integração)
