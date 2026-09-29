/**
 * Documentos oficiais publicados pela INAEP (LOG #78).
 * Fonte única dos links: páginas Instruções, Validação e Transparência e card de
 * Validação Local da tela de resultados. Os documentos oficiais existem só em
 * pt-BR; em outros idiomas o link recebe o marcador "(en portugués)" e hrefLang.
 */
export const DOCUMENTOS_OFICIAIS = [
  {
    id: 'guia',
    href: 'https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/publicacoes/guia-de-uso-etico-de-inteligencia-artificial-em-pesquisa-com-seres-humanos.pdf/view',
  },
  {
    id: 'caderno',
    href: 'https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/publicacoes/caderno-referencial.pdf/view',
  },
  {
    id: 'guiaMariah',
    href: 'https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/publicacoes/guia-de-uso-da-matriz-de-avaliacao-de-risco-em-inteligencia-artificial-em-pesquisa-com-seres-humanos-mariah.pdf/view',
  },
  {
    id: 'voto',
    href: 'https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/reunioes/votos/voto-no-25-2026-13a-reuniao-ordinaria.pdf/view',
  },
] as const;

export type DocumentoOficialId = (typeof DOCUMENTOS_OFICIAIS)[number]['id'];
