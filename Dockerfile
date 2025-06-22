# frontend/Dockerfile

# --- Estágio 1: Build (Construção) ---
FROM node:18 AS builder

WORKDIR /app

# Copia APENAS o package.json para forçar uma nova resolução de dependências no ambiente Linux
COPY package.json ./

# CORREÇÃO: Usamos 'npm install' aqui, pois não temos o lockfile
RUN npm install

COPY . .
RUN npm run build


# --- Estágio 2: Serve (Servidor Web) ---
# Esta parte continua a mesma
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]