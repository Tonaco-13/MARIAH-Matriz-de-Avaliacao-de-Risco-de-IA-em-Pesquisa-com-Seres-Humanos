"""Aplicador dos mapas de tradução dos anexos .docx (ver scripts/traducao-docx/gerar.sh).

Aplica um mapa pt→es aos <w:t> de um .docx desempacotado (runs já mesclados).

Uso: python3 apply_tr.py <dir_desempacotado> <mapa.py> <paragrafo_ancora_pt> <saida.docx> <original.docx>
- Valor None no mapa = manter o texto (ex.: referências bibliográficas).
- Aborta se algum segmento não estiver no mapa.
- Insere, logo após o parágrafo cujo texto é <paragrafo_ancora_pt> (já traduzido),
  um parágrafo com a cláusula de cortesia verbatim ao glossário, com a mesma
  formatação do parágrafo-âncora, em itálico.
- Marca o idioma: w:lang w:val → es-ES (styles e runs); dc:language em core.xml.
"""
import copy, html, importlib.util, re, sys, zipfile
from lxml import etree

d, mapa_py, ancora, out, orig = sys.argv[1:6]
spec = importlib.util.spec_from_file_location('m', mapa_py); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
T = m.T
CORTESIA = 'Esta es una traducción de cortesía. La versión normativa vigente es la versión en portugués (pt-BR).'
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}

faltando = []
usados = set()
for part in ['document.xml', 'header1.xml', 'footer1.xml', 'footnotes.xml', 'endnotes.xml']:
    p = f'{d}/word/{part}'
    try:
        tree = etree.parse(p)
    except OSError:
        continue
    for t in tree.iter(f'{{{W}}}t'):
        txt = t.text or ''
        if not txt.strip():
            continue
        if txt not in T:
            faltando.append(f'{part}: {txt[:90]}')
            continue
        usados.add(txt)
        if T[txt] is not None:
            t.text = T[txt]
            if T[txt] != T[txt].strip():
                t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    for lang in tree.iter(f'{{{W}}}lang'):
        for att in ('val', 'eastAsia', 'bidi'):
            k = f'{{{W}}}{att}'
            if lang.get(k, '').startswith('pt'):
                lang.set(k, 'es-ES')
    if part == 'document.xml' and ancora:
        alvo = T.get(ancora) or ancora
        ok = False
        for para in tree.iter(f'{{{W}}}p'):
            if ''.join(x.text or '' for x in para.iter(f'{{{W}}}t')) == alvo:
                novo = copy.deepcopy(para)
                runs = novo.findall(f'{{{W}}}r')
                for r in runs[1:]:
                    novo.remove(r)
                tt = runs[0].find(f'{{{W}}}t'); tt.text = CORTESIA
                rpr = runs[0].find(f'{{{W}}}rPr')
                if rpr is None:
                    rpr = etree.SubElement(runs[0], f'{{{W}}}rPr'); runs[0].insert(0, rpr)
                for tag in ('b', 'bCs', 'sz', 'szCs', 'i', 'iCs'):
                    for el in rpr.findall(f'{{{W}}}{tag}'):
                        rpr.remove(el)
                rpr.append(etree.Element(f'{{{W}}}i'))
                for tag in ('sz', 'szCs'):
                    el = etree.SubElement(rpr, f'{{{W}}}{tag}'); el.set(f'{{{W}}}val', '18')
                para.addnext(novo)
                ok = True
                break
        if not ok:
            sys.exit(f'parágrafo-âncora não encontrado: {alvo}')
    tree.write(p, xml_declaration=True, encoding='UTF-8', standalone=True)

if faltando:
    sys.exit('Sem tradução:\n  ' + '\n  '.join(faltando))
sobras = [k for k in T if k not in usados]
if sobras:
    print('aviso: chaves do mapa não usadas:', len(sobras), [s[:50] for s in sobras])

# estilos
p = f'{d}/word/styles.xml'
s = open(p, encoding='utf-8').read()
s = re.sub(r'(w:(?:val|eastAsia|bidi)=")pt-[A-Z]{2}"', r'\1es-ES"', s)
open(p, 'w', encoding='utf-8').write(s)
# core.xml
p = f'{d}/docProps/core.xml'
try:
    s = open(p, encoding='utf-8').read()
    if '<dc:language>' in s:
        s = re.sub(r'<dc:language>[^<]*</dc:language>', '<dc:language>es-ES</dc:language>', s)
    open(p, 'w', encoding='utf-8').write(s)
except OSError:
    pass

# reempacota na mesma ordem do original
zi = zipfile.ZipFile(orig)
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zo:
    for info in zi.infolist():
        if info.filename.endswith('/'):
            continue
        zo.writestr(zipfile.ZipInfo(info.filename, info.date_time), open(f'{d}/{info.filename}', 'rb').read(), compress_type=zipfile.ZIP_DEFLATED)
print('ok', out)
