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
      id,
      name,
      description,
      body,
      accessibility_criteria,
      accessibility_excluded_rules,
      examples,
      source
    )
      @id = id
      @name = name
      @description = description
      @body = body
      @accessibility_criteria = accessibility_criteria
      @accessibility_excluded_rules = accessibility_excluded_rules
      @examples = examples
      @source = source
    end

    def example
      examples.first
    end

    def other_examples
      examples.slice(1..-1)
    end

    def html_body
      govspeak_to_html(body) if body.present?
    end

    def html_accessibility_criteria
      govspeak_to_html(accessibility_criteria) if accessibility_criteria.present?
    end

    def partial_path
      if source == 'gem'
        "components/#{id}"
      else
        "#{GovukPublishingComponents::Config.component_directory_name}/#{id}"
      end
    end

  private

    def govspeak_to_html(govspeak)
      Govspeak::Document.new(govspeak).to_html
    end
  end
end
