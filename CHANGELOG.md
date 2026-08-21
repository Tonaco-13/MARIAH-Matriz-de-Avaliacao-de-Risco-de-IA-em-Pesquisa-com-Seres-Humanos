# CHANGELOG — MARIAH

Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos.
Registro de alterações da matriz (spec) e do aplicativo. As mudanças de conteúdo
normativo espelham o Guia de Uso Ético da IA em Pesquisa com Seres Humanos e são
ratificadas pelo GT/INAEP; a paridade 1:1 guia × app é verificada no gate tripartite.

---

## [2.0.0-draft] — matriz v2 (guia v46) — 2026-08

Origem: decisões da coordenação INAEP aprovadas pelo GT; fichas de alteração v0.3
(Kimi, lado guia); recalibração cenário A. Gerada de forma reprodutível por
`scripts/build-spec-v2.ts` a partir da baseline v1 + `spec/fichas/fichas-alteracao-mariah-v2.json`.

Estado: **preliminar (draft)**, em preview. Publicação coordenada com o guia v46
(meta 14/09), condicionada ao gate verde e à auditoria independente (Z Code, Fase B).

### Recalibração da escala (cenário A)

| Recorte     | Teto v1 | Teto v2 | Cortes v2 (I·II·III) | Nível IV a partir de |
|-------------|:------:|:------:|:--------------------:|:--------------------:|
| Base        | 238    | **275** | 58 · 127 · 208       | 209 |
| Com banco   | 267    | **304** | 64 · 141 · 230       | 231 |

Cortes derivados das frações fixas do baseline (50/238, 110/238, 180/238) com
arredondamento de meia-unidade para cima. Nota de domínio: teto **avaliável** com
banco = **297** (o teórico 304 só ocorre junto com a P6.b.2 eliminatória, que torna
o protocolo não avaliável). Fatia ética (Blocos 5+6) subiu para **50,5 %**.

### Novas perguntas

Versão A (eixos): Eixo 2 → **2.11, 2.12**; Eixo 3 → **3.9, 3.10, 3.11, 3.12, 3.13**;
Eixo 3.b → **3.b.4.1, 3.b.6, 3.b.7**.
Versão B (blocos): Bloco 5 → **P5.10, P5.11**; Bloco 6 → **P6.9–P6.13**;
Bloco 6.b → **P6.b.4.1, P6.b.6, P6.b.7**; Bloco 7 → **P7.11–P7.14** (subbloco 7C).

### Novos mecanismos

- **Subbloco 7C — evidências de transparência** (P7.11–P7.14): efeito *evidência*,
  regime **só-abate** (presente subtrai; ausente = 0; nunca soma). Não infla o teto.
- **Diligências (devolução / "não avaliável")** no Eixo 3.b / Bloco 6.b: itens não
  pontuáveis que, quando aplicáveis e não atendidos, tornam o protocolo não avaliável
  no mérito (devolução), sem compensação por pontuação.
- **Exibição condicional** de perguntas de matriz (F-17/F-18): 3.b.4.1/P6.b.4.1 e
  3.b.7/P6.b.6 só aparecem quando há pedido de dispensa de TCLE (3.b.4/P6.b.4 ≠ "não
  se aplica") e, no caso do teste de necessidade, quando há acesso a dados
  identificáveis (âncora nas descritivas C.3/C.5). Pergunta oculta não pontua, não
  dispara devolução e não consta como pendência.

### Redação alterada (sem impacto em pontuação — classe m1)

- **1.2 / P2.2** — adaptabilidade abrange também o aprendizado após o encerramento
  do estudo (forma canônica com travessão).
- **3.1 / P6.1** — inclui "saúde mental" e "dados de localização".
- **3.b.5 / P6.b.5** — estende a exigência a compartilhamentos que não configurem
  controladoria conjunta.
- **req-IV-4** (MI6) — de "instância superior do CEP" para "CEP acreditado / com
  habilitação específica em IA".
- **3.b.4 / P6.b.4** — nova opção "Não se aplica — não há pedido de dispensa de TCLE"
  (F-18a): N/A-padrão de item pontuável (0 pontos, efeito risco); serve de gatilho
  para a exibição condicional acima.

### Descritivas (Passo 1 — contexto)

Acrescentadas **C.3–C.8** (com tipos de entrada: seleção/número/radio). A **C.5** é
condicional à **C.3** (oculta se os dados são anonimizados). Equivalência com o guia:
o app mantém `contexto1`/`contexto2` como ids internos, correspondentes 1:1 a **C.1**
e **C.2** do guia, sem reinterpretação.

### Correções e rastreabilidade

- **M3** — no export de validação, protocolo "não avaliável" passa a sair como
  `NÃO AVALIÁVEL` (antes era codificado como `IV`, mascarando a devolução).
- **Carimbo de versão da matriz** (`versaoMatriz`) nos exports JSON, TXT e PDF;
  `schemaVersion` do export de validação → 2.
- **Chave de estado versionada** (`maria-assessment-state-v2`): estado da v1 **não é
  migrado** (matriz incompatível) e chaves obsoletas são limpas.

### Mapa de identificadores (V18 — old → new)

| Elemento                     | v1 (data.ts)                         | v2 (spec)                                             | Observação |
|------------------------------|--------------------------------------|------------------------------------------------------|-----------|
| Descritiva — pergunta        | `contexto1`                          | `contexto1` (≙ guia **C.1**)                          | 1:1, sem reinterpretação |
| Descritiva — autonomia       | `contexto2`                          | `contexto2` (≙ guia **C.2**)                          | 1:1, sem reinterpretação |
| Descritivas novas            | —                                    | `C.3`–`C.8`                                           | acrescentadas |
| Itens Versão A               | `1.1`–`5.8`; `3.b.1`–`3.b.6`         | idem **+** `2.11`,`2.12`,`3.9`–`3.13`,`3.b.4.1`,`3.b.7` | antigos preservados |
| Itens Versão B               | `P1.1`–`P7.10`                       | idem **+** `P5.10`,`P5.11`,`P6.9`–`P6.13`,`P6.b.4.1`,`P6.b.6`,`P6.b.7`,`P7.11`–`P7.14` | antigos preservados |
| Avaliações em andamento      | `localStorage: maria-assessment-state` | `maria-assessment-state-v2`                         | v1 não recalculada sob v2 |
| Relatórios exportados        | sem carimbo                          | com `versaoMatriz`                                     | export v1 preserva a classificação original |

Nenhum item antigo foi removido nem teve seu identificador alterado; toda mudança de
resultado decorre da recalibração e dos novos itens, não de reinterpretação dos existentes.

### Paridade de enunciados spec × guia (B2/M1 — auditoria Z Code, Fase B)

Os enunciados da spec passam a ser **overlay verbatim dos quadros do guia v46**
(`gate/enunciados-guia-v46.json`, extraído por `scripts/extract-enunciados-guia.py`),
garantindo paridade 1:1. Correções relevantes: substituição do meta-texto de ficha das
diligências (3.b.4.1/3.b.7/3.b.6 e equivalentes B) pelos enunciados do guia; alinhamento
**substantivo** de 3.b.4/P6.b.4 (dispensa de TCLE) à redação do guia — "hipótese cabível
segundo a origem do banco" (art. 20 §5.º para banco externo; art. 25, quatro situações,
para banco no âmbito da pesquisa), em vez de "cinco situações do Art. 20" (também na dica
e no requisito `req-738-III-1`); "pesquisador"/"pesquisador habilitado" (1.5/5.1/P4.3/P7.3),
"raça" (4.1/P5.5) e demais ajustes m1. A checagem `parity-check` entra na CI (M1).

### Verificação

- `npm run verify` (verify-math): **98/98**.
- `npm run parity` (enunciados spec × guia v46): **0 divergências** (paridade 1:1).
- `npm run gate` (camada 2) — 31 vetores da Versão B + 33 linhas do V17 pelas funções
  reais do app × planilha do Kimi: **64/64, Δ = 0**.
- CI (`gates`) roda os três a cada PR/push em `spec/**`, `gate/**` e nos scripts.

---

## [1.0.0-guia-v45] — baseline

Matriz congelada correspondente ao guia v45 (R7). Extraída para `spec/mariah-spec.json`
na Fase 0.5 (extração no-op verificada). Escala base 238 / com banco 267.
