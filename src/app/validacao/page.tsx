import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ClipboardCheck,
  Download,
  Users,
  BarChart3,
  GitCompareArrows,
  Info,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Validação Local pelos CEPs — MARIAH',
  description:
    'Protocolo opcional de validação local da MARIAH pelos Comitês de Ética em Pesquisa, descrito em apêndice próprio do Guia de Uso Ético da Inteligência Artificial em Pesquisa com Seres Humanos (em revisão).',
};

export default function ValidacaoPage() {
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
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Validação Local pelos CEPs
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] font-medium px-2 py-0.5 border-amber-300 text-amber-100 bg-amber-500/30 whitespace-nowrap"
                >
                  em revisão
                </Badge>
              </div>
              <p className="text-teal-100 text-sm mt-1">
                Apêndice do Guia de Uso Ético da Inteligência Artificial em Pesquisa com Seres Humanos
              </p>
            </div>
          </div>
          <p className="text-teal-50 max-w-2xl text-sm sm:text-base leading-relaxed">
            Protocolo opcional para que cada CEP verifique como a MARIAH se comporta na
            casuística de protocolos de pesquisa com inteligência artificial que efetivamente
            lhe são submetidos.
          </p>
        </div>
      </header>

      {/* Aviso "em revisão" */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-start gap-2 text-sm text-amber-900">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            <span className="font-medium">Status:</span> o <em>Guia de Uso Ético da Inteligência Artificial em Pesquisa com Seres Humanos</em> está em fase de revisão pelo Grupo de Trabalho do
            Ministério da Saúde. Os arquivos abaixo correspondem à minuta atual e serão
            atualizados quando o guia for publicado oficialmente.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Seção 1: O que é */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Por que validar localmente</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A MARIAH é instrumento de apoio à deliberação do CEP — não norma vinculante.
            A adoção da matriz é escolha institucional de cada CEP, e a validação local segue
            o mesmo espírito: nenhum CEP é obrigado a validá-la, e nenhum CEP precisa esperar
            decisão central para fazê-lo. Quando o colegiado entender que vale a pena
            verificar como a matriz se comporta nos protocolos que lhe são submetidos, o
            protocolo do apêndice oferece um roteiro prático.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Há três razões para um CEP querer validar localmente:{' '}
            <strong>aprendizado institucional</strong> (descobrir quais perguntas estão sendo
            interpretadas de forma divergente entre avaliadores),{' '}
            <strong>qualificação dos pareceres</strong> (demonstrar aplicação consistente
            da MARIAH na sua casuística) e{' '}
            <strong>contribuição opcional à evolução do instrumento</strong> (compartilhar
            observações com o Grupo de Trabalho responsável pelo guia).
          </p>
        </section>

        <Separator />

        {/* Seção 2: As três frentes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">As três frentes de validação</h2>
          <p className="text-sm text-muted-foreground">
            Cada CEP pode rodar uma, duas ou as três frentes, em qualquer ordem. Todas
            compartilham a mesma unidade amostral: o protocolo de pesquisa com uso de
            inteligência artificial submetido ao CEP.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Users className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Frente 1
                  </Badge>
                </div>
                <CardTitle className="text-base">Concordância entre avaliadores</CardTitle>
                <CardDescription className="text-xs">
                  Versão A · kappa de Cohen
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Dois membros do CEP aplicam a Versão A ao mesmo protocolo, de forma
                independente. A planilha calcula a concordância e o kappa, revelando quais
                eixos têm leitura divergente. Recomenda-se pelo menos 20 protocolos avaliados
                em paralelo.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <BarChart3 className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Frente 2
                  </Badge>
                </div>
                <CardTitle className="text-base">Distribuição empírica</CardTitle>
                <CardDescription className="text-xs">
                  Versão B · histograma por nível
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Examina como os protocolos avaliados pelo CEP se distribuem nos quatro
                níveis. Útil para conhecer o perfil da casuística e identificar concentrações
                próximas aos pontos de corte da Versão B.
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <GitCompareArrows className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    Frente 3
                  </Badge>
                </div>
                <CardTitle className="text-base">Convergência A↔B</CardTitle>
                <CardDescription className="text-xs">
                  Modo triagem · tabela de contingência
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Para protocolos avaliados pelas duas versões no modo triagem, verifica se A
                e B convergem para a mesma classificação. Discordâncias sistemáticas indicam
                inconsistência de leitura ou dimensões diferentes de risco captadas pelas
                duas versões.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Seção 3: Downloads */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Recursos para começar</h2>
          <Card>
            <CardContent className="py-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">Planilha-modelo</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Abas dedicadas a cada frente, com fórmulas pré-configuradas (kappa,
                    distribuição, contingência) e painel-resumo. Funciona em Excel,
                    LibreOffice Calc e Google Sheets.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <a href="/planilha-validacao-local-maria.xlsx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar planilha (.xlsx)
                    </a>
                  </Button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">Roteiro completo</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Apêndice do guia com a justificativa de cada frente, recomendações
                    operacionais, interpretação dos achados e canal opcional de
                    compartilhamento com o Grupo de Trabalho.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-50"
                  >
                    <a href="/guia-validacao-local-maria.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar roteiro (.docx)
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Seção 4: Como usar com a MARIAH */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Como integrar à MARIAH</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O software MARIAH oferece um botão{' '}
            <span className="font-medium text-foreground">
              &quot;Exportar dados desta avaliação&quot;
            </span>{' '}
            na tela de resultados. Cada avaliação gera um arquivo <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.json</code>{' '}
            estruturado contendo a classificação consolidada da Versão A, a pontuação por
            bloco da Versão B (quando aplicada) e os metadados do protocolo.
          </p>
          <Card className="bg-muted/30">
            <CardContent className="py-4 text-sm space-y-2">
              <p className="font-medium">Fluxo sugerido</p>
              <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground text-xs leading-relaxed pl-1">
                <li>
                  Cada avaliador aplica a MARIAH ao protocolo de forma independente e exporta o{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">.json</code> ao final.
                </li>
                <li>
                  Antes de transcrever, substitua o campo{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">idInterno</code> pelo
                  identificador interno do seu CEP (ex.: <code className="text-xs bg-muted px-1 py-0.5 rounded">P-001</code>).
                </li>
                <li>
                  Transcreva os campos para as abas correspondentes da planilha-modelo
                  (Protocolos, Versão A, Versão B). As instruções por aba estão dentro do
                  próprio JSON, no campo <code className="text-xs bg-muted px-1 py-0.5 rounded">comoUsar</code>.
                </li>
                <li>
                  A planilha calcula automaticamente os indicadores das três frentes e gera
                  o painel-resumo para discussão em reunião plenária.
                </li>
              </ol>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Versões futuras da MARIAH poderão preencher a planilha diretamente. Por ora, a
            transcrição manual é deliberada: ela preserva a separação entre a ferramenta
            operacional e o instrumento de validação institucional do CEP.
          </p>
        </section>

        <Separator />

        {/* Seção 5: Status e contribuição */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Compartilhar resultados (opcional)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            CEPs que decidirem compartilhar suas observações com o Grupo de Trabalho podem
            fazê-lo a qualquer momento por meio da Secretaria Executiva da INAEP. Não há
            prazo, formulário obrigatório ou contrapartida institucional — o compartilhamento
            é ato voluntário, e seu único propósito é informar a evolução futura do
            instrumento.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pode-se enviar a planilha completa, apenas os indicadores agregados ou uma nota
            narrativa do que o colegiado observou. CEPs com preocupação de
            confidencialidade institucional podem encaminhar apenas os indicadores
            agregados. Nenhum CEP será identificado em publicação sem consentimento expresso.
          </p>
        </section>
      </main>
    </div>
  );
}
