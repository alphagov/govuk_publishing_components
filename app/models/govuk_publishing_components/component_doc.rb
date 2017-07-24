module GovukPublishingComponents
  ComponentDoc = Struct.new(:id, :name, :description, :body, :fixtures) do
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

      self.new(component[:id], component[:name], component[:description], component[:body], fixtures)
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
    end
  end
end
