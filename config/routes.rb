GovukPublishingComponents::Engine.routes.draw do
  get "/audit" => "audit#show", as: :audit
  get "/applications" => "applications_page#show", as: :apps

  scope "/flexible-sections/" do
    get ":flexible_section" => "component_guide#show", as: :flexible_section_doc
    get ":flexible_section/preview" => "component_guide#preview", as: :flexible_section_preview_all
    get ":flexible_section/:example" => "component_guide#example", as: :flexible_section_example
    get ":flexible_section/:example/preview" => "component_guide#preview", as: :flexible_section_preview
  end

  root to: "component_guide#index", as: :component_guide
  get ":component" => "component_guide#show", as: :component_doc
  get ":component/preview" => "component_guide#preview", as: :component_preview_all
  get ":component/:example" => "component_guide#example", as: :component_example
  get ":component/:example/preview" => "component_guide#preview", as: :component_preview
end
