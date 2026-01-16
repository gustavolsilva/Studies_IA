# 🎓 Databricks Exam Prep

Aplicação interativa para preparação do **Databricks Certified Data Engineer Associate** com suporte a modo prático e modo exame.

## ✨ Características

- ✅ **454 questões de alta qualidade** alinhadas com o guia oficial
- ✅ **Modo Prática** - Customize dificuldade, categorias e tempo
- ✅ **Modo Exame** - 90 minutos, 45 questões aleatórias
- ✅ **Histórico completo** - Acompanhe seu progresso
- ✅ **Formato Parquet** - 20x menor que JSON, auto-gerado
- ✅ **Setup automático** - Tudo isolado, sem dependências globais
- ✅ **Geração escalável** - Questões regeneradas em cada setup

## 📚 Banco de Questões

| Métrica | Valor |
|---------|-------|
| Total de questões | 67 |
| **Status** | ✅ Todas GENUÍNAS (sem templates repetidos) |
| Categorias | 5 |
| Dificuldades | 3 (Foundational 33%, Intermediate 40%, Advanced 27%) |
| Tipos | 4 (Conceptual 64%, Troubleshooting 19%, Code 9%, Architecture 7%) |
| Tamanho JSON | 73 KB |
| Distribuição | Balanceada por categoria/dificuldade/tipo |

### Distribuição de Questões

**Por Categoria:**
- Databricks Intelligence Platform: 19 (28%)
- Development and Ingestion: 14 (21%)
- Data Processing & Transformations: 11 (16%)
- Productionizing Data Pipelines: 12 (18%)
- Data Governance & Quality: 11 (16%)

**Por Dificuldade:**
- Foundational: 22 (33%)
- Intermediate: 27 (40%)
- Advanced: 18 (27%)

### Guia de Estudos vs. Simulado

O banco foi redesenhado com **67 questões genuínas e variadas** (não templates repetidos). Cada simulado seleciona **45 questões aleatórias** com distribuição balanceada:
- ✅ Sem repetição de IDs dentro de um exame
- ✅ Cada questão é única (enunciados diferentes)
- ✅ Balanceado por categoria (máx diferença: ±2%)
- ✅ Mix de dificuldades conforme exame real

**Nota**: O banco é regenerado automaticamente a cada `setup-environment.sh`, permitindo evolução constante do conteúdo.

## 📋 Pré-requisitos

- **Node.js** 20.19+ ou 22.12+ (instale via [nvm.sh](https://github.com/nvm-sh/nvm) se necessário)
- **Python** 3.8+
- **Git** (para clonar o repositório)

## 🚀 Começar em 3 passos

### 1️⃣ Clonar o repositório

```bash
git clone <seu-repositorio>
cd databricks-exam-prep
```

### 2️⃣ Executar setup automático

```bash
chmod +x setup-environment.sh
./setup-environment.sh
```

Este script faz tudo:
- ✅ Valida Node.js e Python
- ✅ Cria `.venv` (Python isolado)
- ✅ **Gera 454 questões** em `questions_enhanced.parquet` + JSON fallback
- ✅ Instala 366+ pacotes npm
- ✅ Valida TypeScript
- ✅ Compila Docker (se disponível)

**Tempo: ~3 minutos na primeira vez**

### 3️⃣ Iniciar aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📖 Passo-a-Passo Detalhado

### Se você está clonando em novo computador

1. **Instale Node.js** (se não tiver):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.nvm/nvm.sh
   nvm install 22
   ```

2. **Clone o projeto**:
   ```bash
   git clone <repo-url>
   cd databricks-exam-prep
   ```

3. **Execute o setup**:
   ```bash
   chmod +x setup-environment.sh
   ./setup-environment.sh
   ```
   
   Saída esperada:
   ```
   ✅ Requisitos validados: Node.js v22.x, Python 3.8+
   ✅ .venv criado
   ✅ Gerado 12 questoes para Parquet
   ✅ 366 pacotes instalados
   ✅ TypeScript validado
   ```

4. **Inicie o servidor**:
   ```bash
   npm run dev
   ```
   
   Saída esperada:
   ```
   ➜  Local:   http://localhost:3000/
   ➜  Network: http://10.255.255.254:3000/
   ```

5. **Acesse no navegador**: http://localhost:3000

---

## 🐳 Setup com Docker (Alternativa)

Se preferir virtualização completa:

```bash
docker-compose up
```

Acesse: http://localhost:3000

---

## 🛠️ Scripts Disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia servidor com hot-reload em :3000 |
| `npm run build` | Build de produção |
| `npm start` | Roda em produção |
| `npm run check` | Valida TypeScript |
| `npm run format` | Formata código (Prettier) |

---

## 🎮 Como Usar

### Modo Prática
1. Clique em **"Modo Prática"** na home
2. Selecione categorias, dificuldade e número de questões
3. Responda as perguntas
4. Veja feedback imediato com explicações

### Modo Exame
1. Clique em **"Modo Exame"** na home
2. Você tem 90 minutos para 45 questões aleatórias
3. Ao terminar, veja seu score e desempenho por categoria
4. Histórico salvo automaticamente

---

## 🔧 Manutenção & Expansão

### Adicionar Novas Questões

1. Abra `generate_questions_parquet.py`
2. Adicione uma nova questão no formato:
   ```python
   add_question(
       "Categoria",           # Uma das 5 categorias
       "intermediate",        # foundational | intermediate | advanced
       "conceptual",          # conceptual | code_interpretation | architecture | troubleshooting
       "Sua pergunta aqui?",
       {
           "A": "Opção A",
           "B": "Opção B",
           "C": "Opção C",
           "D": "Opção D"
       },
       "B",  # Resposta correta
       "Explicação detalhada (150-500 caracteres)...",
       "Dica concisa",
       refs["delta"],  # Referência (delta, dlt, lakehouse, etc)
       "Contexto/cenário"
   )
   ```

3. Regenere o banco:
   ```bash
   source .venv/bin/activate
   python3 generate_questions_parquet.py
   ```

4. Reinicie o servidor:
   ```bash
   npm run dev
   ```

---

## 📁 Arquivos Gerados

Após `setup-environment.sh`, você terá:

```
client/public/
├── questions_enhanced.parquet    ← Formato otimizado (primário)
├── questions_enhanced.json       ← Fallback (compatibilidade)
└── questions_expanded.json       ← Legacy (opcional)

.venv/                           ← Ambiente Python isolado (criado automaticamente)
node_modules/                    ← Dependências Node (criado automaticamente)
```

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + Vite 7 + TypeScript |
| **Styling** | Tailwind CSS 4 + Radix UI |
| **Backend** | Express 4 + Node 22 |
| **Dados** | Parquet (primário) + JSON (fallback) |
| **Build** | Vite |
| **Virtualização** | Docker + Docker Compose |

---

## ❌ Troubleshooting

### Erro: "Cannot find module 'wouter'"
```bash
npm install
npm run dev
```

### Erro: "questions_enhanced.json not found"
O arquivo é gerado por `setup-environment.sh`. Se faltar:
```bash
source .venv/bin/activate
python3 generate_questions_parquet.py
```

### Erro: Node version mismatch
```bash
nvm use 22
npm run dev
```

### Porta 3000 ocupada
Vite automaticamente acha outra porta. Verifique a saída do terminal.

### Reset completo (limpar tudo)
```bash
rm -rf .venv node_modules dist .vite client/public/questions_enhanced.*
./setup-environment.sh
npm run dev
```

### Vite não inicia ou porta 3000 congelada
```bash
# Matar processos usando a porta 3000
lsof -ti:3000 | xargs kill -9

# No Windows use:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Tentar novamente
npm run dev
```

---

## 📊 Estrutura de Dados

As questões seguem este formato (auto-transformado):

```json
{
  "id": 1,
  "category": "Databricks Intelligence Platform",
  "difficulty": "intermediate",
  "questionType": "conceptual",
  "question": "O que é um Lakehouse?",
  "options": {
    "A": "Opção A",
    "B": "Opção B",
    "C": "Opção C",
    "D": "Opção D"
  },
  "correctAnswer": "B",
  "rationale": "Explicação detalhada...",
  "tip": "Dica para lembrar",
  "officialReference": {
    "title": "Lakehouse Overview",
    "url": "https://docs.databricks.com/..."
  }
}
```

---

## 📈 Roadmap

- ✅ Setup automático e isolado
- ✅ Banco de dados com Parquet
- ✅ Modo Prática personalizado
- ✅ Modo Exame (90 min, 45 Q)
- ⏳ Expandir para 450+ questões (9/10 fidelidade)
- ⏳ Integração com API oficial Databricks
- ⏳ Mobile responsivo completo
- ⏳ Analytics de performance

---

## 🐛 Reportar Bugs

Se encontrar erros nas questões ou na aplicação:
1. Verifique se o `setup-environment.sh` foi executado
2. Limpe o cache e reinstale dependências
3. Tente o reset completo (veja Troubleshooting)

---

## 📞 Suporte

Para problemas:
1. Consulte **[SETUP_GUIDE.md](SETUP_GUIDE.md)** para configuração detalhada
2. Verifique a seção **Troubleshooting** acima
3. Execute: `./setup-environment.sh` para reset

---

## 📝 Licença

MIT

---

## 🎯 Foco

Esta ferramenta foi criada para:
- ✅ Estudar com **questões de qualidade**
- ✅ Simular o **exame real** (90 min, 45 Q)
- ✅ Acompanhar **progresso**
- ✅ Setup **zero-friction** em qualquer computador

**Boa sorte no exame! 🚀**
