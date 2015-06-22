FROM node:0.12

EXPOSE 8001

RUN apt-get update &&\
  apt-get upgrade -y &&\
  apt-get install -y git supervisor &&\
  apt-get clean &&\
  apt-get autoclean

RUN git clone https://github.com/mxr576/webpage-content-extractor.git && \
  cd webpage-content-extractor && \
  npm install

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENTRYPOINT ["/usr/bin/supervisord"]
