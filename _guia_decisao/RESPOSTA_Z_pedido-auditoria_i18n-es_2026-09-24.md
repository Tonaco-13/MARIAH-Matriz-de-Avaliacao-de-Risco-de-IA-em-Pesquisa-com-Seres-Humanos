# RESPOSTA DO Z — Pedido de auditoria de conformidade (LOG #54): agendamento decidido + deliberações antecipáveis emitidas

**Data:** 2026-09-24 · **De:** Z (z.ai) — Auditor independente · **Re:** `PEDIDO_auditoria_Z_i18n-es_2026-09-24.md` · **Base verificada:** `31d046a` (= `9ba637a` + docs-only; diff de 4 arquivos em `_guia_decisao/` conferido — o código auditado é o do estado de referência do pedido)

## 1. Agendamento — DECISÃO: auditar **após o C4**

Acolo a recomendação da arquitetura. Fundamentos: (1) o `<head>` é superfície normativa visível — `siteDesc`/`siteAuthor` carregarão a identidade INAEP/SINEP e as `keywords` perderão "CONEP", decorrência direta da decisão #47; um veredito emitido hoje nasceria incompleto e exigiria aditamento; (2) o custo marginal de esperar é baixo, porque **tudo que não depende do C4 foi deliberado e verificado agora** (parecer abaixo) — o veredito final reduz-se à verificação do C4; (3) não há achado, nesta audiência, que ameace o veredito. O C4, porém, entra no regime com condições (ver §6).

## 2. Deliberação 1 — Glossário v0.3.0: as 3 entradas `proposto` **APROVADAS como estão (3/3)**

Verifiquei as entradas in situ em `spec/i18n/glossario-es.json` (byte-idênticas às minutas do §5 do dossiê) e as chaves-espelho da UI (`footer.developedBy`, `report.footerDev`, `pages.validacao.s5p1`, `results.validacaoDesc`, `pages.statusAviso`, `home.inaepAlt` — todas nas formas decididas). **Veredito terminológico: aprovo "INAEP (Instancia Nacional de Ética en Investigación)", "SINEP (Sistema Nacional de Ética en Investigación con Seres Humanos)" e "Guía de Uso Ético de la Inteligencia Artificial en Investigación con Seres Humanos"**, sem ajuste.

Fundamentação, incluindo a divergência com minha pré-revisão #46:

1. **Retiro expressamente o precedente "nunca 'Investigación'" do #46 no que ia além do seu escopo.** Ele foi fixado no contexto CEP/CONEP — ente deliberador nomeado **em cláusula normativa** (a âncora byte-protegida) — e extrapolado por analogia às minutas de identidade institucional. A extrapolação era defeituosa: os casos não são iguais.
2. **A distinção operante é real e coerente:** (a) *entes nomeados em cláusula* conservam a forma registral com ancoragem acronímica — "Comité de Ética **en Pesquisa**" soletra C-E-P e conecta o leitor ao nome legal que ele encontrará nos documentos do protocolo (intocada, `aprovado-z`, rejeição de "CEI" mantida); (b) *identidade institucional descritiva* (autoria, sistema, título de obra) usa **espanhol pleno** — "pesquisa" não é vocábulo espanhol e "en Pesquisa" é híbrido sem ganho registral nessas posições. Já existia precedente sancionado no pacote es: o Anexo Normativo v0.2.0 usa "Comité de Ética en Investigación (CEP)" por design (ruling v0.2.0: "never CEI — only in Anexo Normativo") e "Ministerio de Salud de Brasil" é tradução plena `aprovado-z`.
3. **Siglas permanecem intraduzíveis** (regra do glossário); o formato "SIGLA (forma extensa)" preserva a conexão sigla↔expansão pela ordem, independentemente de soletração — a soletração exata nunca foi critério absoluto (INAEP já não soletra "Instância Nacional de Ética em Pesquisa", e CNPq é precedente brasileiro clássico).
4. **A assimetria resultante** (CEP "en Pesquisa" × SINEP/INAEP "en Investigación" no mesmo produto) é deliberada, motivada e documentada (dossiê §5/§8, decisão #47). Recomendo que a regra operante acima conste do `glossario-es.md`/anexo normativo no próximo ciclo, para blindar as duas formas contra "correções" futuras por consistência aparente.

**Consequência processual:** as 3 entradas ficam aprovadas a partir deste parecer; o carimbo material (`status: proposto → aprovado-z` + entrada de changelog citando este parecer, formas intactas) pode entrar como micro-commit de docs da Engenharia, separado do commit do C4.

**Registros conexos (não bloqueantes, fora do objeto deste veredito):** o Anexo Normativo es §1 ainda descreve o sistema sob o paradigma "CEP/CONEP" e não cobre INAEP/SINEP (é v0.2.0, anterior à diretriz #47) — recomendo sua atualização no próximo ciclo de glossário.

## 3. Deliberação 2 — Retroversão por amostragem: **EXECUTADA AGORA, resultado verde**

Aprovei a amostra proposta e a executei nesta data — ela não precisará ser refeita pós-C4 (o C4 não toca spec/messages existentes):

- **Eixo 2 completo** (12 questões pt×es: pergunta + dica + motivoEliminatorio, campo a campo): retroversão fiel em todas. Pontos críticos conferidos: cross-refs preservadas ("1.2 = Sí", "4.3/P3.6"); dica 2.8 íntegra (Lei 14.874/2024; LGPD art. 8.º §5.º e art. 18; os três compromissos verificáveis; "desaprendizaje automático"); 2.10 com o efeito impeditivo intacto ("bloquea el dictamen — protocolo no evaluable en el mérito —, en convergencia con la P2.8"); "parecer"→"dictamen", "dossiê"→"dosier", "devolutiva"→"devolución" — equivalentes normativos corretos.
- **Cláusulas-âncoras (3/3):** disclaimer, não-substituição e cortesia — as es foram lidas contra o glossário e o Check C re-rodado por mim dá 3/3 verbatim.
- **Leva institucional (amostra de 9 chaves):** `footer.developedBy` (tag `<ms>` preservada), `report.footerDev` (reconciliada), `s5p1`, `validacaoDesc` (`<em>` no título do Guia; "planilha-modelo e roteiro"→"planilla-modelo y guion"), `statusAviso` (`{tipo}` ICU e tags preservados), `home.intro` (CEP na forma `aprovado-z` — a UI segue o glossário, distinto do anexo, por design), `home.inaepAlt`, `home.chooseSubtitle`, placeholder C3 pt+es. Sem desvio de sentido.

**Achados menores (registro, nenhum exige ação):** uniformização es "persona participante" onde o pt diz "participante" (política terminológica consistente, sentido intacto); aspas angulares «» no es × aspas retas no pt (convenção tipográfica legítima; tokens B1 intactos); "recolect-" lexicalmente consistente na spec es (13 ocorrências, zero "recog-").

## 4. Deliberação 3 — Ciência formal do incidente operacional e da P2: **registrada, sem ressalva**

Tomo ciência formal do incidente de corrida entre sessões (LOG #50: reparações verificadas — main restaurada a `e2ea13e`, nada pushado, `origin/main..main` = 0) e do encerramento da P2 (descarte do patch com tripla prova; logo `599a287`; docx `3c8af18`). Nenhum efeito sobre os gates ou sobre o objeto do veredito. A recomendação processual de serializar mutações de git entre sessões permanece de pé enquanto houver sessões paralelas.

## 5. Deliberação 4 — Regime de construção: **veredito preliminar favorável**

O critério de completude usado — 430/430 folhas + `i18n:key-parity --strict` 0 ausentes/0 órfãs — **satisfaz o DoD da Opção A** e encerra o regime: a Opção A foi sancionada sob a condição de o strict fechar no fim do ciclo; fechou, e eu o re-executei pessoalmente (§6). Os demais requisitos do ciclo estão verificados: spec 344/344 com 0 fallback, relatório/exports locale-aware com pt-BR byte-idêntico (#43), runtime com merge es-sobre-pt-BR e banner que não renderiza em pt-BR (#44), âncoras verbatim com guarda com dentes, baseline NDTI 4/4. **Nada encontrado até agora condiciona o veredito final além do C4.**

## 6. Recibo da verificação independente + condições do C4 para o veredito final

**Cadeia re-rodada por mim nesta data sobre `31d046a`:** verify **105/105** · parity **128/0** · gate vetores **64/64** · i18n-identity **344/344, 0 fallback** · no-literal **A + B1 (344) + B2 + C (3/3)** ✔ · key-parity padrão **0 órfãs** e **`--strict` 0/0 sobre 430 chaves** · parity:locale **4/4** (pt-BR DOM-idêntico à baseline NDTI, flag off).

**Condições para o veredito final pós-C4** (todas já constam da minuta; listo como critérios objetivos de aceite): (1) namespace `meta` sob o regime — strict verde com o total recontado (**esperado: 434 folhas em pt-BR e es, 0/0**); (2) baseline NDTI regenerada no mesmo commit, com diff **limitado a TITLE/META-DESC da home** (conferirei o diff da baseline); (3) formas do `<head>` es idênticas ao glossário v0.3.0 (agora `aprovado-z`) — a minuta §3 conferre; (4) smoke flag-on com `<head>` do `/es` em es; (5) commit único, sem mistura de escopo. Satisfeitas essas condições, o veredito final cobre o ciclo completo — a retroversão e as deliberações deste parecer entram por já feitas.

## 7. Encaminhamento

À Direção: (a) a redação pt-BR da minuta C4 §3 é compatível com tudo o que aprovo aqui — o item pendente é decisão de redação vossa; (b) a publicação (flag na Vercel + merge final) segue condicionada ao veredito final, que estou pronto a emitir imediatamente após a aterrissagem do C4. Ao Operador: transcreva este parecer ao canal (#55) e versione como artefato na forma usual.

---

**Resumo executivo para o LOG:** Z decide auditar **após o C4** (head é superfície normativa; custo marginal baixo pois o independente já está feito) · glossário v0.3.0 **APROVADO 3/3** — precedente #46 "nunca Investigación" retirado por extrapolação de escopo; regra operante: cláusula/âncora conserva forma registral (CEP "en Pesquisa"), identidade descritiva usa espanhol pleno ("Investigación", precedente do anexo v0.2.0) · retroversão por amostragem **executada e verde** (Eixo 2 completo 12Q, âncoras 3/3, 9 chaves institucionais; achados menores não bloqueantes) · ciência do incidente/P2 **sem ressalva** · regime Opção A + strict **preliminarmente confirmado** como satisfazendo o DoD · cadeia toda **re-rodada por mim em `31d046a`, verde** · veredito final após C4 sob 5 condições objetivas (strict 434/434 esperado; baseline diff só TITLE/META-DESC; head es = glossário; smoke flag-on; commit único).