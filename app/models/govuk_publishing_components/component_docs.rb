module GovukPublishingComponents
  # @private
  class ComponentDocs
    def initialize(gem_components: false, limit_to: false)
      @limit_to = limit_to
      @documentation_directory = gem_components ? gem_documentation_directory : app_documentation_directory
    end

    def get(id)
      component = fetch_component_doc(id)
      build(component)
    end

    def all
      fetch_component_doc_files.map { |component| build(component) }.sort_by(&:name)
    end

    def get_component_docs
      fetch_component_doc_files.map { |component| build(component) if component_in_use?(component[:id]) }.compact.sort_by(&:name)
    end

  private

    def build(component)
      ComponentDoc.new(component)
    end

    def fetch_component_doc_files
      doc_files = Rails.root.join(@documentation_directory, "*.yml")
      Dir[doc_files].sort.map { |file| parse_documentation(file) }
    end

    def component_in_use?(component)
      @limit_to.include?(component)
    end

    def fetch_component_doc(id)
      file = Rails.root.join(@documentation_directory, "#{id}.yml")
      if !file.exist?
        file = gem_documentation_directory.join("#{id}.yml")
        parse_documentation(file).merge(source: "gem")
      else
        parse_documentation(file).merge(source: "application")
      end
    end

    def parse_documentation(file)
      yaml = YAML.load_file(file, aliases: true, permitted_classes: [Symbol, Time, Date])
      { id: File.basename(file, ".yml") }.merge(yaml).with_indifferent_access
    end

    def app_documentation_directory
      Rails.root.join("app", "views", GovukPublishingComponents::Config.component_directory_name, "docs")
    end

    def gem_documentation_directory
      Pathname.new(GovukPublishingComponents::Config.gem_directory).join("app", "views", "govuk_publishing_components", "components", "docs")
    end
  end
end
