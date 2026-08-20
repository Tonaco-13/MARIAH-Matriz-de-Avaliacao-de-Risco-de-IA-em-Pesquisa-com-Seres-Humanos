// ============================================================
// Gate de paridade — camada 2 (app × planilha do Kimi).
// Roda os 31 vetores da Versão B e as 33 linhas do V17 (Versão A)
// pelas FUNÇÕES REAIS do app (utils) e cruza com o esperado da
// planilha de pontuação paralela. Qualquer Δ ≠ 0 ou comportamento
// divergente falha (exit 1) e BLOQUEIA a publicação.
//
// Fonte dos vetores: gate/vetores-b.json (extraído da planilha do Kimi
// por scripts/extract-gate-vectors.py).
// Rodar:  npx tsx scripts/gate-run.ts
// ============================================================

import { readFileSync } from 'node:fs';
import { QUALITATIVE_AXES } from '../src/components/maria/data';
import type { QuantitativeAnswer } from '../src/components/maria/utils';
import { getQuantitativeFinalResult, getAxisRiskLevel } from '../src/components/maria/utils';

type VetorB = {
  vetor: string;
  usesDatabase: boolean;
  quantAnswers: Record<string, 'sim' | 'nao' | 'na'>;
  contextAnswers: Record<string, string>;
  escoreEsperado: number | string | null;
  comportamento: string;
};
type LinhaV17 = { linha: string; eixoId: string; riskCount: number; expectedLevel: string };

const data = JSON.parse(readFileSync('gate/vetores-b.json', 'utf-8')) as {
  vetoresB: VetorB[];
  v17: LinhaV17[];
};

let pass = 0;
let fail = 0;
const falhas: string[] = [];

function ok(label: string, cond: boolean, detalhe: string) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${label}: ${detalhe}`);
  } else {
    fail++;
    falhas.push(label);
    console.log(`  ✗ ${label}: ${detalhe}`);
  }
}

console.log('\n=== GATE — Versão B (31 vetores) ===');
for (const v of data.vetoresB) {
  const r = getQuantitativeFinalResult(v.quantAnswers as QuantitativeAnswer, v.usesDatabase, v.contextAnswers);
  const comport = v.comportamento;
  const naoAval = /não avaliável/i.test(comport);
  const prevalencia = /preval[êe]ncia/i.test(comport);
  const mLevel = comport.match(/\b(IV|III|II|I)\b/);
  const expLevel = mLevel ? mLevel[1] : null;
  const escEsp = typeof v.escoreEsperado === 'number' ? v.escoreEsperado : null;

  if (naoAval) {
    ok(
      `${v.vetor} (não avaliável)`,
      r.protocoloNaoAvaliavel === true,
      `app.protocoloNaoAvaliavel=${r.protocoloNaoAvaliavel} elim=${r.eliminatoryQuestionId ?? '—'}`
    );
  } else {
    const levelOk = expLevel ? r.level === expLevel : true;
    const scoreOk = escEsp === null ? true : r.totalScore === escEsp;
    const prevOk = prevalencia ? r.clausulaPrevalencia === true : true;
    const notNaoAval = r.protocoloNaoAvaliavel === false;
    const delta = escEsp === null ? '—' : String(r.totalScore - escEsp);
    ok(
      `${v.vetor}`,
      levelOk && scoreOk && prevOk && notNaoAval,
      `esp=${escEsp ?? '—'}/${expLevel ?? '—'}${prevalencia ? '+Prev' : ''} | app=${r.totalScore}/${r.level}${r.clausulaPrevalencia ? '+Prev' : ''} | Δ=${delta}`
    );
  }
}

console.log('\n=== GATE — Versão A / V17 (contagem → nível por eixo) ===');
for (const l of data.v17) {
  const axis = QUALITATIVE_AXES.find((a) => a.id === l.eixoId);
  if (!axis) {
    ok(l.linha, false, `eixo ${l.eixoId} não encontrado`);
    continue;
  }
  const lvl = getAxisRiskLevel(l.riskCount, axis);
  ok(`${l.linha} (${l.eixoId}, ${l.riskCount} risco)`, lvl === l.expectedLevel, `esp=${l.expectedLevel} | app=${lvl}`);
}

console.log('\n=== RESULTADO DO GATE ===');
console.log(`  Passaram: ${pass}`);
console.log(`  Falharam: ${fail}`);
if (fail > 0) {
  console.log('\n  BLOQUEIA PUBLICAÇÃO — divergências:');
  for (const f of falhas) console.log(`   - ${f}`);
}
process.exit(fail > 0 ? 1 : 0);
