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
      examples = component[:examples].map { |id, example|
        example = example || {}
        ComponentExample.new(id.to_s, example["data"], example["context"], example["description"])
      }

      ComponentDoc.new(component[:id],
                       component[:name],
                       component[:description],
                       component[:body],
                       combined_accessibility_criteria(component),
                       examples)
    end

    def combined_accessibility_criteria(component)
      shared_accessibility_criteria = []

      if component[:shared_accessibility_criteria].present?
        component[:shared_accessibility_criteria].each do |criteria|
          shared_accessibility_criteria << SharedAccessibilityCriteria.send(criteria) if SharedAccessibilityCriteria.respond_to? criteria
        end
      end
      "#{component[:accessibility_criteria]}\n#{shared_accessibility_criteria.join("\n")}"
    end

    def fetch_component_docs
      doc_files = Rails.root.join(documentation_directory, "*.yml")
      Dir[doc_files].sort.map { |file| parse_documentation(file) }
    end

    def fetch_component_doc(id)
      file = Rails.root.join(documentation_directory, "#{id}.yml")
      parse_documentation(file)
    end

    def parse_documentation(file)
      { id: File.basename(file, ".yml") }.merge(YAML::load_file(file)).with_indifferent_access
    end

    def documentation_directory
      Rails.root.join("app", "views", GovukPublishingComponents::Config.component_directory_name, "docs")
    end
  end
end
