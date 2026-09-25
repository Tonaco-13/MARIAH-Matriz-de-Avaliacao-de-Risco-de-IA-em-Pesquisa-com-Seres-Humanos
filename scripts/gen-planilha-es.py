#!/usr/bin/env python3
"""Gera a planilha-modelo de Validação Local em espanhol a partir da canônica pt-BR.

Uso: python3 scripts/gen-planilha-es.py [entrada.xlsx] [saida.xlsx]
     padrão: public/planilha-validacao-local-mariah.xlsx → public/planilha-validacao-local-mariah-es.xlsx

- Mesma estrutura, fórmulas, estilos e validações da v2.1 pt-BR (fonte única).
- Traduz: textos das células, nomes das abas (e as referências a elas nas
  fórmulas), literais de fórmula (Sim/Não, NÃO AVALIÁVEL, faixas de Landis &
  Koch), listas de validação e mensagens de erro.
- Valores de entrada em es: «Sí»/«No» e «NO EVALUABLE». O JSON de validação v3
  continua com valores de schema pt-BR (ex.: classificacaoConsolidada =
  "NÃO AVALIÁVEL") — o comoUsar em es orienta a correspondência.
- Qualquer texto pt não mapeado aborta a geração (sem resíduo pt silencioso).
Depois de gerar: recalcular (LibreOffice) e conferir 0 erros de fórmula.
"""
import re
import sys

import openpyxl
import openpyxl.styles

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/planilha-validacao-local-mariah.xlsx'
DST = sys.argv[2] if len(sys.argv) > 2 else 'public/planilha-validacao-local-mariah-es.xlsx'

ABAS = {
    'Instruções': 'Instrucciones',
    'Protocolos': 'Protocolos',
    'Versão A': 'Versión A',
    'Versão B': 'Versión B',
    'Triagem A↔B': 'Triaje A↔B',
    'Painel-resumo': 'Panel-resumen',
}

# Literais dentro de fórmulas e listas de validação (valor pt → valor es).
LITERAIS = {
    'Sim': 'Sí',
    'Não': 'No',
    'NÃO AVALIÁVEL': 'NO EVALUABLE',
    'Insuficiente': 'Insuficiente',
    'Moderada': 'Moderada',
    'Substancial': 'Sustancial',
    'Quase perfeita': 'Casi perfecta',
}

TEXTOS = {
    # Instruções
    'Planilha-modelo · Validação Local da MARIAH pelos CEPs':
        'Planilla-modelo · Validación Local de la MARIAH por los CEPs',
    'Esta planilha automatiza o registro e o cálculo dos indicadores das três frentes de validação propostas na Seção de Validação Local do documento MARIAH. Use-a no Microsoft Excel, no LibreOffice Calc ou no Google Sheets — não requer instalação de extensão estatística.':
        'Esta planilla automatiza el registro y el cálculo de los indicadores de los tres frentes de validación propuestos en la Sección de Validación Local del documento MARIAH. Úsela en Microsoft Excel, LibreOffice Calc o Google Sheets — no requiere instalar ninguna extensión estadística.',
    'Como usar:': 'Cómo usarla:',
    '1. Aba «Protocolos» — cadastre cada protocolo com um identificador interno do CEP. Não registre dados que permitam identificar pesquisador, instituição proponente ou patrocinador. A planilha não pede esses dados.':
        '1. Pestaña «Protocolos» — registre cada protocolo con un identificador interno del CEP. No registre datos que permitan identificar al investigador, a la institución proponente o al patrocinador. La planilla no solicita esos datos.',
    '2. Aba «Versão A» — para cada protocolo aplicado em paralelo por dois avaliadores, registre a classificação consolidada de cada avaliador (I, II, III, IV ou NÃO AVALIÁVEL). A planilha calcula o percentual de concordância e a estatística kappa de Cohen sobre os pares com nível atribuído, com leitura sugerida, e a concordância quanto à avaliabilidade, que inclui os não avaliáveis.':
        '2. Pestaña «Versión A» — para cada protocolo aplicado en paralelo por dos evaluadores, registre la clasificación consolidada de cada evaluador (I, II, III, IV o NO EVALUABLE). La planilla calcula el porcentaje de concordancia y el estadístico kappa de Cohen sobre los pares con nivel asignado, con lectura sugerida, y la concordancia en cuanto a la evaluabilidad, que incluye los no evaluables.',
    '3. Aba «Versão B» — para cada protocolo avaliado pela Versão B, registre a pontuação líquida por bloco (incluindo o Bloco 6.b, quando houver banco de dados) e marque, nas colunas próprias, se a Cláusula de Prevalência Ética foi acionada e se o protocolo foi declarado não avaliável. A planilha calcula a pontuação total e o nível resultante com as mesmas regras da MARIAH, e gera a distribuição da casuística do CEP nos quatro níveis.':
        '3. Pestaña «Versión B» — para cada protocolo evaluado por la Versión B, registre la puntuación neta por bloque (incluido el Bloque 6.b, cuando haya banco de datos) y marque, en las columnas correspondientes, si se activó la Cláusula de Primacía Ética y si el protocolo fue declarado no evaluable. La planilla calcula la puntuación total y el nivel resultante con las mismas reglas de la MARIAH, y genera la distribución de la casuística del CEP en los cuatro niveles.',
    '4. Aba «Triagem A↔B» — para os protocolos que passaram pelas duas versões no modo triagem, a planilha cruza as classificações automaticamente, produzindo a tabela de contingência 4x4. Protocolos não avaliáveis ficam fora do cruzamento.':
        '4. Pestaña «Triaje A↔B» — para los protocolos que pasaron por las dos versiones en el modo triaje, la planilla cruza las clasificaciones automáticamente y produce la tabla de contingencia 4x4. Los protocolos no evaluables quedan fuera del cruce.',
    '5. Aba «Painel-resumo» — consolida os indicadores das três frentes em um painel único, para uso em reunião plenária do CEP.':
        '5. Pestaña «Panel-resumen» — consolida los indicadores de los tres frentes en un panel único, para uso en la reunión plenaria del CEP.',
    'Importante:': 'Importante:',
    '· Os avaliadores devem registrar suas classificações de forma independente, antes de qualquer deliberação colegiada. Concordâncias muito altas em todos os eixos podem indicar deliberação prévia entre avaliadores, o que esvazia o exercício.':
        '· Los evaluadores deben registrar sus clasificaciones de forma independiente, antes de cualquier deliberación colegiada. Concordancias muy altas en todos los ejes pueden indicar deliberación previa entre evaluadores, lo que vacía el ejercicio.',
    '· A planilha admite até 50 protocolos por frente. CEPs com volume maior podem duplicar a planilha por período de coleta.':
        '· La planilla admite hasta 50 protocolos por frente. Los CEPs con mayor volumen pueden duplicar la planilla por período de recolección.',
    '· Os cálculos são fórmulas Excel/Calc. Não delete células sombreadas (verde-claro). Edite apenas as células destacadas em amarelo-claro.':
        '· Los cálculos son fórmulas de Excel/Calc. No borre las celdas sombreadas (verde claro). Edite solo las celdas resaltadas en amarillo claro.',
    '· O retorno opcional ao Grupo de Trabalho é descrito na Seção de Validação Local do documento MARIAH. CEPs que optarem por compartilhar podem enviar a planilha completa ou apenas o painel-resumo.':
        '· La devolución opcional al Grupo de Trabajo se describe en la Sección de Validación Local del documento MARIAH. Los CEPs que opten por compartir pueden enviar la planilla completa o solo el panel-resumen.',
    'Novidades da versão 2 desta planilha (25/09/2026; revisão 2.1):':
        'Novedades de la versión 2 de esta planilla (25/09/2026; revisión 2.1):',
    '· Aba «Versão B»: coluna própria para o Bloco 6.b (antes somado à mão ao Bloco 6); colunas «Cláusula de Prevalência?» e «Não avaliável?»; o «Nível» passa a IV quando a Cláusula é acionada e a «NÃO AVALIÁVEL» quando há eliminatória — antes era calculado só pela pontuação e podia divergir da MARIAH. Não avaliáveis saem da distribuição e das estatísticas. Listas de seleção nas colunas Sim/Não.':
        '· Pestaña «Versión B»: columna propia para el Bloque 6.b (antes sumado a mano al Bloque 6); columnas «¿Cláusula de Primacía?» y «¿No evaluable?»; el «Nivel» pasa a IV cuando se activa la Cláusula y a «NO EVALUABLE» cuando hay eliminatoria — antes se calculaba solo por la puntuación y podía divergir de la MARIAH. Los no evaluables salen de la distribución y de las estadísticas. Listas de selección en las columnas Sí/No.',
    '· Aba «Triagem A↔B» e «Painel-resumo»: passam a ler o nível corrigido; pares com protocolo não avaliável ficam fora da convergência.':
        '· Pestañas «Triaje A↔B» y «Panel-resumen»: pasan a leer el nivel corregido; los pares con protocolo no evaluable quedan fuera de la convergencia.',
    '· Aba «Versão A» (revisão 2.1): aceita NÃO AVALIÁVEL; o kappa usa só os pares com nível I–IV e um indicador próprio mede a concordância quanto à avaliabilidade. Nomenclatura: a Seção de Validação Local é citada como parte do documento MARIAH.':
        '· Pestaña «Versión A» (revisión 2.1): acepta NO EVALUABLE; el kappa usa solo los pares con nivel I–IV y un indicador propio mide la concordancia en cuanto a la evaluabilidad. Nomenclatura: la Sección de Validación Local se cita como parte del documento MARIAH.',
    # Protocolos
    'Cadastro de protocolos avaliados': 'Registro de protocolos evaluados',
    'Preencha as colunas em amarelo. ID interno é livre (ex.: P-001). Não registre identificação de pesquisador, instituição ou patrocinador.':
        'Complete las columnas en amarillo. El ID interno es libre (ej.: P-001). No registre la identificación del investigador, de la institución ni del patrocinador.',
    'ID interno': 'ID interno',
    'Data submissão': 'Fecha de presentación',
    'Descrição breve (uso de IA no protocolo)': 'Descripción breve (uso de IA en el protocolo)',
    'Foi avaliado pela Versão A?': '¿Fue evaluado por la Versión A?',
    'Foi avaliado pela Versão B?': '¿Fue evaluado por la Versión B?',
    # Versão A
    'Versão A — Concordância entre avaliadores': 'Versión A — Concordancia entre evaluadores',
    'Para cada protocolo, registre a classificação consolidada do Avaliador 1 e do Avaliador 2: I, II, III, IV ou NÃO AVALIÁVEL (quando a MARIAH declarou o protocolo não avaliável). O kappa de Cohen é calculado só com os pares em que os dois avaliadores atribuíram nível (I a IV); a concordância quanto à avaliabilidade, que inclui os NÃO AVALIÁVEIS, aparece à parte, no painel à direita.':
        'Para cada protocolo, registre la clasificación consolidada del Evaluador 1 y del Evaluador 2: I, II, III, IV o NO EVALUABLE (cuando la MARIAH declaró el protocolo no evaluable). El kappa de Cohen se calcula solo con los pares en que los dos evaluadores asignaron nivel (I a IV); la concordancia en cuanto a la evaluabilidad, que incluye los NO EVALUABLES, aparece por separado, en el panel a la derecha.',
    'Avaliador 1 (I/II/III/IV)': 'Evaluador 1 (I/II/III/IV)',
    'Avaliador 2 (I/II/III/IV)': 'Evaluador 2 (I/II/III/IV)',
    'Concordam?': '¿Concuerdan?',
    'Δ níveis': 'Δ niveles',
    'Indicadores': 'Indicadores',
    'n de pares com nível I–IV (base do kappa)': 'n de pares con nivel I–IV (base del kappa)',
    'concordâncias (n)': 'concordancias (n)',
    'discordâncias (n)': 'discordancias (n)',
    'concordância observada (po)': 'concordancia observada (po)',
    'concordância esperada (pe, por chance)': 'concordancia esperada (pe, por azar)',
    'kappa de Cohen': 'kappa de Cohen',
    'leitura sugerida': 'lectura sugerida',
    'Faixas de leitura segundo Landis & Koch (1977).': 'Rangos de lectura según Landis & Koch (1977).',
    'Avaliabilidade (inclui NÃO AVALIÁVEL)': 'Evaluabilidad (incluye NO EVALUABLE)',
    'pares com as duas classificações registradas': 'pares con las dos clasificaciones registradas',
    'pares com NÃO AVALIÁVEL (fora do kappa)': 'pares con NO EVALUABLE (fuera del kappa)',
    'concordância quanto à avaliabilidade': 'concordancia en cuanto a la evaluabilidad',
    # Versão B
    'Versão B — Pontuação por bloco e distribuição': 'Versión B — Puntuación por bloque y distribución',
    'Registre a pontuação líquida de cada bloco, tal como exibida pela MARIAH. Pontos máximos: Bloco 1 = 22, 2 = 17, 3 = 14, 4 = 8, 5 = 62, 6 = 77, 6.b = 29 (só com banco de dados, Res. CNS n.º 738/2024) e 7 = até 75 (bidirecional, mínimo 0). Nas colunas J, K e L, escolha «Sim» ou «Não»: J = o protocolo usa banco de dados; K = a Cláusula de Prevalência Ética foi acionada (P4.1 ou P4.2 = Sim — o nível é IV qualquer que seja a pontuação); L = a MARIAH declarou o protocolo NÃO AVALIÁVEL (eliminatória) — ele sai da distribuição e das estatísticas.':
        'Registre la puntuación neta de cada bloque, tal como la muestra la MARIAH. Puntos máximos: Bloque 1 = 22, 2 = 17, 3 = 14, 4 = 8, 5 = 62, 6 = 77, 6.b = 29 (solo con banco de datos, Res. CNS n.º 738/2024) y 7 = hasta 75 (bidireccional, mínimo 0). En las columnas J, K y L, elija «Sí» o «No»: J = el protocolo utiliza banco de datos; K = se activó la Cláusula de Primacía Ética (P4.1 o P4.2 = Sí — el nivel es IV cualquiera que sea la puntuación); L = la MARIAH declaró el protocolo NO EVALUABLE (eliminatoria) — sale de la distribución y de las estadísticas.',
    'Bloco 1': 'Bloque 1', 'Bloco 2': 'Bloque 2', 'Bloco 3': 'Bloque 3', 'Bloco 4': 'Bloque 4',
    'Bloco 5': 'Bloque 5', 'Bloco 6': 'Bloque 6',
    'Bloco 6.b (Res 738)': 'Bloque 6.b (Res 738)',
    'Bloco 7 (líq)': 'Bloque 7 (neto)',
    'Usa BD?': '¿Usa BD?',
    'Cláusula de Prevalência?': '¿Cláusula de Primacía?',
    'Não avaliável?': '¿No evaluable?',
    'Total': 'Total',
    'Nível': 'Nivel',
    'Distribuição nos níveis': 'Distribución en los niveles',
    'n': 'n', '%': '%', 'I': 'I', 'II': 'II', 'III': 'III', 'IV': 'IV',
    'Total com nível': 'Total con nivel',
    'Não avaliáveis (fora da distribuição)': 'No evaluables (fuera de la distribución)',
    'Elevados a IV pela Cláusula de Prevalência': 'Elevados a IV por la Cláusula de Primacía',
    'Estatísticas da pontuação total (sem os não avaliáveis)': 'Estadísticas de la puntuación total (sin los no evaluables)',
    'Mediana': 'Mediana', 'Média': 'Media', 'Desvio-padrão': 'Desviación estándar',
    'Mínimo': 'Mínimo', 'Máximo': 'Máximo',
    # Triagem
    'Triagem A↔B — Convergência entre as duas versões': 'Triaje A↔B — Convergencia entre las dos versiones',
    'Para protocolos avaliados pelas duas versões, a planilha lê automaticamente as classificações da Versão A (coluna B) e da Versão B (coluna N da aba «Versão B», que já respeita a Cláusula de Prevalência) e produz a tabela de contingência 4x4 abaixo. Protocolos NÃO AVALIÁVEIS em qualquer das versões ficam fora da convergência.':
        'Para los protocolos evaluados por las dos versiones, la planilla lee automáticamente las clasificaciones de la Versión A (columna B) y de la Versión B (columna N de la pestaña «Versión B», que ya respeta la Cláusula de Primacía) y produce la tabla de contingencia 4x4 a continuación. Los protocolos NO EVALUABLES en cualquiera de las versiones quedan fuera de la convergencia.',
    'Versão A (consolidada)': 'Versión A (consolidada)',
    'Versão B (nível)': 'Versión B (nivel)',
    'Convergem?': '¿Convergen?',
    'Tabela de contingência (linhas = Versão A · colunas = Versão B)': 'Tabla de contingencia (filas = Versión A · columnas = Versión B)',
    'Versão B I': 'Versión B I', 'Versão B II': 'Versión B II', 'Versão B III': 'Versión B III', 'Versão B IV': 'Versión B IV',
    'Versão A I': 'Versión A I', 'Versão A II': 'Versión A II', 'Versão A III': 'Versión A III', 'Versão A IV': 'Versión A IV',
    'Indicador': 'Indicador', 'Valor': 'Valor',
    'n pares válidos (A e B com nível I–IV)': 'n pares válidos (A y B con nivel I–IV)',
    'convergências (n)': 'convergencias (n)',
    '% convergência': '% convergencia',
    # Painel
    'Painel-resumo das três frentes de validação': 'Panel-resumen de los tres frentes de validación',
    'Este painel consolida os indicadores das três frentes. Use-o como ponto de partida da reunião plenária do CEP que discutir os achados da validação local da MARIAH. CEPs que optarem por compartilhar resultados com o Grupo de Trabalho podem enviar somente este painel, sem prejuízo de detalhamento posterior.':
        'Este panel consolida los indicadores de los tres frentes. Úselo como punto de partida de la reunión plenaria del CEP que discuta los hallazgos de la validación local de la MARIAH. Los CEPs que opten por compartir resultados con el Grupo de Trabajo pueden enviar solo este panel, sin perjuicio de un detalle posterior.',
    'Frente 1 — Concordância entre avaliadores na Versão A': 'Frente 1 — Concordancia entre evaluadores en la Versión A',
    '% de concordância observada': '% de concordancia observada',
    '<0,40 Insuficiente · 0,40–0,60 Moderada · 0,60–0,80 Substancial · ≥0,80 Quase perfeita':
        '<0,40 Insuficiente · 0,40–0,60 Moderada · 0,60–0,80 Sustancial · ≥0,80 Casi perfecta',
    'concordância quanto à avaliabilidade (inclui NÃO AVALIÁVEL)': 'concordancia en cuanto a la evaluabilidad (incluye NO EVALUABLE)',
    'Frente 2 — Distribuição empírica da casuística (Versão B)': 'Frente 2 — Distribución empírica de la casuística (Versión B)',
    'n de protocolos com Versão B aplicada (com nível atribuído)': 'n de protocolos con la Versión B aplicada (con nivel asignado)',
    '% no Nível I (baixo)': '% en el Nivel I (bajo)',
    '% no Nível II (moderado)': '% en el Nivel II (moderado)',
    '% no Nível III (alto)': '% en el Nivel III (alto)',
    '% no Nível IV (crítico)': '% en el Nivel IV (crítico)',
    'mediana da pontuação total': 'mediana de la puntuación total',
    'amplitude (mínimo–máximo)': 'amplitud (mínimo–máximo)',
    'não avaliáveis (fora da distribuição) · elevados a IV pela Cláusula': 'no evaluables (fuera de la distribución) · elevados a IV por la Cláusula',
    'Frente 3 — Convergência entre Versões A e B (modo triagem)': 'Frente 3 — Convergencia entre las Versiones A y B (modo triaje)',
    'n pares válidos avaliados pelas duas versões (I–IV)': 'n pares válidos evaluados por las dos versiones (I–IV)',
    'n de convergências': 'n de convergencias',
    '% de convergência': '% de convergencia',
    '>80% Convergência alta · 60–80% Convergência média · <60% Examinar discordâncias':
        '>80% Convergencia alta · 60–80% Convergencia media · <60% Examinar discordancias',
    'Para discussão em reunião plenária do CEP': 'Para discusión en la reunión plenaria del CEP',
    '· Onde se concentram as discordâncias entre os avaliadores na Versão A? Em quais eixos?':
        '· ¿Dónde se concentran las discordancias entre los evaluadores en la Versión A? ¿En qué ejes?',
    '· A distribuição da casuística sugere concentração próxima a algum ponto de corte? Há protocolos no Nível IV?':
        '· ¿La distribución de la casuística sugiere concentración cerca de algún punto de corte? ¿Hay protocolos en el Nivel IV?',
    '· Quando A e B divergem, há padrão (por exemplo, A=II e B=III)? O que esse padrão diz sobre a leitura local da matriz?':
        '· Cuando A y B divergen, ¿hay un patrón (por ejemplo, A=II y B=III)? ¿Qué dice ese patrón sobre la lectura local de la matriz?',
    '· Há perguntas da matriz que os avaliadores leem de modo sistematicamente diferente? Vale rever a redação localmente?':
        '· ¿Hay preguntas de la matriz que los evaluadores leen de modo sistemáticamente diferente? ¿Conviene revisar la redacción localmente?',
    '· Os achados sugerem ajustes na capacitação interna do CEP? Em quais temas?':
        '· ¿Los hallazgos sugieren ajustes en la capacitación interna del CEP? ¿En qué temas?',
    '· O colegiado deseja compartilhar os achados com o Grupo de Trabalho? Que formato (planilha completa, só este painel, nota narrativa)?':
        '· ¿El colegiado desea compartir los hallazgos con el Grupo de Trabajo? ¿En qué formato (planilla completa, solo este panel, nota narrativa)?',
}

ERROS_VALIDACAO = {
    'Use I, II, III, IV ou NÃO AVALIÁVEL.': 'Use I, II, III, IV o NO EVALUABLE.',
    'Escolha «Sim» ou «Não».': 'Elija «Sí» o «No».',
    'Informe a pontuação numérica do bloco.': 'Indique la puntuación numérica del bloque.',
}

TITULO = 'Planilla-modelo · Validación Local de la MARIAH — v2.1 (traducción de cortesía)'
CORTESIA = 'Esta es una traducción de cortesía. La versión normativa vigente es la versión en portugués (pt-BR).'


def traduz_formula(f: str) -> str:
    # 1) referências a abas: 'Versão A'!  →  'Versión A'!
    for pt, es in ABAS.items():
        f = f.replace(f"'{pt}'!", f"'{es}'!")
    # 2) literais "..." exatos
    def lit(m):
        v = m.group(1)
        return '"' + LITERAIS.get(v, v) + '"'
    return re.sub(r'"([^"]*)"', lit, f)


def traduz_lista(f1: str) -> str:
    # formula1 de validação tipo lista: "I,II,III,IV,NÃO AVALIÁVEL"
    if not (f1.startswith('"') and f1.endswith('"')):
        return f1
    itens = f1[1:-1].split(',')
    return '"' + ','.join(LITERAIS.get(i, i) for i in itens) + '"'


def main():
    wb = openpyxl.load_workbook(SRC)
    faltando = []
    for ws in wb:
        for row in ws.iter_rows():
            for c in row:
                v = c.value
                if not isinstance(v, str):
                    continue
                if v.startswith('='):
                    c.value = traduz_formula(v)
                elif v in TEXTOS:
                    c.value = TEXTOS[v]
                else:
                    faltando.append(f'{ws.title}!{c.coordinate}: {v[:80]}')
        for dv in ws.data_validations.dataValidation:
            if dv.formula1:
                dv.formula1 = traduz_lista(dv.formula1)
            if dv.error:
                dv.error = ERROS_VALIDACAO.get(dv.error, dv.error)
                if dv.error not in ERROS_VALIDACAO.values():
                    faltando.append(f'{ws.title} validação: {dv.error}')
    if faltando:
        sys.exit('Textos sem tradução:\n  ' + '\n  '.join(faltando))
    for ws in wb:
        ws.title = ABAS[ws.title]
    # cláusula de cortesia verbatim ao glossário, visível na aba Instrucciones (A2 vazia no canônico)
    ins = wb['Instrucciones']
    if ins['A2'].value is not None:
        sys.exit('Instrucciones!A2 ocupada: rever a posição da cláusula de cortesia')
    ins['A2'] = CORTESIA
    ins['A2'].font = openpyxl.styles.Font(name=ins['A3'].font.name, sz=9, italic=True, color='FF555555')
    # definedNames que citem abas (se houver)
    for name in list(wb.defined_names):
        dn = wb.defined_names[name]
        if dn.attr_text:
            dn.attr_text = traduz_formula(dn.attr_text)
    wb.properties.title = TITULO
    wb.properties.language = 'es'
    wb.save(DST)
    print('ok', DST)


if __name__ == '__main__':
    main()
