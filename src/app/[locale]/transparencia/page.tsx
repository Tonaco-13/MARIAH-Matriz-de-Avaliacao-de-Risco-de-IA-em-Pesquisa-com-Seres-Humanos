import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
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
import { getNaoSubstitui } from '@/components/maria/disclaimer';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.transparencia' });
  return { title: t('metaTitle'), description: t('metaDesc') };
}

export default async function TransparenciaPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

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
                <ScrollText className="h-8 w-8 text-teal-700" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {t('pages.transparencia.title')}
                  </h1>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium px-2 py-0.5 border-amber-300 text-amber-800 bg-amber-50 whitespace-nowrap"
                  >
                    {t('pages.emRevisao')}
                  </Badge>
                </div>
                <p className="text-teal-700 text-sm mt-1">
                  {t('pages.transparencia.subtitle')}
                </p>
              </div>
            </div>
          </div>
          <p className="text-teal-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            {t('pages.transparencia.intro')}
          </p>
        </div>
      </header>

      {/* Aviso "em revisão" */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-start gap-2 text-sm text-amber-900">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            {t.rich('pages.statusAviso', {
              tipo: t('pages.tipoDocumentos'),
              b: (chunks) => <span className="font-medium">{chunks}</span>,
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Seção 1: Por que explicitar */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">{t('pages.transparencia.s1Title')}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t('pages.transparencia.s1p1')}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {getNaoSubstitui(locale)} {t.rich('pages.transparencia.s1p2', {
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </section>

        <Separator />

        {/* Seção 2: As três camadas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('pages.transparencia.s2Title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('pages.transparencia.s2intro')}
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Scale className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.camada1Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.camada1Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.camada1Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.camada1Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Layers className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.camada2Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.camada2Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.camada2Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.camada2Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <FlaskConical className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.camada3Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.camada3Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.camada3Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.camada3Body')}
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Seção 3: Mecanismos de salvaguarda */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('pages.transparencia.s3Title')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('pages.transparencia.s3intro')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <ShieldAlert className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.g1Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.g1Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.g1Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.g1Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <ShieldAlert className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.g2Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.g2Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.g2Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.g2Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Ban className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.g3Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.g3Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.g3Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.g3Body')}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-teal-50 rounded-md">
                    <Ban className="h-4 w-4 text-teal-600" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-800">
                    {t('pages.transparencia.g4Badge')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{t('pages.transparencia.g4Title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('pages.transparencia.g4Desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t('pages.transparencia.g4Body')}
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Seção 4: Downloads */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('pages.docsTitulo')}</h2>
          <Card>
            <CardContent className="py-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">{t('pages.transparencia.notaTecnicaTitle')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {t('pages.transparencia.notaTecnicaDesc')}
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <a href="/nota-tecnica-premissas-mariah.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {t('pages.transparencia.baixarNota')}
                    </a>
                  </Button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <p className="font-medium text-sm">{t('pages.transparencia.suplementoTitle')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {t('pages.transparencia.suplementoDesc')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-teal-300 text-teal-800 hover:bg-teal-50"
                  >
                    <a href="/suplemento-salvaguardas-mariah.docx" download>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {t('pages.transparencia.baixarSuplemento')}
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
          <h2 className="text-xl font-semibold">{t('pages.observacoesTitulo')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.rich('pages.transparencia.s5p', {
              mail: (chunks) => (
                <a
                  href="mailto:cgrep@saude.gov.br"
                  className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </main>
    </div>
  );
}
