# Databricks Exam Prep - Auto Setup
# Adicione o seguinte ao seu ~/.zshrc ou ~/.bashrc para configuração automática

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Se estiver no diretório do projeto, usar Node.js 22 automaticamente
cd() {
    builtin cd "$@"
    if [ -f ".nvmrc" ]; then
        nvm use > /dev/null 2>&1
    fi
}
