require "rails_helper"

describe "Signup link", type: :view do
  def component_name
    "signup_link"
  end

  let(:attributes) do
    {
      heading: "Stay up to date with GOV.UK",
      link_href: "/signup-link?topic=/coronavirus-taxon",
      link_text: "Sign up to get emails",
    }
  end

  let(:render_signup_link) { render_component(attributes) }

  it "renders nothing with no input" do
    render_component({})
    expect(rendered).to be_empty
  end

  it "renders link when link is passed" do
    render_signup_link
    expect(rendered).to have_link attributes[:link_text], href: attributes[:link_href], class: "gem-c-signup-link__link"
  end

  it "renders optional heading" do
    render_signup_link
    expect(rendered).to have_selector(".gem-c-signup-link__title", text: attributes[:heading])
  end

  it "renders component with custom heading level" do
    attributes[:heading_level] = 1
    render_signup_link
    expect(rendered).to have_selector("h1.gem-c-signup-link__title", text: attributes[:heading])
  end

  it "renders component with background and border when background is true" do
    attributes[:background] = true
    render_signup_link
    expect(rendered).to have_selector(".gem-c-signup-link--with-background-and-border")
  end

  it "adds data attributes when data attributes are passed" do
    attributes[:data] = { "custom-data-attr": "customVal" }
    render_signup_link
    expect(rendered).to have_selector(".gem-c-signup-link .gem-c-signup-link__link[data-custom-data-attr='customVal']")
  end
end
