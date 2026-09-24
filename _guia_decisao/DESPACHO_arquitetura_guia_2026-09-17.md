# DESPACHO — Arquitetura documental do Guia INAEP / MARIAH (estrutura e cross-references)

**Data:** 2026-09-17 · **De:** Kimi (arquitetura do Guia) · **Para:** Engenharia + revisor independente (Z)
**Escopo:** apenas coerência de estrutura e referência. Nada da matriz muda.
**Base auditada:** Guia_INAEP_IA_REVISADO_COM_FIGURAS-11-09-2026.docx · Caderno_Referencial_v2_draft.docx · MARIAH_Modulo_Operacional_v2_draft.docx · spec/mariah-spec.json (matrixVersion 2.1.0) · docs de /public regenerados.

---

## 1. Canonicidade — SIM, o Guia reorganizado é o Caderno 1 canônico

O Guia reorganizado (11-09-2026) passa a ser o Caderno 1, substituindo o Caderno_Referencial_v2_draft. Dois fatos internos ao próprio documento fecham a questão:

- §9.1: *"O Caderno 1 não reproduz a matriz, suas pontuações ou suas regras de cálculo, a fim de evitar duplicidade e divergência entre versões"* — o documento autoidentifica-se como Caderno 1.
- Nota Editorial: *"O conteúdo operacional da matriz foi retirado deste Guia e concentrado no módulo autônomo MARIAH. As listas de verificação, os exercícios e os instrumentos de aplicação integram o Caderno 2."*

**Migração da harmonização em vermelho:** autorizada, com duas condições:
- (a) migrar apenas os *deltas* de harmonização v2 — não recolocar o texto da matriz no Caderno 1. O draft harmonizado reproduz a matriz integralmente em seu Cap. 8 (texto idêntico ao do Caderno 2); essa duplicação morre com o draft, por força da regra antiduplicidade do §9.1.
- (b) antes de arquivar o draft, fazer inventário do conteúdo que existe *somente* nele (aprofundamentos dos Caps. 2–5, Atualização Regulatória Internacional 2024–2026, bibliografia completa, Mapa de Correspondência). O Guia novo ainda cita um "Caderno Referencial" como peça companheira (seção "Referências cruzadas entre os documentos") — é para lá que esse conteúdo referencial aponta. Não descartar sem destino.

## 2. Numeração final — CONGELADA

| Cap. | Caderno 1 (Guia reorganizado) |
|---|---|
| 7 | Governança de Dados e Proteção de Participantes |
| 8 | Especificidades por Natureza da Pesquisa |
| 9 | Integração com a MARIAH e os Instrumentos de Aplicação |

Congelada. Toda referência futura a capítulos do Caderno 1 usa esta numeração — ou, preferencialmente, a convenção por nome do item 6.

## 3. Onde a matriz mora — Caderno 2, confirmado

A matriz completa (eixos/blocos, cortes, mecanismos, instrumentos, validação) mora no Caderno 2 (Módulo Operacional). O Caderno 1, Cap. 9, apenas **integra**: aplicação (§9.1), registro da decisão ética (§9.2), supervisão longitudinal (§9.3), responsabilidades compartilhadas (§9.4) e uso de IA pelo próprio CEP (§9.5). Fonte única da matriz: spec/mariah-spec.json (2.1.0) → Caderno 2 → app. Confirmado.

## 4. Validação Local — referência POR NOME; "Seção 7" não está fechada

"Apêndice F" **não consta mais em nenhum dos três documentos** (verificado por busca exaustiva; o Guia novo usa Anexos A–C). O âncora atual no Caderno 2 é o título *"Seção 7 — Validação local da MARIAH"* (PARTE VI). Mas a numeração interna do Caderno 2 **não está normalizada**: convivem PARTE I–VI com Seções 1–7, e a PARTE I ainda carrega cabeçalhos residuais "8.1 / 8.2 / 8.2.1 / 8.2.2" herdados do antigo Cap. 8. Enquanto isso não for normalizado, qualquer referência numérica é frágil.

**Decisão:** cross-reference por nome — *"Caderno 2 — Validação local da MARIAH"*. "Seção 7" é o âncora de fato hoje, mas não está congelada.

## 5. Integridade v2 — SEM PERDA, com dois ajustes de rotulagem a fazer

Auditoria item a item, cruzando Guia novo × Caderno 2 × spec 2.1.0:

| Item v2 | Status |
|---|---|
| Recalibração 275/304; cortes 58/127/208 e 64/141/230; teto avaliável 297 (descontada P6.b.2 eliminatória) | ✔ Presente no Caderno 2 (4 ocorrências consistentes) e na spec (`thresholdsBase` 275/58/127/208; `thresholdsComBanco` 304/64/141/230) |
| Bloco 5 = 62 pts; Bloco 6 = 77 pts (139 = 50,5%) | ✔ Caderno 2 + spec (somas das questões conferem: 62 e 77) |
| Subbloco 7C (evidências, só-abate, até −23) | ✔ Caderno 2 + spec (P7.11–P7.14 = −5−5−8−5 = −23, todas negativas) |
| Três diligências do 6.b (P6.b.4.1 / P6.b.6 / P6.b.7), gate cumulativo | ✔ Caderno 2 + spec (8 ids no bloco 6.b, soma 29) |
| Descritivas C.1–C.8 | ⚠ Conteúdo presente (8 perguntas), **mas sem rótulos C.x nos instrumentos docx**; e na spec os dois primeiros ids são `contexto1`/`contexto2` em vez de `C.1`/`C.2` (C.3–C.8 ok) |
| req-IV-4 ("CEP acreditado ou habilitado em IA") | ✔ Caderno 2 (tabela de requisitos do Nível IV e texto) + spec (`req-IV-4`, texto idêntico) |
| P6.b.4 (enquadramento fundamentado de dispensa de TCLE segundo a origem do banco) | ✔ Caderno 2 **e** substância carregada no Guia novo (Cap. 7.2: dispensa deve indicar hipótese normativa e justificativa, *"sem ser presumida apenas em razão da origem do banco"*) |

**Sobre o Guia novo:** a reorganização não "perdeu" parâmetros da matriz porque, por desenho (§9.1), ele não carrega nenhum — a ausência é a decisão de arquitetura, não omissão. Os itens de natureza normativa (P6.b.4) foram carregados; os operacionais (cortes, blocos, req-IV-4) vivem no Caderno 2 e estão íntegros.

**Dois ajustes para a Engenharia no passe único (rotulagem, não matriz):**
- (a) spec: renomear `contexto1`/`contexto2` → `C.1`/`C.2` (e refletir no app se os ids são exibidos);
- (b) Caderno 2: rotular as oito descritivas como C.1–C.8 nos instrumentos (Versões A e B), para que cross-refs a "C.1–C.8" tenham âncora.

## 6. Convenção de cross-reference — POR NOME, padronizado

Aceito e decido: **todas as referências entre cadernos e docs por nome**, até oficialização da numeração. Padrão:

- *"o Guia (Caderno 1)"*, *"Caderno 2 — Validação local da MARIAH"*, *"Caderno 2 — Instruções de Uso da MARIAH"*, *"o Guia — Integração com a MARIAH"*.
- Proibido citar "Capítulo 8 do Caderno 1" ou "Apêndice X" em qualquer peça nova ou revisada.

O próprio Guia novo já adota essa convenção (seção "Referências cruzadas entre os documentos" refere-se por módulo, sem números), e os docs de /public já foram verificados como limpos (nenhuma referência numérica de capítulo/apêndice/seção).

## Correção de escopo para a Engenharia (importante)

O levantamento mencionava **4** referências "Capítulo 8 do Caderno 1" no Caderno 2. O número real é **11 ocorrências de "Capítulo 8"**:
- 5 na forma "Caderno 1, Capítulo 8" (regra crítica ×3, Passo 0 casos-limite ×1, regra crítica Versão A ×1);
- 4 na forma "Capítulo 8 do Caderno 1" (Seção de validação ×3, software MARIAH ×1);
- 2 autorreferências ("O Capítulo 8 pode ser consultado…", "Quadro 8.1 — Guia de leitura do Capítulo 8");
- mais os cabeçalhos residuais 8.1/8.2/8.2.1/8.2.2 da PARTE I e o "Quadro 8.1".

O passe único deve cobrir as 11 + cabeçalhos, não 4. No Caderno 1 draft há ainda ~13 menções ao próprio Cap. 8 — elas morrem com o draft na migração do item 1; não harmonizar por cima delas.

---

**Em resumo:** 1) Sim, canônico — migrar só os deltas. 2) Cap. 9, congelado. 3) Matriz no Caderno 2, confirmado. 4) Por nome; "Seção 7" não fechada. 5) Íntegro — dois ajustes de rótulo (C.1/C.2 na spec; C.1–C.8 nos instrumentos). 6) Por nome, padronizado. Liberado o passe único de cross-references; Z audita a exatidão numérica (tabela do item 5 como gabarito).
