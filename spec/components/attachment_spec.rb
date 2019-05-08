require "rails_helper"

describe "Attachment", type: :view do
  def component_name
    "attachment"
  end

  it "fails to render when no attachment is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders an attachment" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment" })
    assert_select ".gem-c-attachment"
    assert_select "a[href='https://gov.uk/attachment']", text: "Attachment"
    assert_select "img[src='https://www.gov.uk/government/assets/pub-cover-doc-afe3b0a8a9511beeca890340170aee8b5649413f948e512c9b8ce432d8513d32.png'][class='gem-c-attachment__thumbnail-image']"
  end

  it "can have a target specified" do
    render_component(
      attachment: { title: "Attachment", url: "https://gov.uk/attachment" },
      target: "_blank",
    )
    assert_select "a[href='https://gov.uk/attachment'][target=_blank]"
  end

  it "can include attribute metadata" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/pdf",
        file_size: 2048,
        number_of_pages: 2,
      },
    )
    assert_select "abbr.gem-c-attachment__abbr[title='Portable Document Format']", text: "PDF"
    expect(rendered).to match(/2 KB/)
    expect(rendered).to match(/2 pages/)
  end

  it "shows OpenDocument help text if OpenDocument format" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
      },
    )
    assert_select "a[href='https://www.gov.uk/guidance/open-document-format-odf-guidance-for-uk-government/overview-of-productivity-software']"
  end

  it "does not show help text if disabled" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
      },
      hide_help_text: true,
    )
    assert_select "a[href='https://www.gov.uk/guidance/open-document-format-odf-guidance-for-uk-government/overview-of-productivity-software']", false
  end
end
