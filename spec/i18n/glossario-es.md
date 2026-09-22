# Glossário MARIAH — pt-BR → es (vista humana)

**Versão:** 0.2.0 · **Data:** 2026-09-20 · **Autor da proposta:** Kimi (arquitetura) · **Revisor:** Z (auditor, z.ai)
**Gêmeo máquina-legível:** `spec/i18n/glossario-es.json` (este .md é a vista curada; o .json é o que o CI e a auditoria consomem — o par é o formato, A1 do parecer do Z)
**Estado:** ✅ **aprovado-z — 64/64 entradas** (19 com ajuste do Z + 6 entradas novas; ver changelog 0.2.0 e `RESPOSTA_Z_glossario-es_2026-09-20.md`). Pré-condição da branch `feat/i18n-es` satisfeita.

## Regras do artefato

1. `consequenciaOperacional` fica **sempre em pt-BR**, em todos os glossários — é o gabarito invariante de auditoria; traduzi-lo seria traduzir o critério junto.
2. Termo muda só por nova entrada versionada (changelog ao final).
3. Checagem automática (camada 1 do protocolo A2): todo termo deve ocorrer nas mensagens `es` com contagem por namespace coerente com a contagem do termo pt-BR nos mesmos namespaces.
4. `status: aprovado-z` é exigido por entrada antes da branch do idioma.

## Tabela de preservação de modalidade (es)

| pt-BR | es |
|---|---|
| deve | debe |
| pode | puede |
| vedado | prohibido |
| obrigatório | obligatorio |
| facultativo | facultativo |

Confundir `requisito` com `recomendación`, ou amolecer `vedado` para "no recomendado", é **B3** (reprova).

---

## 1. Identidade e escopo do instrumento

| pt-BR | es aprovado | Nota |
|---|---|---|
| MARIAH | MARIAH | Nome próprio; não se traduz |
| Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos | Matriz de Evaluación de Riesgo de Inteligencia Artificial en Investigación con Seres Humanos | "Avaliação de Risco" no singular, como a fonte |
| tríade de escopo (automatizar decisões / gerar conteúdo / intervir na condução) ✚ | sistemas que automatizan decisiones, generan contenido o intervienen en la conducción del estudio | ✚ Entrada nova (Z): âncora de escopo; parafrasear um dos três verbos mudando o alcance = **B3** |
| matriz de risco | matriz de riesgo | Quando se refere ao instrumento nomeado, preferir "MARIAH" |
| Versão A / Versão B | Versión A / Versión B | A = triagem, B = aprofundamento; relação é normativa |
| triagem | triaje | Versão A como filtro; III/IV seguem para a Versão B |
| Versão preliminar | Versión preliminar | Nunca suavizar ("versión actualizada" ✗) |

## 2. Instâncias e regulação brasileira (nomes não se adaptam; explicação vai ao Anexo Normativo)

| pt-BR | es aprovado | Nota |
|---|---|---|
| CEP (Comitê de Ética em Pesquisa) | CEP (Comité de Ética en Pesquisa) | ✏ Z: rejeitada "CEI" no corpo — naturalizaria a instância brasileira (req-IV-4: "CEP acreditado" = sistema CEP/CONEP). "CEI" só no Anexo Normativo, como equivalência aproximada |
| CONEP | CONEP | ✏ Z: expansão em pt-BR ("Comissão Nacional de Ética em Pesquisa (CONEP, Brasil)") — nome de entidade; jamais trocar por entidade do país do leitor (**B8**) |
| TCLE (Termo de Consentimento Livre e Esclarecido) | TCLE (Término de Consentimiento Libre y Esclarecido) | ✏ Z: calque mantido (precedente das traduções es das normas brasileiras); sigla TCLE sempre na 1.ª ocorrência por tela/export; "consentimiento informado" não substitui (só Anexo) |
| LGPD | LGPD | ✏ Z: expansão qualificada — "Ley General de Protección de Datos Personales de Brasil"; nunca RGPD/GDPR; sem "de Brasil" é **B8-adjacente** |
| Ministério da Saúde ✚ | Ministerio de Salud de Brasil | ✚ Entrada nova (Z): "de Brasil" obrigatório em es (senão remete ao ministério do leitor — **B8**) |
| Res. CNS n.º 466/2012 · 510/2016 · 738/2024 | idem | Numeração e sigla inalteradas; textos legais não se traduzem |
| ANVISA | ANVISA | Forma expandida só no Anexo |
| SaMD (Software as a Medical Device) | SaMD (Software as a Medical Device) | ✏ Z: a spec (P7.1) usa a expansão em **inglês**; mantida nos dois idiomas; glosa es só como parêntese na dica |
| Controlador | Controlador | NÃO usar "responsable del tratamiento" (GDPR) nem "encargado del tratamiento" (GDPR, operador) — **B8** |
| Encarregado de Dados | Encargado de Datos | ✏ Z: colide com "encargado del tratamiento" (GDPR = operador); Anexo deve mapear os papéis LGPD × GDPR |

## 3. Níveis de risco e requisitos

| pt-BR | es aprovado | Nota |
|---|---|---|
| nível de risco (I–IV) | nivel de riesgo (I–IV) | Uma só palavra no idioma inteiro; "etapa/fase" = **B3** |
| Baixo (Nível I) | Bajo (Nivel I) | Requisitos mínimos de documentação |
| Moderado (Nível II) | Moderado (Nivel II) | Descrição do sistema + LGPD |
| Alto (Nível III) | Alto (Nivel III) | Validação técnica + supervisão humana efetiva |
| Crítico (Nível IV) | Crítico (Nivel IV) | Parecer externo + monitoramento + ANVISA quando aplicável |
| requisito / recomendação | requisito / recomendación | Distinção modal normativa (**B3** se confundida) |
| parecer técnico externo | dictamen técnico externo | "Dictamen" consagrado em comités de ética; preservar a independência |
| supervisão humana efetiva | supervisión humana efectiva | Exige comprovação, não declaração (req-III-3) |
| human-in-the-loop | human-in-the-loop | Inglês mantido, espelhando o próprio pt-BR |
| dados de treinamento | datos de entrenamiento | Distinto de "datos del estudio" |
| Recomendação de Aprofundamento ✚ | Recomendación de profundización | ✚ Entrada nova (Z): gatilho textual da relação A→B (Results.tsx:368); classe facultativa |
| Consolidação ✚ | Consolidación | ✚ Entrada nova (Z): nível final = o MAIS ALTO entre os eixos (Results.tsx:469); suavizar para "média" = **B3** |

## 4. Consentimento, dados e Res. 738/2024

| pt-BR | es aprovado | Nota |
|---|---|---|
| dispensa de TCLE | dispensa del TCLE | Nunca presumida pela origem do banco; "exención automática" ✗ |
| re-consentimento | reconsentimiento | Uma forma só em todo o idioma (camada 1 do A2) |
| banco de dados | banco de datos | Termo-gatilho do filtro (275→304; cortes 58/127/208→64/141/230) |
| anonimização | anonimización | Única via de dispensa p/ banco não-investigativo; ≠ seudonimización |
| dados anonimizados / identificáveis / identificação | datos anonimizados / identificables / identificación | Escala de C.3, coerente e exclusiva |
| cadeia de custódia | cadena de custodia | Ausência dispara diligência obrigatória (req-738-IV-1) |
| Termo de Anuência Institucional | Término de Anuencia Institucional | Art. 27, VI; sua ausência aciona a Salvaguarda (P6.b.2); 1.ª ocorrência com o artigo junto |
| Termo de Compromisso de Uso de Dados | Término de Compromiso de Uso de Datos | Arts. 24, V e 27, V; dos pesquisadores (≠ Anuência, do dirigente) |
| Termo de Acordo Institucional | Término de Acuerdo Institucional | ✏ Z: citação completada — Art. 3.º, XVI e §2.º **do Art. 12** (req-738-III-2) |
| pessoa participante | persona participante | Terminologia da 466/2012; não "sujeto" nem "paciente" |

## 5. Salvaguardas e eliminatórias (strings de maior risco — camada 3 do A2)

| pt-BR | es aprovado | Nota |
|---|---|---|
| salvaguardas | salvaguardas | Termo-âncora do instrumento |
| Salvaguarda de Inavaliabilidade | Salvaguarda de Inevaluabilidad | ✏ Z: neologismo aceito (espelha o pt-BR, âncora unívoca); glosa na 1.ª ocorrência: "(protocolo no evaluable por la MARIAH)"; classe modal → null |
| Salvaguarda da Res. 738 ✚ | Salvaguarda de la Res. 738 | ✚ Entrada nova (Z): Eixo 3.b — uma única resposta de risco leva ao Nível III |
| Salvaguarda Decisória ✚ | Salvaguarda Decisoria | ✚ Entrada nova (Z): mecanismo das P4.1/P4.2; cadeia única com a Cláusula |
| não avaliável pela MARIAH | no evaluable por la MARIAH | ✏ Z: variantes cobrem Results.tsx ("no evaluable en el mérito"); NÃO é reprovação; "reprobado/desaprobado" ✗ |
| eliminatória | eliminatoria | ✏ Z: consequência corrigida — o peso conta no teto teórico (304), mas a classificação suspende (teto avaliável 297, notasDominio) |
| Hipótese eliminatória acionada | Hipótesis eliminatoria activada | Acompanha o id da questão |
| Classificação suspensa | Clasificación suspendida | Suspensão sanável, não julgamento negativo |
| Cláusula de Prevalência Ética | **Cláusula de Primacía Ética** | ✏ Z (correção B): consequência reescrita — é a Salvaguarda Decisória (P4.1/P4.2 força Nível IV, sobrescrevendo a soma), NÃO a não-substituição do CEP; "prevalencia" tem leitura epidemiológica em es → "primacía" |
| diligência | diligencia | 3 diligências do 6.b cumulativas p/ Nível IV; cadeia única; ✏ Z: "diligenciamiento" proibido para preenchimento (= "cumplimentación") |

## 6. Estrutura da matriz

| pt-BR | es aprovado | Nota |
|---|---|---|
| eixo / bloco | eje / bloque | Numeração e letras (3.b, 6.b) inalteradas |
| descritivas (C.1–C.8) | descriptivas (C.1–C.8) | Não pontuam; ids invariantes (**B7**) |
| mitigação | mitigación | Bloco 7 |
| evidências (subbloco 7C) | evidencias (subbloque 7C) | Só-abate, até −23; nunca somam |
| pontos de corte | puntos de corte | Números inalterados (**B1**); calibrações teóricas |
| enquadramento | encuadre | Não é "aprobación" |
| Não se aplica | No se aplica | ✏ Z: forma reflexiva padrão; valor da resposta persiste por id (**B7**) |
| explicabilidade | explicabilidad | Eixo 5 + identidade do instrumento |
| viés | sesgo | Termo consagrado em es científico |
| protocolo (de pesquisa) | protocolo (de investigación) | Carrega a não-substituição |
| pesquisador | investigador | Equivalente funcional em es científico |

## 7. Strings-âncora (entradas plenas, A1)

**MARIA_DISCLAIMER** — ✅ es aprovada pelo Z (4 ajustes: `cumplimentación` · `CEP` ×2 · `exime de` · `Ministerio de Salud de Brasil`):
> La MARIAH vuelve transparente y explicable la evaluación ética de investigaciones de intervención en seres humanos que utilizan inteligencia artificial. Se aplica a los sistemas que automatizan decisiones, generan contenido o intervienen en la conducción del estudio. Su cumplimentación es facultativa y sirve tanto al investigador, en la preparación y autoevaluación del protocolo, como al CEP, en el análisis. No aprueba ni reprueba protocolos, no sustituye el juicio del CEP ni exime de la deliberación colegiada. Versión preliminar: aún no sometida a validación empírica en casuística real y a la espera de validación institucional por parte del Ministerio de Salud de Brasil.

**MARIA_NAO_SUBSTITUI** — ✅ es aprovada pelo Z:
> La MARIAH no aprueba ni reprueba protocolos, no sustituye el juicio del CEP ni exime de la deliberación colegiada.

**Cláusula de cortesia** — ✅ aprovada pelo Z (A3, redação definitiva):
> Esta es una traducción de cortesía. La versión normativa vigente es la versión en portugués (pt-BR).

Âncoras das três: mesmos pontos de `MARIA_DISCLAIMER` (Resultados, seletor de versão, print/PDF, export TXT). Qualquer adição/omissão de ressalva = **B5**; cláusula ausente ou deslocada = **B4**.

---

## Changelog

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 0.1.0-proposta | 2026-09-20 | Kimi (arquitetura) | Esqueleto inicial: 58 entradas (57 propostas + 1 aprovada pelo Z em A3). Termos extraídos diretamente de spec/mariah-spec.json 2.1.0, disclaimer.ts e Results.tsx. |
| 0.2.0 | 2026-09-20 | Z (z.ai) — Auditor | Revisão A1: 58→64 entradas, **64/64 aprovado-z**. Classe B: Cláusula de Prevalência Ética redefinida como Salvaguarda Decisória (P4.1/P4.2 → Nível IV) e renomeada "Primacía Ética"; CEP mantido (rejeitada CEI no corpo); "diligenciamiento"→"cumplimentación"; LGPD qualificada "de Brasil". Entradas novas (✚): Salvaguarda Decisória, Salvaguarda da Res. 738, Recomendação de Aprofundamento, Consolidação, Ministério da Saúde, tríade de escopo. G/M: SaMD (expansão inglesa da spec), eliminatória (teto 304/297), req-738-III-2 completada, "No se aplica", classes modais, variantes, strings-âncora. Retroversões verificadas (camada 2). |
