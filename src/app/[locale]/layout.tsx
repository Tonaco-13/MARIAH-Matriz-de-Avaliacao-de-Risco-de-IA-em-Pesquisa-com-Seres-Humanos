import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/maria/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MARIAH — Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos",
  description: "Ferramenta de avaliação de risco para sistemas de IA em protocolos de pesquisa submetidos a Comitês de Ética em Pesquisa (CEP).",
  keywords: ["MARIAH", "risco em IA", "inteligência artificial", "ética em pesquisa", "CEP", "CONEP"],
  authors: [{ name: "Ministério da Saúde" }],
  icons: {
    icon: "/logo.svg",
  },
};

// Nesta branch apenas pt-BR é prerenderizado estaticamente (ZERO tradução).
// Idiomas gated são bloqueados pelo proxy (flag off) e, quando habilitados,
// resolvidos sob demanda; branch futura de tradução expandirá esta lista.
export function generateStaticParams() {
  return [{ locale: "pt-BR" }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider>
          <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white">{t('ui.skipLink')}</a>
          <div className="min-h-screen flex flex-col">
            <main id="conteudo-principal" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
