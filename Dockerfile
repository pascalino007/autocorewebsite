# Dockerfile for a Next.js application

# 1. Builder stage: Build the Next.js app
FROM node:16.20.2-alpine AS builder

# Set working directory
WORKDIR /app

# Set OpenSSL legacy provider to match package.json requirements for Node 18
#ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies for building the app
RUN npm install --legacy-peer-deps


# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# 2. Production stage: Create the final, lean image
FROM node:16.20.2-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
#ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy dependency manifests
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy application build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./

# Expose the port the app will run on
EXPOSE 3000

# The command to start the production server
# This assumes you have a "start": "next start" script in your package.json
CMD ["next", "start"]
