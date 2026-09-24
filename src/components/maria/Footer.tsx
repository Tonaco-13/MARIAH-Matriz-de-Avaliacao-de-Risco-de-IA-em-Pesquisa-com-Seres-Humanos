'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations()
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-muted/30 py-4 px-6">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <p>
          {t.rich('footer.developedBy', {
            ms: (chunks) => (
              <span className="font-medium text-foreground">{chunks}</span>
            ),
          })}
        </p>
        <p className="text-xs">
          {t('footer.license')}
        </p>
        <p className="text-xs text-muted-foreground/80">
          {t('footer.privacy')}
        </p>
        <p className="text-xs">
          © {anoAtual} {t('footer.copyrightOrg')}
        </p>
        <p className="text-xs pt-1">
          <Link
            href="/validacao"
            className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
          >
            {t('footer.linkValidacao')}
          </Link>
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          <Link
            href="/transparencia"
            className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
          >
            {t('footer.linkTransparencia')}
          </Link>
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          <Link
            href="/instrucoes"
            className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
          >
            {t('footer.linkApendice')}
          </Link>
          <span className="text-muted-foreground/80">{t('footer.emRevisao')}</span>
        </p>
      </div>
    </footer>
  )
}
