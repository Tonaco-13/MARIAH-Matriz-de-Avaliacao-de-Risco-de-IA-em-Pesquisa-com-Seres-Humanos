import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Configuração por requisição do next-intl.
 *
 * Nesta branch (infra, ZERO tradução) todos os locales carregam as mensagens
 * pt-BR — não há arquivos de tradução ainda. Quando uma tradução for adotada
 * em branch futura, trocar o import fixo por `../../messages/${locale}.json`
 * com fallback ao pt-BR.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import("../../messages/pt-BR.json")).default;

  return { locale, messages };
});
