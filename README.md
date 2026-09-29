# MARIAH — Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos

**Desenvolvido pelo Ministério da Saúde** (Decit/SCTIE) para o Sistema Nacional de Ética em Pesquisa com Seres Humanos (SINEP).

- **Aplicação:** https://mariah-inaep.vercel.app (português; versão em espanhol como tradução de cortesia em `/es`)
- **Versão da matriz:** Beta 1 (2.2.0)
- **Status:** o *Guia de Uso Ético de Inteligência Artificial em Pesquisa com Seres Humanos*, o Caderno Referencial e a MARIAH foram aprovados por unanimidade pela Instância Nacional de Ética em Pesquisa (INAEP) na 13ª Reunião Ordinária, em 16/09/2026 ([Voto nº 25/2026](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/reunioes/votos/voto-no-25-2026-13a-reuniao-ordinaria.pdf/view)). Os documentos foram publicados em 25/09/2026. A MARIAH está disponível aos CEPs para **uso e teste por seis meses**, com consulta à sociedade no mesmo período. As contribuições serão sistematizadas para a versão 2.0.
- **Licença:** Licença Pública Geral do Software Público Brasileiro (LPG-SPB), versão 1.0 — ver [`LICENSE`](LICENSE).

## O que é

A MARIAH apoia pesquisadores e Comitês de Ética em Pesquisa (CEP) na avaliação ética de pesquisas de intervenção em seres humanos que utilizam inteligência artificial — sistemas que automatizam decisões, geram conteúdo ou intervêm na condução do estudo. Oferece duas versões complementares:

- **Versão A (qualitativa):** cinco eixos temáticos, mais o Eixo 3.b quando há banco de dados (Res. CNS n.º 738/2024).
- **Versão B (quantitativa):** sete blocos com pontuação, mais o Bloco 6.b quando há banco de dados.

O preenchimento é facultativo. **A MARIAH não aprova nem reprova protocolos, não substitui o julgamento do CEP nem dispensa a deliberação colegiada.**

## Privacidade (LGPD)

A aplicação não tem banco de dados nem servidor de coleta: as respostas ficam **apenas no navegador** de quem preenche (armazenamento local do dispositivo) e não são enviadas a nenhum servidor. Relatórios e arquivos exportados são gerados no próprio navegador.

## Documentos oficiais

Publicados pela INAEP:

- [Guia de uso ético de inteligência artificial em pesquisa com seres humanos](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/publicacoes/guia-de-uso-etico-de-inteligencia-artificial-em-pesquisa-com-seres-humanos.pdf/view)
- [Caderno referencial: fundamentos éticos, científicos, normativos e metodológicos](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/publicacoes/caderno-referencial.pdf/view)
- [Guia de uso da MARIAH](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/publicacoes/guia-de-uso-da-matriz-de-avaliacao-de-risco-em-inteligencia-artificial-em-pesquisa-com-seres-humanos-mariah.pdf/view)

Deliberação da 13ª Reunião Ordinária da INAEP (16/09/2026):

- [Voto nº 25/2026-INAEP/DECIT/SCTIE/MS](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/reunioes/votos/voto-no-25-2026-13a-reuniao-ordinaria.pdf/view)
- [Extrato de deliberação](https://www.gov.br/saude/pt-br/composicao/orgaos-colegiados/inaep/reunioes/extratos/extrato-de-deliberacao-da-inaep-13a-reuniao-ordinaria-2026.pdf/view)

### Anexos da aplicação

Os anexos da aplicação (instruções de preenchimento das Versões A e B, roteiro e planilha-modelo de Validação Local, nota técnica de premissas e suplemento de salvaguardas) estão em [`public/`](public/) e são baixáveis pela aplicação. As versões com sufixo `-es` são traduções de cortesia; a versão normativa é a em português.

## Autoria e desenvolvimento

A MARIAH foi elaborada pelo Grupo de Trabalho temporário constituído pela INAEP, sob a coordenação do Prof. Fabiano Tonaco Borges (Decit/SCTIE/MS). Integraram o GT: Alexandre Dias Porto Chiavegatto Filho, Fábio de Oliveira Aquino, Felipe de Oliveira Franco, Luiz Vianna Sobrinho, Maíra Araújo de Santana, Wellington Pinheiro dos Santos e Roseli Mieko Yamamoto Nomura. O apoio administrativo coube à Secretaria-Executiva da INAEP e à CGREP/Decit/SCTIE/MS.

O software foi desenvolvido sob coordenação humana, com apoio de assistentes de inteligência artificial na programação, na tradução e na revisão. O conteúdo da matriz (perguntas, pesos, pontos de corte e regras) é o aprovado pela INAEP. Todo cálculo é conferido automaticamente contra a especificação e contra vetores de teste independentes (ver [Verificação](#verificação)).

**Como citar:** use o botão *Cite this repository*, gerado a partir de [`CITATION.cff`](CITATION.cff).

## Rodar localmente

Requer Node.js 20+.

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Verificação

Toda mudança passa pela cadeia abaixo antes do merge (parte dela roda também no CI, em `.github/workflows/`):

```bash
npm run build
npm run verify                    # estrutura, cortes, efeitos, cobertura da matriz
npm run parity                    # enunciados da spec × guia
npm run gate                      # vetores de cálculo + guardas de i18n
npm run i18n:key-parity:strict    # completude das traduções
npm run parity:locale             # pt-BR idêntico à baseline de referência
```

A matriz (números, pesos, cortes, ids e versão) tem uma fonte única: [`spec/mariah-spec.json`](spec/mariah-spec.json). Detalhes de manutenção em [`MAINTENANCE.md`](MAINTENANCE.md); histórico em [`CHANGELOG.md`](CHANGELOG.md).

## Contribuições e contato

Sugestões e críticas técnicas são bem-vindas, com caráter informativo: veja [`CONTRIBUTING.md`](CONTRIBUTING.md). Falhas de segurança: [`SECURITY.md`](SECURITY.md). Contato: CGREP — cgrep@saude.gov.br.
