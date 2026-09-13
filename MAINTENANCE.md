# MARIAH — Manutenção: atualização e calibração da matriz

> Metodologia verificada em 13/09/2026 pelo Guia (Kimi) e pelo revisor independente (Z Code — OK após conferência ao vivo dos gates e do repositório). Público: Equipe NDTI (técnico) e Direção. Estado de referência: **v2.0.0**.

## 1. Princípio — fonte única e reprodutibilidade
- A matriz é um único arquivo canônico e versionado: **`spec/mariah-spec.json`**.
- `src/components/maria/data.ts` **importa** a spec; o guia renderiza o **mesmo** conteúdo ("fonte única, duas renderizações"). A paridade spec × guia é garantida por **checagem** (`parity`), não por confiança.
- A spec **nunca é editada à mão** — é **gerada** por `scripts/build-spec-v2.ts` a partir de: baseline v1 + fichas do guia (`spec/fichas/`) + enunciados verbatim (`gate/enunciados-guia-v46.json`, extraídos do DOCX por `scripts/extract-enunciados-guia.py`).

## 2. Como atualizar (fluxo de uma alteração)
1. **Guia** emite/atualiza a **ficha** em `spec/fichas/` (conteúdo normativo).
2. **Engenharia** regenera a spec: `npx tsx scripts/build-spec-v2.ts --apply`.
3. Rodar os **gates** (seção 4).
4. **Guia** confere a paridade e a planilha de vetores; **Z Code** audita o delta.
5. Aprovado → **publicar** (seção 5), com versão, tag e CHANGELOG.

**Classes de ficha (v0.4):** `efeito` ∈ {`risco`, `descritiva`, `evidencia`, `diligencia`} × `acao` ∈ {`incluir`, `alterar-redacao`, `alterar-opcoes`, `alterar`}.

**Regra de escopo (governança):**
- **Alteração de texto/critério sem impacto em pontuação → classe m1** (`alterar-redacao` / `alterar-dica`): sem novo id, sem recalibração (preserva tetos, cortes, paridade e vetores); registrada no CHANGELOG como "Redação alterada". Exemplo aplicado: pacote MHRA (fichas F-24 a F-28, aguardando GT).
- **Item pontuável novo** (`efeito: risco`, `acao: incluir`) eleva o `maxPontos` do bloco e **dispara recalibração**; por decisão (c) da Fase 1, só pode entrar nos **Blocos 5 ou 6**, com aceite pela tabela de pesos pública (Quadro S4.11). Evidências (7C) são só-abate e diligências valem 0 — nenhuma mexe no teto.

> **Limitação do gerador atual:** `build-spec-v2.ts` é **one-shot** — aborta se a spec já está em v2 e referencia as fichas v2 fixas. Uma próxima versão (v3) **exige nova ficha + extensão do gerador**; não é um caminho genérico pronto. Para regenerar a v2 do zero, parte-se da baseline v1 (`git show <commit_v1>:spec/mariah-spec.json`).

## 3. Calibração e recalibração
- Cada item tem um **peso** (`pontos`) na ficha. **Teto** = soma dos pesos por versão.
- **Cortes** = frações fixas do baseline 238 — **I = 50/238, II = 110/238, III = 180/238** — aplicadas ao **teto teórico** vigente, com **arredondamento de meia-unidade para cima** (`Math.round`, `build-spec-v2.ts`).
- v2.0: base **275 → 58 / 127 / 208** (Nível IV ≥ 209); com banco (Res. 738) teto teórico **304 → 64 / 141 / 230**.
- Os cortes derivam **sempre do teto teórico**. O **teto avaliável (297 = 304 − 7** da eliminatória P6.b.2**)** é **nota de domínio** (`notasDominio.tetoAvaliavelComBanco`), não a base dos cortes.
- Baseline v1 (git, commit `bfefd0b`): 238 → 50/110/180; com banco 267 → 56/123/202.

## 4. Testes e gates
| Comando | Garante | Estado v2.0 |
|---|---|---|
| `npm run verify` | Estrutura, contagens, tetos, cortes, efeitos (7C só-abate, diligências, eliminatórias, Prevalência, condicionais) | 98/98 |
| `npm run parity` | Paridade 1:1 dos **enunciados** (128) app × quadros do guia | 0 divergências |
| `npm run gate` | 31 vetores da Versão B + 33 do V17 pelas **funções reais** do app × planilha de pontuação paralela | 64/64 · Δ=0 |
| `npm run build` | Compilação do app | OK |

- **CI** (workflow `gates`): roda **`verify` + `parity` + `gate`** (os três) em push/PR, **com filtro de caminhos** — só dispara em `spec/**`, `gate/**`, os scripts e `data.ts`/`utils.ts`. Gate vermelho **bloqueia** o merge.
- O **`build` NÃO é job da CI** — é validado no **preview** (Vercel) e manualmente antes do publish.
- **Escopo da paridade (m8):** a `parity` cobre **enunciados**. Dicas, notas de verificação e textos de `requirements` são **camada app-side (paráfrase deliberada)** — não são verbatim e exigem sincronia manual **guia × spec × `data.ts`**.

## 5. Governança tripartite e publicação
- **Três frentes:** Guia (redação/fichas/planilha) · Engenharia (implementação/gates/publicação) · Revisor independente (auditoria do delta + re-sonda da produção + termo).
- **Gate tripartite:** nenhuma frente publica sozinha (o próprio cabeçalho da CI diz "NÃO substituem o gate tripartite"); divergência → gate; desbloqueio só por **waiver do GT** (ver `parity-check.ts`); impasse → GT.
- **Publicação:** ramo isolado → PR → **preview** (Vercel) → gates verdes + termo do revisor no PR → **merge no `main`** (dispara produção) → **tag** semver (`vX.Y.Z`).
- **Nunca commitar direto no `main`.** Reversão **não destrutiva** disponível (revert/checkout de árvore, sem `--force`) — precedente: rollback B1 (commit `84496ba`).

## 6. Versionamento e rastreabilidade
- **`matrixVersion`** na spec + carimbo **`versaoMatriz`** em todos os exports: JSON (`utils.ts`), TXT e relatório imprimível/PDF.
- **CHANGELOG** com o **mapa de ids (antigo → novo) — V18**: entrega da engenharia (Fase 5); descreve o **estado-alvo** e é atualizado a cada publicação.
- **Chave de estado do navegador versionada** (`maria-assessment-state-v2`), com limpeza de chaves obsoletas e **não-migração** da v1 (`page.tsx`).
- **DOCX do guia fora do repo** (`.gitignore`): o artefato versionado é `gate/enunciados-guia-v46.json`, **regenerável** por `scripts/extract-enunciados-guia.py` sempre que o DOCX mudar (ex.: F9/índices).

---
*Ressalva: a MARIAH não aprova nem reprova protocolos e não substitui a deliberação do CEP; permanece em caráter preliminar, com validação empírica prospectiva (Apêndice F do Guia).*
