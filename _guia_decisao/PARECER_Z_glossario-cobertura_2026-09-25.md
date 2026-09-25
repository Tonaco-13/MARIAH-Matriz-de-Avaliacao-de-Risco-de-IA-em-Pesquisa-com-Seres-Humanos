# PARECER DO Z — Glossário/tradução das 24 chaves de cobertura e "(parcial)" (gate para a publicação do ES)

> Transcrito pelo Operador em 2026-09-25 e versionado pela Engenharia. Texto do parecer reproduzido sem alteração.
> Aplicação: `5d4a584` (i18n: itens 5 e 6) e `44cd77c` (glossário v0.4.0), branch `chore/i18n-es-parecer-cobertura`.

**Data:** 2026-09-25 · **Base verificada:** `origin/main` (PRs #35/#36) + `feat/parcial-explicacao` `ea0a120` (lidas por `git show`, worktree intocado) + glossário v0.3.0 + messages es consolidados · **Verificações próprias:** comparação pt×es das 24 chaves; conferência de termos em uso (`informe`, `descargue`, `auditoría`, `pantalla`, `Bloque N`, `permanecen solo en este navegador`, padrão ICU one/other); invariante B7 conferido manualmente chave a chave.

## Tabela — veredito por chave

| # | Chave | Veredito | Forma final es | Nota |
|---|---|---|---|---|
| 1 | results.nivelCardParcial | APROVADO | `Nivel {level} (parcial)` | "Nivel" sem acento (es), glossário níveis I–IV |
| 2 | results.coberturaParcial | APROVADO | `Clasificado a partir de {respondidas}/{total} preguntas respondidas ({taxa}%). {count, plural, one {# pregunta sin evaluación} other {# preguntas sin evaluación}} — véase la sección de auditoría.` | ICU correto; "véase" — ver P4 |
| 3 | results.coberturaCompleta | APROVADO | `Clasificado a partir de {respondidas}/{total} preguntas respondidas (100%).` | — |
| 4 | results.parcialExplicacaoTitulo | APROVADO | `¿Qué significa «(parcial)»?` | «» = convenção es do pacote (spec «congelado») |
| 5 | results.parcialExplicacaoA | **AJUSTE** | `La clasificación usa solo las preguntas respondidas; las que están en blanco cuentan como «no riesgo». Por ello, el nivel puede estar subestimado: responder las preguntas pendientes puede elevarlo o, si se responde una pregunta eliminatoria, volver el protocolo no evaluable por la MARIAH. Las preguntas sin evaluación figuran en la sección de auditoría.` | P3: "completar la cumplimentación"→"responder las preguntas pendientes"; «no riesgo» — P2 |
| 6 | results.parcialExplicacaoB | **AJUSTE** | `La puntuación usa solo las preguntas respondidas; las que están en blanco valen cero. Las preguntas de riesgo en blanco dejan de sumar puntos, y las mitigaciones y evidencias (Bloque 7) en blanco dejan de descontarlos. Por lo tanto, responder las preguntas pendientes puede elevar o reducir el nivel, o volver el protocolo no evaluable por la MARIAH. Las preguntas sin evaluación figuran en la sección de auditoría.` | idem P3; "Bloque 7" = forma em uso; "evidencias" = glossário |
| 7 | results.badgeAParcial | APROVADO | `A: Nivel {level} (parcial)` | — |
| 8 | results.badgeBParcial | APROVADO | `B: Nivel {level} (parcial)` | — |
| 9 | results.badgeConsolidadoParcial | APROVADO | `Consolidado: Nivel {level} (parcial)` | — |
| 10 | results.respostasRiscoEixo | APROVADO | `Respuestas de riesgo: {count}` | — |
| 11 | results.respondidasContagem | APROVADO | `Respondidas: {respondidas}/{total}` | cognato exato (es = pt) |
| 12 | results.barraEixoAria | APROVADO | `{risco} con respuesta de riesgo, {semRisco} respondidas sin riesgo, {semResposta} sin respuesta, de {total} preguntas` | "sin riesgo" correto aqui — P2 |
| 13 | results.legendaBarraEixo | APROVADO | `Barra: respuestas de riesgo (color del nivel) · respondidas sin riesgo (gris) · sin respuesta (carril vacío).` | "carril vacío" bom para "trilho vazio" |
| 14 | results.registroTitulo | APROVADO | `Registro de esta evaluación` | — |
| 15 | results.registroDesc | APROVADO | `Guarde el informe o descargue el registro completo. Los archivos reproducen el mismo contenido de esta pantalla y del informe impreso — identificación, contexto, resultado con la cobertura, requisitos y auditoría.` | "informe/descargue/pantalla" = formas em uso |
| 16 | results.novaAvaliacaoLembrete | APROVADO | `Los datos permanecen solo en este navegador y no se envían a ningún servidor: si necesita conservarlos, guarde el informe o descargue el registro antes de continuar.` | ecoa verbatim as frases-irmãs existentes ("permanecen solo en este navegador", "no se envían a ningún servidor") |
| 17 | report.parcialSufixo | APROVADO | `(parcial)` | cognato exato |
| 18 | report.coberturaParcial | APROVADO | idêntica à nº 2 | coerência tela=relatório por design ✔ |
| 19 | report.coberturaCompleta | APROVADO | idêntica à nº 3 | idem |
| 20 | report.respondidasTxt | APROVADO | `Respondidas: {respondidas}/{total}` | cognato exato |
| 21 | report.colRespondidas | APROVADO | `Respondidas` | cognato exato |
| 22 | report.respostasRiscoTxt | APROVADO | `Respondidas: {respondidas}/{total} · Respuestas de riesgo: {count} → Nivel {level} ({label})` | seta "→" e placeholders preservados |
| 23 | report.consolidadoRotulo | APROVADO | `Consolidado:` | cognato exato |
| 24 | report.coberturaRotulo | APROVADO | `Cobertura` | cognato exato |

**B7 (verificado manualmente em todas):** placeholders `{…}`, estruturas ICU `one/other` com `{count}`/`{#}`, `{respondidas}/{total}`, `{taxa}`, `{level}`, `{label}` e a seta literal — todos intactos e 1:1 com o pt.

## Decisões expressas (pontos 1–6)

1. **"(parcial)" e "cobertura" viram entradas do glossário (v0.4.0) — SIM.** São termos normativo-metodológicos do instrumento (marcador de classificação com cobertura <100%; métrica respondidas/total), com uso em tela e relatório — exatamente o que o glossário protege. Aprovo desde já as minutas abaixo (carimbo `aprovado-z` no micro-commit junto ao commit i18n; formas intactas):
   - **"(parcial)"** — es `(parcial)`. Consequência operacional: marcador anexado ao nível quando a classificação foi calculada com questões sem avaliação; convenção do branco por versão — **A:** questões em branco contam como **«no riesgo»** (nível pode estar subestimado; completar pode elevar o nível ou tornar o protocolo não avaliável por eliminatória); **B:** branco vale zero e mitigações/evidências (Bloco 7) em branco deixam de abater (completar pode elevar **ou reduzir**, ou tornar não avaliável). Definição exibida no disclosure "(?)" da tela.
   - **"cobertura" (da classificação)** — es `cobertura`. Consequência operacional: fração respondidas/total exibida na linha de cobertura, idêntica em tela e relatório por design; 100% = classificação plena. **Registro da distinção léxica (blindagem):** **«no riesgo»** (aspas angulares — convenção de cálculo do branco, Versão A) jamais se confunde com **"sin riesgo"** (resposta efetiva sem risco — barra, legenda, ARIA); formas inconfundíveis por design, nunca intercambiar.
2. **«no riesgo» × "sin riesgo": MANTER a distinção.** Correta e necessária: «no riesgo» afirma como o branco é *tratado no cálculo* (não que não haja risco); "sin risco" descreve resposta efetiva. A marcação «» espelha as aspas do pt e é a convenção do pacote.
3. **"completar la cumplimentación": AJUSTE acolhido** → **"responder las preguntas pendientes"** (itens 5 e 6; formas finais na tabela). Clareia a ação concreta, encadeia com "solo las preguntas respondidas" e devolve "cumplimentación" ao seu habitat (disclaimer, avisos de apagamento), onde permanece o termo aprovado.
4. **"véase la sección de auditoría": MANTER "véase".** Remissão documental normativa (o "vide" funcional), harmônica com "figuran en la sección de auditoría" do mesmo bloco e com o registro do produto; "ver la sección" seria registro coloquial — aceitável, mas inferior aqui.
5. **Mérito pt A/B: correção normativa-metodológica CONFIRMADA.** A: branco = «no risco» ⇒ completar só pode adicionar risco ⇒ elevar o nível ou tornar não avaliável (eliminatória) — subestimação unidirecional, e o texto A corretamente não menciona redução. B: risco em branco não soma **e** mitigação/evidência (7A/7B/7C, "Sim" subtrai) em branco não abate ⇒ completar pode elevar ou reduzir ou tornar não avaliável — bidirecional, e o texto B corretamente inclui "o reducir". A diferença entre os textos é a mecânica de cada versão, não inconsistência. Os es a espelham com fidelidade.
6. **Formato disclosure nativo: APROVADO.** Fundamentação correta (Radix Tooltip não abre confiavelmente ao toque; a explicação é conteúdo normativo acessível, não redundante). Ocultação a 100% e na suspensão: correta (sem "(parcial)", sem explicação). Só na tela: aceitável — **nota registrada** para futuro ciclo de conteúdo pt: o relatório impresso/exportado carrega "(parcial)" e a linha de cobertura sem definição; uma nota de rodapé curta no relatório merece consideração (decisão de conteúdo canônico, não de i18n — não condiciona este parecer).

## Encaminhamento do commit único de i18n

Aplicar as 24 formas da tabela (22 como propostas — 18 já em disco —; **2 ajustadas: itens 5 e 6**; as 6 cognatas completam com grafia es = pt). Estado observado para o recibo: 15/21 no `origin/main` e 3/3 na `ea0a120` já constam com as formas propostas; as 6 restantes estão pt-espelhadas. O commit **não muda denominadores** (chaves já existem nos dois arquivos) — strict deve permanecer no valor corrente com 0/0; cadeia completa + B1/B2/C recalculados; glossário v0.4.0 com as 2 entradas (carimbo `aprovado-z` cite este parecer). Cumprido isso, **esta pendência deixa de obstar a flag** — a publicação segue como decisão da Direção pelo checklist.

— Z (z.ai), auditor independente
