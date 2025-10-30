FROM node:22.20.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV SERVER_PORT 3000
EXPOSE $SERVER_PORT
CMD ["node", "index.js"]