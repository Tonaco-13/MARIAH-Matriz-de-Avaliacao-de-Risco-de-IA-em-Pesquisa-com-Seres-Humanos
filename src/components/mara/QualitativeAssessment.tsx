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
import { QUALITATIVE_AXES, RISK_LEVELS } from './data';
import type { RiskLevel } from './data';
import type { QualitativeAnswer } from './utils';
import { countRiskAnswersAxis, getAxisRiskLevel } from './utils';
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
  onComplete,
  onBack,
}: QualitativeAssessmentProps) {
  const [currentAxis, setCurrentAxis] = useState(0);
  const axis = QUALITATIVE_AXES[currentAxis];

  const riskCount = countRiskAnswersAxis(axis, answers);
  const level = getAxisRiskLevel(riskCount);
  const answeredCount = axis.questoes.filter((q) => answers[q.id] !== undefined).length;
  const allAnswered = axis.questoes.every((q) => answers[q.id] !== undefined);

  const totalQuestions = QUALITATIVE_AXES.reduce((sum, a) => sum + a.questoes.length, 0);
  const totalAnswered = QUALITATIVE_AXES.reduce(
    (sum, a) => sum + a.questoes.filter((q) => answers[q.id] !== undefined).length,
    0
  );

  const handleNext = useCallback(() => {
    if (currentAxis < QUALITATIVE_AXES.length - 1) {
      setCurrentAxis((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete();
    }
  }, [currentAxis, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentAxis > 0) {
      setCurrentAxis((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  }, [currentAxis, onBack]);

  // Get axis-level summary for all axes
  const axisSummaries = QUALITATIVE_AXES.map((a, idx) => {
    const rc = countRiskAnswersAxis(a, answers);
    const lvl = getAxisRiskLevel(rc);
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
          {axisSummaries.map((s) => (
            <button
              key={s.axis.id}
              onClick={() => setCurrentAxis(s.index)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${s.index === currentAxis
                  ? 'bg-teal-600 text-white shadow-sm'
                  : s.done
                    ? 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {s.done ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              Eixo {s.index + 1}
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
          ))}
        </div>

        {/* Current axis */}
        <Card className="border-2 border-teal-200 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg">{axis.nome}</CardTitle>
                <CardDescription className="text-sm mt-1">{axis.descricao}</CardDescription>
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

                return (
                  <div
                    key={q.id}
                    className={`
                      rounded-lg border p-4 transition-all
                      ${isRisk ? 'border-red-200 bg-red-50/50' : 
                        currentAnswer ? 'border-green-200 bg-green-50/30' : 'border-border'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-mono font-semibold shrink-0">
                        {q.id}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm leading-relaxed font-medium">{q.pergunta}</p>
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
            {currentAxis < QUALITATIVE_AXES.length - 1 ? 'Próximo Eixo' : 'Ver Resultado'}
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
