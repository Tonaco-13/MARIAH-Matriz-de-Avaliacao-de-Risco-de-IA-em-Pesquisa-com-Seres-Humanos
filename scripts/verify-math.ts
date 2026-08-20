// Quick verification of MARIA math logic after Res 738 update.
// Run with: node scripts/verify-math.mjs
//
// This imports the TS modules via tsx-compatible transpile. If you don't have
// tsx installed, use `npx tsx scripts/verify-math.mjs`.

import { QUALITATIVE_AXES, QUANTITATIVE_BLOCKS, THRESHOLDS_BASE, THRESHOLDS_COM_BANCO, CONTEXT_QUESTIONS, MATRIX_VERSION, REQUIREMENTS, REQUIREMENTS_RES738 } from '../src/components/maria/data';
import {
  getApplicableAxes,
  getApplicableBlocks,
  calculateBlockScore,
  getQuantitativeTotalScore,
  getQuantitativeFinalResult,
  getQuantitativeRiskLevel,
  getQualitativeFinalLevel,
  getEliminatoryQuestionTriggered,
  countRiskAnswersAxis,
  buildValidationExport,
} from '../src/components/maria/utils';

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
// v2: base 49 = 42 (v1) + 7 risco (Eixo 2 +2, Eixo 3 +5). Com banco 57 = 49 + Eixo 3.b (8 = 5 + F-17/F-18/F-23).
assert('Base total questions', axesBase.reduce((s, a) => s + a.questoes.length, 0), 49);
assert('With-db total questions', axesDb.reduce((s, a) => s + a.questoes.length, 0), 57);

console.log('\n=== 2. Quantitative structure ===');
const blocksBase = getApplicableBlocks(false);
const blocksDb = getApplicableBlocks(true);
assert('Base blocks count', blocksBase.length, 7);
assert('Blocks with database', blocksDb.length, 8);
// v2: base 275 (Bloco 5: 52→62, Bloco 6: 50→77). Com banco 304 (+ Bloco 6.b 29).
assert(
  'Sum of maxPontos base',
  blocksBase.reduce((s, b) => s + b.maxPontos, 0),
  275
);
assert(
  'Sum of maxPontos with db',
  blocksDb.reduce((s, b) => s + b.maxPontos, 0),
  304
);
assert(
  'Block 6.b maxPontos',
  QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco6b').maxPontos,
  29
);
assert('Bloco 5 maxPontos (v2)', QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco5').maxPontos, 62);
assert('Bloco 6 maxPontos (v2)', QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco6').maxPontos, 77);
assert('Bloco 7 maxPontos (inalterado)', QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco7').maxPontos, 75);

console.log('\n=== 3. Thresholds (recalibração cenário A) ===');
assert('Base thresholds maxScore', THRESHOLDS_BASE.maxScore, 275);
assert('Com-banco thresholds maxScore', THRESHOLDS_COM_BANCO.maxScore, 304);
assert('Base cortes I/II/III', [THRESHOLDS_BASE.levelI, THRESHOLDS_BASE.levelII, THRESHOLDS_BASE.levelIII], [58, 127, 208]);
assert('Com-banco cortes I/II/III', [THRESHOLDS_COM_BANCO.levelI, THRESHOLDS_COM_BANCO.levelII, THRESHOLDS_COM_BANCO.levelIII], [64, 141, 230]);
assert('Base Level IV min', THRESHOLDS_BASE.levelIII + 1, 209);
assert('Com-banco Level IV min', THRESHOLDS_COM_BANCO.levelIII + 1, 231);

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
assert('Worst-case total (base, no db)', getQuantitativeTotalScore(worstBase, false), 275);
assert('Worst-case total (with db)', getQuantitativeTotalScore(worstDb, true), 304);

console.log('\n=== 6. Level mapping (fronteiras v2) ===');
assert('score=0 → I (base)', getQuantitativeFinalResult({}, false).level, 'I');
// Base: cortes 58/127/208 (inclusivos). Testa cada fronteira e o degrau seguinte.
assert('58 → I (base)', getQuantitativeRiskLevel(58, false), 'I');
assert('59 → II (base)', getQuantitativeRiskLevel(59, false), 'II');
assert('127 → II (base)', getQuantitativeRiskLevel(127, false), 'II');
assert('128 → III (base)', getQuantitativeRiskLevel(128, false), 'III');
assert('208 → III (base)', getQuantitativeRiskLevel(208, false), 'III');
assert('209 → IV (base)', getQuantitativeRiskLevel(209, false), 'IV');
// Com banco: cortes 64/141/230.
assert('64 → I (com banco)', getQuantitativeRiskLevel(64, true), 'I');
assert('65 → II (com banco)', getQuantitativeRiskLevel(65, true), 'II');
assert('141 → II (com banco)', getQuantitativeRiskLevel(141, true), 'II');
assert('142 → III (com banco)', getQuantitativeRiskLevel(142, true), 'III');
assert('230 → III (com banco)', getQuantitativeRiskLevel(230, true), 'III');
assert('231 → IV (com banco)', getQuantitativeRiskLevel(231, true), 'IV');

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

console.log('\n=== 9b. P6.b.2 "Não se aplica" (hasNaOption) ===');
// P6.b.2 com 'na' NÃO deve somar pontos no Bloco 6.b
const block6b = QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco6b');
const score6bNa = calculateBlockScore(block6b, { 'P6.b.2': 'na' });
assert('P6.b.2=na → Bloco 6.b score = 0', score6bNa, 0);

// P6.b.2 com 'na' NÃO deve acionar eliminatório
const elim6bNa = getEliminatoryQuestionTriggered({ 'P6.b.2': 'na' }, 'B', true);
assert('P6.b.2=na → sem eliminatório', elim6bNa, null);

// Sanity check: P6.b.2=nao CONTINUA acionando eliminatório
const elim6bNao = getEliminatoryQuestionTriggered({ 'P6.b.2': 'nao' }, 'B', true);
assert('P6.b.2=nao → eliminatório acionado', elim6bNao, 'P6.b.2');

// Sanity check: P6.b.2=sim não soma e não elimina
const score6bSim = calculateBlockScore(block6b, { 'P6.b.2': 'sim' });
assert('P6.b.2=sim → Bloco 6.b score = 0', score6bSim, 0);

// hasNaOption flag está presente no data
const p6b2 = block6b.questoes.find((q) => q.id === 'P6.b.2');
assert('P6.b.2.hasNaOption === true', p6b2.hasNaOption, true);

console.log('\n=== 9c. Versão A — 3.b.2 "Não se aplica" (hasNaOption) ===');
// Mesma semântica da Versão B: 3.b.2='na' não dispara eliminatório
const eixo3b = QUALITATIVE_AXES.find((a) => a.id === 'eixo3b');
const q3b2 = eixo3b?.questoes.find((q) => q.id === '3.b.2');
assert('3.b.2.hasNaOption === true', q3b2?.hasNaOption, true);
assert('3.b.2 ainda é eliminatório', q3b2?.eliminatorio, true);
assert('3.b.2 riskAnswer = nao', q3b2?.riskAnswer, 'nao');

// Eliminatório dispara só com 'nao', não com 'na'
const elimAQual_na = getEliminatoryQuestionTriggered({ '3.b.2': 'na' }, 'A', true);
assert('3.b.2=na → SEM eliminatório (Versão A)', elimAQual_na, null);
const elimAQual_nao = getEliminatoryQuestionTriggered({ '3.b.2': 'nao' }, 'A', true);
assert('3.b.2=nao → eliminatório acionado (Versão A)', elimAQual_nao, '3.b.2');
const elimAQual_sim = getEliminatoryQuestionTriggered({ '3.b.2': 'sim' }, 'A', true);
assert('3.b.2=sim → SEM eliminatório (Versão A)', elimAQual_sim, null);

// 'na' não conta como risco no countRiskAnswersAxis
const riskCount_na = eixo3b ? countRiskAnswersAxis(eixo3b, { '3.b.2': 'na' }) : -1;
assert('3.b.2=na → countRiskAnswersAxis = 0', riskCount_na, 0);

console.log('\n=== 10. Questions count ===');
const totalQuantQuestionsDb = blocksDb.reduce((s, b) => s + b.questoes.length, 0);
const totalQuantQuestionsBase = blocksBase.reduce((s, b) => s + b.questoes.length, 0);
// v2: base 63 = 52 (v1) + 2 (F-11/F-12 Bloco 5) + 5 (F-06..F-10 Bloco 6) + 4 (F-13..F-16 7C).
// Com banco 71 = 63 + Bloco 6.b (8 = 5 + F-17/F-18/F-23 diligências).
assert('Quant total questions (base)', totalQuantQuestionsBase, 63);
assert('Quant total questions (with db)', totalQuantQuestionsDb, 71);

console.log('\n=== 11. Efeitos v2: 7C evidência (só-abate) e diligência (não pontua) ===');
// Bloco sintético (não altera a matriz): valida os ramos novos do calculateBlockScore.
const blocoEvid = {
  id: 'bloco7',
  nome: 'sintético',
  descricao: 'teste',
  maxPontos: 75,
  questoes: [
    { id: 'R1', pergunta: 'x', riskAnswer: 'nao', pontos: 10, efeito: 'risco', dica: 'x' },
    { id: 'EV1', pergunta: 'x', riskAnswer: 'nao', pontos: -5, efeito: 'evidencia', dica: 'x' },
    { id: 'DG1', pergunta: 'x', riskAnswer: 'nao', pontos: 0, efeito: 'diligencia', dica: 'x' },
  ],
};
// evidência presente ("sim") subtrai |pontos|
assert('7C presente subtrai (10 - 5)', calculateBlockScore(blocoEvid as never, { R1: 'nao', EV1: 'sim' }), 5);
// evidência ausente ("nao") NÃO soma (não infla o teto)
assert('7C ausente não infla (= 10)', calculateBlockScore(blocoEvid as never, { R1: 'nao', EV1: 'nao' }), 10);
// evidência sozinha não deixa o bloco negativo (clamp 0 do Bloco 7)
assert('7C sozinha respeita o piso 0', calculateBlockScore(blocoEvid as never, { EV1: 'sim' }), 0);
// diligência não pontua
assert('diligência não pontua (= 10)', calculateBlockScore(blocoEvid as never, { R1: 'nao', DG1: 'nao' }), 10);

console.log('\n=== 12. Estrutura v2 na matriz real ===');
// 7C: 4 evidências no Bloco 7, todas efeito 'evidencia' e pontos negativos (só-abate).
const bloco7Real = QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco7');
const evidReal = bloco7Real.questoes.filter((q) => q.efeito === 'evidencia');
assert('Bloco 7 tem 4 evidências (7C)', evidReal.length, 4);
assert('Evidências têm pontos negativos', evidReal.every((q) => q.pontos < 0), true);
// Diligências: 3 no Bloco 6.b, efeito 'diligencia', pontos 0 e eliminatórias (devolução/não avaliável).
const bloco6bReal = QUANTITATIVE_BLOCKS.find((b) => b.id === 'bloco6b');
const diligReal = bloco6bReal.questoes.filter((q) => q.efeito === 'diligencia');
assert('Bloco 6.b tem 3 diligências', diligReal.length, 3);
assert('Diligências não pontuam', diligReal.every((q) => q.pontos === 0), true);
assert('Diligências são eliminatórias (devolução)', diligReal.every((q) => q.eliminatorio === true), true);
// Diligência acionada → "não avaliável" (gate independente da pontuação).
const diligTrigger = getEliminatoryQuestionTriggered({ [diligReal[0].id]: 'nao' }, 'B', true);
assert('Diligência=nao aciona não avaliável', diligTrigger, diligReal[0].id);
// Descritivas: 8 no contexto; as 6 novas têm tipoEntrada declarado.
assert('Contexto tem 8 descritivas', CONTEXT_QUESTIONS.length, 8);
const comTipo = CONTEXT_QUESTIONS.filter((q) => q.tipoEntrada).length;
assert('Descritivas novas têm tipoEntrada', comTipo, 6);

console.log('\n=== 13. Export de validação: M3 (não avaliável ≠ IV) + carimbo de versão ===');
// Versão B com P6.b.2=nao (eliminatória, com banco) → protocolo não avaliável.
const expNaoAval = buildValidationExport({
  version: 'B',
  useAAsTriagem: false,
  usesDatabase: true,
  contextAnswers: {},
  qualitativeAnswers: {},
  quantitativeAnswers: { 'P6.b.2': 'nao' },
});
assert('M3: classificacaoFinal = NÃO AVALIÁVEL (não IV)', expNaoAval.versaoB.classificacaoFinal, 'NÃO AVALIÁVEL');
assert('M3: protocoloNaoAvaliavel = true', expNaoAval.versaoB.protocoloNaoAvaliavel, true);
assert('Carimbo: software.versaoMatriz = MATRIX_VERSION', expNaoAval.software.versaoMatriz, MATRIX_VERSION);
assert('Export schemaVersion = 2', expNaoAval.schemaVersion, 2);
// Sanidade: protocolo avaliável mantém o nível de risco (não vira "NÃO AVALIÁVEL").
const expOk = buildValidationExport({
  version: 'B',
  useAAsTriagem: false,
  usesDatabase: false,
  contextAnswers: {},
  qualitativeAnswers: {},
  quantitativeAnswers: {},
});
assert('Avaliável mantém nível (I) no export', expOk.versaoB.classificacaoFinal, 'I');

console.log('\n=== 14. Harmonização de texto (MI6, F-19/F-20/F-21, 7C) ===');
const allReqs = [...REQUIREMENTS, ...REQUIREMENTS_RES738];
const reqIV4 = allReqs.find((r) => r.id === 'req-IV-4');
assert('MI6: req-IV-4 cita "CEP acreditado"', reqIV4?.texto.includes('CEP acreditado'), true);
assert('MI6: req-IV-4 sem "instância superior"', reqIV4?.texto.includes('instância superior'), false);
const findQB = (id: string) => {
  for (const b of QUANTITATIVE_BLOCKS) { const q = b.questoes.find((x) => x.id === id); if (q) return q; }
  return undefined;
};
const findQA = (id: string) => {
  for (const a of QUALITATIVE_AXES) { const q = a.questoes.find((x) => x.id === id); if (q) return q; }
  return undefined;
};
assert('F-19: 3.1 cita "saúde mental"', findQA('3.1')?.pergunta.includes('saúde mental'), true);
assert('F-19: 3.1 cita "dados de localização"', findQA('3.1')?.pergunta.includes('dados de localização'), true);
assert('F-20: 1.2 cita "após o seu encerramento"', findQA('1.2')?.pergunta.includes('após o seu encerramento'), true);
assert('F-20: P2.2 usa travessão (—)', findQB('P2.2')?.pergunta.includes('—'), true);
assert('F-21: P6.b.5 cita "acordo formal de compartilhamento"', findQB('P6.b.5')?.pergunta.includes('acordo formal de compartilhamento'), true);
assert('7C: dica de P7.13 cita "peso maior"', findQB('P7.13')?.dica.includes('peso maior'), true);

console.log(`\n=== SUMMARY ===`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
