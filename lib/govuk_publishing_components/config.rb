module GovukPublishingComponents
  def self.configure
    yield(Config)
  end

  module Config
    APP_COMPONENT_DIRECTORY = "components".freeze

    mattr_accessor :component_guide_title
    self.component_guide_title = "Component Guide"

    mattr_accessor :application_dir
    self.application_dir = ""

    mattr_accessor :application_stylesheet
    self.application_stylesheet = "application"

    mattr_accessor :application_javascript
    self.application_javascript = "application"

    mattr_accessor :exclude_css_from_static
    self.exclude_css_from_static = true

    def self.component_directory_name
      APP_COMPONENT_DIRECTORY
    end

    def self.gem_directory
      Gem::Specification.find_by_name("govuk_publishing_components").gem_dir
    end

    ALL_ASSETS = {
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/component_guide/application.scss" => "component_guide/application.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_accordion.scss" => "govuk_publishing_components/components/_accordion.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_action-link.scss" => "govuk_publishing_components/components/_action-link.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_attachment.scss" => "govuk_publishing_components/components/_attachment.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_attachment-link.scss" => "govuk_publishing_components/components/_attachment-link.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_back-link.scss" => "govuk_publishing_components/components/_back-link.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_big-number.scss" => "govuk_publishing_components/components/_big-number.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_breadcrumbs.scss" => "govuk_publishing_components/components/_breadcrumbs.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_button.scss" => "govuk_publishing_components/components/_button.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_cards.scss" => "govuk_publishing_components/components/_cards.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_character-count.scss" => "govuk_publishing_components/components/_character-count.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_checkboxes.scss" => "govuk_publishing_components/components/_checkboxes.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_contents-list.scss" => "govuk_publishing_components/components/_contents-list.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_contextual-guidance.scss" => "govuk_publishing_components/components/_contextual-guidance.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_contextual-sidebar.scss" => "govuk_publishing_components/components/_contextual-sidebar.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_cookie-banner.scss" => "govuk_publishing_components/components/_cookie-banner.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_cross-service-header.scss" => "govuk_publishing_components/components/_cross-service-header.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_date-input.scss" => "govuk_publishing_components/components/_date-input.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_details.scss" => "govuk_publishing_components/components/_details.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_devolved-nations.scss" => "govuk_publishing_components/components/_devolved-nations.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_document-list.scss" => "govuk_publishing_components/components/_document-list.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_emergency-banner.scss" => "govuk_publishing_components/components/_emergency-banner.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_error-alert.scss" => "govuk_publishing_components/components/_error-alert.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_error-message.scss" => "govuk_publishing_components/components/_error-message.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_error-summary.scss" => "govuk_publishing_components/components/_error-summary.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_feedback.scss" => "govuk_publishing_components/components/_feedback.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_fieldset.scss" => "govuk_publishing_components/components/_fieldset.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_file-upload.scss" => "govuk_publishing_components/components/_file-upload.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_govspeak-html-publication.scss" => "govuk_publishing_components/components/_govspeak-html-publication.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_govspeak.scss" => "govuk_publishing_components/components/_govspeak.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_heading.scss" => "govuk_publishing_components/components/_heading.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_hint.scss" => "govuk_publishing_components/components/_hint.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_image-card.scss" => "govuk_publishing_components/components/_image-card.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_input.scss" => "govuk_publishing_components/components/_input.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_inset-text.scss" => "govuk_publishing_components/components/_inset-text.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_intervention.scss" => "govuk_publishing_components/components/_intervention.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_inverse-header.scss" => "govuk_publishing_components/components/_inverse-header.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_label.scss" => "govuk_publishing_components/components/_label.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_layout-footer.scss" => "govuk_publishing_components/components/_layout-footer.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_layout-for-admin.scss" => "govuk_publishing_components/components/_layout-for-admin.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_layout-for-public.scss" => "govuk_publishing_components/components/_layout-for-public.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_layout-header.scss" => "govuk_publishing_components/components/_layout-header.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_layout-super-navigation-header.scss" => "govuk_publishing_components/components/_layout-super-navigation-header.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_lead-paragraph.scss" => "govuk_publishing_components/components/_lead-paragraph.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_metadata.scss" => "govuk_publishing_components/components/_metadata.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_modal-dialogue.scss" => "govuk_publishing_components/components/_modal-dialogue.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_notice.scss" => "govuk_publishing_components/components/_notice.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_option-select.scss" => "govuk_publishing_components/components/_option-select.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_organisation-logo.scss" => "govuk_publishing_components/components/_organisation-logo.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_panel.scss" => "govuk_publishing_components/components/_panel.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_phase-banner.scss" => "govuk_publishing_components/components/_phase-banner.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_previous-and-next-navigation.scss" => "govuk_publishing_components/components/_previous-and-next-navigation.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_print-link.scss" => "govuk_publishing_components/components/_print-link.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_radio.scss" => "govuk_publishing_components/components/_radio.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_related-navigation.scss" => "govuk_publishing_components/components/_related-navigation.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_reorderable-list.scss" => "govuk_publishing_components/components/_reorderable-list.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_search.scss" => "govuk_publishing_components/components/_search.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_select.scss" => "govuk_publishing_components/components/_select.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_share-links.scss" => "govuk_publishing_components/components/_share-links.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_show-password.scss" => "govuk_publishing_components/components/_show-password.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_signup-link.scss" => "govuk_publishing_components/components/_signup-link.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_single-page-notification-button.scss" => "govuk_publishing_components/components/_single-page-notification-button.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_skip-link.scss" => "govuk_publishing_components/components/_skip-link.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_step-by-step-nav-header.scss" => "govuk_publishing_components/components/_step-by-step-nav-header.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_step-by-step-nav-related.scss" => "govuk_publishing_components/components/_step-by-step-nav-related.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_step-by-step-nav.scss" => "govuk_publishing_components/components/_step-by-step-nav.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_subscription-links.scss" => "govuk_publishing_components/components/_subscription-links.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_success-alert.scss" => "govuk_publishing_components/components/_success-alert.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_summary-list.scss" => "govuk_publishing_components/components/_summary-list.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_tabs.scss" => "govuk_publishing_components/components/_tabs.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_table.scss" => "govuk_publishing_components/components/_table.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_textarea.scss" => "govuk_publishing_components/components/_textarea.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_title.scss" => "govuk_publishing_components/components/_title.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_translation-nav.scss" => "govuk_publishing_components/components/_translation-nav.css",
      "#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_warning-text.scss" => "govuk_publishing_components/components/_warning-text.css",
    }.freeze

    def self.all_assets
      ALL_ASSETS
    end
  end
end
