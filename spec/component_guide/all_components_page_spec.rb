require "rails_helper"

describe "All components page", :capybara do
  it "lists all components in an unordered list" do
    visit "/component-guide/all-components"

    expect(page).to have_css("ul#components-list")
    expect(page).to have_css("#components-list li:nth-of-type(1)", text: "Accordion (experimental)")
    expect(page).to have_css("#components-list li:nth-of-type(94)", text: "Warning text")
  end

  it "has the right amount of components" do
    visit "/component-guide/all-components"
    expect(page).to have_css("#component-count", text: "Components: 94")
  end

  it "renders all components" do
    visit "/component-guide/all-components"
    components = %w[accordion action_link add_another layout_for_admin attachment attachment_link back_link back_to_top_link big_number breadcrumbs button cards contents_list contents_list_with_body contextual_breadcrumbs contextual_footer contextual_guidance contextual_sidebar cookie_banner copy_to_clipboard cross_service_header details devolved_nations document_list emergency_banner error_alert feedback figure character_count checkboxes date_input error_message error_summary fieldset file_upload hint input label radio textarea glance_metric global_banner google_tag_manager_script govspeak govspeak_html_publication heading image_card inset_text intervention inverse_header layout_footer layout_header layout_super_navigation_header lead_paragraph list machine_readable_metadata meta_tags metadata modal_dialogue notice option_select organisation_logo panel password_input phase_banner previous_and_next_navigation print_link layout_for_public published_dates related_navigation reorderable_list search search_with_autocomplete secondary_navigation select select_with_search service_navigation share_links signup_link single_page_notification_button skip_link step_by_step_nav step_by_step_nav_header step_by_step_nav_related subscription_links success_alert summary_banner summary_card summary_list table tabs tag translation_nav warning_text]
    components.each do |component|
      expect(page).to have_css("##{component}_heading")
      expect(page).to have_css(".#{component}_component_example_heading")
      expect(page).to have_css(".#{component}_component_example")
    end
  end

  it "renders all examples within a component" do
    visit "/component-guide/all-components"

    # There are 9 accordion examples - update as appropriate
    (0..8).each do |index|
      expect(page).to have_css("#accordion_component_example_#{index}")

      within "#accordion_component_example_#{index}" do
        expect(page).to have_css(".gem-c-accordion")
      end
    end

    # There are 5 emergency_banner examples - update as appropriate
    (0..4).each do |index|
      expect(page).to have_css("#emergency_banner_component_example_#{index}")

      within "#emergency_banner_component_example_#{index}" do
        expect(page).to have_css(".gem-c-emergency-banner")
      end
    end

    # There are 7 warning_text examples - update as appropriate
    (0..6).each do |index|
      expect(page).to have_css("#warning_text_component_example_#{index}")

      within "#warning_text_component_example_#{index}" do
        expect(page).to have_css(".gem-c-warning-text")
      end
    end
  end

  it "renders govspeak correctly" do
    visit "/component-guide/all-components"
    within ".gem-c-govspeak", match: :first do
      expect(page).not_to have_text("<p>")
      expect(page).not_to have_text("<h2>")
      expect(page).not_to have_text("<div>")
    end
  end

  it "reverses the order when ?reversed=true exists on the query string" do
    visit "/component-guide/all-components?reversed=true"

    expect(page).to have_css("ul#components-list")
    expect(page).to have_css("#components-list li:nth-of-type(1)", text: "Warning text")
    expect(page).to have_css("#components-list li:nth-of-type(94)", text: "Accordion (experimental)")

    within ".component_container", match: :first do
      expect(page).to have_text "Warning text"
    end

    within ".component_container:last-of-type", match: :first do
      expect(page).to have_text "Accordion (experimental)"
    end
  end
end
