'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { RISK_LEVELS } from './data';
import type { RiskLevel } from './data';
import type { QualitativeAnswer } from './utils';
import { countRiskAnswersAxis, getAxisRiskLevel, getApplicableAxes } from './utils';
import StepIndicator from './StepIndicator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type QualitativeAssessmentProps = {
  answers: QualitativeAnswer;
  onAnswer: (questionId: string, answer: 'sim' | 'nao') => void;
  /** Quando true, inclui Eixo 3.b (Res. CNS n.º 738/2024). */
  usesDatabase: boolean;
  onComplete: () => void;
  onBack: () => void;
};

function getRiskLevelBadge(level: RiskLevel) {
  const info = RISK_LEVELS[level];
  const colorMap: Record<RiskLevel, string> = {
    I: 'bg-green-100 text-green-700 border-green-200',
    II: 'bg-amber-100 text-amber-700 border-amber-200',
    III: 'bg-orange-100 text-orange-700 border-orange-200',
    IV: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <Badge className={`${colorMap[level]} border`}>
      Nível {level} — {info.label}
    </Badge>
  );
}

export default function QualitativeAssessment({
  answers,
  onAnswer,
  usesDatabase,
  onComplete,
  onBack,
}: QualitativeAssessmentProps) {
  const axesList = getApplicableAxes(usesDatabase);
  const [currentAxis, setCurrentAxis] = useState(0);
  const axis = axesList[Math.min(currentAxis, axesList.length - 1)];

  const riskCount = countRiskAnswersAxis(axis, answers);
  const level = getAxisRiskLevel(riskCount, axis);
  const answeredCount = axis.questoes.filter((q) => answers[q.id] !== undefined).length;
  const allAnswered = axis.questoes.every((q) => answers[q.id] !== undefined);

  const totalQuestions = axesList.reduce((sum, a) => sum + a.questoes.length, 0);
  const totalAnswered = axesList.reduce(
    (sum, a) => sum + a.questoes.filter((q) => answers[q.id] !== undefined).length,
    0
  );

  const handleNext = useCallback(() => {
    if (currentAxis < axesList.length - 1) {
      setCurrentAxis((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete();
    }
  }, [currentAxis, axesList.length, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentAxis > 0) {
      setCurrentAxis((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  }, [currentAxis, onBack]);

  // Get axis-level summary for all axes
  const axisSummaries = axesList.map((a, idx) => {
    const rc = countRiskAnswersAxis(a, answers);
    const lvl = getAxisRiskLevel(rc, a);
    const done = a.questoes.every((q) => answers[q.id] !== undefined);
    return { axis: a, index: idx, riskCount: rc, level: lvl, done };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MARA</h1>
              <p className="text-teal-100 text-xs">Versão A — Qualitativa</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep="assessment" version="A" />
        </div>

        {/* Global progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso geral</span>
            <span>{totalAnswered}/{totalQuestions} questões respondidas</span>
          </div>
          <Progress value={(totalAnswered / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Axis navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {axisSummaries.map((s) => {
            const isRes738 = s.axis.condicionalBancoDados;
            // Label uses the axis ID suffix (1, 2, 3, 3.b, 4, 5) to stay in sync with the matrix.
            const idMatch = s.axis.id.match(/^eixo(\d+b?)$/);
            const label = idMatch
              ? idMatch[1].includes('b')
                ? `Eixo 3.b`
                : `Eixo ${idMatch[1]}`
              : `Eixo ${s.index + 1}`;
            return (
              <button
                key={s.axis.id}
                onClick={() => setCurrentAxis(s.index)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${s.index === currentAxis
                    ? isRes738 ? 'bg-blue-600 text-white shadow-sm' : 'bg-teal-600 text-white shadow-sm'
                    : s.done
                      ? isRes738
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                        : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {s.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
                {label}
                {isRes738 && (
                  <span className="text-[9px] bg-white/30 px-1 rounded">738</span>
                )}
                {s.done && (
                  <Badge className={`ml-1 text-[10px] px-1 py-0 ${
                    s.level === 'I' ? 'bg-green-100 text-green-700' :
                    s.level === 'II' ? 'bg-amber-100 text-amber-700' :
                    s.level === 'III' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {s.level}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Current axis */}
        <Card className={`border-2 mb-6 ${axis.condicionalBancoDados ? 'border-blue-300' : 'border-teal-200'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                  {axis.nome}
                  {axis.condicionalBancoDados && (
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs">
                      Res 738/2024
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm mt-1">{axis.descricao}</CardDescription>
                {axis.elevacaoEspecial === 'banco-dados' && (
                  <p className="text-xs mt-2 text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 inline-block">
                    ⚠ Elevação especial: 0 → não eleva · 1-2 risco → Nível III · 3+ → Nível IV
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {allAnswered && getRiskLevelBadge(level)}
                <Badge variant="outline" className="text-xs">
                  {answeredCount}/{axis.questoes.length}
                </Badge>
              </div>
            </div>
            {allAnswered && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Respostas de risco: <strong>{riskCount}</strong>/{axis.questoes.length}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            {/* Questions */}
            <div className="space-y-3">
              {axis.questoes.map((q) => {
                const currentAnswer = answers[q.id];
                const isRisk = currentAnswer === q.riskAnswer;
                const riskLabel = q.riskAnswer === 'sim' ? 'Sim ⬆' : 'Não ⬆';
                const eliminatorioAtivado = q.eliminatorio && isRisk;

                return (
                  <div
                    key={q.id}
                    className={`
                      rounded-lg border p-4 transition-all
                      ${eliminatorioAtivado ? 'border-red-400 bg-red-50 ring-2 ring-red-200' :
                        isRisk ? 'border-red-200 bg-red-50/50' :
                        currentAnswer ? 'border-green-200 bg-green-50/30' : 'border-border'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-mono font-semibold shrink-0">
                        {q.id}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed font-medium">{q.pergunta}</p>
                            {q.eliminatorio && (
                              <Badge className="mt-1 bg-red-100 text-red-700 border border-red-300 text-[10px]">
                                ⛔ ELIMINATÓRIO
                              </Badge>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 cursor-help mt-0.5" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p className="text-xs">{q.dica}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={currentAnswer === 'sim' ? 'default' : 'outline'}
                              className={
                                currentAnswer === 'sim'
                                  ? q.riskAnswer === 'sim'
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                                  : 'hover:bg-muted'
                              }
                              onClick={() => onAnswer(q.id, 'sim')}
                            >
                              Sim
                            </Button>
                            <Button
                              size="sm"
                              variant={currentAnswer === 'nao' ? 'default' : 'outline'}
                              className={
                                currentAnswer === 'nao'
                                  ? q.riskAnswer === 'nao'
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                                  : 'hover:bg-muted'
                              }
                              onClick={() => onAnswer(q.id, 'nao')}
                            >
                              Não
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Resposta de risco: <span className="font-semibold text-red-600">{riskLabel}</span>
                          </span>
                          {eliminatorioAtivado && (
                            <Badge className="bg-red-100 text-red-700 border border-red-400 text-[10px]">
                              ⛔ Protocolo não avaliável — §7.3.6
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentAxis === 0 ? 'Voltar' : 'Eixo Anterior'}
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleNext}
          >
            {currentAxis < axesList.length - 1 ? 'Próximo Eixo' : 'Ver Resultado'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            MARA — Versão A — Qualitativa
          </p>
        </div>
      </footer>
    </div>
  );
}
