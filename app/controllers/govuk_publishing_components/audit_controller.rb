module GovukPublishingComponents
  class AuditController < GovukPublishingComponents::ApplicationController
    def show
      path = Dir.pwd

      components = AuditComponents.new(path)
      applications = analyse_applications(File.expand_path("..", path))
      compared_data = AuditComparer.new(components.data, applications)

      @applications = compared_data.applications_data || []
      @components = compared_data.gem_data || []
    end

  private

    def analyse_applications(path)
      results = []
      applications = %w[
        calculators
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

      applications.each do |application|
        application_path = [path, application].join("/")
        app = AuditApplications.new(application_path, application)
        results << app.data
      end

      results
    end
  end
end
