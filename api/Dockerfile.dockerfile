FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

COPY server.js ./

USER node

EXPOSE 3000

CMD ["node", "server.js"]