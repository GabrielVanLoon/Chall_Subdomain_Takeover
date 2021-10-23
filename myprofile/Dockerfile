FROM node:16.6

RUN apt-get -y update && apt-get -y upgrade && apt-get install -y sqlite3 libsqlite3-dev

COPY src /app

WORKDIR /app

RUN npm install

EXPOSE 3333

CMD ["npm", "start"]