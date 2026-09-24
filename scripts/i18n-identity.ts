// ============================================================
// i18n-identity — prova de no-op do helper label() (feat/i18n-architecture, Passo 5)
// ------------------------------------------------------------
// Condição vinculante da Arquitetura (LOG #6): a propriedade "label() é no-op
// nesta branch" sai PROVADA, não afirmada. Para TODA a allowlist de conteúdo
// traduzível da matriz, verifica que:
//   label(node, campo, 'pt-BR') === canônico   (fonte pt-BR)
//   label(node, campo, 'es')    === canônico   (i18n ausente ⇒ fallback)
// Enquanto nenhum nó tiver `i18n`, ambas as chamadas devem devolver o texto
// canônico — idêntico ao acesso direto. Este script é a âncora auditável pelo Z
// no lugar da religação (que migra para feat/i18n-es).
//
// ALLOWLIST (344 entradas = 332 base + description×4 + motivoEliminatorio×8):
//   eixos:   nome, descricao
//   perguntas (qual/quant): pergunta, dica, motivoEliminatorio?, exibicaoCondicional.descricao?
//   blocos:  nome, descricao, subtitulo?
//   contexto: pergunta, dica
//   riskLevels: label, description
//   requisitos (base + Res738): texto
//   databaseFilterQuestion: pergunta, dica
//   EXCLUÍDOS: opcoes (vocabulário controlado), refEliminatoria/ids (códigos),
//              referenciaNormativa (ref. normativa), notasDominio.obs, números.
// Regra de ouro (B7): nenhum número, peso, corte, id ou matrixVersion aqui.
// ============================================================

import {
  QUALITATIVE_AXES,
  QUANTITATIVE_BLOCKS,
  CONTEXT_QUESTIONS,
  RISK_LEVELS,
  REQUIREMENTS,
  REQUIREMENTS_RES738,
  DATABASE_FILTER_QUESTION,
  label,
} from '../src/components/maria/data';

const EXPECTED_TOTAL = 344;
const LOCALES_TESTE = ['pt-BR', 'es'] as const;

let total = 0;
const failures: string[] = [];
const breakdown: Record<string, number> = {};

function check(node: unknown, field: string, ctx: string, cat: string) {
  const canonical = (node as Record<string, unknown>)[field];
  if (typeof canonical !== 'string') {
    failures.push(`${ctx}.${field}: canônico não é string (${typeof canonical})`);
    return;
  }
  for (const loc of LOCALES_TESTE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const got = label(node as any, field as any, loc);
    if (got !== canonical) {
      failures.push(`${ctx}.${field} [${loc}]: label()="${got}" ≠ canônico="${canonical}"`);
    }
  }
  total += 1;
  breakdown[cat] = (breakdown[cat] ?? 0) + 1;
}

for (const axis of QUALITATIVE_AXES) {
  check(axis, 'nome', axis.id, 'axis.nome');
  check(axis, 'descricao', axis.id, 'axis.descricao');
  for (const q of axis.questoes) {
    check(q, 'pergunta', q.id, 'qualQ.pergunta');
    check(q, 'dica', q.id, 'qualQ.dica');
    if (q.motivoEliminatorio !== undefined) check(q, 'motivoEliminatorio', q.id, 'qualQ.motivoEliminatorio');
    if (q.exibicaoCondicional?.descricao !== undefined) check(q.exibicaoCondicional, 'descricao', q.id, 'qualQ.exibicao.descricao');
  }
}

for (const block of QUANTITATIVE_BLOCKS) {
  check(block, 'nome', block.id, 'block.nome');
  check(block, 'descricao', block.id, 'block.descricao');
  if (block.subtitulo !== undefined) check(block, 'subtitulo', block.id, 'block.subtitulo');
  for (const q of block.questoes) {
    check(q, 'pergunta', q.id, 'quantQ.pergunta');
    check(q, 'dica', q.id, 'quantQ.dica');
    if (q.motivoEliminatorio !== undefined) check(q, 'motivoEliminatorio', q.id, 'quantQ.motivoEliminatorio');
    if (q.exibicaoCondicional?.descricao !== undefined) check(q.exibicaoCondicional, 'descricao', q.id, 'quantQ.exibicao.descricao');
  }
}

for (const q of CONTEXT_QUESTIONS) {
  check(q, 'pergunta', q.id, 'ctx.pergunta');
  check(q, 'dica', q.id, 'ctx.dica');
}

for (const [lvl, info] of Object.entries(RISK_LEVELS)) {
  check(info, 'label', `nivel-${lvl}`, 'risk.label');
  check(info, 'description', `nivel-${lvl}`, 'risk.description');
}

for (const r of REQUIREMENTS) check(r, 'texto', r.id, 'req.texto');
for (const r of REQUIREMENTS_RES738) check(r, 'texto', r.id, 'req738.texto');

check(DATABASE_FILTER_QUESTION, 'pergunta', 'databaseFilterQuestion', 'dbf.pergunta');
check(DATABASE_FILTER_QUESTION, 'dica', 'databaseFilterQuestion', 'dbf.dica');

console.log('=== i18n identity — no-op de label() sobre a allowlist ===');
for (const [cat, n] of Object.entries(breakdown)) console.log(`  ${cat}: ${n}`);
console.log(`  TOTAL de entradas verificadas: ${total} (esperado ${EXPECTED_TOTAL})`);
console.log(`  Locales testados por entrada: ${LOCALES_TESTE.join(', ')}`);

if (total !== EXPECTED_TOTAL) {
  failures.push(`contagem da allowlist = ${total}, esperado ${EXPECTED_TOTAL}`);
}

if (failures.length > 0) {
  console.log(`\nFALHOU: ${failures.length} violação(ões):`);
  for (const f of failures.slice(0, 30)) console.log('  ✗ ' + f);
  process.exit(1);
}

console.log(`\nOK: label() é no-op sobre as ${total} entradas (pt-BR e es retornam o canônico).`);
