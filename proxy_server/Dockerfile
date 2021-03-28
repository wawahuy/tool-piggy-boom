FROM node:15.12.0-alpine3.13

ENV PORT=10001

WORKDIR /src/proxy_capture

# cache node_modules
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 10001

CMD "npm" "run" "prod"
