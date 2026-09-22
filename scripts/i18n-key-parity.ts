// ============================================================
// i18n-key-parity — paridade de chaves entre locales (B2)
//                    (feat/i18n-es, Passo 0 — condição §6.1 do Z)
// ------------------------------------------------------------
// Bloqueante B2 do Z: "chave de mensagem ausente ou órfã em qualquer
// localidade". Este guarda compara o conjunto de chaves (caminhos folha) de
// cada `messages/<locale>.json` contra a REFERÊNCIA canônica `pt-BR.json`:
//   - chave presente em pt-BR e ausente no locale  → AUSENTE (falha)
//   - chave presente no locale e ausente em pt-BR   → ÓRFÃ  (falha)
// Valores (o texto traduzido) NÃO são comparados — só a topologia de chaves;
// plural/rich ICU vivem dentro do valor, não criam sub-chaves.
//
// Dois modos (tradução em lotes — Opção A, LOG #21):
//   - PADRÃO (npm run gate): ÓRFÃ sempre reprova (chave que não existe em pt-BR
//     — typo/lixo). AUSENTE vira AVISO não-bloqueante, porque durante a
//     construção lote a lote o `es.json` é legitimamente parcial. Assim o gate
//     fica verde por lote sem shippar pt-BR provisório.
//   - ESTRITO (`--strict` ou env I18N_KEYS_STRICT=1; `npm run i18n:key-parity:strict`):
//     AUSENTE também reprova. É o modo do lote final e da auditoria do Z —
//     completude é propriedade final (B2 pleno).
//
// Estado nesta abertura de branch: só existe pt-BR → 0 locales, guarda VERDE.
// Roda no `npm run gate` (lógica pura, sem build). Regra de ouro B7 preservada:
// este script não lê números da matriz.
// ============================================================

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const ROOT = resolve(__dirname, '..');
const MESSAGES_DIR = join(ROOT, 'messages');
const REFERENCE = 'pt-BR';

function flatten(obj: unknown, prefix: string, out: Set<string>): Set<string> {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
      else out.add(key);
    }
  }
  return out;
}

const STRICT = process.argv.includes('--strict') || process.env.I18N_KEYS_STRICT === '1';

const files = readdirSync(MESSAGES_DIR).filter((f) => f.endsWith('.json'));
const refPath = join(MESSAGES_DIR, `${REFERENCE}.json`);
const refKeys = flatten(JSON.parse(readFileSync(refPath, 'utf8')), '', new Set());

const failures: string[] = [];
const warnings: string[] = [];
let checked = 0;

for (const f of files) {
  const locale = basename(f, '.json');
  if (locale === REFERENCE) continue;
  checked += 1;
  const keys = flatten(JSON.parse(readFileSync(join(MESSAGES_DIR, f), 'utf8')), '', new Set());
  const missing = [...refKeys].filter((k) => !keys.has(k));
  const orphan = [...keys].filter((k) => !refKeys.has(k));
  if (orphan.length) {
    // órfã: sempre bloqueia (chave inexistente em pt-BR)
    failures.push(`[${locale}] ${orphan.length} chave(s) ÓRFÃ(s): ${orphan.slice(0, 12).join(', ')}${orphan.length > 12 ? ' …' : ''}`);
  }
  if (missing.length) {
    const msg = `[${locale}] ${missing.length}/${refKeys.size} chave(s) AUSENTE(s): ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ' …' : ''}`;
    (STRICT ? failures : warnings).push(msg);
  }
}

console.log('=== i18n key-parity — messages/<locale> × pt-BR (B2) ===');
console.log(`  referência: ${REFERENCE}.json (${refKeys.size} chaves) · locales verificados: ${checked} · modo: ${STRICT ? 'ESTRITO' : 'padrão (ausente = aviso)'}`);

if (warnings.length) {
  console.log(`\n  Avisos (não bloqueiam — tradução em lotes):`);
  for (const w of warnings) console.log('    · ' + w);
}

if (failures.length) {
  console.log(`\nFALHOU: ${failures.length} divergência(s) bloqueante(s):`);
  for (const x of failures) console.log('  ✗ ' + x);
  process.exit(1);
}
console.log(`\nOK: sem chaves órfãs${STRICT ? ' nem ausentes (completude B2)' : ''} em ${checked} locale(s).`);
