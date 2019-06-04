# FROM achillesrasquinha/rpy2
FROM python:alpine

LABEL maintainer achillesrasquinha@gmail.com

WORKDIR /app

RUN set -o errexit -o nounset \
	&& echo "Installing dependencies" \
	&& apk add --no-cache \
                bash \
        && echo "Adding user and group" \
        && addgroup -S app \
        && adduser -S -G app app
        # build-deps \
        # gcc \
        # musl-dev \
        # build-base \
        # git \
        # python3-dev \
        # python3-tkinter \
        # graphviz-dev \
        # curl \
        # openjdk8

# # Install Java
# RUN { \
# 		echo '#!/bin/sh'; \
# 		echo 'set -e'; \
# 		echo; \
# 		echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \
# 	} > /usr/local/bin/docker-java-home \
# 	&& chmod +x /usr/local/bin/docker-java-home
# ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk
# ENV PATH $PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin

# ENV JAVA_VERSION 8u212
# ENV JAVA_ALPINE_VERSION 8.212.04-r0

# RUN set -x \
# 	&& apk add --no-cache \
# 		openjdk8="$JAVA_ALPINE_VERSION" \
# && [ "$JAVA_HOME" = "$(docker-java-home)" ]

# Install R
# RUN apk add R R-dev

# Copy the pip requirements file into the container
# COPY ./requirements.txt  /requirements.txt

# # Install pip packages
# RUN pip3 install --upgrade pip 
# RUN echo "http://dl-8.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories 

# # Add HDF5 support
# RUN apk add --no-cache --allow-untrusted --repository http://dl-3.alpinelinux.org/alpine/edge/testing hdf5 hdf5-dev
# RUN apk --no-cache --update-cache add postgresql-dev \ 
#     gfortran g++ python python-dev \
# 	py3-pip build-base wget freetype-dev \ 
#     libpng-dev openblas-dev bash \
#     && ln -s /usr/include/locale.h /usr/include/xlocale.h	

# RUN pip3 install numpy pyyaml \
# 	&& pip3 install scipy \
# 	&& pip3 install setuptools wheel \
# 	&& pip3 install javabridge \ 
# 	&& pip3 install -r /requirements.txt \
# 	&& rm /requirements.txt

# # Export python path
# ENV PYTHONPATH="/app/candis"

COPY ./requirements-dev.txt  /app/requirements-dev.txt
RUN pip install -r /app/requirements-dev.txt

COPY . /app

COPY ./docker/base/web/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint \
	&& chmod +x /entrypoint \
	&& chown app /entrypoint

COPY ./docker/development/web/start /start
RUN sed -i 's/\r//' /start \
	&& chmod +x /start \
	&& chown app /start

RUN chown -R app:app /app