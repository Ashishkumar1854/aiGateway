FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl openssl

COPY package.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
