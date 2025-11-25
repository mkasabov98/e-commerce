# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY e-commerce/package*.json ./

RUN npm install

COPY e-commerce/ ./

RUN npm run build -- --project e-commerce --configuration production

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build /app/dist/e-commerce/browser /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
