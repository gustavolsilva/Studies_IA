# Databricks Certified Data Engineer Associate - Simulado Interativo

[English Version](#english-version) | [Versão em Português](#versão-em-português)

---

## Versão em Português

### 📚 Sobre o Projeto

Este é um **simulado interativo** completo para a certificação **Databricks Certified Data Engineer Associate**. O projeto foi desenvolvido com a identidade visual oficial da Databricks e oferece uma experiência de aprendizado profissional com 3.000 questões técnicas.

### ✨ Características Principais

- **3.000 Questões Técnicas**: Cobertura completa dos tópicos do exame
- **Distribuição Oficial**: Proporção exata conforme guia de exame oficial
  - Databricks Intelligence Platform: 10% (300 questões)
  - Development and Ingestion: 30% (900 questões)
  - Data Processing & Transformations: 22% (660 questões)
  - Productionizing Data Pipelines: 16% (480 questões)
  - Data Governance & Quality: 22% (660 questões)

- **Explicações Detalhadas**: Cada questão inclui racional técnico completo e dica prática
- **Rastreamento de Progresso**: Monitoramento em tempo real por categoria e dificuldade
- **Identidade Databricks**: Design profissional com paleta oficial (Lava 600, Navy 900, Oat)
- **Tema Light/Dark**: Seletor de tema com suporte a ambos os modos
- **Tipografia Profissional**: DM Sans e DM Mono conforme brand guidelines

### 🚀 Como Executar Localmente

#### Pré-requisitos

- Node.js 18+ instalado
- npm ou pnpm instalado

#### Instalação e Execução

1. **Clone o repositório**:
```bash
git clone https://github.com/gustavolsilva/Studies_IA.git
cd Studies_IA/databricks-exam-prep
```

2. **Instale as dependências**:
```bash
pnpm install
# ou
npm install
```

3. **Inicie o servidor de desenvolvimento**:
```bash
pnpm dev
# ou
npm run dev
```

4. **Acesse no navegador**:
```
http://localhost:5173
```

#### Build para Produção

```bash
pnpm build
# ou
npm run build
```

### 📋 Estrutura do Projeto

```
databricks-exam-prep/
├── client/
│   ├── public/
│   │   ├── questions.json          # 30 questões iniciais
│   │   └── questions_expanded.json # 3.000 questões completas
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuestionCard.tsx    # Componente de questão
│   │   │   ├── Sidebar.tsx         # Progresso e estatísticas
│   │   │   └── ThemeSwitcher.tsx   # Seletor de tema
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Página principal
│   │   │   ├── StartScreen.tsx     # Tela inicial
│   │   │   └── ResultsScreen.tsx   # Tela de resultados
│   │   ├── hooks/
│   │   │   └── useQuizState.ts     # Lógica do simulado
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Gerenciamento de tema
│   │   ├── App.tsx                 # Componente raiz
│   │   └── index.css               # Estilos globais (Databricks)
│   └── index.html
├── package.json
└── README.md
```

### 🎨 Paleta de Cores Databricks

- **Lava 600** (Vermelho): `#FF3621` - Acentos e destaques
- **Navy 900** (Azul Escuro): `#0B2026` - Texto e backgrounds escuros
- **Oat Light**: `#F9F7F4` - Background claro
- **Oat Medium**: `#EEEDE9` - Elementos secundários
- **White**: `#FFFFFF` - Backgrounds e cards

### 🎯 Como Usar

1. **Tela Inicial**: Clique em "Começar Simulado" para iniciar
2. **Responder Questões**: Selecione uma das 4 opções (A, B, C, D)
3. **Ver Explicação**: Após responder, a explicação detalhada aparece automaticamente
4. **Navegar**: Use os botões "Anterior" e "Próxima" para navegar
5. **Monitorar Progresso**: Acompanhe seu desempenho na sidebar direita
6. **Alternar Tema**: Clique no ícone de lua/sol no header para mudar entre Light/Dark

### 📊 Tópicos Cobertos

- **Delta Lake**: Transações ACID, Time Travel, Comandos de otimização (OPTIMIZE, Z-ORDER, VACUUM)
- **Arquitetura Medallion**: Camadas Bronze, Silver e Gold
- **Unity Catalog**: Governança, permissões (GRANT/REVOKE), linhagem de dados
- **Processamento de Dados**: Spark SQL, Auto Loader, Delta Live Tables
- **Orquestração e DevOps**: Databricks Jobs, Git Repos, DABs, CI/CD

### 🛠️ Stack Tecnológico

- **React 19**: Framework frontend
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Estilização
- **shadcn/ui**: Componentes de UI
- **Wouter**: Roteamento
- **Vite**: Build tool

### 📝 Licença

Este projeto é fornecido como material de estudo para a certificação Databricks.

### 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Adicionar mais questões
- Melhorar explicações
- Reportar bugs
- Sugerir melhorias de UX

---

## English Version

### 📚 About the Project

This is a **complete interactive exam simulator** for the **Databricks Certified Data Engineer Associate** certification. The project was developed with Databricks' official visual identity and offers a professional learning experience with 3,000 technical questions.

### ✨ Key Features

- **3,000 Technical Questions**: Complete coverage of exam topics
- **Official Distribution**: Exact proportion according to official exam guide
  - Databricks Intelligence Platform: 10% (300 questions)
  - Development and Ingestion: 30% (900 questions)
  - Data Processing & Transformations: 22% (660 questions)
  - Productionizing Data Pipelines: 16% (480 questions)
  - Data Governance & Quality: 22% (660 questions)

- **Detailed Explanations**: Each question includes complete technical rationale and practical tip
- **Progress Tracking**: Real-time monitoring by category and difficulty
- **Databricks Identity**: Professional design with official palette (Lava 600, Navy 900, Oat)
- **Light/Dark Theme**: Theme selector with support for both modes
- **Professional Typography**: DM Sans and DM Mono according to brand guidelines

### 🚀 How to Run Locally

#### Prerequisites

- Node.js 18+ installed
- npm or pnpm installed

#### Installation and Execution

1. **Clone the repository**:
```bash
git clone https://github.com/gustavolsilva/Studies_IA.git
cd Studies_IA/databricks-exam-prep
```

2. **Install dependencies**:
```bash
pnpm install
# or
npm install
```

3. **Start the development server**:
```bash
pnpm dev
# or
npm run dev
```

4. **Access in your browser**:
```
http://localhost:5173
```

#### Build for Production

```bash
pnpm build
# or
npm run build
```

### 📋 Project Structure

```
databricks-exam-prep/
├── client/
│   ├── public/
│   │   ├── questions.json          # Initial 30 questions
│   │   └── questions_expanded.json # Complete 3,000 questions
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuestionCard.tsx    # Question component
│   │   │   ├── Sidebar.tsx         # Progress and statistics
│   │   │   └── ThemeSwitcher.tsx   # Theme selector
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Main page
│   │   │   ├── StartScreen.tsx     # Start screen
│   │   │   └── ResultsScreen.tsx   # Results screen
│   │   ├── hooks/
│   │   │   └── useQuizState.ts     # Quiz logic
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Theme management
│   │   ├── App.tsx                 # Root component
│   │   └── index.css               # Global styles (Databricks)
│   └── index.html
├── package.json
└── README.md
```

### 🎨 Databricks Color Palette

- **Lava 600** (Red): `#FF3621` - Accents and highlights
- **Navy 900** (Dark Blue): `#0B2026` - Text and dark backgrounds
- **Oat Light**: `#F9F7F4` - Light background
- **Oat Medium**: `#EEEDE9` - Secondary elements
- **White**: `#FFFFFF` - Backgrounds and cards

### 🎯 How to Use

1. **Start Screen**: Click "Começar Simulado" (Start Quiz) to begin
2. **Answer Questions**: Select one of 4 options (A, B, C, D)
3. **View Explanation**: After answering, detailed explanation appears automatically
4. **Navigate**: Use "Anterior" (Previous) and "Próxima" (Next) buttons to navigate
5. **Track Progress**: Monitor your performance in the right sidebar
6. **Switch Theme**: Click the moon/sun icon in the header to switch between Light/Dark

### 📊 Topics Covered

- **Delta Lake**: ACID transactions, Time Travel, optimization commands (OPTIMIZE, Z-ORDER, VACUUM)
- **Medallion Architecture**: Bronze, Silver, and Gold layers
- **Unity Catalog**: Governance, permissions (GRANT/REVOKE), data lineage
- **Data Processing**: Spark SQL, Auto Loader, Delta Live Tables
- **Orchestration and DevOps**: Databricks Jobs, Git Repos, DABs, CI/CD

### 🛠️ Technology Stack

- **React 19**: Frontend framework
- **TypeScript**: Static typing
- **Tailwind CSS 4**: Styling
- **shadcn/ui**: UI components
- **Wouter**: Routing
- **Vite**: Build tool

### 📝 License

This project is provided as study material for Databricks certification.

### 🤝 Contributions

Contributions are welcome! Feel free to:
- Add more questions
- Improve explanations
- Report bugs
- Suggest UX improvements

---

**Desenvolvido com ❤️ para a comunidade Databricks** | **Developed with ❤️ for the Databricks community**
