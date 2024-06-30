# Base image
FROM node:18

ENV HOST=host.docker.internal
ENV DB_USERNAME=root
ENV DB_PW=123456
ENV JWT_SECRET=JWTSECRET
ENV SESSION_SECRET=SESSIONSECRET
ENV DB_NAME=test

# Create app directory
WORKDIR /src

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY service-account-key.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 3000

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
