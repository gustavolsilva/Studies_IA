# 🛠️ Tools - Scripts de Geração de Questões

Esta pasta contém scripts para gerar e manter o banco de questões do projeto.

## 📄 Scripts Ativos

### `generate_questions_enhanced.py` ⭐ (PRINCIPAL)
Script principal para gerar o banco de questões normalizado usado pela aplicação.

**Uso:**
```bash
python3 tools/generate_questions_enhanced.py
```

**Output:**
- `client/public/questions_enhanced.json` - Banco principal (usado pela aplicação)

**Características:**
- 67+ questões de alta qualidade
- Alternativas balanceadas por tamanho
- Categorias balanceadas
- Validação de formato

### `generate_questions_parquet.py`
Gera versão Parquet compactada do banco de questões (futuro).

**Uso:**
```bash
python3 tools/generate_questions_parquet.py
```

**Output:**
- `client/public/questions_enhanced.parquet` (compactado)
- `client/public/questions_enhanced.json` (fallback)

### `normalize_answer_lengths.py`
Normaliza o tamanho das alternativas incorretas para ficarem semelhantes à correta.

**Uso:**
```bash
python3 tools/normalize_answer_lengths.py
```

**O que faz:**
- Analisa diferenças de tamanho entre alternativas
- Normaliza alternativas incorretas para ficarem ~15 chars da correta
- Evita pistas visuais óbvias
- Gera relatório antes/depois

**Output:**
- `client/public/questions_enhanced_normalized.json`

### `generate_questions.py` (LEGADO)
Script antigo de geração. Mantido para referência histórica.

## 📦 Arquivo de Scripts Antigos

A pasta `archive/` contém scripts antigos que não são mais usados ativamente:
- Scripts de balanceamento intermediários
- Scripts de expansão de banco
- Scripts de correção de tamanho
- Scripts de melhoria incremental

Esses scripts foram mantidos para referência, mas não são necessários para o funcionamento atual do projeto.

## 🔄 Fluxo de Trabalho

1. **Editar questões**: Modificar `generate_questions_enhanced.py`
2. **Gerar banco**: `python3 tools/generate_questions_enhanced.py`
3. **Normalizar tamanhos**: `python3 tools/normalize_answer_lengths.py`
4. **Substituir original**: `mv client/public/questions_enhanced_normalized.json client/public/questions_enhanced.json`
5. **Testar**: `npm run dev` e verificar questões na aplicação

## 📝 Formato das Questões

```json
{
  "id": 1,
  "category": "Databricks Intelligence Platform",
  "difficulty": "foundational",
  "questionType": "conceptual",
  "question": "Texto da pergunta",
  "options_A": "Opção A",
  "options_B": "Opção B",
  "options_C": "Opção C",
  "options_D": "Opção D",
  "correctAnswer": "A",
  "rationale": "Explicação detalhada (150-500 chars)",
  "tip": "Dica rápida",
  "reference_title": "Título da referência",
  "reference_url": "https://docs.databricks.com/...",
  "contextScenario": "Contexto da questão"
}
```

## ⚠️ Importante

- **Sempre** rode `normalize_answer_lengths.py` após gerar/modificar questões
- **Sempre** teste na aplicação antes de commitar
- **Nunca** edite `questions_enhanced.json` diretamente - use os scripts geradores
- Mantenha alternativas com tamanhos semelhantes (diferença máxima ~15 chars)
