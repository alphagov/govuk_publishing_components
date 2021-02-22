module GovukPublishingComponents
  class AuditController < GovukPublishingComponents::ApplicationController
    def show
      application_dirs = %w[
        collections
        collections-publisher
        content-data-admin
        content-publisher
        datagovuk_find
        email-alert-frontend
        feedback
        finder-frontend
        frontend
        government-frontend
        govspeak-preview
        govuk-account-manager-prototype
        govuk-coronavirus-vulnerable-people-form
        info-frontend
        licence-finder
        manuals-frontend
        release
        search-admin
        service-manual-frontend
        signon
        smart-answers
        static
        travel-advice-publisher
        whitehall
      ].sort
      application_dirs = [GovukPublishingComponents::ApplicationHelper.get_application_name_from_path(Rails.root)] unless ENV["MAIN_COMPONENT_GUIDE"]

      gem_path = Gem.loaded_specs["govuk_publishing_components"].full_gem_path
      gem_path = Dir.pwd if ENV["MAIN_COMPONENT_GUIDE"]

      components = AuditComponents.new(gem_path, false)
      applications = analyse_applications(File.expand_path("..", gem_path), application_dirs)
      compared_data = AuditComparer.new(components.data, applications)

      @applications = compared_data.applications_data || []
      @components = compared_data.gem_data || []
    end

  private

    def analyse_applications(path, application_dirs)
      results = []

      application_dirs.each do |application|
        application_path = [path, application].join("/")
        app = AuditApplications.new(application_path, application)
        results << app.data
      end

      results
    end
  end
end
