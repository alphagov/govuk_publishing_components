Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide"
  root to: redirect('/component-guide')
  get 'test', to: 'welcome#index'
end
