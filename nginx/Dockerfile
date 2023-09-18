FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# Copy the configuration into the container at /etc/nginx
WORKDIR /etc/nginx/conf.d/
COPY ccpp.conf ./

ENTRYPOINT sed -i "s/#{HOST}/${HOST}/g" ccpp.conf \
    && sed -i "s/#{PORT}/${PORT}/g" ccpp.conf \
    && nginx -g 'daemon off;'
