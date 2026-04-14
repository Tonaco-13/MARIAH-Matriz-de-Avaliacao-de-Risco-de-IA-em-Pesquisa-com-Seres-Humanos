# TICKET D — PDF de Auditoria Completo

## Prioridade: CRÍTICA (apresentação ao MS)
## Tipo: Feature

## Contexto
O relatório em PDF é o produto final da avaliação MARA — o documento que um CEP anexa ao processo do protocolo. Atualmente a exportação usa window.print() sobre HTML, o que gera PDFs inconsistentes e sem controle de layout. Precisamos de um PDF real, profissional e auditável.

## O que fazer

### 1. Instalar jspdf
bun add jspdf

Nota: NÃO usar jspdf-autotable — as tabelas são simples o suficiente para construir manualmente com jspdf. Menos dependências = menos risco.

### 2. Criar função generatePDF() em utils.ts
Criar generatePDF() que produz um documento com as seguintes seções:

CABEÇALHO:
- MARA — Matriz de Avaliação de Risco Algorítmico
- Título do projeto (campo titulo do contextAnswers)
- Instituição e CEP (campos instituicao e cep_nome)
- Versão: A — Qualitativa ou B — Quantitativa
- Data: DD/MM/AAAA HH:MM

CONTEXTO DE USO:
- C1: Resposta descritiva (contexto1)
- C2: Resposta descritiva (contexto2)

RESULTADO PRINCIPAL:
- Nível de risco em destaque (I/II/III/IV) com descrição
- Se Cláusula de Prevalência Ética ativada: aviso em vermelho

DETALHAMENTO (Versão A):
Para cada eixo:
- Nome do eixo
- Respostas de risco: X/Y
- Nível do eixo
Regra de consolidação: nível final = mais alto

DETALHAMENTO (Versão B):
Para cada bloco:
- Nome do bloco
- Pontuação: X/Y pts
Pontuação total: X/238
Faixas: I (0-50), II (51-110), III (111-180), IV (181-238)

REGISTRO COMPLETO DE RESPOSTAS:
Listar TODAS as respostas dadas pelo avaliador em formato tabular:
Questão | Resposta | Risco? | Pontos (Versão B)
Esta seção é essencial para auditoria — permite verificar cada resposta individualmente.

REQUISITOS CUMULATIVOS:
Lista de requisitos por nível, marcando quais se aplicam ao nível encontrado.

DISCLAIMER:
"A MARA não aprova nem reprova protocolos. Não substitui o julgamento do CEP. Não dispensa a deliberação colegiada."

RODAPÉ:
"MARA — Matriz de Avaliação de Risco Algorítmico" com data de geração.
Número de página em cada folha.

### 3. Estilo do PDF
- Fonte: Helvetica (built-in do jspdf, não precisa de fonte externa)
- Cores: tons de cinza para o corpo, colorido apenas no nível de risco
  - Nível I: verde (#15803d)
  - Nível II: âmbar (#b45309)
  - Nível III: laranja (#c2410c)
  - Nível IV: vermelho (#dc2626)
- Margens: 20mm
- Quebra de página automática entre seções longas

### 4. Atualizar botões no Results.tsx
Substituir o botão atual por dois:
- "Baixar PDF" (primário) — chama generatePDF() e faz download
- "Imprimir" (secundário/outline) — mantém o window.print() com HTML como fallback

Nome do arquivo: MARA_{titulo_do_projeto}_{YYYY-MM-DD}.pdf
(sanitizar título: remover caracteres especiais, substituir espaços por _)

### 5. Parâmetros da função
A função generatePDF recebe:
- version: A ou B
- contextAnswers: Record<string, string> (inclui titulo, instituicao, cep_nome, contexto1, contexto2)
- qualitativeAnswers: QualitativeAnswer
- quantitativeAnswers: QuantitativeAnswer

A função gera o PDF e faz download automaticamente (não retorna nada).

## IMPORTANTE
- O PDF deve incluir TODAS as respostas (não só o resumo). Isso é auditoria.
- Se o título do projeto não foi preenchido (fallback), usar "Sem título" no nome do arquivo.
- Testar com cenários de texto longo nas respostas descritivas (quebra de linha).

## Critérios de aceite
- [ ] Botão "Baixar PDF" gera e baixa um arquivo .pdf real
- [ ] PDF contém: identificação (título, instituição, CEP), contexto, resultado, detalhamento por eixo/bloco, registro completo de respostas, requisitos, disclaimer
- [ ] Cores de nível de risco visíveis no PDF
- [ ] Cláusula de Prevalência Ética destacada quando ativada
- [ ] Nome do arquivo contém título do projeto e data
- [ ] PDF tem múltiplas páginas quando necessário (quebra automática)
- [ ] Funciona em Chrome, Firefox e Safari
- [ ] bun run build e bun run lint passam

## Arquivos envolvidos
- package.json (jspdf)
- src/components/mara/utils.ts (generatePDF)
- src/components/mara/Results.tsx (botões)
