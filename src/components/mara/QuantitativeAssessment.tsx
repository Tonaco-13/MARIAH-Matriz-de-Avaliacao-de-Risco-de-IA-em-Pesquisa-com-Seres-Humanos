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
  TrendingDown,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from 'lucide-react';
import { QUANTITATIVE_BLOCKS, RISK_LEVELS } from './data';
import type { QuantitativeAnswer } from './utils';
import {
  calculateBlockScore,
  getQuantitativeTotalScore,
  getQuantitativeRiskLevel,
  checkClausulaPrevalencia,
} from './utils';
import StepIndicator from './StepIndicator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type QuantitativeAssessmentProps = {
  answers: QuantitativeAnswer;
  onAnswer: (questionId: string, answer: 'sim' | 'nao') => void;
  onComplete: () => void;
  onBack: () => void;
};

export default function QuantitativeAssessment({
  answers,
  onAnswer,
  onComplete,
  onBack,
}: QuantitativeAssessmentProps) {
  const [currentBlock, setCurrentBlock] = useState(0);
  const block = QUANTITATIVE_BLOCKS[currentBlock];

  const blockScore = calculateBlockScore(block, answers);
  const totalScore = getQuantitativeTotalScore(answers);
  const clausulaPrevalencia = checkClausulaPrevalencia(answers);
  const currentLevel = clausulaPrevalencia ? 'IV' : getQuantitativeRiskLevel(totalScore);
  const levelInfo = RISK_LEVELS[currentLevel];

  const answeredCount = block.questoes.filter((q) => answers[q.id] !== undefined).length;

  const totalQuestions = QUANTITATIVE_BLOCKS.reduce((sum, b) => sum + b.questoes.length, 0);
  const totalAnswered = QUANTITATIVE_BLOCKS.reduce(
    (sum, b) => sum + b.questoes.filter((q) => answers[q.id] !== undefined).length,
    0
  );

  const handleNext = useCallback(() => {
    if (currentBlock < QUANTITATIVE_BLOCKS.length - 1) {
      setCurrentBlock((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete();
    }
  }, [currentBlock, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentBlock > 0) {
      setCurrentBlock((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  }, [currentBlock, onBack]);

  // Block summaries for navigation
  const blockSummaries = QUANTITATIVE_BLOCKS.map((b, idx) => {
    const score = calculateBlockScore(b, answers);
    const done = b.questoes.every((q) => answers[q.id] !== undefined);
    return { block: b, index: idx, score, done };
  });

  const levelColorMap: Record<string, string> = {
    I: 'bg-green-100 text-green-700',
    II: 'bg-amber-100 text-amber-700',
    III: 'bg-orange-100 text-orange-700',
    IV: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-amber-700 to-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MARA</h1>
              <p className="text-amber-100 text-xs">Versão B — Quantitativa</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep="assessment" version="B" />
        </div>

        {/* Global progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso geral</span>
            <span>{totalAnswered}/{totalQuestions} questões respondidas</span>
          </div>
          <Progress value={(totalAnswered / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Live score summary bar */}
        <Card className="border-2 mb-6">
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Pontuação Total</p>
                  <p className="text-2xl font-bold">{totalScore}<span className="text-sm font-normal text-muted-foreground">/238</span></p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div>
                  <p className="text-xs text-muted-foreground">Nível Atual</p>
                  <Badge className={`${levelColorMap[currentLevel]} text-sm px-3 py-1`}>
                    Nível {currentLevel} — {levelInfo.label}
                  </Badge>
                </div>
              </div>
              {clausulaPrevalencia && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-700">
                    Cláusula de Prevalência Ética ativada — Nível IV
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className="relative">
                <Progress value={(totalScore / 238) * 100} className="h-3" />
                {/* Level threshold markers */}
                <div className="absolute top-0 left-[21%] h-3 w-px bg-amber-400/60" />
                <div className="absolute top-0 left-[46%] h-3 w-px bg-orange-400/60" />
                <div className="absolute top-0 left-[76%] h-3 w-px bg-red-400/60" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>I (0-50)</span>
                <span>II (51-110)</span>
                <span>III (111-180)</span>
                <span>IV (181-238)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {blockSummaries.map((s) => (
            <button
              key={s.block.id}
              onClick={() => setCurrentBlock(s.index)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${s.index === currentBlock
                  ? 'bg-amber-600 text-white shadow-sm'
                  : s.done
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {s.done ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              Bloco {s.index + 1}
              <span className="font-mono ml-1">{s.score}pts</span>
            </button>
          ))}
        </div>

        {/* Current block */}
        <Card className={`border-2 mb-6 ${block.id === 'bloco4' ? 'border-red-300' : 'border-amber-200'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {block.nome}
                  {block.subtitulo && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {block.subtitulo}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm mt-1">{block.descricao}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {block.id === 'bloco7' ? (
                  <Badge variant="outline" className="text-xs">
                    {blockScore >= 0 ? '+' : ''}{blockScore} pts (bidirecional)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {blockScore}/{block.maxPontos} pts
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {answeredCount}/{block.questoes.length}
                </Badge>
              </div>
            </div>
            {/* Block score bar */}
            {block.id !== 'bloco7' && (
              <div className="mt-3">
                <Progress 
                  value={Math.min((blockScore / block.maxPontos) * 100, 100)} 
                  className="h-1.5"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            {/* Questions */}
            <div className="space-y-3">
              {block.questoes.map((q) => {
                const currentAnswer = answers[q.id];
                const isMitigation = q.efeito === 'mitigacao';
                const isRiskQ = q.efeito === 'risco';
                
                // Determine if current answer is a risk/mitigation answer
                let isHighlight = false;
                if (isMitigation) {
                  // For mitigation questions, "Não" means no mitigation = risk
                  isHighlight = currentAnswer === 'nao';
                } else if (isRiskQ) {
                  // For risk questions in block 7, risk answer adds points
                  isHighlight = currentAnswer === q.riskAnswer;
                } else {
                  // Regular questions: risk answer adds points
                  isHighlight = currentAnswer === q.riskAnswer;
                }

                const isMitigated = isMitigation && currentAnswer === 'sim';
                const riskLabel = isMitigation
                  ? `"Não" ⬆ risco`
                  : q.riskAnswer === 'sim' ? 'Sim ⬆' : 'Não ⬆';

                return (
                  <div
                    key={q.id}
                    className={`
                      rounded-lg border p-4 transition-all
                      ${isMitigated ? 'border-teal-200 bg-teal-50/30' :
                        isHighlight ? 'border-red-200 bg-red-50/50' :
                        currentAnswer ? 'border-green-200 bg-green-50/30' :
                        isMitigation ? 'border-amber-100' : 'border-border'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold shrink-0 ${
                        isMitigation ? 'bg-teal-100 text-teal-700' :
                        isRiskQ ? 'bg-amber-100 text-amber-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
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
                                  ? isMitigation
                                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                                    : q.riskAnswer === 'sim'
                                      ? 'bg-red-500 hover:bg-red-600 text-white'
                                      : 'bg-amber-600 hover:bg-amber-700 text-white'
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
                                  ? isMitigation
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : q.riskAnswer === 'nao'
                                      ? 'bg-red-500 hover:bg-red-600 text-white'
                                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                                  : 'hover:bg-muted'
                              }
                              onClick={() => onAnswer(q.id, 'nao')}
                            >
                              Não
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                            {isMitigation ? (
                              <TrendingDown className="h-3 w-3 text-teal-600" />
                            ) : (
                              <TrendingUp className="h-3 w-3 text-red-500" />
                            )}
                            <span>
                              {isMitigation ? (
                                <><span className="text-teal-600 font-semibold">"Sim" = mitigação ({q.pontos} pts)</span></>
                              ) : (
                                <><span className="font-semibold text-red-600">{riskLabel}</span> ({Math.abs(q.pontos)} pts)</>
                              )}
                            </span>
                          </div>
                          {/* Cláusula de Prevalência Ética indicator for P4.1 and P4.2 */}
                          {(q.id === 'P4.1' || q.id === 'P4.2') && currentAnswer === 'sim' && (
                            <Badge className="bg-red-100 text-red-700 border border-red-300 text-[10px]">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Cláusula de Prevalência Ética
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
            {currentBlock === 0 ? 'Voltar' : 'Bloco Anterior'}
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleNext}
          >
            {currentBlock < QUANTITATIVE_BLOCKS.length - 1 ? 'Próximo Bloco' : 'Ver Resultado'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            MARA — Versão B — Quantitativa
          </p>
        </div>
      </footer>
    </div>
  );
}
