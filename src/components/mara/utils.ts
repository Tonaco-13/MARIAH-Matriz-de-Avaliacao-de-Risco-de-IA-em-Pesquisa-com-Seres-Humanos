// ============================================================
// MARA - Calculation Utilities
// Versão com Res. CNS n.º 738/2024 (Eixo 3.b / Bloco 6.b)
// ============================================================

import {
  QUALITATIVE_AXES,
  QUANTITATIVE_BLOCKS,
  RISK_LEVELS,
  REQUIREMENTS,
  REQUIREMENTS_RES738,
  getThresholds,
} from './data';
import type {
  RiskLevel,
  RiskLevelInfo,
  QualitativeAxis,
  QuantitativeBlock,
  Requirement,
} from './data';

// ----- Helpers: filter axes/blocks by database filter -----

export function getApplicableAxes(usesDatabase: boolean): QualitativeAxis[] {
  return QUALITATIVE_AXES.filter((a) => !a.condicionalBancoDados || usesDatabase);
}

export function getApplicableBlocks(usesDatabase: boolean): QuantitativeBlock[] {
  return QUANTITATIVE_BLOCKS.filter((b) => !b.condicionalBancoDados || usesDatabase);
}

// ----- Qualitative (Version A) Calculations -----

export type QualitativeAnswer = Record<string, 'sim' | 'nao' | 'na' | undefined>;

export function countRiskAnswersAxis(axis: QualitativeAxis, answers: QualitativeAnswer): number {
  return axis.questoes.filter((q) => {
    const answer = answers[q.id];
    if (!answer) return false;
    return answer === q.riskAnswer;
  }).length;
}

/**
 * Mapeamento risco→nível para o eixo. Eixo 3.b (bancos de dados, Res 738)
 * usa regra especial: 0 → I (não eleva); 1-2 → III; 3+ → IV.
 */
export function getAxisRiskLevel(riskCount: number, axis?: QualitativeAxis): RiskLevel {
  if (axis?.elevacaoEspecial === 'banco-dados') {
    if (riskCount === 0) return 'I'; // não eleva (contribui como Nível I para consolidação)
    if (riskCount <= 2) return 'III';
    return 'IV';
  }
  // Regra padrão dos eixos 1-5
  if (riskCount === 0) return 'I';
  if (riskCount <= 2) return 'II';
  if (riskCount <= 4) return 'III';
  return 'IV';
}

export function getQualitativeAxisResults(
  answers: QualitativeAnswer,
  usesDatabase: boolean = false
) {
  return getApplicableAxes(usesDatabase).map((axis) => {
    const riskCount = countRiskAnswersAxis(axis, answers);
    const level = getAxisRiskLevel(riskCount, axis);
    return {
      axisId: axis.id,
      axisName: axis.nome,
      riskCount,
      totalQuestions: axis.questoes.length,
      level,
      levelInfo: RISK_LEVELS[level],
      condicionalBancoDados: !!axis.condicionalBancoDados,
      referenciaNormativa: axis.referenciaNormativa,
    };
  });
}

/**
 * Detecta se alguma questão eliminatória foi marcada com resposta de risco.
 * Retorna o ID da primeira questão eliminatória acionada, ou null.
 */
export function getEliminatoryQuestionTriggered(
  answers: Record<string, 'sim' | 'nao' | 'na' | undefined>,
  version: 'A' | 'B',
  usesDatabase: boolean
): string | null {
  if (!usesDatabase) return null;

  if (version === 'A') {
    for (const axis of getApplicableAxes(usesDatabase)) {
      for (const q of axis.questoes) {
        if (q.eliminatorio && answers[q.id] === q.riskAnswer) {
          return q.id;
        }
      }
    }
  } else {
    for (const block of getApplicableBlocks(usesDatabase)) {
      for (const q of block.questoes) {
        if (q.eliminatorio && answers[q.id] === q.riskAnswer) {
          return q.id;
        }
      }
    }
  }
  return null;
}

export function getQualitativeFinalLevel(
  answers: QualitativeAnswer,
  usesDatabase: boolean = false
): {
  level: RiskLevel;
  levelInfo: RiskLevelInfo;
  axisResults: ReturnType<typeof getQualitativeAxisResults>;
  clausulaPrevalencia: boolean;
  protocoloNaoAvaliavel: boolean;
  eliminatoryQuestionId: string | null;
} {
  const axisResults = getQualitativeAxisResults(answers, usesDatabase);

  // The final level is the HIGHEST across all axes
  const levelOrder: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  let highestLevel: RiskLevel = 'I';

  for (const result of axisResults) {
    if (levelOrder.indexOf(result.level) > levelOrder.indexOf(highestLevel)) {
      highestLevel = result.level;
    }
  }

  const eliminatoryQuestionId = getEliminatoryQuestionTriggered(answers, 'A', usesDatabase);

  return {
    level: highestLevel,
    levelInfo: RISK_LEVELS[highestLevel],
    axisResults,
    clausulaPrevalencia: false, // Versão A não usa Cláusula de Prevalência Ética
    protocoloNaoAvaliavel: eliminatoryQuestionId !== null,
    eliminatoryQuestionId,
  };
}

// ----- Quantitative (Version B) Calculations -----

/**
 * 'na' = "Não se aplica" — disponível apenas em questões condicionais
 * marcadas com `hasNaOption` em data.ts (atualmente P6.b.2, Res 738).
 * Tratado como resposta não-de-risco e não-eliminatória nos cálculos.
 */
export type QuantitativeAnswer = Record<string, 'sim' | 'nao' | 'na' | undefined>;

/**
 * Calcula a pontuação do bloco.
 *
 * Correção (2026-04): Bloco 7 Subbloco 7B agora é BIDIRECIONAL — as questões de
 * mitigação somam |pontos| quando respondidas como "não" (sem mitigação = risco
 * preservado) e subtraem |pontos| quando "sim" (mitigação aplicada). Isso alinha
 * o cálculo ao teto documentado de 238 pts na matriz (antes: teto real 173 pts).
 */
export function calculateBlockScore(block: QuantitativeBlock, answers: QuantitativeAnswer): number {
  let score = 0;

  for (const q of block.questoes) {
    const answer = answers[q.id];
    if (!answer) continue;

    if (q.efeito === 'mitigacao') {
      // Mitigação bidirecional:
      //   "Sim" = mitigação aplicada → subtrai |pontos|
      //   "Não" = sem mitigação → adiciona |pontos| (risco preservado)
      const abs = Math.abs(q.pontos);
      if (answer === 'sim') {
        score -= abs;
      } else {
        score += abs;
      }
    } else {
      // Questões de risco (e questões normais): a resposta de risco adiciona pontos
      if (answer === q.riskAnswer) {
        score += Math.abs(q.pontos);
      }
    }
  }

  // A pontuação do Bloco 7 não pode ser inferior a 0
  if (block.id === 'bloco7') {
    return Math.max(0, score);
  }

  return score;
}

export function getQuantitativeRiskLevel(score: number, usesDatabase: boolean = false): RiskLevel {
  const t = getThresholds(usesDatabase);
  if (score <= t.levelI) return 'I';
  if (score <= t.levelII) return 'II';
  if (score <= t.levelIII) return 'III';
  return 'IV';
}

export function checkClausulaPrevalencia(answers: QuantitativeAnswer): boolean {
  // If P4.1 or P4.2 is "Sim", Cláusula de Prevalência Ética is triggered
  return answers['P4.1'] === 'sim' || answers['P4.2'] === 'sim';
}

export function getQuantitativeBlockResults(
  answers: QuantitativeAnswer,
  usesDatabase: boolean = false
) {
  return getApplicableBlocks(usesDatabase).map((block) => {
    const score = calculateBlockScore(block, answers);
    return {
      blockId: block.id,
      blockName: block.nome,
      score,
      maxPontos: block.maxPontos,
      isBlock7: block.id === 'bloco7',
      condicionalBancoDados: !!block.condicionalBancoDados,
      referenciaNormativa: block.referenciaNormativa,
    };
  });
}

export function getQuantitativeTotalScore(
  answers: QuantitativeAnswer,
  usesDatabase: boolean = false
): number {
  let total = 0;
  for (const block of getApplicableBlocks(usesDatabase)) {
    total += calculateBlockScore(block, answers);
  }
  return Math.max(0, total); // Total não pode ser < 0
}

export function getQuantitativeFinalResult(
  answers: QuantitativeAnswer,
  usesDatabase: boolean = false
): {
  level: RiskLevel;
  levelInfo: RiskLevelInfo;
  totalScore: number;
  maxScore: number;
  blockResults: ReturnType<typeof getQuantitativeBlockResults>;
  clausulaPrevalencia: boolean;
  protocoloNaoAvaliavel: boolean;
  eliminatoryQuestionId: string | null;
  thresholds: ReturnType<typeof getThresholds>;
} {
  const totalScore = getQuantitativeTotalScore(answers, usesDatabase);
  const blockResults = getQuantitativeBlockResults(answers, usesDatabase);
  const clausulaPrevalencia = checkClausulaPrevalencia(answers);
  const thresholds = getThresholds(usesDatabase);

  const scoreLevel = getQuantitativeRiskLevel(totalScore, usesDatabase);

  // Cláusula de Prevalência Ética overrides to Level IV
  const finalLevel: RiskLevel = clausulaPrevalencia ? 'IV' : scoreLevel;

  const eliminatoryQuestionId = getEliminatoryQuestionTriggered(answers, 'B', usesDatabase);

  return {
    level: finalLevel,
    levelInfo: RISK_LEVELS[finalLevel],
    totalScore,
    maxScore: thresholds.maxScore,
    blockResults,
    clausulaPrevalencia,
    protocoloNaoAvaliavel: eliminatoryQuestionId !== null,
    eliminatoryQuestionId,
    thresholds,
  };
}

// ----- Requirements -----

export function getRequirementsForLevel(
  level: RiskLevel,
  usesDatabase: boolean = false
): Requirement[] {
  const levelOrder: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  const currentIndex = levelOrder.indexOf(level);

  const base = REQUIREMENTS.filter((r) => levelOrder.indexOf(r.nivel) <= currentIndex);
  if (!usesDatabase) return base;

  const res738 = REQUIREMENTS_RES738.filter((r) => levelOrder.indexOf(r.nivel) <= currentIndex);
  return [...base, ...res738];
}

// ----- Progress Calculation -----

export function calculateAnsweredCount(
  answers: Record<string, string | undefined>,
  questionIds: string[]
): number {
  return questionIds.filter((id) => answers[id] !== undefined).length;
}

// ----- Audit: itens não avaliados -----

/**
 * Item de auditoria — pergunta apresentada na avaliação que ficou sem resposta.
 * Usado no relatório (tela + impressão) para que o CEP saiba exatamente o que
 * deixou em branco e possa justificar / pedir diligência sobre.
 */
export type UnansweredItem = {
  /** Identificador interno (ex.: "P3.b.2", "titulo", "contexto1"). */
  id: string;
  /** Categoria — campo de contexto, pergunta de eixo (A) ou pergunta de bloco (B). */
  scope: 'contexto' | 'eixo' | 'bloco';
  /** Nome do eixo/bloco/seção a que o item pertence — ajuda a localizar no protocolo. */
  scopeName: string;
  /** Texto da pergunta ou rótulo do campo. */
  label: string;
};

const CONTEXT_FIELD_LABELS: { id: string; label: string }[] = [
  { id: 'titulo', label: 'Título do Projeto' },
  { id: 'instituicao', label: 'Instituição' },
  { id: 'cep_nome', label: 'Nome do CEP' },
  { id: 'contexto1', label: 'Pergunta do sistema (C1)' },
  { id: 'contexto2', label: 'Autonomia do sistema (C2)' },
];

/**
 * Retorna a lista de itens (campos de contexto + perguntas da matriz) que ficaram
 * sem resposta nesta avaliação. Em Versão B, "na" (não se aplica) **conta como
 * resposta** — só `undefined` é considerado "não avaliado".
 */
export function getUnansweredItems(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false
): UnansweredItem[] {
  const items: UnansweredItem[] = [];

  // 1) Campos de contexto (sempre obrigatórios, mas auditamos se algum ficou vazio
  //    — pode acontecer em fluxos restaurados de localStorage parcial).
  for (const f of CONTEXT_FIELD_LABELS) {
    const value = contextAnswers[f.id];
    if (!value || value.trim().length === 0) {
      items.push({
        id: f.id,
        scope: 'contexto',
        scopeName: 'Identificação e Contexto',
        label: f.label,
      });
    }
  }

  // 2) Perguntas da matriz, só as aplicáveis ao recorte (Res 738 ativada ou não).
  if (version === 'A') {
    for (const axis of getApplicableAxes(usesDatabase)) {
      for (const q of axis.questoes) {
        if (qualitativeAnswers[q.id] === undefined) {
          items.push({
            id: q.id,
            scope: 'eixo',
            scopeName: axis.nome,
            label: q.pergunta,
          });
        }
      }
    }
  } else {
    for (const block of getApplicableBlocks(usesDatabase)) {
      for (const q of block.questoes) {
        if (quantitativeAnswers[q.id] === undefined) {
          items.push({
            id: q.id,
            scope: 'bloco',
            scopeName: block.nome,
            label: q.pergunta,
          });
        }
      }
    }
  }

  return items;
}

// ----- Print/Export Helpers -----

const LEVEL_COLORS: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  I: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  II: { bg: '#fffbeb', text: '#b45309', border: '#fcd34d' },
  III: { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
  IV: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
};

/** Helper: HTML da seção de resultado da Versão A (qualitativa). */
function buildQualitativeSectionHTML(
  qualitativeAnswers: QualitativeAnswer,
  usesDatabase: boolean,
  heading: string = 'Resultado por Eixo'
): { html: string; level: RiskLevel; eliminatoryQuestionId: string | null } {
  const result = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase);
  const lc = LEVEL_COLORS[result.level];

  let axisRows = '';
  for (const axis of result.axisResults) {
    const alc = LEVEL_COLORS[axis.level];
    const ref = axis.referenciaNormativa
      ? `<br><span style="font-size:10px;color:#1d4ed8">${axis.referenciaNormativa}</span>`
      : '';
    axisRows += `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${axis.axisName}${ref}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${axis.riskCount}/${axis.totalQuestions}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">
          <span style="background:${alc.bg};color:${alc.text};padding:2px 10px;border-radius:4px;border:1px solid ${alc.border};font-weight:600;font-size:12px">
            Nível ${axis.level} — ${RISK_LEVELS[axis.level].label}
          </span>
        </td>
      </tr>`;
  }

  const html = `
    <div style="text-align:center;margin:24px 0;padding:20px;background:${lc.bg};border:2px solid ${lc.border};border-radius:8px">
      <div style="font-size:36px;font-weight:bold;color:${lc.text}">Nível ${result.level}</div>
      <div style="font-size:20px;font-weight:600;color:${lc.text};margin-top:4px">${result.levelInfo.label}</div>
      <p style="color:#6b7280;margin-top:8px;font-size:13px">${result.levelInfo.description}</p>
    </div>
    <h3 style="margin:20px 0 10px;font-size:15px;color:#374151">${heading}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#f9fafb">
          <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Eixo</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Respostas de Risco</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Nível</th>
        </tr>
      </thead>
      <tbody>${axisRows}</tbody>
    </table>
    <p style="margin-top:12px;font-size:12px;color:#6b7280"><strong>Consolidação:</strong> O nível final é o mais alto entre todos os eixos. Eixo 3.b (Res 738) usa elevação especial: 1-2 risco → III; 3+ → IV.</p>`;

  return { html, level: result.level, eliminatoryQuestionId: result.eliminatoryQuestionId };
}

/** Helper: HTML da seção de resultado da Versão B (quantitativa). */
function buildQuantitativeSectionHTML(
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean,
  heading: string = 'Resultado por Bloco'
): { html: string; level: RiskLevel; eliminatoryQuestionId: string | null } {
  const result = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase);
  const lc = LEVEL_COLORS[result.level];

  let blockRows = '';
  for (const block of result.blockResults) {
    const ref = block.referenciaNormativa
      ? `<br><span style="font-size:10px;color:#1d4ed8">${block.referenciaNormativa}</span>`
      : '';
    blockRows += `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${block.blockName}${ref}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:monospace">${block.score} / ${block.maxPontos} pts</td>
      </tr>`;
  }

  const clausulaSection = result.clausulaPrevalencia
    ? `
    <div style="margin:16px 0;padding:12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;font-size:13px;color:#dc2626">
      <strong>⚠️ Cláusula de Prevalência Ética ativada</strong><br>
      O protocolo foi elevado a Nível IV devido a P4.1 ou P4.2 = Sim.
    </div>`
    : '';

  const t = result.thresholds;
  const html = `
    <div style="text-align:center;margin:24px 0;padding:20px;background:${lc.bg};border:2px solid ${lc.border};border-radius:8px">
      <div style="font-size:36px;font-weight:bold;color:${lc.text}">Nível ${result.level}</div>
      <div style="font-size:20px;font-weight:600;color:${lc.text};margin-top:4px">${result.levelInfo.label}</div>
      <p style="color:#6b7280;margin-top:8px;font-size:13px">${result.levelInfo.description}</p>
      <div style="font-size:24px;font-weight:bold;color:${lc.text};margin-top:8px">${result.totalScore} / ${result.maxScore} pontos</div>
      <p style="color:#6b7280;margin-top:4px;font-size:11px">Faixas${usesDatabase ? ' (com Bloco 6.b — Res 738)' : ''}: I (0-${t.levelI}) · II (${t.levelI + 1}-${t.levelII}) · III (${t.levelII + 1}-${t.levelIII}) · IV (${t.levelIII + 1}-${t.maxScore})</p>
    </div>
    ${clausulaSection}
    <h3 style="margin:20px 0 10px;font-size:15px;color:#374151">${heading}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#f9fafb">
          <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Bloco</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Pontuação</th>
        </tr>
      </thead>
      <tbody>${blockRows}</tbody>
    </table>`;

  return { html, level: result.level, eliminatoryQuestionId: result.eliminatoryQuestionId };
}

/** Maior dos dois níveis (mais conservador) — usado para consolidar A+B no modo triagem. */
function highestLevel(a: RiskLevel, b: RiskLevel): RiskLevel {
  const order: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}

export function generateReportHTML(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false,
  /**
   * Quando true E o usuário percorreu A→B (modo triagem), o relatório inclui
   * AMBAS as matrizes. O nível final consolidado é o mais alto entre A e B
   * (mais conservador). Auditoria combina itens não avaliados das duas matrizes.
   */
  useAAsTriagem: boolean = false
): string {
  const date = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  // No modo triagem com B já percorrida, o relatório vira combinado.
  const isCombinedReport = useAAsTriagem && version === 'B';
  const versionLabel = isCombinedReport
    ? 'Triagem (A → B) — Relatório Combinado'
    : version === 'A' ? 'A — Qualitativa' : 'B — Quantitativa';
  const dbBadge = usesDatabase
    ? '<span style="background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">Banco de dados (Res 738)</span>'
    : '';

  let resultSection = '';
  let eliminatoryWarning = '';
  let eliminatoryIdForReport: string | null = null;

  if (isCombinedReport) {
    const qualSection = buildQualitativeSectionHTML(qualitativeAnswers, usesDatabase, 'Resultado por Eixo (Versão A — Triagem)');
    const quantSection = buildQuantitativeSectionHTML(quantitativeAnswers, usesDatabase, 'Resultado por Bloco (Versão B — Quantitativa)');
    eliminatoryIdForReport = quantSection.eliminatoryQuestionId ?? qualSection.eliminatoryQuestionId;

    resultSection = `
      <div style="margin:18px 0;padding:12px 14px;background:#f1f5f9;border-left:4px solid #475569;border-radius:4px;font-size:12px;color:#334155">
        <strong>Modo Triagem A → B.</strong> Este relatório consolida as duas matrizes percorridas pelo avaliador.
        O nível final consolidado é o <strong>mais alto entre as duas</strong> (critério mais conservador).
      </div>
      <h3 style="margin:24px 0 6px;font-size:16px;color:#0f766e;border-bottom:2px solid #0f766e;padding-bottom:4px">▌ Versão A — Qualitativa (Triagem)</h3>
      ${qualSection.html}
      <h3 style="margin:32px 0 6px;font-size:16px;color:#334155;border-bottom:2px solid #334155;padding-bottom:4px">▌ Versão B — Quantitativa</h3>
      ${quantSection.html}`;
  } else if (version === 'A') {
    const built = buildQualitativeSectionHTML(qualitativeAnswers, usesDatabase);
    resultSection = built.html;
    eliminatoryIdForReport = built.eliminatoryQuestionId;
  } else {
    const built = buildQuantitativeSectionHTML(quantitativeAnswers, usesDatabase);
    resultSection = built.html;
    eliminatoryIdForReport = built.eliminatoryQuestionId;
  }

  if (eliminatoryIdForReport) {
    eliminatoryWarning = `
      <div style="margin:16px 0;padding:14px;background:#fef2f2;border:2px solid #dc2626;border-radius:6px;font-size:13px;color:#7f1d1d">
        <strong>⛔ Hipótese eliminatória acionada (${eliminatoryIdForReport})</strong><br>
        Ausência de cadeia de custódia formalizada (Res. CNS n.º 738/2024 — Art. 27, VI). O protocolo NÃO É AVALIÁVEL NO MÉRITO e segue para diligência obrigatória, conforme §7.3.6 do Capítulo 7, independentemente da pontuação total.
      </div>`;
  }

  // Requirements section — usa o nível mais alto entre A e B no modo triagem
  // (critério mais conservador para a checklist do CEP).
  let finalLevel: RiskLevel;
  if (isCombinedReport) {
    const lvlA = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase).level;
    const lvlB = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase).level;
    finalLevel = highestLevel(lvlA, lvlB);
  } else if (version === 'A') {
    finalLevel = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase).level;
  } else {
    finalLevel = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase).level;
  }
  const requirements = getRequirementsForLevel(finalLevel, usesDatabase);

  let reqItems = '';
  for (const req of requirements) {
    const rlc = LEVEL_COLORS[req.nivel];
    const isRes738 = req.id.startsWith('req-738');
    const tagRes738 = isRes738
      ? '<span style="background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;padding:0 4px;border-radius:3px;font-size:10px;margin-right:4px">Res 738</span>'
      : '';
    reqItems += `
      <li style="margin:6px 0;font-size:13px">
        <span style="background:${rlc.bg};color:${rlc.text};padding:1px 6px;border-radius:3px;font-size:11px;font-weight:600;border:1px solid ${rlc.border}">Nível ${req.nivel}</span>
        ${tagRes738}${req.texto}
      </li>`;
  }

  // ----- Audit: itens não avaliados -----
  // No modo triagem, combinamos as duas matrizes (sem duplicar campos de contexto).
  let unanswered: UnansweredItem[];
  if (isCombinedReport) {
    const fromA = getUnansweredItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
    const fromBOnlyMatrix = getUnansweredItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase)
      .filter((it) => it.scope !== 'contexto'); // contexto já está em fromA
    unanswered = [...fromA, ...fromBOnlyMatrix];
  } else {
    unanswered = getUnansweredItems(
      version,
      contextAnswers,
      qualitativeAnswers,
      quantitativeAnswers,
      usesDatabase
    );
  }

  let unansweredSection = '';
  if (unanswered.length === 0) {
    unansweredSection = `
      <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">Itens não avaliados (auditoria)</h3>
      <div style="padding:12px;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;font-size:12px;color:#15803d">
        ✓ Todas as perguntas aplicáveis e campos de contexto foram preenchidos.
      </div>`;
  } else {
    // Agrupa por scopeName para o relatório ficar legível.
    const byScope = new Map<string, UnansweredItem[]>();
    for (const item of unanswered) {
      const arr = byScope.get(item.scopeName) ?? [];
      arr.push(item);
      byScope.set(item.scopeName, arr);
    }
    let groupsHtml = '';
    for (const [scopeName, list] of byScope) {
      let rows = '';
      for (const it of list) {
        rows += `<li style="margin:3px 0;font-size:12px"><strong style="font-family:monospace;color:#7f1d1d">${it.id}</strong> — ${it.label}</li>`;
      }
      groupsHtml += `
        <div style="margin-top:8px">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#374151">${scopeName}</p>
          <ul style="padding-left:18px;margin:0">${rows}</ul>
        </div>`;
    }
    unansweredSection = `
      <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">Itens não avaliados (auditoria)</h3>
      <div style="padding:14px;background:#fffbeb;border:1px solid #fbbf24;border-radius:6px;font-size:12px;color:#78350f">
        <p style="margin:0 0 8px;font-weight:600">⚠️ ${unanswered.length} ite${unanswered.length === 1 ? 'm' : 'ns'} sem avaliação registrada.</p>
        <p style="margin:0 0 8px">Para fins de auditoria, listamos abaixo cada pergunta apresentada que ficou sem resposta. O cálculo do nível de risco trata <strong>ausência de resposta como "não risco" por padrão</strong>; recomenda-se que o CEP justifique cada item ou solicite diligência ao pesquisador antes de deliberar.</p>
        ${groupsHtml}
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>MARA — Relatório de Avaliação de Risco Algorítmico</title>
  <style>
    @media print { body { padding: 20px; } }
  </style>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1f2937;line-height:1.5">
  <div style="border-bottom:3px solid #0f766e;padding-bottom:16px;margin-bottom:24px">
    <h1 style="margin:0;font-size:24px;color:#0f766e">MARA</h1>
    <p style="margin:4px 0 0;font-size:14px;color:#6b7280">Matriz de Avaliação de Risco Algorítmico</p>
  </div>

  <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;margin-bottom:20px;flex-wrap:wrap;gap:8px">
    <span><strong>Versão:</strong> ${versionLabel} ${dbBadge}</span>
    <span><strong>Data:</strong> ${date}</span>
  </div>

  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
    <h3 style="margin:0 0 10px;font-size:14px;color:#374151">Identificação do Protocolo</h3>
    <p style="margin:0 0 6px;font-size:13px"><strong>Título do Projeto:</strong> ${contextAnswers['titulo'] || 'Não informado'}</p>
    <p style="margin:0 0 6px;font-size:13px"><strong>Instituição:</strong> ${contextAnswers['instituicao'] || 'Não informado'}</p>
    <p style="margin:0;font-size:13px"><strong>Nome do CEP:</strong> ${contextAnswers['cep_nome'] || 'Não informado'}</p>
  </div>

  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
    <h3 style="margin:0 0 10px;font-size:14px;color:#374151">Caracterização do Contexto</h3>
    <p style="margin:0 0 8px;font-size:13px"><strong>Pergunta do sistema:</strong> ${contextAnswers['contexto1'] || 'Não informado'}</p>
    <p style="margin:0 0 8px;font-size:13px"><strong>Autonomia do sistema:</strong> ${contextAnswers['contexto2'] || 'Não informado'}</p>
    <p style="margin:0;font-size:13px"><strong>Utiliza banco de dados:</strong> ${usesDatabase ? 'Sim — Eixo 3.b / Bloco 6.b ativados (Res. CNS n.º 738/2024)' : 'Não'}</p>
  </div>

  ${eliminatoryWarning}
  ${resultSection}

  <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">Requisitos (cumulativos)</h3>
  <ul style="padding-left:20px">${reqItems}</ul>

  ${unansweredSection}

  <div style="margin-top:32px;padding:12px;background:#fffbeb;border:1px dashed #fbbf24;border-radius:6px;font-size:12px;color:#92400e">
    <strong>Aviso:</strong> A MARA não aprova nem reprova protocolos. Não substitui o julgamento do CEP. Não dispensa a deliberação colegiada.
  </div>

  <div style="margin-top:24px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;line-height:1.6">
    MARA — Matriz de Avaliação de Risco Algorítmico • Gerado em ${date}
    <br>
    Desenvolvido pelo Ministério da Saúde para o Sistema Nacional de Ética em Pesquisa com Seres Humanos (SINEP)
    <br>
    <span style="font-size:10px">Licenciado sob a Licença Pública Geral do Software Público Brasileiro (LPG-SPB)</span>
  </div>
</body>
</html>`;
}

export function generateReportText(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false,
  /** Idem ao generateReportHTML — quando triagem A→B, gera relatório combinado. */
  useAAsTriagem: boolean = false
): string {
  const lines: string[] = [];
  const isCombinedReport = useAAsTriagem && version === 'B';

  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('MARA — Matriz de Avaliação de Risco Algorítmico');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`Versão: ${
    isCombinedReport
      ? 'Triagem (A → B) — Relatório Combinado'
      : version === 'A' ? 'A — Qualitativa' : 'B — Quantitativa'
  }`);
  lines.push(`Data: ${new Date().toLocaleDateString('pt-BR')}`);
  lines.push(`Utiliza banco de dados: ${usesDatabase ? 'Sim (Res 738)' : 'Não'}`);
  lines.push('');

  // Identification + Context
  lines.push('── IDENTIFICAÇÃO DO PROTOCOLO ──');
  lines.push(`Título do Projeto: ${contextAnswers['titulo'] || 'Não informado'}`);
  lines.push(`Instituição: ${contextAnswers['instituicao'] || 'Não informado'}`);
  lines.push(`Nome do CEP: ${contextAnswers['cep_nome'] || 'Não informado'}`);
  lines.push('');
  lines.push('── CARACTERIZAÇÃO DO CONTEXTO ──');
  lines.push(`Sistema de IA: ${contextAnswers['contexto1'] || 'Não informado'}`);
  lines.push(`Contexto de uso: ${contextAnswers['contexto2'] || 'Não informado'}`);
  lines.push('');

  const renderQual = () => {
    const result = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase);
    lines.push(`Nível ${result.level} — ${result.levelInfo.label}`);
    if (result.protocoloNaoAvaliavel) {
      lines.push('');
      lines.push(`⛔ PROTOCOLO NÃO AVALIÁVEL NO MÉRITO (eliminatório em ${result.eliminatoryQuestionId})`);
      lines.push('   → Diligência obrigatória (§7.3.6 / Res 738)');
    }
    lines.push('');
    for (const axis of result.axisResults) {
      lines.push(`${axis.axisName}`);
      lines.push(
        `  Respostas de risco: ${axis.riskCount}/${axis.totalQuestions} → Nível ${axis.level} (${RISK_LEVELS[axis.level].label})`
      );
    }
  };

  const renderQuant = () => {
    const result = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase);
    lines.push(`Nível ${result.level} — ${result.levelInfo.label}`);
    lines.push(`Pontuação total: ${result.totalScore}/${result.maxScore}`);
    if (result.clausulaPrevalencia) {
      lines.push('');
      lines.push('⚠️ CLÁUSULA DE PREVALÊNCIA ÉTICA ATIVADA');
      lines.push('O protocolo foi elevado a Nível IV devido a P4.1 ou P4.2 = Sim');
    }
    if (result.protocoloNaoAvaliavel) {
      lines.push('');
      lines.push(`⛔ PROTOCOLO NÃO AVALIÁVEL NO MÉRITO (eliminatório em ${result.eliminatoryQuestionId})`);
      lines.push('   → Diligência obrigatória (§7.3.6 / Res 738)');
    }
    lines.push('');
    for (const block of result.blockResults) {
      lines.push(`${block.blockName}: ${block.score} pts`);
    }
  };

  if (isCombinedReport) {
    lines.push('── RESULTADO FINAL — VERSÃO A (TRIAGEM) ──');
    renderQual();
    lines.push('');
    lines.push('── RESULTADO FINAL — VERSÃO B (QUANTITATIVA) ──');
    renderQuant();
    lines.push('');
    lines.push('Nota: o nível consolidado para os requisitos é o MAIS ALTO entre A e B.');
  } else if (version === 'A') {
    lines.push('── RESULTADO FINAL ──');
    renderQual();
  } else {
    lines.push('── RESULTADO FINAL ──');
    renderQuant();
  }

  // Itens não avaliados — auditoria (combina A+B no modo triagem, sem duplicar contexto).
  let unanswered: UnansweredItem[];
  if (isCombinedReport) {
    const fromA = getUnansweredItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
    const fromBOnlyMatrix = getUnansweredItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase)
      .filter((it) => it.scope !== 'contexto');
    unanswered = [...fromA, ...fromBOnlyMatrix];
  } else {
    unanswered = getUnansweredItems(
      version,
      contextAnswers,
      qualitativeAnswers,
      quantitativeAnswers,
      usesDatabase
    );
  }
  lines.push('');
  lines.push('── ITENS NÃO AVALIADOS (AUDITORIA) ──');
  if (unanswered.length === 0) {
    lines.push('✓ Todas as perguntas aplicáveis e campos foram preenchidos.');
  } else {
    lines.push(`⚠️ ${unanswered.length} item(ns) sem resposta. Ausência tratada como "não risco" no cálculo.`);
    let lastScope = '';
    for (const it of unanswered) {
      if (it.scopeName !== lastScope) {
        lines.push('');
        lines.push(`[${it.scopeName}]`);
        lastScope = it.scopeName;
      }
      lines.push(`  • ${it.id} — ${it.label}`);
    }
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');

  return lines.join('\n');
}
