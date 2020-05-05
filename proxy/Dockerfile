FROM nginx:stable-alpine
RUN mkdir -p /data/nginx/cache
COPY nginx.conf /etc/nginx/nginx.conf.tpl
CMD /bin/sh -c "envsubst '\$APP_URL \$OAS_URL' < /etc/nginx/nginx.conf.tpl > /etc/nginx/nginx.conf && nginx -g 'daemon off;' || cat /etc/nginx/nginx.conf"