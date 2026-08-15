// ============================================================
// Fase 2 — Gerador da spec v2.0-draft a partir das fichas v0.3.
// Lê a spec v1 (baseline) + spec/fichas/fichas-alteracao-mariah-v2.json e
// aplica as fichas de forma reproduzível. NÃO altera valores à mão.
//   Dry-run (imprime resumo, não grava):  npx tsx scripts/build-spec-v2.ts
//   Aplica (grava spec/mariah-spec.json):  npx tsx scripts/build-spec-v2.ts --apply
// Depois: npm run verify (com os números v2 atualizados no verify-math).
//
// Modelagem registrada (a confirmar no gate contra a planilha do Kimi):
// - descritiva  → contextQuestions (tipoEntrada/opcoes/condicional), não pontua.
// - risco       → questão no eixo (A, sem pontos) + no bloco (B, com pontos).
// - evidencia   → subbloco 7C no bloco7 (B); só-abate; não altera o teto de risco.
// - diligencia  → eixo3b (A) + bloco6b (B); pontos 0; ELIMINATÓRIA (devolução/não
//                 avaliável) conforme convenção das fichas e V15/V17 da planilha.
// - alterar-redacao / evidencia:alterar-dica (Versão A) → NÃO aplicadas aqui
//   (texto, sem impacto em pontuação) — harmonização de texto em passo próprio.
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';

const apply = process.argv.includes('--apply');
const SPEC = 'spec/mariah-spec.json';
const FICHAS = 'spec/fichas/fichas-alteracao-mariah-v2.json';

const spec = JSON.parse(readFileSync(SPEC, 'utf-8'));
const fichasDoc = JSON.parse(readFileSync(FICHAS, 'utf-8'));

if (String(spec.matrixVersion).startsWith('2')) {
  console.error('ABORTADO: a spec já está em v2. Rode a partir da spec v1 (baseline).');
  process.exit(1);
}

const AX: Record<string, string> = { '1': 'eixo1', '2': 'eixo2', '3': 'eixo3', '3.b': 'eixo3b', '4': 'eixo4', '5': 'eixo5' };
const BL: Record<string, string> = { '1': 'bloco1', '2': 'bloco2', '3': 'bloco3', '4': 'bloco4', '5': 'bloco5', '6': 'bloco6', '6.b': 'bloco6b', '7': 'bloco7' };
const axis = (id: string) => spec.qualitativeAxes.find((a: { id: string }) => a.id === AX[id]);
const block = (id: string) => spec.quantitativeBlocks.find((b: { id: string }) => b.id === BL[id]);
const clean = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== false));

const log: string[] = [];
let nDescr = 0, nRisco = 0, nEvid = 0, nDilig = 0, nSkip = 0;

for (const f of fichasDoc.fichas) {
  const ef = f.efeito;

  if (ef === 'descritiva') {
    spec.contextQuestions.push(clean({
      id: f.versaoB?.id_proposto ?? f.versaoA?.id_proposto,
      pergunta: f.pergunta, dica: f.dica,
      tipoEntrada: f.descritiva?.tipo_entrada,
      opcoes: (f.descritiva?.opcoes && f.descritiva.opcoes.length) ? f.descritiva.opcoes : undefined,
      condicional: f.condicional,
    }));
    nDescr++;

  } else if (ef === 'risco' && f.acao === 'incluir') {
    const a = axis(f.versaoA.eixo);
    a.questoes.push(clean({
      id: f.versaoA.id_proposto, pergunta: f.pergunta, riskAnswer: f.versaoA.riskAnswer, dica: f.dica,
      eliminatorio: f.versaoA.eliminatorio, hasNaOption: f.versaoA.hasNaOption, naoPontuavel: f.versaoA.naoPontuavel,
    }));
    const b = block(f.versaoB.bloco);
    b.questoes.push(clean({
      id: f.versaoB.id_proposto, pergunta: f.pergunta, riskAnswer: f.versaoB.riskAnswer, pontos: f.versaoB.pontos,
      dica: f.dica, efeito: 'risco', eliminatorio: f.versaoB.eliminatorio, hasNaOption: f.versaoB.hasNaOption,
    }));
    b.maxPontos += f.versaoB.pontos; // risco positivo → eleva o teto do bloco
    nRisco++;

  } else if (ef === 'evidencia') {
    const b = block('7');
    b.questoes.push(clean({
      id: f.versaoB.id_proposto, pergunta: f.pergunta, riskAnswer: 'nao', pontos: f.versaoB.pontos,
      dica: f.dica, efeito: 'evidencia', subbloco: f.versaoB.subbloco,
    }));
    // teto de risco do bloco7 NÃO muda (evidência só-abate).
    // Versão A (alterar-dica) → não aplicada aqui (texto).
    nEvid++;

  } else if (ef === 'diligencia') {
    const motivo = 'diligência/checklist de admissibilidade não atendido — protocolo devolvido para complementação (não avaliável no mérito). Não compensável por pontuação.';
    const a = axis('3.b');
    a.questoes.push(clean({
      id: f.versaoA.id_proposto, pergunta: f.pergunta, riskAnswer: 'nao', dica: f.dica,
      eliminatorio: true, hasNaOption: true, naoPontuavel: true,
      motivoEliminatorio: motivo, refEliminatoria: 'Res. CNS n.º 738/2024',
    }));
    const b = block('6.b');
    b.questoes.push(clean({
      id: f.versaoB.id_proposto, pergunta: f.pergunta, riskAnswer: 'nao', pontos: 0,
      dica: f.dica, efeito: 'diligencia', eliminatorio: true, hasNaOption: true,
      motivoEliminatorio: motivo, refEliminatoria: 'Res. CNS n.º 738/2024',
    }));
    nDilig++;

  } else {
    // alterar-redacao (F-19/F-20/F-21) e evidencia:alterar-dica (Versão A) — texto, passo próprio.
    log.push(`  (pulado, texto) ${f.ficha_id} — ${f.acao}`);
    nSkip++;
  }
}

// ----- Recalibração (frações fixas do baseline 238; arredondamento meia-unidade p/ cima) -----
const baseBlocks = spec.quantitativeBlocks.filter((b: { condicionalBancoDados?: boolean }) => !b.condicionalBancoDados);
const tetoBase = baseBlocks.reduce((s: number, b: { maxPontos: number }) => s + b.maxPontos, 0);
const bloco6b = spec.quantitativeBlocks.find((b: { id: string }) => b.id === 'bloco6b');
const tetoComBanco = tetoBase + bloco6b.maxPontos;
const corte = (frac: number, teto: number) => Math.round(frac * teto);
const FI = 50 / 238, FII = 110 / 238, FIII = 180 / 238;

spec.thresholdsBase = { maxScore: tetoBase, levelI: corte(FI, tetoBase), levelII: corte(FII, tetoBase), levelIII: corte(FIII, tetoBase) };
spec.thresholdsComBanco = { maxScore: tetoComBanco, levelI: corte(FI, tetoComBanco), levelII: corte(FII, tetoComBanco), levelIII: corte(FIII, tetoComBanco) };

// Nota de domínio (achado do revisor): teto avaliável com banco = teórico − P6.b.2 (7, eliminatória).
const p6b2 = bloco6b.questoes.find((q: { id: string }) => q.id === 'P6.b.2');
spec.notasDominio = {
  tetoTeoricoComBanco: tetoComBanco,
  tetoAvaliavelComBanco: tetoComBanco - (p6b2?.pontos ?? 0),
  obs: 'O teto teórico com banco só ocorre junto com a P6.b.2 eliminatória (protocolo não avaliável). O máximo pontuável com direito a classificação é o teto avaliável.',
};

spec.matrixVersion = '2.0.0-draft';
spec.geradoEm = new Date().toISOString();

// ----- Resumo -----
console.log('=== build-spec-v2 — resumo ===');
console.log(`Fichas aplicadas: descritiva=${nDescr} risco=${nRisco} evidencia=${nEvid} diligencia=${nDilig} | puladas(texto)=${nSkip}`);
if (log.length) console.log(log.join('\n'));
console.log('\nEixos (Versão A):');
for (const a of spec.qualitativeAxes) console.log(`  ${a.id}: ${a.questoes.length} questões`);
console.log('\nBlocos (Versão B):');
for (const b of spec.quantitativeBlocks) console.log(`  ${b.id}: maxPontos=${b.maxPontos} | ${b.questoes.length} questões`);
console.log(`\nTeto base: ${spec.thresholdsBase.maxScore} | cortes I/II/III: ${spec.thresholdsBase.levelI}/${spec.thresholdsBase.levelII}/${spec.thresholdsBase.levelIII}`);
console.log(`Teto com banco: ${spec.thresholdsComBanco.maxScore} | cortes: ${spec.thresholdsComBanco.levelI}/${spec.thresholdsComBanco.levelII}/${spec.thresholdsComBanco.levelIII}`);
console.log(`Teto avaliável com banco (nota de domínio): ${spec.notasDominio.tetoAvaliavelComBanco}`);
const b5 = spec.quantitativeBlocks.find((b: { id: string }) => b.id === 'bloco5').maxPontos;
const b6 = spec.quantitativeBlocks.find((b: { id: string }) => b.id === 'bloco6').maxPontos;
console.log(`Fatia ética (Blocos 5+6): ${b5 + b6}/${tetoBase} = ${((100 * (b5 + b6)) / tetoBase).toFixed(1)}%`);
console.log(`\nQuestões quant (base/com banco): ${baseBlocks.reduce((s: number, b: { questoes: unknown[] }) => s + b.questoes.length, 0)} / ${spec.quantitativeBlocks.reduce((s: number, b: { questoes: unknown[] }) => s + b.questoes.length, 0)}`);
console.log(`Descritivas (contexto): ${spec.contextQuestions.length}`);

if (apply) {
  writeFileSync(SPEC, JSON.stringify(spec, null, 2) + '\n', 'utf-8');
  console.log('\n>>> APLICADO: spec/mariah-spec.json agora é v2.0-draft.');
} else {
  console.log('\n(dry-run — nada gravado. Use --apply para gravar.)');
}
