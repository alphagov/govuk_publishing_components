Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide"
  root to: redirect('/component-guide')
  get 'test', to: 'welcome#index'
  get 'step-nav/:slug', to: 'step_nav#show'
end
