// ============================================================
// M1 — paridade de enunciados spec × guia v46 (camada de strings).
// Compara cada pergunta da spec com o enunciado canônico do guia
// (gate/enunciados-guia-v46.json, extraído dos quadros do DOCX).
// Qualquer divergência (normalizada por espaços/NFC) falha (exit 1)
// e bloqueia a publicação — impede reincidência das divergências B2.
//
// Rodar:  npx tsx scripts/parity-check.ts
// ============================================================
import { readFileSync } from 'node:fs';

type Q = { id: string; pergunta: string };
type Spec = {
  qualitativeAxes: { questoes: Q[] }[];
  quantitativeBlocks: { questoes: Q[] }[];
};

const spec = JSON.parse(readFileSync('spec/mariah-spec.json', 'utf-8')) as Spec;
const guia = JSON.parse(readFileSync('gate/enunciados-guia-v46.json', 'utf-8')) as Record<string, string>;

const norm = (s: string) => (s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

const perguntas: Record<string, string> = {};
for (const a of spec.qualitativeAxes) for (const q of a.questoes) perguntas[q.id] = q.pergunta;
for (const b of spec.quantitativeBlocks) for (const q of b.questoes) perguntas[q.id] = q.pergunta;

let divergencias = 0;
let semGuia = 0;
const ids = Object.keys(perguntas).sort();

for (const id of ids) {
  const g = guia[id];
  if (g === undefined) {
    semGuia++;
    console.log(`  ⚠ ${id}: sem enunciado correspondente no guia`);
    continue;
  }
  if (norm(perguntas[id]) !== norm(g)) {
    divergencias++;
    console.log(`  ✗ ${id}`);
    console.log(`    spec: ${norm(perguntas[id])}`);
    console.log(`    guia: ${norm(g)}`);
  }
}

console.log(`\n=== PARIDADE spec × guia v46 ===`);
console.log(`  Enunciados conferidos: ${ids.length}`);
console.log(`  Divergências: ${divergencias}${semGuia ? ` | sem guia: ${semGuia}` : ''}`);
if (divergencias > 0 || semGuia > 0) {
  console.log('  BLOQUEIA PUBLICAÇÃO — harmonizar a spec ao guia (ou registrar waiver do GT).');
  process.exit(1);
}
console.log('  ✓ Paridade 1:1 com o guia v46.');
process.exit(0);
