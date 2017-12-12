Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide"
  root to: 'welcome#index'
end
