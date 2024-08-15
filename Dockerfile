FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
