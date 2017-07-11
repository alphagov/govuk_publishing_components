module GovukPublishingComponents
  class ComponentGuideController < ApplicationController
    append_view_path File.join(Rails.root, "app", "views", "components")

    def index
      @component_docs = ComponentDoc.all
      @guide_breadcrumbs = [ { title: 'Component Guide'} ]
    end

    def show
      @component_doc = ComponentDoc.get(params[:component])
      @guide_breadcrumbs = [
                             {
                               title: 'Component Guide',
                               url: component_guide_path
                             },
                             {
                               title: @component_doc.name
                             }
                           ]
    end

    def fixture
      @component_doc = ComponentDoc.get(params[:component])
      @component_fixture = @component_doc.fixtures.find { |f| f.id == params[:fixture] }
      @guide_breadcrumbs = [
                             {
                               title: 'Component Guide',
                               url: component_guide_path
                             },
                             {
                               title: @component_doc.name,
                               url: component_doc_path(@component_doc.id)
                             },
                             {
                               title: @component_fixture.name
                             }
                           ]
    end
  end
end
