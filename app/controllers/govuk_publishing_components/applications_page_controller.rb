module GovukPublishingComponents
  class ApplicationsPageController < GovukPublishingComponents::ApplicationController
    def show
      applications = [
        {
          type: "public-facing",
          apps: %w[collections email-alert-frontend feedback finder-frontend frontend government-frontend smart-answers static].sort,
        },
        {
          type: "publishing",
          apps: %w[content-publisher content-data-admin collections-publisher travel-advice-publisher whitehall datagovuk_find local-links-manager places-manager support manuals-publisher maslow service-manual-publisher short-url-manager specialist-publisher content-tagger publisher transition search-admin].sort,
        },
        {
          type: "utility",
          apps: %w[account-api signon govspeak govspeak-preview release govuk-developer-docs search-v2-evaluator govuk-chat].sort,
        },
      ]

      @cache_status = Rails.application.config.cache_store != :null_store
      @performcache_status = Rails.application.config.action_controller.perform_caching

      @applications_output = Rails.cache.fetch("applications_cache", expires_in: 5.minutes) do
        applications_data(applications)
      end
    end

  private

    def applications_data(applications)
      output = []
      applications.each do |type|
        type[:apps].each do |application|
          app = ApplicationsPage.new(application)

          output << {
            name: app.readable_name,
            type: type[:type],
            link: "https://github.com/alphagov/#{application}",
            source: app.source,
            gem_version: app.gem_version,
            gem_version_status: app.gem_version == GovukPublishingComponents::VERSION ? "green" : "red",
            slimmer_version: app.slimmer_version,
            sass_version: app.sass_version,
          }
        end
      end
      output
    end
  end
end
