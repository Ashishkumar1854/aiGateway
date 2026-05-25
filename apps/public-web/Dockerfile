FROM node:20-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"]
