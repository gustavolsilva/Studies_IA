# 📖 Configuração Permanente do Ambiente

Este documento explica como configurar seu ambiente Ubuntu para que Node.js 22 seja usado automaticamente.

## 🎯 O que fazer

### Opção 1: Configuração Automática (Recomendado)

Execute o script de setup:
```bash
./setup-environment.sh
```

Após isso, abra um novo terminal e o ambiente estará configurado.

### Opção 2: Configuração Manual do Shell

1. **Abrir arquivo de configuração do shell**:

   Para **zsh** (padrão em macOS recente e muitos Linux):
   ```bash
   nano ~/.zshrc
   ```

   Para **bash**:
   ```bash
   nano ~/.bashrc
   ```

2. **Adicionar ao final do arquivo**:

   ```bash
   # NVM Configuration
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
   
   # Auto-use Node version from .nvmrc if present
   cd() {
       builtin cd "$@"
       if [ -f ".nvmrc" ]; then
           nvm use > /dev/null 2>&1
       fi
   }
   ```

3. **Salvar e sair**:
   - Pressione `Ctrl+X` depois `Y` depois `Enter` (se usar nano)
   - Ou salve normalmente em seu editor

4. **Recarregar configuração**:
   ```bash
   source ~/.zshrc    # Para zsh
   # ou
   source ~/.bashrc   # Para bash
   ```

5. **Testar**:
   ```bash
   cd /home/gustavo/Projects/Studies_IA/databricks-exam-prep
   node --version    # Deve mostrar v22.22.0
   ```

## ✨ O que isso faz

- **Carrega nvm automaticamente** quando você abre o terminal
- **Detecta .nvmrc** e usa automaticamente Node.js 22 quando você entra no diretório do projeto
- **Você não precisa mais rodar** `source ~/.nvm/nvm.sh` manualmente

## 🧪 Verificar Configuração

Para confirmar que tudo está funcionando:

```bash
# Teste 1: Verificar Node
node --version     # Deve ser v22.22.0

# Teste 2: Verificar npm
npm --version      # Deve ser 10.9.4 ou superior

# Teste 3: Entrar no projeto
cd databricks-exam-prep
nvm use            # Deve reconhecer automaticamente v22

# Teste 4: Rodar aplicação
npm run dev        # Deve funcionar sem erros
```

## 🔄 Após configuração, para novos terminais

Em um novo terminal, simplesmente rode:
```bash
cd /home/gustavo/Projects/Studies_IA/databricks-exam-prep
npm run dev
```

Não precisa mais fazer nada manualmente! 🎉

## 📝 Notas

- O arquivo `.nvmrc` na raiz do projeto especifica Node.js 22
- Este arquivo é reconhecido automaticamente por nvm
- Você pode editar `~/.zshrc` ou `~/.bashrc` com qualquer editor (nano, vim, VSCode, etc)
- As mudanças só afetam novos terminais, não o atual

## ❓ Ainda com problemas?

Se algo não funcionar:

1. Verifique que nvm está instalado:
   ```bash
   ls -la ~/.nvm
   ```

2. Se não existir, instale:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

3. Feche o terminal e abra um novo

4. Rode `./setup-environment.sh` novamente
