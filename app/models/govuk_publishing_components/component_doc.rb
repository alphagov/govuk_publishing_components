module GovukPublishingComponents
  class ComponentDoc
    attr_reader :id,
                :name,
                :description,
                :body,
                :accessibility_criteria,
                :fixtures

    def initialize(id, name, description, body, accessibility_criteria, fixtures)
      @id = id
      @name = name
      @description = description
      @body = body
      @accessibility_criteria = accessibility_criteria
      @fixtures = fixtures
    end

    def fixture
      fixtures.first
    end

    def other_fixtures
      fixtures.slice(1..-1)
    end

    def html_body
      govspeak_to_html(body) if body.present?
    end

    def html_accessibility_criteria
      govspeak_to_html(accessibility_criteria) if accessibility_criteria.present?
    end

  private

    def govspeak_to_html(govspeak)
      Govspeak::Document.new(govspeak).to_html
    end
  end
end
