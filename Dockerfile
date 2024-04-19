FROM node:8.10.0-alpine
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run ionic:build
CMD  ["ionic-app-scripts","ionic:serve"]
 