class StepNavController < ApplicationController
  def show
    @content_item = Services.content_store.content_item(request.path).to_h
  end
end
