FROM node:8-jessie

WORKDIR /app
COPY . ./

EXPOSE 8080

RUN npm install
RUN npm run build-ts

CMD ["npm", "start"]
