FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Usamos --host para que Vite acepte conexiones externas desde Docker
CMD ["npm", "run", "dev", "--", "--host"]