FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "build/index.js"]
