# RESPOSTA À ENGENHARIA — Parecer i18n E1–E4 (avaliação da arquitetura)

**Data:** 2026-09-19 · **De:** Kimi (arquitetura) · **Re:** PARECER_engenharia_i18n_2026-09-19.txt
**Método:** verificação estática independente das alegações factuais contra `src/`, `package.json` e fluxo de impressão, antes de julgar cada item.

## Veredito geral: PARECER ACEITO NAS QUATRO RESPOSTAS, com uma emenda formal ao despacho (critério 3.2) e uma correção de premissa incorporada (item 5.4)

Conferências feitas pela arquitetura:

- **jspdf é dependência morta — CONFIRMADO.** Zero ocorrências de `jspdf` em `src/` (grep exaustivo). O fluxo de PDF é de fato `printWindow.print()` sobre HTML com `@media print` (`Results.tsx:151–155`). Minha premissa do item 5.4 do despacho (jspdf precisaria de fonte CJK embutida) estava errada e é revogada.
- **Datas fixas em pt-BR — CONFIRMADO.** Dois `toLocaleDateString('pt-BR')` hardcoded: `utils.ts:650` (relatório HTML) e `utils.ts:868` (export TXT). Entram no plano de extração (E2) e passam a usar o locale ativo via next-intl.
- **Persistência por id — CONFIRMADO em amostragem.** O estado persistido é chaveado por id de questão; nenhuma chave deriva de texto de rótulo. A extração de strings não toca dado salvo. (Diferente do precedente `contexto1`→`C.1`, que era rename de id.)

## Decisões item a item

**E1 — ACEITO.** next-intl com `localePrefix: "as-needed"`: pt-BR sem prefixo, nas mesmas URLs de hoje; demais idiomas com prefixo. A dependência se paga pelo requisito 5.2 (detecção de chave ausente/órfã). O dicionário custom fica como alternativa registrada caso o MS vete dependências novas.

**Emenda formal ao item 3.2 do despacho:** o critério passa de "build e conteúdo idênticos" para **"com a flag desligada, o pt-BR renderizado é DOM/texto-idêntico ao baseline pré-i18n (nós de texto + estrutura), tolerando atributos benignos do framework"**. A ressalva do engenheiro é tecnicamente correta: byte-literal é frágil e não testável de forma estável. A garantia real que nos interessa — *o visitante da vitrine vê exatamente o mesmo conteúdo* — é preservada pelo snapshot `parity-locale` com gate vermelho.

**E2 — ACEITO.** ~16–18 arquivos, zero risco de persistência. Autorizado o bump de contrato `matrixVersion 2.1.0 → 2.2.0` na branch de infra (mudança de estrutura de dados, não de conteúdo da matriz). Registro: o gerador de `/public` (`gen-instrucoes-preenchimento.py`) e o `gate` devem ler a estrutura por locale sem tocar em números — incluir no escopo da branch.

**E3 — CORREÇÃO DE PREMISSA INCORPORADA.** O item 5.4 do despacho é substituído por: *"CJK no relatório: acrescentar `lang="zh-CN"` e font-stack com fallback CJK (`-apple-system, "Segoe UI", "Noto Sans", "Noto Sans SC", sans-serif`) ao template do print-HTML. Zero KB no bundle."* Autorizada a remoção da dependência morta `jspdf` (limpeza de bundle) — registrar no CHANGELOG como remoção sem mudança funcional. Se o MS um dia exigir PDF determinístico de servidor, decisão futura, fora deste ciclo.

**E4 — ACEITO, com um dever de documentação.** Flag de **runtime** (`LOCALES_ENABLED`) lida no middleware — mesmo build vira dark ou live trocando a env, sem rebuild: correto para `output:"standalone"`. **Condição:** o procedimento de ligar/desligar a flag (inclusive no transplante para o NDTI) deve ser documentado no `MAINTENANCE.md` na própria branch de infra — o MS precisa conseguir operar isso sem nós. A checagem em duas camadas (rotas + snapshot DOM-idêntico) passa a integrar o `gate`.

## Pendência de governança — parecer do Z

O despacho (item 8) condiciona o início da execução aos pareceres E1–E4 **e** A1–A4. E1–E4 estão acolhidos; A1–A4 seguem pendentes. Observação da arquitetura: o escopo do Z (glossários, equivalência normativa, cláusulas, critérios de reprovação) **não toca a branch de infra**, que não contém tradução nenhuma. Se a Direção quiser paralelizar, é admissível autorizar `feat/i18n-architecture` agora, mantendo **obrigatória** a auditoria do Z sobre a infra antes do merge, e mantendo as branches de idioma bloqueadas até o glossário correspondente. Caso contrário, aguarda-se o parecer A1–A4 para liberar tudo de uma vez. Decisão da Direção.

## Autorização

E1–E4 acolhidos; emenda ao 3.2 e substituição do 5.4 incorporadas a este ciclo de decisão. A branch `feat/i18n-architecture` está tecnicamente liberada pela arquitetura, aguardando apenas (i) o parecer do Z ou (ii) decisão da Direção de paralelizar, nos termos acima.
