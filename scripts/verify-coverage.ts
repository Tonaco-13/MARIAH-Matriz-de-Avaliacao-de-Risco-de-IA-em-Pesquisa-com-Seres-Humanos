// ============================================================
// verify-coverage — cobertura da matriz (acurácia de comunicação do veredito)
// ------------------------------------------------------------
// Prova as regras do helper de cobertura (getMatrixCoverage /
// getCombinedCoverage) e a INVARIANTE com a auditoria:
//   semAvaliacao === getUnansweredItems(...) sem o escopo 'contexto'
// Camada de apresentação: nenhum teste aqui altera o cálculo do nível.
// Run: npx tsx scripts/verify-coverage.ts
// ============================================================

import {
  getApplicableAxes,
  getApplicableBlocks,
  getMatrixCoverage,
  getCombinedCoverage,
  getDisplayedCoverage,
  getUnansweredItems,
  getQualitativeFinalLevel,
  getQuantitativeFinalResult,
  isMatrixQuestionVisible,
  buildValidationExport,
  buildMirrorRecord,
  buildMirrorCSV,
  generateReportHTML,
  generateReportText,
} from '../src/components/maria/utils';
import type { QualitativeAnswer, QuantitativeAnswer } from '../src/components/maria/utils';

let passed = 0;
let failed = 0;
function assert(label: string, actual: unknown, expected: unknown) {
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

const CTX: Record<string, string> = {};
const allIds = (groups: Array<{ questoes: Array<{ id: string }> }>) =>
  groups.flatMap((g) => g.questoes.map((q) => q.id));

console.log('\n=== 1. Universo contável e recorte Res 738 ===');
const covA0 = getMatrixCoverage('A', CTX, {}, {}, false);
assert('A sem banco, nada respondido: total = 49 (todas visíveis)', covA0.total, 49);
assert('A sem banco, nada respondido: respondidas/taxa/parcial', [covA0.respondidas, covA0.taxa, covA0.parcial], [0, 0, true]);
const covB0 = getMatrixCoverage('B', CTX, {}, {}, false);
assert('B sem banco: total = 63 (Bloco 6.b fora)', covB0.total, 63);
// Com banco, 3.b.4.1/3.b.7 (A) e P6.b.4.1/P6.b.6 (B) só aparecem com 3.b.4 / P6.b.4 respondida ≠ na.
assert('A com banco, 3.b.4 em branco: 57 − 2 ocultas = 55', getMatrixCoverage('A', CTX, {}, {}, true).total, 55);
assert('B com banco, P6.b.4 em branco: 71 − 2 ocultas = 69', getMatrixCoverage('B', CTX, {}, {}, true).total, 69);

console.log('\n=== 2. Exibição condicional (F-17/F-18) ===');
const q3b4sim: QualitativeAnswer = { '3.b.4': 'sim' };
assert('3.b.4 = sim (sem C.3): 3.b.4.1 e 3.b.7 entram no total → 57', getMatrixCoverage('A', CTX, q3b4sim, {}, true).total, 57);
assert('3.b.4 = sim, C.3 = anonimizados: só 3.b.7 entra → 56',
  getMatrixCoverage('A', { 'C.3': 'anonimizados' }, q3b4sim, {}, true).total, 56);
assert('3.b.4 = na: ambas ocultas → 55 (e 3.b.4 conta como respondida)',
  [getMatrixCoverage('A', CTX, { '3.b.4': 'na' }, {}, true).total, getMatrixCoverage('A', CTX, { '3.b.4': 'na' }, {}, true).respondidas], [55, 1]);
// Resposta obsoleta de pergunta oculta NÃO conta como respondida (fora do universo).
assert('resposta obsoleta em pergunta oculta não infla respondidas',
  getMatrixCoverage('A', CTX, { '3.b.7': 'sim' }, {}, true).respondidas, 0);

console.log("\n=== 3. 'na' conta como respondida ===");
const firstA = allIds(getApplicableAxes(false))[0];
assert(`${firstA} = na → respondidas 1`, getMatrixCoverage('A', CTX, { [firstA]: 'na' }, {}, false).respondidas, 1);

console.log('\n=== 4. Taxa com floor (nunca superestima) ===');
const idsA = allIds(getApplicableAxes(false));
const fill = (ids: string[], n: number): QualitativeAnswer =>
  Object.fromEntries(ids.slice(0, n).map((id) => [id, 'nao'])) as QualitativeAnswer;
assert('1/49 → 2% (2,04)', getMatrixCoverage('A', CTX, fill(idsA, 1), {}, false).taxa, 2);
assert('48/49 → 97% (97,96 — arredondar daria 98)', getMatrixCoverage('A', CTX, fill(idsA, 48), {}, false).taxa, 97);
assert('48/49 continua parcial', getMatrixCoverage('A', CTX, fill(idsA, 48), {}, false).parcial, true);
const fullA = fill(idsA, 49);
const covFull = getMatrixCoverage('A', CTX, fullA, {}, false);
assert('49/49 → taxa 100, parcial false, semAvaliacao 0', [covFull.taxa, covFull.parcial, covFull.semAvaliacao], [100, false, 0]);
// floor com aritmética inteira: 29/100 ≠ 28 (29/100*100 = 28,999… em ponto flutuante).
// Reproduzido com o universo real: B sem banco tem 63 questões; 18/63 = 28,57 → 28 e 19/63 = 30,15 → 30.
const idsB = allIds(getApplicableBlocks(false));
const fillB = (n: number): QuantitativeAnswer =>
  Object.fromEntries(idsB.slice(0, n).map((id) => [id, 'nao'])) as QuantitativeAnswer;
assert('B 18/63 → 28%', getMatrixCoverage('B', CTX, {}, fillB(18), false).taxa, 28);
assert('B 19/63 → 30%', getMatrixCoverage('B', CTX, {}, fillB(19), false).taxa, 30);

console.log('\n=== 5. naoPontuavel no total (2.10) ===');
const sem210 = { ...fullA };
delete sem210['2.10'];
const cov210 = getMatrixCoverage('A', CTX, sem210, {}, false);
assert('tudo menos 2.10: parcial, semAvaliacao 1', [cov210.parcial, cov210.semAvaliacao], [true, 1]);
assert('2.10 aparece na auditoria',
  getUnansweredItems('A', CTX, sem210, {}, false).filter((it) => it.scope !== 'contexto').map((it) => it.id), ['2.10']);

console.log('\n=== 6. União A+B (triagem) ===');
const comb = getCombinedCoverage(CTX, fill(idsA, 10), fillB(20), false);
assert('união = soma de A e B (10+20 / 49+63)', [comb.respondidas, comb.total], [30, 112]);
assert('displayed: triagem com B percorrida = união',
  getDisplayedCoverage('B', true, CTX, fill(idsA, 10), fillB(20), false), comb);
assert('displayed: triagem ainda na A = cobertura A',
  getDisplayedCoverage('A', true, CTX, fill(idsA, 10), fillB(20), false), getMatrixCoverage('A', CTX, fill(idsA, 10), {}, false));

console.log('\n=== 7. Respondidas por eixo/bloco somam a cobertura global ===');
const qa = fill(idsA, 20);
const axes = getQualitativeFinalLevel(qa, false, CTX).axisResults;
assert('Σ respondidas (eixos) = cobertura A', axes.reduce((s, a) => s + a.respondidas, 0), getMatrixCoverage('A', CTX, qa, {}, false).respondidas);
assert('Σ totalVisiveis (eixos) = total A', axes.reduce((s, a) => s + a.totalVisiveis, 0), 49);
const qb = fillB(30);
const blocks = getQuantitativeFinalResult(qb, false, CTX).blockResults;
assert('Σ respondidas (blocos) = cobertura B', blocks.reduce((s, b) => s + b.respondidas, 0), 30);
assert('Σ totalVisiveis (blocos) = total B', blocks.reduce((s, b) => s + b.totalVisiveis, 0), 63);

console.log('\n=== 8. INVARIANTE: semAvaliacao === auditoria (matriz) — 400 cenários aleatórios ===');
// PRNG determinístico (mulberry32) para reprodutibilidade.
let seed = 20260925;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const VALS = [undefined, 'sim', 'nao', 'na'] as const;
const CTX_OPTS = [{}, { 'C.3': 'anonimizados' }, { 'C.5': 'antes do acesso, pela instituição custodiante' }, { 'C.3': 'identificáveis' }];
let invFail = 0;
let hiddenSeen = 0;
for (let i = 0; i < 400; i++) {
  const db = rnd() < 0.5;
  const ctx = CTX_OPTS[Math.floor(rnd() * CTX_OPTS.length)] as Record<string, string>;
  const a: QualitativeAnswer = {};
  const b: QuantitativeAnswer = {};
  for (const id of allIds(getApplicableAxes(true))) { const v = VALS[Math.floor(rnd() * 4)]; if (v) a[id] = v; }
  for (const id of allIds(getApplicableBlocks(true))) { const v = VALS[Math.floor(rnd() * 4)]; if (v) b[id] = v; }
  for (const g of getApplicableAxes(db)) for (const q of g.questoes) if (!isMatrixQuestionVisible(q, a, ctx)) hiddenSeen++;
  const audA = getUnansweredItems('A', ctx, a, b, db).filter((it) => it.scope !== 'contexto').length;
  const audB = getUnansweredItems('B', ctx, a, b, db).filter((it) => it.scope !== 'contexto').length;
  const cA = getMatrixCoverage('A', ctx, a, b, db);
  const cB = getMatrixCoverage('B', ctx, a, b, db);
  const cU = getCombinedCoverage(ctx, a, b, db);
  if (cA.semAvaliacao !== audA || cB.semAvaliacao !== audB || cU.semAvaliacao !== audA + audB) invFail++;
  if (cA.parcial !== cA.respondidas < cA.total || cA.taxa > 100 || cA.taxa < 0) invFail++;
}
assert('invariante A, B e união em 400 cenários (0 falhas)', invFail, 0);
assert('cenários exercitaram perguntas ocultas', hiddenSeen > 0, true);

console.log('\n=== 9. Export de validação local (schema v3) ===');
const argsTri = { version: 'B' as const, useAAsTriagem: true, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: fill(idsA, 10), quantitativeAnswers: fillB(20) };
const ex = buildValidationExport(argsTri);
assert('schemaVersion = 3', ex.schemaVersion, 3);
assert('versaoA.cobertura = {10, 49, parcial}', ex.versaoA.cobertura, { respondidas: 10, total: 49, parcial: true });
assert('versaoB.cobertura = {20, 63, parcial}', ex.versaoB.cobertura, { respondidas: 20, total: 63, parcial: true });
assert('Σ eixos[i].respondidas = cobertura A', ex.versaoA.eixos.reduce((s, e) => s + e.respondidas, 0), 10);
assert('Σ blocos[i].respondidas = cobertura B', ex.versaoB.blocos.reduce((s, b) => s + b.respondidas, 0), 20);
assert('classificação mantém o valor (sem sufixo)', ['I', 'II', 'III', 'IV'].includes(String(ex.versaoA.classificacaoConsolidada)), true);
const exFull = buildValidationExport({ version: 'A', useAAsTriagem: false, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: fullA, quantitativeAnswers: {} });
assert('A completa: cobertura.parcial = false; B não aplicada: cobertura null', [exFull.versaoA.cobertura?.parcial, exFull.versaoB.cobertura], [false, null]);
assert('JSON serializa e reidrata íntegro', JSON.parse(JSON.stringify(ex)).versaoB.cobertura.total, 63);

console.log('\n=== 10. Registro-espelho (schema v2) ===');
const mr = buildMirrorRecord({ ...argsTri, locale: 'pt-BR' });
assert('schemaVersion = 2', mr.schemaVersion, 2);
assert('resultado.cobertura = união A+B (30/112)', [mr.resultado.cobertura.respondidas, mr.resultado.cobertura.total, mr.resultado.cobertura.parcial], [30, 112, true]);
assert('nivelFinalRotulo com "(parcial)"', mr.resultado.nivelFinalRotulo.endsWith('(parcial)'), true);
assert('versaoA/versaoB.cobertura por matriz', [mr.resultado.versaoA?.cobertura.total, mr.resultado.versaoB?.cobertura.total], [49, 63]);
assert('texto de cobertura = linha do relatório', mr.resultado.cobertura.texto.startsWith('Classificado a partir de 30/112 questões respondidas (26%).'), true);
const csv = buildMirrorCSV(mr);
assert('CSV sem o antigo "x/total" de risco nos eixos', /resultado-a;eixo1;[^\n]*;\d+\/\d+ —/.test(csv), false);
assert('CSV traz "Respondidas:" por eixo e bloco', (csv.match(/Respondidas: \d+\/\d+/g) ?? []).length, 5 + 7);
const mrEs = buildMirrorRecord({ ...argsTri, locale: 'es' });
assert('es: linha de cobertura no idioma', mrEs.resultado.cobertura.texto.startsWith('Clasificado a partir de 30/112 preguntas'), true);
const mrFull = buildMirrorRecord({ version: 'A', useAAsTriagem: false, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: fullA, quantitativeAnswers: {}, locale: 'pt-BR' });
assert('completo: sem sufixo e linha a 100%', [mrFull.resultado.nivelFinalRotulo.includes('parcial'), mrFull.resultado.cobertura.texto.includes('(100%)')], [false, true]);

console.log('\n=== 11. Espelho no combinado: HTML/TXT trazem o consolidado com a união A+B (como a tela) ===');
const qaAllNao = Object.fromEntries(idsA.map((id) => [id, 'nao'])) as QualitativeAnswer;
const qb10 = fillB(10);
const covU = getCombinedCoverage(CTX, qaAllNao, qb10, false);
const linhaU = `${covU.respondidas}/${covU.total}`;
const html = generateReportHTML('B', CTX, qaAllNao, qb10, false, true, 'pt-BR');
const txt = generateReportText('B', CTX, qaAllNao, qb10, false, true, 'pt-BR');
const mrU = buildMirrorRecord({ version: 'B', useAAsTriagem: true, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: qaAllNao, quantitativeAnswers: qb10, locale: 'pt-BR' });
assert(`união ${linhaU} presente no HTML, no TXT e no espelho`, [html.includes(linhaU), txt.includes(linhaU), mrU.resultado.cobertura.texto.includes(linhaU)], [true, true, true]);
assert('TXT: linha "Consolidado: Nível … (parcial)"', /Consolidado: Nível (I|II|III|IV) — .+ \(parcial\)/.test(txt), true);
assert('HTML: consolidado com "(parcial)"', /Consolidado:<\/strong> <span[^>]*>Nível (I|II|III|IV) \(parcial\)/.test(html), true);
assert('CSV: rótulo "Cobertura" nas linhas de cobertura', (buildMirrorCSV(mrU).match(/;;Cobertura;/g) ?? []).length, 3);
const htmlSingle = generateReportHTML('A', CTX, fullA, {}, false, false, 'pt-BR');
assert('relatório não combinado não ganha bloco "Consolidado:"', htmlSingle.includes('Consolidado:'), false);

console.log('\n=== 12. Fidelidade do JSON de validação à tela ===');
// A respondida, volta à seleção e escolhe B: respostas A remanescentes no estado.
const staleA: QualitativeAnswer = { [idsA[0]]: 'sim', [idsA[1]]: 'sim', [idsA[2]]: 'sim' };
const exStale = buildValidationExport({ version: 'B', useAAsTriagem: false, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: staleA, quantitativeAnswers: fillB(5) });
assert('versão abandonada (A) não é exportada como aplicada', [exStale.versaoA.aplicada, exStale.versaoA.classificacaoConsolidada], [false, null]);
const exTriA = buildValidationExport({ version: 'A', useAAsTriagem: true, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: fill(idsA, 5), quantitativeAnswers: fillB(5) });
assert('triagem parada na A: B não é exportada como aplicada', exTriA.versaoB.aplicada, false);
assert('resultadoExibido na triagem parada na A = versão A', exTriA.resultadoExibido.versoes, 'A');
const exComb = buildValidationExport(argsTri);
const mrComb = buildMirrorRecord({ ...argsTri, locale: 'pt-BR' });
// Tela: eliminatória suspende a classificação; senão, nível final (mais alto entre A e B).
const lvlCombEsperado = mrComb.eliminatoria ? 'NÃO AVALIÁVEL' : mrComb.resultado.nivelFinal;
assert('resultadoExibido no combinado = veredito da tela (suspenso ou nível final)', [exComb.resultadoExibido.versoes, exComb.resultadoExibido.classificacao], ['A+B', lvlCombEsperado]);
assert('resultadoExibido.cobertura = união A+B', exComb.resultadoExibido.cobertura, { respondidas: 30, total: 112, parcial: true });
const qaIII: QualitativeAnswer = {};
for (const id of idsA.slice(0, 3)) qaIII[id] = 'sim';
const axesIII = getQualitativeFinalLevel(qaIII, false, CTX);
const exIII = buildValidationExport({ version: 'B', useAAsTriagem: true, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: qaIII, quantitativeAnswers: {} });
assert('combinado sem eliminatória: classificação = mais alto entre A e B', [exIII.resultadoExibido.classificacao, axesIII.protocoloNaoAvaliavel], [axesIII.level, false]);
const exElim = buildValidationExport({ version: 'B', useAAsTriagem: false, usesDatabase: true, contextAnswers: CTX, qualitativeAnswers: {}, quantitativeAnswers: { 'P6.b.2': 'nao' } });
assert('eliminatória: resultadoExibido = NÃO AVALIÁVEL (classificação suspensa na tela)', exElim.resultadoExibido.classificacao, 'NÃO AVALIÁVEL');
assert('dataAvaliacao em AAAA-MM-DD (data local)', /^\d{4}-\d{2}-\d{2}$/.test(exComb.protocolo.dataAvaliacao) && exComb.protocolo.dataAvaliacao === (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })(), true);

console.log('\n=== 13. Nota de rodapé "(parcial)" no relatório (mesma definição da tela, por versão) ===');
{
  const ptMsgs = require('../messages/pt-BR.json');
  const notaA: string = ptMsgs.report.parcialNotaA;
  const notaB: string = ptMsgs.report.parcialNotaB;
  assert('textos do relatório = textos aprovados da tela (A, B, título)', [notaA === ptMsgs.results.parcialExplicacaoA, notaB === ptMsgs.results.parcialExplicacaoB, ptMsgs.report.parcialNotaTitulo === ptMsgs.results.parcialExplicacaoTitulo], [true, true, true]);
  const hA = generateReportHTML('A', CTX, fill(idsA, 10), {}, false, false, 'pt-BR');
  const tA = generateReportText('A', CTX, fill(idsA, 10), {}, false, false, 'pt-BR');
  assert('A parcial: nota A no HTML e no TXT, sem a nota B', [hA.includes(notaA), tA.includes(notaA), hA.includes(notaB)], [true, true, false]);
  const hB = generateReportHTML('B', CTX, {}, fillB(10), false, false, 'pt-BR');
  assert('B parcial: nota B no HTML', [hB.includes(notaB), hB.includes(notaA)], [true, false]);
  const hFull = generateReportHTML('A', CTX, fullA, {}, false, false, 'pt-BR');
  const tFull = generateReportText('A', CTX, fullA, {}, false, false, 'pt-BR');
  assert('cobertura completa: sem nota no HTML e no TXT', [hFull.includes(notaA), tFull.includes(notaA)], [false, false]);
  const hComb = generateReportHTML('B', CTX, fill(idsA, 10), fillB(10), false, true, 'pt-BR');
  assert('combinado: nota A na seção A e nota B na seção B', [hComb.includes(notaA), hComb.includes(notaB)], [true, true]);
  const mrN = buildMirrorRecord({ version: 'B', useAAsTriagem: true, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: fill(idsA, 10), quantitativeAnswers: fillB(10), locale: 'pt-BR' });
  assert('espelho: nota por versão e no nível final (regra B no combinado)', [mrN.resultado.versaoA?.cobertura.nota === notaA, mrN.resultado.versaoB?.cobertura.nota === notaB, mrN.resultado.cobertura.nota === notaB], [true, true, true]);
  assert('espelho completo: nota null', buildMirrorRecord({ version: 'A', useAAsTriagem: false, usesDatabase: false, contextAnswers: CTX, qualitativeAnswers: fullA, quantitativeAnswers: {}, locale: 'pt-BR' }).resultado.cobertura.nota, null);
  const esMsgs = require('../messages/es.json');
  const hEs = generateReportHTML('A', CTX, fill(idsA, 10), {}, false, false, 'es');
  assert('es: nota no idioma (texto aprovado)', hEs.includes(esMsgs.report.parcialNotaA) && esMsgs.report.parcialNotaA === esMsgs.results.parcialExplicacaoA, true);
}

console.log('\n=== 14. Orientação do JSON alinhada à planilha-modelo v2 ===');
{
  const exV2 = buildValidationExport({ version: 'B', useAAsTriagem: false, usesDatabase: true, contextAnswers: CTX, qualitativeAnswers: {}, quantitativeAnswers: {} });
  const txt = exV2.comoUsar.abasPlanilha.versaoB;
  assert('versaoB não orienta mais somar o 6.b ao Bloco 6', /some a pontua/i.test(txt), false);
  assert('versaoB cita as colunas da v2 (Bloco 6.b, Cláusula, Não avaliável)', ['Bloco 6.b', 'Cláusula de Prevalência?', 'Não avaliável?'].every((k) => txt.includes(k)), true);
  assert('export com banco traz o bloco6b para a coluna própria', exV2.versaoB.blocos.some((b) => b.id === 'bloco6b'), true);
}

console.log(`\n=== RESULT ===\n  Passed: ${passed}\n  Failed: ${failed}`);
if (failed > 0) process.exit(1);
