Rails.application.routes.draw do
  mount GovukPublishingComponents::Engine, at: "/component-guide"
  root to: redirect('/component-guide')
  get 'test', to: 'welcome#index'
  get 'step-nav/:slug', to: 'step_nav#show'
  get 'contextual-navigation', to: 'welcome#contextual_navigation'
  get 'contextual-navigation/*base_path', to: 'welcome#contextual_navigation'
  get 'admin', to: 'welcome#admin'
  get 'tabsexample', to: 'welcome#tabsexample'
end
