FROM node:16

ENV DATABASE_URL=postgres://auejentqagwefp:7e49307bd5bbe8353fc63517f79d917f540eb7a6650c5ef799d73f8f31e8bc63@ec2-54-220-14-54.eu-west-1.compute.amazonaws.com:5432/dfnslink1dl3mg
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