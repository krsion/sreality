FROM node:20

WORKDIR /web


COPY package*.json .
RUN npm ci

COPY . . 

RUN npm run build

CMD npx prisma db push && npm run start
