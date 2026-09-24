# DOSSIÊ DE DECISÃO — §4.2: nomes institucionais no espanhol + diretriz "tudo INAEP/SINEP"

**Data:** 2026-09-24 · **Autor:** Kimi (arquitetura) · **Para:** Direção (Fabiano) · **Ref.:** LOG #28, #40; QUADRO §4.2/RET
**Base verificada:** HEAD `08492c8` (feat/i18n-es) — ocorrências levantadas por varredura direta nesta data, não por memória.
**Errata:** parecer do Z (2026-09-24, LOG #46) verificou o dossiê como factualmente sólido e registrou 3 correções de números/caminhos — ver **§7 Errata**. Nenhuma altera a decisão.

---

## 1. Estado da questão

A leva institucional do espanhol — `footer.*`, `home.*`, `pages.*` (instruções/transparência/validação) e `results.validacaoDesc` — está **RETIDA** desde o Lote 3: são **162 das 335 chaves** de `messages/pt-BR.json` sem contraparte em `messages/es.json`. Estas chaves citam INAEP, SINEP, Ministério da Saúde e o título oficial do Guia — nomes que **não constam** do glossário-es v0.2.0 (aprovado-z). A posição da arquitetura, mantida desde o #28: são entradas novas `status: proposto` a subir ao Z, não decisão ad hoc da Engenharia.

Esta decisão destrava: a leva institucional → o lote final com `i18n:key-parity:strict` → a auditoria de conformidade do Z → a decisão de publicação.

## 2. Diretriz da Direção (2026-09-24)

> "Isso ⟨regime CEP/CONEP⟩ não pode aparecer na MARIAH. Tudo agora é INAEP/SINEP."

A diretriz reage à formulação da arquitetura no #40 ("manter as siglas INAEP/SINEP sem tradução, mesmo regime de CEP/CONEP"). A analogia foi infeliz: invocar CEP/CONEP como paradigma de identidade é anacrônico — a identidade institucional vigente do instrumento é INAEP/SINEP. Registrada e incorporada.

## 3. Mapa de ocorrências (verificado em 2026-09-24)

### 3.1 O que o glossário-es v0.2.0 já cobre (aprovado-z, intocado por este dossiê)

| Entrada | Forma es aprovada | Observação |
|---|---|---|
| CEP (Comitê de Ética em Pesquisa) | **CEP (Comité de Ética en Pesquisa)** | Ajuste expresso do Z: nunca "CEI"; forma extensa conserva "Pesquisa" |
| CONEP | **CONEP** (sigla não se traduz) | Variante descritiva: "Comissão Nacional de Ética em Pesquisa (CONEP, Brasil)" |
| Ministério da Saúde | **Ministerio de Salud de Brasil** | Par confirmado no #40 (t62) |
| MARIAH | **MARIAH** | Nome próprio, não se traduz |
| Âncora MARIA_NAO_SUBSTITUI | "…no sustituye el juicio del **CEP**…" | Byte-protegida pelo Check C do gate |

### 3.2 Onde INAEP/SINEP aparecem no produto (alvos do §4.2)

| Local | Chave | Conteúdo |
|---|---|---|
| Rodapé do app | `footer.developedBy` | "…Sistema Nacional de Ética em Pesquisa com Seres Humanos (**SINEP**)" |
| Relatório/export | `report.footerDev` | idem (**SINEP**) — já traduzida no Lote 5, mas com a forma extensa **mantida em português** dentro da frase es, à espera desta decisão |
| Página Validação Local | `pages.validacao.s5p1` | "…Secretaria Executiva da **INAEP**" (única ocorrência de INAEP em toda a UI) |
| Resultados | `results.validacaoDesc` | título do Guia: "*Guia de Uso Ético da Inteligência Artificial em Pesquisa com Seres Humanos*" + "Grupo de Trabalho do Ministério da Saúde" |
| Transparência | `pages.transparencia.statusAviso` | título do Guia + "Grupo de Trabalho do Ministério da Saúde" |

### 3.3 Onde CEP/CONEP aparecem (corpo normativo — não é §4.2)

- **`spec/mariah-spec.json` (canônico):** `CEP` ×24 (perguntas, dicas, requisitos — ex.: "CEP acreditado" no req-IV-4); `CONEP`, `INAEP`, `SINEP`: **zero**.
- **`messages/pt-BR.json`:** `CEP` em ~20 chaves (home, contextForm, results, transparência, validação, relatório) — o CEP é **o público e o ente deliberador** do instrumento ("apoio ao pesquisador e ao Comitê de Ética em Pesquisa", "não substitui o juízo do CEP", "Validação Local pelos CEPs").
- **`CONEP` em toda a UI: exatamente 1 ocorrência** — `contextForm.cepPlaceholder`: `"Ex: CEP/CONEP"`.

### 3.4 O fato normativo (Caderno Referencial, base auditada)

O próprio corpo documental do instrumento registra: o **SINEP**, instituído pela Lei n.º 14.874/2024, "é a evolução do Sistema CEP/Conep, ao qual sucede" — ou seja, o **sistema** mudou de nome, mas os **CEPs (comitês)** continuam existindo como entes legais dentro do SINEP. O canônico pt-BR da MARIAH já reflete isso: identidade/autoria em INAEP/SINEP; "CEP" apenas como o colegiado deliberador, nunca como nome do sistema.

## 4. A distinção que precisa de confirmação — dois escopos possíveis da diretriz

**Leitura A — identidade institucional (recomendação da arquitetura).** A diretriz rege a **autoria e a marca** do instrumento: INAEP/SINEP são a identidade vigente, aparecem sem tradução de sigla, e nenhum texto enquadra o sistema como "CEP/CONEP". Nesse escopo, "CEP" **permanece** no corpo normativo (é o ente legal a quem a MARIAH serve — removê-lo esvaziaria a cláusula de não-substituição e 24 campos da spec) e segue no espanhol na forma já aprovada pelo Z. **Nada muda no pt-BR.** O §4.2 se resolve com 3 entradas novas de glossário (minutas no §5) e o ciclo es destrava.

**Leitura B — erradicação literal de "CEP/CONEP" da UI.** Se a diretriz é que nenhuma menção a CEP/CONEP pode existir na MARIAH, isso **não é i18n**: é mudança de conteúdo normativo no canônico pt-BR (~44 campos entre spec e messages, incluindo a âncora auditada de não-substituição). Exigiria ciclo próprio — fundamentação legal, fichas de alteração, Z, regeneração da baseline NDTI — e colidiria com o fato normativo do §3.4 (os CEPs existem em lei). A arquitetura recomenda **não** tratar isso dentro do ciclo es.

**Ressalva cirúrgica (comum às duas leituras):** o placeholder `contextForm.cepPlaceholder` = `"Ex: CEP/CONEP"` é o único resíduo do nome antigo do sistema na UI e, à luz da Lei 14.874/2024, está **desatualizado** (a dupla CEP/CONEP não é mais o exemplo correto de "nome do CEP"). Corrigi-lo é mudança de 1 string pt-BR — pequena, mas **reabre a baseline NDTI congelada** (parity-locale compara DOM byte a byte) e portanto tem custo de auditoria. Opções: (i) corrigir agora e regenerar a baseline com ciência do Z; (ii) filar para o primeiro ciclo de conteúdo pt-BR pós-espanhol. A arquitetura recomenda (ii), salvo objeção da Direção.

## 5. Minutas das entradas de glossário (status: `proposto` → Z)

Redigidas por analogia à forma aprovada pelo Z para CEP ("Comité de Ética **en Pesquisa**" — conserva o lexema português, nunca "CEI"). Se a Direção preferir formas plenas em espanhol ("Investigación"), as minutas são ajustadas antes de subir.

```json
{ "termoPtBr": "INAEP (Instância Nacional de Ética em Pesquisa)",
  "termoLocale": "INAEP (Instancia Nacional de Ética en Pesquisa)",
  "variantes": ["Instancia Nacional de Ética en Pesquisa (INAEP, Brasil)"],
  "consequenciaOperacional": "Instância nacional vinculada ao Ministério da Saúde, autora do Guia e da MARIAH; identidade institucional do instrumento. Sigla não se traduz.",
  "status": "proposto" }
```
```json
{ "termoPtBr": "SINEP (Sistema Nacional de Ética em Pesquisa com Seres Humanos)",
  "termoLocale": "SINEP (Sistema Nacional de Ética en Pesquisa con Seres Humanos)",
  "variantes": ["Sistema Nacional de Ética en Pesquisa con Seres Humanos (SINEP, Brasil)"],
  "consequenciaOperacional": "Sistema brasileiro de ética em pesquisa instituído pela Lei n.º 14.874/2024, sucessor do Sistema CEP/CONEP; nome do sistema na identidade do instrumento (rodapés, relatório). Sigla não se traduz.",
  "status": "proposto" }
```
```json
{ "termoPtBr": "Guia de Uso Ético da Inteligência Artificial em Pesquisa com Seres Humanos (título oficial)",
  "termoLocale": "Guía de Uso Ético de la Inteligencia Artificial en Pesquisa con Seres Humanos",
  "variantes": [],
  "consequenciaOperacional": "Título oficial do documento-mãe; citado em results.validacaoDesc e pages.transparencia.statusAviso. Identidade do instrumento — a forma es é ato da Direção.",
  "status": "proposto" }
```

**Nota de reconciliação:** `report.footerDev` em es.json hoje traz a forma extensa do SINEP em português dentro da frase espanhola; ao aprovar-se a entrada SINEP, essa string é ajustada à forma aprovada (micro-commit dentro da leva institucional).

## 6. Perguntas objetivas à Direção

1. **Confirma a Leitura A** (diretriz rege a identidade institucional; "CEP" permanece no corpo normativo como ente legal, na forma es já aprovada pelo Z)?
2. **Aprova as 3 minutas do §5** para subirem ao Z como `proposto` — ou ajusta alguma forma extensa (em especial: conservar "Pesquisa" por analogia ao CEP, ou preferir "Investigación")?
3. **O placeholder `"Ex: CEP/CONEP"`**: filar para o próximo ciclo pt-BR (recomendado) ou corrigir agora com regeneração da baseline NDTI?

Com o (1) e (2) respondidos, a Engenharia executa a leva institucional (162 chaves) no mesmo regime dos lotes anteriores e o ciclo segue para o `--strict` e a auditoria do Z.

---

## 7. Errata registrada — parecer do Z (2026-09-24, LOG #46)

O Z refez todas as verificações por varredura direta sobre `d7ac963` (≡ `08492c8` para `messages/` e `spec/`): **veredito "factualmente sólido no que decide; os números load-bearing conferem"**. Correções de registro aceitas pela arquitetura — nenhuma muda a decisão:

1. **Denominador das chaves:** pt-BR tem **420 folhas** hoje (335 era o total pré-Lote 5: +78 do namespace `report`, +7 posteriores). A fração correta é **162/420**; composição exata das retidas: footer 8 + home 45 + pages 108 + results.validacaoDesc 1; es tem 0 chaves extras. (Corrige §1.)
2. **Ocorrências de CEP em messages:** **29 chaves / 34 ocorrências** (não "~20"); o custo da Leitura B é **~53 campos**, maior que o estimado — reforça a recomendação contra a Leitura B. (Corrige §3.3 e §4.)
3. **Caminho e escopo do título do Guia:** a chave de transparência é `pages.statusAviso` (`pt-BR.json:350`), não `pages.transparencia.statusAviso`; o título do Guia aparece em **10 chaves pt** (não 2), todas dentro da leva retida — a minuta da entrada "Guia" passa a citar o escopo real de 10 chaves. (Corrige §3.2 e §5.)

**Acréscimos do Z registrados:**
- O es já espelha o placeholder (`"Ej.: CEP/CONEP"`) — omitido no §3.3; o fix futuro do placeholder deve tocar pt e es **no mesmo commit**, além da regeneração da baseline NDTI.
- `report.footerDev` es está mais misturada que o descrito: a forma extensa do SINEP está inteira em pt, incluindo preposições — a reconciliação na leva institucional se confirma como micro-commit.
- Nota de auditoria: WIP do Lote 6 não commitado exige gate antes do commit (já flagado à Engenharia/Operador); `public/inaep-logo.png` não rastreado é presumível insumo da leva (pendência P2).

**Posições do Z sobre as 3 perguntas (caráter de pré-revisão; a decisão formal é da Direção):**
- **P1 — endossa a Leitura A sem ressalva:** a âncora byte-protegida nomeia o CEP como ente deliberador, a spec o tem como público em 24 pontos, o Caderno registra o SINEP como sucessor do sistema (comitês permanecem), e o ajuste de glossário do próprio Z já rejeitou des-naturalizar o CEP.
- **P2 — pré-revisão favorável às minutas:** formas seguem os precedentes fixados (conservar "Pesquisa"/"Ética", nunca "Investigación"; preposições es; "(…, Brasil)" análogo ao B8); assimetria com CONEP justificada (CONEP não aparece expandido na UI es; SINEP aparece). Aprovaria no mesmo teor, com a correção de escopo da entrada Guia (10 chaves).
- **P3 — concorda com filar o placeholder**, na forma do acréscimo acima (pt+es no mesmo commit + baseline).

---

*Documento de governança; nenhuma linha de código ou de conteúdo canônico foi alterada na sua produção.*
