'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

type HelpPanelProps = {
  open: boolean;
  onClose: () => void;
  questionId: string;
  questionText: string;
  dica: string;
  referencia?: string;
  efeito?: 'risco' | 'mitigacao';
  pontos?: number;
  riskAnswer?: 'sim' | 'nao';
};

export default function HelpPanel({
  open,
  onClose,
  questionId,
  questionText,
  dica,
  referencia,
  efeito,
  pontos,
  riskAnswer,
}: HelpPanelProps) {
  const t = useTranslations();
  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {questionId}
            </Badge>
            {efeito === 'mitigacao' ? (
              <Badge className="bg-teal-100 text-teal-700 border border-teal-200 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {t('help.mitigacao')}
              </Badge>
            ) : efeito === 'risco' ? (
              <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t('help.risco')}
              </Badge>
            ) : null}
          </div>
          <SheetTitle className="text-base leading-relaxed">
            {questionText}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t('help.ariaDescription', { id: questionId })}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          {/* Fundamentação */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              {t('help.whyTitle')}
            </h4>
            <p className="text-sm leading-relaxed">{dica}</p>
          </div>

          <Separator />

          {/* Resposta de risco */}
          {riskAnswer && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {t('help.riskAnswerTitle')}
              </h4>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  {t.rich('help.riskAnswerText', {
                    answer: riskAnswer === 'sim' ? t('ui.sim') : t('ui.nao'),
                    b: (chunks) => <strong className="text-red-600">{chunks}</strong>,
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Efeito e pontos (Versão B) */}
          {pontos !== undefined && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                  {t('help.scoreTitle')}
                </h4>
                {efeito === 'mitigacao' ? (
                  <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
                    <Shield className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-teal-700">
                      {t.rich('help.mitigacaoText', {
                        pts: String(Math.abs(pontos)),
                        b: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      {t.rich('help.riscoText', {
                        pts: String(Math.abs(pontos)),
                        b: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Referência normativa */}
          {referencia && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                  {t('help.refTitle')}
                </h4>
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <BookOpen className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-800 font-medium">{referencia}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
