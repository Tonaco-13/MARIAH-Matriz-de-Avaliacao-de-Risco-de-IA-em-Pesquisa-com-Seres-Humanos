'use client'

import Link from 'next/link'

export function Footer() {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-muted/30 py-4 px-6">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <p>
          Desenvolvido pelo{' '}
          <span className="font-medium text-foreground">
            Ministério da Saúde
          </span>{' '}
          para o Sistema Nacional de Ética em Pesquisa com Seres Humanos (SINEP)
        </p>
        <p className="text-xs">
          Licenciado sob a Licença Pública Geral do Software Público Brasileiro
          (LPG-SPB)
        </p>
        <p className="text-xs">
          © {anoAtual} Ministério da Saúde — Governo Federal do Brasil
        </p>
        <p className="text-xs pt-1">
          <Link
            href="/validacao"
            className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
          >
            Validação Local pelos CEPs
          </Link>
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          <Link
            href="/transparencia"
            className="text-teal-700 hover:text-teal-800 hover:underline underline-offset-2"
          >
            Transparência metodológica
          </Link>
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          <span className="text-muted-foreground/80">Apêndice do guia (em revisão)</span>
        </p>
      </div>
    </footer>
  )
}
