Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide"
  root to: redirect('/component-guide')
  get 'test', to: 'welcome#index'
  get 'step-nav/:slug', to: 'step_nav#show'
  get 'contextual-navigation', to: 'welcome#contextual_navigation'
  get 'contextual-navigation/*base_path', to: 'welcome#contextual_navigation'

  get '/admin', to: 'admin#index'
  get '/admin/form', to: 'admin#form'
  get '/admin/tag', to: 'admin#tag'
  get '/admin/taxons', to: 'admin#taxons'
  get '/admin/users', to: 'admin#users'
end
