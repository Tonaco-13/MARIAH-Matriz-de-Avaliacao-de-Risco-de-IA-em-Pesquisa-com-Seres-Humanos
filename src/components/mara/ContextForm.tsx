'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Shield, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { CONTEXT_QUESTIONS } from './data';
import StepIndicator from './StepIndicator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const IDENTIFICATION_FIELDS = [
  { id: 'titulo', label: 'Título do Projeto' },
  { id: 'instituicao', label: 'Instituição' },
  { id: 'cep_nome', label: 'Nome do CEP' },
] as const;

type ContextFormProps = {
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
};

export default function ContextForm({ answers, onAnswer, onNext, onBack, onRestart }: ContextFormProps) {
  const identificationFilled = IDENTIFICATION_FIELDS.every(
    (f) => answers[f.id]?.trim().length > 0
  );
  const contextFilled = CONTEXT_QUESTIONS.every((q) => answers[q.id]?.trim().length > 0);
  const allFilled = identificationFilled && contextFilled;

  const identificationAnswered = IDENTIFICATION_FIELDS.filter(
    (f) => answers[f.id]?.trim().length > 0
  ).length;
  const contextAnswered = CONTEXT_QUESTIONS.filter(
    (q) => answers[q.id]?.trim().length > 0
  ).length;
  const answeredCount = identificationAnswered + contextAnswered;

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
          <StepIndicator currentStep="context" onRestart={onRestart} answeredCount={answeredCount} />
        </div>

        {/* Identification section */}
        <h2 className="text-xl font-semibold mb-2">Identificação do Protocolo</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Campos obrigatórios para identificar o protocolo avaliado.
        </p>

        <Card className="border mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título do Projeto *</Label>
                <Input
                  id="titulo"
                  value={answers['titulo'] || ''}
                  onChange={(e) => onAnswer('titulo', e.target.value)}
                  placeholder="Ex: Sistema de triagem por IA para emergências"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instituicao">Instituição *</Label>
                  <Input
                    id="instituicao"
                    value={answers['instituicao'] || ''}
                    onChange={(e) => onAnswer('instituicao', e.target.value)}
                    placeholder="Ex: Hospital Universitário XYZ"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cep_nome">Nome do CEP *</Label>
                  <Input
                    id="cep_nome"
                    value={answers['cep_nome'] || ''}
                    onChange={(e) => onAnswer('cep_nome', e.target.value)}
                    placeholder="Ex: CEP/CONEP"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context questions section */}
        <h2 className="text-xl font-semibold mb-2">Caracterização do Contexto de Uso</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Estas questões são descritivas e obrigatórias. Elas não geram pontuação, mas contextualizam a avaliação.
        </p>

        <div className="space-y-6">
          {CONTEXT_QUESTIONS.map((q) => (
            <Card key={q.id} className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-start gap-2">
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-semibold shrink-0">
                    {q.id === 'contexto1' ? 'C1' : 'C2'}
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
                <Textarea
                  id={q.id}
                  value={answers[q.id] || ''}
                  onChange={(e) => onAnswer(q.id, e.target.value)}
                  placeholder="Sua resposta..."
                  className="min-h-[100px] resize-y"
                  aria-label={q.pergunta}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!allFilled}
            onClick={onNext}
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
