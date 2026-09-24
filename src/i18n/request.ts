import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Configuração por requisição do next-intl.
 *
 * O canônico pt-BR é a base de TODOS os locales. Locales com tradução adotada
 * (mapa TRANSLATIONS abaixo) carregam seu messages/<locale>.json e o mesclam
 * recursivamente SOBRE o pt-BR: cada chave traduzida cobre a canônica; chaves
 * ainda não traduzidas caem no pt-BR (regime Opção A — o key-parity no gate
 * audita as ausências). Locales sem arquivo seguem 100% em pt-BR.
 */
type Messages = Record<string, unknown>;

function mergeMessages(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = out[key];
    out[key] =
      baseValue !== null &&
      value !== null &&
      typeof baseValue === "object" &&
      typeof value === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(value)
        ? mergeMessages(baseValue as Messages, value as Messages)
        : value;
  }
  return out;
}

const TRANSLATIONS: Record<string, () => Promise<{ default: Messages }>> = {
  es: () => import("../../messages/es.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const ptBR = (await import("../../messages/pt-BR.json")).default;
  const load = TRANSLATIONS[locale];
  const messages = load ? mergeMessages(ptBR, (await load()).default) : ptBR;

  return { locale, messages };
});
