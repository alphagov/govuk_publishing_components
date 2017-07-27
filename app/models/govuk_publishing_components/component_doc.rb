module GovukPublishingComponents
  ComponentDoc = Struct.new(:id, :name, :description, :body, :accessibility_criteria, :fixtures) do
    def self.get(id)
      component = fetch_component_doc(id)
      self.build(component)
    end

    def self.all
      fetch_component_docs.map { |component| build(component) }
    end

    def self.build(component)
      fixtures = component[:fixtures].map { |id, data|
        GovukPublishingComponents::ComponentFixture.new(id.to_s, data)
      }

      self.new(component[:id],
               component[:name],
               component[:description],
               component[:body],
               component[:accessibility_criteria],
               fixtures)
    end

    def fixture
      fixtures.first
    end

    def other_fixtures
      fixtures.slice(1..-1)
    end

    def self.fetch_component_docs
      doc_files = Rails.root.join("app", "views", "components", "docs", "*.yml")
      Dir[doc_files].sort.map { |file| parse_documentation(file) }
    end

    def self.fetch_component_doc(id)
      file = Rails.root.join("app", "views", "components", "docs", "#{id}.yml")
      parse_documentation(file)
    end

    def self.parse_documentation(file)
      { id: File.basename(file, ".yml") }.merge(YAML::load_file(file)).with_indifferent_access
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
