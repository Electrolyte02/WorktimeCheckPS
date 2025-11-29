# ===== STAGE 1: Build =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# ===== STAGE 2: NGINX =====
FROM nginx:1.25-alpine
COPY --from=build /app/dist/your-app-name /usr/share/nginx/html

# Archivo para variables dinámicas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
