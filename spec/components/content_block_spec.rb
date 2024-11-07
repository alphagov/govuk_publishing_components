require "rails_helper"

describe "Content Block", type: :view do
  def component_name
    "content_block"
  end

  let(:content_id) { SecureRandom.uuid }

  it "renders a contact block" do
    render_component(
      title: "Something",
      details: { some: "details" },
      document_type: "contact",
      content_id:,
    )

    assert_select "span.gem-c-content-block[data-content-id='#{content_id}'][data-document-type='contact']", text: "Something"
  end

  it "renders an email address correctly" do
    render_component(
      title: "Something",
      details: { email_address: "foo@example.com" },
      document_type: "content_block_email_address",
      content_id:,
    )

    assert_select "span.gem-c-content-block[data-content-id='#{content_id}'][data-document-type='content_block_email_address']", text: "foo@example.com"
  end
end
