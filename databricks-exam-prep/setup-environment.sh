#!/bin/bash

# Script de Configuração de Ambiente - Databricks Exam Prep
# Este script configura o ambiente do Ubuntu para rodar o projeto sem problemas

set -e

echo "🔧 Iniciando configuração de ambiente..."
echo ""

# 1. Verificar se nvm está instalado
if [ ! -d "$HOME/.nvm" ]; then
    echo "❌ NVM não está instalado. Instalando..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "✅ NVM instalado com sucesso"
else
    echo "✅ NVM já está instalado"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo ""

# 2. Instalar Node.js 22 se necessário
if ! nvm list | grep -q "v22"; then
    echo "📥 Instalando Node.js 22..."
    nvm install 22
    echo "✅ Node.js 22 instalado"
else
    echo "✅ Node.js 22 já está instalado"
fi

echo ""

# 3. Definir Node.js 22 como padrão
echo "⚙️  Configurando Node.js 22 como versão padrão..."
nvm alias default 22
nvm use 22
echo "✅ Node.js 22 configurado como padrão"

echo ""

# 4. Verificar versões
echo "📦 Versões instaladas:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"

echo ""

# 5. Limpar node_modules e cache se necessário
if [ -d "node_modules" ]; then
    echo "🧹 Limpando dependências antigas..."
    rm -rf node_modules
    echo "✅ Dependências limpas"
fi

echo ""

# 6. Instalar dependências do projeto
echo "📥 Instalando dependências do projeto..."
npm install
echo "✅ Dependências instaladas"

echo ""
echo "✅ Configuração concluída com sucesso!"
echo ""
echo "Para rodar a aplicação:"
echo "  npm run dev       - Modo desenvolvimento"
echo "  npm run build     - Build para produção"
echo "  npm start         - Rodar em produção"
echo ""
