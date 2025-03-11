# Estágio de construção
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY . .

# Instala as dependências
RUN npm install

# Constrói o projeto
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta do Next.js
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]