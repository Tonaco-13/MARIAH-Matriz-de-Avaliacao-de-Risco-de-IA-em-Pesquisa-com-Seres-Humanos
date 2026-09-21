# DESPACHO — Arquitetura i18n da MARIAH (versões ES, EN, DE, FR, ZH)

**Data:** 2026-09-19 · **De:** Kimi (arquitetura) · **Para:** Engenharia (Claude Code 4.8) + Auditor independente (Z / z.ai)
**Escopo:** internacionalização da aplicação MARIAH. **Nada da matriz muda** — pesos, cortes, scores, ids e regras de cálculo permanecem os de `spec/mariah-spec.json` (matrixVersion 2.1.x). Este despacho cobre apenas como o mesmo instrumento passa a falar seis idiomas.
**Premissas de governança (Fabiano, 2026-09-19):** engenharia executada no git do Fabiano (não no repo NDTI); vitrine pública (https://mariah-inaep.vercel.app/) **intocada** até o Ministério da Saúde publicar por si; transplante para o NDTI/DECIT/SCTIE somente após validação completa. Pareceres do Engenheiro e do Auditor são pré-condição para qualquer execução (item 8).

---

## 1. Caminho decidido — UM app, múltiplas localidades (Caminho 1)

Roteamento por localidade `/[locale]/...` no App Router (Next 16), com `pt` como localidade-fonte e padrão. Mensagens extraídas para arquivos por idioma; o spec continua sendo a fonte única da matriz.

- **Caminho 2 (build-time por idioma, deploys separados):** descartado — cinco pipelines, risco de divergência de versão entre instâncias.
- **Caminho 3 (forks por idioma):** descartado — cinco códigos divergindo; o `gate` perderia sentido como selo único.

**Regra de ouro:** números, pesos, cortes (58/127/208; 64/141/230), somas de bloco (62/77), teto avaliável (297), ids de questão e `matrixVersion` **nunca se traduzem**. Apenas rótulos, descrições, instruções e textos narrativos entram nos arquivos de mensagens.

## 2. Localidades e sequência

| Ordem | Localidade | Observação |
|---|---|---|
| 0 | `pt-BR` | Fonte da verdade normativa; já entregue ao NDTI |
| 1 | `es` | Comunidade CEP hispanohablante mais próxima do Brasil |
| 2 | `en` | Língua franca científica |
| 3 | `de` | **Idioma de stress de layout** (expansão +30–40%, compostos longos); se o layout tolerar alemão, tolera todos |
| 4 | `fr` | Registro formal consistente |
| 5 | `zh-CN` | Último: exige fonte CJK embutida no PDF (item 5.4) |

Cada idioma entra numa branch própria (`feat/i18n-es`, `feat/i18n-en`, …) **após** o merge da infraestrutura (`feat/i18n-architecture`), e só com auditoria do Z aprovada.

## 3. Proteção da vitrine pública — dark-launch obrigatório

1. **Flag de localidades:** as rotas `/es`, `/en`, `/de`, `/fr`, `/zh` só existem para o visitante se a flag de ambiente (proposta: `NEXT_PUBLIC_LOCALES_ENABLED`) estiver ativa. Sem a flag, qualquer rota de localidade redireciona para `/` (pt-BR).
2. **Critério de aceite estrutural:** *com a flag desligada, o build de produção e o conteúdo pt-BR devem ser idênticos à versão entregue ao NDTI.* O script `parity` (ou um novo `parity-locale`) deve verificar isso automaticamente — diff de render/pt-BR contra baseline.
3. **Git:** todo o trabalho acontece no repo do Fabiano, em branches `feat/i18n-*`; `main` não recebe merge de i18n até decisão de publicação. A vitrine no Vercel continua servindo `main`.
4. **Homologação:** deploys de *preview* (Vercel preview por branch), nunca no domínio de produção.
5. **Transplante NDTI:** somente após os cinco idiomas auditados e aprovados pelo Z; na forma de PR único consolidado para o repo do MS, preservando histórico de decisão (este despacho + pareceres + relatórios de auditoria).

## 4. Estratégia normativa em três camadas

**a) Instrumento MARIAH — traduzido integralmente.** Fichas, dimensões, níveis, instruções, disclaimers e páginas (`instrucoes`, `transparencia`, `validacao`). Todo idioma exibe, nos mesmos pontos em que hoje aparece `MARIA_DISCLAIMER`, a cláusula adicional: *"Esta é uma tradução de cortesia. A versão normativa vigente é a portuguesa (pt-BR)."* (redação final por idioma a cargo do Z).

**b) Regulação brasileira — NÃO traduzimos textos legais.** Criamos um **Anexo Normativo por localidade** (uma página/rota por idioma, ex.: `/es/normativa`): explica o que é cada referência (Res. CNS 466/2012, Res. CNS 510/2016, LGPD, sistema CEP/CONEP, Guia INAEP), quem emite, e linka o original em português. Quando houver tradução **oficial** do instrumento internacional (Declaração de Helsinki — es/en/fr/de/zh; diretrizes CIOMS — es/en/fr/zh), linkamos a oficial. Resoluções CNS e LGPD: referência ao original pt-BR, com resumo descritivo no idioma.

**c) Documentos de apoio (`_guia_decisao`, Cadernos 1 e 2, notas técnicas) — fase 2.** Nesta fase, para cada idioma: **resumo executivo traduzido** (2–3 páginas) servindo de porta de entrada; originais pt-BR permanecem como anexos canônicos. Tradução normativa completa dos cadernos só se justifica se um organismo estrangeiro adotar a MARIAH formalmente — decisão futura, fora deste ciclo.

**Fora de escopo (vedado neste ciclo):** adaptação jurisdicional (GDPR/AI Act, Common Rule etc.). Isso seria outro produto ("MARIAH-EU") e quebraria a paridade com o spec validado pelo MS. A matriz traduzida avalia sob a ótica da regulação brasileira — é isso que o Anexo Normativo deixa explícito ao usuário estrangeiro.

## 5. Pontos técnicos vinculantes para a Engenharia

1. **Inventário de strings:** hoje o conteúdo mora em `src/components/maria/data.ts`, `src/components/maria/disclaimer.ts` (fonte única do aviso — manter o princípio "edita só aqui", agora por localidade), `src/components/maria/*.tsx` (rótulos de UI), `src/app/**/page.tsx` (instruções, transparência, validação) e `spec/mariah-spec.json` + `spec/fichas/`. Extração total antes da primeira tradução; **zero string pt-BR remanescente em JSX** após a infra (o Z audita com grep).
2. **Esquema de mensagens:** chaves estáveis namespacadas (ex.: `fichas.P6.b.4.label`, `results.disclaimer`, `ui.stepIndicator`), arquivos por localidade (`messages/pt-BR.json`, `messages/es.json`, …). Chaves novas só nascem em pt-BR e propagam como *missing key* — o CI/gate falha se alguma localidade tiver chave ausente ou órfã.
3. **Spec multilíngue:** `mariah-spec.json` passa a carregar rótulos por localidade nos nós de conteúdo (ex.: `label: { "pt-BR": "…", "es": "…", … }`), mantendo ids e valores numéricos intocados. Bump de contrato de dados (2.1.x → 2.2.0) na infra, sem mudança de conteúdo da matriz.
4. **PDF com CJK:** o export (jspdf) precisa embutir fonte com cobertura chinesa (proposta: Noto Sans SC subsetada aos glifos usados). Atenção ao tamanho do bundle; medir e reportar no parecer. Alternativa aceitável: geração do PDF zh via rota de servidor, se o subset client-side exceder ~1 MB.
5. **Layout tolerante:** fichas, `StepIndicator`, badges e tabelas de resultados devem absorver +40% de texto sem quebra (teste obrigatório com `de` mesmo antes do alemão entrar — pseudolocalização aceitável para o teste).
6. **HTML semântico:** `lang` por rota, `dir` preparado (nenhum idioma RTL neste ciclo, mas não bloquear), metadados/`hreflang` somente quando a flag for ligada.
7. **Paridade estendida:** `verify` (matemática) permanece inalterado — os números são os mesmos em todos os idiomas. `parity`/`gate` ganham checagem estrutural: mesmas chaves, mesmos ids, mesmos valores numéricos em todas as localidades; `gate/vetores-*.json` roda uma vez por localidade com resultado idêntico.

## 6. Glossário e equivalência normativa (atribuição do Z)

Antes de qualquer tradução entrar em branch, o Z fixa um **glossário por idioma** com os termos críticos, que vira artefato versionado (`spec/i18n/glossario-<locale>.md`). Lista mínima de termos a fixar: CEP/Ethikkommission/Comité de Ética…, TCLE, re-consentimento, salvaguardas, nível de risco (I–IV), diligência, triagem, matriz de risco, versão A/B, *dark launch* da cláusula de tradução não-oficial. Critério de auditoria: **equivalência semântica normativa** (o termo traduzido sustenta a mesma consequência operacional na matriz), não fluência literária.

## 7. Papéis e fluxo

| Papel | Quem | Responsabilidade neste ciclo |
|---|---|---|
| Arquiteto | Kimi | Este despacho, esquema de mensagens, critérios de aceite, desenho da paridade, respostas a dúvidas de âncora |
| Engenheiro | Claude Code 4.8 | Infra `[locale]`, extração de strings, flag dark-launch, fonte CJK, branches e commits **no repo do Fabiano** |
| Auditor | Z (z.ai) | Glossários, equivalência normativa, paridade spec↔UI por idioma, relatório de conformidade pré-merge |

Fluxo: `feat/i18n-architecture` (infra sem traduzir nada; pt-BR re-encaminhado pelos arquivos de mensagens) → gate + parity + aceite do item 3.2 → Z audita → merge. Depois, uma branch por idioma na sequência do item 2, cada uma com glossário aprovado antes e relatório do Z antes do merge. Kimi não commita.

## 8. Pareceres solicitados (pré-condição de execução)

**Ao Engenheiro (Claude Code 4.8):**
- E1. Biblioteca/estratégia de i18n para Next 16 App Router + `output: "standalone"` (next-intl, solução nativa ou custom): qual recomenda e por quê, considerando o requisito de pt-BR byte-idêntico com a flag desligada?
- E2. Plano de extração das strings do item 5.1 com estimativa de arquivos tocados; há persistência em produção chaveada por texto (cf. precedente `contexto1`/`C.1` no despacho de 2026-09-17) que a extração possa quebrar?
- E3. Viabilidade e custo (KB) da fonte CJK no PDF client-side vs. rota de servidor (item 5.4).
- E4. Desenho concreto da flag dark-launch (middleware vs. config de build) e da checagem "flag off ⇒ build idêntico ao entregue".

**Ao Auditor (Z / z.ai):**
- A1. Formato do glossário versionado e do relatório de conformidade por idioma.
- A2. Método de verificação de equivalência normativa nos idiomas que o auditor não domina nativamente (back-translation? amostragem de termos do glossário?) — propor o protocolo.
- A3. Redação da cláusula de tradução não-oficial nos cinco idiomas (item 4a).
- A4. Critério de reprovação: o que, numa tradução, bloqueia merge (erro em termo normativo? divergência de escopo de disclaimer? número alterado?).

---

**Em resumo:** 1) Caminho 1 decidido — um app, seis localidades, matriz intocada. 2) Sequência ES→EN→DE→FR→ZH; alemão stressa layout, chinês fecha por causa do PDF. 3) Vitrine protegida por dark-launch; engenharia no repo do Fabiano; NDTI só no transplante final. 4) Três camadas: instrumento traduzido com cláusula de não-oficialidade, regulação explicada em Anexo Normativo, cadernos em resumo executivo (fase 2). 5) Sete pontos técnicos vinculantes. 6) Glossário do Z antes de qualquer tradução. 7) Kimi não commita; Claude constrói; Z aprova cada merge. 8) **Execução só começa após os pareceres E1–E4 e A1–A4.**
