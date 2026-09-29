# Como contribuir com a MARIAH

A MARIAH integra o conjunto *Guia de Uso Ético de Inteligência Artificial em Pesquisa com Seres Humanos*, aprovado pela Instância Nacional de Ética em Pesquisa (INAEP) em 16/09/2026 ([Voto nº 25/2026](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/reunioes/votos/voto-no-25-2026-13a-reuniao-ordinaria.pdf/view)). A mesma deliberação prevê um período de **seis meses de uso e teste pelos CEPs**, com **consulta à sociedade** no mesmo período. As contribuições recebidas serão sistematizadas para a proposta de versão 2.0, que será submetida ao Colegiado da INAEP.

## Contribuições sobre o conteúdo da matriz

As sugestões sobre perguntas, pesos, pontos de corte, redação ou aplicabilidade são bem-vindas:

- pelos canais oficiais da consulta à sociedade divulgados pela INAEP;
- ou pelo e-mail da CGREP: **cgrep@saude.gov.br**.

As contribuições externas têm **caráter informativo** e não vinculam as decisões da INAEP. Mudanças no conteúdo da matriz só entram por deliberação do Colegiado.

Os CEPs que aplicarem o protocolo de Validação Local podem compartilhar seus resultados conforme descrito na Seção de Validação Local do documento MARIAH.

## Contribuições técnicas (código)

Correções de defeitos, melhorias de acessibilidade e de documentação podem ser propostas por *pull request*:

1. Não altere cálculo, pontos de corte, ids ou versão da matriz: a fonte única é [`spec/mariah-spec.json`](spec/mariah-spec.json), e mudanças nela dependem de deliberação.
2. O português (pt-BR) é a versão normativa. Traduções são de cortesia e seguem o glossário em [`spec/i18n/`](spec/i18n/).
3. Rode a cadeia de verificação completa antes de abrir o PR (ver [`README.md`](README.md#verificação)).
4. Não inclua dados pessoais, dados de protocolos reais ou capturas de tela com informações de terceiros (LGPD).

Todo PR é revisado pela equipe responsável antes da incorporação.

## Falhas de segurança

Não abra uma *issue* pública para relatar falhas de segurança. Siga o [`SECURITY.md`](SECURITY.md).
