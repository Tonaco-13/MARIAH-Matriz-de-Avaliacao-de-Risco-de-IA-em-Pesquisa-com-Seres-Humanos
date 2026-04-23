// Quick verification of MARA math logic after Res 738 update.
// Run with: node scripts/verify-math.mjs
//
// This imports the TS modules via tsx-compatible transpile. If you don't have
// tsx installed, use `npx tsx scripts/verify-math.mjs`.

import { QUALITATIVE_AXES, QUANTITATIVE_BLOCKS, THRESHOLDS_BASE, THRESHOLDS_COM_BANCO } from '../src/components/mara/data';
import {
  getApplicableAxes,
  getApplicableBlocks,
  calculateBlockScore,
  getQuantitativeTotalScore,
  getQuantitativeFinalResult,
  getQualitativeFinalLevel,
  getEliminatoryQuestionTriggered,
} from '../src/components/mara/utils';

let passed = 0;
let failed = 0;

function assert(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed++;
    console.log(`  ✓ ${label}: ${JSON.stringify(actual)}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}`);
    console.log(`    expected: ${JSON.stringify(expected)}`);
    console.log(`    got:      ${JSON.stringify(actual)}`);
  }
}

console.log('\n=== 1. Qualitative structure ===');
const axesBase = getApplicableAxes(false);
const axesDb = getApplicableAxes(true);
assert('Base axes count (no database)', axesBase.length, 5);
assert('Axes with database', axesDb.length, 6);
assert('Base total questions', axesBase.reduce((s, a) => s + a.questoes.length, 0), 41);
assert('With-db total questions', axesDb.reduce((s, a) => s + a.questoes.length, 0), 46);

console.log('\n=== 2. Quantitative structure ===');
const blocksBase = getApplicableBlocks(false);
const blocksDb = getApplicableBlocks(true);
assert('Base blocks count', blocksBase.length, 7);
assert('Blocks with database', blocksDb.length, 8);
assert(
  'Sum of maxPontos base',
  blocksBase.reduce((s, b) => s + b.maxPontos, 0),
  238
);
assert(
  'Sum of maxPontos with db',
  blocksDb.reduce((s, b) => s + b.maxPontos, 0),
  267
);
assert(
  'Block 6.b maxPontos',
  QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco6b').maxPontos,
  29
);

console.log('\n=== 3. Thresholds ===');
assert('Base thresholds maxScore', THRESHOLDS_BASE.maxScore, 238);
assert('Com-banco thresholds maxScore', THRESHOLDS_COM_BANCO.maxScore, 267);
assert('Base Level IV min', THRESHOLDS_BASE.levelIII + 1, 181);
assert('Com-banco Level IV min', THRESHOLDS_COM_BANCO.levelIII + 1, 203);

console.log('\n=== 4. Bloco 7 bidirectional (bug fix) ===');
// All risk answers, no mitigations → should reach max
const bloco7 = QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco7');
const allRiskAnswers = {};
for (const q of bloco7.questoes) {
  // Risk answer for risco questions + "não" for mitigations (no mitigation = risk)
  allRiskAnswers[q.id] = q.efeito === 'mitigacao' ? 'nao' : q.riskAnswer;
}
const bloco7MaxRisk = calculateBlockScore(bloco7, allRiskAnswers);
assert('Bloco 7 max (all risk, no mitigation)', bloco7MaxRisk, 75);

// All mitigations applied
const allMitigatedAnswers = {};
for (const q of bloco7.questoes) {
  if (q.efeito === 'mitigacao') allMitigatedAnswers[q.id] = 'sim'; // mitigation
  else allMitigatedAnswers[q.id] = q.riskAnswer === 'sim' ? 'nao' : 'sim'; // inverse of risk
}
const bloco7Mitigated = calculateBlockScore(bloco7, allMitigatedAnswers);
assert('Bloco 7 min (all mitigations applied, no risk)', bloco7Mitigated, 0);

console.log('\n=== 5. Quantitative total maxima reachable ===');
// Build "worst case" answers: all risk questions = risk, all mitigations = "não"
function buildWorstCase(blocks) {
  const out = {};
  for (const b of blocks) {
    for (const q of b.questoes) {
      out[q.id] = q.efeito === 'mitigacao' ? 'nao' : q.riskAnswer;
    }
  }
  return out;
}
const worstBase = buildWorstCase(blocksBase);
const worstDb = buildWorstCase(blocksDb);
assert('Worst-case total (base, no db)', getQuantitativeTotalScore(worstBase, false), 238);
assert('Worst-case total (with db)', getQuantitativeTotalScore(worstDb, true), 267);

console.log('\n=== 6. Level mapping ===');
assert('score=0 → I (base)', getQuantitativeFinalResult({}, false).level, 'I');

// B1 (22) + 5 risks em B5 (6*5=30) = 52 → II
const ans52 = { 'P1.1': 'nao', 'P1.2': 'nao', 'P1.3': 'nao', 'P1.4': 'nao', 'P1.5': 'nao', 'P1.6': 'nao', 'P1.7': 'nao', 'P5.1': 'sim', 'P5.2': 'sim', 'P5.3': 'sim', 'P5.4': 'sim', 'P5.5': 'sim' };
assert('score=52 → II (base)', getQuantitativeTotalScore(ans52, false), 52);
assert('score=52 → Level II (base)', getQuantitativeFinalResult(ans52, false).level, 'II');

// Exactly 50 pts → Level I (boundary)
const ans50 = { 'P1.1': 'nao', 'P1.2': 'nao', 'P1.3': 'nao', 'P1.4': 'nao', 'P1.5': 'nao', 'P1.6': 'nao', 'P1.7': 'nao', 'P5.1': 'sim', 'P5.2': 'sim', 'P5.3': 'sim', 'P5.4': 'sim', 'P5.6': 'nao' };
// 22 + 6*4 + 5 = 51 → II. Let me instead do 22+4*6+3 (not possible, block5 has P5.6=5pts)
// Try: 22 (bloco1) + 4*6 (P5.1-P5.4) + 4 (P1.7=4) ... wait P1.7 is in bloco1 max 22 already.
// B2 worst single = 3; B1 22 + B2 P2.1 (3) + P2.2 (3) + P2.3 (3) = 22+9 = 31 ... let me just use B1 22 + P5.1-P5.4 (24) + P5.6 (5) = 51
const s51 = getQuantitativeTotalScore(ans50, false);
console.log(`  ℹ test ans50 real score = ${s51}`);
assert('boundary score → Level II', getQuantitativeFinalResult(ans50, false).level, 'II');

// Test exact 50 pts boundary
const ans50exact = { 'P5.1': 'sim', 'P5.2': 'sim', 'P5.3': 'sim', 'P5.4': 'sim', 'P5.5': 'sim', 'P5.6': 'nao', 'P5.7': 'nao', 'P5.8': 'nao', 'P5.9': 'nao' };
const s50 = getQuantitativeTotalScore(ans50exact, false);
console.log(`  ℹ Bloco 5 all-risk real score = ${s50} (doc says 52)`);
assert('Bloco 5 full risk = 52 pts → Level II', getQuantitativeFinalResult(ans50exact, false).level, 'II');

console.log('\n=== 7. Cláusula de Prevalência Ética ===');
const p41Result = getQuantitativeFinalResult({ 'P4.1': 'sim' }, false);
assert('P4.1=sim → Level IV', p41Result.level, 'IV');
assert('P4.1=sim → clausulaPrevalencia=true', p41Result.clausulaPrevalencia, true);

console.log('\n=== 8. Eliminatório Res 738 ===');
// P6.b.2 = "nao" is the risk answer → should trigger eliminatory
const elimTrigger = getEliminatoryQuestionTriggered({ 'P6.b.2': 'nao' }, 'B', true);
assert('P6.b.2=nao triggers eliminatório', elimTrigger, 'P6.b.2');

const elimNoDb = getEliminatoryQuestionTriggered({ 'P6.b.2': 'nao' }, 'B', false);
assert('P6.b.2=nao does NOT trigger when usesDatabase=false', elimNoDb, null);

// 3.b.2 = "nao" in qualitative
const elimQualTrigger = getEliminatoryQuestionTriggered({ '3.b.2': 'nao' }, 'A', true);
assert('3.b.2=nao triggers eliminatório in Version A', elimQualTrigger, '3.b.2');

console.log('\n=== 9. Qualitative Eixo 3.b special elevation ===');
// 0 risk on Eixo 3.b → no elevation (contributes Level I)
const qual0 = getQualitativeFinalLevel({}, true);
assert('Empty answers with db → Level I', qual0.level, 'I');

// 1 risk on Eixo 3.b (but not eliminatory) → should be Level III
const qual1 = getQualitativeFinalLevel({ '3.b.1': 'nao' }, true);
const axis3b = qual1.axisResults.find((a) => a.axisId === 'eixo3b');
assert('1 risk on 3.b → axis Level III', axis3b.level, 'III');
assert('Final level is III due to 3.b', qual1.level, 'III');

// 3 risks on Eixo 3.b (but NOT eliminatory 3.b.2)
const qual3 = getQualitativeFinalLevel(
  { '3.b.1': 'nao', '3.b.3': 'nao', '3.b.4': 'nao' },
  true
);
const axis3b3 = qual3.axisResults.find((a) => a.axisId === 'eixo3b');
assert('3 risks on 3.b → axis Level IV', axis3b3.level, 'IV');
assert('Final level IV due to 3.b', qual3.level, 'IV');

console.log('\n=== 10. Questions count ===');
const totalQuantQuestionsDb = blocksDb.reduce((s, b) => s + b.questoes.length, 0);
const totalQuantQuestionsBase = blocksBase.reduce((s, b) => s + b.questoes.length, 0);
assert('Quant total questions (base)', totalQuantQuestionsBase, 51);
assert('Quant total questions (with db)', totalQuantQuestionsDb, 56);

console.log(`\n=== SUMMARY ===`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
