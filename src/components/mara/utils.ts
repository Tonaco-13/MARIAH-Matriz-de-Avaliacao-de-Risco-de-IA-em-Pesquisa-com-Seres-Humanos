// ============================================================
// MARA - Calculation Utilities
// ============================================================

import { QUALITATIVE_AXES, QUANTITATIVE_BLOCKS, RISK_LEVELS, REQUIREMENTS } from './data';
import type { RiskLevel, RiskLevelInfo, QualitativeAxis, QuantitativeBlock, Requirement } from './data';

// ----- Qualitative (Version A) Calculations -----

export type QualitativeAnswer = Record<string, 'sim' | 'nao' | undefined>;

export function countRiskAnswersAxis(axis: QualitativeAxis, answers: QualitativeAnswer): number {
  return axis.questoes.filter((q) => {
    const answer = answers[q.id];
    if (!answer) return false;
    return answer === q.riskAnswer;
  }).length;
}

export function getAxisRiskLevel(riskCount: number): RiskLevel {
  if (riskCount === 0) return 'I';
  if (riskCount <= 2) return 'II';
  if (riskCount <= 4) return 'III';
  return 'IV';
}

export function getQualitativeAxisResults(answers: QualitativeAnswer) {
  return QUALITATIVE_AXES.map((axis) => {
    const riskCount = countRiskAnswersAxis(axis, answers);
    const level = getAxisRiskLevel(riskCount);
    return {
      axisId: axis.id,
      axisName: axis.nome,
      riskCount,
      totalQuestions: axis.questoes.length,
      level,
      levelInfo: RISK_LEVELS[level],
    };
  });
}

export function getQualitativeFinalLevel(answers: QualitativeAnswer): {
  level: RiskLevel;
  levelInfo: RiskLevelInfo;
  axisResults: ReturnType<typeof getQualitativeAxisResults>;
  clausulaPrevalencia: boolean;
} {
  const axisResults = getQualitativeAxisResults(answers);

  // The final level is the HIGHEST across all axes
  const levelOrder: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  let highestLevel: RiskLevel = 'I';

  for (const result of axisResults) {
    if (levelOrder.indexOf(result.level) > levelOrder.indexOf(highestLevel)) {
      highestLevel = result.level;
    }
  }

  return {
    level: highestLevel,
    levelInfo: RISK_LEVELS[highestLevel],
    axisResults,
    clausulaPrevalencia: false, // Version A doesn't have this clause
  };
}

// ----- Quantitative (Version B) Calculations -----

export type QuantitativeAnswer = Record<string, 'sim' | 'nao' | undefined>;

export function calculateBlockScore(block: QuantitativeBlock, answers: QuantitativeAnswer): number {
  let score = 0;

  for (const q of block.questoes) {
    const answer = answers[q.id];
    if (!answer) continue;

    if (q.efeito === 'mitigacao') {
      // Mitigation questions: "Sim" subtracts points (pontos is negative)
      if (answer === 'sim') {
        score += q.pontos; // pontos is already negative
      }
      // "Não" means no mitigation, no subtraction
    } else {
      // Risk questions (and regular questions): risk answer adds points
      if (answer === q.riskAnswer) {
        score += Math.abs(q.pontos);
      }
    }
  }

  // Block 7 score has a minimum of 0 (per spec)
  if (block.id === 'bloco7') {
    return Math.max(0, score);
  }

  return score;
}

export function getQuantitativeRiskLevel(score: number): RiskLevel {
  if (score <= 50) return 'I';
  if (score <= 110) return 'II';
  if (score <= 180) return 'III';
  return 'IV';
}

export function checkClausulaPrevalencia(answers: QuantitativeAnswer): boolean {
  // If P4.1 or P4.2 is "Sim", Cláusula de Prevalência Ética is triggered
  return answers['P4.1'] === 'sim' || answers['P4.2'] === 'sim';
}

export function getQuantitativeBlockResults(answers: QuantitativeAnswer) {
  return QUANTITATIVE_BLOCKS.map((block) => {
    const score = calculateBlockScore(block, answers);
    return {
      blockId: block.id,
      blockName: block.nome,
      score,
      maxPontos: block.maxPontos,
      isBlock7: block.id === 'bloco7',
    };
  });
}

export function getQuantitativeTotalScore(answers: QuantitativeAnswer): number {
  let total = 0;
  for (const block of QUANTITATIVE_BLOCKS) {
    total += calculateBlockScore(block, answers);
  }
  return Math.max(0, total); // Total cannot be below 0 (per spec)
}

export function getQuantitativeFinalResult(answers: QuantitativeAnswer): {
  level: RiskLevel;
  levelInfo: RiskLevelInfo;
  totalScore: number;
  maxScore: number;
  blockResults: ReturnType<typeof getQuantitativeBlockResults>;
  clausulaPrevalencia: boolean;
} {
  const totalScore = getQuantitativeTotalScore(answers);
  const blockResults = getQuantitativeBlockResults(answers);
  const clausulaPrevalencia = checkClausulaPrevalencia(answers);

  const scoreLevel = getQuantitativeRiskLevel(totalScore);

  // Cláusula de Prevalência Ética overrides to Level IV
  const finalLevel: RiskLevel = clausulaPrevalencia ? 'IV' : scoreLevel;

  return {
    level: finalLevel,
    levelInfo: RISK_LEVELS[finalLevel],
    totalScore,
    maxScore: 238,
    blockResults,
    clausulaPrevalencia,
  };
}

// ----- Requirements -----

export function getRequirementsForLevel(level: RiskLevel): Requirement[] {
  const levelOrder: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  const currentIndex = levelOrder.indexOf(level);

  return REQUIREMENTS.filter((r) => levelOrder.indexOf(r.nivel) <= currentIndex);
}

// ----- Progress Calculation -----

export function calculateAnsweredCount(
  answers: Record<string, string | undefined>,
  questionIds: string[]
): number {
  return questionIds.filter((id) => answers[id] !== undefined).length;
}

// ----- Print/Export Helpers -----

const LEVEL_COLORS: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  I: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  II: { bg: '#fffbeb', text: '#b45309', border: '#fcd34d' },
  III: { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
  IV: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
};

export function generateReportHTML(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer
): string {
  const date = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
  const versionLabel = version === 'A' ? 'A — Qualitativa' : 'B — Quantitativa';

  let resultSection = '';

  if (version === 'A') {
    const result = getQualitativeFinalLevel(qualitativeAnswers);
    const lc = LEVEL_COLORS[result.level];
    
    let axisRows = '';
    for (const axis of result.axisResults) {
      const alc = LEVEL_COLORS[axis.level];
      axisRows += `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${axis.axisName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${axis.riskCount}/${axis.totalQuestions}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">
            <span style="background:${alc.bg};color:${alc.text};padding:2px 10px;border-radius:4px;border:1px solid ${alc.border};font-weight:600;font-size:12px">
              Nível ${axis.level} — ${RISK_LEVELS[axis.level].label}
            </span>
          </td>
        </tr>`;
    }

    resultSection = `
      <div style="text-align:center;margin:24px 0;padding:20px;background:${lc.bg};border:2px solid ${lc.border};border-radius:8px">
        <div style="font-size:36px;font-weight:bold;color:${lc.text}">Nível ${result.level}</div>
        <div style="font-size:20px;font-weight:600;color:${lc.text};margin-top:4px">${result.levelInfo.label}</div>
        <p style="color:#6b7280;margin-top:8px;font-size:13px">${result.levelInfo.description}</p>
      </div>
      <h3 style="margin:20px 0 10px;font-size:15px;color:#374151">Resultado por Eixo</h3>
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
      <p style="margin-top:12px;font-size:12px;color:#6b7280"><strong>Consolidação:</strong> O nível final é o mais alto entre todos os eixos.</p>`;
  } else {
    const result = getQuantitativeFinalResult(quantitativeAnswers);
    const lc = LEVEL_COLORS[result.level];

    let blockRows = '';
    for (const block of result.blockResults) {
      blockRows += `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${block.blockName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:monospace">${block.score} / ${block.maxPontos} pts</td>
        </tr>`;
    }

    const clausulaSection = result.clausulaPrevalencia ? `
      <div style="margin:16px 0;padding:12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;font-size:13px;color:#dc2626">
        <strong>⚠️ Cláusula de Prevalência Ética ativada</strong><br>
        O protocolo foi elevado a Nível IV devido a P4.1 ou P4.2 = Sim.
      </div>` : '';

    resultSection = `
      <div style="text-align:center;margin:24px 0;padding:20px;background:${lc.bg};border:2px solid ${lc.border};border-radius:8px">
        <div style="font-size:36px;font-weight:bold;color:${lc.text}">Nível ${result.level}</div>
        <div style="font-size:20px;font-weight:600;color:${lc.text};margin-top:4px">${result.levelInfo.label}</div>
        <p style="color:#6b7280;margin-top:8px;font-size:13px">${result.levelInfo.description}</p>
        <div style="font-size:24px;font-weight:bold;color:${lc.text};margin-top:8px">${result.totalScore} / 238 pontos</div>
      </div>
      ${clausulaSection}
      <h3 style="margin:20px 0 10px;font-size:15px;color:#374151">Resultado por Bloco</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="background:#f9fafb">
            <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Bloco</th>
            <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">Pontuação</th>
          </tr>
        </thead>
        <tbody>${blockRows}</tbody>
      </table>`;
  }

  // Requirements section
  const finalLevel = version === 'A' 
    ? getQualitativeFinalLevel(qualitativeAnswers).level 
    : getQuantitativeFinalResult(quantitativeAnswers).level;
  const requirements = getRequirementsForLevel(finalLevel);

  let reqItems = '';
  for (const req of requirements) {
    const rlc = LEVEL_COLORS[req.nivel];
    reqItems += `
      <li style="margin:6px 0;font-size:13px">
        <span style="background:${rlc.bg};color:${rlc.text};padding:1px 6px;border-radius:3px;font-size:11px;font-weight:600;border:1px solid ${rlc.border}">Nível ${req.nivel}</span>
        ${req.texto}
      </li>`;
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

  <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;margin-bottom:20px">
    <span><strong>Versão:</strong> ${versionLabel}</span>
    <span><strong>Data:</strong> ${date}</span>
  </div>

  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
    <h3 style="margin:0 0 10px;font-size:14px;color:#374151">Caracterização do Contexto</h3>
    <p style="margin:0 0 8px;font-size:13px"><strong>Pergunta do sistema:</strong> ${contextAnswers['contexto1'] || 'Não informado'}</p>
    <p style="margin:0;font-size:13px"><strong>Autonomia do sistema:</strong> ${contextAnswers['contexto2'] || 'Não informado'}</p>
  </div>

  ${resultSection}

  <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">Requisitos (cumulativos)</h3>
  <ul style="padding-left:20px">${reqItems}</ul>

  <div style="margin-top:32px;padding:12px;background:#fffbeb;border:1px dashed #fbbf24;border-radius:6px;font-size:12px;color:#92400e">
    <strong>Aviso:</strong> A MARA não aprova nem reprova protocolos. Não substitui o julgamento do CEP. Não dispensa a deliberação colegiada.
  </div>

  <div style="margin-top:24px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px">
    MARA — Matriz de Avaliação de Risco Algorítmico • Gerado em ${date}
  </div>
</body>
</html>`;
}

export function generateReportText(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('MARA — Matriz de Avaliação de Risco Algorítmico');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`Versão: ${version === 'A' ? 'A — Qualitativa' : 'B — Quantitativa'}`);
  lines.push(`Data: ${new Date().toLocaleDateString('pt-BR')}`);
  lines.push('');

  // Context
  lines.push('── CARACTERIZAÇÃO DO CONTEXTO ──');
  lines.push(`Sistema de IA: ${contextAnswers['contexto1'] || 'Não informado'}`);
  lines.push(`Contexto de uso: ${contextAnswers['contexto2'] || 'Não informado'}`);
  lines.push('');

  if (version === 'A') {
    const result = getQualitativeFinalLevel(qualitativeAnswers);
    lines.push('── RESULTADO FINAL ──');
    lines.push(`Nível ${result.level} — ${result.levelInfo.label}`);
    lines.push('');
    for (const axis of result.axisResults) {
      lines.push(`${axis.axisName}`);
      lines.push(`  Respostas de risco: ${axis.riskCount}/${axis.totalQuestions} → Nível ${axis.level} (${RISK_LEVELS[axis.level].label})`);
    }
  } else {
    const result = getQuantitativeFinalResult(quantitativeAnswers);
    lines.push('── RESULTADO FINAL ──');
    lines.push(`Nível ${result.level} — ${result.levelInfo.label}`);
    lines.push(`Pontuação total: ${result.totalScore}/${result.maxScore}`);
    if (result.clausulaPrevalencia) {
      lines.push('');
      lines.push('⚠️ CLÁUSULA DE PREVALÊNCIA ÉTICA ATIVADA');
      lines.push('O protocolo foi elevado a Nível IV devido a P4.1 ou P4.2 = Sim');
    }
    lines.push('');
    for (const block of result.blockResults) {
      lines.push(`${block.blockName}: ${block.score} pts`);
    }
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');

  return lines.join('\n');
}
