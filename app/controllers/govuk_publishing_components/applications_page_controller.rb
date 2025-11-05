module GovukPublishingComponents
  class ApplicationsPageController < GovukPublishingComponents::ApplicationController
    def show
      applications = %w[
        account-api
        collections
        collections-publisher
        content-data-admin
        content-publisher
        content-tagger
        datagovuk_find
        email-alert-frontend
        feedback
        finder-frontend
        frontend
        government-frontend
        govspeak
        govspeak-preview
        govuk-chat
        govuk-developer-docs
        local-links-manager
        manuals-publisher
        maslow
        places-manager
        publisher
        release
        search-admin
        search-v2-evaluator
        service-manual-publisher
        short-url-manager
        signon
        smart-answers
        specialist-publisher
        static
        support
        transition
        travel-advice-publisher
        whitehall
      ].sort

      @in_application = ENV["MAIN_COMPONENT_GUIDE"] ? false : true

      @cache_status = Rails.application.config.cache_store != :null_store
      @performcache_status = Rails.application.config.action_controller.perform_caching

      @applications_output = Rails.cache.fetch("applications_magic", expires_in: 5.minutes) do
        applications_data(applications)
      end
    end

  private

    def applications_data(applications)
      output = []
      applications.each do |application|
        app = ApplicationsPage.new(application)

        output << {
          name: app.readable_name,
          link: "https://github.com/alphagov/#{application}",
          location: app.location,
          gem_version: app.gem_version,
          gem_version_status: app.gem_version == GovukPublishingComponents::VERSION ? "green" : "red",
          slimmer_version: app.slimmer_version,
          sass_version: app.sass_version,
        }
      end

      output
    end
  end
end
