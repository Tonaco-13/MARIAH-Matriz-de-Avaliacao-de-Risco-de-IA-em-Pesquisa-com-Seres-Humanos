// ============================================================
// i18n-identity — prova de CONTRATO do helper label() (feat/i18n-es)
// ------------------------------------------------------------
// Evolução sancionada (LOG): na infra provava o no-op (i18n ausente ⇒ es ===
// canônico). Na fase de tradução, prova o CONTRATO do label() sobre a allowlist:
//   label(node, campo, 'pt-BR') === canônico            (pt-BR SEMPRE intocado)
//   label(node, campo, 'es')    === i18n.es[campo]      (pickup da tradução)
//                               === canônico            (fallback, se i18n.es ausente)
// Assim o guarda acompanha a tradução es entrando lote a lote: pt-BR permanece
// a fonte canônica e cada nó traduzido é verificado contra a sua própria entrada
// i18n.es. Âncora auditável pelo Z na branch de idioma.
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

let total = 0;
let esTranslated = 0;
let esFallback = 0;
const failures: string[] = [];
const breakdown: Record<string, number> = {};

function check(node: unknown, field: string, ctx: string, cat: string) {
  const canonical = (node as Record<string, unknown>)[field];
  if (typeof canonical !== 'string') {
    failures.push(`${ctx}.${field}: canônico não é string (${typeof canonical})`);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyNode = node as any;
  // (1) pt-BR é SEMPRE o canônico
  const gotPt = label(anyNode, field as any, 'pt-BR');
  if (gotPt !== canonical) {
    failures.push(`${ctx}.${field} [pt-BR]: label()="${gotPt}" ≠ canônico="${canonical}"`);
  }
  // (2) es: tradução quando presente; senão, fallback ao canônico
  const esVal = anyNode?.i18n?.es?.[field];
  const gotEs = label(anyNode, field as any, 'es');
  if (typeof esVal === 'string') {
    esTranslated += 1;
    if (gotEs !== esVal) failures.push(`${ctx}.${field} [es]: label()="${gotEs}" ≠ i18n.es="${esVal}"`);
  } else {
    esFallback += 1;
    if (gotEs !== canonical) failures.push(`${ctx}.${field} [es]: fallback "${gotEs}" ≠ canônico "${canonical}"`);
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

console.log('=== i18n identity — contrato do label() sobre a allowlist ===');
for (const [cat, n] of Object.entries(breakdown)) console.log(`  ${cat}: ${n}`);
console.log(`  TOTAL de entradas verificadas: ${total} (esperado ${EXPECTED_TOTAL})`);
console.log(`  es: ${esTranslated} traduzida(s) · ${esFallback} em fallback (canônico)`);

if (total !== EXPECTED_TOTAL) {
  failures.push(`contagem da allowlist = ${total}, esperado ${EXPECTED_TOTAL}`);
}

if (failures.length > 0) {
  console.log(`\nFALHOU: ${failures.length} violação(ões):`);
  for (const f of failures.slice(0, 30)) console.log('  ✗ ' + f);
  process.exit(1);
}

console.log(`\nOK: contrato do label() íntegro sobre ${total} entradas — pt-BR canônico; es ${esTranslated} traduzida(s) + ${esFallback} fallback.`);
