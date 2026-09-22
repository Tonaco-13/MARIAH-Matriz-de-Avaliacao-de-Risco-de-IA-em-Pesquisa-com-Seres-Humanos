# RELATÓRIO DE CONFORMIDADE Z — infraestrutura i18n (feat/i18n-architecture)

**Data:** 2026-09-22 · **Auditor:** Z (z.ai), independente · **Template:** 7 seções fixas do A1 (`PARECER_Z_i18n_2026-09-19.md` §1)
**Objeto:** item 10 do DoD (`MEMORANDO_execucao_i18n_infra_2026-09-20.md` §4) — relatório de conformidade da branch de infraestrutura.
**Submissão auditada:** `NOTA_submissao_Z_i18n_2026-09-22.md` + `PACOTE_auditoria_Z_i18n_2026-09-21.md`, com chancela prévia da arquitetura (`VERIFICACAO_arquitetura_pacote-Z_2026-09-22.md`, LOG #13/#16) — que não substitui nem constrange este veredito.
**Método:** reprodução integral e independente da cadeia do §7 do pacote pelo próprio auditor (não leitura de evidências): inspeção estática, npm ci, build, todos os gates, runtime duplo, headers e teste negativo do guarda.

---

## 1. Metadados

| Campo | Valor |
|---|---|
| Locale auditado | pt-BR (único preenchido; es/en/de/fr/zh são rótulos de rota, gated) |
| Branch | feat/i18n-architecture |
| HEAD substantivo | `68fa106` (alias parity:locale) |
| Housekeeping acima do HEAD | `12134ad`, `0b9e685`, `b54953b` — auditado por diff: apenas `_guia_decisao/` (4 arquivos, 317 inserções), zero efeito sobre código, gates ou evidências |
| Trilha substantiva | `git log main..feat/i18n-architecture` → 18 commits substantivos (`f3b35bd`…`d7e10d5`) + 1 alias + 3 housekeeping — contagem conferida |
| matrixVersion (spec) | 2.2.0 (bump de schema; conteúdo numérico inalterado) |
| version (package.json) | 2.2.0 |
| sha256 spec/mariah-spec.json | `4e03e7a7c8a13aae6043914faf6c79e988ee4d597dd631ffaf9484769459ca10` — conferido byte a byte |
| sha256 messages/pt-BR.json | `5da13d9cd9551ad56055af12066731058987a5fb685410e5b040eb3cc323bc4b` — conferido byte a byte |
| sha256 scripts/i18n-no-literal.ts | `f22977f033fbc445d58b24b6e2040d7fd0b659deeeffc536267df27c5609d97c` — conferido byte a byte |
| Baseline NDTI | `gate/baseline-ndti/` (4 rotas) — um único commit (`d7e10d5`): imutável |
| Ferramental do auditor | Node v20.20.2 · npm 10.8.2 · Next.js 16.2.4 (Turbopack) · tsx · python3 · curl |
| Robustez de ambiente | cadeia reproduzida em verde em Node 20 (Z) · 22 (Engenharia) · 24.15.0 (Arquitetura) |

## 2. Escopo

**Invariante da branch:** infraestrutura de localidades com zero tradução. Critério de sucesso: nada visível muda em pt-BR. Confirmado por construção (nenhum locale ≠ pt-BR preenchido; 0 campos i18n na spec) e por runtime (identidade DOM flag-off vs baseline).

**Dentro do escopo:** as 4 rotas pt-BR (`/`, `/instrucoes`, `/transparencia`, `/validacao`) nos regimes flag off/on; wiring next-intl (`src/i18n/routing.ts`, `src/proxy.ts`, `src/app/[locale]/layout.tsx`); contrato da spec 2.2.0 (campo canônico + i18n opcional + `label()`); `messages/pt-BR.json` como fonte única do pt-BR; guarda `i18n-no-literal`; baseline NDTI e `parity-locale.py`; remoção do jspdf; `MAINTENANCE.md`; CHANGELOG.

**Fora do escopo (declarado):** conteúdo traduzido — os bloqueantes B3/B4/B5/B8 não têm superfície nesta branch; glossário-es (aprovado em ato próprio, `RESPOSTA_Z_glossario-es_2026-09-20.md`); merge em main (vedado sem autorização da Direção — memorando §5); P2 (untracked `consentimento-re-consentimento.patch`, `public/inaep-logo.png`, `upload/*.docx`, `spec/i18n/` — disposição pendente Operador + Z, sem efeito sobre a infra).

## 3. Verificações automatizadas (todas re-executadas pelo auditor — Node 20)

| Check | Resultado | Evidência |
|---|---|---|
| Matemática/estrutura da matriz (verify) | **105/105** | rodado pelo Z |
| Paridade spec × gabarito v46 (parity) | **128 / 0 divergências** | rodado pelo Z |
| Vetores gate A+B (gate-run) | **64/64** | rodado pelo Z |
| `label()` no-op (i18n-identity) | **344/344** (pt-BR e es → canônico) | rodado pelo Z |
| Zero-literal JSX — Check A | **OK** (31 `.tsx`, parser TS) | rodado pelo Z |
| Golden-rule campos i18n — B1 | **OK** (0 valores) | rodado pelo Z |
| Golden-rule messages — B2 | **OK** (335 valores; 8 âncoras de id real, informativo) | rodado pelo Z |
| Identidade pt-BR flag-off vs baseline NDTI (parity:locale) | **4/4 OK** | rodado pelo Z |
| Runtime flag OFF | `/`,`/instrucoes` 200; `/es` 307→`/`; `/es/instrucoes` 307→`/instrucoes`; `/zh/validacao` 307→`/validacao` | build duplo do Z |
| Runtime flag ON | todas as rotas 200 | build duplo do Z |
| `lang` por rota (flag ON) | `<html lang="pt-BR">` · `lang="es"` · `lang="zh"` (`layout.tsx:53` `lang={locale}`) | runtime do Z |
| Headers de localidade | nenhum Link/hreflang, content-language ou cookie de locale — flag OFF e ON | curl do Z |
| Dentes do guarda (teste negativo) | **6/6** violações acusadas, exit 1; pós-restauro verde exit 0, hashes intactos | § abaixo |

**Prova de dentes do guarda (§6 do pacote, reproduzida pelo Z):** injetadas em cópia de trabalho descartável (com restauro garantido e verificação de hash) as mesmas classes do pacote: [A] atributo title com literal pt-BR; [A] text-node JSX com literal pt-BR; [B1] número de corte da matriz (208) em campo i18n; [B1] id de questão (P6.b.2) em campo i18n; [B2] número de corte/teto (127) em texto de UI; [B2] matrixVersion (2.2.0) em texto de UI. O guarda acusou todas (exit 1) e voltou ao verde após restauro (exit 0), com os três sha256 inalterados e a árvore rastreada limpa.

**Checks estáticos do auditor:** `verify-math.ts` tem exatamente uma linha alterada vs main (expectativa `MATRIX_VERSION` 2.1.0→2.2.0), no commit único do bump (`3c4e9c2`) — atômica, matemática intacta; `package.json` sem jspdf e com o alias `parity:locale`; spec com 0 campos i18n e matrixVersion 2.2.0; `messages/` contém apenas `pt-BR.json`; `routing.ts` com `localePrefix: "as-needed"`, `localeDetection`/`localeCookie`/`alternateLinks: false`; persistência client-side única e keyed por id (`maria-assessment-state-v2`, `page.tsx:148`); CHANGELOG `[2.2.0]` e `MAINTENANCE.md` com seção i18n presentes.

## 4. Retroversão e amostragem (protocolo A2)

**Camada 0 — invariantes (automática, 100%):** executada por completo. Números, ids, chaves, matrixVersion e saída numérica dos vetores comparados contra a spec (verify 105, gate 64, identity 344); identidade DOM pt-BR flag-off vs baseline NDTI imutável (parity:locale 4/4). É o cerne desta branch e está verde.

**Camadas 1–4 — N/A por construção.** Zero strings traduzidas existem: não há o que ancorar por glossário, retroverter ou testar por consequência. Aplicam-se integralmente a partir de `feat/i18n-es` (Claude traduz, Z retroverte).

**Nota:** o identity 344/344 testa pt-BR e es → canônico, provando que o caminho `label(node, locale)` é inócuo enquanto es não existir — exatamente o contrato do campo-canônico aprovado no ciclo de pareceres.

## 5. Achados (B/G/M — `PARECER_Z_i18n_2026-09-19.md` §4)

**Classe B (bloqueante): 0 achados.** B1 — sem divergência numérica/de id (verify/parity/gate/identity verdes; DOM idêntico à baseline). B2 — `messages/pt-BR.json` fonte única, build verde (chave ausente lança), sem órfãs (nenhum outro locale existe); a paridade de chaves entre locales só ganha superfície com um segundo locale (condição §6). B6 — paridade flag-off 4/4 sobre baseline imutável. B7 — guarda golden-rule verde; persistência keyed por id inalterada; o próprio guarda deriva tokens e ids da spec (não fixa números próprios). B9 — `lang` correto por rota, redirects corretos com flag off, nenhum hreflang/cookie/content-language vazando (headers verificados nos dois regimes). B3/B4/B5/B8 — sem superfície (zero tradução).

**Classe G (grave): 0 achados. Classe M (menor): 0 achados** (não há texto traduzido, logo não há fluência a avaliar).

**Registros para o histórico (não são achados de código):**

- A divergência factual "19→18 commits" do pacote original foi corrigida antes da submissão (`0b9e685`, LOG #16) — o Z re-conferiu: zero ocorrências residuais, contagem 18 exata.
- As 8 âncoras de id real em narrativa dos messages são permitidas por desenho (o guarda distingue ids reais da spec de números de corte/teto) — comportamento documentado, informativo.
- `verify-math.ts` duplica a expectativa de `MATRIX_VERSION` da spec — dívida estrutural registrada (sugestão A1 do próprio Z: derivação de fonte única) para ciclo futuro; não bloqueante, mudança é atômica ao bump.
- Limitação CJK (E3) declarada conforme a correção factual §0.3 do parecer: dispositivo sem fonte CJK renderiza tofu no PDF via `window.print()` — indecidível client-side, não é bug.
- Cadeia verde em Node 20/22/24 — robustez de ambiente documentada em três execuções independentes.

## 6. Veredito

# **APROVA**

**Sem ressalvas.** Nenhum achado B, G ou M. Os 10 itens do DoD estão cumpridos — os 9 executáveis reproduzidos independentemente por este auditor (além das reproduções da engenharia e da arquitetura), e o item 10 se cumpre com este relatório. **DoD 10/10.**

**Condições vinculantes para as branches de idioma** (exigíveis a partir de `feat/i18n-es`; nada a executar nesta branch):

1. **B2 pleno desde o primeiro commit de conteúdo:** paridade de chaves entre locales como check de CI na `feat/i18n-es` (sem superfície aqui por construção — só pt-BR existe).
2. **Glossário-es versionado antes da tradução:** `spec/i18n/` (hoje untracked, P2) deve estar commitado na branch de idioma antes do primeiro commit de conteúdo es, com o glossario-es v0.2.0 aprovado (64/64).
3. **Relatórios por locale no path do A1:** `spec/i18n/relatorios/conformidade-<locale>-v<n>.md`, append-only, 7 seções — este relatório da infra fica em `_guia_decisao/` como artefato formal do ciclo (convenção da casa); os de idioma seguem o path da norma A1 quando o versionamento de `spec/i18n/` for decidido (P2).
4. **Camadas 1–4 do protocolo A2** executam por completo na primeira branch de idioma (retroversão independente incluída).

**Pós-veredito (memorando §5):** a branch aprovada torna-se base das branches de idioma (`feat/i18n-es` desbloqueada). Merge em `main` permanece vedado sem autorização expressa da Direção — a vitrine serve `main`.

## 7. Assinatura

**Z (z.ai)** — auditor independente · 2026-09-22, sessão própria, reprodução integral no ambiente do operador (Node v20.20.2).

**Artefatos auditados (sha256):**

```
4e03e7a7c8a13aae6043914faf6c79e988ee4d597dd631ffaf9484769459ca10  spec/mariah-spec.json
5da13d9cd9551ad56055af12066731058987a5fb685410e5b040eb3cc323bc4b  messages/pt-BR.json
f22977f033fbc445d58b24b6e2040d7fd0b659deeeffc536267df27c5609d97c  scripts/i18n-no-literal.ts
HEAD substantivo: 68fa106 (housekeeping docs-only acima: 12134ad, 0b9e685, b54953b). Baseline NDTI: d7e10d5 (imutável).
```

---

*Texto do relatório emitido pelo Z em sessão própria, transcrito pelo Operador e formatado para `_guia_decisao/` pela arquitetura (sem alteração de conteúdo). Registrado no canal como LOG #17; fechamento do item 10 como LOG #18.*
