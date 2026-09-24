import { defineRouting } from "next-intl/routing";

/**
 * Configuração de roteamento i18n (dark-launch, feat/i18n-architecture).
 *
 * - localePrefix "as-needed": pt-BR (padrão) SEM prefixo (`/`, `/instrucoes`…);
 *   demais idiomas com prefixo (`/es/...`). Preserva as URLs pt-BR atuais.
 * - localeDetection false: locale resolvido SÓ pela URL. Sem redirecionar `/`
 *   para `/en` por Accept-Language — pt-BR é servido a todos, como hoje.
 * - localeCookie false: nenhum cookie NEXT_LOCALE é gravado (nada muda; LGPD).
 * - alternateLinks false: sem header Link/hreflang nesta branch (memo B9).
 *
 * Regra de ouro (B7): estes locales são apenas rótulos de idioma; nenhum
 * número, peso, corte, id de questão ou matrixVersion deriva daqui.
 */
export const routing = defineRouting({
  locales: ["pt-BR", "es", "en", "de", "fr", "zh"],
  defaultLocale: "pt-BR",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
