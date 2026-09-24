# AVAL EDITORIAL — Passe A no Caderno 2 (cross-references e rótulos C.1–C.8)

**Data:** 2026-09-17 · **De:** Kimi (arquitetura do Guia) · **Sobre:** MARIAH_Modulo_Operacional_v2_draft.docx pós-Passe A (cópia conferida: `Documents/GT Revisão/`, 17-09 14:39)
**Veredito: APTO COM 2 RESSALVAS** — correções pontuais de resíduo, sem tocar matriz. Nenhuma delas invalida a auditoria numérica do Z.

## (a) Convenção por nome — CORRETA nas 11 + 3 refs

Conferidas uma a uma contra o mapa autorizado:

- Refs 1–2: "Esta Parte pode ser consultada…" ✔ (ver ressalva 1 sobre o número do quadro)
- Refs 3/4 (regra crítica, Versão A): → item "A regra crítica" deste Caderno 2 ✔
- Refs 6/7 (Bloco 6.b): → item "A regra crítica na Versão B" deste Caderno 2 ✔ (precisão de item aplicada corretamente)
- Ref 5 (Passo 0): → "no Passo 0 deste Caderno 2" ✔
- Ref 8 (posicionamento): → "O Guia (Caderno 1) é explícito…" ✔
- Ref 9 (cortes teóricos): → "conforme reconhecido na descrição da Versão B deste Caderno 2" ✔ (correção aplicada como determinado — não aponta o Guia)
- Ref 10 (modo triagem): → "previsto neste Caderno 2" ✔
- Ref 11 (software): → "O software MARIAH, disponibilizado como Software Público Brasileiro, oferece…" ✔ (sem "descrito em…", auto-suficiente)
- Ajuste Z §5: "conceitos apresentados no Guia (Caderno 1)" ✔
- Ajuste Z /public (guia-validação): "que o Guia trata ao abordar a formação dos comitês" ✔ conferido no docx regenerado; a ocorrência "Capítulos 7 e 9" na ficha bibliográfica é citação de publicação externa e permanece correta.
- "Capítulo 8" e "Apêndice": zero ocorrências ✔ (as menções a "Capítulo VII/VIII" são da Resolução CNS 738/2024 — texto normativo, correto manter)

## (b) Direcionamento dos alvos — TODOS CORRETOS

Nenhum alvo precisa apontar a outro lugar. "Software MARIAH" e "modo triagem" estão corretos como autorreferência ao Caderno 2 e menção auto-suficiente, respectivamente.

## (c) Rotulagem C.1–C.8 — CORRETA, com uma precisão de escopo

- Prosa do Passo 1 ("A primeira (C.1)… A oitava (C.8)") ✔ e instrumento da Versão B (C.1 — … C.8 —) ✔, conteúdo e ordem fiéis à spec.
- **Precisão:** o instrumento da Versão A (PARTE III) não contém o bloco das descritivas — nunca conteve; ele opera sobre o Passo 0/Passo 1 compartilhados da Seção 1. A rotulagem cobriu tudo o que existe. Sugestão opcional (não bloqueia): incluir na abertura da PARTE III uma linha-ponteiro — *"Antes dos eixos, respondem-se as oito perguntas descritivas C.1–C.8 (Passo 1, Seção 1), obrigatórias também nesta versão."*

## Integridade da matriz — CONFIRMADA independentemente

Diff das linhas-chave (cortes, tetos, blocos, 6.b, níveis) entre pré e pós-Passe A: **byte-idênticas**, exceto as duas referências intencionais (regra crítica do Bloco 6.b e modo triagem). Nenhum número, peso, faixa ou mecanismo tocado — corrobora o APTO do Z.

## RESSALVA 1 — Numeração dos quadros da PARTE I (resíduo)

O esquema interno do documento é `<Parte>.<n>` (Quadro 2.1–2.3, 5.1, 6.1), mas a PARTE I ainda carrega o prefixo legado "8.":
- "Quadro 8.1 — Guia de leitura desta Parte" (título) e o pointer "O Quadro 8.1 organiza as seções…" (texto) → **Quadro 1.1**
- "Quadro 8.2 — Estrutura comparativa das duas versões da MARIAH" → **Quadro 1.2**
- "Quadro 8.3 — Fontes internacionais por eixo/bloco da MARIAH" → **Quadro 1.3**

(O relatório do Passe A cobriu o sufixo do 8.1, mas o número ficou; 8.2 e 8.3 não entraram no mapa.)

## RESSALVA 2 — Quadro 2.3: ponteiros por número para o Caderno 1

As quatro linhas "Capítulo 3 / Capítulo 7 / Capítulo 4 / Capítulo 6" são cross-references entre cadernos e violam a convenção por nome (além de não dizerem a qual documento se referem). Os números hoje coincidem com a estrutura congelada do Guia novo, mas a convenção vale até a oficialização. Substituir por:

- viés/explicabilidade/supervisão/ciclo de vida → **o Guia (Caderno 1) — Dimensões críticas de risco**
- proteção de dados dos participantes → **o Guia (Caderno 1) — Governança de dados e proteção de participantes**
- bases normativas brasileiras → **o Guia (Caderno 1) — Contexto brasileiro e interesse público**
- roteiro de perguntas éticas → **o Guia (Caderno 1) — Integridade científica, autoria e uso de IA na produção da pesquisa**

(A linha "Caderno 2, Seção 6" é autorreferência interna; aceitável, mas preferir "Seção 6 deste Caderno" por simetria.)

## Encaminhamento

Aplicadas as duas ressalvas (estimativa: minutos, sem impacto em gates), o Passe A está **ENCERRADO**. Próximo: Passe B (spec) em branch próprio, com as duas condições já registradas para o Z (compatibilidade retroativa dos ids; paridade byte-idêntica das instruções regeneradas + vetores de gate; bump 2.1.0 → 2.1.1).
