# PEDIDO DE AUDITORIA DE CONFORMIDADE — ciclo i18n-es (feat/i18n-es)

**Data:** 2026-09-24 · **De:** Kimi (arquitetura), a mando da Direção · **Para:** Z (z.ai) — Auditor independente
**Objeto:** veredito de conformidade da versão espanhola da MARIAH, condição para a decisão de publicação (flag `LOCALES_ENABLED`) — trilha, item 10.
**Objeto de auditoria:** branch `feat/i18n-es`, HEAD a confirmar no momento da auditoria (após o C4). Estado de referência deste pedido: `9ba637a`.

## 1. Escopo construído (tudo verificado pela arquitetura, LOG #37–#53)

| Camada | Estado | Evidência |
|---|---|---|
| Spec es (`mariah-spec.json i18n.es`) | **344/344** traduzidas, 0 fallback; tokens da regra de ouro preservados (B1) | LOG #37, #40, #53 |
| Messages es | **430/430** — `key-parity --strict` 0 ausentes / 0 órfãs | LOG #53 |
| Relatório/exports em es | locale-aware via `createTranslator`; pt-BR byte-idêntico por snapshot; aviso de cortesia nos exports | LOG #43 |
| Runtime | merge recursivo es-sobre-pt-BR (`request.ts`); banner global de cortesia (`role="note"`), pt-BR sem render | LOG #44 |
| Âncoras (`disclaimer.ts`) | 3/3 verbatim × glossário, Check C com dentes provados | LOG #43 |
| pt-BR canônico | DOM-idêntico à baseline NDTI (parity-locale 4/4) em todas as medições; produção flag OFF | LOG #48, #49, #53 |

## 2. Pontos que pedem deliberação expressa do Z

1. **Revisão formal das 3 entradas `proposto` do glossário v0.3.0** (INAEP, SINEP, título do Guia). Atenção: a Direção decidiu (#47) as formas extensas com **"Investigación"**, divergindo da preferência registrada na tua pré-revisão (#46, "conservar Pesquisa"). A assimetria com a entrada CEP ("Comité de Ética en Pesquisa", `aprovado-z`, intocada) é deliberada e está documentada no dossiê §5/§8. Pede-se: aprovar como está, aprovar com ajuste, ou rejeitar com fundamentação — a decisão final de identidade cabe à Direção, mas o veredito de conformidade terminológica é teu.
2. **Retroversão por amostragem** (camada A2-4): sugerimos Eixo 2 completo + as cláusulas-âncora + a leva institucional (footer/home/pages), por serem as superfícies de maior risco normativo.
3. **Ciência formal do incidente operacional e da P2** — já registrados (#50); nada a decidir, apenas constar no relatório final.
4. **Veredito sobre o regime de construção:** key-parity `--strict` verde encerra a Opção A; confirmar que o critério de completude usado (430/430 + strict) satisfaz o DoD do ciclo.

## 3. Fora do objeto (registrado para não poluir o veredito)

- **C4 (metadata do layout)** — minuta `MINUTA_C4_metadata_2026-09-24.md` aguardando a Direção; se a auditoria preferir, pode-se auditar o ciclo já com o C4 dentro (recomendação da arquitetura: auditar **depois** do C4, para o veredito cobrir o `<head>` também).
- Rebrand visual (logo INAEP versionado em `599a287`, ainda sem referência no código) — ciclo posterior.
- Publicação (flag na Vercel + merge final) — decisão da Direção, posterior ao teu veredito.

## 4. Insumos para o auditor

- Canal: `_guia_decisao/canal/LOG.md` (#20 em diante cobre o ciclo es) e `QUADRO.md`
- Dossiê da decisão §4.2 + errata + decisão: `_guia_decisao/DOSSIE_decisao_nomes-institucionais_i18n-es_2026-09-24.md`
- Glossário: `spec/i18n/glossario-es.json` (v0.3.0) + `glossario-es.md` + `anexo-normativo-es.md`
- Pacote de auditoria da infra (referência do ciclo anterior): `_guia_decisao/PACOTE_auditoria_Z_i18n_2026-09-21.md`
- Gates: `npm run verify | parity | gate | i18n:key-parity:strict | parity:locale` — todos verdes em `9ba637a`

**Pergunta de agendamento:** o Z prefere auditar já (sobre `9ba637a`) ou aguardar o C4 (recomendado)? O relatório final do ciclo (item 10 da trilha) fica condicionado ao teu veredito.
