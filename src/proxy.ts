import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

/**
 * Proxy (era `middleware.ts` até o Next 16) — roteamento i18n + dark-launch.
 *
 * A flag LOCALES_ENABLED é lida em RUNTIME (não NEXT_PUBLIC), para poder ser
 * alternada sem rebuild no ambiente standalone/Vercel:
 *   - OFF (padrão): qualquer caminho com prefixo de idioma gated (es/en/de/fr/zh)
 *     é redirecionado para o equivalente pt-BR sem prefixo. As rotas pt-BR
 *     (`/`, `/instrucoes`…) seguem servidas normalmente — nada muda.
 *   - ON: o roteamento next-intl passa a servir também os idiomas prefixados.
 */
const intlProxy = createMiddleware(routing);
const GATED_LOCALES = ["es", "en", "de", "fr", "zh"];

export default function proxy(request: NextRequest) {
  const enabled = process.env.LOCALES_ENABLED === "true";

  if (!enabled) {
    const segment = request.nextUrl.pathname.split("/")[1];
    if (GATED_LOCALES.includes(segment)) {
      const url = request.nextUrl.clone();
      url.pathname =
        "/" + request.nextUrl.pathname.split("/").slice(2).join("/");
      return NextResponse.redirect(url);
    }
  }

  return intlProxy(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
