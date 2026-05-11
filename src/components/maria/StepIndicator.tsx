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
  /**
   * Quando fornecido, exibe um badge da versão (A — Qualitativa ou B — Quantitativa)
   * acima do indicador de passos. Aparece em todos os passos a partir do filtro.
   */
  version?: 'A' | 'B' | null;
  /**
   * Handler de clique em um passo. Quando fornecido, transforma os passos completados
   * (e o atual) em botões clicáveis para navegação direta. Passos futuros ficam
   * desabilitados — pular validações obrigatórias quebraria a auditoria.
   */
  onStepClick?: (step: WizardStep) => void;
};

export default function StepIndicator({ currentStep, version, onStepClick }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const showVersionBadge = !!version && currentStep !== 'version';

  return (
    <div className="w-full">
      {/* Version badge — visible from filter step onwards, so the user can confirm
          which assessment branch they're on at every screen. */}
      {showVersionBadge && (
        <div className="flex justify-center mb-3">
          <span
            className={`
              text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border
              ${version === 'A'
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-slate-100 text-slate-700 border-slate-300'
              }
            `}
            aria-label={
              version === 'A'
                ? 'Você está na Versão A — Qualitativa'
                : 'Você está na Versão B — Quantitativa'
            }
          >
            {version === 'A' ? 'Versão A — Qualitativa' : 'Versão B — Quantitativa'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between w-full">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isClickable = !!onStepClick && idx <= currentIndex;

          // Cores comuns do círculo conforme estado.
          const circleClasses = isCompleted
            ? 'bg-teal-600 text-white'
            : isCurrent
              ? 'bg-teal-600 text-white ring-4 ring-teal-100'
              : 'bg-muted text-muted-foreground';

          const labelClasses = isCurrent
            ? 'text-teal-700'
            : isCompleted
              ? 'text-teal-600'
              : 'text-muted-foreground';

          // O conteúdo visual do passo (círculo + label) é o mesmo independente de
          // ser botão ou div — só muda o wrapper e os estados de hover.
          const stepContent = (
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${circleClasses}
                  ${isClickable && !isCurrent ? 'group-hover:ring-4 group-hover:ring-teal-100' : ''}
                `}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.number}
              </div>
              <span
                className={`
                  mt-1 text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-none leading-tight
                  ${labelClasses}
                  ${isClickable && !isCurrent ? 'group-hover:underline' : ''}
                `}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </span>
            </div>
          );

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step (clickable button or static div) */}
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-md p-0.5 -m-0.5"
                  aria-label={`Ir para o passo: ${step.label}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  disabled={isCurrent}
                >
                  {stepContent}
                </button>
              ) : (
                <div
                  className={onStepClick ? 'opacity-60 cursor-not-allowed' : ''}
                  aria-current={isCurrent ? 'step' : undefined}
                  title={onStepClick ? 'Passo ainda não disponível' : undefined}
                >
                  {stepContent}
                </div>
              )}

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
    </div>
  );
}
