FROM node:16-alpine
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "app/"]
WORKDIR /app/
RUN npm ci -q
COPY ./src ./src
CMD ["npm", "start"]
