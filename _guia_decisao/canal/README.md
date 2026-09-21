# CANAL TRIPLO — Engenharia (Claude) · Auditor (Z) · Arquitetura (Kimi)

**Criado:** 2026-09-20 · **Por:** Kimi (arquitetura), a pedido da Direção (Fabiano)
**Propósito:** comunicação contínua e leve entre os três papéis **entre** os artefatos formais. O canal não substitui despachos, pareceres, notas e aceites — ele os referencia, aponta pendências e registra o dia a dia.

## Estrutura

| Arquivo | O que é | Quem escreve |
|---|---|---|
| `README.md` | Este protocolo. Só muda por decisão da Direção ou consenso dos três | Arquitetura propõe, Direção sanciona |
| `QUADRO.md` | Status vivo do ciclo: fase atual, bloqueios, pendência por papel, próximo artefato esperado | Quem muda o estado atualiza na mesma entrega |
| `LOG.md` | Fluxo de mensagens **append-only** (cronológico, mais recente **no topo**) | Qualquer um dos três |
| `mensagens/` | Mensagens longas ou que precisam de thread própria (uma por arquivo) | Qualquer um dos três |

## Regras

1. **Nada se apaga.** LOG é append-only; correção é mensagem nova citando a anterior (`corrige #N`). O QUADRO é o único arquivo mutável — e reflete sempre o presente.
2. **Formato de mensagem no LOG:**
   ```
   ### #N · AAAA-MM-DD HH:MM · DE → PARA · [tipo]
   ```
   Tipos: `pergunta` · `resposta` · `aviso` · `bloqueio` · `decisão` · `handoff`.
   Toda `pergunta` e todo `bloqueio` exigem resposta endereçada; o QUADRO lista os abertos.
3. **Âncora normativa mora nos artefatos formais.** Decisão tomada no canal só vale quando incorporada ao artefato correspondente (despacho/parecer/aceite) — o LOG linka, não legisla. Dúvida de âncora: **para e pergunta** (regra do memorando, item 0).
4. **Kimi não commita; Z não commita.** O operador (Fabiano) executa git. Mensagem de `handoff` para o operador deve vir com bloco de comandos pronto.
5. **Numeração única no LOG** (`#N` sequencial, nunca reutilizada) — é assim que os artefatos formais citam o canal.
6. **Sigilo de escopo:** nada de números da matriz, chaves de gate ou texto normativo "decididos" no canal sem artefato. O canal coordena; quem decide é o ciclo formal.

## Ciclo de vida de uma pendência

`aberta` (entra no QUADRO) → `em trabalho` (alguém assume no LOG) → `entregue` (artefato linkado) → `fechada` (destinatário confirma no LOG). Bloqueio aberto = QUADRO vermelho = ninguém avança fase.
