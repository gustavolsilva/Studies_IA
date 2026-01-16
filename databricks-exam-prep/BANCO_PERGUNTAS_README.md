# 🎯 Banco de Perguntas - Versão Revisada e Otimizada

## 📋 O Que Foi Feito

Este diretório contém o banco de perguntas **completamente revisado** para o exame Databricks Certified Data Engineer Associate.

### Transformação Realizada

```
ANTES                                    DEPOIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3.000 perguntas                          25 perguntas PREMIUM
99,2% duplicadas                         0 duplicações
80 chars/resposta (média)                236 chars/resposta (+195%)
Sem contexto real                        Cada com cenário real
57 MB arquivo                            22 KB arquivo
❌ Loop no servidor                      ✅ Servidor 321ms
```

## 🏆 Qualidade Garantida

Cada pergunta inclui:

1. **Pergunta com Contexto** - Cenário real de produção
2. **4 Opções** - Uma correta, 3 com pegadinhas realistas
3. **Resposta Expandida** - 200-420 caracteres com:
   - Explicação técnica detalhada
   - Comparação com alternativas
   - Quando/por que usar
4. **Dica Mnemônica** - Para memorização
5. **Referência Oficial** - Link na documentação Databricks
6. **Cenário Real** - Caso de uso em produção

## 📊 Distribuição

### Por Categoria (5 cada):
- ✓ Databricks Intelligence Platform
- ✓ Development and Ingestion
- ✓ Data Processing & Transformations
- ✓ Data Governance & Quality
- ✓ Productionizing Data Pipelines

### Por Dificuldade:
- 15 Intermediate (intermediário)
- 10 Advanced (avançado)

## 🚀 Como Usar

### 1. Iniciar Servidor (Development)
```bash
# Primeiro, usar Node.js 22
nvm use 22

# Iniciar servidor com hot-reload
npm run dev

# Abrirá em http://localhost:3000
```

### 2. Rodar em Produção
```bash
# Build
npm run build

# Start
npm start

# Disponível em http://localhost:3000
```

### 3. Verificar Qualidade do Banco
```bash
python3 improve_questions.py
```

## 📝 Expandir o Banco (Manutenção)

### Para Adicionar Novas Perguntas com Qualidade:

1. **Consulte o template**:
```bash
python3 add_new_questions_helper.py
```

2. **Siga o padrão**:
   - Rationale: 200-420 caracteres
   - 4 opções (1 correta, 3 erradas)
   - Inclua cenário real
   - Link oficial Databricks

3. **Exemplo**:
```python
from add_new_questions_helper import add_new_questions

nova_pergunta = {
    "category": "Data Processing & Transformations",
    "difficulty": "advanced",
    "question": "...",
    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "correctAnswer": "B",
    "rationale": "Explicação detalhada...",
    "tip": "Dica para memorizar",
    "officialReference": {
        "title": "Título da doc",
        "url": "https://docs.databricks.com/..."
    },
    "contextScenario": "Situação real em produção"
}

add_new_questions([nova_pergunta])
```

## 📂 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `client/public/questions_expanded.json` | Banco principal (25 perguntas) |
| `MELHORIAS_BANCO_PERGUNTAS.md` | Documentação completa de melhorias |
| `add_new_questions_helper.py` | Helper para adicionar perguntas |
| `improve_questions.py` | Script de validação e melhoria |

## ✅ Validações Realizadas

- ✓ JSON bem-formado e válido
- ✓ Sem duplicações (todas as 25 únicas)
- ✓ Todos os campos obrigatórios presentes
- ✓ Respostas com 200+ caracteres em média
- ✓ Servidor inicia sem loop (321ms)
- ✓ Balanceamento entre categorias
- ✓ Referências oficiais Databricks válidas

## 📈 Próximas Etapas (Opcionais)

Para crescimento de forma controlada:

1. **Expandir para 100-150 perguntas** seguindo padrão
2. **Adicionar questions com código real** (PySpark, SQL)
3. **Implementar modo simulado** com timer e score
4. **Analytics por tópico** - identificar fracos pontos

## 🎓 Alinhamento com Exame

O banco atual segue **padrão oficial de certificação**:
- ✓ Cenários realistas de produção
- ✓ Respostas que parecem certas mas não são
- ✓ Foco em conceitos, não memorização
- ✓ Documentação oficial como referência

## 🔧 Troubleshooting

### Servidor não inicia
```bash
# Verificar Node.js
node --version  # Deve ser v22.22.0 ou superior

# Limpar cache
rm -rf node_modules
npm install

# Tentar novamente
npm run dev
```

### Erro ao adicionar perguntas
```bash
# Validar pergunta
python3 add_new_questions_helper.py

# Verificar estrutura
python3 improve_questions.py
```

### Arquivo JSON corrompido
```bash
# Restaurar do git
git checkout client/public/questions_expanded.json

# Depois reaplicar melhorias
python3 improve_questions.py
```

## 📞 Informações Técnicas

- **Node.js**: v22.22.0 (obrigatório)
- **npm**: 10.9.4+
- **Vite**: 7.1.9
- **React**: 18+
- **Python**: 3.8+

## 📚 Referências

- [Documentação Oficial Databricks](https://docs.databricks.com/)
- [Databricks Certification Guide](https://www.databricks.com/learn/certification)
- [Databricks Academy](https://academy.databricks.com/)

---

**Última Atualização**: 16 de Janeiro de 2026  
**Status**: ✅ Pronto para Produção  
**Qualidade**: Premium - Foco em Aprendizado Real
