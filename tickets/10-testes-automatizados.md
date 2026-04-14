# TICKET 10 — Testes Automatizados para Lógica de Scoring

## Prioridade: Média
## Tipo: Qualidade / Testes

## Contexto
A lógica de scoring da MARA é o coração do sistema — erros de cálculo podem levar a classificações de risco incorretas. Atualmente não há testes automatizados. É essencial testar pelo menos as funções de cálculo.

## O que fazer

### 1. Configurar framework de testes
Instalar e configurar Vitest (compatível com Bun e Next.js):
```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom
```

Adicionar script no package.json:
```json
"test": "vitest run",
"test:watch": "vitest"
```

### 2. Criar testes para utils.ts — Versão A (Qualitativa)
Testar `countRiskAnswersAxis()`:
- Nenhuma resposta de risco → 0
- Todas respostas de risco → total do eixo
- Mix de respostas

Testar `getAxisRiskLevel()`:
- 0 → Nível I
- 1-2 → Nível II
- 3-4 → Nível III
- 5+ → Nível IV

Testar `getQualitativeFinalLevel()`:
- Consolidação: nível final = mais alto entre eixos
- Eixos com níveis mistos

### 3. Criar testes para utils.ts — Versão B (Quantitativa)
Testar `calculateBlockScore()`:
- Questões de risco: resposta de risco soma pontos
- Questões de mitigação: "Sim" subtrai pontos
- Bloco 7: score mínimo 0

Testar `getQuantitativeRiskLevel()`:
- 0-50 → Nível I
- 51-110 → Nível II
- 111-180 → Nível III
- 181+ → Nível IV

Testar `checkClausulaPrevalencia()`:
- P4.1 = sim → true
- P4.2 = sim → true
- Ambos nao → false

Testar `getQuantitativeFinalResult()`:
- Score normal → nível por pontuação
- Cláusula ativada → Nível IV independente do score
- Score total mínimo 0

### 4. Criar testes para getRequirementsForLevel()
- Nível I → apenas requisitos I
- Nível III → requisitos I + II + III (cumulativo)
- Nível IV → todos os requisitos

### 5. Teste de cenário completo
Criar pelo menos 2 cenários end-to-end:
- Cenário "risco baixo": todas respostas seguras → Nível I
- Cenário "risco crítico": P4.1 = sim → Cláusula ativada → Nível IV

## Critérios de aceite
- [ ] `bun run test` executa e passa todos os testes
- [ ] Cobertura de todas as funções de cálculo em utils.ts
- [ ] Pelo menos 15 test cases
- [ ] Testes de borda: score 0, score máximo, cláusula, bloco 7 bidirecional

## Arquivos envolvidos
- `package.json` (vitest)
- `vitest.config.ts` (novo)
- `src/components/mara/__tests__/utils.test.ts` (novo)
