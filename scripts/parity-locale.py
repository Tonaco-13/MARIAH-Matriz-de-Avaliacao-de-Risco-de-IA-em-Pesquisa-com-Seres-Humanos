#!/usr/bin/env python3
"""
parity-locale — verificação estrutural de identidade pt-BR (i18n dark-launch).

Modos:
  capture  → gera a baseline NDTI (forma normalizada das 4 rotas) em gate/baseline-ndti/
  check    → compara o build atual (flag off) contra a baseline; exit 1 em divergência

Critério de identidade (emenda 3.2 / E4): nós de texto + estrutura do DOM,
tolerando atributos benignos do framework. A normalização abaixo:
  - captura <title> e <meta name="description">;
  - captura, em ordem de documento, os nós de texto visíveis do <body>
    (colapsando espaços) e os hrefs de <a> relevantes;
  - descarta <script>/<style>/<head> (exceto title/description) e URLs de asset
    hasheadas (/_next/...), que variam por build sem mudar o conteúdo.

O resolvedor de caminho tolera as duas estruturas do build:
  - pré-i18n:  .next/server/app/index.html, .next/server/app/instrucoes.html …
  - pós-i18n:  .next/server/app/pt-BR.html, .next/server/app/pt-BR/instrucoes.html …
A baseline (gate/baseline-ndti/*.txt) é o conteúdo normalizado — independente do caminho.

Fonte única da matriz permanece a spec; este script NÃO lê números da matriz.
Uso: python3 scripts/parity-locale.py {capture|check}
"""
import sys, os, re
from html.parser import HTMLParser

APP_DIR = os.path.join(".next", "server", "app")
BASELINE_DIR = os.path.join("gate", "baseline-ndti")

# rota lógica -> nome-base do arquivo de baseline (gate/baseline-ndti/<nome>.txt)
ROUTES = {
    "/": "index",
    "/instrucoes": "instrucoes",
    "/transparencia": "transparencia",
    "/validacao": "validacao",
}
SKIP = {"script", "style", "noscript", "template"}


def html_path(name: str) -> str:
    """HTML prerenderizado da rota pt-BR, tolerando estrutura pré/pós-i18n."""
    if name == "index":
        candidates = [
            os.path.join(APP_DIR, "pt-BR.html"),
            os.path.join(APP_DIR, "index.html"),
        ]
    else:
        candidates = [
            os.path.join(APP_DIR, "pt-BR", name + ".html"),
            os.path.join(APP_DIR, name + ".html"),
        ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return candidates[0]


def _norm_href(href: str) -> str:
    if not href:
        return ""
    if href.startswith("/_next/") or "/_next/" in href:
        return "/_next/*"          # asset hasheado — irrelevante ao conteúdo
    href = href.split("?")[0]       # remove querystring volátil
    return href


class Norm(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.skip_depth = 0
        self.in_head = False
        self.in_title = False
        self.title = ""
        self.desc = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "head":
            self.in_head = True
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.desc = re.sub(r"\s+", " ", a.get("content", "")).strip()
        if tag in SKIP:
            self.skip_depth += 1
        if tag == "a" and not self.in_head and self.skip_depth == 0:
            h = _norm_href(a.get("href", ""))
            dl = " download" if "download" in a else ""
            if h:
                self.out.append(f"[a href={h}{dl}]")

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False
        if tag == "title":
            self.in_title = False
        if tag in SKIP and self.skip_depth > 0:
            self.skip_depth -= 1

    def handle_data(self, data):
        if self.skip_depth:
            return
        t = re.sub(r"\s+", " ", data).strip()
        if not t:
            return
        if self.in_title:
            self.title += t
        elif not self.in_head:
            self.out.append(t)


def normalize(html: str) -> str:
    p = Norm(); p.feed(html)
    title = re.sub(r"\s+", " ", p.title).strip()
    head = [f"TITLE: {title}", f"META-DESC: {p.desc}", "--"]
    return "\n".join(head + p.out) + "\n"


def _read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def capture():
    os.makedirs(BASELINE_DIR, exist_ok=True)
    n = 0
    for route, name in ROUTES.items():
        src = html_path(name)
        if not os.path.exists(src):
            print(f"  ERRO: não encontrado {src} (rode `npm run build` antes)"); sys.exit(2)
        norm = normalize(_read(src))
        out = os.path.join(BASELINE_DIR, name + ".txt")
        with open(out, "w", encoding="utf-8") as f:
            f.write(norm)
        print(f"  baseline: {route:14s} -> {out}  ({len(norm.splitlines())} linhas)")
        n += 1
    print(f"OK: {n}/4 rotas capturadas em {BASELINE_DIR}")


def check():
    if not os.path.isdir(BASELINE_DIR):
        print("  ERRO: baseline ausente — rode `capture` primeiro."); sys.exit(2)
    diffs = 0
    for route, name in ROUTES.items():
        src = html_path(name)
        base = os.path.join(BASELINE_DIR, name + ".txt")
        if not os.path.exists(src):
            print(f"  ERRO: build ausente para {route} ({src})"); sys.exit(2)
        cur = normalize(_read(src)).splitlines()
        ref = _read(base).splitlines()
        if cur == ref:
            print(f"  OK   {route}")
        else:
            diffs += 1
            print(f"  DIFF {route}: baseline {len(ref)} linhas x atual {len(cur)} linhas")
            import difflib
            for line in list(difflib.unified_diff(ref, cur, lineterm=""))[:12]:
                print("      " + line)
    if diffs:
        print(f"FALHOU: {diffs} rota(s) divergem da baseline NDTI (pt-BR não idêntico).")
        sys.exit(1)
    print("OK: pt-BR idêntico à baseline NDTI (flag off).")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    if mode == "capture":
        capture()
    elif mode == "check":
        check()
    else:
        print("uso: python3 scripts/parity-locale.py {capture|check}"); sys.exit(2)
