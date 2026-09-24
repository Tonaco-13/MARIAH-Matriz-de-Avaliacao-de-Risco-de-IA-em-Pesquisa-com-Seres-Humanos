'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Info,
  Database,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import StepIndicator from './StepIndicator';
import type { WizardStep } from './StepIndicator';
import RestartButton from './RestartButton';
import ClearScopeButton from './ClearScopeButton';
import { DATABASE_FILTER_QUESTION, label } from './data';
import type { MarcaVersion } from './data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type EntryFilterProps = {
  onPass: (usesDatabase: boolean) => void;
  onFail: () => void;
  onBack: () => void;
  onRestart: () => void;
  /** Limpa só as respostas desta página (filtro), preservando versão e respostas posteriores. */
  onClearScope: () => void;
  /** Navegação direta por clique nos passos do StepIndicator. */
  onStepClick: (step: WizardStep) => void;
  filterResult: 'sim' | 'nao' | null;
  /** Estado local (persistido no reducer pai) para a escolha de banco de dados enquanto o usuário navega. */
  usesDatabase: boolean | null;
  onUsesDatabaseChange: (value: boolean) => void;
  /** Versão selecionada (A ou B), usada para exibir o badge confirmando ao usuário em qual ramo está. */
  version: MarcaVersion | null;
};

const ENTRY_TYPES = [
  { icon: '⚙️', titleKey: 'entryFilter.type1Title', descKey: 'entryFilter.type1Desc' },
  { icon: '📝', titleKey: 'entryFilter.type2Title', descKey: 'entryFilter.type2Desc' },
  { icon: '🔬', titleKey: 'entryFilter.type3Title', descKey: 'entryFilter.type3Desc' },
] as const;

export default function EntryFilter({
  onPass,
  onFail,
  onBack,
  onRestart,
  onClearScope,
  onStepClick,
  filterResult,
  usesDatabase,
  onUsesDatabaseChange,
  version,
}: EntryFilterProps) {
  const t = useTranslations();
  const locale = useLocale();
  // Local state: Pergunta 1 (aplicabilidade). Inicializa a partir do filterResult
  // do reducer para sobreviver a navegação (clique no step "Filtro" por outras telas).
  // Usa o padrão "Storing information from previous renders" (React docs) para
  // re-sincronizar com props sem useEffect — evita render extra e satisfaz o lint.
  const [applies, setApplies] = useState<'sim' | 'nao' | null>(filterResult);
  const [lastSeenFilterResult, setLastSeenFilterResult] = useState(filterResult);
  if (filterResult !== lastSeenFilterResult) {
    setLastSeenFilterResult(filterResult);
    setApplies(filterResult);
  }
  // Quantos itens já foram respondidos (Pergunta 1 + Pergunta 2). Usado pelos botões
  // de confirmação (Limpar página / Nova avaliação) para deixar o aviso mais explícito.
  const answeredCount = (applies !== null ? 1 : 0) + (usesDatabase !== null ? 1 : 0);

  const handleClearPage = () => {
    setApplies(null);
    onClearScope();
  };

  // Tela de "MARIAH não se aplica" (quando o reducer pai já marcou filterResult='nao').
  if (filterResult === 'nao') {
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

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-green-200 bg-green-50">
            <CardContent className="py-10 text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">{t('entryFilter.notApplicableTitle')}</h2>
              <p className="text-green-700 mb-6">
                {t('entryFilter.notApplicableBody')}
              </p>
              <Button
                variant="outline"
                onClick={onRestart}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('entryFilter.notApplicableRestart')}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const canProceed = applies === 'sim' && usesDatabase !== null;

  const handleAppliesSim = () => setApplies('sim');
  const handleAppliesNao = () => {
    setApplies('nao');
    onFail();
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
          <StepIndicator currentStep="filter" version={version} onStepClick={onStepClick} />
        </div>

        <h2 className="text-xl font-semibold mb-2">{t('entryFilter.title')}</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          {t('entryFilter.subtitle')}
        </p>

        {/* Pergunta 1: Aplicabilidade */}
        <Card
          className={`border-2 mb-6 ${
            applies === 'sim'
              ? 'border-teal-300 bg-teal-50/30'
              : 'border-border'
          }`}
        >
          <CardContent className="py-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  {t('entryFilter.q1Label')}
                </p>
                <p className="text-base font-medium leading-relaxed">
                  {t('entryFilter.q1Question')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                size="lg"
                variant={applies === 'sim' ? 'default' : 'outline'}
                className={
                  applies === 'sim'
                    ? 'bg-teal-700 hover:bg-teal-800 text-white min-w-[140px]'
                    : 'hover:bg-muted min-w-[140px]'
                }
                aria-pressed={applies === 'sim'} onClick={handleAppliesSim}
              >
                {t('ui.sim')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-muted min-w-[140px]"
                aria-pressed={applies === 'nao'} onClick={handleAppliesNao}
              >
                {t('ui.nao')}
              </Button>
            </div>

            {applies === 'sim' && (
              <p className="text-xs text-teal-700 mt-4 text-center">
                {t('entryFilter.q1Applies')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Explicação dos três tipos de uso — apoio à Pergunta 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
            <h3 className="text-xs font-normal text-muted-foreground italic">
              {t('entryFilter.typesHint')}
            </h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {ENTRY_TYPES.map((type) => (
              <Card key={type.titleKey} className="border-dashed bg-muted/20 shadow-none">
                <CardContent className="py-3 px-4">
                  <div className="text-xl mb-1.5">{type.icon}</div>
                  <h4 className="font-medium text-sm mb-1">{t(type.titleKey)}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(type.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pergunta 2: Filtro de Banco de Dados (Res 738) */}
        <Card
          className={`border-2 mb-8 transition-opacity ${
            applies !== 'sim'
              ? 'opacity-50 pointer-events-none'
              : usesDatabase === true
                ? 'border-blue-300 bg-blue-50/30'
                : usesDatabase === false
                  ? 'border-green-200 bg-green-50/30'
                  : ''
          }`}
          aria-disabled={applies !== 'sim'}
        >
          <CardContent className="py-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-2 flex-wrap">
                  {t('entryFilter.q2Label')}
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0 rounded text-[10px]">
                    {t('entryFilter.q2Badge')}
                  </span>
                </p>
                <div className="flex items-start gap-2">
                  <p className="text-base font-medium leading-relaxed flex-1">
                    {label(DATABASE_FILTER_QUESTION, 'pergunta', locale)}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 cursor-help mt-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">{label(DATABASE_FILTER_QUESTION, 'dica', locale)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                size="lg"
                variant={usesDatabase === true ? 'default' : 'outline'}
                disabled={applies !== 'sim'}
                className={
                  usesDatabase === true
                    ? 'bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]'
                    : 'hover:bg-blue-50 min-w-[140px]'
                }
                aria-pressed={usesDatabase === true} onClick={() => onUsesDatabaseChange(true)}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {t('ui.sim')}
              </Button>
              <Button
                size="lg"
                variant={usesDatabase === false ? 'default' : 'outline'}
                disabled={applies !== 'sim'}
                className={
                  usesDatabase === false
                    ? 'bg-teal-700 hover:bg-teal-800 text-white min-w-[140px]'
                    : 'hover:bg-muted min-w-[140px]'
                }
                aria-pressed={usesDatabase === false} onClick={() => onUsesDatabaseChange(false)}
              >
                {t('ui.nao')}
              </Button>
            </div>

            {applies === 'sim' && usesDatabase === true && (
              <p className="text-xs text-blue-700 mt-4 text-center">
                {t('entryFilter.q2Activated')}
              </p>
            )}
            {applies === 'sim' && usesDatabase === false && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                {t('entryFilter.q2Standard')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Navegação — Voltar | Limpar página | Nova avaliação | Prosseguir */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('ui.back')}
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <ClearScopeButton
              scopeLabel={t('ui.scopePage')}
              affectedCount={answeredCount}
              onClear={handleClearPage}
            />
            <RestartButton onRestart={onRestart} answeredCount={answeredCount} />
          </div>
          <Button
            size="lg"
            className="bg-teal-700 hover:bg-teal-800 min-w-[200px]"
            disabled={!canProceed}
            onClick={() => onPass(usesDatabase === true)}
          >
            {t('entryFilter.proceed')}
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
