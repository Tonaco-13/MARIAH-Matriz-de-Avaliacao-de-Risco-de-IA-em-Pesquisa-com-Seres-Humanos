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
import { RISK_LEVELS, REQUIREMENTS, REQUIREMENTS_RES738 } from './data';
import type { RiskLevel } from './data';
import type { QualitativeAnswer, QuantitativeAnswer } from './utils';
import {
  getQualitativeFinalLevel,
  getQuantitativeFinalResult,
  generateReportHTML,
  getUnansweredItems,
} from './utils';
import StepIndicator from './StepIndicator';
import type { WizardStep } from './StepIndicator';

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
  usesDatabase,
  contextAnswers,
  qualitativeAnswers,
  quantitativeAnswers,
  onRestart,
  onContinueToB,
  onStepClick,
}: ResultsProps) {
  const qualResult = version === 'A' || useAAsTriagem
    ? getQualitativeFinalLevel(qualitativeAnswers, usesDatabase)
    : null;

  const quantResult = version === 'B'
    ? getQuantitativeFinalResult(quantitativeAnswers, usesDatabase)
    : null;

  const finalLevel = version === 'A'
    ? qualResult!.level
    : quantResult!.level;

  const protocoloNaoAvaliavel = version === 'A'
    ? qualResult?.protocoloNaoAvaliavel === true
    : quantResult?.protocoloNaoAvaliavel === true;
  const eliminatoryQuestionId = version === 'A'
    ? qualResult?.eliminatoryQuestionId ?? null
    : quantResult?.eliminatoryQuestionId ?? null;

  const handlePrint = () => {
    const html = generateReportHTML(
      version,
      contextAnswers,
      qualitativeAnswers,
      quantitativeAnswers,
      usesDatabase
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

  // Itens não avaliados — auditoria. Agrupados por seção (eixo/bloco/contexto)
  // para facilitar a leitura no card.
  const unansweredItems = getUnansweredItems(
    version,
    contextAnswers,
    qualitativeAnswers,
    quantitativeAnswers,
    usesDatabase
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
          <StepIndicator currentStep="results" version={version} onStepClick={onStepClick} />
        </div>

        {/* Context */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Caracterização do Contexto
              {usesDatabase && (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                  Res 738/2024 — banco de dados
                </Badge>
              )}
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
              <Separator />
              <div>
                <span className="font-medium text-muted-foreground">Utiliza banco de dados:</span>
                <p className="mt-1">
                  {usesDatabase
                    ? 'Sim — Eixo 3.b / Bloco 6.b ativados (Resolução CNS n.º 738/2024)'
                    : 'Não'}
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
                    ⛔ Protocolo NÃO AVALIÁVEL no mérito
                  </h3>
                  <p className="text-sm text-red-800">
                    Hipótese eliminatória acionada em <strong>{eliminatoryQuestionId}</strong>
                    {' — '}ausência de cadeia de custódia formalizada (Res. CNS n.º 738/2024 — Art. 27, VI).
                  </p>
                  <p className="text-sm text-red-800 mt-2">
                    O dossiê deve ser devolvido ao pesquisador para <strong>diligência obrigatória</strong> antes
                    de qualquer análise de mérito, conforme <strong>§7.3.6 do Capítulo 7</strong>.
                    Isto não é agravamento de nível de risco — é bloqueio de avaliação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    className="bg-slate-700 hover:bg-slate-800 text-white"
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
                              Res 738
                            </Badge>
                          )}
                        </div>
                        <LevelBadge level={ar.level} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>Respostas de risco: {ar.riskCount}/{ar.totalQuestions}</span>
                        {isRes738 && (
                          <span className="text-blue-700">
                            (elevação especial: 1-2 → III · 3+ → IV)
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
                              Res 738
                            </Badge>
                          )}
                        </div>
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
                <span className="text-sm font-medium">
                  Pontuação Total
                  {usesDatabase && (
                    <span className="text-xs text-blue-700 ml-2">(inclui Bloco 6.b — Res 738)</span>
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
                  <span>I (0-{quantResult.thresholds.levelI})</span>
                  <span>II ({quantResult.thresholds.levelI + 1}-{quantResult.thresholds.levelII})</span>
                  <span>III ({quantResult.thresholds.levelII + 1}-{quantResult.thresholds.levelIII})</span>
                  <span>IV ({quantResult.thresholds.levelIII + 1}-{quantResult.maxScore})</span>
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
              {usesDatabase && (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px]">
                  + Res 738/2024
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
                      {isActive && <span className="text-xs font-semibold text-muted-foreground">← Nível atual</span>}
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
                                  Res 738
                                </Badge>
                              )}
                              {req.texto}
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
                  <span>Itens não avaliados (auditoria)</span>
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px]">
                    {unansweredItems.length} ite{unansweredItems.length === 1 ? 'm' : 'ns'}
                  </Badge>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Itens não avaliados (auditoria)</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unansweredItems.length === 0 ? (
              <p className="text-sm text-green-700">
                Todas as perguntas aplicáveis e campos de contexto foram preenchidos. Nenhum item ficou em aberto.
              </p>
            ) : (
              <>
                <p className="text-sm text-amber-900 mb-3">
                  Para fins de auditoria, listamos abaixo cada pergunta apresentada que ficou sem resposta. O cálculo do
                  nível de risco trata <strong>ausência de resposta como &ldquo;não risco&rdquo; por padrão</strong>;
                  recomenda-se que o CEP justifique cada item ou solicite diligência ao pesquisador antes de deliberar.
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
