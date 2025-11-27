# Estágio 1: Dependências
FROM node:20-alpine AS deps
WORKDIR /app

# Ativa o Corepack para garantir que o 'yarn' correto seja usado
RUN corepack enable

# Copia os arquivos de manifesto e o lockfile
COPY package.json yarn.lock ./
# Copia arquivos de configuração do Yarn (se estiver usando Berry v2+)
COPY .yarnrc.yml* ./
COPY .yarn ./.yarn

# Instala as dependências usando Yarn
RUN yarn install --immutable

# Estágio 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Ativa o Corepack
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configuração do Next.js para output standalone otimizado para Docker
RUN yarn run build

# Estágio 3: Imagem Final (Produção)
FROM node:20-alpine AS runner
WORKDIR /app    

ENV NODE_ENV=production

# Ativa o Corepack (boa prática tê-lo no 'runner' também)
RUN corepack enable
# --- INÍCIO DA CORREÇÃO ---
# Cria um grupo e um usuário 'nextjs' para não rodar como root
# -S (system) cria um usuário/grupo de sistema sem senha/home
RUN addgroup -S nextjs
RUN adduser -S nextjs -G nextjs
# --- FIM DA CORREÇÃO ---
# Copia os artefatos otimizados do build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Porta padrão do Next.js
EXPOSE 3000

# Otimização de usuário (segurança)
USER nextjs

CMD ["node", "server.js"]