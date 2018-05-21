module GovukPublishingComponents
  class ComponentDoc
    attr_reader :id,
                :name,
                :description,
                :body,
                :accessibility_criteria,
                :accessibility_excluded_rules,
                :examples,
                :source

    def initialize(
      component,
      accessibility_criteria,
      examples
    )
      @id = component[:id]
      @name = component[:name]
      @description = component[:description]
      @body = component[:body]
      @accessibility_criteria = accessibility_criteria
      @accessibility_excluded_rules = component[:accessibility_excluded_rules]
      @examples = examples
      @source = component[:source]
      @display_html = component[:display_html]
    end

    def example
      examples.first
    end

    def other_examples
      examples.slice(1..-1)
    end

    def display_html?
      @display_html
    end

    def html_body
      govspeak_to_html(body) if body.present?
    end

    def html_accessibility_criteria
      govspeak_to_html(accessibility_criteria) if accessibility_criteria.present?
    end

    def partial_path
      if source == 'gem'
        "govuk_publishing_components/components/#{id}"
      else
        "#{GovukPublishingComponents::Config.component_directory_name}/#{id}"
      end
    end

    def github_search_url
      params = { q: "org:alphagov #{partial_path}", type: "Code" }
      "https://github.com/search?#{params.to_query}"
    end

  private

    def govspeak_to_html(govspeak)
      Govspeak::Document.new(govspeak).to_html
    end
  end
end
