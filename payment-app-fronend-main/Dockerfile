# Stage 1: Build React app
FROM node:14-alpine AS build

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build the React app
COPY . .
RUN npm run build

# Stage 2: Serve React app using Nginx
FROM nginx:stable-alpine

# Copy build output to Nginx HTML directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the host
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]