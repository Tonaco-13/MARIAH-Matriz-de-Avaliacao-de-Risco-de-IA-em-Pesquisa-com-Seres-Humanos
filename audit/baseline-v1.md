# Baseline v1.0.0 — guia v45 (MARIAH)

- Data: 2026-08-14
- Commit: 90327ce6070b787fec27a1e3b2adceb8e6765373
- SHA256 data.ts: c41c6b9d13382965b04f95aec6debef4234882eb2e665c56bd7ac137ed861450
- SHA256 utils.ts: 13954db694f897f7f65b0d22b44f5449316ce57c09492d3392f28d854d0fbcc8

## Saída do verify-math
```

=== 1. Qualitative structure ===
  ✓ Base axes count (no database): 5
  ✓ Axes with database: 6
  ✓ Base total questions: 42
  ✓ With-db total questions: 47

=== 2. Quantitative structure ===
  ✓ Base blocks count: 7
  ✓ Blocks with database: 8
  ✓ Sum of maxPontos base: 238
  ✓ Sum of maxPontos with db: 267
  ✓ Block 6.b maxPontos: 29

=== 3. Thresholds ===
  ✓ Base thresholds maxScore: 238
  ✓ Com-banco thresholds maxScore: 267
  ✓ Base Level IV min: 181
  ✓ Com-banco Level IV min: 203

=== 4. Bloco 7 bidirectional (bug fix) ===
  ✓ Bloco 7 max (all risk, no mitigation): 75
  ✓ Bloco 7 min (all mitigations applied, no risk): 0

=== 5. Quantitative total maxima reachable ===
  ✓ Worst-case total (base, no db): 238
  ✓ Worst-case total (with db): 267

=== 6. Level mapping ===
  ✓ score=0 → I (base): "I"
  ✓ score=52 → II (base): 52
  ✓ score=52 → Level II (base): "II"
  ℹ test ans50 real score = 51
  ✓ boundary score → Level II: "II"
  ℹ Bloco 5 all-risk real score = 52 (doc says 52)
  ✓ Bloco 5 full risk = 52 pts → Level II: "II"

=== 7. Cláusula de Prevalência Ética ===
  ✓ P4.1=sim → Level IV: "IV"
  ✓ P4.1=sim → clausulaPrevalencia=true: true

=== 8. Eliminatório Res 738 ===
  ✓ P6.b.2=nao triggers eliminatório: "P6.b.2"
  ✓ P6.b.2=nao does NOT trigger when usesDatabase=false: null
  ✓ 3.b.2=nao triggers eliminatório in Version A: "3.b.2"

=== 9. Qualitative Eixo 3.b special elevation ===
  ✓ Empty answers with db → Level I: "I"
  ✓ 1 risk on 3.b → axis Level III: "III"
  ✓ Final level is III due to 3.b: "III"
  ✓ 3 risks on 3.b → axis Level IV: "IV"
  ✓ Final level IV due to 3.b: "IV"

=== 9b. P6.b.2 "Não se aplica" (hasNaOption) ===
  ✓ P6.b.2=na → Bloco 6.b score = 0: 0
  ✓ P6.b.2=na → sem eliminatório: null
  ✓ P6.b.2=nao → eliminatório acionado: "P6.b.2"
  ✓ P6.b.2=sim → Bloco 6.b score = 0: 0
  ✓ P6.b.2.hasNaOption === true: true

=== 9c. Versão A — 3.b.2 "Não se aplica" (hasNaOption) ===
  ✓ 3.b.2.hasNaOption === true: true
  ✓ 3.b.2 ainda é eliminatório: true
  ✓ 3.b.2 riskAnswer = nao: "nao"
  ✓ 3.b.2=na → SEM eliminatório (Versão A): null
  ✓ 3.b.2=nao → eliminatório acionado (Versão A): "3.b.2"
  ✓ 3.b.2=sim → SEM eliminatório (Versão A): null
  ✓ 3.b.2=na → countRiskAnswersAxis = 0: 0

=== 10. Questions count ===
  ✓ Quant total questions (base): 52
  ✓ Quant total questions (with db): 57

=== SUMMARY ===
  Passed: 46
  Failed: 0
```
