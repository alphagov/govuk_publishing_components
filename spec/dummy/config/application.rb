require_relative "boot"

require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
require "terser"
require "dartsass-rails"

# In a heroku environment we don't have chrome and chromedriver available
# so loading these gems fails.
unless ENV["HEROKU"]
  # We need to load govuk_test before jasmine_selenium runner so webdrivers is
  # initialised.
  require "govuk_test"
end

require "govuk_publishing_components"

module Dummy
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.i18n.default_locale = :en
    config.i18n.fallbacks = [I18n.default_locale]
    config.i18n.available_locales = %i[
      ar
      az
      be
      bg
      bn
      cs
      cy
      da
      de
      dr
      el
      en
      es-419
      es
      et
      fa
      fi
      fr
      gd
      gu
      he
      hi
      hr
      hu
      hy
      id
      is
      it
      ja
      ka
      kk
      ko
      lt
      lv
      ms
      mt
      nl
      no
      pa-pk
      pa
      pl
      ps
      pt
      ro
      ru
      si
      sk
      sl
      so
      sq
      sr
      sv
      sw
      ta
      th
      tk
      tr
      uk
      ur
      uz
      vi
      zh-hk
      zh-tw
      zh
    ]

    # Use current Rails version defaults, this isn't a normal app so we don't
    # need to be delicate about upgrading.
    config.load_defaults Rails::VERSION::STRING.to_f
  end
end
