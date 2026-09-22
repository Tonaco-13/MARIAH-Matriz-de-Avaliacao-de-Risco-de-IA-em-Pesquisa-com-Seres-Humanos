'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Printer,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ChevronRight,
  ClipboardCheck,
  Download,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { RISK_LEVELS, REQUIREMENTS, REQUIREMENTS_RES738, label } from './data';
import type { RiskLevel } from './data';
import type { QualitativeAnswer, QuantitativeAnswer } from './utils';
import {
  getQualitativeFinalLevel,
  getQuantitativeFinalResult,
  generateReportHTML,
  getUnansweredItems,
  getEliminatoryInfo,
  buildValidationExport,
  downloadValidationExport,
} from './utils';
import StepIndicator from './StepIndicator';
import type { WizardStep } from './StepIndicator';
import { MARIA_DISCLAIMER } from './disclaimer';

type ResultsProps = {
  version: 'A' | 'B';
  useAAsTriagem: boolean;
  /** Quando true, inclui Eixo 3.b / Bloco 6.b (Res. CNS n.º 738/2024). */
  usesDatabase: boolean;
  contextAnswers: Record<string, string>;
  qualitativeAnswers: QualitativeAnswer;
  quantitativeAnswers: QuantitativeAnswer;
  onRestart: () => void;
  onContinueToB?: () => void;
  /** Navegação direta por clique nos passos do StepIndicator. */
  onStepClick: (step: WizardStep) => void;
};

export default function Results({
  version,
  useAAsTriagem,
  usesDatabase,
  contextAnswers,
  qualitativeAnswers,
  quantitativeAnswers,
  onRestart,
  onContinueToB,
  onStepClick,
}: ResultsProps) {
  const t = useTranslations();
  const locale = useLocale();

  const LevelBadge = ({ level }: { level: RiskLevel }) => {
    const info = RISK_LEVELS[level];
    const colorMap: Record<RiskLevel, string> = {
      I: 'bg-green-100 text-green-800 border-green-300',
      II: 'bg-amber-100 text-amber-800 border-amber-300',
      III: 'bg-orange-100 text-orange-800 border-orange-300',
      IV: 'bg-red-100 text-red-800 border-red-300',
    };
    return (
      <Badge className={`${colorMap[level]} border text-base px-4 py-1.5 font-semibold`}>
        {t('assessment.nivelBadge', { level, label: label(info, 'label', locale) })}
      </Badge>
    );
  };

  const LevelCard = ({ level }: { level: RiskLevel }) => {
    const info = RISK_LEVELS[level];
    const bgMap: Record<RiskLevel, string> = {
      I: 'bg-green-50 border-green-300',
      II: 'bg-amber-50 border-amber-300',
      III: 'bg-orange-50 border-orange-300',
      IV: 'bg-red-50 border-red-300',
    };
    const textMap: Record<RiskLevel, string> = {
      I: 'text-green-700',
      II: 'text-amber-700',
      III: 'text-orange-700',
      IV: 'text-red-700',
    };
    const iconMap: Record<RiskLevel, React.ReactNode> = {
      I: <CheckCircle2 className="h-10 w-10 text-green-500" />,
      II: <AlertTriangle className="h-10 w-10 text-amber-500" />,
      III: <AlertTriangle className="h-10 w-10 text-orange-500" />,
      IV: <AlertTriangle className="h-10 w-10 text-red-500" />,
    };

    return (
      <Card className={`border-2 ${bgMap[level]}`}>
        <CardContent className="py-8 text-center">
          <div className="flex justify-center mb-3">{iconMap[level]}</div>
          <div className={`text-5xl font-bold ${textMap[level]} mb-1`}>
            {t('results.nivelCard', { level })}
          </div>
          <div className={`text-2xl font-semibold ${textMap[level]} mb-3`}>
            {label(info, 'label', locale)}
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{label(info, 'description', locale)}</p>
        </CardContent>
      </Card>
    );
  };

  const qualResult = version === 'A' || useAAsTriagem
    ? getQualitativeFinalLevel(qualitativeAnswers, usesDatabase, contextAnswers, locale)
    : null;

  const quantResult = version === 'B'
    ? getQuantitativeFinalResult(quantitativeAnswers, usesDatabase, contextAnswers, locale)
    : null;

  // No modo triagem A→B, o nível consolidado é o MAIS ALTO entre as duas matrizes
  // (critério mais conservador, alinhado ao que o relatório imprime).
  const levelOrderArr: RiskLevel[] = ['I', 'II', 'III', 'IV'];
  const finalLevel: RiskLevel =
    useAAsTriagem && version === 'B' && qualResult && quantResult
      ? levelOrderArr.indexOf(qualResult.level) >= levelOrderArr.indexOf(quantResult.level)
        ? qualResult.level
        : quantResult.level
      : version === 'A'
        ? qualResult!.level
        : quantResult!.level;

  // Eliminatório: se acionado em qualquer das duas matrizes (no triagem), considera.
  const protocoloNaoAvaliavel =
    (version === 'A' || useAAsTriagem ? qualResult?.protocoloNaoAvaliavel === true : false) ||
    (version === 'B' ? quantResult?.protocoloNaoAvaliavel === true : false);
  const eliminatoryQuestionId =
    (version === 'B' ? quantResult?.eliminatoryQuestionId ?? null : null) ??
    (version === 'A' || useAAsTriagem ? qualResult?.eliminatoryQuestionId ?? null : null);

  const handlePrint = () => {
    const html = generateReportHTML(
      version,
      contextAnswers,
      qualitativeAnswers,
      quantitativeAnswers,
      usesDatabase,
      useAAsTriagem,
      locale
    );
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    }
  };

  const handleExportValidation = () => {
    const payload = buildValidationExport({
      version,
      useAAsTriagem,
      usesDatabase,
      contextAnswers,
      qualitativeAnswers,
      quantitativeAnswers,
    });
    downloadValidationExport(payload);
  };

  // Check if triagem mode, still on Version A, and level is III or IV → suggest Version B
  const showContinueToB = useAAsTriagem && version === 'A' && qualResult &&
    (qualResult.level === 'III' || qualResult.level === 'IV');

  // Triagem mode + Versão A + Nível I ou II → não há recomendação automática,
  // mas oferece opt-in para o pesquisador que quer documentação mais robusta
  // (ex.: registro do estudo, exigência de CEP local, comparação entre protocolos).
  const showOptionalContinueToB = useAAsTriagem && version === 'A' && qualResult &&
    (qualResult.level === 'I' || qualResult.level === 'II');

  // No modo triagem (A→B percorrida), o relatório é combinado e a auditoria
  // soma itens não avaliados de ambas as matrizes (sem duplicar contexto).
  const isCombinedReport = useAAsTriagem && version === 'B';

  const unansweredItems = isCombinedReport
    ? [
        ...getUnansweredItems('A', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale),
        ...getUnansweredItems('B', contextAnswers, qualitativeAnswers, quantitativeAnswers, usesDatabase, locale)
          .filter((it) => it.scope !== 'contexto'),
      ]
    : getUnansweredItems(
        version,
        contextAnswers,
        qualitativeAnswers,
        quantitativeAnswers,
        usesDatabase,
        locale
      );
  const unansweredByScope = unansweredItems.reduce<Record<string, typeof unansweredItems>>(
    (acc, item) => {
      (acc[item.scopeName] ??= []).push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-teal-700">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Shield className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{t('app.title')}</h1>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 whitespace-nowrap">
                    {t('app.badgePreliminar')}
                  </span>
                </div>
                <p className="text-teal-700 text-xs">{t('results.headerSubtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep="results" version={version} onStepClick={onStepClick} />
        </div>

        {/* Context */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('results.contextTitle')}
              {usesDatabase && (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                  {t('results.contextRes738Badge')}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">{t('results.perguntaSistema')}</span>
                <p className="mt-1">{contextAnswers['contexto1'] || t('results.naoInformado')}</p>
              </div>
              <Separator />
              <div>
                <span className="font-medium text-muted-foreground">{t('results.autonomiaSistema')}</span>
                <p className="mt-1">{contextAnswers['contexto2'] || t('results.naoInformado')}</p>
              </div>
              <Separator />
              <div>
                <span className="font-medium text-muted-foreground">{t('results.utilizaBanco')}</span>
                <p className="mt-1">
                  {usesDatabase
                    ? t('results.bancoSim')
                    : t('ui.nao')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protocolo não avaliável (eliminatório) */}
        {protocoloNaoAvaliavel && (
          <Card className="border-2 border-red-400 bg-red-50 mb-6">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    {t('results.naoAvaliavelTitle')}
                  </h3>
                  <p className="text-sm text-red-800">
                    {t.rich('results.hipoteseEliminatoria', {
                      id: eliminatoryQuestionId,
                      motivo: getEliminatoryInfo(eliminatoryQuestionId).motivo,
                      b: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-sm text-red-800 mt-2">
                    {t('results.naoAgravamento')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Banner do modo triagem (relatório combinado A+B) */}
        {isCombinedReport && qualResult && quantResult && (
          <Card className="border-l-4 border-slate-600 bg-slate-50 mb-4">
            <CardContent className="py-3">
              <div className="flex items-start gap-3 flex-wrap">
                <FileText className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-semibold text-slate-800">
                    {t('results.triagemTitulo')}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    {t.rich('results.triagemDesc', { b: (chunks) => <strong>{chunks}</strong> })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-teal-100 text-teal-700 border border-teal-300 text-[10px]">
                    {t('results.badgeA', { level: qualResult.level })}
                  </Badge>
                  <Badge className="bg-slate-200 text-slate-800 border border-slate-400 text-[10px]">
                    {t('results.badgeB', { level: quantResult.level })}
                  </Badge>
                  <Badge className="bg-red-100 text-red-700 border border-red-300 text-[10px] font-semibold">
                    {t('results.badgeConsolidado', { level: finalLevel })}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main result */}
        {/* Precedência visual: "não avaliável" bloqueia a classificação — não exibir o nível como resultado. */}
        {protocoloNaoAvaliavel ? (
          <Card className="border-2 border-slate-300 bg-slate-50 mb-6">
            <CardContent className="py-6 text-center">
              <p className="text-2xl font-bold text-slate-700">{t('results.classificacaoSuspensa')}</p>
              <p className="text-sm text-slate-600 mt-1">
                {t.rich('results.suspensaDesc', { b: (chunks) => <strong>{chunks}</strong> })}
              </p>
            </CardContent>
          </Card>
        ) : (
          <LevelCard level={finalLevel} />
        )}

        {/* Cláusula de Prevalência Ética warning */}
        {quantResult?.clausulaPrevalencia && (
          <Card className="border-2 border-red-300 bg-red-50 mb-6 mt-6">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">{t('assessment.b.clausulaBadge')}</h3>
                  <p className="text-sm text-red-700">
                    {t.rich('results.clausulaDesc', { b: (chunks) => <strong>{chunks}</strong> })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Triagem: suggest Version B (Níveis III/IV — recomendação ativa) */}
        {showContinueToB && (
          <Card className="border-2 border-amber-300 bg-amber-50 mb-6 mt-6">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">{t('results.recomendacaoTitle')}</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    {t('results.recomendacaoDesc', { level: qualResult!.level })}
                  </p>
                  <Button
                    className="bg-slate-700 hover:bg-slate-800 text-white"
                    onClick={onContinueToB}
                  >
                    {t('results.continuarVersaoB')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Triagem: ponte opt-in para Versão B (Níveis I/II — sem recomendação,
            apenas opção para quem quer documentação mais robusta) */}
        {showOptionalContinueToB && (
          <Card className="border border-slate-200 bg-slate-50/50 mb-6 mt-6">
            <CardContent className="py-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2 flex-1 min-w-[200px]">
                  <FileText className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {t('results.opcionalDesc', { level: qualResult!.level })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 shrink-0"
                  onClick={onContinueToB}
                >
                  {t('results.aplicarVersaoB')}
                  <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Version A: Axis breakdown */}
        {qualResult && (
          <Card className="mb-6 mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('results.porEixo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualResult.axisResults.map((ar) => {
                  const pct = (ar.riskCount / ar.totalQuestions) * 100;
                  const isRes738 = ar.condicionalBancoDados;

                  return (
                    <div
                      key={ar.axisId}
                      className={`border rounded-lg p-4 ${isRes738 ? 'bg-blue-50/30 border-blue-200' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{ar.axisName}</span>
                          {isRes738 && (
                            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                              {t('results.res738Short')}
                            </Badge>
                          )}
                        </div>
                        <LevelBadge level={ar.level} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>{t('results.respostasRiscoEixo', { count: String(ar.riskCount), total: String(ar.totalQuestions) })}</span>
                        {isRes738 && (
                          <span className="text-blue-700">
                            {t('results.elevacaoEspecialCurta')}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            ar.level === 'I' ? 'bg-green-500' :
                            ar.level === 'II' ? 'bg-amber-500' :
                            ar.level === 'III' ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm font-medium">{t.rich('results.consolidacaoEixos', { b: (chunks) => <strong>{chunks}</strong> })}</span>
                <LevelBadge level={qualResult.level} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Version B: Block breakdown */}
        {quantResult && (
          <Card className="mb-6 mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('results.porBloco')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quantResult.blockResults.map((br) => {
                  const pct = br.maxPontos > 0 ? Math.min((Math.max(br.score, 0) / br.maxPontos) * 100, 100) : 0;
                  const isRes738 = br.condicionalBancoDados;

                  return (
                    <div
                      key={br.blockId}
                      className={`border rounded-lg p-3 ${isRes738 ? 'bg-blue-50/30 border-blue-200' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{br.blockName}</span>
                          {isRes738 && (
                            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                              {t('results.res738Short')}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm font-mono font-semibold">
                          {br.score}{br.isBlock7 && t('results.bidirecionalSuffix')} / {br.maxPontos} pts
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            pct <= 25 ? 'bg-green-500' :
                            pct <= 50 ? 'bg-amber-500' :
                            pct <= 75 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {t('assessment.b.pontuacaoTotal')}
                  {usesDatabase && (
                    <span className="text-xs text-blue-700 ml-2">{t('results.incluiBloco6b')}</span>
                  )}
                </span>
                <span className="text-xl font-bold">
                  {quantResult.totalScore}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{quantResult.maxScore}
                  </span>
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      quantResult.totalScore <= quantResult.thresholds.levelI ? 'bg-green-500' :
                      quantResult.totalScore <= quantResult.thresholds.levelII ? 'bg-amber-500' :
                      quantResult.totalScore <= quantResult.thresholds.levelIII ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(quantResult.totalScore / quantResult.maxScore) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{t('assessment.b.faixaI', { max: String(quantResult.thresholds.levelI) })}</span>
                  <span>{t('assessment.b.faixaII', { min: String(quantResult.thresholds.levelI + 1), max: String(quantResult.thresholds.levelII) })}</span>
                  <span>{t('assessment.b.faixaIII', { min: String(quantResult.thresholds.levelII + 1), max: String(quantResult.thresholds.levelIII) })}</span>
                  <span>{t('assessment.b.faixaIV', { min: String(quantResult.thresholds.levelIII + 1), max: String(quantResult.maxScore) })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t('results.requisitosTitle')}
              {usesDatabase && (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                  {t('results.maisRes738')}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['I', 'II', 'III', 'IV'] as RiskLevel[]).map((lvl) => {
                const levelOrder: RiskLevel[] = ['I', 'II', 'III', 'IV'];
                const lvlReqsBase = REQUIREMENTS.filter((r) => r.nivel === lvl);
                const lvlReqs738 = usesDatabase
                  ? REQUIREMENTS_RES738.filter((r) => r.nivel === lvl)
                  : [];
                const lvlReqs = [...lvlReqsBase, ...lvlReqs738];
                const isActive = lvl === finalLevel;
                const isBelowOrEqual =
                  levelOrder.indexOf(lvl) <= levelOrder.indexOf(finalLevel);

                const borderClass = isActive
                  ? lvl === 'I' ? 'border-2 border-green-300 ring-2 ring-green-100' :
                    lvl === 'II' ? 'border-2 border-amber-300 ring-2 ring-amber-100' :
                    lvl === 'III' ? 'border-2 border-orange-300 ring-2 ring-orange-100' :
                    'border-2 border-red-300 ring-2 ring-red-100'
                  : 'border';

                return (
                  <div
                    key={lvl}
                    className={`
                      rounded-lg p-4 transition-all
                      ${borderClass}
                      ${isBelowOrEqual ? '' : 'opacity-40'}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <LevelBadge level={lvl} />
                      {isActive && <span className="text-xs font-semibold text-muted-foreground">{t('results.nivelAtualArrow')}</span>}
                    </div>
                    <ul className="space-y-1.5 ml-2">
                      {lvlReqs.map((req) => {
                        const isRes738 = req.id.startsWith('req-738');
                        return (
                          <li key={req.id} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                              isBelowOrEqual ? 'text-green-500' : 'text-muted-foreground/40'
                            }`} />
                            <span className={isBelowOrEqual ? '' : 'line-through text-muted-foreground'}>
                              {isRes738 && (
                                <Badge className="mr-1 bg-blue-50 text-blue-700 border border-blue-200 text-[9px] px-1 py-0">
                                  {t('results.res738Short')}
                                </Badge>
                              )}
                              {label(req, 'texto', locale)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Itens não avaliados — auditoria */}
        <Card className={`mb-6 ${unansweredItems.length > 0 ? 'border-amber-300 bg-amber-50/40' : 'border-green-200 bg-green-50/40'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {unansweredItems.length > 0 ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>{t('results.itensTitle')}</span>
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px]">
                    {t('results.itensCount', { count: unansweredItems.length })}
                  </Badge>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{t('results.itensTitle')}</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unansweredItems.length === 0 ? (
              <p className="text-sm text-green-700">
                {t('results.nenhumItem')}
              </p>
            ) : (
              <>
                <p className="text-sm text-amber-900 mb-3">
                  {t.rich('results.auditoriaDesc', { b: (chunks) => <strong>{chunks}</strong> })}
                </p>
                <div className="space-y-3">
                  {Object.entries(unansweredByScope).map(([scopeName, items]) => (
                    <div key={scopeName} className="border-l-2 border-amber-300 pl-3">
                      <p className="text-xs font-semibold text-amber-900 mb-1">{scopeName}</p>
                      <ul className="space-y-1">
                        {items.map((it) => (
                          <li key={it.id} className="text-xs text-amber-900 flex gap-2">
                            <span className="font-mono text-[11px] bg-amber-100 text-amber-900 border border-amber-200 px-1 rounded shrink-0 self-start">
                              {it.id}
                            </span>
                            <span className="leading-relaxed">{it.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-dashed bg-muted/30 mb-6">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">{t('results.avisoImportante')}</p>
                <p>{MARIA_DISCLAIMER}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validação Local (Apêndice F do Guia — em revisão) */}
        <Card className="border-dashed border-teal-300 bg-teal-50/30 mb-6">
          <CardContent className="py-5">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <p className="font-medium text-foreground">{t('footer.linkValidacao')}</p>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium px-2 py-0 border-amber-400 text-amber-700 bg-amber-50"
                  >
                    {t('results.emRevisaoBadge')}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {t.rich('results.validacaoDesc', { em: (chunks) => <em>{chunks}</em> })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-100"
                  >
                    <a
                      href="/planilha-validacao-local-maria.xlsx"
                      download
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {t('results.planilhaModelo')}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-100"
                  >
                    <a
                      href="/guia-validacao-local-maria.docx"
                      download
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {t('results.roteiroCompleto')}
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleExportValidation}
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    {t('results.exportarJson')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-teal-800 hover:bg-teal-100"
                  >
                    <Link href="/validacao">
                      {t('results.saibaMais')}
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {t('results.arquivosAtualizados')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            {t('results.imprimir')}
          </Button>
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('results.novaAvaliacao')}
          </Button>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            {t('results.footer', { versao: version === 'A' ? t('app.versionLabelA') : t('app.versionLabelB') })}
          </p>
        </div>
      </footer>
    </div>
  );
}
