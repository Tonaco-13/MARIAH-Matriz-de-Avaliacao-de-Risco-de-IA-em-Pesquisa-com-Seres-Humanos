# TICKET 03 — Exportação PDF Nativa

## Prioridade: Alta
## Tipo: Feature

## Contexto
Atualmente a "exportação" do relatório é feita abrindo uma nova aba com HTML e chamando `window.print()`. Isso depende do navegador do usuário e gera PDFs inconsistentes. A MARA precisa gerar um PDF real, padronizado, com layout profissional — é um documento que será anexado a processos de avaliação ética.

## O que fazer

### 1. Instalar biblioteca de geração de PDF
Opção recomendada: `jspdf` + `jspdf-autotable` (leve, client-side, sem dependência de servidor).
Alternativa: `@react-pdf/renderer` (mais poderoso, mas mais pesado).

Usar `jspdf` por ser mais simples e client-side:
```bash
bun add jspdf jspdf-autotable
```

### 2. Criar função generatePDF() em utils.ts
Criar uma nova função `generatePDF()` que:
- Gere um PDF com layout profissional
- Cabeçalho: "MARA — Matriz de Avaliação de Risco Algorítmico" com logo
- Metadados: versão (A ou B), data/hora da avaliação
- Seção "Caracterização do Contexto" com as respostas descritivas
- Resultado principal: nível de risco com destaque visual (cor)
- Detalhamento por eixo (Versão A) ou por bloco (Versão B), com pontuações
- Se Cláusula de Prevalência Ética ativada: destaque em vermelho
- Requisitos cumulativos por nível
- Disclaimer: "A MARA não aprova nem reprova protocolos..."
- Rodapé com data de geração

### 3. Atualizar botão no Results.tsx
- Manter o botão "Imprimir / Salvar PDF"
- Trocar a ação para chamar `generatePDF()` e fazer download automático
- Nome do arquivo: `MARA_Avaliacao_VersaoX_YYYY-MM-DD.pdf`
- Manter opção de impressão como secundária (botão separado ou menu dropdown)

### 4. Manter generateReportHTML() como fallback
Não remover a função existente — ela pode ser útil como preview ou para navegadores sem suporte.

## Critérios de aceite
- [ ] Botão gera e baixa um PDF real (não depende de window.print)
- [ ] PDF contém todas as seções: contexto, resultado, detalhamento, requisitos, disclaimer
- [ ] PDF tem layout profissional e legível
- [ ] Nome do arquivo segue padrão: MARA_Avaliacao_VersaoX_YYYY-MM-DD.pdf
- [ ] Funciona em Chrome, Firefox e Safari
- [ ] `bun run lint` e `bun run build` passam

## Arquivos envolvidos
- `package.json` (nova dependência)
- `src/components/mara/utils.ts` (nova função generatePDF)
- `src/components/mara/Results.tsx` (botão atualizado)
