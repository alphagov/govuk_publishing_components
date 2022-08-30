require "rails_helper"

describe "Google tag manager script", type: :view do
  def component_name
    "google_tag_manager_script"
  end

  it "renders a script tag without a blocklist" do
    render_component(gtm_id: "GTM_ID")

    assert_select "script"
    expect(rendered).not_to include "gtm.blocklist"
    expect(rendered).to include "window,document,'script','dataLayer','GTM_ID'"
  end

  it "renders a script tag with a blocklist" do
    render_component(
      gtm_id: "GTM_ID",
      blocklist: [],
    )

    assert_select "script"
    expect(rendered).to include "gtm.blocklist"
    expect(rendered).to include "window,document,'script','dataLayer','GTM_ID'"
  end
end
