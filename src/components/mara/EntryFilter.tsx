'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Info
} from 'lucide-react';
import StepIndicator from './StepIndicator';

type EntryFilterProps = {
  onPass: () => void;
  onFail: () => void;
  onRestart: () => void;
  filterResult: 'sim' | 'nao' | null;
};

const ENTRY_TYPES = [
  {
    title: 'Automação de decisão',
    description: 'Qualquer sistema que produza classificações, escores, recomendações ou alertas que influenciem decisões.',
    icon: '⚙️',
  },
  {
    title: 'Geração de conteúdo',
    description: 'Sistemas que produzem texto, dados sintéticos, imagens ou qualquer conteúdo que integre o protocolo.',
    icon: '📝',
  },
  {
    title: 'Intervenção',
    description: 'Sistemas cuja saída orienta, modifica ou substitui etapas do protocolo.',
    icon: '🔬',
  },
];

export default function EntryFilter({ onPass, onFail, onRestart, filterResult }: EntryFilterProps) {
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
                O sistema de IA não realiza automação de decisão, 
                geração de conteúdo ou intervenção no protocolo ou na condução do estudo.
                Portanto, a MARA não se aplica a este protocolo.
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
          <StepIndicator currentStep="filter" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Passo 0 — Filtro de Entrada</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Verifique se o sistema de IA se enquadra no escopo da MARA.
        </p>

        {/* Main question */}
        <Card className="border-2 mb-8">
          <CardContent className="py-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-base font-medium leading-relaxed">
                O sistema de IA realiza automação de decisão, geração de conteúdo ou intervenção 
                no protocolo ou na condução do estudo?
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 min-w-[120px]"
                onClick={onPass}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Sim
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 min-w-[120px]"
                onClick={onFail}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Não
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
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
