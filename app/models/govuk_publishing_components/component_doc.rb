module GovukPublishingComponents
  class ComponentDoc
    attr_reader :id,
                :name,
                :description,
                :body,
                :accessibility_criteria,
                :examples

    def initialize(id, name, description, body, accessibility_criteria, examples)
      @id = id
      @name = name
      @description = description
      @body = body
      @accessibility_criteria = accessibility_criteria
      @examples = examples
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
      "components/#{id}"
    end

  private

    def govspeak_to_html(govspeak)
      Govspeak::Document.new(govspeak).to_html
    end
  end
end
