require "govuk_app_config"

# This CSP has been customised so that govuk_publishing_components has the
# desired CSP that GOV.UK are working towards [1] with the December 2022 goals
# applied.
#
# This has been done so that developers working with the component gem are
# working with the rules we are aiming for to avoid any regressions and learn
# of any problems. It can be removed once the GovukContentSecurityPolicy is
# updated to apply these rules directly.
#
# [1]: https://github.com/alphagov/govuk_app_config/blob/31928b2079d82f6cbe7c296d4d6e54b4efc07b84/lib/govuk_app_config/govuk_content_security_policy.rb
GovukContentSecurityPolicy.configure do |policy|
  # Removes the ability to use script tags without a nonce, unsafe inline can't
  # be used if you use a nonce in a CSP so this is removed to avoid confusion
  script_policy_without_unsafe_inline = policy.script_src - ["'unsafe-inline'"]
  policy.script_src(*script_policy_without_unsafe_inline)
  # Removes the ability to use style tags without a nonce and using inline styles
  # on elements, unsafe inline can't be used if you use a nonce in a CSP so
  # this is removed to avoid confusion
  style_policy_without_unsafe_inline = policy.style_src - ["'unsafe-inline'"]
  policy.style_src(*style_policy_without_unsafe_inline)
  # This prevents the use of data encoded images, they need to reference files
  # on an approved host
  img_policy_without_data_scheme = policy.style_src - ["data:"]
  policy.img_src(*img_policy_without_data_scheme)
end

# Sets a nonce per request that is set in the CSP directives for script_src and
# style_src.
Rails.application.config.content_security_policy_nonce_generator = ->(_request) { SecureRandom.base64(16) }
