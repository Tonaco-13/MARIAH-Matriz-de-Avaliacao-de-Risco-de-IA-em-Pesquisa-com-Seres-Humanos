# TICKET B — Navegação Suave e Transições

## Prioridade: CRÍTICA (apresentação ao MS)
## Tipo: UX / Polimento

## Contexto
A MARA será demonstrada ao vivo. A navegação entre etapas precisa ser fluida e profissional — sem pulos bruscos de tela. Atualmente as transições são instantâneas. Precisamos adicionar transições suaves que transmitam qualidade.

## O que fazer

### 1. Instalar framer-motion
bun add framer-motion

### 2. Criar wrapper de transição
Criar um componente PageTransition.tsx em src/components/mara/:

- Usar motion.div do framer-motion com AnimatePresence
- initial: opacity 0, y 12
- animate: opacity 1, y 0
- exit: opacity 0, y -8
- transition: duration 0.25, ease easeOut
- Receber stepKey como prop para triggerar animação na troca

### 3. Aplicar no page.tsx
Envolver o switch de steps com o PageTransition, passando state.step + state.version como stepKey.

### 4. Transições dentro dos componentes de avaliação
Nos componentes QualitativeAssessment e QuantitativeAssessment, ao navegar entre eixos/blocos, adicionar transição suave no conteúdo das questões:
- Usar AnimatePresence + motion.div com key=currentAxis ou currentBlock
- initial: opacity 0, x 20
- animate: opacity 1, x 0
- exit: opacity 0, x -20
- transition: duration 0.2

### 5. Micro-interações nos botões de resposta
Envolver os botões Sim/Não com motion.button ou adicionar whileTap={{ scale: 0.97 }} para feedback tátil sutil.

### 6. Scroll suave — verificar
O código já usa window.scrollTo({ top: 0, behavior: smooth }) ao trocar de etapa. Verificar que funciona corretamente.

### 7. Barra de progresso animada
Garantir que a barra de progresso geral e a barra de score (Versão B) animam suavemente ao mudar de valor, adicionando transition-all duration-500 se necessário.

## Critérios de aceite
- [ ] Transição fade+slide entre etapas do wizard (version, filter, context, assessment, results)
- [ ] Transição entre eixos (Versão A) e blocos (Versão B)
- [ ] Micro-interação nos botões Sim/Não
- [ ] Barras de progresso animam suavemente
- [ ] Nenhuma transição dura mais que 300ms (deve ser snappy, não lenta)
- [ ] bun run build e bun run lint passam

## Arquivos envolvidos
- package.json (framer-motion)
- src/components/mara/PageTransition.tsx (novo)
- src/app/page.tsx (wrapper)
- src/components/mara/QualitativeAssessment.tsx (transição entre eixos)
- src/components/mara/QuantitativeAssessment.tsx (transição entre blocos)
