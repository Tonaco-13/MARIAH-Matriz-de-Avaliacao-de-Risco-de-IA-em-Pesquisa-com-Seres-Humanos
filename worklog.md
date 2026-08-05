> **Nota (2026-05-11):** O software foi renomeado em duas etapas no mesmo dia: primeiro de **MARA** (Matriz de Avaliação de Risco Algorítmico) para **MAR.IA**, e logo em seguida para **MARIA** (Matriz de Avaliação de Risco em Inteligência Artificial) — sem o ponto. O acrônimo é exato: 5 letras, 5 palavras. As entradas históricas abaixo preservam o nome original como registro do que estava em uso à época.

> **Nota (2026-08-05):** Renomeado de **MARIA** para **MARIAH** — "Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos" (o "H" de "Humanos"; acrônimo exato: 6 letras). Motivo: evitar colisão com ferramenta de IA homônima lançada pelo STF. As referências internas (variáveis `MARIA_*`, rota `/maria`, pasta e imports) preservam "maria" minúsculo de propósito.

---
Task ID: 1
Agent: Main Agent
Task: Read and analyze all MARA documents to plan software

Work Log:
- Read 6 DOCX files: Instrucoes_MARA_corrigidas.docx, MatrizQuanti_corrigida.docx, Matrizquali.docx, Instruções de Uso Matriz de Risco Algoritimico.docx, CAPI_TULO_7_corrigido.docx, CAPI_TULO_9_corrigido.docx
- Extracted complete structure of both Version A (Qualitative, 5 axes) and Version B (Quantitative, 7 blocks)
- Identified all questions, scoring rules, risk answers, and critical clauses

Stage Summary:
- MARA has two versions: A (Qualitative, 5 axes, binary questions) and B (Quantitative, 7 blocks, weighted scoring)
- Total of 41 questions in Version A and 53 questions in Version B
- Key rules: consolidation (highest axis), Cláusula de Prevalência Ética, bidirectional Block 7

---
Task ID: 2
Agent: Full-Stack Developer
Task: Build complete MARA web application

Work Log:
- Created multi-step wizard app with 5 steps: Version Selection, Entry Filter, Context Characterization, Assessment, Results
- Implemented Version A with 5 axes (41 questions), binary Sim/Não, risk counting per axis, consolidation rule
- Implemented Version B with 7 blocks (53 questions), weighted scoring, live score sidebar, Cláusula de Prevalência Ética
- Added triagem mode (A → B for Level III/IV)
- Added localStorage persistence, print/PDF report, responsive design
- Lint passes cleanly, app runs on port 3000

Stage Summary:
- 9 component files created in src/components/mara/
- Complete data model with all questions, scoring, and requirements in data.ts
- Calculation utilities in utils.ts with all scoring logic
- Professional UI with teal/amber color scheme, risk level badges, progress indicators

---
Task ID: 3
Agent: Main Agent (Claude)
Task: Incorporar Resolução CNS n.º 738/2024 e corrigir matemática do Bloco 7

Data: 2026-04-23

Work Log:
- Comparei matrizes revisadas (MatrizQuanti_com_res738.docx, Matrizquali_com_res738.docx) contra o código Z AI existente
- IDENTIFIQUEI BUG pré-existente: Bloco 7 Subbloco 7B não era bidirecional. Mitigações apenas subtraíam em "Sim"; com "Não" não somavam, o que tornava o teto real de 173 pts (não 238 documentado) e deixava Nível IV inalcançável só por pontuação.
- IDENTIFIQUEI inconsistência normativa: instruções narrativas mencionam novos máximos (Bloco 3: 23, Bloco 4: 24, Bloco 6: 55, total 244) mas as tabelas das matrizes preservam os antigos (14, 8, 50, 238). Adotei as TABELAS como fonte autoritativa.
- Correções decididas em conjunto com Fabiano:
  * Bug Bloco 7 → BIDIRECIONAL: "Sim" subtrai |pontos|, "Não" soma |pontos|. Teto restaurado em 238.
  * Thresholds RECALIBRADOS proporcionalmente quando Bloco 6.b está ativo (267 max): I 0-56 · II 57-123 · III 124-202 · IV 203-267.

Mudanças no código:
- data.ts: adicionados Eixo 3.b (5 perguntas) e Bloco 6.b (5 perguntas, 29 pts), flags condicionalBancoDados, elevacaoEspecial, eliminatorio; constantes THRESHOLDS_BASE / THRESHOLDS_COM_BANCO; REQUIREMENTS_RES738; DATABASE_FILTER_QUESTION
- utils.ts: reescrito calculateBlockScore bidirecional; funções getApplicableAxes/Blocks condicionais; getQuantitativeFinalResult agora retorna maxScore/thresholds dinâmicos; detecção de eliminatório (P6.b.2/3.b.2); Eixo 3.b usa elevação especial 0→I, 1-2→III, 3+→IV
- EntryFilter.tsx: adicionada segunda pergunta (filtro Res 738); consolidado layout com duas perguntas
- page.tsx: novo estado usesDatabase persistido em localStorage; propagado para componentes downstream
- QualitativeAssessment.tsx: renderização condicional de Eixo 3.b; selo "Res 738" nos tabs; elevação especial documentada no header do eixo; badge ELIMINATÓRIO em 3.b.2
- QuantitativeAssessment.tsx: renderização condicional de Bloco 6.b; faixas de nível dinâmicas na barra de progresso ao vivo; label da mitigação agora bidirecional; indicador de protocolo não avaliável
- Results.tsx: card de contexto mostra filtro banco; aviso forte quando protocoloNaoAvaliavel; breakdown inclui 3.b/6.b com selos Res 738; faixas dinâmicas no rodapé do total; lista de requisitos cumulativa inclui seção Res 738

Verificação:
- npx tsc --noEmit: 0 erros em src/components/mara e src/app
- npx next build: compila (Compiled successfully, 4 rotas geradas)
- scripts/verify-math.ts: 34/34 assertions passam (estrutura, thresholds, Bloco 7 bidirecional atingindo 75 pts no pior caso, total 238/267 atingíveis, eliminatórios P6.b.2 e 3.b.2, elevação especial do Eixo 3.b, Cláusula de Prevalência Ética)

Stage Summary:
- MARA atualizada com Res 738/2024 (Eixo 3.b e Bloco 6.b) e bug bidirecional corrigido
- Total de questões: Quali 41 (base) / 46 (com banco); Quanti 51 (base) / 56 (com banco)
- Thresholds por cenário: sem banco 0-50/51-110/111-180/181-238; com banco 0-56/57-123/124-202/203-267
- Protocolos sem banco de dados preservam 100% do comportamento original (salvo pela correção do Bloco 7 que agora permite Nível IV por pontuação)

---

## Changelog 2026-07-09 — v0.5.0 (consentimento e correlatos)

Origem: decisões do GT de revisão do Guia (coordenação, 05–07/07/2026) e parecer
da profa. Roseli, relatora da Res. CNS n.º 738/2024. Alimenta a atualização dos
Apêndices A–C do Guia (tarefa N4). Teto (238 sem banco / 267 com banco) e faixas
de nível **inalterados**. Numeração/IDs existentes **preservados**.

Mudanças aplicadas:
- **Passo 1** — 2.8 (Eixo 2) e P5.8 (Bloco 5): pergunta reformulada de "exclusão
  de dados do treinamento" para "retirada de consentimento" (exclusão das bases +
  não-uso em treinamentos futuros); dica nova com três compromissos verificáveis
  (Lei n.º 14.874/2024; LGPD art. 8.º §5.º e art. 18). P5.8 mantém 6 pts.
- **Passo 2** — 1.2 (Eixo 1) e P2.2 (Bloco 2): dica enriquecida com limiar de
  mudança e obtenção de **novo consentimento** (terminologia fixada — nunca
  "re-consentimento").
- **Passo 5** — 2.9 (Eixo 2) e P5.7 (Bloco 5): dica enriquecida com o direito à
  devolutiva de resultados (LGPD; Lei n.º 14.874/2024). Sem nova pergunta.
- **Passo 3A** — nova **2.10** (Eixo 2), condicional a 1.2=Sim (via "Não se
  aplica"), **não-pontuável** (novo flag `naoPontuavel`, excluída de
  `countRiskAnswersAxis`), não-eliminatória. Serve de registro/diligência.
- **Passo 3B** — nova **P2.8** (Bloco 2), condicional a P2.2=Sim (via N/A),
  `pontos: 0`, **eliminatória** (diligência impeditiva, mesmo mecanismo da
  P6.b.2). Refatoração de `getEliminatoryQuestionTriggered` (removido o guard
  `if (!usesDatabase)`; eliminatórias da Res. 738 seguem restritas por
  `getApplicable*`). Nova função `getEliminatoryInfo` parametriza a mensagem de
  "não avaliável" por norma (Res. 738/§7.3.6 vs. Lei 14.874/LGPD); aplicada em
  `generateReportHTML`, `generateReportText`, `Results.tsx` e badges das telas A/B.
- **Passo 4** — NÃO alterado. "dispensa de TCLE" (3.b.4, P6.b.4 e req-738-III-1)
  apenas listado para deliberação jurídica com a relatora.
- **Passo 6** — rascunhos registrados em `PROPOSTAS_VALIDACAO_POSTERIOR.md`
  (não aplicados).

Arquivos tocados: data.ts, utils.ts, QualitativeAssessment.tsx,
QuantitativeAssessment.tsx, Results.tsx, scripts/verify-math.ts (contagens
42/47 quali e 52/57 quanti), package.json (0.4.0 → 0.5.0).

Verificação:
- scripts/verify-math.ts: 46/46 assertions (teto 238/267, Bloco 7 bidirecional,
  Cláusula de Prevalência, eliminatórios Res 738, elevação especial Eixo 3.b,
  contagens de perguntas atualizadas).
- Teste funcional adicional das mudanças: 25/25 (2.10 não conta risco; P2.8
  dispara eliminatória sem banco e não pontua; mensagens parametrizadas corretas;
  regressão P6.b.2 preservada).

Pendências sinalizadas (fora dos 6 passos, requerem deliberação):
- Página de Transparência: card "Questões eliminatórias — modo Res. 738" ficou
  incompleto com a inclusão de P2.8 (fundada em Lei 14.874/LGPD). Revisar narrativa
  e alinhar com a expansão do Suplemento de Salvaguardas (três/quatro gatilhos).

---
Data: 2026-08-05
Agente: Fabiano + assistente
Tarefa: Rebrand para MARIAH, unificação do disclaimer e correções de acessibilidade/LGPD

Rebrand (MARIA → MARIAH):
- Novo nome por extenso: "Matriz de Avaliação de Risco de Inteligência Artificial em
  Pesquisa com Seres Humanos". Motivo: evitar colisão com ferramenta de IA homônima do STF.
- Texto visível (nome curto e por extenso) trocado em 16 arquivos; identificadores internos
  preservados (variáveis MARIA_*, rota /maria, pasta e imports).
- Repositório GitHub renomeado para
  MARIAH-Matriz-de-Avaliacao-de-Risco-de-IA-em-Pesquisa-com-Seres-Humanos (redirect automático).
- Vercel: endereço público migrado para https://mariah-inaep.vercel.app (projeto "mariah");
  domínios antigos (maria-saude, mariah-saude, mara-…) redirecionados para o novo.

Disclaimer (fonte única):
- Reescrito na voz da MARIAH: instrumento de transparência e explicabilidade; escopo alinhado
  à Pergunta 1 (automatiza decisões / gera conteúdo / intervém); preenchimento facultativo;
  duplo público (pesquisador e CEP); ressalvas mantidas.
- Centralizado em src/components/maria/disclaimer.ts (MARIA_DISCLAIMER e MARIA_NAO_SUBSTITUI),
  eliminando a duplicação em 6 pontos. Tagline do seletor de versão também alinhada.

Acessibilidade e LGPD (pareceres de UX — revisor independente + Kimi3):
Decisão de desacoplar as correções objetivas do rebrand visual (cor/logo INAEP), que segue em
deliberação de governança. Corrigidos os achados verificados no código:
- Contraste AA: botões/badges/step de teal-600 → teal-700 (~5:1); hover → teal-800.
- Foco visível: --ring cinza (~2,5:1) → teal (~5:1), tema claro e escuro.
- aria-pressed nos toggles Sim/Não/N-A (filtro de entrada e Versões A e B).
- Skip link "Pular para o conteúdo" no layout.
- Aviso LGPD no rodapé (persistência local em localStorage, sem envio a servidor).

Arquivos tocados (a11y/LGPD): globals.css, layout.tsx, Footer.tsx, EntryFilter.tsx,
QualitativeAssessment.tsx, QuantitativeAssessment.tsx, VersionSelector.tsx, ContextForm.tsx,
StepIndicator.tsx.

Verificação: tsc sem erros novos em src/; ESLint sem apontamentos novos (remanescentes são
pré-existentes — React Compiler e use-mobile).

Follow-ups registrados:
- Fonte Rawline (GOV.BR DS) no lugar de Geist — exige hospedar a fonte.
- Contraste dos botões de resposta "de risco" (red-500 ~4:1).
- Rebrand visual INAEP (azul marinho + logo) — decisão de governança; parecer triangulado
  (revisor + Kimi3 + assistente) recomenda desacoplar de acessibilidade.
- Documentos para download em public/ (.docx/.xlsx) ainda com "MARIA" no nome e no conteúdo.
