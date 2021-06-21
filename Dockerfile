FROM node:16
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "app/"]
WORKDIR /app/
RUN npm ci -q
COPY ./src ./src
CMD ["npm", "start"]
