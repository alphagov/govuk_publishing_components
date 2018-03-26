class StepNavController < ApplicationController
  def show
    content_item = Services.content_store.content_item(base_path)
    @step_nav_helper = GovukPublishingComponents::Presenters::StepNavHelper.new(content_item, base_path)
  end

private

  def base_path
    "/#{params[:slug]}"
  end
end
