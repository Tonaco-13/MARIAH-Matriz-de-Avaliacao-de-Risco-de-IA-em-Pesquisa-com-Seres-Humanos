// ============================================================
// MARIAH - Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos
// Data definitions, types, and scoring rules
// ============================================================

import spec from '../../../spec/mariah-spec.json';

// Dados da matriz: carregados de spec/mariah-spec.json (fonte única, versionada).
// Tipos e lógica (getThresholds) permanecem aqui. Editar VALORES na spec.

// ----- Types -----

export type MarcaVersion = 'A' | 'B';

export type RiskLevel = 'I' | 'II' | 'III' | 'IV';

export type RiskLevelInfo = {
  level: RiskLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
};

export type QualitativeQuestion = {
  id: string;
  pergunta: string;
  riskAnswer: 'sim' | 'nao';
  dica: string;
  /** Quando true, a resposta de risco torna o protocolo NÃO AVALIÁVEL no mérito (§7.3.6 / Res 738). */
  eliminatorio?: boolean;
  /**
   * Quando true, a questão aceita uma terceira resposta "Não se aplica" (N/A),
   * tratada como não-risco e não-eliminatória. Usado em questões condicionais
   * onde a pergunta só faz sentido se certa premissa estiver presente
   * (ex.: 3.b.2 — Termo de Anuência só se aplica se o banco for constituído
   * fora do âmbito da pesquisa).
   */
  hasNaOption?: boolean;
  /**
   * Quando true, a questão é apenas de registro/diligência e NÃO entra na
   * contagem de respostas de risco do eixo (não altera o nível consolidado).
   * Usado em 2.10 (plano de novo consentimento) na Versão A, cuja exigência
   * legal não é graduável por contagem — a regra do máximo absorve o item.
   */
  naoPontuavel?: boolean;
  /**
   * Texto explicativo específico exibido nos relatórios e na tela de Resultados
   * quando esta questão eliminatória é acionada. Se ausente, usa-se o texto
   * padrão da Res. 738 (cadeia de custódia / §7.3.6).
   */
  motivoEliminatorio?: string;
  /** Referência normativa curta para os badges de "não avaliável" (ex.: "§7.3.6"). */
  refEliminatoria?: string;
};

export type QualitativeAxis = {
  id: string;
  nome: string;
  descricao: string;
  questoes: QualitativeQuestion[];
  /**
   * Quando true, este eixo só é aplicado se o protocolo usa banco de dados
   * (filtro do Passo 0, conforme Res. CNS n.º 738/2024).
   */
  condicionalBancoDados?: boolean;
  /**
   * Regra de elevação específica (Eixo 3.b não segue a regra geral 0→I / 1-2→II / 3-4→III / 5+→IV;
   * usa 0→não eleva / 1-2→III / 3+→IV).
   */
  elevacaoEspecial?: 'banco-dados';
  /** Referência normativa (Res 738, LGPD, etc.) exibida no cabeçalho do eixo. */
  referenciaNormativa?: string;
};

export type QuantitativeQuestion = {
  id: string;
  pergunta: string;
  riskAnswer: 'sim' | 'nao';
  pontos: number;
  dica: string;
  efeito?: 'risco' | 'mitigacao' | 'evidencia' | 'diligencia';
  /**
   * Item de diligência/descritiva na Versão B que NÃO soma ao teto.
   * (efeito 'diligencia' já implica não-pontuável; flag mantida por clareza.)
   */
  naoPontuavel?: boolean;
  /** Quando true, a resposta de risco torna o protocolo NÃO AVALIÁVEL no mérito (§7.3.6 / Res 738). */
  eliminatorio?: boolean;
  /**
   * Quando true, a questão aceita uma terceira resposta "Não se aplica" (N/A),
   * tratada como não-risco e não-eliminatória. Usado em questões condicionais
   * onde a pergunta só faz sentido se certa premissa estiver presente
   * (ex.: P6.b.2 — só se aplica se o banco é constituído fora do âmbito da pesquisa).
   */
  hasNaOption?: boolean;
  /**
   * Texto explicativo específico exibido nos relatórios e na tela de Resultados
   * quando esta questão eliminatória é acionada. Se ausente, usa-se o texto
   * padrão da Res. 738 (cadeia de custódia / §7.3.6). Usado em P2.8 (plano de
   * novo consentimento), cujo bloqueio decorre da Lei n.º 14.874/2024 e da LGPD.
   */
  motivoEliminatorio?: string;
  /** Referência normativa curta para os badges de "não avaliável" (ex.: "§7.3.6"). */
  refEliminatoria?: string;
};

export type QuantitativeBlock = {
  id: string;
  nome: string;
  descricao: string;
  subtitulo?: string;
  questoes: QuantitativeQuestion[];
  maxPontos: number;
  /**
   * Quando true, este bloco só é aplicado se o protocolo usa banco de dados
   * (filtro do Passo 0, conforme Res. CNS n.º 738/2024). Seus pontos SOMAM ao bloco base.
   */
  condicionalBancoDados?: boolean;
  /** Referência normativa (Res 738, LGPD, etc.) exibida no cabeçalho do bloco. */
  referenciaNormativa?: string;
};

export type Requirement = {
  id: string;
  texto: string;
  nivel: RiskLevel;
};

// ----- Risk Level Definitions -----

export const RISK_LEVELS = spec.riskLevels as unknown as Record<RiskLevel, RiskLevelInfo>;

// ----- Qualitative Matrix (Version A) -----

export const QUALITATIVE_AXES = spec.qualitativeAxes as unknown as QualitativeAxis[];

// ----- Quantitative Matrix (Version B) -----

export const QUANTITATIVE_BLOCKS = spec.quantitativeBlocks as unknown as QuantitativeBlock[];

// ----- Quantitative thresholds (base and with Res 738 Bloco 6.b) -----

export type NivelThresholds = {
  maxScore: number;
  /** Limite superior (inclusivo) do Nível I; score <= este limite → Nível I. */
  levelI: number;
  /** Limite superior (inclusivo) do Nível II. */
  levelII: number;
  /** Limite superior (inclusivo) do Nível III. Acima → Nível IV. */
  levelIII: number;
};

/** Faixas base (protocolos SEM banco de dados). Conforme matriz original (238 pts). */
export const THRESHOLDS_BASE = spec.thresholdsBase as NivelThresholds;

/**
 * Faixas recalibradas para protocolos COM banco de dados (Bloco 6.b ativo, máx 267 pts).
 * Proporcionais à matriz base: 50/238 ≈ 21%; 110/238 ≈ 46%; 180/238 ≈ 76%.
 */
export const THRESHOLDS_COM_BANCO = spec.thresholdsComBanco as NivelThresholds;

export function getThresholds(usesDatabase: boolean): NivelThresholds {
  return usesDatabase ? THRESHOLDS_COM_BANCO : THRESHOLDS_BASE;
}

// ----- Requirements by Level (Cumulative) -----

export const REQUIREMENTS = spec.requirements as unknown as Requirement[];

// ----- Requisitos adicionais Res. CNS n.º 738/2024 (aplicáveis apenas quando usesDatabase) -----

export const REQUIREMENTS_RES738 = spec.requirementsRes738 as unknown as Requirement[];

// ----- Passo 0: Filtro de Banco de Dados (Res. CNS n.º 738/2024) -----

export const DATABASE_FILTER_QUESTION = spec.databaseFilterQuestion;

// ----- Context Characterization Questions -----

export const CONTEXT_QUESTIONS = spec.contextQuestions;


/** Versão da matriz (para carimbo nos relatórios). */
export const MATRIX_VERSION = spec.matrixVersion as string;