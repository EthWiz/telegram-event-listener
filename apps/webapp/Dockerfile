# Dockerfile.bot
FROM node:18
WORKDIR /app
COPY ./package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
EXPOSE 5173
CMD [ "npm", "run", "dev" ]