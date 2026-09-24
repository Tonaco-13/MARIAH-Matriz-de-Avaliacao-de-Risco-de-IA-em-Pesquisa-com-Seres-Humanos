# MINUTA C4 — Metadata locale-aware do layout + saneamento CEP/CONEP no `<head>`

**Data:** 2026-09-24 · **De:** Kimi (arquitetura) · **Para:** Direção (aprovação da redação pt-BR) · **Ref.:** LOG #52 (nota 2 da Engenharia), #53 (pendência META); diretriz "tudo INAEP/SINEP" (#47)
**Bloqueio:** este lote deve pousar **antes** de ligar a flag de locales — hoje o `<head>` do `/es` vaza pt-BR.

## 1. Fato verificado (arquitetura, 2026-09-24)

`src/app/[locale]/layout.tsx` exporta `metadata` **estático, hardcoded em pt-BR**: `title`, `description` ("…Comitês de Ética em Pesquisa (CEP)."), `keywords` (inclui **"CONEP"** — segundo resíduo CEP/CONEP do produto, após o placeholder corrigido no C3) e `authors` ("Ministério da Saúde"). As páginas (`instrucoes`, `transparencia`, `validacao`) **já** têm `generateMetadata` locale-aware via messages (`metaTitle`/`metaDesc`, traduzidas no Lote 7) — só o layout raiz ficou de fora. TITLE/META-DESC integram a captura do parity-locale → **a mudança regenera a baseline NDTI**.

## 2. Proposta técnica (Engenharia executa após aprovação)

1. Novo namespace `meta` em `messages/pt-BR.json` e `messages/es.json` (4 chaves: `siteTitle`, `siteDesc`, `siteKeywords` — string única separada por vírgulas —, `siteAuthor`).
2. `layout.tsx`: `export const metadata` → `export async function generateMetadata({ params })` via `getTranslations({ locale, namespace: 'meta' })` (padrão idêntico ao das 3 páginas). Fallback pt-BR automático pelo merge do `request.ts`.
3. Keywords viram array por `split(',')` no código (evita markup/ICU em messages).
4. Baseline NDTI regenerada no mesmo commit; diff da baseline deve se limitar a TITLE/META-DESC da home.
5. Cadeia completa + `parity:locale` 4/4 sobre a baseline nova + smoke flag-on (`/es` com `<head>` em es).

## 3. Redação proposta — **aguarda aprovação da Direção**

### pt-BR (canônico — muda em relação a hoje)

| Campo | Hoje | Proposto |
|---|---|---|
| `siteTitle` | MARIAH — Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos | **inalterado** |
| `siteDesc` | Ferramenta de avaliação de risco para sistemas de IA em protocolos de pesquisa submetidos a Comitês de Ética em Pesquisa (CEP). | **Ferramenta de apoio à avaliação ética de pesquisas com inteligência artificial, desenvolvida pela Instância Nacional de Ética em Pesquisa (INAEP) para o Sistema Nacional de Ética em Pesquisa com Seres Humanos (SINEP).** |
| `siteKeywords` | MARIAH, risco em IA, inteligência artificial, ética em pesquisa, CEP, CONEP | **MARIAH, risco em IA, inteligência artificial, ética em pesquisa, CEP, SINEP, INAEP** (CONEP removido — diretriz #47) |
| `siteAuthor` | Ministério da Saúde | **Instância Nacional de Ética em Pesquisa (INAEP) — Ministério da Saúde** |

### es (novo — forma das entradas v0.3.0 `proposto`)

- `siteTitle`: MARIAH — Matriz de Avaliación de Riesgo de Inteligencia Artificial en Investigación con Seres Humanos
- `siteDesc`: Herramienta de apoyo a la evaluación ética de investigaciones con inteligencia artificial, desarrollada por la Instancia Nacional de Ética en Investigación (INAEP) para el Sistema Nacional de Ética en Investigación con Seres Humanos (SINEP).
- `siteKeywords`: MARIAH, riesgo en IA, inteligencia artificial, ética en investigación, CEP, SINEP, INAEP
- `siteAuthor`: Instancia Nacional de Ética en Investigación (INAEP) — Ministerio de Salud de Brasil

## 4. Observações de governança

- "CEP" **permanece** nas keywords e no corpo — é o ente legal (Leitura A, decisão #47); sai apenas "CONEP" (nome do sistema antigo).
- O `<head>` do `/es` carregará a identidade INAEP/SINEP nas formas `proposto` — se o Z ajustar alguma forma na auditoria, é micro-commit de string, sem tocar código.
- Commit único (C4), separado de qualquer outro trabalho; push pelo Operador.

## 5. Aprovação

- [ ] Direção aprova a redação pt-BR do §3 (ou edita e devolve)
- [ ] Direção autoriza a execução do C4 pela Engenharia
