module GovukPublishingComponents
  class ComponentGuideController < GovukPublishingComponents::ApplicationController
    append_view_path File.join(Rails.root, "app", "views", "components")

    def index
      @component_docs = ComponentDoc.all
    end

    def show
      @component_doc = ComponentDoc.get(params[:component])
      @guide_breadcrumbs = [index_breadcrumb, component_breadcrumb(@component_doc)]
    end

    def fixture
      @component_doc = ComponentDoc.get(params[:component])
      @component_fixture = @component_doc.fixtures.find { |f| f.id == params[:fixture] }
      @guide_breadcrumbs = [
                             index_breadcrumb,
                             component_breadcrumb(@component_doc, @component_fixture),
                             {
                               title: @component_fixture.name
                             }
                           ]
    end

  private

    def index_breadcrumb
      {
        title: GovukPublishingComponents::Config.component_guide_title,
        url: component_guide_path
      }
    end

    def component_breadcrumb(component_doc, component_fixture = nil)
      Hash.new.tap do |h|
        h[:title] = component_doc.name
        h[:url] = component_doc_path(component_doc.id) if component_fixture
      end
    end
  end
end
