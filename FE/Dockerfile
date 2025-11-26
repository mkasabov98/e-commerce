# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./ ./

RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Optional: safe remove
RUN [ -f /etc/nginx/conf.d/default.conf ] && rm /etc/nginx/conf.d/default.conf || echo "default.conf not found"

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Adjust dist path to match angular.json output
COPY --from=build /app/dist/fe/browser /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
