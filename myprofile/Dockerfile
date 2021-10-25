FROM node:16.6

RUN apt-get -y update && apt-get -y upgrade && apt-get install -y sqlite3 libsqlite3-dev

COPY src /app

WORKDIR /app

RUN npm install --sqlite=/usr/local

EXPOSE 80

CMD ["npm", "start"]