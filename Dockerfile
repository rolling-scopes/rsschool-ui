FROM node:lts-alpine

EXPOSE 8080

ENV NODE_ENV production
ENV NODE_PORT 8080
ENV RS_HOST http://localhost:3000

WORKDIR /client

COPY package.json /client
COPY src/.next /client/.next
COPY src/static /client/static

RUN npm install --no-optional

CMD [ "npm", "run", "prod" ]