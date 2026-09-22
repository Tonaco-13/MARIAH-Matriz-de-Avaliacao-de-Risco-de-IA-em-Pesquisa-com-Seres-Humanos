---
artefato: anexo-normativo-es
version: 0.1.0-borrador
fecha: 2026-09-20
autor: Kimi (arquitectura)
estado: BORRADOR — pendiente de auditoría del Z (equivalencia normativa + verificación de enlaces) antes de entrar en feat/i18n-es
destino: futura ruta /es/normativa (flag LOCALES_ENABLED on)
nota-pt-BR: Conteúdo de apoio ao usuário hispanohablante. NÃO é tradução de texto legal (despacho item 4b). Links verificados em 2026-09-20.
---

# Anexo Normativo — Referencias regulatorias brasileñas de la MARIAH

> **Esta es una traducción de cortesía. La versión normativa vigente es la versión en portugués (pt-BR).**
>
> Este anexo **explica** las referencias regulatorias brasileñas que la MARIAH utiliza. **No traduce** los textos legales: cada referencia enlaza al documento oficial en portugués, que es el único que hace fe. La MARIAH evalúa protocolos bajo la óptica de la regulación brasileña de ética en investigación; no es una adaptación a ninguna otra jurisdicción.

## 1. El sistema brasileño de ética en investigación (CEP/CONEP)

En Brasil, toda investigación con seres humanos debe ser aprobada por un **Comité de Ética en Investigación (CEP)** antes de su inicio. Los CEP son comités colegiados, vinculados a instituciones, y forman — junto con la **CONEP** (Comisión Nacional de Ética en Investigación, instancia nacional que dicta normas y recurre casos) — el llamado **sistema CEP/CONEP**, regulado por el Consejo Nacional de Salud (CNS) del Ministerio de Salud de Brasil.

Particularidades que el usuario extranjero debe conocer:

- **Doble grado de validación**: ciertos protocolos (entre ellos los que constituyen o utilizan bancos de datos, según la Res. CNS n.º 738/2024) tramitan por el CEP y también por la CONEP.
- La MARIAH **no sustituye** ese trámite: es un instrumento de apoyo a la evaluación, de llenado facultativo, tanto para el investigador como para el CEP (ver la cláusula de no-sustitución en el propio instrumento).
- Marco legal general de la investigación clínica en Brasil: **Ley n.º 14.874/2024** (Ley de Investigación Clínica). El marco ético-operativo vigente sigue siendo el de las resoluciones del CNS descritas abajo.

## 2. Resolución CNS n.º 466, de 12 de diciembre de 2012

**Qué es:** las directrices y normas reguladoras de las investigaciones con seres humanos en Brasil. Es la resolución-base del sistema: define el consentimiento libre y esclarecido (TCLE), los deberes del investigador, el funcionamiento de los CEP y los criterios de análisis ético.

**Quién la emite:** Consejo Nacional de Salud (CNS), Ministerio de Salud de Brasil.

**Dónde la MARIAH la usa:** fundamenta los requisitos de transparencia y consentimiento (por ejemplo, la mención en el TCLE del uso de sistemas algorítmicos — req-I-2) y la terminología de "persona participante".

**Documento oficial (pt-BR):** https://conselho.saude.gov.br/resolucoes/2012/Reso466.pdf

## 3. Resolución CNS n.º 510, de 7 de abril de 2016

**Qué es:** normas específicas para investigaciones en Ciencias Humanas y Sociales cuyos procedimientos utilicen datos obtenidos directamente con los participantes o informaciones identificables, o que puedan acarrear riesgos mayores que los de la vida cotidiana.

**Quién la emite:** Consejo Nacional de Salud (CNS).

**Dónde la MARIAH la usa:** orienta el tratamiento de investigaciones no biomédicas con datos identificables — frecuente en protocolos que emplean sistemas de IA sobre datos sociales y comportamentales.

**Documento oficial (pt-BR):** https://conselho.saude.gov.br/resolucoes/2016/Reso510.pdf

## 4. Resolución CNS n.º 738/2024 — bancos de datos de investigación

**Qué es:** dispone sobre el uso y la constitución de **bancos de datos con finalidad de investigación científica con seres humanos**: principios, responsabilidades del Controlador y del Operador, derechos de los participantes, reglas de consentimiento y de compartición. Aprobada en 2024 y publicada en el Diario Oficial de la Unión el 21 de enero de 2025, es la norma más reciente del sistema.

**Quién la emite:** Consejo Nacional de Salud (CNS), con homologación del Ministerio de Salud de Brasil.

**Dónde la MARIAH la usa:** es el ancla del **Eje 3.b (Versión A)** y del **Bloque 6.b (Versión B)** — activados cuando el protocolo utiliza banco de datos (propio, de otra investigación o de institución externa). De ella derivan, entre otros:

- la identificación del **Controlador** del banco (Art. 3.º, IV);
- el **Término de Anuencia Institucional** (Art. 27, VI), exigible para bancos constituidos fuera del ámbito de la investigación (historias clínicas, registros, bases administrativas);
- las reglas de **dispensa del TCLE** (art. 20, § 5.º): para bancos de origen no investigativo, la única vía es la **anonimización por el Controlador** — la dispensa nunca se presume por la sola origen del banco;
- la **diligencia obligatoria** citada por la MARIAH como §7.3.6, en los casos de ausencia de cadena de custodia.

**Documento oficial (pt-BR):** https://www.gov.br/conselho-nacional-de-saude/pt-br/atos-normativos/resolucoes/2024/resolucao-no-738.pdf/view

## 5. LGPD — Ley General de Protección de Datos (Ley n.º 13.709/2018)

**Qué es:** la ley brasileña de protección de datos personales. Define los papeles de **Controlador** (quien decide sobre el tratamiento), **Operador** (quien trata en nombre del Controlador) y **Encargado de Datos** (canal entre Controlador, titulares y la autoridad nacional, ANPD), además de las bases legales para el tratamiento.

**Por qué importa a la MARIAH:** el Nivel II exige demostración de conformidad con la LGPD (req-II-2) e indicación de la base legal (req-II-3); el Nivel III exige la identificación del Encargado de Datos (req-III-4).

**Aviso de terminología:** la MARIAH usa deliberadamente los términos del instituto brasileño (*Controlador*, *Encargado de Datos*), y no los equivalentes del RGPD europeo (*responsable del tratamiento*, *delegado de protección de datos*). La regulación de referencia es la brasileña.

**Texto oficial (pt-BR):** https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

## 6. ANVISA y SaMD

**Qué es:** la **ANVISA** (Agencia Nacional de Vigilancia Sanitaria) es la agencia reguladora brasileña de productos para la salud. Cuando un sistema de IA se encuadra como **SaMD** (*Software as a Medical Device* — software como dispositivo médico, categoría internacional del IMDRF), la MARIAH exige, en el Nivel IV, la **notificación a la ANVISA** (req-IV-3).

## 7. Referencias internacionales con traducción oficial al español

A diferencia de las normas brasileñas (que solo hacen fe en portugués), estos instrumentos internacionales tienen **versión oficial en español**:

- **Declaración de Helsinki de la AMM** (versión 2024, la única oficial vigente): https://www.wma.net/es/policies-post/declaracion-de-helsinki-de-la-amm-principios-eticos-para-las-investigaciones-medicas-en-seres-humanos/ — la propia AMM señala que, desde 2016, Helsinki se complementa con la **Declaración de Taipei** sobre bases de datos de salud y biobancos, especialmente relevante para el tema de la Res. 738/2024.
- **Pautas éticas internacionales del CIOMS/OMS (2016), versión en español publicada con la OPS:** https://cioms.ch/wp-content/uploads/2016/08/PAUTAS_ETICAS_INTERNACIONALES.pdf

## 8. Documentos de la propia MARIAH

Los documentos de fundamentación del instrumento (Guía INAEP, Módulo Operacional — Caderno 2, notas técnicas y suplementos) existen **solamente en portugués** y permanecen como referencias canónicas. Para esta versión en español, el presente anexo y el resumen ejecutivo (cuando se publique) son la puerta de entrada; ante cualquier duda de interpretación, prevalecen los originales en pt-BR.

---

*Anexo elaborado el 2026-09-20; enlaces verificados en esa fecha. Si algún enlace deja de funcionar, buscar el documento por su denominación exacta en el sitio del Consejo Nacional de Salud (gov.br/conselho-nacional-de-saude) o de la Presidencia de la República (planalto.gov.br).*
