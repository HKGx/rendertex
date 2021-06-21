FROM node:16
WORKDIR /app/
COPY . ./
RUN npm ci -q
CMD ["npm", "start"]
