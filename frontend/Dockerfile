# Build stage
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Production stage
FROM node:18

WORKDIR /app

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=builder /app/dist /app/dist

# Expose port 5173 (or use 80)
EXPOSE 5173

# Serve the static build
CMD ["serve", "-s", "dist", "-l", "5173"]
