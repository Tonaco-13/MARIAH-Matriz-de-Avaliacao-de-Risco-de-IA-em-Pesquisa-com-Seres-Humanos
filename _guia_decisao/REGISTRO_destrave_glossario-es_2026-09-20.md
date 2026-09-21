# REGISTRO — Destrave do glossário es e estado do ciclo i18n

**Data:** 2026-09-20 · **De:** Kimi (arquitetura) · **Re:** RESPOSTA_auditor_Z_glossario-es_2026-09-20.txt (veredito: glossário aprovado com ajustes, 64/64 `aprovado-z`)

## 1. Fato registrado

O Auditor Z concluiu a revisão do par `spec/i18n/glossario-es.json` + `.md`: **64/64 entradas `aprovado-z`, versão 0.2.0** (19 entradas com ajuste + 6 criadas pelo Z; nenhuma reprovada/removida). Os arquivos no repo já estão na versão revisada — verifiquei a integridade: 64 entradas, todas `aprovado-z`, changelog 0.2.0 presente, seis entradas novas confirmadas (Salvaguarda Decisória, Salvaguarda da Res. 738, Recomendação de Aprofundamento, Consolidação, Ministério da Saúde, tríade de escopo).

**Verificação independente da arquitetura:** antes de aceitar, conferi contra a spec e o código os quatro pontos factuais novos do veredito — todos confirmados:
- P4.1/P4.2 carregam de fato a "Salvaguarda Decisória (Cláusula de Prevalência Ética): responder 'Sim' força o protocolo ao Nível IV, sobrescrevendo a soma" — minha entrada original (v0.1.0) descrevia erradamente o conteúdo de MARIA_NAO_SUBSTITUI. O achado B-1 do Z era real e era o mais grave do lote.
- P7.1 usa a expansão inglesa "Software as a Medical Device" (G-1 confirmado).
- req-738-III-2 cita "Art. 3.º, XVI e §2.º do Art. 12" (G-4 confirmado).
- Results.tsx:368 ("Recomendação de Aprofundamento"), :469 ("Consolidação: o nível final é o mais alto entre todos os eixos") e :122 (modo A→B) existem como descritos (G-2 confirmado).

## 2. Ajuste propagado ao Anexo Normativo

Duas ocorrências de "Ministerio de Salud" sem qualificação em `spec/i18n/anexo-normativo-es.md` foram corrigidas para "Ministerio de Salud de Brasil", alinhando o anexo à regra anti-B8 que o Z aplicou ao glossário (entrada "Ministério da Saúde"). O anexo permanece **borrador pendente de auditoria** — entra na rodada de conformidade da `feat/i18n-es`.

## 3. Estado do ciclo (atualizado)

| Gate | Estado |
|---|---|
| Ciclo de pareceres (E1–E4, A1–A4) | ✔ Encerrado em 2026-09-19 |
| `feat/i18n-architecture` (Engenharia) | Em execução sob o MEMORANDO_execucao_i18n_infra_2026-09-20 |
| Glossário `es` | ✔ **APROVADO (0.2.0, 64/64)** — pré-condição de idioma satisfeita |
| Anexo Normativo `es` | Borrador 0.1.0 — aguarda auditoria junto com a branch `es` |
| `feat/i18n-es` | **DESTRAVADA condicionada**: abre quando a infra passar na auditoria de conformidade do Z |
| `feat/i18n-en/-de/-fr/-zh` | Bloqueadas (sequência + glossário próprio) |

## 4. O que a auditoria vigiará na `feat/i18n-es` (approved-list do Z — registrada aqui para a arquitetura cobrar)

1. Cadeia "nivel" única — sem "etapa/fase" (B3). 2. Contagem das **três** Salvaguardas por namespace. 3. "Primacía Ética" nos Resultados + "Salvaguarda Decisoria" nas fichas P4.1/P4.2. 4. **CEP (nunca CEI)** em todo o corpo, incl. exports TXT/print. 5. Nenhuma forma de "diligenciar" para preenchimento. 6. "Ministerio de Salud de Brasil" no disclaimer. 7. Tríade de escopo com os três verbos literais. 8. Tetos/cortes/ids inalterados (B1 — à prova de idioma).

## 5. Lição registrada para os próximos idiomas

O achado B-1 nasceu de um erro da arquitetura (eu): confundir o mecanismo da Cláusula com a cláusula de não-substituição — ambos "avisos vermelhos" nos Resultados. Para en/de/fr/zh, as entradas de glossário que descrevem **mecanismos** (não apenas termos) devem citar o id da questão e a linha de código **antes** de descrever a consequência — proveniência primeiro, prosa depois.
