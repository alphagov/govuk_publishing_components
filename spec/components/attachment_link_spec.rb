require "rails_helper"

describe "Attachment Link", type: :view do
  def component_name
    "attachment_link"
  end

  it "fails to render when no attachment is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders an attachment link" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment" })
    assert_select ".gem-c-attachment-link"
    assert_select "a[href='https://gov.uk/attachment']", text: "Attachment"
  end

  it "can have a target specified" do
    render_component(
      attachment: { title: "Attachment", url: "attachment" },
      target: "_blank",
    )
    assert_select "a[href=attachment][target=_blank]"
  end

  it "can include attribute metadata" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "text/xml",
        filename: "attachment.xml",
        file_size: 2048,
        number_of_pages: 2,
      },
    )
    assert_select "abbr.gem-c-attachment-link__abbr[title='XML Document']", text: "XML"
    expect(rendered).to match(/2 KB/)
    expect(rendered).to match(/2 pages/)
  end

  it "can show file type that doesn't have an abbreviation" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "text/plain",
      },
    )
    expect(rendered).to match(/Plain Text/)
  end

  it "embeds any specified data attributes into the link" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
      },
      url_data_attributes: { gtm: "attachment-preview" },
    )
    assert_select "a.govuk-link[data-gtm='attachment-preview']"
  end

  it "does not have a newline character after the last metadata attribute's closing span tag" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "text/plain",
      },
    )

    expect(rendered).to end_with("</span>)</span>")
  end

  it "does not have any newline characters after the link element" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
      },
    )

    expect(rendered).not_to match(/<\/a>\n/)
  end
end
