module GovukPublishingComponents
  class ComponentDoc
    attr_reader :id,
                :name,
                :description,
                :body,
                :component,
                :accessibility_excluded_rules,
                :source,
                :embed

    def initialize(component)
      @component = component
      @id = component[:id]
      @name = component[:name]
      @description = component[:description]
      @body = component[:body]
      @accessibility_excluded_rules = component[:accessibility_excluded_rules]
      @source = component[:source]
      @embed = component[:embed]
    end

    def accessibility_criteria
      shared_accessibility_criteria = []

      if component[:shared_accessibility_criteria].present?
        component[:shared_accessibility_criteria].each do |criteria|
          shared_accessibility_criteria << SharedAccessibilityCriteria.send(criteria) if SharedAccessibilityCriteria.respond_to? criteria
        end
      end

      "#{component[:accessibility_criteria]}\n#{shared_accessibility_criteria.join("\n")}"
    end

    def component_wrapper_options
      if uses_component_wrapper_helper?
        ComponentWrapperHelperOptions.description
      end
    end

    def example
      examples.first
    end

    def other_examples
      examples.slice(1..-1)
    end

    def display_html?
      component[:display_html]
    end

    def display_preview?
      component[:display_preview].nil? ? true : component[:display_preview]
    end

    def uses_component_wrapper_helper?
      component[:uses_component_wrapper_helper]
    end

    def html_body
      markdown_to_html(body) if body.present?
    end

    def html_accessibility_criteria
      markdown_to_html(accessibility_criteria) if accessibility_criteria.present?
    end

    def html_component_wrapper_options
      markdown_to_html(component_wrapper_options) if component_wrapper_options.present?
    end

    def partial_path
      if source == "gem"
        "govuk_publishing_components/components/#{id}"
      else
        "#{GovukPublishingComponents::Config.component_directory_name}/#{id}"
      end
    end

    def govuk_frontend_components
      component[:govuk_frontend_components].to_a
    end

    def github_search_url
      params = { q: "org:alphagov #{partial_path}", type: "Code" }
      "https://github.com/search?#{params.to_query}"
    end

    def examples
      @examples ||= component[:examples].map do |id, example_data|
        example_data ||= {}
        example_data["embed"] ||= embed
        ComponentExample.new(id.to_s, example_data)
      end
    end

  private

    def markdown_to_html(markdown)
      Kramdown::Document.new(markdown).to_html
    end
  end
end
