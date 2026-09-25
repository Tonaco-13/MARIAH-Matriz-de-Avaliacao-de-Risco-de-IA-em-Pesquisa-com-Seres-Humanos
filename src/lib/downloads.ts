/**
 * Arquivos baixáveis da MARIAH (anexos .docx e planilha-modelo .xlsx) e sua
 * versão por idioma (pendência ES-DL, LOG #71).
 *
 * - pt-BR é a versão normativa: sempre o arquivo canônico, sem marcação.
 * - Outros idiomas recebem o arquivo traduzido SÓ depois do parecer do Z
 *   (inclusão do id em TRADUZIDOS[locale]). Enquanto não houver tradução
 *   aprovada, o link aponta para o arquivo pt-BR e a interface mostra
 *   "(en portugués)" ao lado do botão, com hrefLang="pt-BR" (eMAG/WCAG 3.1.2).
 * - Arquivo traduzido: mesmo nome com sufixo "-<locale>" antes da extensão
 *   (ex.: planilha-validacao-local-mariah-es.xlsx).
 */

export const DOWNLOADS = {
  planilha: 'planilha-validacao-local-mariah.xlsx',
  roteiro: 'guia-validacao-local-mariah.docx',
  instrucoesA: 'instrucoes-preenchimento-versao-a-mariah.docx',
  instrucoesB: 'instrucoes-preenchimento-versao-b-mariah.docx',
  notaTecnica: 'nota-tecnica-premissas-mariah.docx',
  suplemento: 'suplemento-salvaguardas-mariah.docx',
} as const;

export type DownloadId = keyof typeof DOWNLOADS;

const CANONICAL_LOCALE = 'pt-BR';

/**
 * Traduções aprovadas pelo Z, por idioma. Vazio = todos os arquivos em pt-BR.
 * es: os 6 aprovados em PARECER_Z_baixaveis-es_2026-09-25 (LOG #73).
 */
const TRADUZIDOS: Readonly<Record<string, ReadonlySet<DownloadId>>> = {
  es: new Set<DownloadId>(['planilha', 'roteiro', 'instrucoesA', 'instrucoesB', 'notaTecnica', 'suplemento']),
};

function isTranslated(id: DownloadId, locale: string): boolean {
  return TRADUZIDOS[locale]?.has(id) ?? false;
}

/** true quando o idioma da página não é pt-BR e o arquivo ainda não tem tradução aprovada. */
export function isDownloadInPt(id: DownloadId, locale: string): boolean {
  return locale !== CANONICAL_LOCALE && !isTranslated(id, locale);
}

/** Caminho público do arquivo para o idioma da página. */
export function downloadHref(id: DownloadId, locale: string): string {
  const file = DOWNLOADS[id];
  if (locale === CANONICAL_LOCALE || !isTranslated(id, locale)) return `/${file}`;
  const dot = file.lastIndexOf('.');
  return `/${file.slice(0, dot)}-${locale}${file.slice(dot)}`;
}

/** Atributos do <a> de download: hrefLang só quando o arquivo está em pt-BR numa página de outro idioma. */
export function downloadLinkProps(id: DownloadId, locale: string): { href: string; hrefLang?: string } {
  return isDownloadInPt(id, locale)
    ? { href: downloadHref(id, locale), hrefLang: CANONICAL_LOCALE }
    : { href: downloadHref(id, locale) };
}
