# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json della root e del frontend
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Installa dipendenze
RUN npm install

# Copia codice sorgente
COPY apps/frontend ./apps/frontend

# Build
WORKDIR /app/apps/frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copia standalone build
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

CMD ["node", "apps/frontend/server.js"]
