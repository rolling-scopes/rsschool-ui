FROM nginx:1.14-alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/mime.types /etc/nginx/mime.types
COPY docker/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /srv/www
COPY dist /srv/www

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
