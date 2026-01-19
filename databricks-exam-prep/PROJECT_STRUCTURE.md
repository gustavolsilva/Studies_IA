# 📂 Estrutura do Projeto - Databricks Exam Prep

## Organização Final

```
databricks-exam-prep/
│
├── 📄 README.md                    # Documentação principal
├── 📄 PROJECT_STRUCTURE.md         # Este arquivo (mapa de referências)
│
├── 🔧 CONFIGURAÇÕES (root)
│   ├── package.json                # Dependências Node.js
│   ├── pnpm-lock.yaml              # Lock file pnpm
│   ├── tsconfig.json               # TypeScript root config
│   ├── tsconfig.node.json          # TypeScript para build tools
│   ├── vite.config.ts              # Vite build config
│   ├── components.json             # ShadcnUI components index
│   └── .nvmrc / .prettierrc*        # Node version & formatter config
│
├── 🔨 SCRIPTS DE SETUP
│   ├── setup-environment.sh         # Setup automático (PRINCIPAL)
│   └── shell-setup.sh               # Setup alternativo (legacy)
│
├── 📁 APLICAÇÃO (Runtime)
│   ├── client/                      # Frontend React (ESSENCIAL)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── questionsLoader.ts    # ⚡ Carrega banco de questões
│   │   │   │   └── utils.ts              # Shuffle & helpers
│   │   │   ├── hooks/
│   │   │   │   ├── useQuizState.ts       # Estado do quiz
│   │   │   │   └── useQuizHistory.ts     # Histórico salvo
│   │   │   ├── pages/
│   │   │   │   ├── ExamMode.tsx          # Modo prova (90min, 45Q)
│   │   │   │   ├── PracticeMode.tsx      # Modo livre
│   │   │   │   └── (outros)
│   │   │   └── (components, contexts, etc)
│   │   └── public/
│   │       ├── questions_enhanced.json    # 📦 BANCO OFICIAL (único!)
│   │       ├── manifest.webmanifest       # PWA manifest
│   │       └── sw.js                      # Service Worker
│   │
│   ├── server/                      # Backend Express (ESSENCIAL)
│   │   └── index.ts                 # Serve assets em produção
│   │
│   └── shared/                      # Código compartilhado
│       └── const.ts                 # Constantes (COOKIE_NAME, etc)
│
├── 🛠️  FERRAMENTAS & SCRIPTS
│   ├── tools/                       # 📦 SCRIPTS DE DESENVOLVIMENTO
│   │   ├── generate_questions_parquet.py      # ⚡ Principal (setup)
│   │   ├── generate_questions_enhanced.py     # Para Docker
│   │   ├── add_premium_questions.py           # Adicionar Q's
│   │   ├── balance_questions.py               # Balancear banco
│   │   ├── expand_*.py                        # Expansão do banco
│   │   ├── improve_questions.py               # Melhorias
│   │   ├── test_loader.js                     # Teste de carregamento
│   │   └── test_shuffle_sim.py                # Teste de embaralhamento
│   │
│   └── patches/                     # Correções npm
│       └── wouter@3.7.1.patch       # Patch de dependência
│
├── 🐳 VIRTUALIZAÇÃO
│   └── docker/                      # 📦 Docker configs
│       ├── Dockerfile               # Build produção
│       ├── Dockerfile.dev           # Build desenvolvimento
│       └── docker-compose.yml       # Orquestração
│
├── 📚 DOCUMENTAÇÃO
│   └── docs/                        # Documentação histórica
│       ├── BANCO_PERGUNTAS_README.md
│       ├── ENVIRONMENT_SETUP.md
│       ├── EXAM_DISTRIBUTION.md
│       ├── FIDELITY_REPORT.md
│       ├── QUESTIONS_REDESIGN.md
│       ├── SETUP_GUIDE.md
│       └── (outros)
│
└── 🔒 GIT
    ├── .gitignore                   # Padrões ignorados
    └── .gitkeep                     # Marker para dirs vazios
```

---

## 🔄 Fluxo de Dados & Referências

### Setup Inicial

```
setup-environment.sh
  ├─► Valida Node.js + Python
  ├─► Cria .venv
  ├─► python3 tools/generate_questions_parquet.py
  │   └─► Gera: client/public/questions_enhanced.json
  ├─► npm install (pnpm)
  ├─► npm run check (TypeScript)
  └─► docker build -f docker/Dockerfile (se Docker disponível)
```

### Runtime (Desenvolvimento)

```
npm run dev
  ├─► Vite serve: http://localhost:3000
  ├─► client/src/main.tsx → React app
  ├─► client/src/lib/questionsLoader.ts
  │   └─► fetch('/questions_enhanced.json')
  │       └─► client/public/questions_enhanced.json
  └─► Shuffles opções à cada sessão
```

### Runtime (Produção)

```
npm run build
  ├─► Vite compila: client/ → dist/public/
  ├─► esbuild: server/index.ts → dist/index.js
  └─► npm start
      └─► server/index.ts
          └─► Serve dist/public/ como assets
              └─► questions_enhanced.json
```

### Docker

```
docker build -f docker/Dockerfile
  ├─► python3 tools/generate_questions_enhanced.py
  │   └─► Gera: client/public/questions_enhanced.json
  ├─► npm ci + npm run build
  └─► Final stage: Serve via Express

docker-compose -f docker/docker-compose.yml
  ├─► Constrói app + dev services
  └─► Compartilha client/public entre ambos
```

---

## ✅ Referências Críticas (Não Quebrar!)

### 1. **Carregamento do Banco de Questões**

| Arquivo | Referência | Tipo | Status |
|---------|-----------|------|--------|
| `client/src/lib/questionsLoader.ts` | `/questions_enhanced.json` | Fetch URL | ✅ Válida |
| `setup-environment.sh` | `tools/generate_questions_parquet.py` | Path Python | ✅ Atualizado |
| `docker/Dockerfile` | `tools/generate_questions_enhanced.py` | Path Python | ✅ Atualizado |
| `docker/Dockerfile.dev` | `tools/generate_questions_enhanced.py` | Path Python | ✅ Atualizado |

### 2. **Docker Build Context**

| Arquivo | Campo | Valor Anterior | Valor Novo | Status |
|---------|-------|-----------------|------------|--------|
| `docker/docker-compose.yml` | context | `.` | `..` | ✅ Atualizado |
| `docker/docker-compose.yml` | dockerfile | `Dockerfile` | `docker/Dockerfile` | ✅ Atualizado |
| `docker/docker-compose.yml` | volumes | `./client/public` | `../client/public` | ✅ Atualizado |

### 3. **Setup Script Paths**

| Referência Anterior | Referência Nova | Status |
|---------------------|-----------------|--------|
| `generate_questions_parquet.py` | `tools/generate_questions_parquet.py` | ✅ Atualizado |
| `docker build -t ... .` | `docker build -t ... -f docker/Dockerfile .` | ✅ Atualizado |
| `docker-compose up` | `docker-compose -f docker/docker-compose.yml up` | ✅ Atualizado |

---

## 🧪 Validação de Integridade

```bash
# 1. Verificar estructura
find . -maxdepth 1 -type f ! -name ".*" | grep -E "\.py$|\.md$" 
  # ❌ Não deve retornar .py (devem estar em tools/)

# 2. Verificar banco de questões
ls -la client/public/questions_enhanced.json
  # ✅ Deve existir (gerado por setup-environment.sh)

# 3. Verificar referências
grep -r "generate_questions_parquet" docker/ setup-environment.sh
  # ✅ Deve apontar para tools/

# 4. Testar carregamento
npm run dev
  # ✅ Deve carregar sem erros em http://localhost:3000

# 5. Testar build
npm run build
  # ✅ Deve compilar sem erros

# 6. Testar Docker
docker-compose -f docker/docker-compose.yml up
  # ✅ Deve rodar sem erros
```

---

## 📋 Checklist de Movimentação

- [x] Python scripts → `tools/`
- [x] Docker files → `docker/`
- [x] Docs → `docs/`
- [x] Setup script referências atualizadas
- [x] Docker referências atualizadas
- [x] README atualizado
- [x] Banco oficial isolado em `client/public/questions_enhanced.json`
- [x] Sem .py, Dockerfile, docker-compose na raiz

---

## 🚀 Próximas Ações

1. **Testar Setup:**
   ```bash
   rm -rf .venv node_modules client/public/questions_enhanced.json
   chmod +x setup-environment.sh
   ./setup-environment.sh
   npm run dev
   ```

2. **Testar Build:**
   ```bash
   npm run build
   npm start
   ```

3. **Testar Docker:**
   ```bash
   docker-compose -f docker/docker-compose.yml up
   ```

4. **Validar Commit:**
   ```bash
   git status  # Mostrar mudanças
   git diff --stat  # Resumo de alterações
   ```

---

**Última atualização:** 2026-01-19  
**Versão:** 2.0 (Reorganizada)
