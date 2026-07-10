import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ScrollText,
  Download,
  Scale,
  Layers,
  FlaskConical,
  ShieldAlert,
  Ban,
  Info,
  FileText,
} from 'lucide-react';
import { MARIA_NAO_SUBSTITUI } from '@/components/maria/disclaimer';

export const metadata: Metadata = {
  title: 'Transparência Metodológica — MARIA',
  description:
    'Premissas e mecanismos de salvaguarda que sustentam a classificação de risco da MARIA, organizados em três camadas (normativa, de elaboração e empírica pendente). Documentos técnicos para auditoria e crítica.',
};

export default function TransparenciaPage() {
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
              Voltar à MARIA
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <ScrollText className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Transparência metodológica
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] font-medium px-2 py-0.5 border-amber-300 text-amber-100 bg-amber-500/30 whitespace-nowrap"
                >
                  em revisão
                </Badge>
              </div>
              <p className="text-teal-100 text-sm mt-1">
                Premissas e salvaguardas da classificação de risco
              </p>
            </div>
          </div>
          <p className="text-teal-50 max-w-2xl text-sm sm:text-base leading-relaxed">
            Documentos técnicos que explicitam as premissas sobre as quais a MARIA classifica
            o risco — para que estatísticos, metodologistas, integrantes de CEP e pesquisadores
            possam auditar, criticar e compreender as decisões do instrumento.
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
        {/* Seção 1: Por que explicitar */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Por que explicitar as premissas</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A MARIA produz uma classificação de risco a partir de regras que foram adotadas
            na elaboração da matriz, com base no referencial normativo e na literatura
            sistematizada no próprio Guia. Tornar essas regras explícitas é condição para
            que possam ser auditadas e criticadas. A documentação distingue, deliberadamente,
            o que decorre da norma, o que foi decidido na construção do instrumento e o que
            ainda depende de evidência empírica.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {MARIA_NAO_SUBSTITUI} A sua validação psicométrica é{' '}
            <strong>prospectiva</strong>: ocorrerá à medida que os CEPs adotarem o instrumento
            e conduzirem o protocolo descrito no Apêndice F do Guia.
          </p>
        </section>

        <Separator />

        {/* Seção 2: As três camadas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">As três camadas de premissas</h2>
          <p className="text-sm text-muted-foreground">
            As premissas da MARIA organizam-se em três camadas, com graus distintos de
            abertura à discussão.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Scale className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Camada 1
                  </Badge>
                </div>
                <CardTitle className="text-base">Normativa</CardTitle>
                <CardDescription className="text-xs">
                  Não está em discussão
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Os quatro níveis de risco (I a IV) e o tratamento ordinal da escala seguem a
                categorização do Conselho Nacional de Saúde, fixada pelas Resoluções CNS
                n.º 466/2012, 510/2016 e 738/2024. Os eixos derivam do mapeamento normativo
                e da literatura ética.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Layers className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Camada 2
                  </Badge>
                </div>
                <CardTitle className="text-base">De elaboração</CardTitle>
                <CardDescription className="text-xs">
                  Aberta a sugestões do GT
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Decisões adotadas na construção da matriz: thresholds por eixo e regra do
                máximo (Versão A); pesos, modelo aditivo e Cláusula de Prevalência Ética
                (Versão B). Calibração teórica, conservadora e explícita — não derivada de
                dados.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <FlaskConical className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Camada 3
                  </Badge>
                </div>
                <CardTitle className="text-base">Empírica pendente</CardTitle>
                <CardDescription className="text-xs">
                  Objeto do Apêndice F
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                A validação psicométrica é prospectiva e descentralizada, conduzida pelos CEPs
                que adotarem o instrumento: confiabilidade interavaliador, distribuição
                empírica nos níveis e convergência entre as Versões A e B.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Seção 3: Mecanismos de salvaguarda */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Mecanismos de salvaguarda automática</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sobre a lógica de gradiente da matriz, a MARIA superpõe quatro mecanismos que a
            interrompem: uma vez satisfeita determinada condição categórica, a classificação
            passa a ser definida por critério deontológico — e não estatístico —, sobrescrevendo
            o que a contagem ou a soma indicariam. São assimetrias deliberadas, de precaução.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <ShieldAlert className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Gatilho 1
                  </Badge>
                </div>
                <CardTitle className="text-base">Regra do Eixo 3.b</CardTitle>
                <CardDescription className="text-xs">
                  Versão A · Res. CNS n.º 738/2024
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Em bancos de dados de pesquisa, uma única resposta de risco salta o Nível II
                (1–2 → III; 3 ou mais → IV). Pela regra do máximo, eleva o nível final do
                protocolo.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <ShieldAlert className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Gatilho 2
                  </Badge>
                </div>
                <CardTitle className="text-base">Cláusula de Prevalência Ética</CardTitle>
                <CardDescription className="text-xs">
                  Versão B · Bloco 4 (Decisão)
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Se P4.1 ou P4.2 for marcada como “Sim” (decisão sem revisão humana ou dano
                irreversível), o protocolo é forçado ao Nível IV, sobrescrevendo a soma total
                dos blocos.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Ban className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Gatilho 3
                  </Badge>
                </div>
                <CardTitle className="text-base">Eliminatória — cadeia de custódia</CardTitle>
                <CardDescription className="text-xs">
                  Versões A e B · Res. CNS n.º 738/2024
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                A ausência de cadeia de custódia formalizada (Art. 27, VI) classifica o
                protocolo como “não avaliável pela MARIA” — uma recusa de classificação que
                remete o caso à análise individualizada do colegiado.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Ban className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Gatilho 4
                  </Badge>
                </div>
                <CardTitle className="text-base">Eliminatória — novo consentimento</CardTitle>
                <CardDescription className="text-xs">
                  Versões A e B · Lei n.º 14.874/2024 + LGPD
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Em sistemas adaptativos (1.2 = Sim / P2.2 = Sim), a ausência de plano de novo
                consentimento bloqueia o parecer — protocolo não avaliável no mérito. Não
                altera a pontuação: é exigência legal, não compensável por pontos. Na Versão A
                é a 2.10; na Versão B, a P2.8.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Seção 4: Downloads */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Documentos para download</h2>
          <Card>
            <CardContent className="py-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">Nota Técnica de Premissas</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Premissas da classificação de risco da MARIA em três camadas (normativa,
                    de elaboração e empírica pendente), com as principais decisões
                    metodológicas, suas justificativas e a tabela de pontos de corte da
                    Versão B.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <a href="/nota-tecnica-premissas-maria.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar nota técnica (.docx)
                    </a>
                  </Button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">Suplemento de Salvaguardas</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Detalhamento dos quatro mecanismos de salvaguarda automática (Eixo 3.b,
                    Cláusula de Prevalência Ética, eliminatória de cadeia de custódia e
                    diligência impeditiva de novo consentimento): o que fazem, por que existem,
                    como interagem com a matriz, cenários e crítica honesta.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-50"
                  >
                    <a href="/suplemento-salvaguardas-maria.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar suplemento (.docx)
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Seção 5: Observações e crítica */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Observações e crítica técnica</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As decisões de elaboração estão abertas a sugestões editoriais e de mérito,
            pois a matriz, nesta fase, não reflete a deliberação colegiada do Grupo de
            Trabalho. Observações e críticas técnicas podem ser encaminhadas, a qualquer
            momento, à CGREP pelo e-mail{' '}
            <a
              href="mailto:cgrep@saude.gov.br"
              className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
            >
              cgrep@saude.gov.br
            </a>
            , e serão consideradas em ciclos futuros de revisão do Guia e da matriz.
          </p>
        </section>
      </main>
    </div>
  );
}
