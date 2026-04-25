'use client';

import { Eraser } from 'lucide-react';
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

type ClearScopeButtonProps = {
  /** Texto curto do escopo a limpar — ex.: "este eixo", "este bloco", "esta página". */
  scopeLabel: string;
  /** Quantidade de respostas que seriam apagadas — usado no diálogo de confirmação. */
  affectedCount: number;
  onClear: () => void;
  /** Quando true, esconde o botão (ex.: nada a limpar). */
  disabled?: boolean;
};

/**
 * Botão "Limpar [escopo]" — diferente do RestartButton (que zera tudo e volta para
 * o início), este apaga apenas as respostas do escopo atual (página, eixo ou bloco).
 * Mantém o usuário no contexto em que está.
 */
export default function ClearScopeButton({
  scopeLabel,
  affectedCount,
  onClear,
  disabled,
}: ClearScopeButtonProps) {
  // Capitaliza só a primeira letra do scope para a frase do título.
  const titleScope =
    scopeLabel.charAt(0).toUpperCase() + scopeLabel.slice(1);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5"
          aria-label={`Limpar ${scopeLabel}`}
          disabled={disabled}
        >
          <Eraser className="h-3.5 w-3.5" />
          <span className="text-xs sm:text-sm">Limpar {scopeLabel}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Limpar {scopeLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            {affectedCount > 0 ? (
              <>
                {titleScope} contém <strong>{affectedCount} resposta{affectedCount === 1 ? '' : 's'}</strong>{' '}
                preenchida{affectedCount === 1 ? '' : 's'} que ser{affectedCount === 1 ? 'á apagada' : 'ão apagadas'}.
                Os demais passos da avaliação ficam preservados.
                <br />
                <span className="block mt-2 text-xs">Esta ação não pode ser desfeita.</span>
              </>
            ) : (
              <>
                Não há respostas a apagar neste escopo.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClear}
            disabled={affectedCount === 0}
            className="bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-400"
          >
            Sim, limpar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
