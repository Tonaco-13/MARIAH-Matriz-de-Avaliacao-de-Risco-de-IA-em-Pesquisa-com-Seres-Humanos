'use client';

import { CheckCircle2 } from 'lucide-react';

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
};

export default function StepIndicator({ currentStep, version }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
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
