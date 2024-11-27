# FROM nginx:stable-alpine

# ARG NGINX_CONF=nginx.conf
# COPY ${NGINX_CONF} /etc/nginx/nginx.conf

# EXPOSE 80 443

FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create cache directory
RUN mkdir -p /var/cache/nginx
