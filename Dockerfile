FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma

RUN npm install --only=production

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
