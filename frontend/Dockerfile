# Use the latest LTS Node image
FROM node:20-slim

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the code
COPY . .

# Next.js default port
EXPOSE 3000

# Run Next.js in dev mode
CMD ["pnpm", "run", "dev"]