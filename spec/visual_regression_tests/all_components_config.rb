module VisualRegressionConfig
  # Components to skip during visual testing because they have no visible output
  SKIP_COMPONENTS = %w[
    /component-guide/meta_tags/preview
    /component-guide/machine_readable_metadata/preview
    /component-guide/google_tag_manager_script/preview
    /component-guide/layout_for_admin/preview
  ].freeze

  # Components that require click interactions to check states
  INTERACTIVE_COMPONENTS = {
    "/component-guide/layout_super_navigation_header/default/preview" => [
      {
        state_name: "Menu open",
        toggle_selector: "#super-navigation-menu-toggle",
        wait_selector: "#super-navigation-menu",
      },
      {
        state_name: "Search open",
        toggle_selector: "#super-search-menu-toggle",
        wait_selector: "#super-search-menu",
      },
    ],
    "/component-guide/feedback/default/preview" => [
      {
        state_name: "Is this page useful? - Yes",
        toggle_selector: ".js-page-is-useful",
        wait_selector: ".js-prompt-success",
      },
      {
        state_name: "Is this page useful? - No",
        toggle_selector: ".js-page-is-not-useful",
        wait_selector: "#survey-wrapper",
      },
    ],
    "/component-guide/related_navigation/with_extensive_world_locations/preview" => [
      {
        state_name: "Show more links",
        toggle_selector: "[aria-expanded='false']",
        wait_selector: "[aria-expanded='true']",
      },
    ],
  }.freeze
end
