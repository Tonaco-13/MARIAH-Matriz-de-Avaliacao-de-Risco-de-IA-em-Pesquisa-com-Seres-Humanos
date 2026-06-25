// ============================================================
// MARIA - Matriz de Avaliação de Risco em Inteligência Artificial
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
        dica: 'Sem revisão humana obrigatória antes da execução, não há barreira de segurança entre a recomendação do sistema e a ação sobre o participante — um erro chega ao participante sem filtro. Quanto maior a autonomia decisória, maior o risco.',
      },
      {
        id: '1.2',
        pergunta: 'O sistema é adaptativo — aprende ou se atualiza com novos dados após o início do estudo?',
        riskAnswer: 'sim',
        dica: 'Sistemas que aprendem ou se atualizam durante o estudo podem mudar de comportamento ao longo do tempo, gerando resultados diferentes dos validados no início — o que introduz incerteza sobre o que o participante de fato receberá.',
      },
      {
        id: '1.3',
        pergunta: 'Em caso de falha ou erro do sistema, o dano ao participante seria de difícil reversão?',
        riskAnswer: 'sim',
        dica: 'Quando o erro do sistema produz dano de difícil reversão (ex.: conduta cirúrgica indevida), o risco é maior do que em danos reparáveis, porque a correção posterior não restaura o participante ao estado anterior.',
      },
      {
        id: '1.4',
        pergunta: 'O sistema foi desenvolvido e validado fora do contexto em que será utilizado neste protocolo?',
        riskAnswer: 'sim',
        dica: 'Um sistema desenvolvido e validado em outro contexto (outra população, outro cenário assistencial) pode não manter o desempenho na realidade deste protocolo, gerando erros não detectados na validação original.',
      },
      {
        id: '1.5',
        pergunta: 'O profissional responsável tem acesso às informações necessárias para contestar a recomendação do sistema?',
        riskAnswer: 'nao',
        dica: 'Se o profissional não tem acesso às informações necessárias para contestar a recomendação, a supervisão humana é apenas simbólica — existe no papel, mas não barra um erro. É a ausência desse acesso que eleva o risco.',
      },
      {
        id: '1.6',
        pergunta: 'O protocolo define claramente o que acontece quando a decisão do sistema diverge do julgamento humano?',
        riskAnswer: 'nao',
        dica: 'Sem regra definida para quando a decisão do sistema diverge do julgamento humano, cria-se uma zona cinzenta de responsabilidade que pode atrasar a correção e prejudicar o participante.',
      },
      {
        id: '1.7',
        pergunta: 'O sistema é explicável — é possível compreender por que chegou a determinado resultado?',
        riskAnswer: 'nao',
        dica: 'Sistemas opacos (caixa-preta) dificultam identificar vieses e erros e atribuir responsabilidade. A falta de explicabilidade reduz a capacidade de supervisão — é o que caracteriza o risco aqui.',
      },
      {
        id: '1.8',
        pergunta: 'O sistema foi submetido a testes de desempenho documentados antes do uso no protocolo?',
        riskAnswer: 'nao',
        dica: 'Sem testes de desempenho documentados antes do uso, não há evidência de que o sistema é seguro e eficaz no contexto proposto; o protocolo passa a depender de um desempenho presumido, não demonstrado.',
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
        dica: 'Quando o sistema influencia diretamente decisões clínicas ou terapêuticas, um erro se traduz em conduta inadequada sobre o participante — o impacto potencial sobre a pessoa é maior.',
      },
      {
        id: '2.2',
        pergunta: 'O sistema pode causar dano físico ao participante em caso de erro?',
        riskAnswer: 'sim',
        dica: 'A possibilidade de dano físico em caso de erro é a forma mais grave de impacto e exige mecanismos robustos de segurança e supervisão.',
      },
      {
        id: '2.3',
        pergunta: 'O sistema pode causar dano psíquico, social ou econômico ao participante em caso de erro?',
        riskAnswer: 'sim',
        dica: 'Danos não físicos — psíquicos, sociais ou econômicos — também são eticamente relevantes, sobretudo quando afetam a vida social, o emprego ou a renda do participante.',
      },
      {
        id: '2.4',
        pergunta: 'O protocolo envolve populações vulneráveis: crianças, gestantes, idosos, pessoas com deficiência, povos indígenas ou comunidades em situação de vulnerabilidade socioeconômica?',
        riskAnswer: 'sim',
        dica: 'Populações vulneráveis (crianças, gestantes, idosos, pessoas com deficiência, povos indígenas, vulnerabilidade socioeconômica) exigem proteção adicional, pois podem ter menor capacidade de compreender riscos ou contestar decisões.',
      },
      {
        id: '2.5',
        pergunta: 'O sistema infere características sensíveis do participante: raça/cor, etnia, condição de saúde, orientação sexual, que não foram explicitamente coletadas?',
        riskAnswer: 'sim',
        dica: 'Inferir características sensíveis (raça/cor, etnia, saúde, orientação sexual) que não foram explicitamente coletadas contraria a autonomia informativa do participante e pode gerar discriminação.',
      },
      {
        id: '2.6',
        pergunta: 'Os efeitos de um erro do sistema sobre o participante são reversíveis?',
        riskAnswer: 'nao',
        dica: 'A pergunta verifica a reversibilidade: quando os efeitos de um erro NÃO são reversíveis, o risco aumenta de forma significativa, pois não há reparação integral possível.',
      },
      {
        id: '2.7',
        pergunta: 'O TCLE informa ao participante, de forma compreensível, que um sistema de IA será utilizado no protocolo e qual é o seu papel?',
        riskAnswer: 'nao',
        dica: 'Se o TCLE não informa, de forma compreensível, que um sistema de IA será usado e qual o seu papel, viola-se a transparência e a autonomia — o participante consente sem saber a que está consentindo.',
      },
      {
        id: '2.8',
        pergunta: 'O protocolo prevê mecanismo para que o participante solicite a exclusão de seus dados do processo de treinamento ou retreinamento do modelo?',
        riskAnswer: 'nao',
        dica: 'Sem mecanismo para o participante solicitar a exclusão de seus dados do treinamento/retreinamento, ele perde o controle sobre os próprios dados após o consentimento.',
      },
      {
        id: '2.9',
        pergunta: 'O protocolo descreve como os resultados gerados pela IA serão comunicados ao participante, quando aplicável?',
        riskAnswer: 'nao',
        dica: 'A ausência de descrição sobre como os resultados da IA serão comunicados ao participante compromete a transparência e o exercício da autonomia.',
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
        dica: 'O processamento de dados pessoais sensíveis (saúde, genética, biometria, raça/cor, etnia, religião, vida sexual) exige proteção reforçada e base legal específica na LGPD; o risco à privacidade é inerentemente maior.',
      },
      {
        id: '3.2',
        pergunta: 'Os dados são transferidos ou processados em servidores fora do Brasil?',
        riskAnswer: 'sim',
        dica: 'Transferir ou processar dados em servidores fora do Brasil exige avaliar a adequação do país de destino e adotar salvaguardas adicionais, pois reduz a governança nacional sobre os dados.',
      },
      {
        id: '3.3',
        pergunta: 'O consentimento obtido cobre explicitamente o uso dos dados para treinamento ou retreinamento de modelos de IA?',
        riskAnswer: 'nao',
        dica: 'Consentimento genérico não basta para treinar ou retreinar modelos: é preciso consentimento específico e informado para esse uso. A ausência dele é o que configura o risco.',
      },
      {
        id: '3.4',
        pergunta: 'O protocolo demonstra conformidade com a LGPD: base legal identificada, finalidade declarada, Encarregado de Dados (DPO) indicado?',
        riskAnswer: 'nao',
        dica: 'Sem base legal identificada, finalidade declarada e Encarregado (DPO) indicado, o protocolo não demonstra conformidade com a LGPD, expondo participantes e instituição a riscos legais e éticos.',
      },
      {
        id: '3.5',
        pergunta: 'Existe risco real de reidentificação dos participantes a partir dos dados utilizados ou gerados pelo sistema?',
        riskAnswer: 'sim',
        dica: 'Quando há risco real de reidentificação a partir dos dados usados ou gerados, a promessa de anonimato fica comprometida e os danos potenciais à privacidade aumentam.',
      },
      {
        id: '3.6',
        pergunta: 'O protocolo prevê plano de resposta a incidentes de segurança envolvendo os dados processados pela IA?',
        riskAnswer: 'nao',
        dica: 'Sem plano de resposta a incidentes de segurança, um vazamento ou acesso indevido pode não ser contido a tempo, agravando os danos aos participantes.',
      },
      {
        id: '3.7',
        pergunta: 'Os dados de treinamento do modelo foram coletados com consentimento compatível com o uso previsto neste protocolo?',
        riskAnswer: 'nao',
        dica: 'Se os dados de treinamento foram coletados para outra finalidade, podem não ter base legal para uso em IA neste protocolo, caracterizando uso secundário inadequado.',
      },
      {
        id: '3.8',
        pergunta: 'O protocolo descreve como os dados serão armazenados, por quanto tempo e como serão descartados ao final do estudo?',
        riskAnswer: 'nao',
        dica: 'A ausência de política de armazenamento, retenção e descarte abre espaço para uso indevido dos dados depois de encerrado o estudo.',
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
        dica: 'Identifica o Controlador do banco (Arts. 3.º, IV e 9.º da Res. CNS n.º 738/2024), com cargo, função e instituição. Sem isso, não há cadeia de custódia formalizada sobre os dados. No Eixo 3.b (Salvaguarda da Res. 738), uma única resposta de risco já leva o eixo ao Nível III — não há categoria intermediária para bancos de dados.',
      },
      {
        id: '3.b.2',
        pergunta: 'Se o banco foi constituído fora do âmbito de pesquisa (origem não-investigativa: prontuários, registros, bases administrativas): há Termo de Anuência Institucional (Art. 27, VI da Res. CNS n.º 738/2024) assinado pelo responsável (dirigente ou pessoa por ele delegada) da instituição detentora dos dados?',
        riskAnswer: 'nao',
        eliminatorio: true,
        hasNaOption: true,
        dica: 'Verifica o Termo de Anuência Institucional (Art. 27, VI da Res. CNS n.º 738/2024), assinado pelo responsável (dirigente ou pessoa por ele delegada) da instituição de onde os dados provêm — exigível apenas para banco constituído fora do âmbito de pesquisa (origem não-investigativa: prontuários, registros, bases administrativas). Salvaguarda de Inavaliabilidade: nesse caso, sua ausência torna o protocolo "não avaliável pela MARIA" (§7.3.6), sobrescrevendo a classificação e exigindo análise individualizada do CEP. Marque "Não se aplica" quando o banco foi constituído no âmbito de pesquisa — inclusive reuso de banco de pesquisa anterior do próprio pesquisador —, hipótese regida pelo Art. 24 (Termo de Compromisso de Uso de Dados), que não exige Anuência.',
      },
      {
        id: '3.b.3',
        pergunta: 'O Termo de Compromisso de Uso de Dados (Arts. 24, V e 27, V da Res. CNS n.º 738/2024), assinado pelos pesquisadores, consta do dossiê do protocolo?',
        riskAnswer: 'nao',
        dica: 'Confirma o Termo de Compromisso de Uso de Dados, assinado pelos pesquisadores (Arts. 24, V e 27, V da Res. CNS n.º 738/2024), que assumem responsabilidade sobre finalidade, confidencialidade e descarte. É distinto do Termo de Anuência (3.b.2): o Compromisso é dos pesquisadores; a Anuência, do responsável (dirigente ou pessoa por ele delegada) da instituição detentora. No Eixo 3.b, uma única resposta de risco já eleva o eixo ao Nível III.',
      },
      {
        id: '3.b.4',
        pergunta: 'Se há pedido de dispensa de TCLE para uso futuro de dados: o enquadramento é fundamentado em uma das cinco situações do Art. 20 da Res. CNS n.º 738/2024?',
        riskAnswer: 'nao',
        dica: 'A dispensa de TCLE para uso futuro só é legítima quando enquadrada em uma das cinco hipóteses taxativas do Art. 20 da Res. CNS n.º 738/2024; justificativa genérica não basta. No Eixo 3.b, uma única resposta de risco já leva o eixo ao Nível III.',
      },
      {
        id: '3.b.5',
        pergunta: 'Se o protocolo é multicêntrico ou envolve mais de uma instituição: a controladoria conjunta está formalizada em Termo de Acordo Institucional (Art. 3.º, XVI e §2.º do Art. 12 da Res. CNS n.º 738/2024)?',
        riskAnswer: 'nao',
        dica: 'Em pesquisa multicêntrica, a controladoria conjunta dos dados deve estar formalizada em Termo de Acordo Institucional (Art. 3.º, XVI e §2.º do Art. 12 da Res. CNS n.º 738/2024). No Eixo 3.b, uma única resposta de risco já leva o eixo ao Nível III.',
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
        dica: 'Se os dados de treinamento não representam a diversidade da população-alvo (raça/cor, etnia, gênero, idade, região), o modelo pode produzir resultados enviesados e discriminatórios para os subgrupos sub-representados.',
      },
      {
        id: '4.2',
        pergunta: 'O modelo foi desenvolvido fora do Brasil para uso em população brasileira sem validação local documentada?',
        riskAnswer: 'sim',
        dica: 'Um modelo desenvolvido fora do Brasil e usado em população brasileira sem validação local pode não refletir o perfil epidemiológico e socioeconômico nacional, degradando o desempenho real.',
      },
      {
        id: '4.3',
        pergunta: 'O protocolo apresenta avaliação de desempenho do modelo por subgrupos populacionais relevantes?',
        riskAnswer: 'nao',
        dica: 'Sem avaliação de desempenho por subgrupos populacionais relevantes, disparidades que afetam grupos específicos passam despercebidas — o desempenho médio pode esconder falhas localizadas.',
      },
      {
        id: '4.4',
        pergunta: 'O modelo foi treinado predominantemente em dados de populações de alta renda ou de países do hemisfério norte?',
        riskAnswer: 'sim',
        dica: 'Modelos treinados predominantemente em populações de alta renda ou do hemisfério norte podem não representar a realidade socioeconômica e epidemiológica brasileira.',
      },
      {
        id: '4.5',
        pergunta: 'O protocolo descreve os dados usados no treinamento do modelo: origem, período de coleta, critérios de inclusão e exclusão?',
        riskAnswer: 'nao',
        dica: 'A descrição de origem, período de coleta e critérios de inclusão/exclusão dos dados de treinamento é o que permite avaliar a qualidade e a representatividade do modelo; sua ausência impede esse julgamento.',
      },
      {
        id: '4.6',
        pergunta: 'Os dados de teste do modelo são independentes dos dados de treinamento?',
        riskAnswer: 'nao',
        dica: 'Se os dados de teste não são independentes dos de treinamento, o desempenho relatado tende a ser superestimado e não se confirma no uso real.',
      },
      {
        id: '4.7',
        pergunta: 'O protocolo prevê monitoramento de degradação de desempenho do modelo ao longo do tempo (deriva de dados - data drift) caso seja utilizado em contexto de aplicação continuada?',
        riskAnswer: 'nao',
        dica: 'Em uso continuado, sem monitorar a deriva de dados (data drift) o modelo pode degradar silenciosamente, gerando resultados cada vez menos confiáveis sem que a equipe perceba.',
      },
      {
        id: '4.8',
        pergunta: 'O desempenho do modelo foi validado em contexto assistencial comparável ao SUS ou ao sistema de saúde em que será utilizado?',
        riskAnswer: 'nao',
        dica: 'Validação em contexto diferente não garante desempenho adequado no cenário real de uso; a aderência ao contexto assistencial (ex.: SUS) é o que sustenta a transferibilidade.',
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
        dica: 'Sem revisão humana obrigatória (human-in-the-loop) que possa contestar a decisão antes da execução, o participante fica exposto a erros sem barreira de segurança.',
      },
      {
        id: '5.2',
        pergunta: 'O sistema opera como único determinante de uma decisão — sem revisão humana obrigatória?',
        riskAnswer: 'sim',
        dica: 'Quando o sistema opera como único determinante da decisão, sem revisão humana obrigatória, atinge-se o maior nível de risco para o participante.',
      },
      {
        id: '5.3',
        pergunta: 'O protocolo define responsabilidade humana clara em caso de erro ou dano decorrente do uso do sistema?',
        riskAnswer: 'nao',
        dica: 'Sem responsabilidade humana clara em caso de erro ou dano, instala-se uma zona de impunidade que enfraquece a proteção do participante.',
      },
      {
        id: '5.4',
        pergunta: 'A equipe responsável pelo estudo tem competência técnica suficiente para interpretar os resultados do sistema e identificar falhas?',
        riskAnswer: 'nao',
        dica: 'Sem competência técnica para interpretar resultados e identificar falhas, a equipe não exerce supervisão real sobre o sistema.',
      },
      {
        id: '5.5',
        pergunta: 'O sistema fornece, junto a cada resultado, uma explicação compreensível sobre os fatores que influenciaram aquele resultado?',
        riskAnswer: 'nao',
        dica: 'Sem uma explicação compreensível junto a cada resultado, a supervisão humana e a detecção de vieses ficam prejudicadas.',
      },
      {
        id: '5.6',
        pergunta: 'O protocolo prevê monitoramento contínuo do desempenho do sistema após o início do uso, com critérios definidos para interrupção?',
        riskAnswer: 'nao',
        dica: 'Sem monitoramento contínuo e critérios definidos de interrupção, o sistema pode degradar sem detecção, mantendo participantes expostos.',
      },
      {
        id: '5.7',
        pergunta: 'Existe procedimento documentado para o caso de falha, indisponibilidade ou resultado inconsistente do sistema durante o estudo?',
        riskAnswer: 'nao',
        dica: 'Sem procedimento documentado para falha, indisponibilidade ou resultado inconsistente, decisões passam a ser improvisadas em momentos críticos.',
      },
      {
        id: '5.8',
        pergunta: 'O protocolo prevê como e quando o modelo será retreinado, e quem autoriza essa atualização?',
        riskAnswer: 'nao',
        dica: 'Sem definir como, quando e quem autoriza o retreinamento, o comportamento do sistema pode mudar de forma imprevisível ao longo do estudo.',
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
      { id: 'P1.1', pergunta: 'O protocolo descreve com precisão o sistema de IA utilizado — nome, versão, fabricante ou desenvolvedor, e finalidade?', riskAnswer: 'nao', pontos: 3, dica: 'A descrição precisa do sistema (nome, versão, fabricante/desenvolvedor, finalidade) é a base para a avaliação ética e para a responsabilização; sem ela, não há o que auditar.' },
      { id: 'P1.2', pergunta: 'O protocolo justifica a escolha do sistema de IA em relação a alternativas metodológicas disponíveis?', riskAnswer: 'nao', pontos: 3, dica: 'Justificar a escolha do sistema frente a alternativas metodológicas demonstra que o uso de IA é necessário e proporcional, não arbitrário.' },
      { id: 'P1.3', pergunta: 'A equipe responsável inclui ao menos um membro com competência técnica para interpretar os resultados do sistema e identificar falhas?', riskAnswer: 'nao', pontos: 3, dica: 'Sem ao menos um membro com competência técnica para interpretar resultados e identificar falhas, a supervisão da equipe é insuficiente.' },
      { id: 'P1.4', pergunta: 'O protocolo descreve o estágio de desenvolvimento do sistema — Descoberta (Discovery), Translação (Translation) ou Implantação (Deployment)?', riskAnswer: 'nao', pontos: 3, dica: 'Informar o estágio de desenvolvimento (Descoberta, Translação ou Implantação) é o que permite calibrar a incerteza esperada sobre o desempenho do sistema.' },
      { id: 'P1.5', pergunta: 'O protocolo apresenta o contexto de uso definido — papel do sistema, escopo da decisão e fontes de evidência complementares?', riskAnswer: 'nao', pontos: 3, dica: 'Delimitar papel do sistema, escopo da decisão e fontes de evidência complementares é o que define o alcance e os riscos do uso; sem isso, o uso fica indefinido.' },
      { id: 'P1.6', pergunta: 'O TCLE menciona de forma compreensível que um sistema de IA será utilizado e qual é o seu papel no estudo?', riskAnswer: 'nao', pontos: 3, dica: 'Mencionar no TCLE, de forma compreensível, que um sistema de IA será usado e qual o seu papel é requisito ético de transparência e autonomia.' },
      { id: 'P1.7', pergunta: 'O protocolo foi submetido a consulta ou parecer técnico externo sobre o uso do sistema de IA?', riskAnswer: 'nao', pontos: 4, dica: 'Um parecer técnico externo adiciona uma camada de verificação independente sobre o uso do sistema, reduzindo pontos cegos da equipe proponente.' },
    ],
    maxPontos: 22,
  },
  {
    id: 'bloco2',
    nome: 'Bloco 2: Sistema',
    descricao: 'Avalia as características técnicas do sistema de IA, incluindo autonomia, adaptabilidade e transparência.',
    questoes: [
      { id: 'P2.1', pergunta: 'O sistema toma decisões ou emite recomendações sem intervenção humana obrigatória antes da execução?', riskAnswer: 'sim', pontos: 3, dica: 'Sistemas que decidem ou recomendam sem intervenção humana obrigatória antes da execução elevam o risco, pois removem a barreira de segurança entre recomendação e ação.', efeito: 'risco' },
      { id: 'P2.2', pergunta: 'O sistema é adaptativo: aprende ou se atualiza com novos dados após o início do estudo?', riskAnswer: 'sim', pontos: 3, dica: 'Sistemas adaptativos podem mudar de comportamento ao aprender com novos dados durante o estudo, introduzindo incerteza sobre os resultados gerados.', efeito: 'risco' },
      { id: 'P2.3', pergunta: 'O sistema opera como caixa-preta: sem possibilidade de explicar os fatores que determinaram cada resultado?', riskAnswer: 'sim', pontos: 3, dica: 'Sistemas caixa-preta, sem explicação dos fatores de cada resultado, impedem supervisão eficaz e a identificação de vieses.', efeito: 'risco' },
      { id: 'P2.4', pergunta: 'O sistema foi submetido a testes de desempenho documentados antes do uso no protocolo?', riskAnswer: 'nao', pontos: 2, dica: 'Sem testes de desempenho documentados antes do uso, não há evidência de segurança e eficácia no contexto proposto.' },
      { id: 'P2.5', pergunta: 'O sistema é explicável: fornece, junto a cada resultado, uma explicação compreensível sobre os fatores que o influenciaram?', riskAnswer: 'nao', pontos: 2, dica: 'A explicação compreensível junto a cada resultado é o que viabiliza uma supervisão humana eficaz; sua ausência caracteriza o risco.' },
      { id: 'P2.6', pergunta: 'O protocolo define claramente o que acontece quando a decisão do sistema diverge do julgamento humano?', riskAnswer: 'nao', pontos: 2, dica: 'Sem regra para quando a decisão do sistema diverge do julgamento humano, cria-se zona cinzenta de responsabilidade.' },
      { id: 'P2.7', pergunta: 'O protocolo descreve a arquitetura do sistema — tipo de modelo, dados de entrada e saída, método de treinamento?', riskAnswer: 'nao', pontos: 2, dica: 'A descrição da arquitetura (tipo de modelo, dados de entrada e saída, método de treinamento) é a base da avaliação técnica; sem ela, o sistema não é auditável.' },
    ],
    maxPontos: 17,
  },
  {
    id: 'bloco3',
    nome: 'Bloco 3: Algoritmo',
    descricao: 'Avalia a origem e a representatividade dos dados de treinamento, bem como a validação do modelo.',
    questoes: [
      { id: 'P3.1', pergunta: 'O modelo foi desenvolvido fora do Brasil para uso em população brasileira sem validação local documentada?', riskAnswer: 'sim', pontos: 2, dica: 'Modelos desenvolvidos fora do Brasil e usados em população brasileira sem validação local podem não ser adequados à realidade nacional.' },
      { id: 'P3.2', pergunta: 'Os dados de treinamento do modelo foram coletados predominantemente em populações de alta renda ou do hemisfério norte?', riskAnswer: 'sim', pontos: 2, dica: 'Dados de treinamento de populações de alta renda ou do hemisfério norte podem não representar o perfil socioeconômico e epidemiológico brasileiro.' },
      { id: 'P3.3', pergunta: 'Os dados de treinamento incluem representação adequada da diversidade da população-alvo deste protocolo: raça/cor, etnia, orientação sexual, gênero, faixa etária, região geográfica?', riskAnswer: 'nao', pontos: 2, dica: 'Sem representação adequada da diversidade da população-alvo (raça/cor, etnia, orientação sexual, gênero, idade, região), o modelo pode gerar resultados enviesados e discriminatórios.' },
      { id: 'P3.4', pergunta: 'Os dados de teste do modelo são independentes dos dados de treinamento?', riskAnswer: 'nao', pontos: 2, dica: 'Dados de teste não independentes dos de treinamento tendem a superestimar o desempenho do modelo.' },
      { id: 'P3.5', pergunta: 'O protocolo descreve os dados usados no treinamento: origem, período de coleta, critérios de inclusão e exclusão?', riskAnswer: 'nao', pontos: 2, dica: 'A descrição de origem, período e critérios de inclusão/exclusão dos dados de treinamento é essencial para avaliar a qualidade do modelo.' },
      { id: 'P3.6', pergunta: 'O protocolo apresenta avaliação de desempenho do modelo por subgrupos populacionais relevantes?', riskAnswer: 'nao', pontos: 2, dica: 'Sem avaliação por subgrupos populacionais relevantes, disparidades de desempenho que afetam grupos específicos não são identificadas.' },
      { id: 'P3.7', pergunta: 'O desempenho do modelo foi validado em contexto assistencial comparável ao SUS ou ao sistema de saúde em que será utilizado?', riskAnswer: 'nao', pontos: 2, dica: 'A validação em contexto assistencial comparável (ex.: SUS) é o que assegura a adequação do modelo ao cenário real de uso.' },
    ],
    maxPontos: 14,
  },
  {
    id: 'bloco4',
    nome: 'Bloco 4: Decisão',
    descricao: 'Avalia se o sistema é o único determinante de decisões e a irreversibilidade dos danos potenciais. Este é um bloco CRÍTICO.',
    subtitulo: '⚠️ BLOCO CRÍTICO — Cláusula de Prevalência Ética',
    questoes: [
      { id: 'P4.1', pergunta: 'O sistema é o único determinante de uma decisão que afeta diretamente o participante — sem revisão humana obrigatória?', riskAnswer: 'sim', pontos: 3, dica: 'Verifica se o sistema é o único determinante de uma decisão que afeta o participante, sem revisão humana obrigatória — o que remove a barreira de segurança humana. Salvaguarda Decisória (Cláusula de Prevalência Ética): responder "Sim" força o protocolo ao Nível IV, sobrescrevendo a soma, qualquer que seja a pontuação dos demais blocos.' },
      { id: 'P4.2', pergunta: 'Em caso de erro do sistema, o dano ao participante seria irreversível ou de difícil reparação?', riskAnswer: 'sim', pontos: 3, dica: 'Avalia se um erro do sistema poderia causar dano irreversível ou de difícil reparação ao participante — o patamar mais alto de risco. Salvaguarda Decisória (Cláusula de Prevalência Ética): responder "Sim" força o protocolo ao Nível IV, sobrescrevendo a soma.' },
      { id: 'P4.3', pergunta: 'O profissional responsável tem acesso às informações necessárias para contestar a recomendação do sistema antes de sua execução?', riskAnswer: 'nao', pontos: 2, dica: 'Sem acesso às informações necessárias para contestar a recomendação antes da execução, a supervisão humana é apenas simbólica — não consegue barrar um erro.' },
    ],
    maxPontos: 8,
  },
  {
    id: 'bloco5',
    nome: 'Bloco 5: Impacto',
    descricao: 'Avalia o impacto potencial do sistema sobre o participante, incluindo danos físicos, psíquicos e sociais, e a proteção de populações vulneráveis.',
    questoes: [
      { id: 'P5.1', pergunta: 'O sistema influencia diretamente decisões clínicas ou terapêuticas sobre o participante?', riskAnswer: 'sim', pontos: 6, dica: 'Quando o sistema influencia diretamente decisões clínicas ou terapêuticas, um erro se converte em conduta inadequada sobre o participante — maior potencial de dano.' },
      { id: 'P5.2', pergunta: 'O sistema pode causar dano físico ao participante em caso de erro?', riskAnswer: 'sim', pontos: 6, dica: 'A possibilidade de dano físico em caso de erro é a forma mais grave de impacto e exige mecanismos robustos de segurança.' },
      { id: 'P5.3', pergunta: 'O sistema pode causar dano psíquico, social ou econômico ao participante em caso de erro?', riskAnswer: 'sim', pontos: 6, dica: 'Danos não físicos — psíquicos, sociais ou econômicos — também são relevantes, sobretudo quando afetam a vida social ou a renda do participante.' },
      { id: 'P5.4', pergunta: 'O protocolo envolve populações vulneráveis — crianças, gestantes, idosos, povos indígenas ou pessoas em situação de vulnerabilidade socioeconômica?', riskAnswer: 'sim', pontos: 6, dica: 'Populações vulneráveis (crianças, gestantes, idosos, povos indígenas, vulnerabilidade socioeconômica) exigem proteção adicional, pela menor capacidade de contestar decisões ou compreender riscos.' },
      { id: 'P5.5', pergunta: 'O sistema infere características sensíveis do participante — raça/cor, etnia, condição de saúde, orientação sexual — que não foram explicitamente coletadas?', riskAnswer: 'sim', pontos: 6, dica: 'Inferir características sensíveis não explicitamente coletadas (raça/cor, etnia, saúde, orientação sexual) contraria a autonomia informativa e pode gerar discriminação.' },
      { id: 'P5.6', pergunta: 'Os efeitos de um erro do sistema sobre o participante são reversíveis?', riskAnswer: 'nao', pontos: 5, dica: 'A pergunta verifica a reversibilidade: efeitos NÃO reversíveis de um erro aumentam significativamente o risco, por não admitirem reparação integral.' },
      { id: 'P5.7', pergunta: 'O protocolo descreve como os resultados gerados pela IA serão comunicados ao participante, quando aplicável?', riskAnswer: 'nao', pontos: 5, dica: 'A ausência de descrição sobre como os resultados serão comunicados ao participante compromete a transparência.' },
      { id: 'P5.8', pergunta: 'O protocolo prevê mecanismo para que o participante solicite a exclusão de seus dados do processo de treinamento ou retreinamento do modelo?', riskAnswer: 'nao', pontos: 6, dica: 'Sem mecanismo para o participante excluir seus dados do treinamento/retreinamento, ele perde o controle sobre os próprios dados após o consentimento.' },
      { id: 'P5.9', pergunta: 'O protocolo define responsabilidade humana clara em caso de erro ou dano decorrente do uso do sistema?', riskAnswer: 'nao', pontos: 6, dica: 'Sem responsabilidade humana clara em caso de erro ou dano, instala-se uma zona de impunidade que fragiliza a proteção do participante.' },
    ],
    maxPontos: 52,
  },
  {
    id: 'bloco6',
    nome: 'Bloco 6: Dados',
    descricao: 'Avalia a sensibilidade dos dados, a conformidade com a LGPD e os mecanismos de proteção e governança.',
    questoes: [
      { id: 'P6.1', pergunta: 'O sistema processa dados pessoais sensíveis: saúde, genética, biometria, raça/cor, etnia, religião, vida sexual?', riskAnswer: 'sim', pontos: 7, dica: 'O processamento de dados sensíveis (saúde, genética, biometria, raça/cor, etnia, religião, vida sexual) exige proteção reforçada e base legal específica na LGPD.' },
      { id: 'P6.2', pergunta: 'Os dados são transferidos ou processados em servidores fora do Brasil?', riskAnswer: 'sim', pontos: 7, dica: 'Transferir ou processar dados fora do Brasil exige avaliar a adequação do destino e adotar salvaguardas adicionais, reduzindo a governança nacional sobre os dados.' },
      { id: 'P6.3', pergunta: 'Existe risco real de reidentificação dos participantes a partir dos dados utilizados ou gerados pelo sistema?', riskAnswer: 'sim', pontos: 7, dica: 'Risco real de reidentificação compromete a promessa de anonimato e amplia os danos potenciais à privacidade e à segurança.' },
      { id: 'P6.4', pergunta: 'O consentimento obtido cobre explicitamente o uso dos dados para treinamento ou retreinamento de modelos de IA?', riskAnswer: 'nao', pontos: 6, dica: 'Consentimento genérico não basta para treinar/retreinar modelos; é preciso consentimento específico e informado para esse uso.' },
      { id: 'P6.5', pergunta: 'O protocolo demonstra conformidade com a LGPD — base legal identificada, finalidade declarada, Encarregado de Dados (DPO) indicado?', riskAnswer: 'nao', pontos: 7, dica: 'Sem base legal, finalidade declarada e Encarregado (DPO) indicado, o protocolo não demonstra conformidade com a LGPD, expondo a riscos legais e éticos.' },
      { id: 'P6.6', pergunta: 'O protocolo prevê plano de resposta a incidentes de segurança envolvendo os dados processados pela IA?', riskAnswer: 'nao', pontos: 5, dica: 'Sem plano de resposta a incidentes, um vazamento ou acesso indevido pode não ser contido a tempo, agravando os danos.' },
      { id: 'P6.7', pergunta: 'Os dados de treinamento do modelo foram coletados com consentimento compatível com o uso previsto neste protocolo?', riskAnswer: 'nao', pontos: 6, dica: 'Dados de treinamento coletados para outra finalidade podem não ter base legal para uso em IA neste protocolo.' },
      { id: 'P6.8', pergunta: 'O protocolo descreve como os dados serão armazenados, por quanto tempo e como serão descartados ao final do estudo?', riskAnswer: 'nao', pontos: 5, dica: 'A ausência de política de armazenamento, retenção e descarte abre espaço para uso indevido dos dados após o estudo.' },
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
      { id: 'P6.b.1', pergunta: 'O protocolo identifica o Controlador do banco de dados (Art. 3.º, IV da Res. CNS n.º 738/2024) com cargo, função e instituição vinculada?', riskAnswer: 'nao', pontos: 7, dica: 'Identifica o Controlador do banco (Arts. 3.º, IV e 9.º da Res. CNS n.º 738/2024), com cargo, função e instituição. Sem isso, não há cadeia de custódia formalizada sobre os dados. Item do Bloco 6.b (Res. 738), aplicável apenas quando o protocolo usa banco de dados; seus pontos somam ao escore.' },
      { id: 'P6.b.2', pergunta: 'Se o banco foi constituído fora do âmbito de pesquisa (origem não-investigativa: prontuários, registros, bases administrativas): o Termo de Anuência Institucional (Art. 27, VI da Res. CNS n.º 738/2024) está presente?', riskAnswer: 'nao', pontos: 7, dica: 'Verifica o Termo de Anuência Institucional (Art. 27, VI da Res. CNS n.º 738/2024), assinado pelo responsável (dirigente ou pessoa por ele delegada) da instituição de onde os dados provêm — exigível apenas para banco constituído fora do âmbito de pesquisa (origem não-investigativa: prontuários, registros, bases administrativas). Salvaguarda de Inavaliabilidade: nesse caso, sua ausência torna o protocolo "não avaliável pela MARIA" (§7.3.6), independentemente da pontuação total. Marque "Não se aplica" quando o banco foi constituído no âmbito de pesquisa — inclusive reuso de banco de pesquisa anterior do próprio pesquisador —, hipótese regida pelo Art. 24 (Termo de Compromisso de Uso de Dados), que não exige Anuência.', eliminatorio: true, hasNaOption: true },
      { id: 'P6.b.3', pergunta: 'O Termo de Compromisso de Uso de Dados (Arts. 24, V e 27, V da Res. CNS n.º 738/2024) está assinado pelos pesquisadores e anexado ao dossiê?', riskAnswer: 'nao', pontos: 5, dica: 'Confirma o Termo de Compromisso de Uso de Dados, assinado pelos pesquisadores (Arts. 24, V e 27, V da Res. CNS n.º 738/2024). É distinto do Termo de Anuência (P6.b.2): o Compromisso é dos pesquisadores; a Anuência, do responsável (dirigente ou pessoa por ele delegada) da instituição detentora. Item do Bloco 6.b (Res. 738); seus pontos somam ao escore.' },
      { id: 'P6.b.4', pergunta: 'Se há pedido de dispensa de TCLE para uso futuro: o enquadramento em uma das cinco hipóteses do Art. 20 da Res. CNS n.º 738/2024 é fundamentado?', riskAnswer: 'nao', pontos: 5, dica: 'A dispensa de TCLE para uso futuro só é legítima quando enquadrada em uma das cinco hipóteses taxativas do Art. 20 da Res. CNS n.º 738/2024; justificativa genérica não basta. Item do Bloco 6.b (Res. 738); seus pontos somam ao escore.' },
      { id: 'P6.b.5', pergunta: 'Se o protocolo é multicêntrico: a controladoria conjunta está formalizada em Termo de Acordo Institucional (Art. 3.º, XVI e §2.º do Art. 12 da Res. CNS n.º 738/2024)?', riskAnswer: 'nao', pontos: 5, dica: 'Em pesquisa multicêntrica, a controladoria conjunta deve estar formalizada em Termo de Acordo Institucional (Art. 3.º, XVI e §2.º do Art. 12 da Res. CNS n.º 738/2024). Item do Bloco 6.b (Res. 738); seus pontos somam ao escore.' },
    ],
    maxPontos: 29,
  },
  {
    id: 'bloco7',
    nome: 'Bloco 7: Mitigação',
    descricao: 'Avalia consultas regulatórias e medidas de mitigação de risco. Pode reduzir a pontuação total do protocolo.',
    subtitulo: 'Bidirecional — Consultas adicionam pontos; Mitigações subtraem pontos',
    questoes: [
      { id: 'P7.1', pergunta: 'O protocolo foi submetido a consulta prévia com a ANVISA sobre o enquadramento do sistema como SaMD?', riskAnswer: 'nao', pontos: 5, hasNaOption: true, dica: 'SaMD (Software as a Medical Device) é software com finalidade médica — diagnóstico, prognóstico, monitoramento ou orientação terapêutica — regulado pela RDC ANVISA n.º 657/2022 (alinhada ao framework IMDRF). A consulta prévia (de enquadramento ou pré-submissão) é o mecanismo formal pelo qual a ANVISA se manifesta sobre se o sistema é dispositivo médico e qual a classe de risco. É especialmente importante quando o sistema gera saída que orienta ou dirige decisão clínica, está integrado a equipamento médico, processa imagens/sinais com IA para gerar recomendação, ou usa IA generativa em contexto clínico. Marque "Não se aplica" SOMENTE se o sistema comprovadamente não tem qualquer pretensão diagnóstica, prognóstica, terapêutica ou de orientação clínica (ex.: análise secundária retrospectiva sem feedback ao participante, gestão administrativa de pesquisa, pré-processamento de dados sem saída interpretativa). Qualquer dúvida razoável de enquadramento → a consulta deve ser feita.', efeito: 'risco' },
      { id: 'P7.2', pergunta: 'O protocolo prevê engajamento com o fabricante ou desenvolvedor do sistema para esclarecimento de dúvidas técnicas durante o estudo?', riskAnswer: 'nao', pontos: 5, dica: 'O engajamento com o fabricante/desenvolvedor durante o estudo dá acesso a informações técnicas relevantes para esclarecer dúvidas e tratar falhas — reduz a dependência de uma caixa-preta sem suporte.', efeito: 'risco' },
      { id: 'P7.3', pergunta: 'O protocolo garante que um profissional habilitado revisa toda decisão gerada pelo sistema antes de sua execução?', riskAnswer: 'sim', pontos: -10, dica: 'A revisão humana obrigatória antes da execução é a mitigação mais eficaz: reinsere a barreira de segurança entre a recomendação e a ação. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.4', pergunta: 'O sistema fornece, junto a cada resultado, uma explicação compreensível sobre os fatores que influenciaram aquele resultado?', riskAnswer: 'sim', pontos: -8, dica: 'A explicação compreensível de cada resultado permite supervisão humana real, não apenas formal. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.5', pergunta: 'O protocolo prevê monitoramento contínuo do desempenho do sistema após o início do uso, com critérios definidos para interrupção?', riskAnswer: 'sim', pontos: -10, dica: 'Monitoramento contínuo com critérios definidos de interrupção permite detectar e conter perda de desempenho durante o uso. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.6', pergunta: 'Existe procedimento documentado para falha, indisponibilidade ou resultado inconsistente do sistema durante o estudo?', riskAnswer: 'sim', pontos: -8, dica: 'Procedimento documentado para falha, indisponibilidade ou resultado inconsistente garante resposta segura quando o sistema falha. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.7', pergunta: 'O protocolo prevê como e quando o modelo será retreinado, e quem autoriza essa atualização?', riskAnswer: 'sim', pontos: -8, dica: 'Definir como, quando e quem autoriza o retreinamento evita mudanças imprevisíveis no comportamento do sistema. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.8', pergunta: 'A equipe responsável tem competência técnica suficiente para interpretar os resultados do sistema e identificar falhas?', riskAnswer: 'sim', pontos: -7, dica: 'Equipe com competência técnica para interpretar resultados e identificar falhas torna a supervisão efetiva. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.9', pergunta: 'O protocolo prevê monitoramento de deriva de dados (data drift) / degradação do desempenho ao longo do tempo?', riskAnswer: 'sim', pontos: -7, dica: 'Monitorar deriva de dados (data drift) previne a degradação silenciosa do desempenho ao longo do tempo. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
      { id: 'P7.10', pergunta: 'O protocolo descreve responsabilidade humana clara e identificada em caso de erro ou dano decorrente do sistema?', riskAnswer: 'sim', pontos: -7, dica: 'Responsabilidade humana clara e identificada em caso de erro ou dano protege o participante e evita zona cinzenta de imputação. Item de mitigação (Bloco 7, bidirecional): "Sim" subtrai pontos; "Não" os mantém — o bloco tem piso de zero.', efeito: 'mitigacao' },
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
  { id: 'req-738-I-1', texto: 'Identificação do Controlador do banco de dados (Art. 3.º, IV da Res. CNS n.º 738/2024)', nivel: 'I' },
  { id: 'req-738-II-1', texto: 'Termo de Compromisso de Uso de Dados assinado pelos pesquisadores (Arts. 24, V e 27, V da Res. CNS n.º 738/2024)', nivel: 'II' },
  { id: 'req-738-II-2', texto: 'Termo de Anuência Institucional para bancos externos à pesquisa (Art. 27, VI da Res. CNS n.º 738/2024) — obrigatório/eliminatório', nivel: 'II' },
  { id: 'req-738-III-1', texto: 'Fundamentação do enquadramento de dispensa de TCLE nas cinco hipóteses do Art. 20 da Res. CNS n.º 738/2024', nivel: 'III' },
  { id: 'req-738-III-2', texto: 'Termo de Acordo Institucional para controladoria conjunta em protocolos multicêntricos (Art. 3.º, XVI e §2.º do Art. 12 da Res. CNS n.º 738/2024)', nivel: 'III' },
  { id: 'req-738-IV-1', texto: 'Diligência obrigatória (§7.3.6 do Capítulo 7 da Res. CNS n.º 738/2024) sempre que configurada ausência de cadeia de custódia formalizada', nivel: 'IV' },
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
