# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json della root e del backend
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/

# Installa dipendenze
RUN npm install

# Copia codice sorgente
COPY apps/backend ./apps/backend

# Build
WORKDIR /app/apps/backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Installa Docker CLI per controllare i container
RUN apk add --no-cache docker-cli

# Copia node_modules e build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
