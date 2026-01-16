#!/bin/bash

#================================================================
# Databricks Exam Prep - Setup Ambiente Completo (Docker + Auto-Gen)
# Compatível: Windows (WSL2), macOS, Linux
# Funcionalidade: Virtualização, geração automática de dados, limpo
#================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$PROJECT_ROOT/.venv"
PUBLIC_DIR="$PROJECT_ROOT/client/public"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

#================================================================
# 1. VALIDAÇÃO DE REQUISITOS
#================================================================

log_info "Validando requisitos de sistema..."

if ! command -v node &> /dev/null; then
    log_error "Node.js não está instalado"
    echo "Instale de: https://nodejs.org/ (versão 20.19+ ou 22.12+)"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    log_error "Node.js versão 20.19+ ou 22.12+ é obrigatório (você tem v$(node --version))"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    log_error "Python3 não está instalado"
    echo "Instale de: https://www.python.org/ (versão 3.8+)"
    exit 1
fi

log_success "Requisitos validados: Node.js $(node --version), Python $(python3 --version)"

#================================================================
# 2. SETUP VIRTUALENV (Isolamento Python)
#================================================================

log_info "Configurando ambiente Python isolado (.venv)..."

if [ -d "$VENV_DIR" ]; then
    log_warning ".venv já existe, reutilizando..."
else
    python3 -m venv "$VENV_DIR"
    log_success ".venv criado"
fi

# Ativar venv
source "$VENV_DIR/bin/activate"

# Atualizar pip
pip install -q --upgrade pip setuptools wheel
log_success "pip atualizado"

# Instalar dependências Python para gerador
pip install -q pandas pyarrow
log_success "Dependências Python instaladas"

#================================================================
# 3. GERAR BANCO DE DADOS DE QUESTÕES
#================================================================

log_info "Gerando banco de questões em Parquet..."

mkdir -p "$PUBLIC_DIR"

if [ -f "$PROJECT_ROOT/generate_questions_parquet.py" ]; then
    python3 "$PROJECT_ROOT/generate_questions_parquet.py"
    
    if [ -f "$PUBLIC_DIR/questions_enhanced.parquet" ] || [ -f "$PUBLIC_DIR/questions_enhanced.json" ]; then
        log_success "Banco de questões gerado com sucesso"
    else
        log_error "Falha ao gerar banco de questões"
        exit 1
    fi
else
    log_error "Script generate_questions_parquet.py não encontrado"
    exit 1
fi

#================================================================
# 4. SETUP NODE.JS
#================================================================

log_info "Configurando Node.js e instalando dependências..."

# Limpar cache se necessário
if [ -d "$PROJECT_ROOT/node_modules" ]; then
    log_warning "node_modules encontrado, removendo para limpar..."
    rm -rf "$PROJECT_ROOT/node_modules"
fi

# Usar npm (detectar automaticamente se pnpm está disponível)
PKG_MANAGER="npm"
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    log_success "pnpm detectado, usando para instalação"
fi

cd "$PROJECT_ROOT"
$PKG_MANAGER install
log_success "Dependências Node.js instaladas"

#================================================================
# 5. VALIDAÇÃO DE BUILD
#================================================================

log_info "Validando TypeScript..."
$PKG_MANAGER run check
log_success "TypeScript validado"

#================================================================
# 6. DOCKER SETUP (Opcional)
#================================================================

if command -v docker &> /dev/null; then
    log_info "Docker detectado. Compilando imagens..."
    
    docker build -t databricks-exam-prep:latest . 2>&1 | tail -5
    log_success "Imagem Docker compilada"
    
    log_success "Para rodar em Docker: docker-compose up"
else
    log_warning "Docker não detectado. Pulando setup Docker..."
    log_info "Para usar Docker, instale de: https://www.docker.com/products/docker-desktop"
fi

#================================================================
# 7. INSTRUÇÕES FINAIS
#================================================================

echo ""
log_success "🎉 Setup concluído com sucesso!"
echo ""

log_info "Proximos passos:"
echo ""
echo "  📦 Para desenvolvimento local:"
echo "     npm run dev"
echo "     Acesse: http://localhost:3000"
echo ""
echo "  🐳 Para executar com Docker:"
echo "     docker-compose up"
echo "     Acesse: http://localhost:3000"
echo ""
echo "  🏗️  Para build de produção:"
echo "     npm run build"
echo "     npm start"
echo ""

log_info "Estrutura de arquivos gerada:"
echo "  client/public/"
echo "    ├── questions_enhanced.parquet (compactado, otimizado)"
echo "    └── questions_enhanced.json (fallback)"
echo ""

log_info "Ambiente ativado em: $VENV_DIR"
echo "Para ativar manualmente: source $VENV_DIR/bin/activate"
echo ""

log_success "Você está pronto para começar! 🚀"
