module GovukPublishingComponents
  class ComponentGuideController < GovukPublishingComponents::ApplicationController
    append_view_path File.join(Rails.root, "app", "views", GovukPublishingComponents::Config.component_directory_name)

    MATCH_COMPONENTS = /(?<=govuk_publishing_components\/components\/)[\/a-zA-Z_-]+(?=['"])/

    def index
      @application_path = Rails.root
      @component_gem_path = Gem.loaded_specs["govuk_publishing_components"].full_gem_path
      @component_docs = component_docs.all
      @gem_component_docs = gem_component_docs.all
      @components_in_use_docs = components_in_use_docs.used_in_this_app
      @components_in_use_sass = components_in_use_sass
      @components_in_use_js = components_in_use_js
      @components_not_in_use_docs = components_not_in_use_docs.not_used_in_this_app
    end

    def show
      @component_doc = component_docs.get(params[:component])
      @guide_breadcrumbs = [index_breadcrumb, component_breadcrumb(@component_doc)]
    end

    def example
      @component_doc = component_docs.get(params[:component])
      @component_example = @component_doc.examples.find { |f| f.id == params[:example] }
      @guide_breadcrumbs = [
        index_breadcrumb,
        component_breadcrumb(@component_doc, @component_example),
        {
          title: @component_example.name,
        },
      ]
    end

    def preview
      @component_examples = []
      @component_doc = component_docs.get(params[:component])
      @preview = true

      if params[:example].present?
        @component_examples.push(@component_doc.examples.find { |f| f.id == params[:example] })
      else
        @component_examples = @component_doc.examples
      end
    end

    def components_in_use_sass
      additional_files = "@import 'govuk_publishing_components/govuk_frontend_support';\n"
      additional_files << "@import 'govuk_publishing_components/component_support';\n"

      components = find_all_partials_in(components_in_use)

      components.map { |component|
        "@import 'govuk_publishing_components/components/#{component.gsub('_', '-')}';" if component_has_sass_file(component.gsub("_", "-"))
      }.compact.uniq.sort.join("\n").squeeze("\n").prepend(additional_files)
    end

    def components_in_use_js
      additional_files = "//= require govuk_publishing_components/lib\n"

      components = find_all_partials_in(components_in_use)

      components.map { |component|
        "//= require govuk_publishing_components/components/#{component.gsub('_', '-')}" if component_has_js_file(component.gsub("_", "-"))
      }.compact.uniq.sort.join("\n").squeeze("\n").prepend(additional_files)
    end

  private

    def component_docs
      @component_docs ||= ComponentDocs.new
    end

    def gem_component_docs
      @gem_component_docs ||= ComponentDocs.new(gem_components: true)
    end

    def components_in_use_docs
      @components_in_use_docs ||= ComponentDocs.new(gem_components: true, limit_to: components_in_use)
    end

    def components_not_in_use_docs
      @components_not_in_use_docs ||= ComponentDocs.new(gem_components: true, limit_to: components_in_use)
    end

    def components_in_use
      matches = []

      files = Dir["#{@application_path}/app/views/**/*.erb"]
      files.concat Dir["#{@application_path}/app/**/*.rb"]
      files.concat Dir["#{@application_path}/lib/**/*.{rb,erb}"]

      files.each do |file|
        data = File.read(file)
        matches << data.scan(MATCH_COMPONENTS)
      end

      matches.flatten.uniq.map(&:to_s).sort
    end

    def find_all_partials_in(templates)
      components = [templates]

      templates.each do |template|
        partials_found = true
        components_to_search = [template]
        components_found = []

        while partials_found
          extra_components = find_partials_in(components_to_search)

          if extra_components.any?
            components_found << extra_components
            components_to_search = extra_components
          else
            partials_found = false
            components << components_found.uniq.sort if components_found.any?
          end
        end
      end

      components.flatten.uniq.sort
    end

    def find_partials_in(components)
      extra_components = []
      components.each do |component|
        extra_components << components_within_component(component)
      end

      extra_components.flatten.uniq.sort
    end

    def component_has_sass_file(component)
      Pathname.new(@component_gem_path + "/app/assets/stylesheets/govuk_publishing_components/components/_#{component}.scss").exist?
    end

    def component_has_js_file(component)
      Pathname.new(@component_gem_path + "/app/assets/javascripts/govuk_publishing_components/components/#{component}.js").exist?
    end

    def components_within_component(component)
      filename = @component_gem_path + "/app/views/govuk_publishing_components/components/#{component}.html.erb"
      filename = filename.sub(/.*\K\//, "/_") # files begin with _ but the method may have been passed 'filename' or 'dir/partial'

      return [] unless File.file?(filename)

      data = File.read(filename)
      match = data.scan(MATCH_COMPONENTS)
      match.flatten.uniq.map(&:to_s).sort
    end

    def index_breadcrumb
      {
        title: GovukPublishingComponents::Config.component_guide_title,
        url: component_guide_path,
      }
    end

    def component_breadcrumb(component_doc, component_example = nil)
      {}.tap do |h|
        h[:title] = component_doc.name
        h[:url] = component_doc_path(component_doc.id) if component_example
      end
    end
  end
end
