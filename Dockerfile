FROM node:19-alpine3.16 as development

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3002

CMD ["npm", "run", "start:docker"]