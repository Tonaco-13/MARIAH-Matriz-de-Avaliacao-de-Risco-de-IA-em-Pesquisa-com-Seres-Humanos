#!/bin/bash
# Gera as versões es dos anexos .docx a partir dos canônicos pt-BR em public/ (pendência ES-DL, LOG #71).
# Uso (na raiz do repo): bash scripts/traducao-docx/gerar.sh <MERGE_RUNS.py>
#   MERGE_RUNS.py = script que mescla runs de mesma formatação num .docx desempacotado
#   (usado: merge_runs.py da skill docx). Necessário porque o Word fragmenta o texto em runs.
# Cada mapa (mapas/<nome>.es.py) é o par pt → es auditável, segmento a segmento; None = manter
# (referências bibliográficas, números). aplicar.py aborta se sobrar segmento sem tradução.
set -euo pipefail
MERGE="$1"
TMP="$(mktemp -d)"
declare -A ANCORA=(
  [guia-validacao-local-mariah]="Guia de Validação Local da MARIAH pelos Comitês de Ética em Pesquisa"
  [nota-tecnica-premissas-mariah]="MARIAH Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos · Versão preliminar · Junho de 2026"
  [suplemento-salvaguardas-mariah]="MARIAH Matriz de Avaliação de Risco de Inteligência Artificial em Pesquisa com Seres Humanos · Versão preliminar · Julho de 2026"
)
for nome in "${!ANCORA[@]}"; do
  mkdir -p "$TMP/$nome" && (cd "$TMP/$nome" && unzip -q "$OLDPWD/public/$nome.docx")
  python3 "$MERGE" "$TMP/$nome" >/dev/null
  python3 scripts/traducao-docx/aplicar.py "$TMP/$nome" "scripts/traducao-docx/mapas/$nome.es.py" "${ANCORA[$nome]}" "public/$nome-es.docx" "public/$nome.docx"
done
rm -rf "$TMP"
