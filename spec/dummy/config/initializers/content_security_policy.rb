require "govuk_app_config"

GovukContentSecurityPolicy.configure

Rails.application.config.content_security_policy_nonce_generator = ->(_request) { SecureRandom.base64(16) }
