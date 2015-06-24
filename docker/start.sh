#!/bin/bash

# Check if the selected branch isn't the master branch.
if [[ $GIT_BRANCH != "master" ]]
then
  cd /webpage-content-extractor && \
  git checkout $GIT_BRANCH && \
  npm install
fi

# Start the supervisord with our config file.
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
