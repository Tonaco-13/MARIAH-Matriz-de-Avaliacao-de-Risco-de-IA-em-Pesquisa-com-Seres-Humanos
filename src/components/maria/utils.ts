// ============================================================
// MARIAH - Calculation Utilities
// Versão com Res. CNS n.º 738/2024 (Eixo 3.b / Bloco 6.b)
// ============================================================

import {
  QUALITATIVE_AXES,
  QUANTITATIVE_BLOCKS,
  RISK_LEVELS,
  REQUIREMENTS,
  REQUIREMENTS_RES738,
  CONTEXT_QUESTIONS,
  CONTEXT_DESC_SUFFIX,
  isDescribableContextOption,
  MATRIX_VERSION,
  getThresholds,
  label,
} from './data';
import type {
  RiskLevel,
  RiskLevelInfo,
  QualitativeAxis,
  QuantitativeBlock,
  Requirement,
  ContextQuestion,
  ExibicaoCondicional,
  ClausulaExibicao,
} from './data';
import { getCourtesyNotice, getDisclaimer } from './disclaimer';
import { createTranslator } from 'next-intl';
import ptBRMessages from '../../../messages/pt-BR.json';
import esMessages from '../../../messages/es.json';

// ----- i18n do relatório/exports (Lote 5) -----
// Os literais do relatório vivem em messages/<locale>.json (namespace `report`).
// Fora de React a leitura é via createTranslator; locale sem namespace cai no
// canônico pt-BR. Em pt-BR a saída é byte-idêntica à extração (provado por
// snapshot na entrega do Lote 5).
const REPORT_MESSAGES: Record<string, typeof ptBRMessages> = {
  'pt-BR': ptBRMessages,
  es: esMessages,
};

function reportTranslator(locale: string) {
  return createTranslator({
    locale,
    messages: REPORT_MESSAGES[locale] ?? REPORT_MESSAGES['pt-BR'],
    namespace: 'report',
  });
}

/**
 * Regra de exibição condicional das descritivas (fonte única, usada pelo
 * ContextForm e pela auditoria). Padrão: "...se <ID> <op> 'valor'", op ∈ {≠, !=, =}.
 * Questão condicional só é visível após a de referência ser respondida.
 */
export function isContextQuestionVisible(
  q: ContextQuestion,
  contextAnswers: Record<string, string>
): boolean {
  if (!q.condicional) return true;
  const m = q.condicional.match(/se\s+(\S+)\s*(≠|!=|=)\s*['"]([^'"]+)['"]/);
  if (!m) return true;
  const [, refId, op, val] = m;
  const ans = contextAnswers[refId];
  if (!ans) return false;
  return op === '=' ? ans === val : ans !== val;
}

/**
 * Resposta de descritiva para exibição/relatório: anexa a descrição livre quando
 * a opção escolhida é do tipo "(descrever)" (ex.: C.8 "sim, outra forma (descrever)").
 */
export function contextAnswerDisplay(
  q: ContextQuestion,
  contextAnswers: Record<string, string>,
  fallback: string
): string {
  const ans = contextAnswers[q.id];
  if (!ans || !ans.trim()) return fallback;
  const desc = contextAnswers[`${q.id}${CONTEXT_DESC_SUFFIX}`];
  if (isDescribableContextOption(ans) && desc && desc.trim()) {
    return `${ans} — ${desc.trim()}`;
  }
  return ans;
}

// ----- Helpers: filter axes/blocks by database filter -----

export function getApplicableAxes(usesDatabase: boolean): QualitativeAxis[] {
  return QUALITATIVE_AXES.filter((a) => !a.condicionalBancoDados || usesDatabase);
}

export function getApplicableBlocks(usesDatabase: boolean): QuantitativeBlock[] {
  return QUANTITATIVE_BLOCKS.filter((b) => !b.condicionalBancoDados || usesDatabase);
}

// ----- Exibição condicional de perguntas de matriz (F-17/F-18) -----

type ContextoVisibilidade = {
  matrixAnswers: Record<string, string | undefined>;
  contextAnswers: Record<string, string | undefined>;
};

function avaliarClausulaExibicao(c: ClausulaExibicao, ctx: ContextoVisibilidade): boolean {
  if ('nenhuma' in c) return c.nenhuma.every((x) => !avaliarClausulaExibicao(x, ctx));
  const mapa = c.origem === 'contexto' ? ctx.contextAnswers : ctx.matrixAnswers;
  const ans = mapa[c.campo];
  if (c.operador === 'igual') return ans === c.valor;
  // 'diferente': só verdadeiro se o gatilho estiver respondido E ≠ valor.
  return ans != null && ans !== '' && ans !== c.valor;
}

/**
 * Uma pergunta de matriz está visível quando não tem `exibicaoCondicional` ou
 * quando TODAS as cláusulas são satisfeitas. `matrixAnswers` são as respostas da
 * versão da própria pergunta (A → qualitativas; B → quantitativas); `contextAnswers`
 * são as descritivas do Passo 1. Pergunta oculta não pontua, não elimina e não é pendência.
 */
export function isMatrixQuestionVisible(
  q: { exibicaoCondicional?: ExibicaoCondicional },
  matrixAnswers: Record<string, string | undefined>,
  contextAnswers: Record<string, string | undefined> = {}
): boolean {
  const ec = q.exibicaoCondicional;
  if (!ec) return true;
  return ec.todas.every((c) => avaliarClausulaExibicao(c, { matrixAnswers, contextAnswers }));
}

// ----- Qualitative (Version A) Calculations -----

export type QualitativeAnswer = Record<string, 'sim' | 'nao' | 'na' | undefined>;

export function countRiskAnswersAxis(axis: QualitativeAxis, answers: QualitativeAnswer): number {
  return axis.questoes.filter((q) => {
    // Questões de registro/diligência (naoPontuavel) não entram na contagem de
    // risco do eixo — ex.: 2.10 (plano de novo consentimento na Versão A).
    if (q.naoPontuavel) return false;
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
  usesDatabase: boolean = false,
  locale: string = 'pt-BR',
  contextAnswers: Record<string, string | undefined> = {}
) {
  return getApplicableAxes(usesDatabase).map((axis) => {
    const riskCount = countRiskAnswersAxis(axis, answers);
    const level = getAxisRiskLevel(riskCount, axis);
    const cov = groupCoverage(axis.questoes, answers, contextAnswers);
    return {
      axisId: axis.id,
      axisName: label(axis, 'nome', locale),
      riskCount,
      totalQuestions: axis.questoes.length,
      /** Questões visíveis do eixo respondidas ('na' conta) — mesmo universo da auditoria. */
      respondidas: cov.respondidas,
      /** Questões visíveis do eixo (denominador de "Respondidas x/y"). */
      totalVisiveis: cov.total,
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
 *
 * Nota (2026-07): removido o antigo guard `if (!usesDatabase) return null`.
 * As eliminatórias da Res. 738 (3.b.2 / P6.b.2) vivem em eixos/blocos
 * condicionais que só entram em `getApplicable*` quando usesDatabase = true,
 * então continuam restritas ao recorte de banco de dados. A remoção do guard
 * permite que eliminatórias NÃO ligadas a banco de dados também disparem —
 * caso de P2.8 (plano de novo consentimento em sistema adaptativo).
 */
export function getEliminatoryQuestionTriggered(
  answers: Record<string, 'sim' | 'nao' | 'na' | undefined>,
  version: 'A' | 'B',
  usesDatabase: boolean,
  contextAnswers: Record<string, string | undefined> = {}
): string | null {
  const groups = version === 'A'
    ? getApplicableAxes(usesDatabase)
    : getApplicableBlocks(usesDatabase);

  for (const group of groups) {
    for (const q of group.questoes) {
      // Pergunta oculta por exibição condicional (F-17/F-18) NÃO dispara devolução.
      if (!isMatrixQuestionVisible(q, answers, contextAnswers)) continue;
      if (q.eliminatorio && answers[q.id] === q.riskAnswer) {
        return q.id;
      }
    }
  }
  return null;
}

/**
 * Localiza uma questão (eixo ou bloco) pelo ID e retorna seus textos de
 * bloqueio. Usado para parametrizar a mensagem de "protocolo não avaliável"
 * conforme a norma que fundamenta cada eliminatória (Res. 738 vs. Lei 14.874).
 */
export function getEliminatoryInfo(id: string | null, locale: string = 'pt-BR'): {
  motivo: string;
  ref: string;
} {
  // Texto padrão: eliminatórias da cadeia de custódia (Res. CNS n.º 738/2024).
  const DEFAULT = {
    motivo: reportTranslator(locale)('eliminatorioDefaultMotivo'),
    ref: '§7.3.6',
  };
  if (!id) return DEFAULT;

  for (const axis of QUALITATIVE_AXES) {
    for (const q of axis.questoes) {
      if (q.id === id) {
        return {
          motivo: q.motivoEliminatorio ? label(q, 'motivoEliminatorio', locale) : DEFAULT.motivo,
          ref: q.refEliminatoria ?? DEFAULT.ref,
        };
      }
    }
  }
  for (const block of QUANTITATIVE_BLOCKS) {
    for (const q of block.questoes) {
      if (q.id === id) {
        return {
          motivo: q.motivoEliminatorio ? label(q, 'motivoEliminatorio', locale) : DEFAULT.motivo,
          ref: q.refEliminatoria ?? DEFAULT.ref,
        };
      }
    }
  }
  return DEFAULT;
}

export function getQualitativeFinalLevel(
  answers: QualitativeAnswer,
  usesDatabase: boolean = false,
  contextAnswers: Record<string, string | undefined> = {},
  locale: string = 'pt-BR'
): {
  level: RiskLevel;
  levelInfo: RiskLevelInfo;
  axisResults: ReturnType<typeof getQualitativeAxisResults>;
  clausulaPrevalencia: boolean;
  protocoloNaoAvaliavel: boolean;
  eliminatoryQuestionId: string | null;
} {
  const axisResults = getQualitativeAxisResults(answers, usesDatabase, locale, contextAnswers);

  // The final level is the HIGHEST across all axes
  const levelOrder: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  let highestLevel: RiskLevel = 'I';

  for (const result of axisResults) {
    if (levelOrder.indexOf(result.level) > levelOrder.indexOf(highestLevel)) {
      highestLevel = result.level;
    }
  }

  const eliminatoryQuestionId = getEliminatoryQuestionTriggered(answers, 'A', usesDatabase, contextAnswers);

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
      // Mitigação bidirecional (subblocos 7A/7B):
      //   "Sim" = mitigação aplicada → subtrai |pontos|
      //   "Não" = sem mitigação → adiciona |pontos| (risco preservado)
      const abs = Math.abs(q.pontos);
      if (answer === 'sim') {
        score -= abs;
      } else {
        score += abs;
      }
    } else if (q.efeito === 'evidencia') {
      // Evidência de transparência (subbloco 7C — decisão B1, SÓ-ABATE):
      //   "Sim" (evidência presente) subtrai |pontos|; ausente/"Não" = 0 (NÃO soma).
      // A ausência de evidência documental não é risco acrescido, então não infla o teto.
      if (answer === 'sim') {
        score -= Math.abs(q.pontos);
      }
    } else if (q.efeito === 'diligencia' || q.naoPontuavel) {
      // Diligência (gate cumulativo / checklist de admissibilidade): NÃO pontua no escore.
      // O bloqueio "não avaliável" é tratado por getEliminatoryQuestionTriggered
      // (flag `eliminatorio`), nunca pela soma.
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
  usesDatabase: boolean = false,
  locale: string = 'pt-BR',
  contextAnswers: Record<string, string | undefined> = {}
) {
  return getApplicableBlocks(usesDatabase).map((block) => {
    const score = calculateBlockScore(block, answers);
    const cov = groupCoverage(block.questoes, answers, contextAnswers);
    return {
      blockId: block.id,
      blockName: label(block, 'nome', locale),
      score,
      maxPontos: block.maxPontos,
      /** Questões visíveis do bloco respondidas ('na' conta) — mesmo universo da auditoria. */
      respondidas: cov.respondidas,
      /** Questões visíveis do bloco (denominador de "Respondidas x/y"). */
      totalVisiveis: cov.total,
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
  usesDatabase: boolean = false,
  contextAnswers: Record<string, string | undefined> = {},
  locale: string = 'pt-BR'
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
  const blockResults = getQuantitativeBlockResults(answers, usesDatabase, locale, contextAnswers);
  const clausulaPrevalencia = checkClausulaPrevalencia(answers);
  const thresholds = getThresholds(usesDatabase);

  const scoreLevel = getQuantitativeRiskLevel(totalScore, usesDatabase);

  // Cláusula de Prevalência Ética overrides to Level IV
  const finalLevel: RiskLevel = clausulaPrevalencia ? 'IV' : scoreLevel;

  const eliminatoryQuestionId = getEliminatoryQuestionTriggered(answers, 'B', usesDatabase, contextAnswers);

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

// Campos de identificação (não fazem parte de CONTEXT_QUESTIONS). As descritivas
// (contexto1, contexto2, C.3…C.8) são auditadas a partir de CONTEXT_QUESTIONS,
// respeitando a visibilidade condicional. Os rótulos vivem em messages (namespace
// `report`) e são resolvidos em runtime pelo locale ativo.
const IDENTIFICATION_FIELD_IDS = ['titulo', 'instituicao', 'cep_nome'] as const;
const IDENTIFICATION_LABEL_KEYS = {
  titulo: 'identTituloProjeto',
  instituicao: 'identInstituicao',
  cep_nome: 'identCep',
} as const;

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
  usesDatabase: boolean = false,
  locale: string = 'pt-BR'
): UnansweredItem[] {
  const items: UnansweredItem[] = [];
  const t = reportTranslator(locale);

  // 1) Campos de contexto (sempre obrigatórios, mas auditamos se algum ficou vazio
  //    — pode acontecer em fluxos restaurados de localStorage parcial).
  for (const id of IDENTIFICATION_FIELD_IDS) {
    const value = contextAnswers[id];
    if (!value || value.trim().length === 0) {
      items.push({
        id,
        scope: 'contexto',
        scopeName: t('scopeIdentificacao'),
        label: t(IDENTIFICATION_LABEL_KEYS[id]),
      });
    }
  }
  // Descritivas visíveis (respeita o condicional — ex.: C.5 oculta se C.3 = 'anonimizados').
  for (const q of CONTEXT_QUESTIONS) {
    if (!isContextQuestionVisible(q, contextAnswers)) continue;
    const value = contextAnswers[q.id];
    if (!value || value.trim().length === 0) {
      items.push({
        id: q.id,
        scope: 'contexto',
        scopeName: t('scopeIdentificacao'),
        label: label(q, 'pergunta', locale),
      });
    }
  }

  // 2) Perguntas da matriz, só as aplicáveis ao recorte (Res 738 ativada ou não).
  if (version === 'A') {
    for (const axis of getApplicableAxes(usesDatabase)) {
      for (const q of axis.questoes) {
        // Pergunta oculta por exibição condicional (F-17/F-18) não é pendência.
        if (!isMatrixQuestionVisible(q, qualitativeAnswers, contextAnswers)) continue;
        if (qualitativeAnswers[q.id] === undefined) {
          items.push({
            id: q.id,
            scope: 'eixo',
            scopeName: label(axis, 'nome', locale),
            label: label(q, 'pergunta', locale),
          });
        }
      }
    }
  } else {
    for (const block of getApplicableBlocks(usesDatabase)) {
      for (const q of block.questoes) {
        if (!isMatrixQuestionVisible(q, quantitativeAnswers, contextAnswers)) continue;
        if (quantitativeAnswers[q.id] === undefined) {
          items.push({
            id: q.id,
            scope: 'bloco',
            scopeName: label(block, 'nome', locale),
            label: label(q, 'pergunta', locale),
          });
        }
      }
    }
  }

  return items;
}

/**
 * Item da matriz marcado como "Não se aplica" (na) por quem preencheu.
 * Registrado no relatório para auditoria: torna explícita a escolha "na", que de
 * outro modo ficaria indistinguível de "Sim"/"Não" na visão agregada. As
 * eliminatórias recebem marcação própria (classe sensível: o "na" afasta a
 * devolução por não-avaliabilidade).
 */
export type NaoSeAplicaItem = {
  id: string;
  scopeName: string;
  label: string;
  /** Diligência/questão eliminatória: o "na" afasta a hipótese eliminatória. */
  eliminatorio: boolean;
};

/**
 * Coleta as perguntas da matriz respondidas "Não se aplica" (na), respeitando
 * aplicabilidade (Res 738) e exibição condicional — mesmo recorte de
 * getUnansweredItems, mas para o valor 'na'.
 */
export function getNaoSeAplicaItems(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false,
  locale: string = 'pt-BR'
): NaoSeAplicaItem[] {
  const items: NaoSeAplicaItem[] = [];
  if (version === 'A') {
    for (const axis of getApplicableAxes(usesDatabase)) {
      for (const q of axis.questoes) {
        if (!isMatrixQuestionVisible(q, qualitativeAnswers, contextAnswers)) continue;
        if (qualitativeAnswers[q.id] === 'na') {
          items.push({ id: q.id, scopeName: label(axis, 'nome', locale), label: label(q, 'pergunta', locale), eliminatorio: !!q.eliminatorio });
        }
      }
    }
  } else {
    for (const block of getApplicableBlocks(usesDatabase)) {
      for (const q of block.questoes) {
        if (!isMatrixQuestionVisible(q, quantitativeAnswers, contextAnswers)) continue;
        if (quantitativeAnswers[q.id] === 'na') {
          items.push({ id: q.id, scopeName: label(block, 'nome', locale), label: label(q, 'pergunta', locale), eliminatorio: !!q.eliminatorio });
        }
      }
    }
  }
  return items;
}

// ----- Cobertura da matriz (acurácia de comunicação do veredito) -----

/**
 * Base que sustentou a classificação. O nível é computado só com as questões
 * respondidas (ausência = "não risco" por convenção — inalterado); a cobertura
 * torna essa base explícita na tela, no relatório e nos exports.
 *
 * Universo contável = MESMO recorte da auditoria (getUnansweredItems, escopos
 * 'eixo'/'bloco'): só questões de matriz (identificação/descritivas NÃO entram),
 * recorte Res 738 (getApplicable*), exibição condicional F-17/F-18
 * (isMatrixQuestionVisible — pergunta oculta fora do total), naoPontuaveis no
 * total, 'na' conta como respondida.
 * INVARIANTE: semAvaliacao === getUnansweredItems(...) sem o escopo 'contexto'.
 */
export type CoverageStats = {
  /** Questões visíveis da matriz respondidas ('na' conta como respondida). */
  respondidas: number;
  /** Questões visíveis da matriz (inclui naoPontuaveis). */
  total: number;
  /** floor(respondidas/total × 100) — arredonda para BAIXO, nunca superestima. */
  taxa: number;
  /** respondidas < total (binário: só é false com 100%). */
  parcial: boolean;
  /** total − respondidas. */
  semAvaliacao: number;
};

function groupCoverage(
  questoes: Array<{ id: string; exibicaoCondicional?: ExibicaoCondicional }>,
  answers: Record<string, string | undefined>,
  contextAnswers: Record<string, string | undefined>
): { respondidas: number; total: number } {
  let respondidas = 0;
  let total = 0;
  for (const q of questoes) {
    if (!isMatrixQuestionVisible(q, answers, contextAnswers)) continue;
    total++;
    if (answers[q.id] !== undefined) respondidas++;
  }
  return { respondidas, total };
}

function toCoverageStats(respondidas: number, total: number): CoverageStats {
  // Aritmética inteira antes da divisão: evita 29/100*100 = 28.999… → 28.
  const taxa = total > 0 ? Math.floor((respondidas * 100) / total) : 100;
  return {
    respondidas,
    total,
    taxa,
    parcial: respondidas < total,
    semAvaliacao: total - respondidas,
  };
}

/** Cobertura da matriz de UMA versão (A = eixos; B = blocos). */
export function getMatrixCoverage(
  version: 'A' | 'B',
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false
): CoverageStats {
  const groups = version === 'A' ? getApplicableAxes(usesDatabase) : getApplicableBlocks(usesDatabase);
  const answers = version === 'A' ? qualitativeAnswers : quantitativeAnswers;
  let respondidas = 0;
  let total = 0;
  for (const g of groups) {
    const c = groupCoverage(g.questoes, answers, contextAnswers);
    respondidas += c.respondidas;
    total += c.total;
  }
  return toCoverageStats(respondidas, total);
}

/** Cobertura da união A+B (modo triagem com relatório combinado). */
export function getCombinedCoverage(
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false
): CoverageStats {
  const a = getMatrixCoverage('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
  const b = getMatrixCoverage('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
  return toCoverageStats(a.respondidas + b.respondidas, a.total + b.total);
}

/**
 * Cobertura que sustenta o nível EXIBIDO: união A+B no relatório combinado
 * (triagem A→B), senão a matriz da versão corrente.
 */
export function getDisplayedCoverage(
  version: 'A' | 'B',
  useAAsTriagem: boolean,
  contextAnswers: Record<string, string>,
  qualitativeAnswers: QualitativeAnswer,
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean = false
): CoverageStats {
  return useAAsTriagem && version === 'B'
    ? getCombinedCoverage(contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase)
    : getMatrixCoverage(version, contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
}

// ----- Print/Export Helpers -----

const LEVEL_COLORS: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  I: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  II: { bg: '#fffbeb', text: '#b45309', border: '#fcd34d' },
  III: { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
  IV: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
};

/**
 * Linha de cobertura do veredito (mesma string na tela, no HTML e no texto).
 * Parcial: "Classificado a partir de 8/57 questões respondidas (14%). 49 questões
 * sem avaliação — ver seção de auditoria." · Completo: "… 57/57 … (100%)."
 */
function coverageLine(cov: CoverageStats, t: ReturnType<typeof reportTranslator>): string {
  return cov.parcial
    ? t('coberturaParcial', { respondidas: String(cov.respondidas), total: String(cov.total), taxa: String(cov.taxa), count: cov.semAvaliacao })
    : t('coberturaCompleta', { respondidas: String(cov.respondidas), total: String(cov.total) });
}

/** "Nível II" + sufixo " (parcial)" quando a cobertura é incompleta. */
function parcialSuffix(cov: CoverageStats, t: ReturnType<typeof reportTranslator>): string {
  return cov.parcial ? ` ${t('parcialSufixo')}` : '';
}

/** Helper: HTML da seção de resultado da Versão A (qualitativa). */
function buildQualitativeSectionHTML(
  qualitativeAnswers: QualitativeAnswer,
  usesDatabase: boolean,
  contextAnswers: Record<string, string>,
  locale: string,
  heading: string
): { html: string; level: RiskLevel; eliminatoryQuestionId: string | null } {
  const t = reportTranslator(locale);
  const result = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase, contextAnswers, locale);
  const cov = getMatrixCoverage('A', contextAnswers, qualitativeAnswers, {}, usesDatabase);
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
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${axis.respondidas}/${axis.totalVisiveis}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${axis.riskCount}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">
          <span style="background:${alc.bg};color:${alc.text};padding:2px 10px;border-radius:4px;border:1px solid ${alc.border};font-weight:600;font-size:12px">
            ${t('nivelPalavra')} ${axis.level} — ${label(RISK_LEVELS[axis.level], 'label', locale)}
          </span>
        </td>
      </tr>`;
  }

  const html = `
    <div style="text-align:center;margin:24px 0;padding:20px;background:${lc.bg};border:2px solid ${lc.border};border-radius:8px">
      <div style="font-size:36px;font-weight:bold;color:${lc.text}">${t('nivelPalavra')} ${result.level}${cov.parcial ? `<span style="font-size:20px;font-weight:600">${parcialSuffix(cov, t)}</span>` : ''}</div>
      <div style="font-size:20px;font-weight:600;color:${lc.text};margin-top:4px">${label(result.levelInfo, 'label', locale)}</div>
      <p style="color:#6b7280;margin-top:8px;font-size:13px">${label(result.levelInfo, 'description', locale)}</p>
      <p style="color:#374151;margin-top:6px;font-size:12px">${coverageLine(cov, t)}</p>
    </div>
    <h3 style="margin:20px 0 10px;font-size:15px;color:#374151">${heading}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#f9fafb">
          <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colEixo')}</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colRespondidas')}</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colRespostasRisco')}</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colNivel')}</th>
        </tr>
      </thead>
      <tbody>${axisRows}</tbody>
    </table>
    <p style="margin-top:12px;font-size:12px;color:#6b7280"><strong>${t('consolidacaoRotulo')}</strong> ${t('consolidacaoTexto')}</p>`;

  return { html, level: result.level, eliminatoryQuestionId: result.eliminatoryQuestionId };
}

/** Helper: HTML da seção de resultado da Versão B (quantitativa). */
function buildQuantitativeSectionHTML(
  quantitativeAnswers: QuantitativeAnswer,
  usesDatabase: boolean,
  contextAnswers: Record<string, string>,
  locale: string,
  heading: string
): { html: string; level: RiskLevel; eliminatoryQuestionId: string | null } {
  const t = reportTranslator(locale);
  const result = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase, contextAnswers, locale);
  const cov = getMatrixCoverage('B', contextAnswers, {}, quantitativeAnswers, usesDatabase);
  const lc = LEVEL_COLORS[result.level];

  let blockRows = '';
  for (const block of result.blockResults) {
    const ref = block.referenciaNormativa
      ? `<br><span style="font-size:10px;color:#1d4ed8">${block.referenciaNormativa}</span>`
      : '';
    blockRows += `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500">${block.blockName}${ref}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${block.respondidas}/${block.totalVisiveis}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:monospace">${block.score} / ${block.maxPontos} ${t('pts')}</td>
      </tr>`;
  }

  const clausulaSection = result.clausulaPrevalencia
    ? `
    <div style="margin:16px 0;padding:12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;font-size:13px;color:#dc2626">
      <strong>${t('clausulaTitulo')}</strong><br>
      ${t('clausulaTexto')}.
    </div>`
    : '';

  const th = result.thresholds;
  const html = `
    <div style="text-align:center;margin:24px 0;padding:20px;background:${lc.bg};border:2px solid ${lc.border};border-radius:8px">
      <div style="font-size:36px;font-weight:bold;color:${lc.text}">${t('nivelPalavra')} ${result.level}${cov.parcial ? `<span style="font-size:20px;font-weight:600">${parcialSuffix(cov, t)}</span>` : ''}</div>
      <div style="font-size:20px;font-weight:600;color:${lc.text};margin-top:4px">${label(result.levelInfo, 'label', locale)}</div>
      <p style="color:#6b7280;margin-top:8px;font-size:13px">${label(result.levelInfo, 'description', locale)}</p>
      <p style="color:#374151;margin-top:6px;font-size:12px">${coverageLine(cov, t)}</p>
      <div style="font-size:24px;font-weight:bold;color:${lc.text};margin-top:8px">${result.totalScore} / ${result.maxScore} ${t('pontos')}</div>
      <p style="color:#6b7280;margin-top:4px;font-size:11px">${t('faixas', { db: usesDatabase ? t('faixasDbSuffix') : '', i: String(th.levelI), i1: String(th.levelI + 1), ii: String(th.levelII), ii1: String(th.levelII + 1), iii: String(th.levelIII), iii1: String(th.levelIII + 1), max: String(th.maxScore) })}</p>
    </div>
    ${clausulaSection}
    <h3 style="margin:20px 0 10px;font-size:15px;color:#374151">${heading}</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#f9fafb">
          <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colBloco')}</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colRespondidas')}</th>
          <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;font-size:12px;color:#6b7280">${t('colPontuacao')}</th>
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
  useAAsTriagem: boolean = false,
  /** Locale ativo (feat/i18n): define o lang do documento e a formatação da data. Default pt-BR. */
  locale: string = 'pt-BR'
): string {
  const date = new Date().toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const t = reportTranslator(locale);
  // No modo triagem com B já percorrida, o relatório vira combinado.
  const isCombinedReport = useAAsTriagem && version === 'B';
  const versionLabel = isCombinedReport
    ? t('versaoCombinada')
    : version === 'A' ? t('versaoA') : t('versaoB');
  const dbBadge = usesDatabase
    ? `<span style="background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${t('dbBadge')}</span>`
    : '';

  let resultSection = '';
  let eliminatoryWarning = '';
  let eliminatoryIdForReport: string | null = null;

  if (isCombinedReport) {
    const qualSection = buildQualitativeSectionHTML(qualitativeAnswers, usesDatabase, contextAnswers, locale, t('headingEixoTriagem'));
    const quantSection = buildQuantitativeSectionHTML(quantitativeAnswers, usesDatabase, contextAnswers, locale, t('headingBlocoTriagem'));
    eliminatoryIdForReport = quantSection.eliminatoryQuestionId ?? qualSection.eliminatoryQuestionId;

    // Espelho da tela: nível consolidado (mais alto entre A e B) com a cobertura
    // da UNIÃO A+B — mesma informação do card principal e do badge "Consolidado".
    const lvlCons = highestLevel(qualSection.level, quantSection.level);
    const covCons = getCombinedCoverage(contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
    const lcCons = LEVEL_COLORS[lvlCons];

    resultSection = `
      <div style="margin:18px 0;padding:12px 14px;background:#f1f5f9;border-left:4px solid #475569;border-radius:4px;font-size:12px;color:#334155">
        <strong>${t('combinadoNotaA')}</strong> ${t('combinadoNotaB')}<strong>${t('combinadoNotaStrong')}</strong>${t('combinadoNotaC')}
        <div style="margin-top:8px;font-size:13px"><strong>${t('consolidadoRotulo')}</strong> <span style="background:${lcCons.bg};color:${lcCons.text};border:1px solid ${lcCons.border};padding:1px 8px;border-radius:4px;font-weight:600">${t('nivelPalavra')} ${lvlCons}${parcialSuffix(covCons, t)} — ${label(RISK_LEVELS[lvlCons], 'label', locale)}</span></div>
        <div style="margin-top:4px">${coverageLine(covCons, t)}</div>
      </div>
      <h3 style="margin:24px 0 6px;font-size:16px;color:#0C2C56;border-bottom:2px solid #0C2C56;padding-bottom:4px">${t('secaoVersaoA')}</h3>
      ${qualSection.html}
      <h3 style="margin:32px 0 6px;font-size:16px;color:#334155;border-bottom:2px solid #334155;padding-bottom:4px">${t('secaoVersaoB')}</h3>
      ${quantSection.html}`;
  } else if (version === 'A') {
    const built = buildQualitativeSectionHTML(qualitativeAnswers, usesDatabase, contextAnswers, locale, t('headingEixo'));
    resultSection = built.html;
    eliminatoryIdForReport = built.eliminatoryQuestionId;
  } else {
    const built = buildQuantitativeSectionHTML(quantitativeAnswers, usesDatabase, contextAnswers, locale, t('headingBloco'));
    resultSection = built.html;
    eliminatoryIdForReport = built.eliminatoryQuestionId;
  }

  if (eliminatoryIdForReport) {
    const info = getEliminatoryInfo(eliminatoryIdForReport, locale);
    eliminatoryWarning = `
      <div style="margin:16px 0;padding:14px;background:#fef2f2;border:2px solid #dc2626;border-radius:6px;font-size:13px;color:#7f1d1d">
        <strong>${t('eliminatorioHtmlTitulo', { id: eliminatoryIdForReport })}</strong><br>
        ${t('eliminatorioNaoAvaliavel', { motivo: info.motivo })}
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
      ? `<span style="background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;padding:0 4px;border-radius:3px;font-size:10px;margin-right:4px">${t('res738Tag')}</span>`
      : '';
    reqItems += `
      <li style="margin:6px 0;font-size:13px">
        <span style="background:${rlc.bg};color:${rlc.text};padding:1px 6px;border-radius:3px;font-size:11px;font-weight:600;border:1px solid ${rlc.border}">${t('nivelPalavra')} ${req.nivel}</span>
        ${tagRes738}${label(req, 'texto', locale)}
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
      <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">${t('itensTitulo')}</h3>
      <div style="padding:12px;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;font-size:12px;color:#15803d">
        ${t('itensOkHtml')}
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
      <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">${t('itensTitulo')}</h3>
      <div style="padding:14px;background:#fffbeb;border:1px solid #fbbf24;border-radius:6px;font-size:12px;color:#78350f">
        <p style="margin:0 0 8px;font-weight:600">${t('itensCountHtml', { count: unanswered.length })}</p>
        <p style="margin:0 0 8px">${t('itensDescHtmlA')}<strong>${t('itensDescHtmlStrong')}</strong>${t('itensDescHtmlB')}</p>
        ${groupsHtml}
      </div>`;
  }

  // Caracterização do Contexto — todas as descritivas visíveis (C.1…C.8),
  // respeitando exibição condicional. Antes só contexto1/contexto2 apareciam.
  let contextItemsHtml = '';
  for (const q of CONTEXT_QUESTIONS) {
    if (!isContextQuestionVisible(q, contextAnswers)) continue;
    contextItemsHtml += `
    <p style="margin:0 0 8px;font-size:13px"><strong>${label(q, 'pergunta', locale)}</strong> ${contextAnswerDisplay(q, contextAnswers, t('naoInformado'))}</p>`;
  }

  // Questões marcadas como "Não se aplica" — rastro auditável da escolha 'na'.
  let naoSeAplica: NaoSeAplicaItem[];
  if (isCombinedReport) {
    naoSeAplica = [
      ...getNaoSeAplicaItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
      ...getNaoSeAplicaItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
    ];
  } else {
    naoSeAplica = getNaoSeAplicaItems(version, contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale);
  }
  let naoSeAplicaSection = '';
  if (naoSeAplica.length > 0) {
    let naRows = '';
    for (const it of naoSeAplica) {
      const tag = it.eliminatorio
        ? `<span style="background:#fef2f2;color:#b91c1c;border:1px solid #fca5a5;padding:0 5px;border-radius:3px;font-size:10px;margin-left:6px;font-weight:600">${t('naTagEliminatorio')}</span>`
        : '';
      naRows += `<li style="margin:3px 0;font-size:12px"><strong style="font-family:monospace;color:#374151">${it.id}</strong> — ${it.label}${tag}</li>`;
    }
    naoSeAplicaSection = `
      <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">${t('naTitulo')}</h3>
      <div style="padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;color:#374151">
        <p style="margin:0 0 8px">${t('naCountHtmlA', { count: naoSeAplica.length })}<strong>"${t('naCitacaoTexto')}"</strong>. ${t('naCountHtmlB')}</p>
        <ul style="padding-left:18px;margin:0">${naRows}</ul>
      </div>`;
  }

  const courtesyNotice = getCourtesyNotice(locale);

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <title>${t('docTitle')}</title>
  <style>
    @media print { body { padding: 20px; } }
  </style>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans','Noto Sans SC',sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1f2937;line-height:1.5">
  <div style="border-bottom:3px solid #0C2C56;padding-bottom:16px;margin-bottom:24px">
    <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
      <h1 style="margin:0;font-size:24px;color:#0C2C56">MARIAH</h1>
      <span style="font-size:10px;font-weight:500;padding:2px 8px;border-radius:999px;background:#fef3c7;color:#92400e;border:1px solid #fde68a;white-space:nowrap">${t('badgePreliminar')}</span>
    </div>
    <p style="margin:4px 0 0;font-size:14px;color:#6b7280">${t('subtitle')}</p>
  </div>

  <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;margin-bottom:20px;flex-wrap:wrap;gap:8px">
    <span><strong>${t('versaoRotulo')}</strong> ${versionLabel} ${dbBadge}</span>
    <span><strong>${t('dataRotulo')}</strong> ${date}</span>
    <span><strong>${t('versaoMatrizRotulo')}</strong> ${MATRIX_VERSION}</span>
  </div>

  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
    <h3 style="margin:0 0 10px;font-size:14px;color:#374151">${t('identTitulo')}</h3>
    <p style="margin:0 0 6px;font-size:13px"><strong>${t('identTituloProjeto')}:</strong> ${contextAnswers['titulo'] || t('naoInformado')}</p>
    <p style="margin:0 0 6px;font-size:13px"><strong>${t('identInstituicao')}:</strong> ${contextAnswers['instituicao'] || t('naoInformado')}</p>
    <p style="margin:0;font-size:13px"><strong>${t('identCep')}:</strong> ${contextAnswers['cep_nome'] || t('naoInformado')}</p>
  </div>

  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
    <h3 style="margin:0 0 10px;font-size:14px;color:#374151">${t('contextoTitulo')}</h3>
    ${contextItemsHtml}
    <p style="margin:0;font-size:13px"><strong>${t('utilizaBanco')}</strong> ${usesDatabase ? t('bancoSimLongo') : t('nao')}</p>
  </div>

  ${eliminatoryWarning}
  ${resultSection}

  <h3 style="margin:24px 0 10px;font-size:15px;color:#374151">${t('requisitosTitulo')}</h3>
  <ul style="padding-left:20px">${reqItems}</ul>

  ${unansweredSection}

  ${naoSeAplicaSection}

  <div style="margin-top:32px;padding:12px;background:#fffbeb;border:1px dashed #fbbf24;border-radius:6px;font-size:12px;color:#92400e">
    <strong>${t('avisoRotulo')}</strong> ${getDisclaimer(locale)}${courtesyNotice ? `<p style="margin:8px 0 0;font-style:italic">${courtesyNotice}</p>` : ''}
  </div>

  <div style="margin-top:24px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;line-height:1.6">
    ${t('footerGerado', { date })}
    <br>
    ${t('footerDev')}
    <br>
    <span style="font-size:10px">${t('footerLicenca')}</span>
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
  useAAsTriagem: boolean = false,
  /** Locale ativo (feat/i18n): formatação da data. Default pt-BR. */
  locale: string = 'pt-BR'
): string {
  const lines: string[] = [];
  const t = reportTranslator(locale);
  const isCombinedReport = useAAsTriagem && version === 'B';

  lines.push('═══════════════════════════════════════════════════════════');
  lines.push(t('txtHeaderTitulo'));
  lines.push(t('txtHeaderPreliminar'));
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`${t('versaoRotulo')} ${
    isCombinedReport
      ? t('versaoCombinada')
      : version === 'A' ? t('versaoA') : t('versaoB')
  }`);
  lines.push(`${t('dataRotulo')} ${new Date().toLocaleDateString(locale)}`);
  lines.push(`${t('utilizaBanco')} ${usesDatabase ? t('bancoSimCurto') : t('nao')}`);
  lines.push(`${t('versaoMatrizRotulo')} ${MATRIX_VERSION}`);
  lines.push('');

  // Identification + Context
  lines.push(t('identTxtTitulo'));
  lines.push(`${t('identTituloProjeto')}: ${contextAnswers['titulo'] || t('naoInformado')}`);
  lines.push(`${t('identInstituicao')}: ${contextAnswers['instituicao'] || t('naoInformado')}`);
  lines.push(`${t('identCep')}: ${contextAnswers['cep_nome'] || t('naoInformado')}`);
  lines.push('');
  lines.push(t('contextoTxtTitulo'));
  // Todas as descritivas visíveis (C.1…C.8), respeitando exibição condicional.
  for (const q of CONTEXT_QUESTIONS) {
    if (!isContextQuestionVisible(q, contextAnswers)) continue;
    lines.push(`${label(q, 'pergunta', locale)} ${contextAnswerDisplay(q, contextAnswers, t('naoInformado'))}`);
  }
  lines.push(`${t('utilizaBanco')} ${usesDatabase ? t('bancoSimLongoTxt') : t('nao')}`);
  lines.push('');

  const renderQual = () => {
    const result = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase, contextAnswers, locale);
    const cov = getMatrixCoverage('A', contextAnswers, qualitativeAnswers, {}, usesDatabase);
    lines.push(`${t('nivelPalavra')} ${result.level} — ${label(result.levelInfo, 'label', locale)}${parcialSuffix(cov, t)}`);
    lines.push(coverageLine(cov, t));
    if (result.protocoloNaoAvaliavel) {
      lines.push('');
      lines.push(t('eliminatorioTxtTitulo', { id: result.eliminatoryQuestionId ?? '' }));
      lines.push(`   ${t('diligenciaObrigatoria', { motivo: getEliminatoryInfo(result.eliminatoryQuestionId, locale).motivo })}`);
    }
    lines.push('');
    for (const axis of result.axisResults) {
      lines.push(`${axis.axisName}`);
      lines.push(
        `  ${t('respostasRiscoTxt', { respondidas: String(axis.respondidas), total: String(axis.totalVisiveis), count: String(axis.riskCount), level: axis.level, label: label(RISK_LEVELS[axis.level], 'label', locale) })}`
      );
    }
  };

  const renderQuant = () => {
    const result = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase, contextAnswers, locale);
    const cov = getMatrixCoverage('B', contextAnswers, {}, quantitativeAnswers, usesDatabase);
    lines.push(`${t('nivelPalavra')} ${result.level} — ${label(result.levelInfo, 'label', locale)}${parcialSuffix(cov, t)}`);
    lines.push(coverageLine(cov, t));
    lines.push(t('pontuacaoTotalTxt', { score: String(result.totalScore), max: String(result.maxScore) }));
    if (result.clausulaPrevalencia) {
      lines.push('');
      lines.push(t('clausulaTituloTxt'));
      lines.push(t('clausulaTexto'));
    }
    if (result.protocoloNaoAvaliavel) {
      lines.push('');
      lines.push(t('eliminatorioTxtTitulo', { id: result.eliminatoryQuestionId ?? '' }));
      lines.push(`   ${t('diligenciaObrigatoria', { motivo: getEliminatoryInfo(result.eliminatoryQuestionId, locale).motivo })}`);
    }
    lines.push('');
    for (const block of result.blockResults) {
      lines.push(`${block.blockName}: ${block.score} ${t('pts')} · ${t('respondidasTxt', { respondidas: String(block.respondidas), total: String(block.totalVisiveis) })}`);
    }
  };

  if (isCombinedReport) {
    lines.push(t('resultadoFinalATxt'));
    renderQual();
    lines.push('');
    lines.push(t('resultadoFinalBTxt'));
    renderQuant();
    lines.push('');
    lines.push(t('notaConsolidadoTxt'));
    // Espelho da tela: consolidado com a cobertura da união A+B.
    {
      const lvlA = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase, contextAnswers).level;
      const lvlB = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase, contextAnswers).level;
      const lvlCons = highestLevel(lvlA, lvlB);
      const covCons = getCombinedCoverage(contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
      lines.push(`${t('consolidadoRotulo')} ${t('nivelPalavra')} ${lvlCons} — ${label(RISK_LEVELS[lvlCons], 'label', locale)}${parcialSuffix(covCons, t)}`);
      lines.push(coverageLine(covCons, t));
    }
  } else if (version === 'A') {
    lines.push(t('resultadoFinalTxt'));
    renderQual();
  } else {
    lines.push(t('resultadoFinalTxt'));
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
  lines.push(t('itensTxtTitulo'));
  if (unanswered.length === 0) {
    lines.push(t('itensOkTxt'));
  } else {
    lines.push(t('itensCountTxt', { count: String(unanswered.length) }));
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

  // Questões marcadas como "Não se aplica" — rastro auditável.
  let naoSeAplicaTxt: NaoSeAplicaItem[];
  if (isCombinedReport) {
    naoSeAplicaTxt = [
      ...getNaoSeAplicaItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
      ...getNaoSeAplicaItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
    ];
  } else {
    naoSeAplicaTxt = getNaoSeAplicaItems(version, contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale);
  }
  if (naoSeAplicaTxt.length > 0) {
    lines.push('');
    lines.push(t('naTituloTxt'));
    lines.push(t('naCountTxt', { count: String(naoSeAplicaTxt.length) }));
    let lastScopeNa = '';
    for (const it of naoSeAplicaTxt) {
      if (it.scopeName !== lastScopeNa) {
        lines.push('');
        lines.push(`[${it.scopeName}]`);
        lastScopeNa = it.scopeName;
      }
      lines.push(`  • ${it.id} — ${it.label}${it.eliminatorio ? `  [${t('naTagEliminatorio')}]` : ''}`);
    }
  }

  lines.push('');
  lines.push(t('avisoTxtTitulo'));
  lines.push(getDisclaimer(locale));
  const courtesyNotice = getCourtesyNotice(locale);
  if (courtesyNotice) {
    lines.push('');
    lines.push(courtesyNotice);
  }
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');

  return lines.join('\n');
}

// ============================================================
// Export para Validação Local (Apêndice F do Guia)
// ------------------------------------------------------------
// Gera um JSON estruturado, compatível com as abas da planilha-
// modelo de Validação Local, contendo os dados da avaliação
// corrente. O CEP pode acumular vários JSONs (um por protocolo
// avaliado) e transcrever / colar nas abas Protocolos, Versão A
// e Versão B da planilha.
// ============================================================

/** Classificação exportada: nível de risco, "não avaliável" (devolução) ou ausente. */
export type ClassificacaoExport = RiskLevel | 'NÃO AVALIÁVEL' | null;

/**
 * Cobertura exportada (schema v3): base da classificação. `parcial` = true quando
 * a matriz não foi integralmente respondida — a classificação mantém o valor
 * ("II" etc.); a parcialidade vive neste flag, não no valor.
 */
export type CoberturaExport = { respondidas: number; total: number; parcial: boolean };

/*
 * Changelog do schema 'maria-validacao-local':
 *   v2 — versaoMatriz, protocoloNaoAvaliavel e classificação 'NÃO AVALIÁVEL'.
 *   v3 — acurácia do veredito: versaoA/versaoB.cobertura {respondidas, total, parcial}
 *        (null quando a versão não foi aplicada); eixos[i]/blocos[i] ganham
 *        respondidas e questoesVisiveis (mesmo universo da auditoria). Mudança
 *        ADITIVA: nenhum campo de v2 mudou de nome, tipo ou significado.
 *        Nota: o export passou a repassar contextAnswers aos cálculos; em caso-limite
 *        (resposta obsoleta de eliminatória oculta por C.3/C.5 — 3.b.4.1/P6.b.4.1),
 *        protocoloNaoAvaliavel/classificação agora coincidem com a tela, podendo
 *        diferir do que a v2 teria exportado.
 *        Consumidores (planilha-modelo, cálculo de kappa) devem aceitar v2 e v3;
 *        um JSON v2 não traz cobertura e deve ser tratado como "cobertura
 *        desconhecida", não como completa.
 */
export type ValidationExport = {
  schema: 'maria-validacao-local';
  schemaVersion: 3;
  exportadoEm: string; // ISO 8601
  software: {
    nome: 'MARIAH';
    /** Carimbo da versão da matriz (spec) usada nesta avaliação — rastreabilidade. */
    versaoMatriz: string;
    observacao: string;
  };
  protocolo: {
    idInterno: string; // placeholder — CEP deve substituir pelo seu identificador interno antes de importar
    titulo: string;
    instituicao: string;
    cep: string;
    dataAvaliacao: string; // YYYY-MM-DD
    usaBancoDeDados: boolean;
    modoTriagem: boolean;
  };
  versaoA: {
    aplicada: boolean;
    classificacaoConsolidada: ClassificacaoExport;
    protocoloNaoAvaliavel: boolean;
    /** v3 — base da classificação da Versão A (null se não aplicada). */
    cobertura: CoberturaExport | null;
    eixos: Array<{
      id: string;
      nome: string;
      nivel: RiskLevel;
      respostasRisco: number;
      totalQuestoes: number;
      /** v3 — questões visíveis do eixo respondidas ('na' conta). */
      respondidas: number;
      /** v3 — questões visíveis do eixo (exibição condicional aplicada). */
      questoesVisiveis: number;
    }>;
  };
  versaoB: {
    aplicada: boolean;
    classificacaoFinal: ClassificacaoExport;
    protocoloNaoAvaliavel: boolean;
    pontuacaoTotal: number | null;
    clausulaPrevalencia: boolean;
    /** v3 — base da classificação da Versão B (null se não aplicada). */
    cobertura: CoberturaExport | null;
    blocos: Array<{
      id: string;
      nome: string;
      pontuacao: number;
      maxPontos: number;
      /** v3 — questões visíveis do bloco respondidas ('na' conta). */
      respondidas: number;
      /** v3 — questões visíveis do bloco (exibição condicional aplicada). */
      questoesVisiveis: number;
    }>;
  };
  comoUsar: {
    descricao: string;
    abasPlanilha: {
      protocolos: string;
      versaoA: string;
      versaoB: string;
      triagemAB: string;
    };
  };
};

export function buildValidationExport(args: {
  version: 'A' | 'B';
  useAAsTriagem: boolean;
  usesDatabase: boolean;
  contextAnswers: Record<string, string>;
  qualitativeAnswers: QualitativeAnswer;
  quantitativeAnswers: QuantitativeAnswer;
}): ValidationExport {
  const {
    version,
    useAAsTriagem,
    usesDatabase,
    contextAnswers,
    qualitativeAnswers,
    quantitativeAnswers,
  } = args;

  // Versão A aplicada quando: versão A foi escolhida, OU triagem (A sempre aplica primeiro)
  const versaoAAplicada =
    version === 'A' || useAAsTriagem || Object.keys(qualitativeAnswers).length > 0;
  // Versão B aplicada quando: versão B foi escolhida (com ou sem triagem)
  const versaoBAplicada =
    version === 'B' || Object.keys(quantitativeAnswers).length > 0;

  // ----- Versão A -----
  let versaoA: ValidationExport['versaoA'];
  if (versaoAAplicada) {
    const qual = getQualitativeFinalLevel(qualitativeAnswers, usesDatabase, contextAnswers);
    const cov = getMatrixCoverage('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
    versaoA = {
      aplicada: true,
      classificacaoConsolidada: qual.protocoloNaoAvaliavel ? 'NÃO AVALIÁVEL' : qual.level,
      protocoloNaoAvaliavel: qual.protocoloNaoAvaliavel,
      cobertura: { respondidas: cov.respondidas, total: cov.total, parcial: cov.parcial },
      eixos: qual.axisResults.map((r) => ({
        id: r.axisId,
        nome: r.axisName,
        nivel: r.level,
        respostasRisco: r.riskCount,
        totalQuestoes: r.totalQuestions,
        respondidas: r.respondidas,
        questoesVisiveis: r.totalVisiveis,
      })),
    };
  } else {
    versaoA = {
      aplicada: false,
      classificacaoConsolidada: null,
      protocoloNaoAvaliavel: false,
      cobertura: null,
      eixos: [],
    };
  }

  // ----- Versão B -----
  let versaoB: ValidationExport['versaoB'];
  if (versaoBAplicada) {
    const quant = getQuantitativeFinalResult(quantitativeAnswers, usesDatabase, contextAnswers);
    const cov = getMatrixCoverage('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase);
    versaoB = {
      aplicada: true,
      classificacaoFinal: quant.protocoloNaoAvaliavel ? 'NÃO AVALIÁVEL' : quant.level,
      protocoloNaoAvaliavel: quant.protocoloNaoAvaliavel,
      pontuacaoTotal: quant.totalScore,
      clausulaPrevalencia: quant.clausulaPrevalencia,
      cobertura: { respondidas: cov.respondidas, total: cov.total, parcial: cov.parcial },
      blocos: quant.blockResults.map((r) => ({
        id: r.blockId,
        nome: r.blockName,
        pontuacao: r.score,
        maxPontos: r.maxPontos,
        respondidas: r.respondidas,
        questoesVisiveis: r.totalVisiveis,
      })),
    };
  } else {
    versaoB = {
      aplicada: false,
      classificacaoFinal: null,
      protocoloNaoAvaliavel: false,
      pontuacaoTotal: null,
      clausulaPrevalencia: false,
      cobertura: null,
      blocos: [],
    };
  }

  const agora = new Date();
  const dataAvaliacao = agora.toISOString().slice(0, 10);
  const idPlaceholder = `MARIAH-${agora.toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;

  return {
    schema: 'maria-validacao-local',
    schemaVersion: 3,
    exportadoEm: agora.toISOString(),
    software: {
      nome: 'MARIAH',
      versaoMatriz: MATRIX_VERSION,
      observacao:
        'Exportação gerada para uso na planilha-modelo de Validação Local descrita em apêndice próprio do Guia de Uso Ético da Inteligência Artificial em Pesquisa com Seres Humanos (em revisão).',
    },
    protocolo: {
      idInterno: idPlaceholder,
      titulo: contextAnswers['titulo'] || '',
      instituicao: contextAnswers['instituicao'] || '',
      cep: contextAnswers['cep_nome'] || '',
      dataAvaliacao,
      usaBancoDeDados: usesDatabase,
      modoTriagem: useAAsTriagem,
    },
    versaoA,
    versaoB,
    comoUsar: {
      descricao:
        'Substitua "idInterno" pelo identificador interno do seu CEP (ex.: P-001) antes de transcrever para a planilha. Cada export corresponde a uma linha por aba da planilha-modelo. O campo "cobertura.parcial" = true indica classificação emitida com a matriz incompleta (questões sem resposta tratadas como "não risco"): compare com cautela no cálculo do kappa e registre a parcialidade junto da classificação.',
      abasPlanilha: {
        protocolos: 'Use idInterno, dataAvaliacao, modoTriagem e usaBancoDeDados.',
        versaoA:
          'Use idInterno e versaoA.classificacaoConsolidada como a classificação de um avaliador. Para a Frente 1 (kappa), repita o processo com um segundo avaliador independente.',
        versaoB:
          'Use idInterno, versaoB.blocos[*].pontuacao (uma coluna por bloco) e versaoB.pontuacaoTotal.',
        triagemAB:
          'Quando modoTriagem = true, a planilha lê automaticamente das abas Versão A e Versão B.',
      },
    },
  };
}

/**
 * Dispara o download do JSON de validação local no navegador.
 * Nome do arquivo: validacao-maria-<idInterno>.json
 */
export function downloadValidationExport(exportData: ValidationExport): void {
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `validacao-maria-${exportData.protocolo.idInterno}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ============================================================
// Registro-espelho (JSON / CSV / TXT)
// ------------------------------------------------------------
// Mesmo conteúdo do relatório impresso (generateReportHTML) em
// formatos de arquivo: JSON estruturado, CSV tabular e TXT (que
// reusa generateReportText). Distinto do export de Validação
// Local (recorte para a planilha-modelo — contrato separado).
// ============================================================

export type MirrorEixo = {
  id: string;
  nome: string;
  nivel: RiskLevel;
  nivelRotulo: string;
  respostasRisco: number;
  totalQuestoes: number;
  /** v2 — questões visíveis do eixo respondidas ('na' conta). */
  respondidas: number;
  /** v2 — questões visíveis do eixo (exibição condicional aplicada). */
  questoesVisiveis: number;
  referenciaNormativa: string | null;
};

export type MirrorBloco = {
  id: string;
  nome: string;
  pontuacao: number;
  maxPontos: number;
  /** v2 — questões visíveis do bloco respondidas ('na' conta). */
  respondidas: number;
  /** v2 — questões visíveis do bloco (exibição condicional aplicada). */
  questoesVisiveis: number;
  referenciaNormativa: string | null;
};

/** Cobertura no registro-espelho (v2): estatística completa + linha exibida no relatório. */
export type MirrorCobertura = CoverageStats & { texto: string };

/*
 * Changelog do schema 'maria-registro-espelho':
 *   v1 — registro-espelho TXT/CSV/JSON do relatório impresso.
 *   v2 — acurácia do veredito (espelha o relatório): resultado.cobertura (a que
 *        sustenta o nível final: união A+B no combinado), versaoA/versaoB.cobertura,
 *        respondidas/questoesVisiveis por eixo/bloco e rótulos com "(parcial)".
 *        Aditiva sobre v1.
 */
export type MirrorRecord = {
  schema: 'maria-registro-espelho';
  schemaVersion: 2;
  exportadoEm: string; // ISO 8601
  idioma: string;
  software: {
    nome: 'MARIAH';
    versaoMatriz: string;
  };
  cabecalho: {
    versao: string; // rótulo locale-aware (ex.: "A — Qualitativa")
    versaoCodigo: 'A' | 'B';
    combinado: boolean;
    data: string;
    usaBancoDeDados: boolean;
    versaoMatriz: string;
  };
  identificacao: {
    titulo: string;
    instituicao: string;
    cep: string;
  };
  contexto: Array<{ id: string; pergunta: string; resposta: string }>;
  resultado: {
    nivelFinal: RiskLevel;
    /** Rótulo do nível final; recebe " (parcial)" quando a cobertura é incompleta. */
    nivelFinalRotulo: string;
    /** v2 — cobertura que sustenta o nível final. */
    cobertura: MirrorCobertura;
    versaoA: {
      nivel: RiskLevel;
      nivelRotulo: string;
      nivelDescricao: string;
      protocoloNaoAvaliavel: boolean;
      cobertura: MirrorCobertura;
      eixos: MirrorEixo[];
    } | null;
    versaoB: {
      nivel: RiskLevel;
      nivelRotulo: string;
      nivelDescricao: string;
      cobertura: MirrorCobertura;
      pontuacaoTotal: number;
      pontuacaoMaxima: number;
      clausulaPrevalencia: boolean;
      protocoloNaoAvaliavel: boolean;
      blocos: MirrorBloco[];
    } | null;
  };
  eliminatoria: {
    questaoId: string;
    motivo: string;
    referencia: string;
  } | null;
  requisitos: Array<{ id: string; nivel: RiskLevel; texto: string; res738: boolean }>;
  itensNaoAvaliados: Array<{ id: string; escopo: string; secao: string; item: string }>;
  naoSeAplica: Array<{ id: string; secao: string; item: string; eliminatorio: boolean }>;
  aviso: { texto: string; cortesia: string };
  rodape: { geradoEm: string; desenvolvimento: string; licenca: string };
};

/**
 * Monta o registro-espelho: mesmo recorte e mesma consolidação do relatório
 * impresso (nível final mais alto entre A e B no modo triagem, auditoria
 * combinada sem duplicar contexto, exibição condicional das descritivas).
 */
export function buildMirrorRecord(args: {
  version: 'A' | 'B';
  useAAsTriagem: boolean;
  usesDatabase: boolean;
  contextAnswers: Record<string, string>;
  qualitativeAnswers: QualitativeAnswer;
  quantitativeAnswers: QuantitativeAnswer;
  locale?: string;
}): MirrorRecord {
  const {
    version,
    useAAsTriagem,
    usesDatabase,
    contextAnswers,
    qualitativeAnswers,
    quantitativeAnswers,
    locale = 'pt-BR',
  } = args;
  const t = reportTranslator(locale);
  const isCombinedReport = useAAsTriagem && version === 'B';

  const agora = new Date();
  const dataFmt = agora.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const qual = version === 'A' || isCombinedReport
    ? getQualitativeFinalLevel(qualitativeAnswers, usesDatabase, contextAnswers, locale)
    : null;
  const quant = version === 'B'
    ? getQuantitativeFinalResult(quantitativeAnswers, usesDatabase, contextAnswers, locale)
    : null;

  // Nível final: idem ao relatório — o mais alto entre A e B no modo triagem.
  const finalLevel: RiskLevel = isCombinedReport && qual && quant
    ? highestLevel(qual.level, quant.level)
    : version === 'A'
      ? qual!.level
      : quant!.level;

  const eliminatoryQuestionId = quant?.eliminatoryQuestionId ?? qual?.eliminatoryQuestionId ?? null;
  const eliminatoryInfo = eliminatoryQuestionId ? getEliminatoryInfo(eliminatoryQuestionId, locale) : null;

  const requirements = getRequirementsForLevel(finalLevel, usesDatabase);

  // Cobertura (v2): mesmas strings e mesmo recorte do relatório.
  const mirrorCov = (c: CoverageStats): MirrorCobertura => ({ ...c, texto: coverageLine(c, t) });
  const covA = qual ? mirrorCov(getMatrixCoverage('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase)) : null;
  const covB = quant ? mirrorCov(getMatrixCoverage('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase)) : null;
  const covFinal = mirrorCov(
    getDisplayedCoverage(version, useAAsTriagem, contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase)
  );

  let unanswered: UnansweredItem[];
  if (isCombinedReport) {
    const fromA = getUnansweredItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale);
    const fromBOnlyMatrix = getUnansweredItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale)
      .filter((it) => it.scope !== 'contexto');
    unanswered = [...fromA, ...fromBOnlyMatrix];
  } else {
    unanswered = getUnansweredItems(version, contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale);
  }

  const naoSeAplica = isCombinedReport
    ? [
        ...getNaoSeAplicaItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
        ...getNaoSeAplicaItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
      ]
    : getNaoSeAplicaItems(version, contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale);

  return {
    schema: 'maria-registro-espelho',
    schemaVersion: 2,
    exportadoEm: agora.toISOString(),
    idioma: locale,
    software: { nome: 'MARIAH', versaoMatriz: MATRIX_VERSION },
    cabecalho: {
      versao: isCombinedReport ? t('versaoCombinada') : version === 'A' ? t('versaoA') : t('versaoB'),
      versaoCodigo: version,
      combinado: isCombinedReport,
      data: dataFmt,
      usaBancoDeDados: usesDatabase,
      versaoMatriz: MATRIX_VERSION,
    },
    identificacao: {
      titulo: contextAnswers['titulo'] || t('naoInformado'),
      instituicao: contextAnswers['instituicao'] || t('naoInformado'),
      cep: contextAnswers['cep_nome'] || t('naoInformado'),
    },
    contexto: CONTEXT_QUESTIONS.filter((q) => isContextQuestionVisible(q, contextAnswers)).map((q) => ({
      id: q.id,
      pergunta: label(q, 'pergunta', locale),
      resposta: contextAnswerDisplay(q, contextAnswers, t('naoInformado')),
    })),
    resultado: {
      nivelFinal: finalLevel,
      nivelFinalRotulo: `${label(RISK_LEVELS[finalLevel], 'label', locale)}${parcialSuffix(covFinal, t)}`,
      cobertura: covFinal,
      versaoA: qual && covA
        ? {
            nivel: qual.level,
            nivelRotulo: `${label(qual.levelInfo, 'label', locale)}${parcialSuffix(covA, t)}`,
            nivelDescricao: label(qual.levelInfo, 'description', locale),
            protocoloNaoAvaliavel: qual.protocoloNaoAvaliavel,
            cobertura: covA,
            eixos: qual.axisResults.map((r) => ({
              id: r.axisId,
              nome: r.axisName,
              nivel: r.level,
              nivelRotulo: label(RISK_LEVELS[r.level], 'label', locale),
              respostasRisco: r.riskCount,
              totalQuestoes: r.totalQuestions,
              respondidas: r.respondidas,
              questoesVisiveis: r.totalVisiveis,
              referenciaNormativa: r.referenciaNormativa ?? null,
            })),
          }
        : null,
      versaoB: quant && covB
        ? {
            nivel: quant.level,
            nivelRotulo: `${label(quant.levelInfo, 'label', locale)}${parcialSuffix(covB, t)}`,
            nivelDescricao: label(quant.levelInfo, 'description', locale),
            cobertura: covB,
            pontuacaoTotal: quant.totalScore,
            pontuacaoMaxima: quant.maxScore,
            clausulaPrevalencia: quant.clausulaPrevalencia,
            protocoloNaoAvaliavel: quant.protocoloNaoAvaliavel,
            blocos: quant.blockResults.map((r) => ({
              id: r.blockId,
              nome: r.blockName,
              pontuacao: r.score,
              maxPontos: r.maxPontos,
              respondidas: r.respondidas,
              questoesVisiveis: r.totalVisiveis,
              referenciaNormativa: r.referenciaNormativa ?? null,
            })),
          }
        : null,
    },
    eliminatoria: eliminatoryQuestionId && eliminatoryInfo
      ? { questaoId: eliminatoryQuestionId, motivo: eliminatoryInfo.motivo, referencia: eliminatoryInfo.ref }
      : null,
    requisitos: requirements.map((req) => ({
      id: req.id,
      nivel: req.nivel,
      texto: label(req, 'texto', locale),
      res738: req.id.startsWith('req-738'),
    })),
    itensNaoAvaliados: unanswered.map((it) => ({ id: it.id, escopo: it.scope, secao: it.scopeName, item: it.label })),
    naoSeAplica: naoSeAplica.map((it) => ({ id: it.id, secao: it.scopeName, item: it.label, eliminatorio: it.eliminatorio })),
    aviso: { texto: getDisclaimer(locale), cortesia: getCourtesyNotice(locale) },
    rodape: {
      geradoEm: t('footerGerado', { date: dataFmt }),
      desenvolvimento: t('footerDev'),
      licenca: t('footerLicenca'),
    },
  };
}

// ----- CSV do registro-espelho -----
// Colunas fixas (secao;id;item;valor), separador ';' e BOM para o Excel pt-BR.

function csvCell(v: string | number | boolean): string {
  const s = String(v);
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildMirrorCSV(rec: MirrorRecord): string {
  const t = reportTranslator(rec.idioma);
  const rows: string[] = ['secao;id;item;valor'];
  const push = (secao: string, id: string, item: string, valor: string | number | boolean) =>
    rows.push([secao, id, item, valor].map(csvCell).join(';'));

  push('cabecalho', '', t('versaoRotulo'), rec.cabecalho.versao);
  push('cabecalho', '', t('dataRotulo'), rec.cabecalho.data);
  push('cabecalho', '', t('utilizaBanco'), rec.cabecalho.usaBancoDeDados ? t('bancoSimLongoTxt') : t('nao'));
  push('cabecalho', '', t('versaoMatrizRotulo'), rec.cabecalho.versaoMatriz);

  push('identificacao', 'titulo', t('identTituloProjeto'), rec.identificacao.titulo);
  push('identificacao', 'instituicao', t('identInstituicao'), rec.identificacao.instituicao);
  push('identificacao', 'cep_nome', t('identCep'), rec.identificacao.cep);

  for (const c of rec.contexto) push('contexto', c.id, c.pergunta, c.resposta);

  push('resultado', '', `${t('nivelPalavra')} ${rec.resultado.nivelFinal}`, rec.resultado.nivelFinalRotulo);
  push('resultado', '', t('coberturaRotulo'), rec.resultado.cobertura.texto);
  if (rec.resultado.versaoA) {
    const a = rec.resultado.versaoA;
    push('resultado-a', '', `${t('nivelPalavra')} ${a.nivel}`, a.nivelRotulo);
    push('resultado-a', '', t('coberturaRotulo'), a.cobertura.texto);
    for (const e of a.eixos) {
      push('resultado-a', e.id, e.nome, t('respostasRiscoTxt', { respondidas: String(e.respondidas), total: String(e.questoesVisiveis), count: String(e.respostasRisco), level: e.nivel, label: e.nivelRotulo }));
    }
  }
  if (rec.resultado.versaoB) {
    const b0 = rec.resultado.versaoB;
    push('resultado-b', '', t('pontuacaoTotalTxt', { score: String(b0.pontuacaoTotal), max: String(b0.pontuacaoMaxima) }), `${t('nivelPalavra')} ${b0.nivel} — ${b0.nivelRotulo}`);
    push('resultado-b', '', t('coberturaRotulo'), b0.cobertura.texto);
    if (b0.clausulaPrevalencia) push('resultado-b', '', t('clausulaTitulo'), t('clausulaTexto'));
    for (const b of b0.blocos) {
      push('resultado-b', b.id, b.nome, `${b.pontuacao} / ${b.maxPontos} ${t('pts')} · ${t('respondidasTxt', { respondidas: String(b.respondidas), total: String(b.questoesVisiveis) })}`);
    }
  }

  if (rec.eliminatoria) {
    push('eliminatoria', rec.eliminatoria.questaoId, t('eliminatorioTxtTitulo', { id: rec.eliminatoria.questaoId }), rec.eliminatoria.motivo);
  }

  for (const req of rec.requisitos) push('requisitos', req.id, `${t('nivelPalavra')} ${req.nivel}`, req.texto);

  if (rec.itensNaoAvaliados.length === 0) {
    push('itens-nao-avaliados', '', '', t('itensOkTxt'));
  } else {
    for (const it of rec.itensNaoAvaliados) push('itens-nao-avaliados', it.id, it.secao, it.item);
  }

  for (const it of rec.naoSeAplica) {
    push('nao-se-aplica', it.id, it.secao, `${it.item}${it.eliminatorio ? ` [${t('naTagEliminatorio')}]` : ''}`);
  }

  push('aviso', '', t('avisoRotulo'), rec.aviso.texto);
  if (rec.aviso.cortesia) push('aviso', '', '', rec.aviso.cortesia);

  push('rodape', '', '', rec.rodape.geradoEm);
  push('rodape', '', '', rec.rodape.desenvolvimento);
  push('rodape', '', '', rec.rodape.licenca);

  return '\uFEFF' + rows.join('\r\n');
}

// ----- Downloads do registro-espelho -----
// Nome do arquivo: registro-maria-<AAAA-MM-DD>.<ext>

function downloadMirrorFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadMirrorJSON(rec: MirrorRecord): void {
  downloadMirrorFile(`registro-maria-${rec.exportadoEm.slice(0, 10)}.json`, JSON.stringify(rec, null, 2), 'application/json');
}

export function downloadMirrorCSV(rec: MirrorRecord): void {
  downloadMirrorFile(`registro-maria-${rec.exportadoEm.slice(0, 10)}.csv`, buildMirrorCSV(rec), 'text/csv');
}

export function downloadMirrorTXT(text: string): void {
  downloadMirrorFile(`registro-maria-${new Date().toISOString().slice(0, 10)}.txt`, text, 'text/plain');
}
