# This is used only for building previews of govuk_publishing_components
# branches prior to merge.
# It lets us deploy and push an image to the Kubernetes registry, required
# to enable previews of govuk_publishing_components on govuk-preview-app.
# This follows the convention of our other deployable GOV.UK applications.
# However, unlike those applications, we don't ever deploy
# govuk_publishing_components, we just push to RubyGems when we release.
ARG ruby_version=3.3
ARG base_image=ghcr.io/alphagov/govuk-ruby-base:$ruby_version
ARG builder_image=ghcr.io/alphagov/govuk-ruby-builder:$ruby_version

FROM --platform=$TARGETPLATFORM $builder_image AS builder

WORKDIR $APP_HOME
COPY Gemfile* .ruby-version *.gemspec ./
COPY lib/govuk_publishing_components/version.rb lib/govuk_publishing_components/version.rb
# The base image's BUNDLE_WITHOUT excludes :development, but spec/dummy (the
# component guide app) needs it - e.g. terser is only a development
# dependency (see the gemspec), and spec/dummy's config.rb requires it
# unconditionally.
RUN bundle config set --local without 'test cucumber' && bundle install
# The gemspec vendors govuk-frontend's own precompiled component JS
# (node_modules/govuk-frontend/**/*.bundle.js - see s.files) straight into
# the gem, so the component guide needs node_modules present, not just Ruby
# deps.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN bundle exec rake dartsass


FROM --platform=$TARGETPLATFORM $base_image

ENV GOVUK_APP_NAME=govuk_publishing_components \
    MAIN_COMPONENT_GUIDE=true

WORKDIR $APP_HOME
COPY --from=builder $BUNDLE_PATH $BUNDLE_PATH
COPY --from=builder $BOOTSNAP_CACHE_DIR $BOOTSNAP_CACHE_DIR
COPY --from=builder $APP_HOME .
# spec/dummy's tmp/log dirs aren't checked in, so they don't exist yet -
# without this the non-root `app` user can't create them itself.
RUN mkdir -p spec/dummy/tmp spec/dummy/log && chown -R app:app spec/dummy/tmp spec/dummy/log

USER app
EXPOSE 3000
CMD bundle exec rackup spec/dummy/config.ru -p $PORT -o 0.0.0.0
