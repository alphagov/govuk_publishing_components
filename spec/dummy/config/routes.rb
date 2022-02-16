Rails.application.routes.draw do
  if Rails.env.production?
    constraints(host: "govuk-publishing-components.herokuapp.com") do
      match "/(*path)" => redirect { |params, _req|
                            "https://components.publishing.service.gov.uk/#{params[:path]}"
                          },
            via: %i[get post]
    end
  end

  mount GovukPublishingComponents::Engine, at: "/component-guide"
  root to: redirect("/component-guide")
  get "test", to: "welcome#index"
  get "step-nav/:slug", to: "step_nav#show"
  get "contextual-navigation", to: "welcome#contextual_navigation"
  get "contextual-navigation/*base_path", to: "welcome#contextual_navigation"
  get "admin", to: "welcome#admin"
  get "public", to: "welcome#public"
  get "error-summary", to: "welcome#errorsummary"
  get "tabsexample", to: "welcome#tabsexample"
  get "accordionexample", to: "welcome#accordionexample"
  get "table", to: "welcome#table"
  # we fake this URL to prevent the Single Page notification button from causing an error in the component guide
  get "/api/personalisation/check-email-subscription", to: proc { [404, {}, [""]] }
end
