module GovukPublishingComponents
  class ComponentDoc
    attr_reader :id,
                :name,
                :description,
                :body,
                :accessibility_criteria,
                :universal_accessibility_criteria,
                :examples

    def initialize(id, name, description, body, accessibility_criteria, universal_accessibility_criteria, examples)
      @id = id
      @name = name
      @description = description
      @body = body
      @universal_accessibility_criteria = universal_accessibility_criteria
      @accessibility_criteria = "#{accessibility_criteria}\n#{check_for_universal_accessibility_criteria}"
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
      "#{GovukPublishingComponents::Config.component_directory_name}/#{id}"
    end

  private

    def govspeak_to_html(govspeak)
      Govspeak::Document.new(govspeak).to_html
    end

    def check_for_universal_accessibility_criteria
      fetch_component_docs.map { |criteria| match_universal_accessibility_criteria(criteria) }.join("\n") if universal_accessibility_criteria.present?
    end

    def match_universal_accessibility_criteria(criteria)
      criteria["accessibility_criteria"] if universal_accessibility_criteria.include? criteria["id"]
    end

    def fetch_component_docs
      doc_files = Rails.root.join(documentation_directory, "*.yml")
      Dir[doc_files].sort.map { |file| parse_documentation(file) }
    end

    def parse_documentation(file)
      { id: File.basename(file, ".yml") }.merge(YAML::load_file(file)).with_indifferent_access
    end

    def documentation_directory
      File.join(File.dirname(File.expand_path(__FILE__)), '../../views/govuk_publishing_components/component_guide/docs')
    end
  end
end
