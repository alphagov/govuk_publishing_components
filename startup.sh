#!/bin/bash

yarn install
bundle check || bundle install

export MAIN_COMPONENT_GUIDE=true

if [[ $1 == "--live" ]] ; then
  GOVUK_APP_DOMAIN=www.gov.uk \
  GOVUK_WEBSITE_ROOT=https://www.gov.uk \
  PLEK_SERVICE_CONTENT_STORE_URI=${PLEK_SERVICE_CONTENT_STORE_URI-https://www.gov.uk/api} \
  ./bin/dev
else
  ./bin/dev
fi
