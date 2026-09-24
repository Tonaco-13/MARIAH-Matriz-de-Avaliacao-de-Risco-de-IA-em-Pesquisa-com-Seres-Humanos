# RESPOSTA À ENGENHARIA — Avaliação estática do mapa de substituições (Passe Único)

**Data:** 2026-09-17 · **De:** Kimi (arquitetura do Guia) · **Re:** Plano de execução dos Passes A–D e mapa de substituição por nome
**Método:** verificação estática das âncoras contra os textos extraídos dos três docx, spec/mariah-spec.json (2.1.0) e código do app (src/components/maria, scripts, gate).

## Veredito geral: DIRECIONAMENTO APROVADO

A regra "apontar para onde o conteúdo mora hoje" está correta. Verificado:

- "A regra crítica" (Versão A) e "A regra crítica na Versão B" existem como itens no Caderno 2; o Guia novo não contém o mecanismo (apenas cita a origem canadense do conceito na tabela de referências internacionais).
- Passo 0 existe apenas no Caderno 2 (Seção 1), e discute de fato a fronteira rotineiro/não-rotineiro (organização bibliográfica, transcrição, revisão gramatical etc.) — âncora válida para os casos-limite.
- Modo triagem (Versão A como filtro, Versão B nos Níveis III/IV) está descrito duas vezes no Caderno 2; não consta no Guia novo.
- O posicionamento da MARIAH como apoio à deliberação ("A MARIAH não aprova nem reprova pesquisas"; "a decisão ética permanece humana, colegiada e fundamentada") consta do Guia novo (Apresentação e Nota Editorial).

## Correções de âncora (obrigatórias antes de aplicar o Passe A)

1. **Ref 9 — NÃO apontar para o Guia.** A afirmação "os pontos de corte são calibrações teóricas que merecem teste empírico" não existe no Guia novo (ele não trata de cortes). A afirmação mora no próprio Caderno 2, na descrição da Versão B ("As faixas deverão ser testadas empiricamente… Ajustes são possíveis antes da publicação final."). Substituir por: *"conforme reconhecido na descrição da Versão B deste Caderno 2"* — ou remover a oração de atribuição.
2. **Ref 11 — NÃO usar "descrito neste Caderno 2".** O software MARIAH não é descrito em peça nenhuma (Guia novo: zero ocorrências; draft antigo: zero ocorrências); a referência original já era pendente. Redação correta, auto-suficiente e por nome: *"O software MARIAH, disponibilizado como Software Público Brasileiro, oferece uma camada operacional complementar…"* (sem "descrito em…").

## Refinamentos

3. **Refs 3/4/6/7 — precisão de item:** contexto de Versão B (Bloco 6.b, duas ocorrências) → *"A regra crítica na Versão B"*; contexto de Versão A (3.b.x) → *"A regra crítica"*. A ref 3 (cobre ambas) pode permanecer genérica.
4. **Ref 2 (Quadro):** se houver outros quadros no Caderno 2, manter esquema numérico ("Quadro 1 — Guia de leitura desta Parte"); se for o único, a forma sem número está correta.
5. **Descritivas C.1–C.8:** além dos instrumentos (Versões A e B), rotular também a enumeração em prosa do Passo 1 ("A primeira…" → "(C.1)" … "A oitava…" → "(C.8)"). Registrar que as instruções de /public já exibem C.1–C.8 — a rotulagem faz o Caderno 2 convergir com /public.

## Passe B (spec: contexto1/2 → C.1/C.2) — branch à parte APROVADO, com duas condições para o Z

Ripple confirmado no repositório: `src/components/maria/Results.tsx` (2 usos), `utils.ts` (export HTML, export TXT e rotina de auditoria), `ContextForm.tsx` (badge), `data.ts`, `scripts/gen-instrucoes-preenchimento.py`, `scripts/extract-gate-vectors.py`, `gate/vetores-b.json`, `spec/fichas/fichas-alteracao-mariah-v2.json`.

- (a) **Compatibilidade retroativa:** se houver respostas de contexto persistidas em produção chaveadas por id (`contextAnswers['contexto1']`), o rename quebra dados existentes. Nesse caso, preferir rótulo de exibição (o app já mapeia `contexto1→C1` no badge) em vez de renomear o id. Se não houver persistência em produção, rename completo.
- (b) **Prova de paridade:** após o rename, regenerar as instruções de /public e exigir diff byte-idêntico contra a versão atual (que já exibe C.1/C.2); regenerar `gate/vetores-b.json`. Bump: matrixVersion 2.1.0 → 2.1.1 (contrato de dados, sem mudança de conteúdo da matriz).

## Passes C e D — confirmados

- **C (/public):** verificação independente confirma 0 referências numéricas de capítulo/apêndice/seção e instruções já com C.1–C.8. PR pausado pode retomar sem dependência.
- **D (Caderno 1):** inventário do conteúdo exclusivo do draft harmonizado (aprofundamentos Caps. 2–5, Atualização Regulatória Internacional 2024–2026, bibliografia, Mapa de Correspondência) ANTES de arquivar; destino = peça "Caderno Referencial" companheira, que o Guia novo já cita em "Referências cruzadas entre os documentos".

## Autorização

Passe A autorizado com as correções das refs 9 e 11 e os refinamentos 3–5. Apresentar as páginas afetadas após a aplicação. Passe B aguarda branch + gates + auditoria do Z.
