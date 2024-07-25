# Base image
FROM node:18
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY service-account-key.json ./dist/
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
