'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Info,
  Database,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import StepIndicator from './StepIndicator';
import { DATABASE_FILTER_QUESTION } from './data';
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
  filterResult: 'sim' | 'nao' | null;
  /** Estado local (persistido no reducer pai) para a escolha de banco de dados enquanto o usuário navega. */
  usesDatabase: boolean | null;
  onUsesDatabaseChange: (value: boolean) => void;
};

const ENTRY_TYPES = [
  {
    title: 'Automação de decisão',
    description:
      'Qualquer sistema que produza classificações, escores, recomendações ou alertas que influenciem decisões.',
    icon: '⚙️',
  },
  {
    title: 'Geração de conteúdo',
    description:
      'Sistemas que produzem texto, dados sintéticos, imagens ou qualquer conteúdo que integre o protocolo.',
    icon: '📝',
  },
  {
    title: 'Intervenção',
    description:
      'Sistemas cuja saída orienta, modifica ou substitui etapas do protocolo.',
    icon: '🔬',
  },
];

export default function EntryFilter({
  onPass,
  onFail,
  onBack,
  onRestart,
  filterResult,
  usesDatabase,
  onUsesDatabaseChange,
}: EntryFilterProps) {
  // Local state: Pergunta 1 (aplicabilidade). Só vira 'sim'/'nao' ao clicar no botão.
  // 'sim' revela a Pergunta 2; 'nao' aciona onFail imediatamente.
  const [applies, setApplies] = useState<'sim' | 'nao' | null>(null);

  // Tela de "MARA não se aplica" (quando o reducer pai já marcou filterResult='nao').
  if (filterResult === 'nao') {
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
                <p className="text-teal-100 text-xs">Matriz de Avaliação de Risco Algorítmico</p>
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
              <h2 className="text-xl font-semibold text-green-800 mb-2">A MARA não se aplica</h2>
              <p className="text-green-700 mb-6">
                O sistema de IA não realiza automação de decisão, geração de conteúdo ou
                intervenção no protocolo ou na condução do estudo. Portanto, a MARA não se aplica
                a este protocolo.
              </p>
              <Button
                variant="outline"
                onClick={onRestart}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Iniciar nova avaliação
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
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MARA</h1>
              <p className="text-teal-100 text-xs">Matriz de Avaliação de Risco Algorítmico</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep="filter" onRestart={onRestart} />
        </div>

        <h2 className="text-xl font-semibold mb-2">Passo 0 — Filtro de Entrada</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Verifique se o sistema de IA se enquadra no escopo da MARA e se o protocolo utiliza banco
          de dados (ativa a subseção da Res. CNS n.º 738/2024).
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
                  PERGUNTA 1 — Aplicabilidade
                </p>
                <p className="text-base font-medium leading-relaxed">
                  O sistema de IA realiza automação de decisão, geração de conteúdo ou intervenção
                  no protocolo ou na condução do estudo?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                size="lg"
                variant={applies === 'sim' ? 'default' : 'outline'}
                className={
                  applies === 'sim'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]'
                    : 'hover:bg-teal-50 min-w-[140px]'
                }
                onClick={handleAppliesSim}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Sim
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 min-w-[140px]"
                onClick={handleAppliesNao}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Não — MARA não se aplica
              </Button>
            </div>

            {applies === 'sim' && (
              <p className="text-xs text-teal-700 mt-4 text-center">
                ✓ MARA se aplica. Responda a segunda pergunta abaixo para prosseguir.
              </p>
            )}
          </CardContent>
        </Card>

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
                  PERGUNTA 2 — Filtro de Banco de Dados
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0 rounded text-[10px]">
                    Res. CNS n.º 738/2024
                  </span>
                </p>
                <div className="flex items-start gap-2">
                  <p className="text-base font-medium leading-relaxed flex-1">
                    {DATABASE_FILTER_QUESTION.pergunta}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 cursor-help mt-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">{DATABASE_FILTER_QUESTION.dica}</p>
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
                onClick={() => onUsesDatabaseChange(true)}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Sim
              </Button>
              <Button
                size="lg"
                variant={usesDatabase === false ? 'default' : 'outline'}
                disabled={applies !== 'sim'}
                className={
                  usesDatabase === false
                    ? 'bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]'
                    : 'hover:bg-muted min-w-[140px]'
                }
                onClick={() => onUsesDatabaseChange(false)}
              >
                Não
              </Button>
            </div>

            {applies === 'sim' && usesDatabase === true && (
              <p className="text-xs text-blue-700 mt-4 text-center">
                ✓ Subseção ativada: Eixo 3.b (Versão A) ou Bloco 6.b (Versão B) serão incluídos na
                avaliação.
              </p>
            )}
            {applies === 'sim' && usesDatabase === false && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Avaliação seguirá com os eixos/blocos padrão (sem subseção Res 738).
              </p>
            )}
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 min-w-[200px]"
            disabled={!canProceed}
            onClick={() => onPass(usesDatabase === true)}
          >
            Prosseguir para a avaliação
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Explicação dos três tipos de uso */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Entenda os três tipos de uso de IA</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {ENTRY_TYPES.map((type) => (
              <Card key={type.title} className="border">
                <CardContent className="py-4">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h4 className="font-medium text-sm mb-1">{type.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            MARA — Matriz de Avaliação de Risco Algorítmico
          </p>
        </div>
      </footer>
    </div>
  );
}
