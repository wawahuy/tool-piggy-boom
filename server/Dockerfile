FROM node:15.12.0-alpine3.13

ENV PORT=10002

WORKDIR /src/heo

# cache node_modules
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 10002

CMD "npm" "run" "prod"
