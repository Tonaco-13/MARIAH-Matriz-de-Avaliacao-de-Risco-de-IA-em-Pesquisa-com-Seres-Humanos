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
import { useTranslations, useLocale } from 'next-intl';
import type { MarcaVersion } from './data';
import StepIndicator from './StepIndicator';
import { getDisclaimer } from './disclaimer';

type VersionSelectorProps = {
  onSelect: (version: MarcaVersion) => void;
  onSelectTriagem: () => void;
};

export default function VersionSelector({ onSelect, onSelectTriagem }: VersionSelectorProps) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white text-teal-700">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 rounded-xl">
                <Shield className="h-8 w-8 text-teal-700" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('app.title')}</h1>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 whitespace-nowrap">
                    {t('app.badgePreliminar')}
                  </span>
                </div>
                <p className="text-teal-700 text-sm">{t('app.subtitle')}</p>
              </div>
            </div>
            <img src="/inaep-logo-sm.png" alt={t('home.inaepAlt')} className="h-14 sm:h-16 w-auto shrink-0 mt-2 -mr-2" />
          </div>
          <p className="text-teal-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            {t('home.intro')}
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep="version" />
        </div>

        <h2 className="text-xl font-semibold mb-2">{t('home.chooseTitle')}</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          {t('home.chooseSubtitle')}
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
                  <CardTitle className="text-lg">{t('home.versionA.title')}</CardTitle>
                  <Badge className="bg-teal-700 text-white hover:bg-teal-800">{t('home.versionA.badge')}</Badge>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {t('home.versionA.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>{t('home.versionA.bullet1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>{t('home.versionA.bullet2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>{t('home.versionA.bullet3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>{t('home.versionA.bullet4')}</span>
                </li>
              </ul>
              <Button
                className="w-full mt-5 bg-teal-700 hover:bg-teal-800 group-hover:bg-teal-800"
              >
                {t('home.versionA.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Version B */}
          <Card
            className="cursor-pointer border-2 hover:border-slate-500 hover:shadow-lg transition-all duration-200 group"
            onClick={() => onSelect('B')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('home.versionB.title')}</CardTitle>
                  <Badge className="bg-slate-700 text-white hover:bg-slate-800">{t('home.versionB.badge')}</Badge>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {t('home.versionB.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                  <span>{t('home.versionB.bullet1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                  <span>{t('home.versionB.bullet2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                  <span>{t('home.versionB.bullet3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                  <span>{t('home.versionB.bullet4')}</span>
                </li>
              </ul>
              <Button
                className="w-full mt-5 bg-slate-700 hover:bg-slate-800 text-white group-hover:bg-slate-800"
              >
                {t('home.versionB.cta')}
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
                <p className="font-medium text-sm">{t('home.triagem.title')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('home.triagem.desc')}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-teal-400 text-teal-700 hover:bg-teal-100 shrink-0"
                onClick={onSelectTriagem}
              >
                {t('home.triagem.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison table */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">{t('home.comparison.title')}</h3>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium w-1/3">{t('home.comparison.aspecto')}</th>
                  <th className="text-left p-3 font-medium w-1/3">
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4 text-teal-600" />
                      {t('app.versionLabelA')}
                    </span>
                  </th>
                  <th className="text-left p-3 font-medium w-1/3">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-slate-700" />
                      {t('app.versionLabelB')}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">{t('home.comparison.perfil')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.perfilA')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.perfilB')}</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3 font-medium">{t('home.comparison.logica')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.logicaA')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.logicaB')}</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">{t('home.comparison.estrutura')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.estruturaA')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.estruturaB')}</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3 font-medium">{t('home.comparison.resultado')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.resultadoA')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.resultadoB')}</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium">{t('home.comparison.uso')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.usoA')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.usoB')}</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3 font-medium">{t('home.comparison.prevalencia')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.prevalenciaA')}</td>
                  <td className="p-3 text-muted-foreground">{t('home.comparison.prevalenciaB')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4 mt-0.5 shrink-0" />
          <p>{getDisclaimer(locale)}</p>
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            {t('home.disclaimerVersao')}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-muted-foreground">
            {t('home.footerLong')}
          </p>
        </div>
      </footer>
    </div>
  );
}
