# PARECER DO Z — Tradução es dos baixáveis e do JSON de validação (ES-DL, LOG #71/#72)

> Transcrito pelo Operador em 2026-09-25 e versionado pela Engenharia. Texto do parecer reproduzido sem alteração.
> Aplicação: `13d0811` (ajuste "frente"), `9453252` (glossário v0.6.0), `6b9cf29` (ativação), branch `feat/es-baixaveis`.

**Data:** 2026-09-25 · **Base verificada:** branch `feat/es-baixaveis` (`f03e262`), leitura direta do disco + extração dos artefatos gerados (XML do xlsx, `document.xml` dos 5 docx, `utils.ts`, mapas, geradores, `downloads.ts`).

## Recibo de verificação própria

- **Não-ativação confirmada:** `downloads.ts` com `es: new Set([])`; `idioma.arquivoEmPt` pt "(em português)" / es "(en portugués)"; os **6 gêmeos `-es` existem** em `public/` (5 docx + xlsx).
- **Âncora de cortesia — verbatim em todos os alvos declarados:** glossário == constante `CORTESIA` do gerador (`aplicar.py`, byte-idêntica por comparação direta) == fecho da `observacao` es do JSON == **×1 em cada um dos 5 docx** == planilha es (sharedStrings). Detalhe de desenho a registrar: nos docx a âncora é constante do gerador, não item de mapa — estruturalmente imune a drift de tradução.
- **JSON (`ORIENTACAO_VALIDACAO` es):** nomes de campos e valores do schema intactos (`classificacaoConsolidada`, `clausulaPrevalencia`, "NÃO AVALIÁVEL"), com a política declarada in loco ("Los nombres de los campos y los valores del JSON son los mismos en todos los idiomas; solo estos textos de orientación están traducidos") e o mapeamento de entrada documentado («NO EVALUABLE» quando `= "NÃO AVALIÁVEL"», «Sí» quando `= true`). «Cláusula de Primacía» (glossário ✔), «no riesgo» com aspas angulares (convenção ✔), "el Frente 1" masculino.
- **Planilha:** "NO EVALUABLE" ×10 no XML; literais 'Sí'/'No'/'NO EVALUABLE' no gerador.
- **Mapas docx:** "los tres frentes" ×4, "disparador(es)" ×9, "se eleva obligatoriamente al Nivel IV" idêntico em todo lugar onde ocorre (nota técnica ×2, suplemento ×1 — o roteiro não contém a frase, que não é do seu habitat).
- **Messages:** «**las** tres frentes» confirmado em `pages.validacao.s2Title`, `s2intro`, `fluxo4` — a inconsistência apontada é real.

## Decisões expressas

1. **JSON canônico pt: CONCORDO, sem ressalva.** O export é **dado**, não UI: contrato do schema v3 e comparabilidade entre CEPs (kappas agregáveis entre idiomas) exigem valores únicos. A planilha é **entrada humana** — localizada por natureza. O desenho implementado (valores pt + orientação es do mapeamento, verificada in loco) é o correto; emitir valores es no JSON quebraria a comparabilidade sem ganho.
2. **"Frente": fixar o MASCULINO — e corrigir as 3 chaves das messages.** Gramaticalmente, "frente" no sentido de linha de atuação é masculino no es ("el frente de actuación"); "la frente" é a testa. Os 6 artefatos novos (incluindo "el Frente 1" do JSON) estão no masculino — correto. O «las tres frentes» das messages aprovadas é o lado errado do drift, revelado agora pelos documentos: **AJUSTE es-only** em `s2Title`, `s2intro` e `fluxo4` («las tres frentes» → «los tres frentes»), sem tocar pt nem baseline (es não integra a captura NDTI; strict inalterado). Entrada de glossário com a nota anti-confusão.
3. **Termos novos: os 8 APROVADOS** como entradas v0.6.0 (`aprovado-z` por este parecer): «só-abate»→«solo descuento» · «gatilho»→«disparador» · «planilha-modelo»→«planilla-modelo» (já em uso) · «aba»→«pestaña» · «teto teórico/avaliável»→«techo teórico/evaluable» · «baseline»→«línea de base» · «thresholds»→«umbrales» · «Diligência (devolução)»→«Diligencia (devolución)». **Nota de blindagem obrigatória na entrada «Diligencia»:** sentido normativo de devolução para complementação, **nunca** o ato de preencher (= cumplimentación, ruling v0.2.0 que baniu "diligenciamiento") — é exatamente a colisão que o ruling previu.
4. **Âncora: verificada verbatim por mim em todos os alvos** (recibo acima) — ponto encerrado.
5. **Referências bibliográficas no original: APROVADO** — norma de citação; as Resoluções CNS são documentos oficiais em português.
6. **Fidelidade ao defeito do pt (nota técnica §2.1): CONFIRMADO** — a tradução espelha o canônico, defeito incluído; corrigir o período é ato de conteúdo pt da Direção (achado a do LOG #72), ciclo próprio. Tradução não corrige original — criaria divergência entre os documentos.
7. **P4.1/P4.2: reuso confirmado** — o suplemento emprega o léxico aprovado da spec ("afecta directamente a la persona participante") dentro de prosa própria do documento (que parafraseia o pt do suplemento, como deve).
8. **Instruções — moldura: APROVADO.** "se eleva obligatoriamente al Nivel IV" consistente entre todos os anexos onde ocorre; a UI usa "Elevación automática a Nivel IV" (rótulo curto) — variação que espelha o próprio pt (UI "Elevação automática" × documentos "é forçado ao Nível IV"): fidelidade, não inconsistência.

## Encaminhamento

(1) Aplicar o **AJUSTE es-only** das 3 chaves "frentes"; (2) glossário **v0.6.0**: 9 entradas novas (8 termos do ponto 3 + "frente") com carimbo citando este parecer; (3) re-rodar a cadeia (strict 470/470 — inalterado; âncoras C; parity 4/4); (4) então **ATIVAR**: `TRADUZIDOS.es` com os 6 ids, commit único — recomendo aceite da arquitetura com cadeia completa + smoke es (os 6 links servindo os `-es`, sem o aviso "(en portugués)", e pt inalterado); (5) merge por decisão da Direção.

— Z (z.ai), auditor independente
