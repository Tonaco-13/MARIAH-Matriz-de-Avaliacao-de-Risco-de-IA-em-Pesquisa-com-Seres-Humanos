// ============================================================
// MARA - Matriz de Avaliação de Risco Algorítmico
// Data definitions, types, and scoring rules
// ============================================================

// ----- Types -----

export type MarcaVersion = 'A' | 'B';

export type RiskLevel = 'I' | 'II' | 'III' | 'IV';

export type RiskLevelInfo = {
  level: RiskLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
};

export type QualitativeQuestion = {
  id: string;
  pergunta: string;
  riskAnswer: 'sim' | 'nao';
  dica: string;
  /** Quando true, a resposta de risco torna o protocolo NÃO AVALIÁVEL no mérito (§7.3.6 / Res 738). */
  eliminatorio?: boolean;
  /**
   * Quando true, a questão aceita uma terceira resposta "Não se aplica" (N/A),
   * tratada como não-risco e não-eliminatória. Usado em questões condicionais
   * onde a pergunta só faz sentido se certa premissa estiver presente
   * (ex.: 3.b.2 — Termo de Anuência só se aplica se o banco for constituído
   * fora do âmbito da pesquisa).
   */
  hasNaOption?: boolean;
};

export type QualitativeAxis = {
  id: string;
  nome: string;
  descricao: string;
  questoes: QualitativeQuestion[];
  /**
   * Quando true, este eixo só é aplicado se o protocolo usa banco de dados
   * (filtro do Passo 0, conforme Res. CNS n.º 738/2024).
   */
  condicionalBancoDados?: boolean;
  /**
   * Regra de elevação específica (Eixo 3.b não segue a regra geral 0→I / 1-2→II / 3-4→III / 5+→IV;
   * usa 0→não eleva / 1-2→III / 3+→IV).
   */
  elevacaoEspecial?: 'banco-dados';
  /** Referência normativa (Res 738, LGPD, etc.) exibida no cabeçalho do eixo. */
  referenciaNormativa?: string;
};

export type QuantitativeQuestion = {
  id: string;
  pergunta: string;
  riskAnswer: 'sim' | 'nao';
  pontos: number;
  dica: string;
  efeito?: 'risco' | 'mitigacao';
  /** Quando true, a resposta de risco torna o protocolo NÃO AVALIÁVEL no mérito (§7.3.6 / Res 738). */
  eliminatorio?: boolean;
  /**
   * Quando true, a questão aceita uma terceira resposta "Não se aplica" (N/A),
   * tratada como não-risco e não-eliminatória. Usado em questões condicionais
   * onde a pergunta só faz sentido se certa premissa estiver presente
   * (ex.: P6.b.2 — só se aplica se o banco é constituído fora do âmbito da pesquisa).
   */
  hasNaOption?: boolean;
};

export type QuantitativeBlock = {
  id: string;
  nome: string;
  descricao: string;
  subtitulo?: string;
  questoes: QuantitativeQuestion[];
  maxPontos: number;
  /**
   * Quando true, este bloco só é aplicado se o protocolo usa banco de dados
   * (filtro do Passo 0, conforme Res. CNS n.º 738/2024). Seus pontos SOMAM ao bloco base.
   */
  condicionalBancoDados?: boolean;
  /** Referência normativa (Res 738, LGPD, etc.) exibida no cabeçalho do bloco. */
  referenciaNormativa?: string;
};

export type Requirement = {
  id: string;
  texto: string;
  nivel: RiskLevel;
};

// ----- Risk Level Definitions -----

export const RISK_LEVELS: Record<RiskLevel, RiskLevelInfo> = {
  I: {
    level: 'I',
    label: 'Baixo',
    color: '#22c55e',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    description: 'Risco baixo — requisitos mínimos de documentação e transparência.',
  },
  II: {
    level: 'II',
    label: 'Moderado',
    color: '#f59e0b',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    description: 'Risco moderado — exige descrição do sistema e conformidade com a LGPD.',
  },
  III: {
    level: 'III',
    label: 'Alto',
    color: '#f97316',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    description: 'Risco alto — exige validação técnica, análise por subgrupos e supervisão humana efetiva.',
  },
  IV: {
    level: 'IV',
    label: 'Crítico',
    color: '#ef4444',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    description: 'Risco crítico — exige parecer técnico externo, monitoramento contínuo e notificação à ANVISA quando aplicável.',
  },
};

// ----- Qualitative Matrix (Version A) -----

export const QUALITATIVE_AXES: QualitativeAxis[] = [
  {
    id: 'eixo1',
    nome: 'Eixo 1: Natureza e Autonomia do Sistema',
    descricao: 'Avalia o grau de autonomia do sistema, sua capacidade adaptativa e os riscos associados à sua natureza técnica.',
    questoes: [
      {
        id: '1.1',
        pergunta: 'O sistema toma decisões ou emite recomendações sem intervenção humana obrigatória antes da execução?',
        riskAnswer: 'sim',
        dica: 'Sistemas que operam sem revisão humana obrigatória antes da execução aumentam o risco, pois não há barreira de segurança entre a recomendação algorítmica e a ação sobre o participante.',
      },
      {
        id: '1.2',
        pergunta: 'O sistema é adaptativo — aprende ou se atualiza com novos dados após o início do estudo?',
        riskAnswer: 'sim',
        dica: 'Sistemas adaptativos podem mudar seu comportamento ao longo do estudo, introduzindo incerteza sobre os resultados que serão gerados.',
      },
      {
        id: '1.3',
        pergunta: 'Em caso de falha ou erro do sistema, o dano ao participante seria de difícil reversão?',
        riskAnswer: 'sim',
        dica: 'Danos de difícil reversão (ex.: intervenção cirúrgica incorreta) representam risco maior do que danos reversíveis.',
      },
      {
        id: '1.4',
        pergunta: 'O sistema foi desenvolvido e validado fora do contexto em que será utilizado neste protocolo?',
        riskAnswer: 'sim',
        dica: 'Sistemas desenvolvidos em contextos diferentes podem não ter desempenho adequado na população ou cenário do protocolo.',
      },
      {
        id: '1.5',
        pergunta: 'O profissional responsável tem acesso às informações necessárias para contestar a recomendação do sistema?',
        riskAnswer: 'nao',
        dica: 'Se o profissional não consegue acessar as informações para contestar o sistema, sua supervisão é apenas simbólica, sem eficácia real.',
      },
      {
        id: '1.6',
        pergunta: 'O protocolo define claramente o que acontece quando a decisão do sistema diverge do julgamento humano?',
        riskAnswer: 'nao',
        dica: 'A ausência de definição sobre divergências cria zona cinzenta de responsabilidade que pode prejudicar o participante.',
      },
      {
        id: '1.7',
        pergunta: 'O sistema é explicável — é possível compreender por que chegou a determinado resultado?',
        riskAnswer: 'nao',
        dica: 'Sistemas opacos (caixa-preta) dificultam a identificação de vieses, erros e a responsabilização.',
      },
      {
        id: '1.8',
        pergunta: 'O sistema foi submetido a testes de desempenho documentados antes do uso no protocolo?',
        riskAnswer: 'nao',
        dica: 'A ausência de testes prévios significa que não há evidência de segurança e eficácia do sistema no contexto proposto.',
      },
    ],
  },
  {
    id: 'eixo2',
    nome: 'Eixo 2: Impacto sobre a Pessoa Participante',
    descricao: 'Avalia os potenciais danos físicos, psíquicos, sociais e econômicos ao participante, bem como a proteção de populações vulneráveis.',
    questoes: [
      {
        id: '2.1',
        pergunta: 'O sistema influencia diretamente decisões clínicas ou terapêuticas sobre o participante?',
        riskAnswer: 'sim',
        dica: 'Influência direta em decisões clínicas implica maior potencial de dano em caso de erro do sistema.',
      },
      {
        id: '2.2',
        pergunta: 'O sistema pode causar dano físico ao participante em caso de erro?',
        riskAnswer: 'sim',
        dica: 'Danos físicos são os mais graves e exigem mecanismos robustos de segurança.',
      },
      {
        id: '2.3',
        pergunta: 'O sistema pode causar dano psíquico, social ou econômico ao participante em caso de erro?',
        riskAnswer: 'sim',
        dica: 'Danos não físicos também são relevantes, especialmente quando afetam a vida social ou econômica do participante.',
      },
      {
        id: '2.4',
        pergunta: 'O protocolo envolve populações vulneráveis: crianças, gestantes, idosos, pessoas com deficiência, povos indígenas ou comunidades em situação de vulnerabilidade socioeconômica?',
        riskAnswer: 'sim',
        dica: 'Populações vulneráveis exigem proteção adicional, pois podem ter menor capacidade de contestar decisões ou compreender os riscos.',
      },
      {
        id: '2.5',
        pergunta: 'O sistema infere características sensíveis do participante: raça/cor, etnia, condição de saúde, orientação sexual, que não foram explicitamente coletadas?',
        riskAnswer: 'sim',
        dica: 'Inferência de características sensíveis sem coleta explícita viola a autonomia do participante e pode gerar discriminação.',
      },
      {
        id: '2.6',
        pergunta: 'Os efeitos de um erro do sistema sobre o participante são reversíveis?',
        riskAnswer: 'nao',
        dica: 'Efeitos irreversíveis aumentam significativamente o risco, pois não há possibilidade de reparação integral.',
      },
      {
        id: '2.7',
        pergunta: 'O TCLE informa ao participante, de forma compreensível, que um sistema de IA será utilizado no protocolo e qual é o seu papel?',
        riskAnswer: 'nao',
        dica: 'A ausência de informação clara no TCLE viola o princípio de autonomia e transparência.',
      },
      {
        id: '2.8',
        pergunta: 'O protocolo prevê mecanismo para que o participante solicite a exclusão de seus dados do processo de treinamento ou retreinamento do modelo?',
        riskAnswer: 'nao',
        dica: 'Sem mecanismo de exclusão, o participante perde o controle sobre seus dados após o consentimento.',
      },
      {
        id: '2.9',
        pergunta: 'O protocolo descreve como os resultados gerados pela IA serão comunicados ao participante, quando aplicável?',
        riskAnswer: 'nao',
        dica: 'A comunicação dos resultados é essencial para a transparência e para o exercício da autonomia do participante.',
      },
    ],
  },
  {
    id: 'eixo3',
    nome: 'Eixo 3: Sensibilidade e Governança dos Dados',
    descricao: 'Avalia o grau de sensibilidade dos dados processados, a conformidade com a LGPD e os mecanismos de proteção de dados.',
    questoes: [
      {
        id: '3.1',
        pergunta: 'O sistema processa dados pessoais sensíveis: saúde, genética, biometria, raça/cor, etnia, religião, vida sexual?',
        riskAnswer: 'sim',
        dica: 'Dados sensíveis exigem proteção reforçada e base legal específica conforme a LGPD.',
      },
      {
        id: '3.2',
        pergunta: 'Os dados são transferidos ou processados em servidores fora do Brasil?',
        riskAnswer: 'sim',
        dica: 'Transferência internacional de dados exige avaliação de adequação e salvaguardas adicionais.',
      },
      {
        id: '3.3',
        pergunta: 'O consentimento obtido cobre explicitamente o uso dos dados para treinamento ou retreinamento de modelos de IA?',
        riskAnswer: 'nao',
        dica: 'Consentimento genérico não é suficiente para uso de dados em IA; é necessário consentimento específico e informado.',
      },
      {
        id: '3.4',
        pergunta: 'O protocolo demonstra conformidade com a LGPD: base legal identificada, finalidade declarada, Encarregado de Dados (DPO) indicado?',
        riskAnswer: 'nao',
        dica: 'A não conformidade com a LGPD expõe participantes e instituição a riscos legais e éticos.',
      },
      {
        id: '3.5',
        pergunta: 'Existe risco real de reidentificação dos participantes a partir dos dados utilizados ou gerados pelo sistema?',
        riskAnswer: 'sim',
        dica: 'A reidentificação pode causar danos significativos à privacidade e segurança dos participantes.',
      },
      {
        id: '3.6',
        pergunta: 'O protocolo prevê plano de resposta a incidentes de segurança envolvendo os dados processados pela IA?',
        riskAnswer: 'nao',
        dica: 'Sem plano de resposta, incidentes de segurança podem não ser tratados adequadamente, agravando os danos.',
      },
      {
        id: '3.7',
        pergunta: 'Os dados de treinamento do modelo foram coletados com consentimento compatível com o uso previsto neste protocolo?',
        riskAnswer: 'nao',
        dica: 'Dados coletados para outra finalidade podem não ter base legal para uso em IA, caracterizando uso inadequado.',
      },
      {
        id: '3.8',
        pergunta: 'O protocolo descreve como os dados serão armazenados, por quanto tempo e como serão descartados ao final do estudo?',
        riskAnswer: 'nao',
        dica: 'A ausência de política de retenção e descarte pode levar ao uso indevido dos dados após o estudo.',
      },
    ],
  },
  // ----- Eixo 3.b: BANCOS DE DADOS (Res. CNS n.º 738/2024) -----
  // Condicional: só aplicado quando o protocolo usa banco de dados (filtro Passo 0).
  // Regra de elevação: 0 → não eleva; 1-2 → III; 3+ → IV. Eliminatório em 3.b.2.
  {
    id: 'eixo3b',
    nome: 'Eixo 3.b: Bancos de Dados de Pesquisa (Res. CNS n.º 738/2024)',
    descricao: 'Subseção aplicável quando o protocolo utiliza bancos de dados (próprios, de outra pesquisa ou de instituição externa). Deriva da Resolução CNS n.º 738/2024 e complementa o Eixo 3. Pode elevar o nível consolidado do protocolo.',
    condicionalBancoDados: true,
    elevacaoEspecial: 'banco-dados',
    referenciaNormativa: 'Resolução CNS n.º 738/2024',
    questoes: [
      {
        id: '3.b.1',
        pergunta: 'O protocolo identifica o Controlador do banco de dados (Art. 3.º, IV da Res. CNS n.º 738/2024), com cargo, função e instituição vinculada?',
        riskAnswer: 'nao',
        dica: 'Sem identificação do Controlador (Arts. 3.º IV e 9.º), não há cadeia de custódia formalizada sobre os dados. Cargo, função e instituição devem estar explícitos.',
      },
      {
        id: '3.b.2',
        pergunta: 'Se o banco é constituído fora do âmbito da pesquisa: há Termo de Anuência Institucional (Art. 27, VI) assinado pelo dirigente da instituição detentora dos dados?',
        riskAnswer: 'nao',
        eliminatorio: true,
        hasNaOption: true,
        dica: 'ELIMINATÓRIO. A ausência do Termo de Anuência Institucional em banco externo configura ausência de cadeia de custódia formalizada — o protocolo não é avaliável no mérito e segue para diligência obrigatória (§7.3.6). Marque "Não se aplica" se o banco é constituído dentro do âmbito desta pesquisa (não há instituição externa detentora).',
      },
      {
        id: '3.b.3',
        pergunta: 'O Termo de Compromisso de Uso de Dados (Arts. 24, V e 27, V), assinado pelos pesquisadores, consta do dossiê do protocolo?',
        riskAnswer: 'nao',
        dica: 'Os pesquisadores devem assinar Termo de Compromisso de Uso de Dados, assumindo responsabilidade sobre finalidade, confidencialidade e descarte.',
      },
      {
        id: '3.b.4',
        pergunta: 'Se há pedido de dispensa de TCLE para uso futuro de dados: o enquadramento é fundamentado em uma das cinco situações do Art. 20 da Res. CNS n.º 738/2024?',
        riskAnswer: 'nao',
        dica: 'A dispensa de TCLE para uso futuro só é legítima quando enquadrada em uma das cinco hipóteses taxativas do Art. 20 da Res. 738/2024. Enquadramento genérico não é suficiente.',
      },
      {
        id: '3.b.5',
        pergunta: 'Se o protocolo é multicêntrico ou envolve mais de uma instituição: a controladoria conjunta está formalizada em Termo de Acordo Institucional (Art. 3.º, XVI e §2.º do Art. 12)?',
        riskAnswer: 'nao',
        dica: 'Pesquisas multicêntricas exigem Termo de Acordo Institucional formalizando a controladoria conjunta dos dados, conforme Art. 3.º XVI.',
      },
    ],
  },
  {
    id: 'eixo4',
    nome: 'Eixo 4: Representatividade e Transferibilidade',
    descricao: 'Avalia se os dados de treinamento representam adequadamente a população-alvo e se o modelo foi validado no contexto de uso.',
    questoes: [
      {
        id: '4.1',
        pergunta: 'Os dados de treinamento do modelo incluem representação adequada da diversidade da população-alvo deste protocolo — raça/cor, etnia, gênero, faixa etária, região geográfica?',
        riskAnswer: 'nao',
        dica: 'Falta de representatividade nos dados de treinamento pode levar a resultados enviesados e discriminatórios.',
      },
      {
        id: '4.2',
        pergunta: 'O modelo foi desenvolvido fora do Brasil para uso em população brasileira sem validação local documentada?',
        riskAnswer: 'sim',
        dica: 'Modelos desenvolvidos em outros contextos podem não ser adequados para a população brasileira.',
      },
      {
        id: '4.3',
        pergunta: 'O protocolo apresenta avaliação de desempenho do modelo por subgrupos populacionais relevantes?',
        riskAnswer: 'nao',
        dica: 'Sem avaliação por subgrupos, não é possível identificar disparidades de desempenho que podem afetar populações específicas.',
      },
      {
        id: '4.4',
        pergunta: 'O modelo foi treinado predominantemente em dados de populações de alta renda ou de países do hemisfério norte?',
        riskAnswer: 'sim',
        dica: 'Dados de populações de alta renda podem não representar a realidade socioeconômica e epidemiológica brasileira.',
      },
      {
        id: '4.5',
        pergunta: 'O protocolo descreve os dados usados no treinamento do modelo: origem, período de coleta, critérios de inclusão e exclusão?',
        riskAnswer: 'nao',
        dica: 'A transparência sobre os dados de treinamento é essencial para avaliar a qualidade e representatividade do modelo.',
      },
      {
        id: '4.6',
        pergunta: 'Os dados de teste do modelo são independentes dos dados de treinamento?',
        riskAnswer: 'nao',
        dica: 'Dados de teste não independentes podem superestimar o desempenho do modelo.',
      },
      {
        id: '4.7',
        pergunta: 'O protocolo prevê monitoramento de degradação de desempenho do modelo ao longo do tempo (deriva de dados - data drift) caso seja utilizado em contexto de aplicação continuada?',
        riskAnswer: 'nao',
        dica: 'Sem monitoramento de deriva, o modelo pode degradar sem que a equipe perceba, gerando resultados cada vez menos confiáveis.',
      },
      {
        id: '4.8',
        pergunta: 'O desempenho do modelo foi validado em contexto assistencial comparável ao SUS ou ao sistema de saúde em que será utilizado?',
        riskAnswer: 'nao',
        dica: 'Validação em contexto diferente pode não garantir que o modelo terá desempenho adequado no cenário real de uso.',
      },
    ],
  },
  {
    id: 'eixo5',
    nome: 'Eixo 5: Supervisão Humana e Explicabilidade',
    descricao: 'Avalia a existência de mecanismos de supervisão humana, explicabilidade do sistema e procedimentos de contingência.',
    questoes: [
      {
        id: '5.1',
        pergunta: 'O protocolo garante que um profissional habilitado revisa e pode contestar toda decisão gerada pelo sistema antes de sua execução?',
        riskAnswer: 'nao',
        dica: 'A ausência de revisão humana obrigatória (human-in-the-loop) deixa o participante exposto a erros sem barreira de segurança.',
      },
      {
        id: '5.2',
        pergunta: 'O sistema opera como único determinante de uma decisão — sem revisão humana obrigatória?',
        riskAnswer: 'sim',
        dica: 'Sistemas que operam como único determinante representam o maior nível de risco para o participante.',
      },
      {
        id: '5.3',
        pergunta: 'O protocolo define responsabilidade humana clara em caso de erro ou dano decorrente do uso do sistema?',
        riskAnswer: 'nao',
        dica: 'Sem definição clara de responsabilidade, pode haver impunidade em caso de danos ao participante.',
      },
      {
        id: '5.4',
        pergunta: 'A equipe responsável pelo estudo tem competência técnica suficiente para interpretar os resultados do sistema e identificar falhas?',
        riskAnswer: 'nao',
        dica: 'Sem competência técnica, a equipe não consegue exercer supervisão eficaz sobre o sistema.',
      },
      {
        id: '5.5',
        pergunta: 'O sistema fornece, junto a cada resultado, uma explicação compreensível sobre os fatores que influenciaram aquele resultado?',
        riskAnswer: 'nao',
        dica: 'Sistemas sem explicabilidade dificultam a supervisão humana e a identificação de vieses.',
      },
      {
        id: '5.6',
        pergunta: 'O protocolo prevê monitoramento contínuo do desempenho do sistema após o início do uso, com critérios definidos para interrupção?',
        riskAnswer: 'nao',
        dica: 'Sem monitoramento contínuo, o sistema pode degradar sem detecção, colocando participantes em risco.',
      },
      {
        id: '5.7',
        pergunta: 'Existe procedimento documentado para o caso de falha, indisponibilidade ou resultado inconsistente do sistema durante o estudo?',
        riskAnswer: 'nao',
        dica: 'A ausência de procedimento de contingência pode levar a decisões improvisadas em situações de crise.',
      },
      {
        id: '5.8',
        pergunta: 'O protocolo prevê como e quando o modelo será retreinado, e quem autoriza essa atualização?',
        riskAnswer: 'nao',
        dica: 'Retreinamento sem controle pode alterar o comportamento do sistema de forma imprevisível.',
      },
    ],
  },
];

// ----- Quantitative Matrix (Version B) -----

export const QUANTITATIVE_BLOCKS: QuantitativeBlock[] = [
  {
    id: 'bloco1',
    nome: 'Bloco 1: Projeto',
    descricao: 'Avalia a qualidade da documentação do protocolo e a preparação da equipe para o uso do sistema de IA.',
    questoes: [
      { id: 'P1.1', pergunta: 'O protocolo descreve com precisão o sistema de IA utilizado — nome, versão, fabricante ou desenvolvedor, e finalidade?', riskAnswer: 'nao', pontos: 3, dica: 'A descrição precisa do sistema é fundamental para a avaliação ética e para a responsabilização.' },
      { id: 'P1.2', pergunta: 'O protocolo justifica a escolha do sistema de IA em relação a alternativas metodológicas disponíveis?', riskAnswer: 'nao', pontos: 3, dica: 'A justificativa demonstra que o uso de IA é necessário e não apenas uma escolha arbitrária.' },
      { id: 'P1.3', pergunta: 'A equipe responsável inclui ao menos um membro com competência técnica para interpretar os resultados do sistema e identificar falhas?', riskAnswer: 'nao', pontos: 3, dica: 'Sem competência técnica na equipe, a supervisão do sistema é insuficiente.' },
      { id: 'P1.4', pergunta: 'O protocolo descreve o estágio de desenvolvimento do sistema — Discovery, Translation ou Deployment?', riskAnswer: 'nao', pontos: 3, dica: 'O estágio de desenvolvimento influencia diretamente o nível de incerteza sobre o desempenho do sistema.' },
      { id: 'P1.5', pergunta: 'O protocolo apresenta o contexto de uso definido — papel do sistema, escopo da decisão e fontes de evidência complementares?', riskAnswer: 'nao', pontos: 3, dica: 'O contexto de uso definido é essencial para delimitar o alcance e os riscos do sistema.' },
      { id: 'P1.6', pergunta: 'O TCLE menciona de forma compreensível que um sistema de IA será utilizado e qual é o seu papel no estudo?', riskAnswer: 'nao', pontos: 3, dica: 'A menção no TCLE é um requisito ético fundamental para a autonomia do participante.' },
      { id: 'P1.7', pergunta: 'O protocolo foi submetido a consulta ou parecer técnico externo sobre o uso do sistema de IA?', riskAnswer: 'nao', pontos: 4, dica: 'Parecer técnico externo adiciona camada de verificação independente à avaliação do sistema.' },
    ],
    maxPontos: 22,
  },
  {
    id: 'bloco2',
    nome: 'Bloco 2: Sistema',
    descricao: 'Avalia as características técnicas do sistema de IA, incluindo autonomia, adaptabilidade e transparência.',
    questoes: [
      { id: 'P2.1', pergunta: 'O sistema toma decisões ou emite recomendações sem intervenção humana obrigatória antes da execução?', riskAnswer: 'sim', pontos: 3, dica: 'Sistemas sem intervenção humana obrigatória aumentam significativamente o risco.', efeito: 'risco' },
      { id: 'P2.2', pergunta: 'O sistema é adaptativo: aprende ou se atualiza com novos dados após o início do estudo?', riskAnswer: 'sim', pontos: 3, dica: 'Sistemas adaptativos podem mudar de comportamento, introduzindo incerteza.', efeito: 'risco' },
      { id: 'P2.3', pergunta: 'O sistema opera como caixa-preta: sem possibilidade de explicar os fatores que determinaram cada resultado?', riskAnswer: 'sim', pontos: 3, dica: 'Sistemas caixa-preta impedem supervisão eficaz e identificação de vieses.', efeito: 'risco' },
      { id: 'P2.4', pergunta: 'O sistema foi submetido a testes de desempenho documentados antes do uso no protocolo?', riskAnswer: 'nao', pontos: 2, dica: 'Sem testes prévios, não há evidência de segurança e eficácia.' },
      { id: 'P2.5', pergunta: 'O sistema é explicável: fornece, junto a cada resultado, uma explicação compreensível sobre os fatores que o influenciaram?', riskAnswer: 'nao', pontos: 2, dica: 'A explicabilidade permite supervisão humana mais eficaz.' },
      { id: 'P2.6', pergunta: 'O protocolo define claramente o que acontece quando a decisão do sistema diverge do julgamento humano?', riskAnswer: 'nao', pontos: 2, dica: 'A ausência de definição sobre divergências cria zona cinzenta de responsabilidade.' },
      { id: 'P2.7', pergunta: 'O protocolo descreve a arquitetura do sistema — tipo de modelo, dados de entrada e saída, método de treinamento?', riskAnswer: 'nao', pontos: 2, dica: 'A descrição da arquitetura é essencial para a avaliação técnica do sistema.' },
    ],
    maxPontos: 17,
  },
  {
    id: 'bloco3',
    nome: 'Bloco 3: Algoritmo',
    descricao: 'Avalia a origem e a representatividade dos dados de treinamento, bem como a validação do modelo.',
    questoes: [
      { id: 'P3.1', pergunta: 'O modelo foi desenvolvido fora do Brasil para uso em população brasileira sem validação local documentada?', riskAnswer: 'sim', pontos: 2, dica: 'Modelos desenvolvidos fora do Brasil podem não ser adequados para a população local.' },
      { id: 'P3.2', pergunta: 'Os dados de treinamento do modelo foram coletados predominantemente em populações de alta renda ou do hemisfério norte?', riskAnswer: 'sim', pontos: 2, dica: 'Dados de populações de alta renda podem não representar a realidade brasileira.' },
      { id: 'P3.3', pergunta: 'Os dados de treinamento incluem representação adequada da diversidade da população-alvo deste protocolo: raça/cor, etnia, orientação sexual, gênero, faixa etária, região geográfica?', riskAnswer: 'nao', pontos: 2, dica: 'Falta de representatividade pode gerar resultados enviesados e discriminatórios.' },
      { id: 'P3.4', pergunta: 'Os dados de teste do modelo são independentes dos dados de treinamento?', riskAnswer: 'nao', pontos: 2, dica: 'Dados de teste não independentes podem superestimar o desempenho.' },
      { id: 'P3.5', pergunta: 'O protocolo descreve os dados usados no treinamento: origem, período de coleta, critérios de inclusão e exclusão?', riskAnswer: 'nao', pontos: 2, dica: 'A transparência sobre os dados de treinamento é essencial para avaliar a qualidade do modelo.' },
      { id: 'P3.6', pergunta: 'O protocolo apresenta avaliação de desempenho do modelo por subgrupos populacionais relevantes?', riskAnswer: 'nao', pontos: 2, dica: 'Sem avaliação por subgrupos, não é possível identificar disparidades de desempenho.' },
      { id: 'P3.7', pergunta: 'O desempenho do modelo foi validado em contexto assistencial comparável ao SUS ou ao sistema de saúde em que será utilizado?', riskAnswer: 'nao', pontos: 2, dica: 'Validação em contexto comparável é necessária para garantir adequação do modelo.' },
    ],
    maxPontos: 14,
  },
  {
    id: 'bloco4',
    nome: 'Bloco 4: Decisão',
    descricao: 'Avalia se o sistema é o único determinante de decisões e a irreversibilidade dos danos potenciais. Este é um bloco CRÍTICO.',
    subtitulo: '⚠️ BLOCO CRÍTICO — Cláusula de Prevalência Ética',
    questoes: [
      { id: 'P4.1', pergunta: 'O sistema é o único determinante de uma decisão que afeta diretamente o participante — sem revisão humana obrigatória?', riskAnswer: 'sim', pontos: 3, dica: 'Se o sistema é o único determinante, o participante fica sem barreira de segurança humana. Isso aciona a Cláusula de Prevalência Ética.' },
      { id: 'P4.2', pergunta: 'Em caso de erro do sistema, o dano ao participante seria irreversível ou de difícil reparação?', riskAnswer: 'sim', pontos: 3, dica: 'Danos irreversíveis representam o nível mais alto de risco. Isso aciona a Cláusula de Prevalência Ética.' },
      { id: 'P4.3', pergunta: 'O profissional responsável tem acesso às informações necessárias para contestar a recomendação do sistema antes de sua execução?', riskAnswer: 'nao', pontos: 2, dica: 'Sem acesso às informações, a supervisão humana é apenas simbólica.' },
    ],
    maxPontos: 8,
  },
  {
    id: 'bloco5',
    nome: 'Bloco 5: Impacto',
    descricao: 'Avalia o impacto potencial do sistema sobre o participante, incluindo danos físicos, psíquicos e sociais, e a proteção de populações vulneráveis.',
    questoes: [
      { id: 'P5.1', pergunta: 'O sistema influencia diretamente decisões clínicas ou terapêuticas sobre o participante?', riskAnswer: 'sim', pontos: 6, dica: 'Influência direta em decisões clínicas implica maior potencial de dano.' },
      { id: 'P5.2', pergunta: 'O sistema pode causar dano físico ao participante em caso de erro?', riskAnswer: 'sim', pontos: 6, dica: 'Danos físicos são os mais graves e exigem mecanismos robustos de segurança.' },
      { id: 'P5.3', pergunta: 'O sistema pode causar dano psíquico, social ou econômico ao participante em caso de erro?', riskAnswer: 'sim', pontos: 6, dica: 'Danos não físicos também são relevantes, especialmente quando afetam a vida social ou econômica.' },
      { id: 'P5.4', pergunta: 'O protocolo envolve populações vulneráveis — crianças, gestantes, idosos, povos indígenas ou pessoas em situação de vulnerabilidade socioeconômica?', riskAnswer: 'sim', pontos: 6, dica: 'Populações vulneráveis exigem proteção adicional.' },
      { id: 'P5.5', pergunta: 'O sistema infere características sensíveis do participante — raça/cor, etnia, condição de saúde, orientação sexual — que não foram explicitamente coletadas?', riskAnswer: 'sim', pontos: 6, dica: 'Inferência de características sensíveis sem coleta explícita pode gerar discriminação.' },
      { id: 'P5.6', pergunta: 'Os efeitos de um erro do sistema sobre o participante são reversíveis?', riskAnswer: 'nao', pontos: 5, dica: 'Efeitos irreversíveis aumentam significativamente o risco.' },
      { id: 'P5.7', pergunta: 'O protocolo descreve como os resultados gerados pela IA serão comunicados ao participante, quando aplicável?', riskAnswer: 'nao', pontos: 5, dica: 'A comunicação dos resultados é essencial para a transparência.' },
      { id: 'P5.8', pergunta: 'O protocolo prevê mecanismo para que o participante solicite a exclusão de seus dados do processo de treinamento ou retreinamento do modelo?', riskAnswer: 'nao', pontos: 6, dica: 'Sem mecanismo de exclusão, o participante perde o controle sobre seus dados.' },
      { id: 'P5.9', pergunta: 'O protocolo define responsabilidade humana clara em caso de erro ou dano decorrente do uso do sistema?', riskAnswer: 'nao', pontos: 6, dica: 'Sem definição de responsabilidade, pode haver impunidade em caso de danos.' },
    ],
    maxPontos: 52,
  },
  {
    id: 'bloco6',
    nome: 'Bloco 6: Dados',
    descricao: 'Avalia a sensibilidade dos dados, a conformidade com a LGPD e os mecanismos de proteção e governança.',
    questoes: [
      { id: 'P6.1', pergunta: 'O sistema processa dados pessoais sensíveis: saúde, genética, biometria, raça/cor, etnia, religião, vida sexual?', riskAnswer: 'sim', pontos: 7, dica: 'Dados sensíveis exigem proteção reforçada e base legal específica.' },
      { id: 'P6.2', pergunta: 'Os dados são transferidos ou processados em servidores fora do Brasil?', riskAnswer: 'sim', pontos: 7, dica: 'Transferência internacional exige avaliação de adequação e salvaguardas adicionais.' },
      { id: 'P6.3', pergunta: 'Existe risco real de reidentificação dos participantes a partir dos dados utilizados ou gerados pelo sistema?', riskAnswer: 'sim', pontos: 7, dica: 'A reidentificação pode causar danos significativos à privacidade e segurança.' },
      { id: 'P6.4', pergunta: 'O consentimento obtido cobre explicitamente o uso dos dados para treinamento ou retreinamento de modelos de IA?', riskAnswer: 'nao', pontos: 6, dica: 'Consentimento genérico não é suficiente para uso de dados em IA.' },
      { id: 'P6.5', pergunta: 'O protocolo demonstra conformidade com a LGPD — base legal identificada, finalidade declarada, Encarregado de Dados (DPO) indicado?', riskAnswer: 'nao', pontos: 7, dica: 'A não conformidade com a LGPD expõe a riscos legais e éticos.' },
      { id: 'P6.6', pergunta: 'O protocolo prevê plano de resposta a incidentes de segurança envolvendo os dados processados pela IA?', riskAnswer: 'nao', pontos: 5, dica: 'Sem plano de resposta, incidentes podem não ser tratados adequadamente.' },
      { id: 'P6.7', pergunta: 'Os dados de treinamento do modelo foram coletados com consentimento compatível com o uso previsto neste protocolo?', riskAnswer: 'nao', pontos: 6, dica: 'Dados coletados para outra finalidade podem não ter base legal para uso em IA.' },
      { id: 'P6.8', pergunta: 'O protocolo descreve como os dados serão armazenados, por quanto tempo e como serão descartados ao final do estudo?', riskAnswer: 'nao', pontos: 5, dica: 'A ausência de política de retenção pode levar ao uso indevido dos dados.' },
    ],
    maxPontos: 50,
  },
  // ----- Bloco 6.b: BANCOS DE DADOS (Res. CNS n.º 738/2024) -----
  // Condicional: só aplicado quando o protocolo usa banco de dados (filtro Passo 0).
  // Soma-se ao Bloco 6 no cálculo final. Eliminatório em P6.b.2.
  {
    id: 'bloco6b',
    nome: 'Bloco 6.b: Bancos de Dados de Pesquisa (Res. CNS n.º 738/2024)',
    descricao: 'Subseção aplicável quando o protocolo utiliza banco de dados. Deriva da Resolução CNS n.º 738/2024 e complementa o Bloco 6. A pontuação soma-se ao Bloco 6 para o cálculo final.',
    subtitulo: 'Condicional — ativada pelo filtro de banco de dados no Passo 0',
    condicionalBancoDados: true,
    referenciaNormativa: 'Resolução CNS n.º 738/2024',
    questoes: [
      { id: 'P6.b.1', pergunta: 'O protocolo identifica o Controlador do banco de dados (Art. 3.º, IV da Res. CNS n.º 738/2024) com cargo, função e instituição vinculada?', riskAnswer: 'nao', pontos: 7, dica: 'Sem identificação do Controlador (Arts. 3.º IV e 9.º), não há cadeia de custódia formalizada sobre os dados.' },
      { id: 'P6.b.2', pergunta: 'Se o banco é constituído fora do âmbito da pesquisa: o Termo de Anuência Institucional (Art. 27, VI) está presente?', riskAnswer: 'nao', pontos: 7, dica: 'ELIMINATÓRIO. A ausência do Termo de Anuência Institucional em banco externo torna o protocolo não avaliável no mérito (§7.3.6), independentemente da pontuação total. Selecione "Não se aplica" quando o banco é constituído no âmbito da própria pesquisa (não é externo).', eliminatorio: true, hasNaOption: true },
      { id: 'P6.b.3', pergunta: 'O Termo de Compromisso de Uso de Dados (Arts. 24, V e 27, V) está assinado pelos pesquisadores e anexado ao dossiê?', riskAnswer: 'nao', pontos: 5, dica: 'Os pesquisadores devem assinar Termo de Compromisso de Uso de Dados assumindo responsabilidade sobre finalidade, confidencialidade e descarte.' },
      { id: 'P6.b.4', pergunta: 'Se há pedido de dispensa de TCLE para uso futuro: o enquadramento em uma das cinco hipóteses do Art. 20 da Res. CNS n.º 738/2024 é fundamentado?', riskAnswer: 'nao', pontos: 5, dica: 'A dispensa de TCLE para uso futuro só é legítima quando enquadrada em uma das cinco hipóteses taxativas do Art. 20. Enquadramento genérico não é suficiente.' },
      { id: 'P6.b.5', pergunta: 'Se o protocolo é multicêntrico: a controladoria conjunta está formalizada em Termo de Acordo Institucional (Art. 3.º, XVI)?', riskAnswer: 'nao', pontos: 5, dica: 'Pesquisas multicêntricas exigem Termo de Acordo Institucional formalizando a controladoria conjunta dos dados.' },
    ],
    maxPontos: 29,
  },
  {
    id: 'bloco7',
    nome: 'Bloco 7: Mitigação',
    descricao: 'Avalia consultas regulatórias e medidas de mitigação de risco. Pode reduzir a pontuação total do protocolo.',
    subtitulo: 'Bidirecional — Consultas adicionam pontos; Mitigações subtraem pontos',
    questoes: [
      { id: 'P7.1', pergunta: 'O protocolo foi submetido a consulta prévia com a ANVISA sobre o enquadramento do sistema como SaMD?', riskAnswer: 'nao', pontos: 5, dica: 'SaMD (Software as a Medical Device) é software com finalidade médica — diagnóstico, prognóstico, monitoramento ou orientação terapêutica — regulado pela RDC ANVISA n.º 657/2022 (alinhada ao framework IMDRF). A consulta prévia (de enquadramento ou pré-submissão) é o mecanismo formal pelo qual a ANVISA se manifesta sobre se o sistema é dispositivo médico e qual a classe de risco. É especialmente importante quando o sistema gera saída que orienta ou dirige decisão clínica, está integrado a equipamento médico, processa imagens/sinais com IA para gerar recomendação, ou usa IA generativa em contexto clínico. O ofício de resposta integra o dossiê do CEP, reduz risco regulatório retroativo e cria trilha de auditoria.', efeito: 'risco' },
      { id: 'P7.2', pergunta: 'O protocolo prevê engajamento com o fabricante ou desenvolvedor do sistema para esclarecimento de dúvidas técnicas durante o estudo?', riskAnswer: 'nao', pontos: 5, dica: 'O engajamento com o fabricante permite acesso a informações técnicas relevantes.', efeito: 'risco' },
      { id: 'P7.3', pergunta: 'O protocolo garante que um profissional habilitado revisa toda decisão gerada pelo sistema antes de sua execução?', riskAnswer: 'sim', pontos: -10, dica: 'A revisão humana obrigatória é a medida de mitigação mais eficaz. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.4', pergunta: 'O sistema fornece, junto a cada resultado, uma explicação compreensível sobre os fatores que influenciaram aquele resultado?', riskAnswer: 'sim', pontos: -8, dica: 'A explicabilidade permite supervisão mais eficaz. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.5', pergunta: 'O protocolo prevê monitoramento contínuo do desempenho do sistema após o início do uso, com critérios definidos para interrupção?', riskAnswer: 'sim', pontos: -10, dica: 'Monitoramento contínuo com critérios de interrupção é essencial. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.6', pergunta: 'Existe procedimento documentado para falha, indisponibilidade ou resultado inconsistente do sistema durante o estudo?', riskAnswer: 'sim', pontos: -8, dica: 'Procedimento de contingência é fundamental para a segurança. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.7', pergunta: 'O protocolo prevê como e quando o modelo será retreinado, e quem autoriza essa atualização?', riskAnswer: 'sim', pontos: -8, dica: 'Controle sobre retreinamento evita mudanças imprevisíveis. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.8', pergunta: 'A equipe responsável tem competência técnica suficiente para interpretar os resultados do sistema e identificar falhas?', riskAnswer: 'sim', pontos: -7, dica: 'Competência técnica é necessária para supervisão eficaz. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.9', pergunta: 'O protocolo prevê monitoramento de deriva de dados (data drift) / degradação do desempenho ao longo do tempo?', riskAnswer: 'sim', pontos: -7, dica: 'Monitoramento de deriva previne degradação silenciosa. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
      { id: 'P7.10', pergunta: 'O protocolo descreve responsabilidade humana clara e identificada em caso de erro ou dano decorrente do sistema?', riskAnswer: 'sim', pontos: -7, dica: 'Responsabilidade definida é essencial para a proteção do participante. Responder "Sim" SUBTRAI pontos.', efeito: 'mitigacao' },
    ],
    maxPontos: 75,
  },
];

// ----- Quantitative thresholds (base and with Res 738 Bloco 6.b) -----

export type NivelThresholds = {
  maxScore: number;
  /** Limite superior (inclusivo) do Nível I; score <= este limite → Nível I. */
  levelI: number;
  /** Limite superior (inclusivo) do Nível II. */
  levelII: number;
  /** Limite superior (inclusivo) do Nível III. Acima → Nível IV. */
  levelIII: number;
};

/** Faixas base (protocolos SEM banco de dados). Conforme matriz original (238 pts). */
export const THRESHOLDS_BASE: NivelThresholds = {
  maxScore: 238,
  levelI: 50,
  levelII: 110,
  levelIII: 180,
};

/**
 * Faixas recalibradas para protocolos COM banco de dados (Bloco 6.b ativo, máx 267 pts).
 * Proporcionais à matriz base: 50/238 ≈ 21%; 110/238 ≈ 46%; 180/238 ≈ 76%.
 */
export const THRESHOLDS_COM_BANCO: NivelThresholds = {
  maxScore: 267,
  levelI: 56, // 50 * 267/238 ≈ 56,1
  levelII: 123, // 110 * 267/238 ≈ 123,4
  levelIII: 202, // 180 * 267/238 ≈ 201,9
};

export function getThresholds(usesDatabase: boolean): NivelThresholds {
  return usesDatabase ? THRESHOLDS_COM_BANCO : THRESHOLDS_BASE;
}

// ----- Requirements by Level (Cumulative) -----

export const REQUIREMENTS: Requirement[] = [
  // Nível I
  { id: 'req-I-1', texto: 'Declaração de uso de IA no protocolo', nivel: 'I' },
  { id: 'req-I-2', texto: 'Menção no TCLE de que um sistema algorítmico será utilizado e qual é o seu papel no estudo', nivel: 'I' },

  // Nível II (additional)
  { id: 'req-II-1', texto: 'Descrição do sistema e origem dos dados de treinamento', nivel: 'II' },
  { id: 'req-II-2', texto: 'Demonstração de conformidade com a LGPD', nivel: 'II' },
  { id: 'req-II-3', texto: 'Indicação da base legal para o tratamento dos dados utilizados', nivel: 'II' },

  // Nível III (additional)
  { id: 'req-III-1', texto: 'Documentação de validação técnica do sistema', nivel: 'III' },
  { id: 'req-III-2', texto: 'Análise de desempenho por subgrupos populacionais relevantes', nivel: 'III' },
  { id: 'req-III-3', texto: 'Comprovação de mecanismo de supervisão humana efetiva no circuito decisório (human-in-the-loop)', nivel: 'III' },
  { id: 'req-III-4', texto: 'Identificação do Encarregado de Dados da instituição responsável pelo estudo', nivel: 'III' },

  // Nível IV (additional)
  { id: 'req-IV-1', texto: 'Parecer técnico externo sobre o sistema', nivel: 'IV' },
  { id: 'req-IV-2', texto: 'Plano de monitoramento contínuo com critérios definidos de interrupção', nivel: 'IV' },
  { id: 'req-IV-3', texto: 'Notificação à ANVISA quando o sistema se enquadrar como SaMD', nivel: 'IV' },
  { id: 'req-IV-4', texto: 'Submissão do protocolo à apreciação em instância superior do CEP, quando prevista no regimento institucional', nivel: 'IV' },
];

// ----- Requisitos adicionais Res. CNS n.º 738/2024 (aplicáveis apenas quando usesDatabase) -----

export const REQUIREMENTS_RES738: Requirement[] = [
  { id: 'req-738-I-1', texto: 'Identificação do Controlador do banco de dados (Art. 3.º, IV)', nivel: 'I' },
  { id: 'req-738-II-1', texto: 'Termo de Compromisso de Uso de Dados assinado pelos pesquisadores (Arts. 24, V e 27, V)', nivel: 'II' },
  { id: 'req-738-II-2', texto: 'Termo de Anuência Institucional para bancos externos à pesquisa (Art. 27, VI) — obrigatório/eliminatório', nivel: 'II' },
  { id: 'req-738-III-1', texto: 'Fundamentação do enquadramento de dispensa de TCLE nas cinco hipóteses do Art. 20', nivel: 'III' },
  { id: 'req-738-III-2', texto: 'Termo de Acordo Institucional para controladoria conjunta em protocolos multicêntricos (Art. 3.º, XVI e §2.º do Art. 12)', nivel: 'III' },
  { id: 'req-738-IV-1', texto: 'Diligência obrigatória (§7.3.6) sempre que configurada ausência de cadeia de custódia formalizada', nivel: 'IV' },
];

// ----- Passo 0: Filtro de Banco de Dados (Res. CNS n.º 738/2024) -----

export const DATABASE_FILTER_QUESTION = {
  id: 'db-filter',
  pergunta: 'O protocolo utiliza banco de dados — próprio, de outra pesquisa ou de instituição externa?',
  dica: 'Este filtro ativa a subseção Res. CNS n.º 738/2024 (Eixo 3.b na Versão A e Bloco 6.b na Versão B). Bancos abrangem dados coletados fora do escopo direto de cada participante desta pesquisa. Não marque "Sim" quando o protocolo coleta dados exclusivamente no escopo da pesquisa com cada participante.',
  referenciaNormativa: 'Res. CNS n.º 738/2024 — Arts. 3.º, 9.º, 12, 20, 24, 27',
};

// ----- Context Characterization Questions -----

export const CONTEXT_QUESTIONS = [
  {
    id: 'contexto1',
    pergunta: 'Qual é a pergunta que o sistema de IA foi desenvolvido para responder neste protocolo?',
    dica: 'Descreva a pergunta principal que o sistema de IA busca responder no contexto do estudo. Ex.: "O sistema prevê o risco de readmissão hospitalar em 30 dias para pacientes com insuficiência cardíaca?"',
  },
  {
    id: 'contexto2',
    pergunta: 'O sistema responde a essa pergunta de forma autônoma ou subsidia uma decisão tomada por um ser humano?',
    dica: 'Indique se o sistema toma a decisão de forma autônoma (sem intervenção humana obrigatória) ou se fornece subsídios para que um profissional tome a decisão final.',
  },
];
