desc 'warns if component view files exist without corresponding documentation'
task :validate_component_documentation do
  components_missing_docs = []
  component_views = Dir["app/views/#{GovukPublishingComponents::Config.component_directory_name}/**/*.html.erb"]

  component_views.each do |partial|
    expected_component_docs_file = partial.split('/')[-1].gsub('html.erb', 'yml')
    expected_component_docs_file.sub!(/^_/, '')

    expected_component_docs_path = "app/views/#{GovukPublishingComponents::Config.component_directory_name}/docs/#{expected_component_docs_file}"
    components_missing_docs << partial unless File.exist?(expected_component_docs_path)
  end

  if components_missing_docs.any?
    error = "You have components which are missing documentation. These components will not be displayed in the component guide:\n"
    components_missing_docs.each { |component| error += "\t" + component + "\n" }
    error += "\n"
    raise NotImplementedError, error
  end
end

Rake::Task["validate_component_documentation"].invoke
