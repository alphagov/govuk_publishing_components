require 'rails_helper'

def component_path
  "govuk_publishing_components/components/inverse_header"
end

def block
  "<div class=\"pub-c-title pub-c-title--inverse\">
  <p class=\"pub-c-title__context\">
    Publication
  </p>
  <h1 class=\"pub-c-title__text \">
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
    render(component_path, {}) { block }

    assert_select ".gem-c-inverse-header div.pub-c-title"
    assert_select ".gem-c-inverse-header h1", text: "HTML publication page title"
  end
end
