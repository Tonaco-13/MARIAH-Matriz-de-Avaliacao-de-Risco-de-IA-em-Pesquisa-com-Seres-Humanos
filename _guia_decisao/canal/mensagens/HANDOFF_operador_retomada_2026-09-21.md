# HANDOFF ao operador → Claude (Engenharia) — retomada pós-pausa de tokens

**#H2 · 2026-09-21 · Kimi → Operador (colar para o Claude) · [handoff]**
**Contexto:** pausa por tokens durante o passo 4c (contrato-spec). Verificação estática da arquitetura feita durante a pausa: `../../VERIFICACAO_arquitetura_infra_2026-09-21.md` — **construção saudável, nenhum desvio**; 2 pendências novas (P6, P7) e 1 confirmação (P4).

---

## Mensagem para colar ao Claude

> Engenharia: bem-vindo de volta. Durante a pausa, a Arquitetura fez verificação estática completa da branch (`_guia_decisao/VERIFICACAO_arquitetura_infra_2026-09-21.md`, canal LOG #5). Veredito: **construção saudável, nenhum desvio** — routing/proxy/baseline/parity conforme, diffs de extração limpos, 4c seguindo o modelo campo-canônico. Antes de continuar o 4c, três pontos:
>
> 1. **P4 (confirmação):** o `scripts/inventory-strings.ts` entrou no commit 4a? Se sim, aponte o commit e a saída commitada; se não, ele entra agora junto ao 4c (condição 1 do LOG #4 — é a âncora B2 para o Z).
> 2. **P7 (atomicidade — obrigatório):** o `verify` está 104/105 porque `scripts/verify-math.ts` espera o literal `"2.1.0"` e a spec em trabalho já está em `2.2.0`. O commit 4c deve **atualizar essa expectativa no mesmo diff** do bump — gate vermelho entre commits não é aceitável (a auditoria do Z precisa reproduzir cada commit verde). Avaliação opcional bem-vinda: fazer o verify ler a versão de fonte única em vez de literal.
> 3. **P6 (escopo resgatado):** os dois `toLocaleDateString('pt-BR')` fixos (`utils.ts:650` e `:868`) passam ao locale ativo — memorando item 2.6. Como tocam `utils.ts`, podem entrar no 4c ou em commit próprio logo após; não podem ficar para depois da auditoria.
>
> Depois disso, seguir a ordem do QUADRO: fechar 4c (commit isolado) → passo 6 (`MAINTENANCE.md`, condição 3.3) → passo 7 (remover `jspdf` + CHANGELOG) → passo 8 (build standalone flag off/on, pt-BR idêntico nas duas) → pacote de auditoria do Z. E, por favor: **QUADRO + `aviso` no LOG ao fim de cada bloco** (regra do canal — o quadro ficou 7 commits para trás).
>
> Confirme recebimento com um `aviso` no `LOG.md` (#6) e retome.

## Bloco 1 — verificações de retomada (operador roda antes de colar a próxima tarefa)

```bash
cd /Users/fabianotonacoborges/Dev/MARIA
git log --oneline -3
ls scripts/inventory-strings.ts 2>/dev/null && grep -l "inventory" scripts/*.ts 2>/dev/null
git status --short | grep -v _guia_decisao
```

**Esperado:** o 3º comando lista apenas `scripts/build-spec-v2.ts`, `spec/mariah-spec.json`, `src/components/maria/data.ts` (o 4c em trabalho) — mais nada fora de `_guia_decisao/`. Se houver outro arquivo, reportar ao canal antes de prosseguir.

## Bloco 2 — após o commit 4c (quando a Engenharia mandar)

```bash
cd /Users/fabianotonacoborges/Dev/MARIA
npm run verify && npm run parity && npm run gate
```

**Esperado:** verify **105/105** (P7 resolvido no mesmo commit), parity 128/0, gate verde. Colar as 3 saídas no canal — é o sinal verde para os passos 6–8.

## Lembretes ao operador

- P1 continua aberta: `_guia_decisao/` untracked — quando a Engenharia pedir um commit de governança (ou no próximo ponto natural), rodar o Bloco 1 do handoff #3 (`mensagens/HANDOFF_operador_2026-09-20.md`).
- Se o Claude propor qualquer mudança fora destes blocos (ex.: reestruturar rotas, tocar pt-BR renderizado, adicionar dependência), **não executar** — colar a proposta no canal para decisão da arquitetura (regra do memorando, item 0: dúvida de âncora, para e pergunta).
