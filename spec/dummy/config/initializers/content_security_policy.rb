require "govuk_app_config"

GovukContentSecurityPolicy.configure do |policy|
  policy.img_src(*policy.img_src, "https://tiles.openfreemap.org", :data)
  policy.connect_src(*policy.connect_src, "https://tiles.openfreemap.org", :data)
end
