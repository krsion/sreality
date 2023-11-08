FROM node:20

WORKDIR /scraper


COPY package*.json .
RUN npm ci
RUN npx playwright install-deps 
RUN npx playwright install

COPY .env .
COPY prisma ./prisma
RUN npx prisma generate

COPY scraper.ts .

CMD npx prisma db push && npx ts-node scraper.ts
