GovukPublishingComponents::Engine.routes.draw do
  get "/audit" => "audit#show", as: :audit
  get "/applications" => "applications_page#show", as: :apps
  root to: "component_guide#index", as: :component_guide
  get ":component/preview" => "component_guide#preview", as: :component_preview_all
  get ":component/:example/preview" => "component_guide#preview", as: :component_preview
  get ":component" => "component_guide#show", as: :component_doc
  get ":component/:example" => "component_guide#example", as: :component_example
end
