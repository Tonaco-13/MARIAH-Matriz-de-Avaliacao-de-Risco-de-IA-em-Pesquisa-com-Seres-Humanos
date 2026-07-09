# MARIA — Propostas para validação posterior (NÃO aplicar sem deliberação)

> Registro do **Passo 6** da rodada de alterações de 2026-07-09 (consentimento e
> correlatos). Estes itens **não foram implementados** nas matrizes ativas. Ficam
> aqui como candidatos, para discussão no GT e eventual validação empírica
> (Apêndice F do Guia). Nada abaixo altera perguntas, IDs, pesos ou faixas.

> **Atualização 2026-07-09 (rodada de diagnóstico):** os três candidatos abaixo
> foram refinados com o enquadramento do GT. Continuam **não aplicados** na matriz.

## 1. Teste de robustez contra reidentificação/memorização (desdobramento de 3.5 / P6.3)

Para protocolos com PLN/LLM ou dados sintéticos, avaliar a inclusão de item que
verifique testes documentados de robustez contra reidentificação e memorização
(ataques de extração/inferência de pertencimento).

**Enquadramento GT:** alocar no **Bloco 6 (Dados)**, junto de **P6.3** — *não* no
Bloco 7. **Não** tratar como mitigação compensável por pontos: direito de
privacidade/LGPD não deve ser diluível por soma. Classificar como
**risco-se-ausente** (a ausência de teste documentado adiciona risco) ou como
diligência. Na Versão A, desdobramento correspondente no **Eixo 3** (junto de 3.5).
Decisão pendente: redação exata e forma final (risco pontuado vs. diligência).

## 2. "Barreira infraestrutural" — condições reais para supervisão humana efetiva

Pergunta candidata sobre as condições concretas do ambiente (tempo disponível,
carga de trabalho, razão profissional/casos) para que a supervisão humana no
circuito decisório seja efetiva e não apenas formal.

**Enquadramento GT:** redigir como condição de **execução do protocolo de
pesquisa** (o cenário em que a pesquisa roda permite supervisão efetiva?), **não**
como avaliação da rotina clínica assistencial — evitando a confusão pesquisa ×
assistência apontada pela relatora. **Ausência = risco**; **não** alocar no
Bloco 7 (mitigação). Candidata ao **Eixo 5 (Versão A) / bloco de supervisão da
Versão B**. Decisão pendente: redação, alocação exata e peso.

## 3. Enquadramento pesquisa × assistência (parecer Roseli — tema recorrente)

Revisar a redação de **2.1 / P5.1** ("decisões clínicas ou terapêuticas") para
assegurar leitura como parte do **protocolo de pesquisa**, não da prática clínica
assistencial. Não é criação de pergunta, e sim ajuste redacional. **Confirmar a
redação exata com a relatora antes de aplicar.**

---

### Itens correlatos sinalizados nesta rodada (fora dos 6 passos)

- **Inconsistência "três → quatro salvaguardas".** A diligência do novo
  consentimento (P2.8 / 2.10) funda-se na **Lei n.º 14.874/2024 + LGPD**, não na
  Res. CNS n.º 738/2024. Isso torna incompletos os textos que descrevem "três
  mecanismos de salvaguarda" e a atribuição exclusiva à Res. 738. Pontos a revisar
  (mapeados na Tarefa 2, **não editados**):
  - `src/app/transparencia/page.tsx:192` — "a MARIA superpõe **três mecanismos**".
  - `src/app/transparencia/page.tsx:198` — grade `md:grid-cols-3` (3 cards Gatilho).
  - `src/app/transparencia/page.tsx:250-255` — card **Gatilho 3 "Questões
    eliminatórias"**, subtítulo "Versões A e B · **modo Res. 738**".
  - `src/app/transparencia/page.tsx:304` — descrição do download do Suplemento:
    "Detalhamento dos **três mecanismos** … (Eixo 3.b, Cláusula de Prevalência
    Ética e questões eliminatórias)".
  - `public/suplemento-salvaguardas-maria.docx` — o Suplemento (binário) descreve
    três mecanismos; revisar fora do app.
  - **Fora do repo (sinalizar ao GT):** Capítulo 7 do Guia e aba "Regras e
    Classificação" da planilha da MARIA.
  - *Observação:* `transparencia/page.tsx:23` fala em "**três camadas**"
    (normativa/elaboração/empírica) — são as camadas de premissas, **não** as
    salvaguardas; **não** integra esta inconsistência.

  **Proposta de redação a validar (não aplicar):** as salvaguardas/diligências de
  override passam a ter **duas bases legais** — (a) **Res. CNS n.º 738/2024** para
  bancos de dados (Eixo 3.b / eliminatória do Termo de Anuência) e (b) **Lei
  n.º 14.874/2024 + LGPD** para o novo consentimento em sistemas adaptativos.
  Ajustar a contagem para **quatro mecanismos** — ou **reagrupar por base legal** —
  de forma idêntica no app, no Suplemento, no Capítulo 7 do Guia e na planilha.

- **Identidade do "P2.8" (ver Tarefa 1).** Precisa de decisão do GT: hoje é uma
  questão real (pontos:0, eliminatória) no Bloco 2, não um mero rótulo na regra de
  consolidação. Não altera teto/faixas, mas altera a **contagem de perguntas** da
  Versão B (51 → 52). Ver achado detalhado na devolutiva ao chat do GT.
