'use client'

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
          — DECIT/SCTIE
        </p>
        <p className="text-xs">
          Licenciado sob a Licença Pública Geral do Software Público Brasileiro
          (LPG-SPB)
        </p>
        <p className="text-xs">
          © {anoAtual} Ministério da Saúde — Governo Federal do Brasil
        </p>
      </div>
    </footer>
  )
}
