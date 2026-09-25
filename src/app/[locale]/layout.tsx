import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/maria/Footer";
import { getCourtesyNotice } from "@/components/maria/disclaimer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("siteTitle"),
    description: t("siteDesc"),
    keywords: t("siteKeywords").split(",").map((k) => k.trim()),
    authors: [{ name: t("siteAuthor") }],
    icons: {
      icon: "/logo.svg",
    },
  };
}

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
  const courtesyNotice = getCourtesyNotice(locale);
  // Mesma fonte de verdade do proxy.ts: a flag governa a exibição do seletor
  // de idioma no footer. Lida aqui (componente de servidor) — nas rotas pt-BR
  // (SSG) vale o valor do build; nas rotas gated (sob demanda), o do runtime.
  const localesEnabled = process.env.LOCALES_ENABLED === "true";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider>
          <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white">{t('ui.skipLink')}</a>
          <div className="min-h-screen flex flex-col">
            {courtesyNotice !== "" && (
              <div role="note" className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
                {courtesyNotice}
              </div>
            )}
            <main id="conteudo-principal" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer localesEnabled={localesEnabled} />
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
