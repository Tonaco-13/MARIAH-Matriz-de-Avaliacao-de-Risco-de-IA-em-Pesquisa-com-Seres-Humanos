# MARIAH — Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos

**Desenvolvido pelo Ministério da Saúde** (Decit/SCTIE) para o Sistema Nacional de Ética em Pesquisa com Seres Humanos (SINEP).

- **Aplicação:** https://mariah-inaep.vercel.app (português; versão em espanhol como tradução de cortesia em `/es`)
- **Versão da matriz:** Beta 1 (2.2.0)
- **Status:** o *Guia de Uso Ético de Inteligência Artificial em Pesquisa com Seres Humanos*, o Caderno Referencial e a MARIAH foram aprovados pela Instância Nacional de Ética em Pesquisa (INAEP) em 16/09/2026 e estão em revisão editorial para publicação.
- **Licença:** Licença Pública Geral do Software Público Brasileiro (LPG-SPB), versão 1.0 — ver [`LICENSE`](LICENSE).

## O que é

A MARIAH apoia pesquisadores e Comitês de Ética em Pesquisa (CEP) na avaliação ética de pesquisas de intervenção em seres humanos que utilizam inteligência artificial — sistemas que automatizam decisões, geram conteúdo ou intervêm na condução do estudo. Oferece duas versões complementares:

- **Versão A (qualitativa):** cinco eixos temáticos, mais o Eixo 3.b quando há banco de dados (Res. CNS n.º 738/2024).
- **Versão B (quantitativa):** sete blocos com pontuação, mais o Bloco 6.b quando há banco de dados.

O preenchimento é facultativo. **A MARIAH não aprova nem reprova protocolos, não substitui o julgamento do CEP nem dispensa a deliberação colegiada.**

## Privacidade (LGPD)

A aplicação não tem banco de dados nem servidor de coleta: as respostas ficam **apenas no navegador** de quem preenche (armazenamento local do dispositivo) e não são enviadas a nenhum servidor. Relatórios e arquivos exportados são gerados no próprio navegador.

## Documentos

Os anexos publicados (instruções de preenchimento das Versões A e B, roteiro e planilha-modelo de Validação Local, nota técnica de premissas e suplemento de salvaguardas) estão em [`public/`](public/) e são baixáveis pela aplicação. As versões com sufixo `-es` são traduções de cortesia; a versão normativa é a em português.

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

## Contato

Observações e críticas técnicas: CGREP — cgrep@saude.gov.br.
