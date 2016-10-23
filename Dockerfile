FROM ubuntu:14.04
MAINTAINER Dockerfiles

RUN apt-get update && apt-get install --force-yes -y \
    git \
    python \
    build-essential \
    python-pip \
    python-dev \
    libopencv-dev \
    python-opencv \
    uwsgi \
    uwsgi-plugin-python \
    nginx \
    supervisor \
  && rm -rf /var/lib/apt/lists/*

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/sites-available/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY requirements.txt /home/facelook/
RUN pip install -r /home/facelook/requirements.txt

COPY app /home/facelook/app
COPY uwsgi.ini /home/facelook/uwsgi.ini
COPY wsgi.py /home/facelook/wsgi.py

EXPOSE 22 80
CMD ["/usr/bin/supervisord"]
