import Link from 'next/link';
import type { Metadata } from 'next';
import { downloadLinkProps, isDownloadInPt } from '@/lib/downloads';
import { setRequestLocale, getTranslations } from 'next-intl/server';
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

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.validacao' });
  return { title: t('metaTitle'), description: t('metaDesc') };
}

export default async function ValidacaoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const codeSm = (chunks: React.ReactNode) => (
    <code className="text-xs bg-muted px-1 py-0.5 rounded">{chunks}</code>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white text-teal-700">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            asChild
            className="text-teal-700 hover:bg-teal-50 hover:text-teal-800 mb-4 -ml-3"
            size="sm"
          >
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {t('pages.voltar')}
            </Link>
          </Button>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 rounded-xl">
                <ClipboardCheck className="h-8 w-8 text-teal-700" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {t('pages.validacao.title')}
                  </h1>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium px-2 py-0.5 border-amber-300 text-amber-800 bg-amber-50 whitespace-nowrap"
                  >
                    {t('pages.emRevisao')}
                  </Badge>
                </div>
                <p className="text-teal-700 text-sm mt-1">
                  {t('pages.validacao.subtitle')}
                </p>
              </div>
            </div>
          </div>
          <p className="text-teal-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            {t('pages.validacao.intro')}
          </p>
        </div>
      </header>

      {/* Aviso "em revisão" */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-start gap-2 text-sm text-amber-900">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            {t.rich('pages.statusAviso', {
              tipo: t('pages.tipoArquivos'),
              b: (chunks) => <span className="font-medium">{chunks}</span>,
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Seção 1: O que é */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">{t('pages.validacao.s1Title')}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t('pages.validacao.s1p1')}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.rich('pages.validacao.s1p2', { b: (chunks) => <strong>{chunks}</strong> })}
          </p>
        </section>

        <Separator />

        {/* Seção 2: As três frentes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('pages.validacao.s2Title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('pages.validacao.s2intro')}
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Users className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.validacao.f1Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.validacao.f1Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.validacao.f1Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.validacao.f1Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <BarChart3 className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.validacao.f2Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.validacao.f2Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.validacao.f2Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.validacao.f2Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <GitCompareArrows className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.validacao.f3Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.validacao.f3Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.validacao.f3Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.validacao.f3Body')}
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Seção 3: Downloads */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('pages.validacao.s3Title')}</h2>
          <Card>
            <CardContent className="py-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">{t('pages.validacao.planilhaTitle')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {t('pages.validacao.planilhaDesc')}
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <a {...downloadLinkProps('planilha', locale)} download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {t('pages.validacao.baixarPlanilha')}
                      {isDownloadInPt('planilha', locale) && (
                        <span className="ml-1 font-normal opacity-80">{t('idioma.arquivoEmPt')}</span>
                      )}
                    </a>
                  </Button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">{t('pages.validacao.roteiroTitle')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {t('pages.validacao.roteiroDesc')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-50"
                  >
                    <a {...downloadLinkProps('roteiro', locale)} download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {t('pages.validacao.baixarRoteiro')}
                      {isDownloadInPt('roteiro', locale) && (
                        <span className="ml-1 font-normal opacity-80">{t('idioma.arquivoEmPt')}</span>
                      )}
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
          <h2 className="text-xl font-semibold">{t('pages.validacao.s4Title')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.rich('pages.validacao.s4p1', {
              b: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
              code: (chunks) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{chunks}</code>,
            })}
          </p>
          <Card className="bg-muted/30">
            <CardContent className="py-4 text-sm space-y-2">
              <p className="font-medium">{t('pages.validacao.fluxoTitle')}</p>
              <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground text-xs leading-relaxed pl-1">
                <li>
                  {t.rich('pages.validacao.fluxo1', { code: codeSm })}
                </li>
                <li>
                  {t.rich('pages.validacao.fluxo2', { code: codeSm })}
                </li>
                <li>
                  {t.rich('pages.validacao.fluxo3', { code: codeSm })}
                </li>
                <li>
                  {t('pages.validacao.fluxo4')}
                </li>
              </ol>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('pages.validacao.s4after')}
          </p>
        </section>

        <Separator />

        {/* Seção 5: Status e contribuição */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">{t('pages.validacao.s5Title')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('pages.validacao.s5p1')}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('pages.validacao.s5p2')}
          </p>
        </section>
      </main>
    </div>
  );
}
