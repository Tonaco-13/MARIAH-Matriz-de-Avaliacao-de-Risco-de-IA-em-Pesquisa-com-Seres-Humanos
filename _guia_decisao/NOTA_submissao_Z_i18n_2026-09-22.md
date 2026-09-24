# NOTA DE SUBMISSÃO AO Z — auditoria da infra i18n (feat/i18n-architecture)

**Data:** 2026-09-22 · **De:** Direção (Fabiano), com chancela da Arquitetura (Kimi) · **Para:** Z (auditor independente)
**Objeto:** relatório de conformidade da infraestrutura i18n — **item 10 do DoD** (memorando §4), único pendente. Template: 7 seções do A1. Veredito esperado pelo processo: "aprova" ou ressalvas classificadas (B/G/M).

---

## 1. O que está sendo submetido

| Item | Valor |
|---|---|
| Documento principal | `PACOTE_auditoria_Z_i18n_2026-09-21.md` (dossiê de evidências, 9 seções) |
| Branch | `feat/i18n-architecture` |
| HEAD substantivo | `68fa106` (alias `parity:locale`); housekeeping acima (`12134ad` pacote, `0b9e685` correção formal) — docs-only, sem efeito sobre código, gates ou evidências |
| Trilha substantiva | 18 commits (`git log main..feat/i18n-architecture`, §7 do pacote) |
| sha256 `spec/mariah-spec.json` | `4e03e7a7c8a13aae6043914faf6c79e988ee4d597dd631ffaf9484769459ca10` |
| sha256 `messages/pt-BR.json` | `5da13d9cd9551ad56055af12066731058987a5fb685410e5b040eb3cc323bc4b` |
| sha256 `scripts/i18n-no-literal.ts` | `f22977f033fbc445d58b24b6e2040d7fd0b659deeeffc536267df27c5609d97c` |
| Natureza da branch | **Infraestrutura com ZERO tradução** — critério de sucesso: nada visível muda em pt-BR. Bloqueantes com superfície: **B2, B6, B7, B9** (mapa no §3 do pacote) |

## 2. Chancela da arquitetura (rito do LOG #12.3)

O pacote passou pela arquitetura antes desta submissão, com **verificação independente** (rebuild + re-execução completa, não apenas leitura de evidências):

- `verify` **105/105** · `parity` **128/0** · `gate` **64/64** + identity **344/344** + no-literal (A/B1/B2) OK · `parity-locale` **4/4**
- Build duplo runtime reproduzido: flag OFF → gated `307`→pt-BR; flag ON → gated `200`; `lang` correto por rota
- Hashes conferem byte a byte; baseline NDTI imutável (único commit `d7e10d5`); diff do `verify-math.ts` = apenas a linha `MATRIX_VERSION`, atômica no bump `3c4e9c2`

Registro completo: `VERIFICACAO_arquitetura_pacote-Z_2026-09-22.md` · veredito: **aprovado para envio** (LOG #13, #16). O Z audita com autonomia plena — a chancela da arquitetura não substitui nem constrange o veredito independente.

## 3. Cadeia reproduzível

Ver §7 do pacote. Resumo: `npm ci && npm run build && npm run verify && npm run parity && npm run gate && npm run parity:locale` + build duplo runtime (flag off/on). O comando `npm run parity:locale` nomeado no DoD existe literalmente desde `68fa106`.

## 4. Ressalvas declaradas (transparência — §8 do pacote)

1. **P2** — disposição de `consentimento-re-consentimento.patch` e `public/inaep-logo.png`: pendência Operador + Z, fora da superfície i18n.
2. **B2 pleno** (paridade de chaves entre locales) — sem superfície nesta branch (só pt-BR); entra como check de CI na `feat/i18n-es`.
3. **Fontes CJK (E3)** — limitação declarada: dispositivo sem fonte CJK renderiza tofu no PDF via `window.print()`; indecidível client-side, não é bug.
4. **`verify-math.ts`** — sugestão estrutural do Z (A1) de derivar versão de fonte única registrada para ciclo futuro; não bloqueia.

## 5. Pós-veredito (política de merge — memorando §5)

Com o veredito "aprova", a branch torna-se base das branches de idioma (`feat/i18n-es` etc.). **Merge em `main` permanece vedado** sem autorização expressa da Direção (a vitrine serve `main`).

---

*Submetido pela Direção. Dúvidas de reprodução: cadeia do §7 do pacote; dúvidas de processo: canal triplo (LOG).*
