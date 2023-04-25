# Use an official Node.js image as the base image
FROM node:lts-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the required dependencies and legacy peer dependencies
RUN npm install --legacy-peer-deps


COPY . .


ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build the React application
RUN npm run build

# Use an official Nginx image as the base image
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Specify the command to run supervisord
CMD ["nginx", "-g", "daemon off;"]