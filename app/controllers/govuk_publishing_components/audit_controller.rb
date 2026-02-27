module GovukPublishingComponents
  class AuditController < GovukPublishingComponents::ApplicationController
    def show
      application_dirs = %w[
        account-api
        collections
        collections-publisher
        content-block-manager
        content-data-admin
        content-tagger
        datagovuk_find
        email-alert-frontend
        fact-check-manager
        feedback
        finder-frontend
        frontend
        government-frontend
        govspeak
        govspeak-preview
        govuk-chat
        govuk-developer-docs
        govuk_web_banners
        local-links-manager
        manuals-publisher
        places-manager
        publisher
        release
        search-admin
        service-manual-publisher
        short-url-manager
        signon
        smart-answers
        specialist-publisher
        support
        transition
        travel-advice-publisher
        whitehall
      ]

      application_dirs = [GovukPublishingComponents::ApplicationHelper.get_application_name_from_path(Rails.root)] unless ENV["MAIN_COMPONENT_GUIDE"]

      gem_path = Gem.loaded_specs["govuk_publishing_components"].full_gem_path
      gem_path = Dir.pwd if ENV["MAIN_COMPONENT_GUIDE"]
      host_dir = File.expand_path("..")

      @in_application = false
      @in_application = true unless ENV["MAIN_COMPONENT_GUIDE"]

      components = AuditComponents.new(gem_path)
      applications = analyse_applications(host_dir, application_dirs)
      compared_data = AuditComparer.new(components.data, applications)

      @applications = compared_data.applications_data || []
      @components = compared_data.gem_data || []
    end

  private

    def analyse_applications(path, application_dirs)
      results = []
      applications_found = 0

      application_dirs.each do |application|
        application_path = [path, application].join("/")
        dir = application
        dir = Rails.application.class.module_parent_name.underscore.dasherize unless ENV["MAIN_COMPONENT_GUIDE"]
        app = AuditApplications.new(application_path, application, dir)
        applications_found += 1 if app.data[:application_found]
        results << app.data
      end

      @other_applications = false
      @other_applications = true if applications_found > 1

      results
    end
  end
end
