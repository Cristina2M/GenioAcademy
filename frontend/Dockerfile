# Usamos una imagen de Node.js
FROM node:18-slim

# Directorio de trabajo
WORKDIR /app

# Copiamos los archivos de paquetes primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite/React
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "start"]