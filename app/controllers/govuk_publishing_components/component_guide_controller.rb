module GovukPublishingComponents
  class ComponentGuideController < GovukPublishingComponents::ApplicationController
    append_view_path Rails.root.join("app", "views", GovukPublishingComponents::Config.component_directory_name).to_s

    MATCH_COMPONENTS = /(?<=govuk_publishing_components\/components\/)[\/a-zA-Z_-]+(?=['"])/

    def index
      @application_path = Rails.root
      @component_gem_path = Gem.loaded_specs["govuk_publishing_components"].full_gem_path
      @component_docs = component_docs.all
      @gem_component_docs = gem_component_docs.all
      @used_components = used_components_names.get_component_docs
      @unused_components = unused_components_names.get_component_docs
      @components_in_use_sass = components_in_use_sass
      @components_in_use_js = components_in_use_js
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

      all_components = true if params[:all_components] == "true"
      @all_gem_component_docs = []
      if all_components

        # We need a list of components with no CSS, as trying to render their CSS will result in a crash in the view
        excluded_components = %w[contextual_breadcrumbs contextual_footer contextual_sidebar copy_to_clipboard google_tag_manager_script list machine_readable_metadata meta_tags]

        # Remove components without CSS, and the current component. The current component is excluded as the view will handle rendering its CSS.
        @all_gem_component_docs = gem_component_docs.all.reject { |component| component.id.in?(excluded_components) || component.id == @component_doc.id }

        @render_component_first = params[:render_component_first] == "true" unless @component_doc.id.in?(excluded_components)
      end

      @preview = true

      if params[:example].present?
        @component_examples.push(@component_doc.examples.find { |f| f.id == params[:example] })
      else
        @component_examples = @component_doc.examples
      end

      percy = true if params[:percy] == "true"
      @preview_title = preview_title(@component_doc, @component_examples, all_components, @render_component_first, percy)
    end

    def components_in_use_sass
      additional_files = "@import 'govuk_publishing_components/govuk_frontend_support';\n"
      additional_files << "@import 'govuk_publishing_components/component_support';\n"

      components = find_all_partials_in(get_used_component_names)

      components.map { |component|
        "@import 'govuk_publishing_components/components/#{component.gsub('_', '-')}';" if component_has_sass_file(component.gsub("_", "-"))
      }.compact.uniq.sort.join("\n").squeeze("\n").prepend(additional_files)
    end

    def components_in_use_js
      additional_files = "//= require govuk_publishing_components/lib\n"

      components = find_all_partials_in(get_used_component_names)

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

    def used_components_names
      @used_components_names ||= ComponentDocs.new(gem_components: true, limit_to: get_used_component_names)
    end

    def unused_components_names
      @unused_components_names ||= ComponentDocs.new(gem_components: true, limit_to: get_unused_component_names)
    end

    def get_used_component_names
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

    def get_unused_component_names
      all_components = ComponentDocs.new(gem_components: true).all.map(&:id)
      all_components - get_used_component_names
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

    def preview_title(component, component_examples, _all_components, _render_component_first, percy)
      title = [component.name]

      if component_examples.length == 1 && !percy
        title[0] << ": #{component_examples.first.name} preview"
      end

      title << "- #{GovukPublishingComponents::Config.component_guide_title}" unless percy

      title.join(" ")
    end
  end
end
