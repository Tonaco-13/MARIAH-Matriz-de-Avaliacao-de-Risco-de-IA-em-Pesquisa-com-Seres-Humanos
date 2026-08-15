// ============================================================
// Fase 0.5 — Extração da spec (NO-OP) a partir do data.ts atual.
// Gera spec/mariah-spec.json byte-fiel aos dados de produção (v1).
// Rodar: npx tsx scripts/extract-spec.ts
// Depois, data.ts passa a IMPORTAR esta spec (sem mudar valores);
// o verify-math tem de continuar 46/46 idêntico ao baseline.
// ============================================================

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  RISK_LEVELS,
  QUALITATIVE_AXES,
  QUANTITATIVE_BLOCKS,
  THRESHOLDS_BASE,
  THRESHOLDS_COM_BANCO,
  REQUIREMENTS,
  REQUIREMENTS_RES738,
  DATABASE_FILTER_QUESTION,
  CONTEXT_QUESTIONS,
} from '../src/components/maria/data';

const spec = {
  // Versão da matriz. Esta extração inicial reflete o baseline congelado (guia v45).
  matrixVersion: '1.0.0-guia-v45',
  geradoEm: new Date().toISOString(),
  riskLevels: RISK_LEVELS,
  thresholdsBase: THRESHOLDS_BASE,
  thresholdsComBanco: THRESHOLDS_COM_BANCO,
  databaseFilterQuestion: DATABASE_FILTER_QUESTION,
  contextQuestions: CONTEXT_QUESTIONS,
  qualitativeAxes: QUALITATIVE_AXES,
  quantitativeBlocks: QUANTITATIVE_BLOCKS,
  requirements: REQUIREMENTS,
  requirementsRes738: REQUIREMENTS_RES738,
};

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'spec');
const outFile = join(outDir, 'mariah-spec.json');
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(spec, null, 2) + '\n', 'utf-8');

// Sanidade mínima (não substitui o verify-math):
const nQuali = QUALITATIVE_AXES.reduce((n, a) => n + a.questoes.length, 0);
const nQuant = QUANTITATIVE_BLOCKS.reduce((n, b) => n + b.questoes.length, 0);
console.log(`spec/mariah-spec.json gerado.`);
console.log(`  eixos: ${QUALITATIVE_AXES.length} | blocos: ${QUANTITATIVE_BLOCKS.length}`);
console.log(`  questões quali: ${nQuali} | quant: ${nQuant}`);
console.log(`  contexto: ${CONTEXT_QUESTIONS.length} | requisitos: ${REQUIREMENTS.length}+${REQUIREMENTS_RES738.length}`);
