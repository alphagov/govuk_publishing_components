module GovukPublishingComponents
  class AllComponentsController < GovukPublishingComponents::ApplicationController
    def show
      @all_components = ComponentDocs.new(gem_components: true).all
      @all_components.reverse! if params[:reversed] == "true"
    end
  end
end
