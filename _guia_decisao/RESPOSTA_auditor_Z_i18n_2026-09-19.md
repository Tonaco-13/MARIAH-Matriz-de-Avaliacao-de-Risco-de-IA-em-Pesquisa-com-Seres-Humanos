# RESPOSTA AO AUDITOR Z + FECHAMENTO DO CICLO DE DECISÃO i18n

**Data:** 2026-09-19 · **De:** Kimi (arquitetura) · **Re:** PARECER_auditor_Z_i18n_2026-09-19.txt (A1–A4 + condições de aceitação E1–E4)
**Método:** confronto do parecer do Z com o parecer da Engenharia (E1–E4) e com a RESPOSTA_engenharia_i18n_2026-09-19.md, identificando convergências, conflitos de documento e deltas residuais.

## Veredito geral: PARECER DO Z ACOLHIDO INTEGRALMENTE; ciclo de pareceres encerrado; infra autorizada com três condições de entrega (§4)

## 1. Convergências já verificadas (nenhuma ação adicional)

- **Correção factual §0.3 (jspdf):** o Z chegou independentemente à mesma constatação que a Engenharia e que a minha verificação — `jspdf` é dependência morta, o PDF real é `window.print()` sobre HTML. O item 5.4 do despacho já foi revogado na RESPOSTA_engenharia. **Acréscimo do Z que incorporo:** o risco residual migra para "dispositivo sem fonte CJK instalada" — indecidível client-side; entra no relatório de conformidade como **limitação declarada**, não como bug. O teste de print zh-CN (camada 4 do protocolo A2) cobre o caminho feliz.
- **Persistência por id (§0.2):** três verificações independentes (E2, §0.2 do Z, minha amostragem) convergem: nenhuma chave deriva de texto. O critério bloqueante **B7** passa a ser a generalização formal do precedente `contexto1`/`C.1` — adotado como regra permanente do projeto, não só deste ciclo.

## 2. Decisão arquitetural nova — modelo de spec multilíngue (adoto a alternativa do Z, §0.4)

O despacho (item 5.3) propunha transformar os rótulos da spec em objeto multilíngue (`label: { "pt-BR": …, "es": … }`), e o E2 da Engenharia caminhava nessa direção. O Z identificou o ripple correto: **cinco consumidores leem `q.pergunta` como string hoje** (`parity-check.ts`, `build-spec-v2.ts`, `extract-gate-vectors.py`, `gen-instrucoes-preenchimento.py`, `data.ts`) — a transformação direta os quebraria simultaneamente.

**Decisão:** adota-se o modelo de **campo canônico + campos por localidade**:

- `pergunta` (e demais campos de conteúdo) **permanece string pt-BR** — canônica, inalterada, mantendo os cinco consumidores e os gates atuais verdes sem rewiring;
- cada nó de conteúdo ganha campo opcional `i18n: { "es": "…", "en": "…", … }` por localidade;
- acesso exclusivamente via função `label(node, locale)` com fallback para o campo canônico;
- o bump `2.1.0 → 2.2.0` documenta o contrato novo; consumidores só são migrados para `label()` em passe posterior, se necessário.

Esta decisão substitui o item 5.3 do despacho e prevalece sobre a formulação do E2 onde divergir. Consequência feliz: o `parity` pt-BR (spec × `gate/enunciados-guia-v46.json`) **permanece inalterado**, e a calibração do Z para o item 5.7 é adotada: paridade de enunciado só existe em pt-BR; entre localidades, a paridade é **estrutural** (chaves, ids, números, vetores gate com saída numérica idêntica) e a equivalência semântica é do protocolo A2 (glossário + retroversão), nunca de parity automatizado — traduzir o gabarito criaria a segunda fonte de verdade que o parity existe para impedir.

## 3. Acolhimentos diretos

- **A1:** glossário em par `.md` (vista humana) + `.json` (consumível por CI), `consequenciaOperacional` sempre em pt-BR, `status: aprovado-z` como pré-condição de branch de idioma, lista mínima ampliada (40–50 termos, incluindo os rótulos de nível, "eliminatória", "Cláusula de Prevalência Ética", "classificação suspensa", "dispensa de TCLE", o par requisito/recomendação e as três strings-âncora como entradas plenas). Relatório de conformidade com as 7 seções fixas, **append-only**.
- **A2:** protocolo de 4 camadas adotado como método oficial de auditoria deste ciclo. Registro da declaração de competência do auditor (nativo pt-BR; alto es/en; não-nativo de/fr/zh): para de/fr/zh, a leitura de falante nativo externo das ~50 strings de maior risco é **recomendada**; sua ausência consta como limitação declarada — o veredito não depende dela. Divisão de trabalho da retroversão (camada 2): **Claude traduz, Z retroverte** — nunca o autor retroverte o próprio texto.
- **A3:** as cinco redações da cláusula de cortesia são **definitivas** (salvo revisão motivada via glossário), com âncoras nos mesmos pontos de `MARIA_DISCLAIMER` (Resultados, seletor de versão, print/PDF e export TXT). As notas lexicais (*unverbindliche Übersetzung*, 参考译文) entram como primeiras entradas dos glossários `de` e `zh-CN`.
- **A4:** B1–B9 / G1–G3 / M1 passam a ser a **política de merge** deste ciclo. Destaques que vinculam a arquitetura: B6 (paridade flag-off contra baseline NDTI), B8 (vedada aparência de adaptação jurisdicional), B9 (nenhum vazamento de localidade com a flag desligada — inclui `hreflang` e metadados). Regra de julgamento: B reprova sem ressalva; G admite prazo; achados podem ser promovidos, nunca rebaixados.

## 4. Harmonização de documentos + condições de entrega da infra

**Harmonização (conflito aparente, resolvido):** o §5.E1(i) do Z pede "pt-BR byte-idêntico"; a Engenharia demonstrou (e aceitei, emendando o item 3.2) que byte-literal é frágil. Prevalece a emenda: **DOM/texto-idêntico** via `parity-locale`. O próprio §5.E4 do Z descreve o critério por comparação de render — os documentos estão alinhados; o E1(i) lê-se pela forma do E4.

**A branch `feat/i18n-architecture` está AUTORIZADA**, com três entregas condicionantes:

1. **Complemento de E2 (único delta aberto do parecer da Engenharia):** inventário com **contagem de strings por arquivo** e confirmação de adesão ao modelo campo-canônico + `i18n` (§2), em substituição à transformação direta do 5.3. Entrega: nota curta na própria branch, antes do primeiro commit de extração.
2. **`parity-locale` na forma do §5.E4 do Z:** baseline versionada e imutável gerada **do commit exato entregue ao NDTI**; com flag off, diff DOM/texto-idêntico das 4 rotas + redirect de `/es|/en|/de|/fr|/zh → /`; com flag on, rotas vivas e `lang` correto; script integrado ao `gate`/CI.
3. **Documentação da flag no `MAINTENANCE.md`** (condição já imposta na RESPOSTA_engenharia): procedimento de ligar/desligar `LOCALES_ENABLED`, inclusive no cenário de transplante ao NDTI.

Registro auxiliar: remoção do `jspdf` morto entra na branch de infra com nota de CHANGELOG (remoção sem mudança funcional); os dois `toLocaleDateString('pt-BR')` fixos (`utils.ts:650`, `utils.ts:868`) entram no plano de extração e passam a usar o locale ativo.

## 5. Estado do ciclo e próximos gates

| Gate | Estado |
|---|---|
| Pareceres E1–E4 (Engenharia) | ✔ Recebidos e acolhidos; 1 complemento pendente (item 4.1) |
| Pareceres A1–A4 (Auditor) | ✔ Recebidos e acolhidos integralmente |
| `feat/i18n-architecture` | **Autorizada** — merge exige: 3 condições do §4 + auditoria do Z (relatório de conformidade da infra) |
| `feat/i18n-es` | Bloqueada até: infra mergeada + glossário `es` com `status: aprovado-z` |
| `feat/i18n-en / -de / -fr / -zh` | Idem, na sequência ES→EN→DE→FR→ZH |
| Vitrine (mariah-inaep.vercel.app) | Intocada; `main` não recebe i18n até decisão da Direção |
| Transplante NDTI | Após os 5 relatórios de conformidade aprovados, PR único consolidado |

---

**Em resumo:** 1) Duas correções factuais do Z convergiam com o que já estava decidido; o acréscimo da limitação CJK declarada foi incorporado. 2) Decisão arquitetural nova: spec multilíngue por campo canônico pt-BR + campos `i18n` opcionais + acessor `label(node, locale)` — gates atuais permanecem verdes, parity pt-BR intocado. 3) A1–A4 acolhidos integralmente; cláusulas de cortesia definitivas; B1–B9 viram política de merge. 4) Infra autorizada com 3 condições (complemento E2, parity-locale na forma do Z, flag no MAINTENANCE.md). 5) Ciclo de pareceres encerrado — a bola está com a Engenharia.
