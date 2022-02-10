FROM node:16

ENV DB_NAME=authentication-service\
    DB_USER=swish\
    DB_PASSWORD=WdUG_xhYMOne)f41\
    DB_HOST=celz3-network\
    DB_DIALECT=mysql
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4001

CMD [ "node", "server.js" ]