# Use Node 14 as the base image
FROM node:18-alpine3.21

# Install missing packages
RUN apk add --no-cache util-linux

# Set NODE_ENV
ENV NODE_ENV=dev


# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Gatsby project
RUN npm run build

# Expose port 8000 for Gatsby
EXPOSE 8000

# Set the default command to start the Gatsby development server
CMD ["npm", "run", "develop"]
