#!/bin/bash

bundle install

if [[ $1 == "--live" ]] ; then
  GOVUK_APP_DOMAIN=www.gov.uk \
  GOVUK_WEBSITE_ROOT=https://www.gov.uk \
  PLEK_SERVICE_STATIC_URI=${PLEK_SERVICE_STATIC_URI-assets.publishing.service.gov.uk} \
  bundle exec rackup spec/dummy/config.ru --host 0.0.0.0 -p 3212
else
  bundle exec rackup spec/dummy/config.ru --host 0.0.0.0 -p 3212
fi
