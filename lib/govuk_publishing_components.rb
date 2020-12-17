require "active_support"
require "action_controller"
require "action_view"
require "govuk_publishing_components/config"
require "govuk_publishing_components/engine"
require "govuk_publishing_components/presenters/shared_helper"
require "govuk_publishing_components/presenters/attachment"
require "govuk_publishing_components/presenters/breadcrumbs"
require "govuk_publishing_components/presenters/breadcrumb_selector"
require "govuk_publishing_components/presenters/button_helper"
require "govuk_publishing_components/presenters/contextual_navigation"
require "govuk_publishing_components/presenters/related_navigation_helper"
require "govuk_publishing_components/presenters/step_by_step_nav_helper"
require "govuk_publishing_components/presenters/page_with_step_by_step_navigation"
require "govuk_publishing_components/presenters/public_layout_helper"
require "govuk_publishing_components/presenters/content_breadcrumbs_based_on_ancestors"
require "govuk_publishing_components/presenters/content_breadcrumbs_based_on_priority"
require "govuk_publishing_components/presenters/content_breadcrumbs_based_on_taxons"
require "govuk_publishing_components/presenters/content_breadcrumbs_based_on_topic"
require "govuk_publishing_components/presenters/checkboxes_helper"
require "govuk_publishing_components/presenters/select"
require "govuk_publishing_components/presenters/meta_tags"
require "govuk_publishing_components/presenters/content_item"
require "govuk_publishing_components/presenters/translation_nav_helper"
require "govuk_publishing_components/presenters/subscription_links_helper"
require "govuk_publishing_components/presenters/schema_org"
require "govuk_publishing_components/presenters/heading_helper"
require "govuk_publishing_components/presenters/contents_list_helper"
require "govuk_publishing_components/presenters/image_card_helper"
require "govuk_publishing_components/presenters/organisation_logo_helper"
require "govuk_publishing_components/presenters/highlight_boxes_helper"
require "govuk_publishing_components/presenters/taxonomy_list_helper"

require "govuk_publishing_components/app_helpers/taxon_breadcrumbs"
require "govuk_publishing_components/app_helpers/table_helper"
require "govuk_publishing_components/app_helpers/brand_helper"
require "govuk_publishing_components/app_helpers/countdown_helper"
require "govuk_publishing_components/app_helpers/environment"

# Add i18n paths and views for usage outside of a Rails app
I18n.load_path.unshift(
  *Dir.glob(File.expand_path("config/locales/*.yml", GovukPublishingComponents::Config.gem_directory)),
)

ActiveSupport.on_load(:action_controller) do
  ActionController::Base.append_view_path(
    File.expand_path("app/views", GovukPublishingComponents::Config.gem_directory),
  )
end

module GovukPublishingComponents
  def self.render(component, options = {})
    I18n.with_locale(options.fetch(:locale, "en")) do
      renderer = ActionController::Base.renderer
      renderer.render(partial: component, locals: options)
    end
  end
end
