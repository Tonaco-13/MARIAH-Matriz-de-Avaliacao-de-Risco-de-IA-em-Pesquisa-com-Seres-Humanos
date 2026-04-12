'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Printer,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { RISK_LEVELS, REQUIREMENTS } from './data';
import type { RiskLevel } from './data';
import type { QualitativeAnswer, QuantitativeAnswer } from './utils';
import {
  getQualitativeFinalLevel,
  getQuantitativeFinalResult,
  getRequirementsForLevel,
  generateReportHTML,
} from './utils';
import StepIndicator from './StepIndicator';

type ResultsProps = {
  version: 'A' | 'B';
  useAAsTriagem: boolean;
  contextAnswers: Record<string, string>;
  qualitativeAnswers: QualitativeAnswer;
  quantitativeAnswers: QuantitativeAnswer;
  onRestart: () => void;
  onContinueToB?: () => void;
};

function LevelBadge({ level }: { level: RiskLevel }) {
  const info = RISK_LEVELS[level];
  const colorMap: Record<RiskLevel, string> = {
    I: 'bg-green-100 text-green-800 border-green-300',
    II: 'bg-amber-100 text-amber-800 border-amber-300',
    III: 'bg-orange-100 text-orange-800 border-orange-300',
    IV: 'bg-red-100 text-red-800 border-red-300',
  };
  return (
    <Badge className={`${colorMap[level]} border text-base px-4 py-1.5 font-semibold`}>
      Nível {level} — {info.label}
    </Badge>
  );
}

function LevelCard({ level }: { level: RiskLevel }) {
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
          Nível {level}
        </div>
        <div className={`text-2xl font-semibold ${textMap[level]} mb-3`}>
          {info.label}
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{info.description}</p>
      </CardContent>
    </Card>
  );
}

export default function Results({
  version,
  useAAsTriagem,
  contextAnswers,
  qualitativeAnswers,
  quantitativeAnswers,
  onRestart,
  onContinueToB,
}: ResultsProps) {
  const qualResult = version === 'A' || useAAsTriagem
    ? getQualitativeFinalLevel(qualitativeAnswers)
    : null;
  
  const quantResult = version === 'B'
    ? getQuantitativeFinalResult(quantitativeAnswers)
    : null;

  const finalLevel = version === 'A'
    ? qualResult!.level
    : quantResult!.level;

  const requirements = getRequirementsForLevel(finalLevel);

  const handlePrint = () => {
    const html = generateReportHTML(
      version,
      contextAnswers,
      qualitativeAnswers,
      quantitativeAnswers
    );
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    }
  };

  // Check if triagem mode, still on Version A, and level is III or IV → suggest Version B
  const showContinueToB = useAAsTriagem && version === 'A' && qualResult && 
    (qualResult.level === 'III' || qualResult.level === 'IV');

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
              <p className="text-teal-100 text-xs">Resultado da Avaliação</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep="results" version={version} />
        </div>

        {/* Context */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Caracterização do Contexto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Pergunta do sistema:</span>
                <p className="mt-1">{contextAnswers['contexto1'] || 'Não informado'}</p>
              </div>
              <Separator />
              <div>
                <span className="font-medium text-muted-foreground">Autonomia do sistema:</span>
                <p className="mt-1">{contextAnswers['contexto2'] || 'Não informado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main result */}
        <LevelCard level={finalLevel} />

        {/* Cláusula de Prevalência Ética warning */}
        {quantResult?.clausulaPrevalencia && (
          <Card className="border-2 border-red-300 bg-red-50 mb-6 mt-6">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Cláusula de Prevalência Ética</h3>
                  <p className="text-sm text-red-700">
                    O protocolo foi elevado a <strong>Nível IV</strong> devido à resposta &quot;Sim&quot; 
                    em P4.1 (sistema como único determinante de decisão) ou P4.2 (dano irreversível), 
                    independentemente da pontuação total.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Triagem: suggest Version B */}
        {showContinueToB && (
          <Card className="border-2 border-amber-300 bg-amber-50 mb-6 mt-6">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">Recomendação de Aprofundamento</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    O resultado da Versão A indicou Nível {qualResult!.level}. Recomenda-se aplicar a 
                    Versão B (Quantitativa) para documentação auditável e rastreabilidade numérica.
                  </p>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={onContinueToB}
                  >
                    Continuar para Versão B
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
                Resultado por Eixo — Versão A
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualResult.axisResults.map((ar) => {
                  const pct = (ar.riskCount / ar.totalQuestions) * 100;
                  
                  return (
                    <div key={ar.axisId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{ar.axisName}</span>
                        <LevelBadge level={ar.level} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>Respostas de risco: {ar.riskCount}/{ar.totalQuestions}</span>
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
                <span className="text-sm font-medium">Consolidação: O nível final é o <strong>mais alto</strong> entre todos os eixos</span>
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
                Resultado por Bloco — Versão B
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quantResult.blockResults.map((br) => {
                  const pct = br.maxPontos > 0 ? Math.min((Math.max(br.score, 0) / br.maxPontos) * 100, 100) : 0;

                  return (
                    <div key={br.blockId} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{br.blockName}</span>
                        <span className="text-sm font-mono font-semibold">
                          {br.score}{br.isBlock7 && ' (bidirecional)'} / {br.maxPontos} pts
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
                <span className="text-sm font-medium">Pontuação Total</span>
                <span className="text-xl font-bold">{quantResult.totalScore}<span className="text-sm font-normal text-muted-foreground">/238</span></span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      quantResult.totalScore <= 50 ? 'bg-green-500' :
                      quantResult.totalScore <= 110 ? 'bg-amber-500' :
                      quantResult.totalScore <= 180 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(quantResult.totalScore / 238) * 100}%` }}
                  />
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
        )}

        {/* Requirements */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Requisitos por Nível (cumulativos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['I', 'II', 'III', 'IV'] as RiskLevel[]).map((lvl) => {
                const lvlReqs = REQUIREMENTS.filter((r) => r.nivel === lvl);
                const isActive = lvl === finalLevel;
                const isBelow = REQUIREMENTS.findIndex((r) => r.nivel === lvl) <= 
                  REQUIREMENTS.findIndex((r) => r.nivel === finalLevel);

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
                      ${isBelow ? '' : 'opacity-40'}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <LevelBadge level={lvl} />
                      {isActive && <span className="text-xs font-semibold text-muted-foreground">← Nível atual</span>}
                    </div>
                    <ul className="space-y-1.5 ml-2">
                      {lvlReqs.map((req) => (
                        <li key={req.id} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                            isBelow ? 'text-green-500' : 'text-muted-foreground/40'
                          }`} />
                          <span className={isBelow ? '' : 'line-through text-muted-foreground'}>
                            {req.texto}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-dashed bg-muted/30 mb-6">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Aviso importante</p>
                <p>
                  A MARA não aprova nem reprova protocolos. Não substitui o julgamento do CEP. 
                  Não dispensa a deliberação colegiada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir / Salvar PDF
          </Button>
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            MARA — Matriz de Avaliação de Risco Algorítmico • {version === 'A' ? 'Versão A — Qualitativa' : 'Versão B — Quantitativa'}
          </p>
        </div>
      </footer>
    </div>
  );
}
