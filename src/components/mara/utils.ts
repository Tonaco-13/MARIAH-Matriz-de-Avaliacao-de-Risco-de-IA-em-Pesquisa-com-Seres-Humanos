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
    ${contextAnswers['titulo'] ? `<p style="margin:12px 0 0;font-size:16px;font-weight:600;color:#1f2937">${contextAnswers['titulo']}</p>` : ''}
  </div>

  <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:13px;color:#6b7280;margin-bottom:20px">
    <span><strong>Versão:</strong> ${versionLabel}</span>
    <span><strong>Instituição:</strong> ${contextAnswers['instituicao'] || 'Não informado'}</span>
    <span><strong>CEP:</strong> ${contextAnswers['cep_nome'] || 'Não informado'}</span>
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

  // Identification
  lines.push('── IDENTIFICAÇÃO DO PROTOCOLO ──');
  lines.push(`Título do Projeto: ${contextAnswers['titulo'] || 'Não informado'}`);
  lines.push(`Instituição: ${contextAnswers['instituicao'] || 'Não informado'}`);
  lines.push(`Nome do CEP: ${contextAnswers['cep_nome'] || 'Não informado'}`);
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

// ----- PDF Generation -----

const LEVEL_HEX: Record<RiskLevel, string> = {
  I: '#15803d',
  II: '#b45309',
  III: '#c2410c',
  IV: '#dc2626',
};

export async function generatePDF(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const date = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const versionLabel = version === 'A' ? 'A — Qualitativa' : 'B — Quantitativa';

  // --- Helpers ---

  function checkPage(needed: number) {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function addFooter() {
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(160);
      doc.text('MARA — Matriz de Avaliação de Risco Algorítmico', pageW / 2, pageH - 10, { align: 'center' });
      doc.text(`Gerado em ${date}`, pageW / 2, pageH - 6, { align: 'center' });
      doc.text(`Página ${i} de ${pages}`, pageW - margin, pageH - 10, { align: 'right' });
    }
  }

  function sectionTitle(text: string) {
    checkPage(14);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 118, 110); // teal-700
    doc.text(text, margin, y);
    y += 4;
    doc.setDrawColor(15, 118, 110);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
    doc.setTextColor(50);
  }

  function bodyText(text: string, opts?: { bold?: boolean; color?: string; fontSize?: number }) {
    const size = opts?.fontSize ?? 10;
    doc.setFontSize(size);
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
    if (opts?.color) {
      const c = hexToRgb(opts.color);
      doc.setTextColor(c.r, c.g, c.b);
    } else {
      doc.setTextColor(50);
    }
    const lines = doc.splitTextToSize(text, contentW);
    for (const line of lines) {
      checkPage(size * 0.5);
      doc.text(line, margin, y);
      y += size * 0.45;
    }
  }

  function hexToRgb(hex: string) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  }

  // --- CABEÇALHO ---
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('MARA', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Matriz de Avaliação de Risco Algorítmico', margin, y);
  y += 8;

  if (contextAnswers['titulo']) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30);
    const titleLines = doc.splitTextToSize(contextAnswers['titulo'], contentW);
    for (const line of titleLines) {
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 2;
  }

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Instituição: ${contextAnswers['instituicao'] || 'Não informado'}`, margin, y);
  doc.text(`CEP: ${contextAnswers['cep_nome'] || 'Não informado'}`, margin + contentW / 2, y);
  y += 4;
  doc.text(`Versão: ${versionLabel}`, margin, y);
  doc.text(`Data: ${date}`, margin + contentW / 2, y);
  y += 4;
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // --- CONTEXTO DE USO ---
  sectionTitle('Contexto de Uso');
  bodyText('C1 — Pergunta do sistema:', { bold: true });
  y += 1;
  bodyText(contextAnswers['contexto1'] || 'Não informado');
  y += 4;
  bodyText('C2 — Autonomia do sistema:', { bold: true });
  y += 1;
  bodyText(contextAnswers['contexto2'] || 'Não informado');
  y += 6;

  // --- RESULTADO PRINCIPAL ---
  sectionTitle('Resultado Principal');

  let finalLevel: RiskLevel;
  let clausulaPrevalencia = false;

  if (version === 'A') {
    const result = getQualitativeFinalLevel(qualitativeAnswers);
    finalLevel = result.level;
  } else {
    const result = getQuantitativeFinalResult(quantitativeAnswers);
    finalLevel = result.level;
    clausulaPrevalencia = result.clausulaPrevalencia;
  }

  const levelInfo = RISK_LEVELS[finalLevel];
  const levelColor = LEVEL_HEX[finalLevel];
  const lc = hexToRgb(levelColor);

  checkPage(20);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(lc.r, lc.g, lc.b);
  doc.text(`Nível ${finalLevel} — ${levelInfo.label}`, pageW / 2, y, { align: 'center' });
  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  const descLines = doc.splitTextToSize(levelInfo.description, contentW - 20);
  for (const line of descLines) {
    doc.text(line, pageW / 2, y, { align: 'center' });
    y += 4;
  }
  y += 4;

  if (clausulaPrevalencia) {
    checkPage(12);
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, y - 2, contentW, 12, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('⚠ CLÁUSULA DE PREVALÊNCIA ÉTICA ATIVADA — Protocolo elevado a Nível IV (P4.1 ou P4.2 = Sim)', margin + 4, y + 5);
    y += 16;
  }

  // --- DETALHAMENTO ---
  if (version === 'A') {
    sectionTitle('Detalhamento por Eixo — Versão A');
    const result = getQualitativeFinalLevel(qualitativeAnswers);

    for (const axis of result.axisResults) {
      checkPage(14);
      const alc = hexToRgb(LEVEL_HEX[axis.level]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50);
      doc.text(axis.axisName, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Respostas de risco: ${axis.riskCount}/${axis.totalQuestions}`, margin + contentW * 0.65, y);
      doc.setTextColor(alc.r, alc.g, alc.b);
      doc.setFont('helvetica', 'bold');
      doc.text(`Nível ${axis.level}`, margin + contentW - 15, y);
      y += 6;
    }

    y += 2;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('Consolidação: o nível final é o mais alto entre todos os eixos.', margin, y);
    y += 8;
  } else {
    sectionTitle('Detalhamento por Bloco — Versão B');
    const result = getQuantitativeFinalResult(quantitativeAnswers);

    for (const block of result.blockResults) {
      checkPage(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50);
      doc.text(block.blockName, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${block.score}${block.isBlock7 ? ' (bidirecional)' : ''} / ${block.maxPontos} pts`, margin + contentW - 40, y);
      y += 6;
    }

    y += 2;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50);
    doc.text(`Pontuação Total: ${result.totalScore} / 238`, margin, y);
    y += 4;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Faixas: I (0-50) · II (51-110) · III (111-180) · IV (181-238)', margin, y);
    y += 8;
  }

  // --- REGISTRO COMPLETO DE RESPOSTAS ---
  sectionTitle('Registro Completo de Respostas');

  // Table header
  const colX = [margin, margin + 14, margin + contentW * 0.7, margin + contentW * 0.82];
  const hasPoints = version === 'B';

  checkPage(10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('Questão', colX[0], y);
  doc.text('Pergunta', colX[1], y);
  doc.text('Resposta', colX[2], y);
  if (hasPoints) doc.text('Pontos', colX[3], y);
  y += 2;
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 4;

  if (version === 'A') {
    for (const axis of QUALITATIVE_AXES) {
      for (const q of axis.questoes) {
        const answer = qualitativeAnswers[q.id];
        const answerLabel = answer === 'sim' ? 'Sim' : answer === 'nao' ? 'Não' : '—';
        const isRisk = answer === q.riskAnswer;

        checkPage(8);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80);
        doc.text(q.id, colX[0], y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60);
        const pLines = doc.splitTextToSize(q.pergunta, contentW * 0.53);
        doc.text(pLines[0], colX[1], y);

        if (isRisk) {
          doc.setTextColor(220, 38, 38);
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(60);
        }
        doc.text(`${answerLabel}${isRisk ? ' ⬆' : ''}`, colX[2], y);

        const lineH = Math.max(pLines.length * 3.5, 5);
        if (pLines.length > 1) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60);
          for (let i = 1; i < pLines.length; i++) {
            y += 3.5;
            checkPage(5);
            doc.text(pLines[i], colX[1], y);
          }
        }
        y += lineH > 5 ? 3 : 5;
      }
    }
  } else {
    for (const block of QUANTITATIVE_BLOCKS) {
      for (const q of block.questoes) {
        const answer = quantitativeAnswers[q.id];
        const answerLabel = answer === 'sim' ? 'Sim' : answer === 'nao' ? 'Não' : '—';
        const isMitigation = q.efeito === 'mitigacao';
        let isRisk = false;
        if (isMitigation) {
          isRisk = answer === 'nao';
        } else {
          isRisk = answer === q.riskAnswer;
        }

        let pts = '';
        if (answer) {
          if (isMitigation && answer === 'sim') {
            pts = `${q.pontos}`;
          } else if (!isMitigation && answer === q.riskAnswer) {
            pts = `+${Math.abs(q.pontos)}`;
          } else {
            pts = '0';
          }
        }

        checkPage(8);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80);
        doc.text(q.id, colX[0], y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60);
        const pLines = doc.splitTextToSize(q.pergunta, contentW * 0.53);
        doc.text(pLines[0], colX[1], y);

        if (isRisk) {
          doc.setTextColor(220, 38, 38);
          doc.setFont('helvetica', 'bold');
        } else if (isMitigation && answer === 'sim') {
          doc.setTextColor(15, 118, 110);
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(60);
        }
        doc.text(answerLabel, colX[2], y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80);
        doc.text(pts, colX[3], y);

        if (pLines.length > 1) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60);
          for (let i = 1; i < pLines.length; i++) {
            y += 3.5;
            checkPage(5);
            doc.text(pLines[i], colX[1], y);
          }
        }
        y += pLines.length > 1 ? 3 : 5;
      }
    }
  }
  y += 4;

  // --- REQUISITOS CUMULATIVOS ---
  sectionTitle('Requisitos Cumulativos');
  const requirements = getRequirementsForLevel(finalLevel);
  for (const req of requirements) {
    checkPage(8);
    const rlc = hexToRgb(LEVEL_HEX[req.nivel]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rlc.r, rlc.g, rlc.b);
    doc.text(`[Nível ${req.nivel}]`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);
    const rLines = doc.splitTextToSize(req.texto, contentW - 25);
    doc.text(rLines[0], margin + 22, y);
    for (let i = 1; i < rLines.length; i++) {
      y += 3.5;
      checkPage(5);
      doc.text(rLines[i], margin + 22, y);
    }
    y += 5;
  }
  y += 4;

  // --- DISCLAIMER ---
  checkPage(16);
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120);
  const disclaimer = 'A MARA não aprova nem reprova protocolos. Não substitui o julgamento do CEP. Não dispensa a deliberação colegiada.';
  const dLines = doc.splitTextToSize(disclaimer, contentW);
  for (const line of dLines) {
    doc.text(line, pageW / 2, y, { align: 'center' });
    y += 3.5;
  }

  // --- Footer on all pages ---
  addFooter();

  // --- Download ---
  const titulo = contextAnswers['titulo']?.trim() || 'Sem título';
  const sanitized = titulo.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').replace(/\s+/g, '_').substring(0, 60);
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`MARA_${sanitized}_${dateStr}.pdf`);
}
