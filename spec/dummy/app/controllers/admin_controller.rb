class AdminController < ApplicationController
  layout 'admin'

  before_action do
    response.headers[Slimmer::Headers::SKIP_HEADER] = "true"
  end

  def index; end
end
