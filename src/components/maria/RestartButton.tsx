'use client';

import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type RestartButtonProps = {
  onRestart: () => void;
  /**
   * Quantas perguntas/campos já foram preenchidos. Quando > 0, o dialog de
   * confirmação mostra o número para reforçar o que seria perdido.
   */
  answeredCount?: number;
  /**
   * Variantes de estilo. 'inline' (padrão) — botão neutro discreto para a barra
   * de navegação. 'compact' — versão menor para outros usos.
   */
  variant?: 'inline' | 'compact';
};

export default function RestartButton({
  onRestart,
  answeredCount,
  variant = 'inline',
}: RestartButtonProps) {
  const t = useTranslations();
  const buttonClasses =
    variant === 'compact'
      ? 'text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5 h-8 px-2 sm:px-3'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={variant === 'compact' ? 'sm' : 'default'}
          className={buttonClasses}
          aria-label={t('restart.aria')}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="text-xs sm:text-sm">{t('restart.button')}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('restart.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {answeredCount && answeredCount > 0 ? (
              <>
                {t.rich('restart.descWithCount', {
                  count: answeredCount,
                  b: (chunks) => <strong>{chunks}</strong>,
                })}
                <br />
                <span className="block mt-2 text-xs">{t('ui.undoable')}</span>
              </>
            ) : (
              <>
                {t('restart.descZero')}
                <br />
                <span className="block mt-2 text-xs">{t('ui.undoable')}</span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('ui.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onRestart}
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400"
          >
            {t('restart.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
