#!/usr/bin/env python3
"""Extrai texto de docx preservando estilos de parágrafo e tabelas."""
import sys
from pathlib import Path
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph


def iter_block_items(parent):
    from docx.document import Document as _Doc
    from docx.oxml.ns import qn
    if isinstance(parent, _Doc):
        parent_elm = parent.element.body
    else:
        parent_elm = parent._element
    for child in parent_elm.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, parent)
        elif child.tag == qn("w:tbl"):
            yield Table(child, parent)


def dump(path: Path, out: Path):
    doc = Document(str(path))
    lines = []
    for block in iter_block_items(doc):
        if isinstance(block, Paragraph):
            style = block.style.name if block.style else ""
            text = block.text.strip()
            if text:
                lines.append(f"[{style}] {text}")
        else:
            lines.append("=== TABLE START ===")
            for row in block.rows:
                cells = [c.text.strip().replace("\n", " / ") for c in row.cells]
                lines.append(" | ".join(cells))
            lines.append("=== TABLE END ===")
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"{path.name}: {len(lines)} lines -> {out.name}")


if __name__ == "__main__":
    base = Path(__file__).parent
    for name in sys.argv[1:]:
        dump(base / name, base / (Path(name).stem + ".txt"))
