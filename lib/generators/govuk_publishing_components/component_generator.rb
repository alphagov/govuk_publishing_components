require 'rails/generators'
require 'fileutils'

module GovukPublishingComponents
  class ComponentGenerator < ::Rails::Generators::NamedBase
    source_root File.expand_path('../templates', __FILE__)

    def copy_component_files
      @public_name = file_name.dasherize
      @test_name = file_name.camelize

      template_dir = "app/views/components/"
      docs_dir = "app/views/components/docs/"
      test_dir = "test/components/"
      scss_dir = "app/assets/stylesheets/components/"

      create_directory_if_not_exists(template_dir)
      create_directory_if_not_exists(docs_dir)
      create_directory_if_not_exists(test_dir)
      create_directory_if_not_exists(scss_dir)

      template '_component.html.erb', "#{template_dir}_#{@public_name}.html.erb"
      template 'component.yml.erb', "#{docs_dir}#{@public_name}.yml"
      template 'component_test.rb.erb', "#{test_dir}#{file_name}_test.rb"
      template '_component.scss', "#{scss_dir}_#{@public_name}.scss"
    end

  private

    def create_directory_if_not_exists(dir)
      if not File.directory?(dir)
        puts("Directory #{dir} not found, creating")
        FileUtils::mkdir_p dir
      end
    end
  end
end
