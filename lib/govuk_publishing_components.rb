require "govuk_publishing_components/config"
require "govuk_publishing_components/engine"
require "govuk_publishing_components/presenters/step_by_step_nav_helper"
require "govuk_publishing_components/presenters/related_navigation_helper"
require "govuk_publishing_components/presenters/contextual_sidebar"

require "govuk_publishing_components/app_helpers/step_nav"
require "govuk_publishing_components/app_helpers/step_nav_helper"

module GovukPublishingComponents
  StepNavHelper = GovukPublishingComponents::AppHelpers::StepNavHelper
  StepNav = GovukPublishingComponents::AppHelpers::StepNav
end
