# Databricks Exam Prep

Aplicação interativa para preparação do **Databricks Certified Data Engineer Associate** com suporte a modo prático e modo exame.

## 🎯 Sobre o Banco de Perguntas

✅ **37 perguntas de alta qualidade** alinhadas com o guia oficial do exame  
✅ **59% com sintaxe real** de PySpark, SQL e Delta Live Tables  
✅ **0 duplicações** - banco totalmente revisado  
✅ **Respostas expandidas** (média de 291 caracteres) com contextos reais  
✅ **Distribuição balanceada** entre 5 categorias do exame  

### 📚 Categorias Cobertas

- **Databricks Intelligence Platform** (7 perguntas) - Lakehouse, Delta Lake, Unity Catalog
- **Development and Ingestion** (8 perguntas) - Auto Loader, DLT, Streaming
- **Data Processing & Transformations** (8 perguntas) - PySpark, SQL, Merge
- **Data Governance & Quality** (7 perguntas) - Unity Catalog, Permissions, Security
- **Productionizing Data Pipelines** (7 perguntas) - Jobs, OPTIMIZE, Workflows

## 📋 Pré-requisitos

- **Node.js** versão 20.19+ ou 22.12+ (verifique com `node --version`)
- **nvm** (Node Version Manager) - recomendado
- **npm** (vem com Node.js)
- **Python 3.8+** (para scripts de manutenção do banco de perguntas)

## 🚀 Deploy Local

### ⚡ Configuração Rápida (Recomendado)

Se é a primeira vez ou quer garantir que tudo está configurado corretamente:

```bash
cd databricks-exam-prep
./setup-environment.sh
```

Este script irá:
- Instalar/verificar NVM
- Instalar Node.js 22
- Definir como versão padrão
- Limpar e instalar dependências
- Deixar tudo pronto para rodar

**Para configuração permanente do ambiente**, veja [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd databricks-exam-prep
```

### 2. Instalar Dependências

```bash
npm install
```

**Nota**: O projeto está configurado para usar `npm`. Se preferir usar `pnpm`, instale com `npm install -g pnpm` e substitua `npm` por `pnpm` nos comandos.

### 3. Rodar em Modo Desenvolvimento

Para rodar a aplicação localmente com hot-reload:

```bash
# Garantir que está usando Node.js 22
nvm use 22

# Iniciar servidor
npm run dev
```

A aplicação estará disponível em:
- **URL**: `http://localhost:3000`
- Se a porta 3000 estiver ocupada, a aplicação usará a próxima porta disponível
- Servidor inicia em **~300-400ms** ✅

### 4. Build para Produção

Para compilar a aplicação:

```bash
npm run build
```

Isso irá:
- Compilar o cliente React/TypeScript com Vite
- Compilar o servidor Node.js com esbuild
- Gerar os arquivos em `dist/`

### 5. Rodar em Modo Produção

Após fazer o build:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila para produção (cliente + servidor) |
| `npm start` | Roda a aplicação em modo produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run check` | Verifica erros de TypeScript |
| `npm run format` | Formata o código com Prettier |

## � Manutenção do Banco de Perguntas

### Scripts Python para Gerenciamento

| Script | Descrição |
|--------|-----------|
| `python3 improve_questions.py` | Remove duplicações e valida estrutura |
| `python3 expanded_pyspark_questions.py` | Adiciona perguntas de sintaxe PySpark |
| `python3 add_new_questions_helper.py` | Template e validador para novas perguntas |

### Adicionar Novas Perguntas

1. Use o template em `add_new_questions_helper.py`
2. Garanta que respostas tenham 200-450 caracteres
3. Inclua sintaxe real (PySpark/SQL) quando aplicável
4. Adicione cenário de produção em `contextScenario`
5. Execute o script para validar e adicionar

### Exemplo de Pergunta de Qualidade

```python
{
    "category": "Data Processing & Transformations",
    "difficulty": "intermediate",
    "question": "Qual função você usaria para explodir um array column em múltiplas linhas?",
    "options": {
        "A": "df.select('order_id', F.explode('items').alias('item'))",
        "B": "df.select('order_id', 'items').flatMap(lambda x: x)",
        "C": "df.select('*').split('items')",
        "D": "df.selectExpr('order_id', 'UNNEST(items) as item')"
    },
    "correctAnswer": "A",
    "rationale": "F.explode() cria uma linha por elemento em array. Sintaxe completa...",
    "tip": "F.explode(col) = 1 linha por elemento",
    "officialReference": {
        "title": "PySpark explode function",
        "url": "https://spark.apache.org/docs/..."
    },
    "contextScenario": "Tabela orders com array de produtos. Gerar relatório com 1 linha por produto."
}
```

## 🗂️ Estrutura do Projeto

```
databricks-exam-prep/
├── client/              # Frontend React
│   ├── public/         # Assets estáticos
│   │   └── questions_expanded.json  # Banco de perguntas (37 perguntas)
│   └── src/            # Código fonte React/TypeScript
├── server/             # Backend Express
├── shared/             # Código compartilhado entre cliente e servidor
├── package.json        # Dependências e scripts
├── vite.config.ts      # Configuração do Vite
└── tsconfig.json       # Configuração do TypeScript
```

## 🛠️ Stack Tecnológico

### Frontend
- **React** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Utilitários CSS
- **Radix UI** - Componentes sem estilo
- **Framer Motion** - Animações

### Backend
- **Express** - Framework web
- **Node.js** - Runtime JavaScript

## 🌐 Variáveis de Ambiente

Criar um arquivo `.env` na raiz do projeto (opcional):

```env
PORT=3000
NODE_ENV=development
```

## 📖 Recursos Principais

### ✨ Funcionalidades do Aplicativo
- **Modo Prática**: Responda questões e obtenha feedback imediato com rationale detalhado
- **Modo Exame**: Simule o exame real com tempo limite e experiência autêntica
- **Histórico**: Acompanhe seu desempenho ao longo do tempo com analytics
- **Categorias**: Questões organizadas por tópicos do exame oficial
- **Sintaxe Real**: 59% das perguntas incluem código PySpark/SQL real
- **Tema**: Suporte para modo claro e escuro

### 📚 Conteúdo Alinhado com Guia Oficial

Perguntas baseadas no [Databricks Certified Data Engineer Associate Exam Guide](https://www.databricks.com/learn/certification/data-engineer-associate):

1. **Databricks Lakehouse Platform** (20%)
   - Arquitetura Lakehouse
   - Delta Lake fundamentals
   - Time Travel e Versionamento

2. **ELT with Spark SQL and Python** (30%)
   - PySpark DataFrame API
   - Spark SQL
   - MERGE/UPSERT operations
   - Window functions

3. **Incremental Data Processing** (25%)
   - Auto Loader
   - Delta Live Tables
   - Structured Streaming
   - Schema evolution

4. **Production Pipelines** (15%)
   - Databricks Jobs e Workflows
   - OPTIMIZE e Z-ORDER
   - Monitoring e Alerting

5. **Data Governance** (10%)
   - Unity Catalog
   - Permissions (GRANT/REVOKE)
   - Row/Column filters

## 📊 Melhorias Recentes

### ✅ Banco de Perguntas Revisado (Jan 2026)

- **Removidas 2.975 duplicações** (de 3.000 para 37 perguntas únicas)
- **Respostas expandidas** de 80 → 291 caracteres (média)
- **12 perguntas com sintaxe PySpark/SQL** adicionadas
- **100% com cenários reais** de produção
- **Arquivo otimizado** de 57MB → 24KB

Veja detalhes completos em [MELHORIAS_BANCO_PERGUNTAS.md](MELHORIAS_BANCO_PERGUNTAS.md)

## 🔧 Troubleshooting

### Porta 3000 já está em uso
A aplicação automaticamente encontrará a próxima porta disponível em modo desenvolvimento.

### Erro ao instalar dependências
Limpar cache e reinstalar:
```bash
rm -rf node_modules
npm install
```

### Erro de TypeScript
Executar verificação de tipos:
```bash
npm run check
```

### Servidor não inicia ou loop infinito
1. Verificar versão do Node.js: `node --version` (deve ser 22.x)
2. Usar `nvm use 22` antes de `npm run dev`
3. Verificar se banco de perguntas está válido: `python3 improve_questions.py`

**Se nada funcionar**: Use `./setup-environment.sh` para reset completo.

## 📚 Documentação Adicional

- **[MELHORIAS_BANCO_PERGUNTAS.md](MELHORIAS_BANCO_PERGUNTAS.md)** - Detalhes das melhorias no banco
- **[BANCO_PERGUNTAS_README.md](BANCO_PERGUNTAS_README.md)** - Guia do banco de perguntas
- **[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)** - Configuração de ambiente

## ❓ FAQ - Problemas Comuns de Ambiente

### P: Tudo não funciona, como faço reset completo?

**Solução rápida**:
```bash
./setup-environment.sh
```

Este script resolve automaticamente:
- Problemas de versão do Node.js
- Falta de nvm
- Dependências desatualizadas
- Configuração de versão padrão

### P: Script `./setup-environment.sh` não funciona

**Solução**:
```bash
# Dar permissão de execução
chmod +x ./setup-environment.sh

# Rodar novamente
./setup-environment.sh
```

### P: Erro "Vite requires Node.js version 20.19+ or 22.12+"

**Problema**: O projeto necessita Node.js 20.19+ ou 22.12+, mas você tem uma versão mais antiga.

**Solução**:

Se você usa **nvm** (Node Version Manager):
```bash
# Instalar Node.js 22
nvm install 22

# Ativar Node.js 22
nvm use 22

# Verificar versão
node --version
```

Se você usa **nvm** mas o terminal não reconhece a versão ativa:
```bash
# Carregar nvm no terminal atual
. ~/.nvm/nvm.sh

# Depois ativar a versão
nvm use 22

# Tentar novamente
npm run dev
```

Se você não tem **nvm** instalado:
- **macOS**: `brew install nvm`
- **Linux/WSL**: Visite https://github.com/nvm-sh/nvm
- **Windows**: Use `nvm-windows` de https://github.com/coreybutler/nvm-windows

### P: Erro "TypeError: crypto.hash is not a function"

**Problema**: Normalmente ocorre quando Node.js 18 é usado com Vite 7+.

**Solução**: Atualize para Node.js 22+ (veja solução acima).

### P: pnpm: command not found

**Problema**: pnpm não está instalado ou não é reconhecido.

**Solução - Opção 1** (Usar npm em vez de pnpm):
```bash
# Todos os comandos pnpm podem ser substituídos por npm
npm run dev       # em vez de pnpm dev
npm run build     # em vez de pnpm build
npm start         # em vez de pnpm start
```

**Solução - Opção 2** (Instalar pnpm):
```bash
npm install -g pnpm
```

**Solução - Opção 3** (Usar pnpm via npm):
```bash
npx pnpm dev
npx pnpm build
```

### P: Permissão negada ao instalar pnpm globalmente

**Problema**: `EACCES: permission denied` ao tentar `npm install -g pnpm`

**Solução**:
```bash
# Opção 1: Usar sudo
sudo npm install -g pnpm

# Opção 2: Usar npm sem sudo (melhor prática)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g pnpm

# Opção 3: Apenas use npm em vez de pnpm
npm run dev
```

### P: Mudar versão de Node.js voltou à versão anterior

**Problema**: O terminal continua usando Node.js 18 depois de `nvm use 22`.

**Solução completa**:
```bash
# 1. Carregar nvm no terminal
source ~/.nvm/nvm.sh

# 2. Ativar Node.js 22
nvm use 22

# 3. Verificar qual versão está ativa
node --version

# 4. Rodar o projeto
npm run dev
```

**Permanentemente** (adicionar ao `.bashrc`, `.zshrc` ou arquivo de config do seu shell):
```bash
# ~/.zshrc ou ~/.bashrc
source ~/.nvm/nvm.sh
nvm use 22
```

### P: "Already up to date" ao rodar `pnpm install` mas projeto não funciona

**Problema**: Dependências estão cacheadas mas não estão corretas para a versão do Node.

**Solução**:
```bash
# Limpar cache do pnpm
pnpm store prune

# Limpar node_modules
rm -rf node_modules

# Reinstalar
pnpm install

# Ou usar npm
npm install
```

### P: Vite não inicia ou porta 3000 congelada

**Problema**: Servidor não inicia ou fica preso.

**Solução**:
```bash
# Matar processos usando a porta 3000
lsof -ti:3000 | xargs kill -9

# No Windows use:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Tentar novamente
npm run dev
```

## 📦 Dependências Principais

- `express` - Servidor web
- `react` - Framework UI
- `vite` - Build tool
- `tailwindcss` - Estilos CSS
- `radix-ui` - Componentes base
- `framer-motion` - Animações
- `axios` - Cliente HTTP
- `react-hook-form` - Gerenciamento de formulários

## 🎓 Recursos de Estudo

### Documentação Oficial
- [Databricks Documentation](https://docs.databricks.com/)
- [Delta Lake Documentation](https://docs.delta.io/)
- [Apache Spark Documentation](https://spark.apache.org/docs/latest/)

### Guia do Exame
- [Databricks Certified Data Engineer Associate Exam Guide (PT-BR)](https://www.databricks.com/sites/default/files/2025-08/databricks-certified-data-engineer-associate-exam-guide-25-br.pdf)
- [Databricks Certification Page](https://www.databricks.com/learn/certification/data-engineer-associate)

### Academy
- [Databricks Academy](https://academy.databricks.com/)
- [Data Engineer Learning Plan](https://www.databricks.com/learn/training/home)

## 📄 Licença

MIT

## 👥 Contribuições

Contribuições são bem-vindas! Para adicionar novas perguntas de qualidade:

1. Use o helper: `python3 add_new_questions_helper.py`
2. Siga o template de perguntas existentes
3. Garanta sintaxe real de PySpark/SQL quando aplicável
4. Valide com `python3 improve_questions.py`
5. Teste no aplicativo com `npm run dev`

Para outras melhorias, abra uma issue ou pull request!
