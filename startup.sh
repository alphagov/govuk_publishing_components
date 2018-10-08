#!/bin/bash

npm install
bundle install

bundle exec rackup spec/dummy/config.ru --host 0.0.0.0 -p 3212
