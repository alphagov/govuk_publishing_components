require 'govuk_publishing_components/components/task_list_helper'

module GovukPublishingComponents
  module Components
    class Railtie < Rails::Railtie
      initializer "govuk_publishing_components.components.task_list_helper" do
        ActiveSupport.on_load(:action_view) {
          include GovukPublishingComponents::Components::TaskListHelper
        }
      end
    end
  end
end
