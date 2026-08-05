import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ScrollText,
  Download,
  Info,
  FileText,
} from 'lucide-react';
import { MARIA_NAO_SUBSTITUI } from '@/components/maria/disclaimer';

export const metadata: Metadata = {
  title: 'Instruções de Preenchimento — MARIAH',
  description:
    'Instruções de preenchimento das Versões A (qualitativa) e B (quantitativa) da MARIAH, questão a questão, com respostas de risco, pesos, regras de consolidação e pontos de corte. Apêndice do Guia de Diretrizes Éticas para Pesquisa com IA (em revisão).',
};

export default function InstrucoesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            asChild
            className="text-teal-50 hover:bg-white/10 hover:text-white mb-4 -ml-3"
            size="sm"
          >
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar à MARIAH
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <ScrollText className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Instruções de Preenchimento
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] font-medium px-2 py-0.5 border-amber-300 text-amber-100 bg-amber-500/30 whitespace-nowrap"
                >
                  em revisão
                </Badge>
              </div>
              <p className="text-teal-100 text-sm mt-1">
                Apêndice do Guia — preenchimento das Versões A e B
              </p>
            </div>
          </div>
          <p className="text-teal-50 max-w-2xl text-sm sm:text-base leading-relaxed">
            Guia operacional para responder a matriz, questão a questão: a resposta que
            indica risco, as orientações por item, as regras de consolidação e a leitura
            do resultado.
          </p>
        </div>
      </header>

      {/* Aviso "em revisão" */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-start gap-2 text-sm text-amber-900">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            <span className="font-medium">Status:</span> o <em>Guia de Diretrizes Éticas para
            Pesquisa com IA</em> está em fase de revisão pelo Grupo de Trabalho do
            Ministério da Saúde. Os documentos abaixo correspondem à minuta atual e serão
            atualizados quando o guia for publicado oficialmente.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Seção 1: O que é */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">O que são estas instruções</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            As instruções orientam o preenchimento das duas versões da matriz, questão a
            questão. Para cada item, indicam qual resposta sinaliza risco, trazem a
            orientação de preenchimento e explicam como o resultado é construído —
            consolidação por contagem (Versão A) e pontuação por blocos (Versão B), além
            das salvaguardas automáticas e dos pontos de corte.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Foram elaboradas em correspondência direta com o conjunto de perguntas
            atualmente em uso no aplicativo, de modo que o avaliador encontre, no documento,
            exatamente os itens que vê na tela. {MARIA_NAO_SUBSTITUI}
          </p>
        </section>

        <Separator />

        {/* Seção 2: Downloads */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Documentos para download</h2>
          <Card>
            <CardContent className="py-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">Versão A — Qualitativa</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Preenchimento dos cinco eixos (e do Eixo 3.b, Res. 738): a resposta de
                    risco e a orientação de cada questão, a regra de consolidação por
                    contagem e a leitura do nível final.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <a href="/instrucoes-preenchimento-versao-a-maria.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar Versão A (.docx)
                    </a>
                  </Button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">Versão B — Quantitativa</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Preenchimento dos sete blocos (e do Bloco 6.b, Res. 738): pesos por
                    questão, a Cláusula de Prevalência Ética, a mitigação bidirecional do
                    Bloco 7 e os pontos de corte.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-50"
                  >
                    <a href="/instrucoes-preenchimento-versao-b-maria.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar Versão B (.docx)
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Documentos complementares sobre as premissas e as salvaguardas da matriz estão
            na página{' '}
            <Link
              href="/transparencia"
              className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
            >
              Transparência metodológica
            </Link>
            .
          </p>
        </section>

        <Separator />

        {/* Seção 3: Observações */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Observações e crítica técnica</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As instruções acompanham a matriz, que está em revisão pelo Grupo de Trabalho;
            ajustes nas questões serão refletidos nestes documentos. Observações e críticas
            técnicas podem ser encaminhadas, a qualquer momento, à CGREP pelo e-mail{' '}
            <a
              href="mailto:cgrep@saude.gov.br"
              className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
            >
              cgrep@saude.gov.br
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
