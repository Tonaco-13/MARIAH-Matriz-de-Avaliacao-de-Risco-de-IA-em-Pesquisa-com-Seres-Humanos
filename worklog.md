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

---
Data: 2026-08-07
Agente: Fabiano + assistente
Tarefa: Documentos MARIAH, renome do Guia e Ticket 11 (identidade gov.br: paleta + barra + logo Inaep)

Documentos para download (public/):
- Corrigidos os 6 arquivos (.docx/.xlsx) de MARIA para MARIAH e para o nome por extenso novo
  ("Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos"),
  por substituição direta no XML (corpo, cabeçalhos e metadados), preservando formatação.
  Nomes de arquivo mantidos (referenciados pelo app).

Renome do Guia-pai:
- "Guia de Diretrizes Éticas para Pesquisa com IA" -> "Guia de Uso Ético da Inteligência
  Artificial em Pesquisa com Seres Humanos", em 5 arquivos de código (validacao, transparencia,
  instrucoes, Results, utils) e no anexo guia-validacao-local (cabeçalho + metadados).
  Título próprio do Apêndice F ("Guia de Validação Local") preservado.

Ticket 11 — identidade institucional gov.br:
- Parte 1 (paleta): override dos 9 tokens --color-teal-* em globals.css para azul marinho
  gov.br #0C2C56 (tom único; hover #0a2347); 4 hex #0f766e do PDF (utils.ts) e favicon
  (public/logo.svg) migrados. Família slate-* (Versão B) inalterada.
- Parte 2 (barra gov.br): os 10 headers passaram de gradiente navy + texto branco para
  bg-white + texto azul marinho (text-teal-700), sem linha divisória; ícones em bg-teal-50;
  badges "Versão preliminar"/"em revisão" em âmbar claro; botão "Voltar" recolorido.
- Parte 3 (logo Inaep): logo P&B (Instância Nacional de Ética em Pesquisa) no canto direito
  de todos os headers (flex justify-between), alt acessível. Fonte: LOGO_PRETO_BRANCO_INAEP.
  Gerada public/inaep-logo-sm.png (recortada a moldura branca, ~740x220). Máster de alta
  resolução mantida fora do repo.
- Refinamento: logo recortada (sem moldura) e ampliada; ajuste de tamanho/posição na home;
  padronização por tier — hero (home + 3 páginas) h-14 sm:h-16 + mt-2 -mr-2; compactos
  (6 telas) h-11 sm:h-12 + mt-1 -mr-2.

Verificação: tsc sem erro novo em src/; ESLint só com apontamentos pré-existentes
(React Compiler e use-mobile). Build/validação visual no preview do Vercel; produção em
https://mariah-inaep.vercel.app.

Follow-ups:
- Logo máster (public/inaep-logo.png, ~2 MB) não usada pelo app — manter fora do repo.
- Fonte Rawline (GOV.BR DS) no lugar de Geist — pendente (exige hospedar a fonte).
- Contraste dos botões de resposta "de risco" (red-500 ~4:1) — candidato a ajuste.
- Alinhar a cor interna dos documentos .docx/.xlsx ao azul marinho (hoje ainda teal).

---
Data: 2026-08-16
Agente: Fabiano + assistente (conta MS)
Tarefa: Fase 2 (spec v2.0-draft), widgets do ContextForm, correção F-23 (Kimi) e #20 (M3 + carimbo de versão)

Fase 2 — spec v2.0-draft (commit 8c237ea; PR mergeada):
- Gerador reprodutível scripts/build-spec-v2.ts: lê spec v1 (baseline) + spec/fichas/
  fichas-alteracao-mariah-v2.json (fichas v0.3 do Kimi, copiadas para o repo) e aplica
  20 das 23 fichas — 6 descritivas (contexto C.3–C.8), 7 risco (Eixo 2 +2, Eixo 3 +5 /
  Blocos 5 e 6), 4 evidências 7C (só-abate, pontos negativos), 3 diligências (Eixo 3.b /
  Bloco 6.b, não pontuam). F-19/F-20/F-21 (texto) ficaram para harmonização.
- Recalibração cenário A: teto base 275 (cortes 58/127/208), com banco 304 (64/141/230),
  avaliável 297, fatia ética (Blocos 5+6) = 50,5%. Cortes calculados pelas frações fixas do
  baseline 238, arredondamento meia-unidade p/ cima.
- verify-math atualizado para os números v2; fronteiras de nível reescritas; Seção 12
  (efeitos v2 na matriz real). Números conferidos 1:1 com a memória Rev.2 do Kimi.

Widgets do ContextForm (commit 00780d9; branch feat/context-widgets):
- Descritivas C.3–C.8 renderizadas por tipoEntrada: seleção (C.3, C.5), número (C.4),
  radio acessível (C.6–C.8; fieldset/legend, accent teal, anel de foco).
- Condicional: C.5 só aparece se C.3 != 'anonimizados'; ao ocultar, a resposta é limpa
  (não vaza no export). Regra centralizada em utils.isContextQuestionVisible (fonte única),
  reutilizada na auditoria (getUnansweredItems cobre as descritivas visíveis). Badge C1..C8.

Correção F-23 — N/A das diligências (commit 7452e63):
- Kimi apontou que a ficha da F-23 não prevê "não se aplica". O gerador forçava
  hasNaOption:true nas três diligências; passou a LER hasNaOption da ficha (fonte única) —
  como nenhuma das três prevê, o N/A saiu de 3.b.4.1/P6.b.4.1, 3.b.7/P6.b.6 e 3.b.6/P6.b.7.
- Spec regenerada da baseline v1 (git show 8c237ea~1) para manter reprodutibilidade.

#20 — M3 + carimbo de versão + localStorage (commit 79276b6):
- M3 corrigido: no export JSON de validação, "não avaliável" sai como 'NÃO AVALIÁVEL'
  (antes virava 'IV', mascarando a devolução), Versões A e B. Versão B ganhou o campo
  protocoloNaoAvaliavel (simetria com A). schemaVersion do export subiu para 2.
- Carimbo da versão da matriz (MATRIX_VERSION) no JSON (software.versaoMatriz), no cabeçalho
  do TXT e do PDF.
- Chave do localStorage versionada ('maria-assessment-state-v2'): estado da v1 NÃO é migrado
  (matriz incompatível) e chaves obsoletas são limpas no primeiro load.
- Teste novo no verify-math (Seção 13) travando o M3 e o carimbo.

Verificação: npm run verify 76/76; npm run build compila (Turbopack "Skipping validation of
types" — type-check completo via tsc mostra só erros pré-existentes de scaffold Z AI em
examples/, skills/, src/lib/db.ts, e o padrão .find() do próprio verify-math; nada no app).
Branches publicadas: feat/context-widgets e feat/mariah-v2-fixes (esta contém widgets+F-23+#20).

Recebido do Kimi: guia v46 DRAFT (INAEP_GUIA_IA_PESQUISA_V46_DRAFT_15_08_26.docx), verificação
estrutural 84/84 e OOXML limpa. Confirmou a modelagem das diligências como "devolução /
não avaliável" (3.b.4.1, 3.b.7, 3.b.6). URL canônico do repositório repassado para o ¶1752:
github.com/Tonaco-13/MARIAH-Matriz-de-Avaliacao-de-Risco-de-IA-em-Pesquisa-com-Seres-Humanos.

Follow-ups / pendências:
- Abrir as PRs (feat/context-widgets e feat/mariah-v2-fixes) e mergear em ordem.
- Responder ao Kimi: aceite dos pontos + URL canônico + QUESTÃO EM ABERTO: aplicabilidade das
  diligências F-17/F-18 sem N/A pode sobre-bloquear protocolos de banco que não reivindicam
  dispensa de TCLE / não usam identificáveis — decidir se entra display-conditional na
  ficha/guia (como a C.5) ou N/A. Ao sinalizar feature-complete, dispara a camada 2 do gate
  (planilha 27 vetores + V17/V18/V19) e a auditoria final do Z Code. Meta 14/09.
- Harmonização de texto: F-19/F-20/F-21 e as dicas 7C (alterar-dica) — replicar a redação
  final da v46 literal em data.ts; adotar "pesquisador habilitado" e "transportabilidade".
- #21: gate de paridade app × planilha + CHANGELOG com id-map (old→new) + publicação
  coordenada guia v46 + app v2.0.

---
Data: 2026-08-20/21
Agente: Fabiano + assistente (conta MS)
Tarefa: Feature-complete v2, gate tripartite, incidente B1 (rollback) e correções B2/M1

Feature-complete (branch feat/mariah-v2-fixes):
- Widgets ContextForm (C.3–C.8) + C.5 condicional; M3 (não avaliável ≠ IV) + carimbo de
  versão + chave localStorage v2; harmonização de texto (MI6/F-19/20/21/7C); condicionais
  de exibição F-17/F-18 + F-18a (N/A em P6.b.4). verify-math 98/98.
- Exibição condicional: perguntas de matriz ganham exibicaoCondicional (avaliador
  determinístico); ocultas não pontuam, não elivam devolução, não viram pendência; telas
  limpam a resposta ao ocultar. (commit 3502da1)

Gate tripartite:
- Camada 2 (planilha do Kimi) cruzada pelas funções reais do app: scripts/extract-gate-vectors.py
  + scripts/gate-run.ts → 31 vetores B + 33 linhas V17 = 64/64, Δ=0 (commit 6b7b973).
- CHANGELOG v2.0 com mapa de ids V18 (old→new), compatibilidade (commit ad51ae7).
- Feature-complete sinalizado ao Kimi → camada 2 preenchida → Z Code acionado (Fase B).

Auditoria Z Code (Fase B) — 2 bloqueantes:
- B1: produção (main) estava com v2 PARCIAL desde ~16/08 (PRs #21–#23 mescladas), sem
  harmonização nem condicionais → diligências exibidas incondicionalmente (sobre-bloqueio),
  fora do publish coordenado. Erro de engenharia: informação de "não mesclado" repassada sem
  verificar origin/main. Decisão do GT: ROLLBACK. Produção revertida à v1.0.0-guia-v45 (commit
  84496ba no main, revert não destrutivo; árvore de 12963a0). Z Code confirmou por sonda.
- B2: 17→ (checagem automatizada: 22) divergências de enunciado spec × guia. Corrigido por
  OVERLAY VERBATIM dos quadros do guia v46: scripts/extract-enunciados-guia.py →
  gate/enunciados-guia-v46.json; gerador aplica pergunta=guia[id]. Inclui alinhamento
  substantivo de 3.b.4/P6.b.4 (hipótese cabível segundo a origem do banco; art.20 §5º /
  art.25) — na pergunta, dica e req-738-III-1. (commit 03d31dc)
- M1: parity-check.ts (spec × guia, 128 enunciados) na CI (workflow "gates" = verify+parity+
  gate). Fichas 0.3→0.4 (m1). DOCX do guia fora do repo (.gitignore); JSON versionado.

Re-auditoria do delta (Z Code, 21/08): B1/B2/M1 RESOLVIDOS E VERIFICADOS; paridade independente
128/128 (direto do DOCX). Branch APTO para o publish coordenado de 14/09, sem bloqueantes.
Gates: verify 98/98 · parity 0 · gate 64/64 Δ=0 · build ok.

Pendências até o publish (14/09):
- m4: aviso de que avaliações v1 em andamento não são migradas (banner de 1ª visita ou nota
  em /transparencia). m6: esmaecer/substituir o cabeçalho de nível quando "não avaliável".
- m8 (novo): requirements são paráfrase deliberada — registrado no CHANGELOG (opção de incluir
  na parity com mapa de equivalência, se o GT quiser paridade literal também nos requisitos).
- m2/m3 (no dia): spec versão final 2.0.0 + tag v2.0.0; package.json/badge público.
- Publicação coordenada guia v46 + app v2.0 (merge do branch no main + deploy) após termo
  final do Z Code no PR de publish. Regenerar gate/enunciados-guia-v46.json se o DOCX mudar (F9).
- Guia (Kimi): F9/índice + confirmação formal do alinhamento 3.b.4 (trivial — o guia não mudou).
