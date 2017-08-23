module GovukPublishingComponents
  class ComponentDocResolver
    def get(id)
      component = fetch_component_doc(id)
      build(component)
    end

    def all
      fetch_component_docs.map { |component| build(component) }
    end

  private

    def build(component)
      examples = component[:examples].map { |id, data|
        ComponentExample.new(id.to_s, data)
      }

      ComponentDoc.new(component[:id],
                       component[:name],
                       component[:description],
                       component[:body],
                       component[:accessibility_criteria],
                       examples)
    end

    def fetch_component_docs
      doc_files = Rails.root.join("app", "views", "components", "docs", "*.yml")
      Dir[doc_files].sort.map { |file| parse_documentation(file) }
    end

    def fetch_component_doc(id)
      file = Rails.root.join("app", "views", "components", "docs", "#{id}.yml")
      parse_documentation(file)
    end

    def parse_documentation(file)
      { id: File.basename(file, ".yml") }.merge(YAML::load_file(file)).with_indifferent_access
    end
  end
end
