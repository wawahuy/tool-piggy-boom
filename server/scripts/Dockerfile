FROM node:12.18-alpine

ENV PORT=10002

WORKDIR /src/heo

# cache node_modules
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 10002

CMD "npm" "run" "production"
