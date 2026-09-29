import { ExternalLink, Landmark } from 'lucide-react';
import { DOCUMENTOS_OFICIAIS, type DocumentoOficialId } from '@/lib/documentos-oficiais';

/**
 * Bloco "Documentos oficiais" (LOG #78). Componente de apresentação: recebe os
 * rótulos já traduzidos (serve a páginas server e a componentes client).
 * Os documentos oficiais existem só em pt-BR: fora do pt-BR, cada link leva
 * hrefLang="pt-BR" e o marcador `emPt` (eMAG/WCAG 3.1.2).
 */
export default function DocumentosOficiais({
  titulo,
  descricao,
  rotulos,
  emPt,
  compacto = false,
}: {
  titulo: string;
  descricao?: string;
  rotulos: Record<DocumentoOficialId, string>;
  /** Marcador exibido quando a página não está em pt-BR (ex.: "(en portugués)"); omitir em pt-BR. */
  emPt?: string;
  compacto?: boolean;
}) {
  const lista = (
    <ul className={compacto ? 'mt-1 space-y-1' : 'mt-3 space-y-2'}>
      {DOCUMENTOS_OFICIAIS.map((doc) => (
        <li key={doc.id}>
          <a
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            hrefLang={emPt ? 'pt-BR' : undefined}
            className="group inline-flex items-start gap-1.5 text-sm text-teal-800 hover:text-teal-900"
          >
            <ExternalLink className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <span className="underline underline-offset-2">{rotulos[doc.id]}</span>
              {emPt && <span className="ml-1 font-normal opacity-80">{emPt}</span>}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );

  if (compacto) {
    return (
      <div className="mt-3 text-xs text-muted-foreground">
        <p>{titulo}</p>
        {lista}
      </div>
    );
  }

  return (
    <section aria-labelledby="documentos-oficiais" className="rounded-lg border border-teal-200 bg-teal-50/60 p-4">
      <h2 id="documentos-oficiais" className="flex items-center gap-2 text-base font-semibold text-teal-900">
        <Landmark className="h-4 w-4" aria-hidden="true" />
        {titulo}
      </h2>
      {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
      {lista}
    </section>
  );
}
