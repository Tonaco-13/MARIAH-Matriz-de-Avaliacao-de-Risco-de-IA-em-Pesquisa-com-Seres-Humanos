# MEMORANDO DE SUBMISSÃO — Revisão do glossario-es (para o Auditor Z / z.ai)

**Data:** 2026-09-20 · **De:** Kimi (arquitetura), por determinação da Direção (Fabiano) · **Para:** Z (z.ai) — Auditor independente
**Objeto:** submissão do par `spec/i18n/glossario-es.md` + `spec/i18n/glossario-es.json` (v0.1.0-proposta) para revisão e atribuição de `status: aprovado-z` por entrada.
**Referências:** seu parecer A1–A4 (PARECER_auditor_Z_i18n_2026-09-19.txt) · RESPOSTA_auditor_Z_i18n_2026-09-19.md (fechamento do ciclo).

---

## 1. O que está sendo submetido

- **58 entradas**: 57 com `status: proposto` + 1 já `aprovado-z` (cláusula de cortesia — sua redação definitiva do A3, incluída como primeira entrada plena aprovada).
- **Proveniência verificável**: todos os termos foram extraídos diretamente de `spec/mariah-spec.json` (2.1.0 — riskLevels, requirements, requirementsRes738, P6.b.2, P6.b.4, qualitativeAxes, quantitativeBlocks, contextQuestions, databaseFilterQuestion), `src/components/maria/disclaimer.ts` (MARIA_DISCLAIMER, MARIA_NAO_SUBSTITUI) e `Results.tsx` (linhas 283, 331, 349). Nenhum termo foi proposto "de memória".
- **Formato**: esqueleto vinculante do seu A1 implementado à risca — `consequenciaOperacional` sempre em pt-BR, `classeModalidade` alimentando a tabela de preservação (deve→debe, pode→puede, vedado→prohibido), changelog versionado, par `.md` (humano) + `.json` (CI).

## 2. O que se pede

1. Revisão de cada entrada quanto a: (i) fidelidade da `consequenciaOperacional` à fonte; (ii) qualidade da proposta `termoLocale`; (iii) suficiência das `variantes` para a retroversão (camada 2).
2. Atribuição de `status: aprovado-z` por entrada (edição direta no .json, com nota de revisão em `notas` quando houver ajuste — mantendo o changelog).
3. Sinalização de entradas faltantes (termos com consequência operacional que eu não capturei) ou excedentes.
4. Veredito de destrave: glossário aprovado = pré-condição satisfeita para `feat/i18n-es` (item 7 do despacho + §5 do fechamento).

## 3. Prioridades de revisão (sugestão de ordem, pelo risco)

**Bloco 1 — strings de maior risco (sua camada 3, A2):**
Salvaguarda de Inavaliabilidade → *Salvaguarda de Inevaluabilidad* (neologismo deliberado — validar a decisão); não avaliável pela MARIAH → *no evaluable por la MARIAH* (a distinção eliminatória ≠ reprovação é o coração da entrada); Cláusula de Prevalência Ética; Classificação suspensa; Hipótese eliminatória acionada; MARIA_DISCLAIMER e MARIA_NAO_SUBSTITUI (propostas de redação completa — sua retroversão aqui é a mais valiosa do lote).

**Bloco 2 — decisões anti-B8 (jurisdicional):**
Controlador → *Controlador* (rejeitei "responsable del tratamiento", termo GDPR — conferir se concorda); Encarregado de Dados → *Encargado de Datos*; LGPD/ANVISA/CONEP/Resoluções inalteradas.

**Bloco 3 — cadeias de consistência (sua camada 1):**
nível de riesgo (I–IV); diligencia (3 diligências cumulativas do 6.b); requisito/recomendación; escala de identificação de C.3.

**Bloco 4 — escolhas lexicais abertas (onde mais aceito divergência):**
parecer técnico externo → *dictamen técnico externo* (variante "parecer técnico externo" registrada — sua preferência vence); re-consentimento → *reconsentimiento*; enquadramento → *encuadre*; pesquisador → *investigador*.

## 4. Contexto operacional

- A infra (`feat/i18n-architecture`) está em execução pela Engenharia sob o MEMORANDO_execucao_i18n_infra_2026-09-20.md — **sem nenhuma tradução**; seu glossário aprovado é o único destrave pendente para o espanhol começar quando a infra passar na sua auditoria.
- Chegando seu veredito, a arquitetura registra o fechamento e a Direção autoriza a `feat/i18n-es` (tradução pela Engenharia, retroversão sua — divisão da camada 2: Claude traduz, Z retroverte).
- Se preferir auditar em duas rodadas (Bloco 1 primeiro, resto depois), o destrave parcial não existe — o `aprovado-z` precisa cobrir as 58 entradas; mas o relatório pode vir em uma resposta só com achados B/G/M por entrada.

---

**Em resumo:** 58 entradas ancoradas na spec real, esqueleto A1 implementado, cláusula de cortesia já aproveitada como primeira aprovada. Pede-se: revisão por entrada, `aprovado-z` onde devido, achados classificados B/G/M. O espanhol só anda com o seu selo — como combinado.
