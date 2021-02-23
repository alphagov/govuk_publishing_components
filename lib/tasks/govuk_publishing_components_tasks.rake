namespace :component do
  desc "warns if component view files exist without corresponding documentation"
  task :validate_documentation_exists do
    print "Validating that each component has documentation... "
    components_missing_docs = []
    component_views = Dir["app/views/#{GovukPublishingComponents::Config.component_directory_name}/**/*.html.erb"]
    component_views.each do |partial|
      expected_component_docs_file = partial.split("/")[-1].gsub("html.erb", "yml")
      expected_component_docs_file.sub!(/^_/, "")

      expected_component_docs_path = "app/views/#{GovukPublishingComponents::Config.component_directory_name}/docs/#{expected_component_docs_file}"
      components_missing_docs << partial unless File.exist?(expected_component_docs_path)
    end

    if components_missing_docs.any?
      error = "You have components which are missing documentation. These components will not be displayed in the component guide:\n"
      components_missing_docs.each { |component| error += "\t#{component}\n" }
      error += "\n"
      raise NotImplementedError, error
    end
    puts "✔︎"
  end

  desc "warns if component is missing accessibility criteria"
  task :validate_accessibility_criteria_exist do
    print "Validating that each component has accessibility criteria... "
    errors = []

    component_docs = Dir["app/views/#{GovukPublishingComponents::Config.component_directory_name}/**/*.yml"]
    component_docs.each do |doc_file|
      file = YAML.load_file(doc_file)

      if file["accessibility_criteria"].nil? && file["shared_accessibility_criteria"].nil?
        errors << file["name"]
      end
    end
    if errors.any?
      error = "The following components need accessibility criteria:\n#{errors.join("\n")}"
      raise NotImplementedError, error
    end
    puts "✔︎"
  end

  desc "warns if component view files exist without corresponding documentation or accessibility critera"
  task :validate_documentation do
    Rake::Task["component:validate_documentation_exists"].invoke
    Rake::Task["component:validate_accessibility_criteria_exist"].invoke
  end
end
