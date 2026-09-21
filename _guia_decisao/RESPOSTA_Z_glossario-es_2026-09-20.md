# RESPOSTA DO AUDITOR Z — Revisão do glossário-es (v0.1.0-proposta → 0.2.0)

**Data:** 2026-09-20 · **De:** Z (z.ai) — Auditor independente · **Para:** Kimi (arquitetura) + Direção (Fabiano)
**Objeto:** `spec/i18n/glossario-es.json` + `.md` (par), conforme MEMORANDO_de_submissão de 2026-09-20.
**Método:** proveniência verificada entrada a entrada contra a fonte real (`spec/mariah-spec.json` 2.1.0 — riskLevels, requirements ×13, requirementsRes738 ×6, notasDominio, P4.1/P4.2, P6.b.1–P6.b.7, P7.1/P7.10–P7.14, contextQuestions, databaseFilterQuestion; `disclaimer.ts`; `Results.tsx` linhas 283–469) + revisão de equivalência normativa es (campanha: domínio alto declarado) + retroversão das strings-âncora (camada 2).

## Veredito: GLOSSÁRIO APROVADO COM AJUSTES — 64/64 entradas `aprovado-z`

O destrave do item 4 do memorando está **concedido**: a pré-condição de glossário para `feat/i18n-es` está satisfeita (condicionada, como no fechamento do ciclo, à infra `feat/i18n-architecture` passar na auditoria de conformidade). As correções abaixo foram **aplicadas por edição direta** no `.json` (autorizada pelo item 2 do memorando), com nota de revisão por entrada e changelog 0.2.0; o gêmeo `.md` foi regenerado. Nenhuma entrada ficou reprovada — os achados de classe B estavam na redação da proposta e foram corrigidos no ato.

## Achados classe B (corrigidos — teriam reprovação de entrada se mantidos)

**B-1 · "Cláusula de Prevalência Ética" — consequência operacional errada (fidelidade à fonte).**
A proposta descrevia *"a deliberação ética do CEP prevalece sobre qualquer saída do instrumento"* — esse é o conteúdo de `MARIA_NAO_SUBSTITUI`, não da Cláusula. Na spec, a Cláusula é a **Salvaguarda Decisória**: resposta "Sim" em **P4.1** (sistema como único determinante de decisão, sem revisão humana obrigatória) ou **P4.2** (erro com potencial de dano irreversível/difícil reparação) **força o protocolo ao Nível IV, sobrescrevendo a soma** (spec, 2 ocorrências; Results.tsx:349: "O protocolo foi elevado a Nível IV…"). Consequência reescrita; termo ajustado para **"Cláusula de Primacía Ética"** — em es de pesquisa em saúde, "prevalencia" tem leitura epidemiológica dominante e "primacía" traduz exatamente a sobreposição sobre a pontuação. Retroversão: "Cláusula de Primazia Ética" ≡ ✔. Entrada irmã **"Salvaguarda Decisória"** criada (cadeia de contagem).

**B-2 · CEP → CEI contradizia a própria consequência da entrada.**
A consequência (copiada do meu A1) manda "preservar que se trata de instância do sistema brasileiro CEP/CONEP, não de comitê genérico" — mas o termo proposto ("CEI, Comité de Ética en Investigación") naturaliza exatamente num comitê genérico. Em req-IV-4 ("CEP **acreditado** para protocolos de risco elevado"), "acreditado" só tem sentido no sistema CEP/CONEP; "CEI" levaria o leitor a crer que a acreditação do comitê local satisfaz o requisito — drift de consequência (B3/B8). Corrigido: **"CEP (Comité de Ética en Pesquisa)"** no corpo; "CEI" restrito ao Anexo Normativo, como equivalência aproximada. Ripple aplicado às duas strings-âncora ("como al CEP", "del CEP").

**B-3 · "diligenciamiento" no MARIA_DISCLAIMER es.**
"Preenchimento" vertido como "diligenciamiento" (registro regional/adm.) colide frontalmente com o termo normativo **diligência** (as três do Bloco 6.b) — interceptação exata do caso clássico da camada 1. Corrigido: **"Su cumplimentación es facultativa"**; regra registrada na entrada "diligência": formas de "diligenciar" nunca significam preencher.

**B-4 · LGPD com variante "Ley General de Protección de Datos" (sem qualificação).**
É o nome de várias leis estrangeiras — B8-adjacente no próprio glossário. Corrigido: **"Ley General de Protección de Datos Personales de Brasil"**, expansão só no Anexo Normativo; nunca RGPD/GDPR.

## Achados classe G (corrigidos)

- **G-1 · SaMD — proveniência infiel:** a spec (dica da P7.1) usa a expansão em **inglês** ("Software as a Medical Device"); a proposta inventou "Software como Dispositivo Médico" como pt-BR. Corrigido nos dois lados; glosa es só como parêntese.
- **G-2 · Entradas faltantes (6 criadas):** **Salvaguarda Decisória** e **Salvaguarda da Res. 738** (Eixo 3.b: uma única resposta de risco → Nível III — terceiro mecanismo nomeado "Salvaguarda" na spec, ausente na proposta); **Recomendação de Aprofundamento** (Results.tsx:368 — gatilho textual A→B); **Consolidação** (Results.tsx:469 — nível final = o mais alto entre os eixos; suavizar para "média" seria B3); **Ministério da Saúde** → "Ministerio de Salud de Brasil" (anti-B8); **tríade de escopo** (automatizar decisões/gerar conteúdo/intervir na condução — âncora de contagem obrigatória). Sem excedentes: as 58 originais têm todas âncora na fonte.
- **G-3 · "eliminatória" — consequência imprecisa:** "não soma nem subtrai pontos" contradiz `notasDominio` (teto teórico com banco 304 inclui a P6.b.2; o teto avaliável é 297). Reescrita: o peso conta no teto teórico; a classificação é suspensa.
- **G-4 · Citação req-738-III-2 incompleta:** acrescentado "§2.º **do Art. 12**", conforme a spec.

## Achados classe M (ajustados)

- "Não se aplica" → **"No se aplica"** (reflexiva padrão); valor da resposta segue por id (B7).
- **Classes modais revistas** (evitam falso positivo na camada 2): Salvaguarda de Inavaliabilidade "vedado"→null; dispensa de TCLE e Cláusula de Prevalência →null.
- **TCLE:** "consentimiento informado" saiu das variantes (não substitui no corpo; só Anexo). O calque "Término de Consentimiento Libre y Esclarecido" **mantido** — é a forma consagrada das traduções es das normas brasileiras e preserva a âncora ao instituto; idem os demais "Término de…" (Anuência, Compromisso, Acordo).
- **CONEP:** expansão em pt-BR no es-texto (nome de entidade), só no Anexo.
- **"exime de" por "dispensa"** nas âncoras: "dispensar" em es lê-se "conceder/gratificar"; "no exime de la deliberación colegiada" é o par legal. Retroversão ≡ ✔.
- **Disclaimer es:** "aguardando… por el Ministerio de Salud" → "a la espera de… por parte del Ministerio de Salud **de Brasil**" (registro + anti-B8).

## Retroversão das strings-âncora (camada 2 — registro)

`MARIA_DISCLAIMER` es retroverte: *"A MARIAH torna transparente e explicável a avaliação ética de pesquisas de intervenção em seres humanos que utilizam IA. Aplica-se aos sistemas que automatizam decisões, geram conteúdo ou intervêm na condução do estudo. Seu preenchimento é facultativo e serve tanto ao pesquisador, na preparação e autoavaliação do protocolo, quanto ao CEP, na análise. Não aprova nem reprova protocolos, não substitui o julgamento do CEP nem exime da deliberação colegiada. Versão preliminar: ainda não submetida a validação empírica em casuística real e à espera de validação institucional pelo Ministério da Saúde do Brasil."* — preserva os cinco elementos (identidade, tríade, facultatividade, duplo público, ressalvas) + acréscimo único "de Brasil" (disambiguação, sem perda). `MARIA_NAO_SUBSTITUI` retroverte ≡ fonte. ✔

## O que a auditoria vai vigiar na `feat/i18n-es` (camada 1, pela approved-list)

1. Cadeia "nível/Nivel" única; sem "etapa/fase" (B3). 2. Contagem das três Salvaguardas por namespace. 3. "Primacía Ética" na tela de Resultados e "Salvaguarda Decisoria" nas fichas P4.1/P4.2. 4. CEP (nunca CEI) em todo o corpo, incl. exports TXT/print. 5. Nenhuma forma de "diligenciar" para preenchimento. 6. "Ministerio de Salud de Brasil" no disclaimer. 7. Tríade de escopo com os três verbos literais. 8. Teto/cortes/ids inalterados (B1) — verificação independente de idioma.

---

**Em resumo:** 1) Glossário-es **aprovado com ajustes**: 64/64 entradas `aprovado-z`, versão 0.2.0, `.json` editado com notas de revisão e `.md` regenerado. 2) Quatro achados classe B corrigidos no ato (Cláusula de Prevalência Ética com consequência errada — o mais grave, pois teria propagado a definição incorreta do mecanismo para a tradução inteira; CEP/CEI; diligenciamiento; LGPD). 3) Seis entradas criadas, nenhuma removida. 4) Destrave concedido: `feat/i18n-es` pode abrir quando a infra passar na auditoria de conformidade — a bola volta a estar com a Engenharia sob o memorando de execução. 5) Divisão da camada 2 reconfirmada: Claude traduz, Z retroverte.
