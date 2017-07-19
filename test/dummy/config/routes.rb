Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide"
end
