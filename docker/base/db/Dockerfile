FROM postgres:alpine

COPY ./docker/base/db/manage /manage

RUN chmod +x /manage/* \
    && mv /manage/* /usr/local/bin \
    && rmdir /manage