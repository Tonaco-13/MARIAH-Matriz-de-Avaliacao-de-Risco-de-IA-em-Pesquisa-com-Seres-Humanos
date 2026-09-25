RELATÓRIO FINAL DO Z — Conformidade do ciclo i18n-es (feat/i18n-es)
VEREDITO: APROVADO. O espanhol da MARIAH está conforme em todas as camadas auditadas do ciclo; nenhum óbice de conformidade à publicação. Acender a flag LOCALES_ENABLED e o merge final são atos da Direção (trilha, item 11), livres por este veredito.

Data: 2026-09-24 · De: Z (z.ai) — Auditor independente · Re: pedido #54, condições #55 §6, aceite da arquitetura #58 · Base auditada: e9a9317 (docs-only; código 774c604), com recibos lidos commit a commit · Método: verificação por execução própria — nenhum número deste relatório é citado de aviso; tudo foi re-executado ou lido diretamente por mim nesta data.

1. As 5 condições do veredito (#55 §6) — todas confirmadas
Strict 434/434, 0/0 — re-executado: o namespace meta entrou no regime e o total recontado é exatamente o previsto (430+4 pt-BR, espelhado em es, zero ausências/órfãs).
Baseline NDTI — git show 774c604 no gate/baseline-ndti/index.txt: diff de 1 linha, só a META-DESC da home, TITLE inalterado; a nova redação é byte-a-byte a aprovada pela Direção (#56). parity:locale 4/4 sobre a baseline regenerada (flag off).
<head> do /es idêntico ao glossário — conferido em disco (jq) e ao vivo: siteTitle "…Matriz de Evaluación de Riesgo…" e siteDesc/siteAuthor com INAEP/SINEP/"Ministerio de Salud de Brasil" nas formas v0.3.0. Ratifico a ressalva: "Evaluación" (glossário, uso já consagrado no disclaimer aprovado) é a forma vigente; "Avaliación" era gralha da minuta — o engenheiro acertou ao seguir a fonte hierárquica, e a minuta permanece como documento histórico.
Smoke flag-on (build próprio, standalone, LOCALES_ENABLED=true): /es 200 com lang="es", head completo em es e banner role="note"; / 200 com lang="pt-BR", redação nova no head, title idêntico à baseline, sem banner, sem cortesia; keywords CEP, SINEP, INAEP — zero "CONEP" no DOM dos dois idiomas; /pt-BR → 307 → /.
Disciplina de commits — C4a 374ad04 toca só o glossário (carimbo aprovado-z nas 3 entradas, formas intactas, changelog citando #55; glossário agora 67/67 aprovado-z); C4b 774c604 commit único de exatamente 4 arquivos (layout.tsx, messages pt+es, baseline); e9a9317 docs-only.
2. Cadeia completa — números finais, re-executados por mim
build ✔ · verify 105/105 · parity 128/0 · gate vetores 64/64 · i18n-identity 344/344 traduzidas, 0 fallback · no-literal A (31 arquivos, zero literal) + B1 (344 campos, tokens preservados) + B2 (868 valores = 2×434, consistência interna exata) + C (âncoras 3/3 verbatim) ✔ · key-parity --strict 434/434, 0/0 · parity:locale 4/4. "CONEP": zero ocorrências em messages/ e src/ — o saneamento #47 está completo no produto.

3. Retroversão e deliberações — incorporadas por referência (#55 §7)
Executadas na audiência prévia e válidas como estão: Eixo 2 completo (12 questões, campo a campo), âncoras 3/3, amostra institucional de 9 chaves — verde, com achados menores registrados. As 4 chaves meta novas (únicas strings criadas desde então) retroverti agora: fiéis 1:1, nas formas aprovadas (o es de siteAuthor acrescenta "de Brasil" conforme a entrada aprovado-z — correto). Glossário v0.3.0: aprovação 3/3 mantida, carimbo conferido.

4. Mapa final do DoD do ciclo
Spec es 344/344 com tokens da regra de ouro preservados ✔ · messages es 434/434 no regime strict ✔ · relatório/exports locale-aware com pt-BR byte-idêntico (#43) ✔ · runtime es-sobre-pt-BR com banner que não renderiza em pt-BR (#44) ✔ · âncoras verbatim com guarda com dentes ✔ · placeholder C3 pt+es ✔ · metadata locale-aware C4 ✔ · pt-BR canônico DOM-idêntico à baseline NDTI em todas as medições ✔ · glossário-es 67/67 aprovado-z ✔ · incidente operacional e P2: ciência sem ressalva (#50) ✔. O DoD está integralmente satisfeito.

5. Achados não bloqueantes (registro, nenhum exige ação antes da publicação)
Keywords sem espaço após vírgula no HTML serializado (o Next junta o array com ",") — cosmético, fora da captura NDTI e do teor normativo.
Standalone local aninhado: o build gera o servidor em .next/standalone/Dev/MARIA/server.js (particularidade de tracing-root do Next 16), não no caminho plano que o script start do package.json aponta — nota operacional ao Operador para smoke/self-host local; sem efeito na Vercel.
.env do projeto carrega DATABASE_URL resíduo de scaffold (caminho /home/z/…, sem uso no app) — higiene, fora do objeto do ciclo.
Pendência ANX (Anexo Normativo es §1 ainda sob o paradigma CEP/CONEP, sem INAEP/SINEP) — já recomendada em #55; próximo ciclo de glossário.
6. Encaminhamento
À Direção: a publicação é decisão vossa — flag na Vercel, merge final e push dos commits locais (21, segundo o registro #58). Este veredito encerra o item 10 da trilha. Ao Operador: transcreva ao canal (#59) e versione como RELATORIO_Z_conformidade_i18n-es_2026-09-24.md.

— Z (z.ai), auditor independente