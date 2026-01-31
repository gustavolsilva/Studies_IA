#!/bin/bash

# QUICK START - Podcast Generator

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

export PYTHONPATH="$PROJECT_ROOT/src:${PYTHONPATH:-}"

echo "🎙️  Podcast Generator - Quick Start"
echo "=================================="
echo ""

# Verificar se o venv existe
if [ ! -d ".venv" ]; then
    echo "❌ Ambiente virtual não encontrado!"
    echo "Por favor, configure o ambiente primeiro."
    exit 1
fi

# Ativar ambiente virtual
echo "✓ Ativando ambiente virtual..."
source .venv/bin/activate

# Verificar se o eSpeak está instalado
echo "✓ Verificando eSpeak..."
if ! command -v espeak &> /dev/null; then
    echo "❌ eSpeak não está instalado!"
    echo "Instale com: sudo apt-get install espeak"
    exit 1
fi

echo "✓ Verificações OK!"
echo ""

# Menu de opções
echo "O que você gostaria de fazer?"
echo "1) Gerar os podcasts (recomendado)"
echo "2) Iniciar o servidor web"
echo "3) Gerar e depois iniciar servidor (automático)"
echo "4) Listar vozes disponíveis"
echo ""
read -p "Escolha uma opção (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎙️  Gerando podcasts..."
        python scripts/generate_podcasts.py
        echo ""
        echo "✓ Podcasts gerados com sucesso!"
        echo "Execute 'python scripts/serve.py' para iniciar o servidor."
        ;;
    2)
        echo ""
        echo "🌐 Iniciando servidor..."
        python scripts/serve.py
        ;;
    3)
        echo ""
        echo "🎙️  Gerando podcasts..."
        python scripts/generate_podcasts.py
        echo ""
        echo "🌐 Iniciando servidor..."
        python scripts/serve.py
        ;;
    4)
        echo ""
        echo "🔊 Vozes disponíveis:"
        python -m podcast_generator.list_voices
        ;;
    *)
        echo "Opção inválida!"
        exit 1
        ;;
esac
