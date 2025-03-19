FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.cjs"]