# Dockerfile para Backend Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY backend/package*.json ./

# Instala dependências
RUN npm install --production

# Copia o código da aplicação
COPY backend/src ./src

# Expõe a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "src/server.js"]
