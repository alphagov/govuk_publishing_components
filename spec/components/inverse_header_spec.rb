require 'rails_helper'

def block
  "<div class=\"gem-c-title gem-c-title--inverse\">
  <p class=\"gem-c-title__context\">
    Publication
  </p>
  <h1 class=\"gem-c-title__text \">
    HTML publication page title
  </h1>
</div>".html_safe
end

describe "Inverse header", type: :view do
  def component_name
    "inverse_header"
  end

  it "renders nothing when no data is given" do
    assert_empty render_component({})
  end

  it "renders content within a wrapper when content is provided" do
    render_component({}) { block }

    assert_select ".gem-c-inverse-header div.gem-c-title"
    assert_select ".gem-c-inverse-header h1", text: "HTML publication page title"
  end

  it "renders correct css class when header is to be full page width" do
    render_component(full_width: true) { block }

    assert_select ".gem-c-inverse-header--full-width"
  end

  it "renders correct css class when padding_top flag is set to false" do
    render_component(padding_top: false) { block }

    assert_select ".gem-c-inverse-header--padding-top", false
  end
end
