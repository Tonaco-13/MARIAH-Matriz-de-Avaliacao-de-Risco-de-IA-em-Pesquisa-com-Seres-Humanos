import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white">Pular para o conteúdo</a>
        <div className="min-h-screen flex flex-col">
          <main id="conteudo-principal" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
