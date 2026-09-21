'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Shield, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { CONTEXT_QUESTIONS } from './data';
import type { MarcaVersion, ContextQuestion } from './data';
import { isContextQuestionVisible } from './utils';

/** Badge curto do cartão a partir do id (contexto1→C.1, contexto2→C.2, C.3→C.3…). */
function badgeLabel(id: string): string {
  if (id === 'contexto1') return 'C.1';
  if (id === 'contexto2') return 'C.2';
  return id;
}
import StepIndicator from './StepIndicator';
import type { WizardStep } from './StepIndicator';
import RestartButton from './RestartButton';
import ClearScopeButton from './ClearScopeButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const IDENTIFICATION_FIELDS = [
  { id: 'titulo' },
  { id: 'instituicao' },
  { id: 'cep_nome' },
] as const;

type ContextFormProps = {
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
  /** Limpa só os campos desta página (identificação + contexto), preservando demais respostas. */
  onClearScope: () => void;
  /** Navegação direta por clique nos passos do StepIndicator. */
  onStepClick: (step: WizardStep) => void;
  /** Versão selecionada (A ou B), exibida no badge do StepIndicator. */
  version: MarcaVersion | null;
};

export default function ContextForm({
  answers,
  onAnswer,
  onNext,
  onBack,
  onRestart,
  onClearScope,
  onStepClick,
  version,
}: ContextFormProps) {
  const t = useTranslations();
  // Só as descritivas visíveis (condicional resolvido) são obrigatórias/contabilizadas.
  const visibleContext = CONTEXT_QUESTIONS.filter((q) => isContextQuestionVisible(q, answers));

  // Limpa respostas de descritivas que ficaram ocultas (ex.: C.5 ao mudar C.3 para
  // 'anonimizados'), para não poluírem o export de auditoria.
  useEffect(() => {
    for (const q of CONTEXT_QUESTIONS) {
      if (!isContextQuestionVisible(q, answers) && (answers[q.id]?.length ?? 0) > 0) {
        onAnswer(q.id, '');
      }
    }
  }, [answers, onAnswer]);

  const identificationFilled = IDENTIFICATION_FIELDS.every(
    (f) => answers[f.id]?.trim().length > 0
  );
  const contextFilled = visibleContext.every((q) => answers[q.id]?.trim().length > 0);
  const allFilled = identificationFilled && contextFilled;

  const identificationAnswered = IDENTIFICATION_FIELDS.filter(
    (f) => answers[f.id]?.trim().length > 0
  ).length;
  const contextAnswered = visibleContext.filter(
    (q) => answers[q.id]?.trim().length > 0
  ).length;
  const answeredCount = identificationAnswered + contextAnswered;

  // Render do campo conforme o tipo de entrada (texto/numero/selecao/radio).
  const renderField = (q: ContextQuestion) => {
    if (q.tipoEntrada === 'numero') {
      return (
        <Input
          id={q.id}
          type="number"
          min={0}
          inputMode="numeric"
          value={answers[q.id] || ''}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          placeholder={t('contextForm.placeholderNumero')}
          className="mt-1 max-w-xs"
          aria-label={q.pergunta}
        />
      );
    }
    if (q.tipoEntrada === 'selecao') {
      return (
        <select
          id={q.id}
          value={answers[q.id] || ''}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          aria-label={q.pergunta}
          className="mt-1 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="" disabled>
            {t('contextForm.selecione')}
          </option>
          {(q.opcoes ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    if (q.tipoEntrada === 'radio') {
      return (
        <fieldset className="mt-1">
          <legend className="sr-only">{q.pergunta}</legend>
          <div className="space-y-2">
            {(q.opcoes ?? []).map((o) => (
              <label key={o} className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  value={o}
                  checked={answers[q.id] === o}
                  onChange={(e) => onAnswer(q.id, e.target.value)}
                  className="mt-0.5 h-4 w-4 accent-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <span className="leading-relaxed">{o}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }
    // texto livre (padrão — contexto1/contexto2)
    return (
      <Textarea
        id={q.id}
        value={answers[q.id] || ''}
        onChange={(e) => onAnswer(q.id, e.target.value)}
        placeholder={t('contextForm.respostaPlaceholder')}
        className="min-h-[100px] resize-y"
        aria-label={q.pergunta}
      />
    );
  };

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
                <p className="text-teal-700 text-xs">{t('app.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep="context" version={version} onStepClick={onStepClick} />
        </div>

        {/* Identification section */}
        <h2 className="text-xl font-semibold mb-2">{t('contextForm.identTitle')}</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          {t('contextForm.identSubtitle')}
        </p>

        <Card className="border mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">{t('contextForm.tituloLabel')}</Label>
                <Input
                  id="titulo"
                  value={answers['titulo'] || ''}
                  onChange={(e) => onAnswer('titulo', e.target.value)}
                  placeholder={t('contextForm.tituloPlaceholder')}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instituicao">{t('contextForm.instituicaoLabel')}</Label>
                  <Input
                    id="instituicao"
                    value={answers['instituicao'] || ''}
                    onChange={(e) => onAnswer('instituicao', e.target.value)}
                    placeholder={t('contextForm.instituicaoPlaceholder')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cep_nome">{t('contextForm.cepLabel')}</Label>
                  <Input
                    id="cep_nome"
                    value={answers['cep_nome'] || ''}
                    onChange={(e) => onAnswer('cep_nome', e.target.value)}
                    placeholder={t('contextForm.cepPlaceholder')}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context questions section */}
        <h2 className="text-xl font-semibold mb-2">{t('contextForm.contextTitle')}</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          {t('contextForm.contextSubtitle')}
        </p>

        <div className="space-y-6">
          {visibleContext.map((q) => (
            <Card key={q.id} className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-start gap-2">
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-semibold shrink-0">
                    {badgeLabel(q.id)}
                  </span>
                  <span className="leading-relaxed">{q.pergunta}</span>
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor={q.id} className="sr-only">
                  {q.pergunta}
                </Label>
                {renderField(q)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation — Voltar | Limpar página | Nova avaliação | Continuar */}
        <div className="flex justify-between items-center mt-8 flex-wrap gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('ui.back')}
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <ClearScopeButton
              scopeLabel={t('ui.scopePage')}
              affectedCount={answeredCount}
              onClear={onClearScope}
            />
            <RestartButton onRestart={onRestart} answeredCount={answeredCount} />
          </div>
          <Button
            className="bg-teal-700 hover:bg-teal-800"
            disabled={!allFilled}
            onClick={onNext}
          >
            {t('ui.continuar')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            {t('app.footerShort')}
          </p>
        </div>
      </footer>
    </div>
  );
}
