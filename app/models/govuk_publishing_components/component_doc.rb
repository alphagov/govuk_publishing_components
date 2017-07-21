module GovukPublishingComponents
  ComponentDoc = Struct.new(:id, :name, :description, :body, :fixtures) do
    def self.get(id)
      all.find { |component| component.id == id }
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
      Dir[doc_files].sort.map do |file|
        { id: File.basename(file, ".yml") }.merge(YAML::load_file(file)).with_indifferent_access
      end
    end
  end
end
