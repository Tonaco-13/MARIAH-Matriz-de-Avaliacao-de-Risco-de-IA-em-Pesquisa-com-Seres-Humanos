#!/usr/bin/env python3
# ============================================================
# B2/M1 — extrai os enunciados canônicos dos quadros do guia v46 (DOCX)
# para JSON, fonte da harmonização (overlay no gerador) e da checagem de
# paridade spec × guia (scripts/parity-check.ts).
#
# Entrada:  gate/INAEP_GUIA_IA_PESQUISA_V46_DRAFT.docx  (cópia do guia no repo)
# Saída:    gate/enunciados-guia-v46.json  { "<id>": "<enunciado verbatim>" }
#
# Rodar (precisa python-docx):  python3 scripts/extract-enunciados-guia.py
# (JSON versionado; re-extrair só quando o guia mudar.)
# ============================================================
import os, re, json, sys
import docx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX = os.path.join(ROOT, "gate", "INAEP_GUIA_IA_PESQUISA_V46_DRAFT.docx")
SPEC = os.path.join(ROOT, "spec", "mariah-spec.json")
OUT = os.path.join(ROOT, "gate", "enunciados-guia-v46.json")

# ids válidos = os que existem na spec (fonte de verdade dos identificadores)
spec = json.load(open(SPEC, encoding="utf-8"))
ids = set()
for a in spec["qualitativeAxes"]:
    for q in a["questoes"]:
        ids.add(q["id"])
for b in spec["quantitativeBlocks"]:
    for q in b["questoes"]:
        ids.add(q["id"])

ws = re.compile(r"\s+")
# remove anotações de marcador ao final do enunciado (ex.: " [ELIMINATÓRIO]")
tag = re.compile(r"\s*\[[^\]]+\]\s*$")

doc = docx.Document(DOCX)
guide = {}
for tb in doc.tables:
    for r in tb.rows:
        cells = [c.text.strip().replace("\n", " ") for c in r.cells]
        if len(cells) >= 2 and cells[0] in ids and cells[0] not in guide:
            enun = tag.sub("", ws.sub(" ", cells[1]).strip())
            if enun:
                guide[cells[0]] = enun

faltando = sorted(ids - set(guide))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(guide, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2, sort_keys=True)
print(f"OK: {len(guide)}/{len(ids)} enunciados extraídos → {os.path.relpath(OUT, ROOT)}")
if faltando:
    print("AVISO — ids sem enunciado no guia:", faltando, file=sys.stderr)
