module GovukPublishingComponents
  module AppHelpers
    module AssetHelper
      # This is a list of all the components that have stylesheets - so a new
      # component needs to be added to this list rather than being laboriously
      # added and removed from every single rendering application.
      COMPONENT_CSS_PATHS = Dir.glob("#{GovukPublishingComponents::Config.gem_directory}/app/assets/stylesheets/govuk_publishing_components/components/_*.scss").map { |path|
        filename = path.split("/").last
        component_name = filename.sub("_", "").sub(".scss", "")
        "govuk_publishing_components/components/_#{component_name}.css"
      }.freeze

      # This list includes components already included in Static; taken from
      # https://github.com/alphagov/static/blob/198a598682df40ce4a2c3c286c06244297c18cf0/app/assets/stylesheets/application.scss

      # This is used to dedupe stylesheets.
      STATIC_STYLESHEET_LIST = %w[
        breadcrumbs
        button
        error-message
        heading
        hint
        input
        label
        search
        search-with-autocomplete
        skip-link
        textarea
        title
        cookie-banner
        cross-service-header
        feedback
        layout-footer
        layout-for-public
        layout-header
        layout-super-navigation-header
      ].freeze

      def add_stylesheet_path(component_path)
        unless is_already_used?(component_path)
          all_component_stylesheets_being_used << component_path
        end
      end

      # Used to add a component that exists in the gem to the list
      def add_gem_component_stylesheet(gem_component)
        add_stylesheet_path("govuk_publishing_components/components/_#{gem_component}.css")
      end

      # Used to add a component that exists in the application to the list
      def add_app_component_stylesheet(app_component)
        add_stylesheet_path("components/_#{app_component}.css")
      end

      # Some applications have view-specific stylesheets - use this method
      # to add them to the list
      def add_view_stylesheet(view_component)
        add_stylesheet_path("views/_#{view_component}.css")
      end

      def all_component_stylesheets_being_used
        @all_component_stylesheets_being_used ||= []
      end

      def render_component_stylesheets
        list_of_stylesheets = all_component_stylesheets_being_used.map do |component|
          stylesheet_link_tag(component, integrity: false)
        end
        raw(list_of_stylesheets.join(""))
      end

      def get_component_css_paths
        COMPONENT_CSS_PATHS
      end

      def application_stylesheet_in_use?
        GovukPublishingComponents::Config.application_stylesheet.presence
      end

    private

      def is_already_used?(component)
        (all_component_stylesheets_being_used + component_paths(css_exclude_list)).include?(component)
      end

      def css_exclude_list
        return [] if viewing_component_guide?
        return STATIC_STYLESHEET_LIST if GovukPublishingComponents::Config.exclude_css_from_static

        []
      end

      def viewing_component_guide?
        return false unless request

        request.path.include?("/component-guide")
      end

      def component_paths(component_list)
        component_list.map { |c| "govuk_publishing_components/components/_#{c}.css" }
      end
    end
  end
end
