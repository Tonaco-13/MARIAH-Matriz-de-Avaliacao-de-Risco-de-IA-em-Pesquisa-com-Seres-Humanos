# PARECER DO Z — Glossário/tradução das 16 chaves da nomenclatura (LOG #70, branch `chore/nomenclatura-guia`)

> Transcrito pelo Operador em 2026-09-25 e versionado pela Engenharia. Texto do parecer reproduzido sem alteração.
> Aplicação: `405b393` (ajuste da chave 16) e `5541ab6` (glossário v0.5.0), branch `chore/nomenclatura-guia`.

**Data:** 2026-09-25 · **Base verificada:** `2f8269e` lido por `git show` (worktree intocado; 16 chaves pt×es conferidas contra o disco, incluindo tags e placeholders) + glossário v0.4.0 + main `9ef9283` · **Recibo:** o commit toca messages pt+es (16+16), baseline NDTI (recaptura coerente com TITLE/META-DESC das 3 páginas), planilha 2.1 e `verify-coverage.ts`; **âncoras do disclaimer intocadas** (confirmado).

## Tabela — veredito por chave

| # | Chave | Veredito | Nota |
|---|---|---|---|
| 1 | footer.linkApendice | APROVADO | "Instrucciones de cumplimentación" — habitat correto (P5) |
| 2 | footer.emRevisao | APROVADO | espaço inicial preservado pt/es |
| 3 | results.emRevisaoBadge | APROVADO | — |
| 4 | results.validacaoDesc | APROVADO | `<em>` com título por extenso; "el guion" consistente com o uso prévio desta mesma chave; "Sección de Validación Local" (P4) |
| 5 | results.arquivosAtualizados | APROVADO | subjuntivo "se publiquen" correto |
| 6 | pages.emRevisao | APROVADO | — |
| 7 | pages.statusAviso | APROVADO | `{tipo}` intacto; "Estado:" forma já em uso; "el Caderno Referencial" = artigo traduzido + nome próprio mantido (padrão correto, P2); data idêntica |
| 8 | pages.instrucoes.metaDesc | APROVADO | "puntos de corte" = palavra, não número (B2 ok); título com "de la" (P1) |
| 9 | pages.instrucoes.subtitle | APROVADO | — |
| 10 | pages.instrucoes.s3p | APROVADO | `<mail>cgrep@saude.gov.br</mail>` idêntico pt/es; CGREP sigla mantida (não se traduz) |
| 11 | pages.transparencia.s1p2 | APROVADO | `<b>prospectiva</b>`; subjuntivos "adopten/conduzcan" corretos |
| 12 | pages.transparencia.s5p | APROVADO | "las contribuciones, de carácter informativo, se sistematizarán" — fiel (P6) |
| 13 | pages.validacao.metaDesc | APROVADO | "Comités de Ética en Pesquisa" = plural da forma `aprovado-z` (entidade normativa em cláusula — regra operante) |
| 14 | pages.validacao.subtitle | APROVADO | sem ponto final, como o pt |
| 15 | pages.validacao.s1p1 | APROVADO | "no norma vinculante"; "guion práctico"; "la Validación Local" maiúsculas consistentes |
| 16 | pages.validacao.roteiroDesc | **AJUSTE** | **"justificativa" → "justificación"** (lusismo; única correção deste parecer). Forma final es: `Sección de Validación Local (documento MARIAH) con la justificación de cada frente, recomendaciones operacionales, interpretación de los hallazgos y canal opcional para compartir con el Grupo de Trabajo.` |

**B7 (verificado in disco, 16/16):** tags `<em>`/`<b>`/`<mail>` com conteúdo e posição corretos, `{tipo}`, e-mail e data — íntegros pt↔es. **15 APROVADO · 1 AJUSTE (1 palavra em es).**

## Decisões expressas (pontos 1–6)

1. **Título do Guia em es: MANTER "de la Inteligencia Artificial".** A construção com artigo é a natural e canônica em títulos es ("Ética de la Inteligencia Artificial" na literatura hispanofalante); a supressão do artigo no pt é escolha estilística do original, não elemento identitário — e a diretriz consolidada do pacote es é espanhol pleno na identidade descritiva (#47, ratificada na v0.3.0), forma já publicada na UI es. Espelhar o telegrafismo pt produziria título es marcado sem ganho. **Entrada do glossário: ATUALIZAR o `termoPtBr`** para o nome oficial novo ("…de Inteligência Artificial…"), **mantendo o `termoLocale`** — o par passa a refletir o oficial pt (v0.5.0; forma es inalterada).
2. **"Caderno Referencial": MANTER sem tradução.** Regra operante: título es de documento da casa é ato da Direção (precedente Guia, #47); sem ato, nome próprio intocado (como MARIAH). "Cuaderno Referencial" seria título es não-sancionado. **Entrada nova SIM** — par pt=es, "não se traduz até ato da Direção"; artigo "el" quando articulado ("el Caderno Referencial" ✔, como no rascunho).
3. **"revisión editorial" / "en revisión editorial para su publicación": APROVADO** — cognato exato; "para su publicación" natural. "Revisão editorial" é status institucional (casca de UI/página), **não** vira entrada de glossário.
4. **"documento MARIAH" / "Sección de Validación Local": formas corretas — e SIM, entradas novas (2).** "documento MARIAH" (par pt=es; designação oficial do documento que reúne instruções e validação local) e "Seção de Validação Local → Sección de Validación Local" (designador estrutural do documento MARIAH; maiúsculas institucionais, consistentes com a página/frente já em uso). Blindam a nomenclatura nova contra drift.
5. **"Instrucciones de cumplimentación": APROVADO.** O #67-P3 restringiu a perífrase "completar la cumplimentación", não o substantivo — aqui é o título funcional do documento de instruções, habitat legítimo do termo aprovado.
6. **Registro institucional confirmado:** "Instancia Nacional de Ética en Investigación (INAEP)" = forma `aprovado-z` v0.3.0 ✔; s5p fiel ("contribuciones, de carácter informativo" ✔).

**Glossário v0.5.0 resultante:** 1 update (termoPtBr da entrada Guia) + 3 entradas novas (Caderno Referencial · documento MARIAH · Seção de Validação Local), todas `aprovado-z` por este parecer, changelog citando LOG #70 — micro-commit na mesma branch, antes do merge.

## Ciência registrada (fora do escopo, conforme pedido)

Âncora do disclaimer ("Versão preliminar… validação institucional…") e badge "Versão preliminar" intocados — correto: a âncora é verbatim ao glossário (gate C). Qualquer atualização de status que os alcance é pedido próprio, com glossário + âncora no mesmo ato.

## Encaminhamento

Aplicar o AJUSTE da chave 16 (es only, 1 palavra) e o glossário v0.5.0; re-rodar a cadeia (denominador inalterado 469; B1/B2/C; parity 4/4 sobre a baseline já recapturada). Cumprido isso, **este parecer deixa de obstar o PR** — merge por decisão da Direção.

— Z (z.ai), auditor independente
