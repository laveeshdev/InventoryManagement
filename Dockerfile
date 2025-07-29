FROM node:18

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY app.js app.js
COPY . .

RUN npm install

ENTRYPOINT [ "node" , "app.js" ]