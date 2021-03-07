FROM node:12.18-alpine

ENV PORT=10001

WORKDIR /src/proxy_capture

# cache node_modules
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10001

CMD "npm" "start"
