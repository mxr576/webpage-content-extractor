FROM node:0.12

MAINTAINER  Biczó Dezső "mxr576@gmail.com"

EXPOSE 8001

ENV GIT_BRANCH master

RUN apt-get update &&\
  apt-get upgrade -y &&\
  apt-get install -y git supervisor &&\
  apt-get clean &&\
  apt-get autoclean

RUN git clone https://github.com/mxr576/webpage-content-extractor.git && \
  cd webpage-content-extractor && \
  npm install

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ADD start.sh /start.sh

RUN chmod +x /start.sh

CMD ["/bin/bash", "-c", "/start.sh"]
