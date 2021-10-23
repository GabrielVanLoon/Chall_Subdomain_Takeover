FROM nginx
WORKDIR /etc

#RUN apt update && apt upgrade -y && apt install -y nginx
RUN rm -f nginx/nginx.conf
COPY nginx.conf nginx/nginx.conf

RUN service nginx restart
