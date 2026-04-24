'use client';

import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export type WizardStep = 'version' | 'filter' | 'context' | 'assessment' | 'results';

type StepInfo = {
  id: WizardStep;
  label: string;
  shortLabel: string;
  number: number;
};

const STEPS: StepInfo[] = [
  { id: 'version', label: 'Seleção da Versão', shortLabel: 'Versão', number: 1 },
  { id: 'filter', label: 'Filtro de Entrada', shortLabel: 'Filtro', number: 2 },
  { id: 'context', label: 'Caracterização do Contexto', shortLabel: 'Contexto', number: 3 },
  { id: 'assessment', label: 'Avaliação de Risco', shortLabel: 'Avaliação', number: 4 },
  { id: 'results', label: 'Resultado', shortLabel: 'Resultado', number: 5 },
];

type StepIndicatorProps = {
  currentStep: WizardStep;
  version?: 'A' | 'B' | null;
  /**
   * Handler para reiniciar a avaliação. Quando fornecido, exibe um botão
   * "Nova avaliação" com confirmação obrigatória ao lado do indicador de passos.
   * Omitido na tela de seleção de versão (não há nada a reiniciar).
   */
  onRestart?: () => void;
  /**
   * Quantas perguntas já foram respondidas. Quando > 0, o dialog de
   * confirmação mostra o número para reforçar o que seria perdido.
   */
  answeredCount?: number;
};

export default function StepIndicator({
  currentStep,
  version,
  onRestart,
  answeredCount,
}: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center justify-between flex-1 min-w-0">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                {/* Step circle and label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${isCompleted
                        ? 'bg-teal-600 text-white'
                        : isCurrent
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`
                      mt-1 text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-none leading-tight
                      ${isCurrent ? 'text-teal-700' : isCompleted ? 'text-teal-600' : 'text-muted-foreground'}
                    `}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </span>
                </div>

                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-1 sm:mx-2 mt-[-18px] sm:mt-[-20px] transition-all
                      ${idx < currentIndex ? 'bg-teal-500' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Restart button (only when handler is provided — i.e. not on step 1) */}
        {onRestart && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5 h-8 px-2 sm:px-3"
                aria-label="Iniciar nova avaliação"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Nova avaliação</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Iniciar nova avaliação?</AlertDialogTitle>
                <AlertDialogDescription>
                  {answeredCount && answeredCount > 0 ? (
                    <>
                      Isso apagará <strong>todas as {answeredCount} resposta{answeredCount === 1 ? '' : 's'} já preenchida{answeredCount === 1 ? '' : 's'}</strong> e voltará à tela de seleção de versão.
                      <br />
                      <span className="block mt-2 text-xs">Esta ação não pode ser desfeita.</span>
                    </>
                  ) : (
                    <>
                      Isso apagará todos os dados preenchidos até aqui e voltará à tela de seleção de versão.
                      <br />
                      <span className="block mt-2 text-xs">Esta ação não pode ser desfeita.</span>
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onRestart}
                  className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400"
                >
                  Sim, limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Version badge when in assessment or results */}
      {version && (currentStep === 'assessment' || currentStep === 'results') && (
        <div className="flex justify-center mt-2">
          <span
            className={`
              text-[10px] font-semibold px-2 py-0.5 rounded-full
              ${version === 'A'
                ? 'bg-teal-100 text-teal-700'
                : 'bg-amber-100 text-amber-700'
              }
            `}
          >
            {version === 'A' ? 'Versão A — Qualitativa' : 'Versão B — Quantitativa'}
          </span>
        </div>
      )}
    </div>
  );
}
