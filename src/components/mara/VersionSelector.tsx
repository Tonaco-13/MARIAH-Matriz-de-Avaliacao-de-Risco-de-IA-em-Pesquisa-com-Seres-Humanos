'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  GitBranch, 
  BarChart3, 
  ArrowRight, 
  Shield, 
  FileText, 
  Layers,
  CheckCircle2,
  ArrowLeftRight
} from 'lucide-react';
import type { MarcaVersion } from './data';
import StepIndicator from './StepIndicator';

type VersionSelectorProps = {
  onSelect: (version: MarcaVersion) => void;
  onSelectTriagem: () => void;
};

export default function VersionSelector({ onSelect, onSelectTriagem }: VersionSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">MARA</h1>
              <p className="text-teal-100 text-sm">Matriz de Avaliação de Risco Algorítmico</p>
            </div>
          </div>
          <p className="text-teal-50 max-w-2xl text-sm sm:text-base leading-relaxed">
            Ferramenta de apoio à avaliação ética de protocolos de pesquisa que utilizam 
            sistemas de inteligência artificial, destinada aos Comitês de Ética em Pesquisa (CEP).
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep="version" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Escolha a versão da matriz</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          Selecione a versão mais adequada ao perfil do seu CEP e à complexidade do protocolo.
        </p>

        {/* Version cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Version A */}
          <Card 
            className="cursor-pointer border-2 hover:border-teal-400 hover:shadow-lg transition-all duration-200 group"
            onClick={() => onSelect('A')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors">
                  <GitBranch className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Versão A</CardTitle>
                  <Badge className="bg-teal-600 text-white hover:bg-teal-700">Qualitativa</Badge>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Fluxograma sequencial com resposta binária por eixo de avaliação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>Para CEPs em primeiros ciclos com IA ou protocolos de menor complexidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>Lógica de fluxograma: resposta Sim/Não por eixo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>Nível de risco por combinação de respostas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>Deliberação colegiada orientada ao raciocínio</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-5 bg-teal-600 hover:bg-teal-700 group-hover:bg-teal-700"
              >
                Usar Versão A
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Version B */}
          <Card 
            className="cursor-pointer border-2 hover:border-amber-400 hover:shadow-lg transition-all duration-200 group"
            onClick={() => onSelect('B')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Versão B</CardTitle>
                  <Badge className="bg-amber-600 text-white hover:bg-amber-700">Quantitativa</Badge>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                Pontuação ponderada em sete blocos de avaliação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Para CEPs com experiência consolidada ou protocolos de alta complexidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Pontuação ponderada em sete blocos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Nível de risco por soma total com rastreabilidade numérica</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Documentação auditável e comparação entre protocolos</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-5 bg-amber-600 hover:bg-amber-700 group-hover:bg-amber-700"
              >
                Usar Versão B
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Triagem option */}
        <Card className="border-dashed border-2 border-teal-300 bg-teal-50/50 mb-10">
          <CardContent className="py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <ArrowLeftRight className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Usar Versão A como triagem e Versão B para aprofundamento</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Inicie com a avaliação qualitativa (Versão A). Caso o resultado indique nível III ou IV, 
                  prossiga com a avaliação quantitativa (Versão B) para documentação auditável.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-teal-400 text-teal-700 hover:bg-teal-100 shrink-0"
                onClick={onSelectTriagem}
              >
                Modo Triagem
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison table */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Comparação entre versões</h3>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium w-1/3">Aspecto</th>
                  <th className="text-left p-3 font-medium w-1/3">
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4 text-teal-600" />
                      Versão A — Qualitativa
                    </span>
                  </th>
                  <th className="text-left p-3 font-medium w-1/3">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-amber-600" />
                      Versão B — Quantitativa
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">Perfil do CEP</td>
                  <td className="p-3 text-muted-foreground">Primeiros ciclos com IA ou protocolos de menor complexidade</td>
                  <td className="p-3 text-muted-foreground">Experiência consolidada ou protocolos de alta complexidade</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3 font-medium">Lógica de operação</td>
                  <td className="p-3 text-muted-foreground">Fluxograma sequencial, resposta binária por eixo</td>
                  <td className="p-3 text-muted-foreground">Pontuação ponderada em sete blocos</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">Estrutura</td>
                  <td className="p-3 text-muted-foreground">5 eixos temáticos</td>
                  <td className="p-3 text-muted-foreground">7 blocos com pesos diferenciados</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3 font-medium">Resultado</td>
                  <td className="p-3 text-muted-foreground">Nível de risco por combinação de respostas</td>
                  <td className="p-3 text-muted-foreground">Nível de risco por soma total com rastreabilidade numérica</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">Uso prioritário</td>
                  <td className="p-3 text-muted-foreground">Deliberação colegiada orientada ao raciocínio</td>
                  <td className="p-3 text-muted-foreground">Documentação auditável e comparação entre protocolos</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3 font-medium">Cláusula de Prevalência</td>
                  <td className="p-3 text-muted-foreground">Não aplicável</td>
                  <td className="p-3 text-muted-foreground">Elevação automática a Nível IV (Bloco 4)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            A MARA não aprova nem reprova protocolos. Não substitui o julgamento do CEP. 
            Não dispensa a deliberação colegiada.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            MARA — Matriz de Avaliação de Risco Algorítmico • Ferramenta de apoio à avaliação ética de protocolos com IA
          </p>
        </div>
      </footer>
    </div>
  );
}
