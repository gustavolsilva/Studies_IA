# Databricks Exam Prep - Setup & Deployment Guide

## 📋 Sumário

- **Ambiente Isolado**: Python virtualenv + Node.js local (sem poluir SO)
- **Geração Automática**: Banco de dados gerado em primeiro setup via script Python
- **Formato Otimizado**: Questões em Parquet (compactação 10x) com fallback JSON
- **Virtualização**: Docker + Docker Compose para dev/prod isolado
- **Cross-platform**: Windows (WSL2), macOS, Linux

---

## 🚀 Setup Rápido (Recomendado)

### Opção 1: Setup Local com Virtualenv

```bash
cd databricks-exam-prep
chmod +x setup-environment.sh
./setup-environment.sh
```

**O que faz:**
1. ✅ Valida Node.js 20.19+ e Python 3.8+
2. ✅ Cria `.venv` isolado (sem poluir SO)
3. ✅ Instala pandas + pyarrow
4. ✅ **Gera banco de questões em Parquet**
5. ✅ Instala dependências Node.js
6. ✅ Compila imagem Docker (opcional)

**Resultado:**
```
client/public/
  ├── questions_enhanced.parquet (6 KB, compactado)
  └── questions_enhanced.json (fallback, 24 KB)
.venv/
  ├── bin/python3, pip, etc. (isolado)
node_modules/ (local, não poluir SO)
```

### Opção 2: Docker Compose (Recomendado para equipes)

```bash
# Build + Run container de produção
docker-compose up

# ou modo desenvolvimento com hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up dev
```

---

## 📦 Estrutura de Ambiente

### `.venv` - Virtualenv Python (Isolado)

Criado no projeto, **não precisa instalar globalmente**:
```bash
# Automaticamente feito por setup-environment.sh
python3 -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install pandas pyarrow
```

**Vantagens:**
- ✅ Sem poluir `/usr/local` ou `$PROFILE`
- ✅ Cada projeto tem suas próprias dependências
- ✅ Fácil remover: `rm -rf .venv`

### `node_modules` - Node.js (Local)

Instalado com `npm ci` ou `pnpm install`:
```bash
npm install
```

**Para WSL2/Windows:**
```bash
npm install --legacy-peer-deps  # Se houver conflitos
```

---

## 🔄 Geração Automática de Dados

### Como Funciona

1. **Durante Setup (`./setup-environment.sh`)**:
   - Ativa `.venv`
   - Executa `python3 generate_questions_parquet.py`
   - Gera `client/public/questions_enhanced.parquet`
   - Fallback: `client/public/questions_enhanced.json`

2. **Gerador Python** (`generate_questions_parquet.py`):
   - ✅ Cross-platform (Windows, macOS, Linux)
   - ✅ Usa pandas + pyarrow (sem Spark)
   - ✅ Gera Parquet + JSON automaticamente
   - ✅ Valida integridade dos dados

3. **Aplicação Carrega Dados**:
   - Tenta: Parquet (otimizado) → JSON enhanced → JSON expanded
   - Fallback automático se formato não disponível

### Regenerar Dados Manualmente

```bash
# Ativar virtualenv
source .venv/bin/activate

# Rodar gerador
python3 generate_questions_parquet.py

# Output
# ✅ Gerado 12 questoes para Parquet
# 💾 Salvo Parquet: client/public/questions_enhanced.parquet
# 💾 Salvo JSON (fallback): client/public/questions_enhanced.json
# 📏 Tamanhos: Parquet 6.1 KB, JSON 24.3 KB (4.0x menor)
```

---

## 🐳 Docker - Virtualização Completa

### Imagens

1. **Production** (`Dockerfile`):
   - Build otimizado multi-stage
   - ✅ Gera dados durante build
   - ✅ Runtime leve (Alpine)
   - ✅ Health check

2. **Development** (`Dockerfile.dev`):
   - ✅ Hot-reload com Vite
   - ✅ Volume mounts para código
   - ✅ Python environment para debug

### Usar Docker

```bash
# Build e rodar produção
docker build -t databricks-exam-prep:latest .
docker run -p 3000:3000 databricks-exam-prep:latest

# Usar docker-compose (recomendado)
docker-compose up                    # Produção (porta 3000)
docker-compose up dev                # Desenvolvimento (porta 3001)
docker-compose down                  # Parar tudo
docker-compose down -v               # Remover volumes também
```

**Vantagens do Docker:**
- ✅ Ambiente isolado 100% (sem poluir SO)
- ✅ Mesmo ambiente em dev/CI/prod
- ✅ Fácil compartilhar setup entre devs
- ✅ Dados gerados no build

---

## 📊 Formato Parquet vs JSON

### Parquet (Recomendado)

- ✅ **10x menor**: 6 KB vs 60 KB
- ✅ **Tipado**: Schema forte, validação automática
- ✅ **Compressão**: Snappy (default)
- ✅ **Otimizado**: Ideal para analytics
- ⚠️ Requer parser (DuckDB, pyarrow, etc.)

### JSON (Fallback)

- ✅ **Universal**: Suporte em qualquer linguagem
- ✅ **Debug-friendly**: Humanlegível
- ⚠️ **Maior**: 60+ KB
- ⚠️ **Sem tipagem**: Apenas strings

### Estratégia

```
App Carrega:
  1. Parquet (se DuckDB disponível) → 6 KB ⚡
  2. JSON enhanced (fallback) → 24 KB 🟢
  3. JSON expanded (última opção) → 300 KB 🟡
```

---

## 🛠️ Desenvolver Localmente

### Modo Dev (Com Hot-Reload)

```bash
# Ativar ambiente
source .venv/bin/activate

# Dev (port 3000)
npm run dev

# Acessa em http://localhost:3000
# Alterações no código recarregam automaticamente
```

### Gerar Novo Banco de Dados

```bash
source .venv/bin/activate
python3 generate_questions_parquet.py
```

### Adicionar Questões

Edite `generate_questions_parquet.py`, adicione mais chamadas `add_question()`:

```python
add_question(
    "Databricks Intelligence Platform", "intermediate", "conceptual",
    "Pergunta aqui?",
    {"A": "...", "B": "...", "C": "...", "D": "..."},
    "A",  # resposta correta
    "Rationale aqui (150-500 chars)...",
    "Dica curta",
    refs["delta"],
    "Contexto de cenário"
)
```

Depois regenere:
```bash
python3 generate_questions_parquet.py
```

---

## 🚀 Deploy em Produção

### Docker (Recomendado)

```bash
# Build
docker build -t databricks-exam-prep:latest .

# Push para registry (Docker Hub, ECR, etc.)
docker tag databricks-exam-prep:latest seu-registry/databricks-exam-prep:latest
docker push seu-registry/databricks-exam-prep:latest

# Deploy em cluster (Kubernetes, ECS, etc.)
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  databricks-exam-prep:latest
```

### Node.js Local

```bash
npm run build
npm start
# Acessa em http://localhost:3000
```

---

## 📝 Troubleshooting

### ❌ "python3 command not found"

```bash
# macOS
brew install python3

# Ubuntu/Debian
sudo apt-get install python3 python3-venv

# Windows: Instale Python de https://www.python.org
```

### ❌ ".venv: Permission denied"

```bash
chmod +x setup-environment.sh
./setup-environment.sh
```

### ❌ "Docker: command not found"

Instale Docker Desktop de https://www.docker.com/products/docker-desktop

### ❌ "Parquet não carrega, apenas JSON"

DuckDB não está disponível no navegador. Isso é normal:
- App usa JSON como fallback automaticamente
- Parquet só funciona com backend que parse (Node.js)
- JSON é suficiente para a maioria dos casos

### ❌ "Port 3000 já está em uso"

```bash
# Mudar porta
docker-compose.yml: ports: ["3001:3000"]

# Ou kill processo existente
lsof -i :3000
kill -9 <PID>
```

---

## ✅ Checklist de Setup

- [ ] Node.js 20.19+ instalado (`node --version`)
- [ ] Python 3.8+ instalado (`python3 --version`)
- [ ] Repo clonado em `~/Projects/databricks-exam-prep`
- [ ] Rodou `./setup-environment.sh` com sucesso
- [ ] `.venv` criado e ativado
- [ ] `node_modules` instalado
- [ ] `client/public/questions_enhanced.parquet` ou `.json` gerado
- [ ] `npm run dev` funciona (acessa localhost:3000)
- [ ] (Opcional) Docker também funciona

---

## 📚 Referências

- [Python venv docs](https://docs.python.org/3/library/venv.html)
- [Docker Compose docs](https://docs.docker.com/compose/)
- [Parquet format](https://parquet.apache.org/)
- [Pandas Parquet I/O](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_parquet.html)

