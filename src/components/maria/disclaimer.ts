// ============================================================
// MARIAH — Disclaimer institucional (fonte única, locale-aware)
// ------------------------------------------------------------
// Centraliza o texto do aviso para que ele nunca divirja entre
// as telas, o PDF de auditoria e o export em texto.
// Ao alterar o texto canônico (pt-BR) ou uma tradução, editar
// SOMENTE aqui.
//
// pt-BR é a versão CANÔNICA e normativa. As traduções (es, …) são
// de cortesia; getCourtesyNotice() devolve o aviso de cortesia que
// deve acompanhá-las (vazio para pt-BR). Acesso sempre via
// getDisclaimer/getNaoSubstitui/getCourtesyNotice, com fallback ao
// canônico pt-BR quando não houver tradução para o locale.
// Glossário i18n: spec/i18n/glossario-es.json (âncoras aprovadas).
// ============================================================

const DEFAULT_LOCALE = 'pt-BR';

/**
 * Aviso completo exibido nos Resultados, no seletor de versão e nos
 * exports (PDF/TXT). Abertura na voz da própria MARIAH: identidade
 * (transparência e explicabilidade), escopo (tríade da Pergunta 1),
 * caráter facultativo, duplo público e ressalvas.
 */
const DISCLAIMER: Record<string, string> = {
  'pt-BR':
    'A MARIAH torna transparente e explicável a avaliação ética de pesquisas de intervenção em seres humanos que utilizam inteligência artificial. Aplica-se aos sistemas que automatizam decisões, geram conteúdo ou intervêm na condução do estudo. Seu preenchimento é facultativo e serve tanto ao pesquisador, na preparação e autoavaliação do protocolo, quanto ao CEP, na análise. Não aprova nem reprova protocolos, não substitui o julgamento do CEP nem dispensa a deliberação colegiada. Versão preliminar: ainda não submetida a validação empírica em casuística real e aguardando validação institucional pelo Ministério da Saúde.',
  es:
    'La MARIAH vuelve transparente y explicable la evaluación ética de investigaciones de intervención en seres humanos que utilizan inteligencia artificial. Se aplica a los sistemas que automatizan decisiones, generan contenido o intervienen en la conducción del estudio. Su cumplimentación es facultativa y sirve tanto al investigador, en la preparación y autoevaluación del protocolo, como al CEP, en el análisis. No aprueba ni reprueba protocolos, no sustituye el juicio del CEP ni exime de la deliberación colegiada. Versión preliminar: aún no sometida a validación empírica en casuística real y a la espera de validación institucional por parte del Ministerio de Salud de Brasil.',
};

/**
 * Cláusula curta de não-substituição, reutilizada em textos narrativos
 * (páginas de Transparência e de Instruções), onde o aviso completo não
 * cabe. Mantém a mesma redação da ressalva do aviso completo ("nem dispensa").
 */
const NAO_SUBSTITUI: Record<string, string> = {
  'pt-BR':
    'A MARIAH não aprova nem reprova protocolos, não substitui o julgamento do CEP nem dispensa a deliberação colegiada.',
  es:
    'La MARIAH no aprueba ni reprueba protocolos, no sustituye el juicio del CEP ni exime de la deliberación colegiada.',
};

/**
 * Aviso de tradução de cortesia: sinaliza que a versão normativa vigente é a
 * pt-BR. Só existe para locales traduzidos; devolve '' para o canônico (pt-BR)
 * e para locales sem entrada, de modo que a UI possa renderizá-lo
 * condicionalmente sem qualquer efeito no pt-BR.
 */
const COURTESY_NOTICE: Record<string, string> = {
  es:
    'Esta es una traducción de cortesía. La versión normativa vigente es la versión en portugués (pt-BR).',
};

/** Aviso completo no locale pedido; fallback ao canônico pt-BR. */
export function getDisclaimer(locale: string): string {
  return DISCLAIMER[locale] ?? DISCLAIMER[DEFAULT_LOCALE];
}

/** Cláusula curta de não-substituição no locale pedido; fallback ao canônico pt-BR. */
export function getNaoSubstitui(locale: string): string {
  return NAO_SUBSTITUI[locale] ?? NAO_SUBSTITUI[DEFAULT_LOCALE];
}

/** Aviso de tradução de cortesia; '' quando não aplicável (pt-BR ou locale sem tradução). */
export function getCourtesyNotice(locale: string): string {
  return COURTESY_NOTICE[locale] ?? '';
}

/**
 * Constantes canônicas (pt-BR) mantidas por retrocompatibilidade e como
 * âncora textual dos scripts/gates. Preferir os getters acima nos componentes.
 */
export const MARIA_DISCLAIMER = DISCLAIMER[DEFAULT_LOCALE];
export const MARIA_NAO_SUBSTITUI = NAO_SUBSTITUI[DEFAULT_LOCALE];
