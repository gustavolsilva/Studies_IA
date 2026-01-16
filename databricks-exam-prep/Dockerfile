FROM node:22-alpine AS builder

# Instalar Python e build tools para gerar dados
RUN apk add --no-cache python3 py3-pip build-base

WORKDIR /app

# Copiar manifests
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.json tsconfig.node.json ./

# Instalar dependências do Node
RUN npm ci

# Copiar código-fonte
COPY . .

# Gerar banco de perguntas em Parquet
RUN python3 generate_questions_enhanced.py

# Build da aplicação
RUN npm run build

# Stage final: runtime leve
FROM node:22-alpine

WORKDIR /app

# Copiar apenas dependências e build produção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/public ./client/public

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
