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

      COMPONENT_JS_PATHS = Dir.glob("#{GovukPublishingComponents::Config.gem_directory}/app/assets/javascripts/govuk_publishing_components/components-new/*.js").map { |path|
        filename = path.split("/").last
        component_name = filename.sub(".js", "")
        "govuk_publishing_components/components/#{component_name}.js"
      }.freeze

      STATIC_JS_LIST = %w[
        govuk_publishing_components/components/layout-super-navigation-header.js
        govuk_publishing_components/components/button.js
        govuk_publishing_components/components/cookie-banner.js
        govuk_publishing_components/components/feedback.js
        govuk_publishing_components/components/layout-header.js
        govuk_publishing_components/components/layout-super-navigation-header.js
        govuk_publishing_components/components/skip-link.js
      ]

      # This list includes components already included in Static; taken from
      # https://github.com/alphagov/static/blob/198a598682df40ce4a2c3c286c06244297c18cf0/app/assets/stylesheets/application.scss

      # This is used to dedupe stylesheets.
      STATIC_STYLESHEET_LIST = %w[
        govuk_publishing_components/components/_breadcrumbs.css
        govuk_publishing_components/components/_button.css
        govuk_publishing_components/components/_error-message.css
        govuk_publishing_components/components/_heading.css
        govuk_publishing_components/components/_hint.css
        govuk_publishing_components/components/_input.css
        govuk_publishing_components/components/_label.css
        govuk_publishing_components/components/_search.css
        govuk_publishing_components/components/_skip-link.css
        govuk_publishing_components/components/_textarea.css
        govuk_publishing_components/components/_title.css

        govuk_publishing_components/components/_cookie-banner.css
        govuk_publishing_components/components/_feedback.css
        govuk_publishing_components/components/_layout-footer.css
        govuk_publishing_components/components/_layout-for-public.css
        govuk_publishing_components/components/_layout-header.css
        govuk_publishing_components/components/_layout-super-navigation-header.css
      ].freeze

      def add_javascript_path(component_path)
        unless is_javascript_already_used?(component_path)
          all_component_javascripts_being_used << component_path
        end
      end

      def add_govuk_frontend_javascript_path(component_path)
        unless is_javascript_already_used?(component_path)
          all_component_javascripts_being_used << component_path
          all_govuk_frontend_javascripts_being_used << component_path
        end
      end

      def add_all_other_javascript_path(component_path)
        unless is_javascript_already_used?(component_path)
          all_component_javascripts_being_used << component_path
          all_other_javascripts_being_used << component_path
        end
      end

      def add_stylesheet_path(component_path)
        unless is_stylesheet_already_used?(component_path)
          all_component_stylesheets_being_used << component_path
        end
      end

      def add_govuk_frontend_component_javascript(gem_component)
        add_govuk_frontend_javascript_path("govuk/components/#{gem_component}/#{gem_component}.js")
      end

      def add_gem_component_javascript(gem_component)
        add_all_other_javascript_path("govuk_publishing_components/components-new/#{gem_component}.js")
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

      def all_component_javascripts_being_used
        @all_component_javascripts_being_used ||= []
      end

      def all_govuk_frontend_javascripts_being_used 
        @all_govuk_frontend_javascripts_being_used ||= []
      end

      def all_other_javascripts_being_used
        @all_govuk_frontend_javascripts_being_used ||= []
      end

      def render_component_stylesheets
        list_of_stylesheets = all_component_stylesheets_being_used.map do |component|
          stylesheet_link_tag(component, integrity: false)
        end
        raw(list_of_stylesheets.join(""))
      end

      def render_component_javascripts
        list_of_govuk_frontend_javascripts = all_govuk_frontend_javascripts_being_used.map do |component|
          Rails.configuration.assets.precompile += [component]
          javascript_include_tag(component, nonce: true)
        end

        list_of_all_other_javascripts = all_other_javascripts_being_used.map do |component|
          Rails.configuration.assets.precompile += [component]
          javascript_include_tag(component, nonce: true)
        end

        raw([
          list_of_govuk_frontend_javascripts.join(""),
          javascript_include_tag("govuk_publishing_components/init-govuk-frontend.js", nonce: true),
          list_of_all_other_javascripts.join("")
        ].join(""))
      end

      def get_component_css_paths
        COMPONENT_CSS_PATHS
      end

      def application_stylesheet_in_use?
        GovukPublishingComponents::Config.application_stylesheet.presence
      end

    private
      def is_stylesheet_already_used?(component)
        if GovukPublishingComponents::Config.exclude_css_from_static && !viewing_component_guide?
          all_component_stylesheets_being_used.include?(component) || STATIC_STYLESHEET_LIST.include?(component)
        else
          all_component_stylesheets_being_used.include?(component)
        end
      end

      def is_javascript_already_used?(component)
        if GovukPublishingComponents::Config.exclude_js_from_static
          all_component_javascripts_being_used.include?(component) || STATIC_JS_LIST.include?(component)
        else
          all_component_javascripts_being_used.include?(component)
        end
      end

      def viewing_component_guide?
        request&.path&.include?("/component-guide")
      end
    end
  end
end
