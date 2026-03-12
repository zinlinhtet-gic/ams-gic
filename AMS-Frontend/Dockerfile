# Use official Node.js image as base
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
