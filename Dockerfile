FROM node:24-alpine

# Install missing packages
RUN apk add --no-cache util-linux

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Copy the rest of the application code
COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "develop"]
