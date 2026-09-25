'use client';

import { createContext, useContext } from 'react';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Flag LOCALES_ENABLED repassada pelo layout (componente de servidor, mesma fonte
 * do proxy.ts) aos componentes de cliente. Nas rotas pt-BR (SSG) vale o valor do
 * build; nas gated, o do runtime — idem ao seletor do rodapé.
 */
const LocalesEnabledContext = createContext(false);

export function LocalesEnabledProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return <LocalesEnabledContext.Provider value={value}>{children}</LocalesEnabledContext.Provider>;
}

export function useLocalesEnabled(): boolean {
  return useContext(LocalesEnabledContext);
}

/**
 * Seletor compacto "PT | ES" (cabeçalho da página inicial, abaixo da logo).
 * Links comuns (<a>, recarga completa) para "/" e "/es", como no rodapé — o
 * pt-BR é a versão normativa; o es, tradução de cortesia (títulos/aria-label).
 * Com a flag desligada não renderiza nada (pt-BR byte-idêntico à baseline).
 */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const enabled = useLocalesEnabled();
  const locale = useLocale();
  const t = useTranslations();
  if (!enabled) return null;

  const opcoes = [
    { code: 'pt-BR', href: '/', sigla: t('idioma.siglaPt'), descricao: t('footer.linkPt'), lang: 'pt-BR' },
    { code: 'es', href: '/es', sigla: t('idioma.siglaEs'), descricao: t('footer.linkEs'), lang: 'es' },
  ];

  return (
    <nav aria-label={t('idioma.nav')} className={className}>
      <ul className="inline-flex items-center rounded-full border border-teal-200 bg-white p-0.5 text-xs font-semibold">
        {opcoes.map((o) => {
          const atual = locale === o.code;
          return (
            <li key={o.code}>
              {atual ? (
                <span
                  aria-current="page"
                  lang={o.lang}
                  title={o.descricao}
                  className="block rounded-full bg-teal-700 px-2.5 py-0.5 text-white"
                >
                  <span aria-hidden="true">{o.sigla}</span>
                  <span className="sr-only">{o.descricao}</span>
                </span>
              ) : (
                <a
                  href={o.href}
                  hrefLang={o.lang}
                  lang={o.lang}
                  title={o.descricao}
                  className="block rounded-full px-2.5 py-0.5 text-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600"
                >
                  <span aria-hidden="true">{o.sigla}</span>
                  <span className="sr-only">{o.descricao}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
