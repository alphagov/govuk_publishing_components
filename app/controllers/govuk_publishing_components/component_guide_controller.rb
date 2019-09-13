module GovukPublishingComponents
  class ComponentGuideController < GovukPublishingComponents::ApplicationController
    append_view_path File.join(Rails.root, "app", "views", GovukPublishingComponents::Config.component_directory_name)

    def index
      @component_docs = component_docs.all
      @gem_component_docs = gem_component_docs.all
    end

    def show
      @component_doc = component_docs.get(params[:component])
      @guide_breadcrumbs = [index_breadcrumb, component_breadcrumb(@component_doc)]
    end

    def example
      @component_doc = component_docs.get(params[:component])
      @component_example = @component_doc.examples.find { |f| f.id == params[:example] }
      @guide_breadcrumbs = [
                             index_breadcrumb,
                             component_breadcrumb(@component_doc, @component_example),
                             {
                               title: @component_example.name
                             }
                           ]
    end

    def preview
      @component_examples = []
      @component_doc = component_docs.get(params[:component])
      @preview = true

      if params[:example].present?
        @component_examples.push(@component_doc.examples.find { |f| f.id == params[:example] })
      else
        @component_examples = @component_doc.examples
      end
    end

    def designer
      @component_doc = component_docs.get(params[:component])
      @preview = false
      @component_example = @component_doc.examples.find { |f| f.id == params[:example] }
    end

  private

    def component_docs
      @component_docs ||= ComponentDocs.new
    end

    def gem_component_docs
      @gem_component_docs ||= ComponentDocs.new(gem_components: true)
    end

    def index_breadcrumb
      {
        title: GovukPublishingComponents::Config.component_guide_title,
        url: component_guide_path
      }
    end

    def component_breadcrumb(component_doc, component_example = nil)
      Hash.new.tap do |h|
        h[:title] = component_doc.name
        h[:url] = component_doc_path(component_doc.id) if component_example
      end
    end
  end
end
