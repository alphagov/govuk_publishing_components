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
        wait_selector: ".gem-c-layout-super-navigation-header__container",
      },
      {
        state_name: "Search open",
        toggle_selector: "#super-search-menu-toggle",
        wait_selector: ".gem-c-layout-super-navigation-header__navigation-dropdown-menu",
      },
    ],
  }.freeze
end
