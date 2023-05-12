require "rails/generators"
require "fileutils"

module GovukPublishingComponents
  class ComponentGenerator < ::Rails::Generators::NamedBase
    source_root File.expand_path("templates", __dir__)

    def copy_component_files
      @public_name = file_name.dasherize
      @component_prefix = "app-c-"
      component_directory_name = GovukPublishingComponents::Config.component_directory_name

      template_dir = "app/views/#{component_directory_name}/"
      docs_dir = "app/views/#{component_directory_name}/docs/"
      scss_dir = "app/assets/stylesheets/#{component_directory_name.dasherize}/"

      create_directory_if_not_exists(template_dir)
      create_directory_if_not_exists(docs_dir)
      create_directory_if_not_exists(scss_dir)

      template "_component.html.erb", "#{template_dir}_#{@public_name.gsub('-', '_')}.html.erb"
      template "component.yml.erb", "#{docs_dir}#{@public_name.gsub('-', '_')}.yml"
      template "_component.scss", "#{scss_dir}_#{@public_name}.scss"
    end

  private

    def create_directory_if_not_exists(dir)
      unless File.directory?(dir)
        puts("Directory #{dir} not found, creating")
        FileUtils.mkdir_p dir
      end
    end
  end
end
