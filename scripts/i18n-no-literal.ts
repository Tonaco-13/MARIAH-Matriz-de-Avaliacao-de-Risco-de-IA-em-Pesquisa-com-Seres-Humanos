// ============================================================
// i18n-no-literal — guarda de regressão da infraestrutura i18n
//                   (feat/i18n-architecture, Passo 8 / P8)
// ------------------------------------------------------------
// Condição vinculante da Arquitetura: a "regra de ouro" (B7) e a extração de
// texto para next-intl saem PROVADAS a cada gate, não afirmadas. Reúne DOIS
// checks nomeados, num único arquivo, e roda no `npm run gate`:
//
//   (A) ZERO-LITERAL JSX  — nenhum literal de texto em pt-BR pode estar
//       hard-coded em src/**/*.tsx. A casca da UI foi extraída para
//       messages/pt-BR.json e é lida por t()/t.rich(); o conteúdo da matriz vem
//       da spec via data.ts e é renderizado por expressão ({q.pergunta}), nunca
//       como literal. A varredura usa o PARSER do TypeScript (não regex): visita
//       nós `JsxText` (texto entre tags) e literais-string de atributos humanos
//       (title/placeholder/alt/aria-label). Assim, código (=>, genéricos,
//       ternários, chamadas t()) nunca é confundido com texto. Sinal de pt-BR =
//       acento latino OU palavra-domínio inequívoca (lista curada, sem colisão
//       com inglês/técnico). Reintroduzir texto pt-BR no JSX faz o check falhar.
//
//   (B) GOLDEN-RULE       — números/pesos/cortes/ids/matrixVersion nunca viram
//       texto traduzível. Duas superfícies:
//         B1. Campos `i18n` da spec (camada de tradução do conteúdo da matriz):
//             PRESERVAÇÃO — o conjunto de tokens da regra de ouro (números de
//             corte/teto, ids de questão, matrixVersion) no valor traduzido deve
//             ser IGUAL ao do canônico pt-BR do mesmo campo. Tradução preserva
//             referências; introduzir, alterar ou remover um número/id é erro.
//             (Dicas legitimamente citam ids/leis como cross-refs — o que se
//             proíbe é traduzir/alterar esses tokens, não cita-los.)
//         B2. Valores de messages/*.json (casca de UI): FALHA se contiver número
//             de corte/teto da matriz OU a matrixVersion. NÃO falha por id de
//             questão: a casca legitimamente ancora questões na narrativa de
//             ajuda ("Se P4.1…"), onde o id é REFERÊNCIA neutra, não a máquina de
//             pontuação. Essas âncoras — identificadas pelo conjunto de ids REAIS
//             da spec, para não confundir com leis (14.874) ou versões (2.0) —
//             são apenas CONTADAS (aviso informativo, não bloqueiam).
//
// Regra de ouro (B7): este script não fixa número/id/versão próprios — lê tudo
// da spec (matrixVersion e ids reais) para proibir apenas o que a matriz define.
// ============================================================

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import * as ts from 'typescript';

const ROOT = resolve(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const MESSAGES_DIR = join(ROOT, 'messages');
const SPEC_PATH = join(ROOT, 'spec', 'mariah-spec.json');

// ------------------------------------------------------------
// Fonte de verdade (lida da matriz, não inventada aqui)
// ------------------------------------------------------------
const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8')) as Record<string, unknown>;
const MATRIX_VERSION = String(spec.matrixVersion); // ex.: "2.2.0"

// Constantes de pontuação da matriz (B7). Todas confirmadas ausentes dos messages.
const FORBIDDEN_NUMBERS = [
  58, 127, 208, // cortes base   I|II|III
  64, 141, 230, // cortes banco  I|II|III
  209, 231,     // mínimos de Nível IV (base / banco)
  275, 304,     // tetos de pontuação (base / banco)
  297,          // teto worst-case com banco (gate V6g)
  62, 77, 75,   // somas de bloco (5 / 6 / 7)
  29,           // teto do Bloco 6.b
];

// Conjunto de ids REAIS de questão, extraído da spec (chaves "id" que começam
// com [P]dígito: P6.b.2, 3.b.2, 5.8, P2.8, 1.2 …). Exclui ids textuais
// (req-IV-4, eixo-…) e, por construção, leis/versões.
const REAL_IDS = new Set<string>();
(function collectIds(node: unknown): void {
  if (Array.isArray(node)) node.forEach(collectIds);
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'id' && typeof v === 'string' && /^[Pp]?\d/.test(v)) REAL_IDS.add(v);
      else collectIds(v);
    }
  }
})(spec);

// id-shaped genérico (para B1, estrito): P4.1, P6.b.2, 3.b.2, 5.8 …
const QUESTION_ID_RE = /\b[Pp]?\d+(?:\.[a-zA-Z0-9]+)+\b/g;

const failures: string[] = [];

function walk(dir: string, ext: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, ext, acc);
    else if (p.endsWith(ext)) acc.push(p);
  }
  return acc;
}
const rel = (p: string) => p.slice(ROOT.length + 1);

// Sinal de pt-BR: acento OU palavra inequívoca (sem colisão com inglês/técnico).
const ACCENT_RE = /[áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ]/;
const PT_WORDS = [
  'nao', 'voce', 'avaliacao', 'questao', 'risco', 'protocolo', 'pesquisa',
  'matriz', 'eixo', 'bloco', 'nivel', 'pergunta', 'resposta', 'selecione',
  'reiniciar', 'limpar', 'continuar', 'anterior', 'proximo', 'consolidacao',
  'pontuacao', 'mitigacao', 'diretrizes', 'requisito', 'salvaguarda',
];
const PT_WORDS_RE = new RegExp(`\\b(?:${PT_WORDS.join('|')})\\b`, 'i');
const ALLOW_TOKENS = /^(?:MARIAH?|INAEP|MS|SCTIE|Decit|CGAEP|PDF|JSON|CSV|CEPs?|IA|LGPD|CNS|RDC|Gov\.br|UTF-8|HTML)$/;

function isPtLiteral(text: string): boolean {
  const cleaned = text.trim();
  if (!cleaned) return false;
  if (ALLOW_TOKENS.test(cleaned)) return false;
  return ACCENT_RE.test(cleaned) || PT_WORDS_RE.test(cleaned);
}

function containsForbiddenNumber(value: string): number | null {
  for (const n of FORBIDDEN_NUMBERS) {
    // token isolado: não parte de decimal/percentual/ano
    if (new RegExp(`(?<![\\d.,])${n}(?![\\d.,%])`).test(value)) return n;
  }
  return null;
}

// ============================================================
// CHECK A — zero-literal JSX (via parser TypeScript)
// ============================================================
const HUMAN_ATTRS = new Set(['title', 'placeholder', 'alt', 'aria-label']);

function checkA(): void {
  const files = walk(SRC_DIR, '.tsx');
  for (const file of files) {
    const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
      if (ts.isJsxText(node)) {
        if (isPtLiteral(node.text)) {
          failures.push(`[A] ${rel(file)}: text-node JSX com literal pt-BR: "${node.text.trim().slice(0, 60)}"`);
        }
      } else if (ts.isJsxAttribute(node) && node.initializer) {
        const name = node.name.getText(sf);
        if (HUMAN_ATTRS.has(name) && ts.isStringLiteral(node.initializer) && isPtLiteral(node.initializer.text)) {
          failures.push(`[A] ${rel(file)}: atributo ${name}="…" com literal pt-BR: "${node.initializer.text.slice(0, 60)}"`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  console.log(`  (A) zero-literal JSX: ${files.length} arquivos .tsx varridos (parser TS)`);
}

// ============================================================
// CHECK B — golden-rule
// ============================================================
function collectStrings(node: unknown, path: string, out: Array<{ path: string; value: string }>): void {
  if (typeof node === 'string') out.push({ path, value: node });
  else if (Array.isArray(node)) node.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) collectStrings(v, path ? `${path}.${k}` : k, out);
}

// Tokens da regra de ouro num texto: números de corte/teto, ids de questão e
// matrixVersion — ordenados, para comparar es × canônico (preservação).
function goldenTokens(s: string): string[] {
  const out: string[] = [];
  for (const n of FORBIDDEN_NUMBERS) {
    const m = s.match(new RegExp(`(?<![\\d.,])${n}(?![\\d.,%])`, 'g'));
    if (m) for (const x of m) out.push(`num:${x}`);
  }
  for (const id of s.match(QUESTION_ID_RE) ?? []) out.push(`id:${id}`);
  for (const v of s.match(new RegExp(MATRIX_VERSION.replace(/\./g, '\\.'), 'g')) ?? []) out.push(`ver:${v}`);
  return out.sort();
}

// Visita cada campo traduzido sob uma chave `i18n`:
// (path, locale, campo, valor_traduzido, valor_canônico).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function walkI18n(node: any, path: string, visit: (p: string, loc: string, field: string, esVal: unknown, canon: unknown) => void): void {
  if (Array.isArray(node)) { node.forEach((v, i) => walkI18n(v, `${path}[${i}]`, visit)); return; }
  if (!node || typeof node !== 'object') return;
  if (node.i18n && typeof node.i18n === 'object') {
    for (const [loc, fields] of Object.entries(node.i18n)) {
      if (fields && typeof fields === 'object') {
        for (const [field, val] of Object.entries(fields as Record<string, unknown>)) {
          visit(path, loc, field, val, node[field]);
        }
      }
    }
  }
  for (const [k, v] of Object.entries(node)) if (k !== 'i18n') walkI18n(v, path ? `${path}.${k}` : k, visit);
}

function checkB(): void {
  // B1 — campos i18n da spec: PRESERVAÇÃO (sanção LOG). Os tokens da regra de
  // ouro (números de corte/teto, ids de questão, matrixVersion) no valor
  // traduzido devem ser IGUAIS aos do canônico pt-BR do mesmo campo — tradução
  // preserva referências, nunca introduz/altera/remove número ou id.
  let i18nChecked = 0;
  walkI18n(spec, '', (path, loc, field, esVal, canon) => {
    i18nChecked += 1;
    if (typeof esVal !== 'string') {
      failures.push(`[B1] spec ${path}.i18n.${loc}.${field}: valor não é string (${typeof esVal})`);
      return;
    }
    const tEs = goldenTokens(esVal);
    const tCanon = goldenTokens(typeof canon === 'string' ? canon : '');
    if (JSON.stringify(tEs) !== JSON.stringify(tCanon)) {
      failures.push(`[B1] spec ${path}.i18n.${loc}.${field}: tokens da regra de ouro divergem do canônico — ${loc}=[${tEs.join(', ')}] canônico=[${tCanon.join(', ')}]`);
    }
  });
  console.log(`  (B1) golden-rule / campos i18n da spec: ${i18nChecked} campo(s) traduzido(s) verificado(s) (preservação vs. canônico)`);

  // B2 — messages/*.json (número/versão FALHAM; id real é aviso informativo)
  const msgFiles = walk(MESSAGES_DIR, '.json');
  let msgValues = 0;
  let realIdAnchors = 0;
  for (const file of msgFiles) {
    const strings: Array<{ path: string; value: string }> = [];
    collectStrings(JSON.parse(readFileSync(file, 'utf8')), '', strings);
    for (const { path, value } of strings) {
      msgValues += 1;
      const num = containsForbiddenNumber(value);
      if (num !== null) failures.push(`[B2] ${rel(file)} ${path}: número de corte/teto da matriz em texto de UI: ${num}`);
      if (value.includes(MATRIX_VERSION)) failures.push(`[B2] ${rel(file)} ${path}: matrixVersion (${MATRIX_VERSION}) em texto de UI`);
      for (const tok of value.match(QUESTION_ID_RE) ?? []) if (REAL_IDS.has(tok)) realIdAnchors += 1;
    }
  }
  console.log(`  (B2) golden-rule / messages: ${msgValues} valor(es); ${realIdAnchors} âncora(s) de id REAL em narrativa (informativo, não bloqueia)`);
}

// ============================================================
console.log('=== i18n no-literal — guarda de regressão (Check A + Check B) ===');
console.log(`  matrixVersion (spec): ${MATRIX_VERSION} · ids reais na spec: ${REAL_IDS.size}`);
checkA();
checkB();

if (failures.length > 0) {
  console.log(`\nFALHOU: ${failures.length} violação(ões) da regra:`);
  for (const f of failures.slice(0, 40)) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('\nOK: (A) sem literal pt-BR no JSX; (B1) tokens da regra de ouro preservados (es === canônico) nos campos i18n; (B2) sem número de corte/versão nos messages.');
