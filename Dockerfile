# Stage 1: Install dependencies and build the project
FROM node:latest AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the project
RUN npm run build

# Stage 2: Run the application
FROM node:latest AS runtime

# Set working directory
WORKDIR /app

# Copy the build artifacts and dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Copy Prisma schema and migrations
COPY --from=build /app/prisma ./prisma

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]
