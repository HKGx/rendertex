FROM node:18
WORKDIR /app/
COPY . ./
RUN npm ci -q
CMD ["npm", "start"]
