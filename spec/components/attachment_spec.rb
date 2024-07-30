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
    assert_thumbnail "generic"
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
    assert_thumbnail "pdf"
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

  it "doesn't show metadata information when there isn't any to show" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "unknown/type",
      },
    )

    assert_select ".gem-c-attachment__metadata", false
  end

  it "shows OpenDocument help text if OpenDocument format" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
      },
    )
    assert_select "a[href='https://www.gov.uk/guidance/using-open-document-formats-odf-in-your-organisation']"
    assert_thumbnail "spreadsheet"
  end

  it "shows section to request a different format if a contact email is provided that is not in the pilot" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
        alternative_format_contact_email: "defra.helpline@defra.gsi.gov.uk",
      },
    )
    assert_select "a[href='mailto:defra.helpline@defra.gsi.gov.uk']"
  end

  it "shows section to request a different format with GA4 tracking on the details component" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
        alternative_format_contact_email: "defra.helpline@defra.gsi.gov.uk",
      },
      details_ga4_attributes: {
        index_section_count: 4,
        another_attribute: "here",
      },
    )
    assert_select "a[href='mailto:defra.helpline@defra.gsi.gov.uk']"
    attributes = {
      event_name: "select_content",
      type: "detail",
      text: "Request an accessible format.",
      section: "Request an accessible format.",
      index_section: 1,
      index_section_count: 4,
      another_attribute: "here",
    }.to_json
    assert_select ".govuk-details[data-ga4-event='#{attributes}']"
  end

  it "does not show opendocument metadata if disabled" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
      },
      hide_opendocument_metadata: true,
    )
    assert_select "a[href='https://www.gov.uk/guidance/open-document-format-odf-guidance-for-uk-government/overview-of-productivity-software']", false
  end

  it "embeds any specified data attributes into the links" do
    render_component(
      attachment: {
        title: "Attachment",
        url: "attachment",
        content_type: "application/vnd.oasis.opendocument.spreadsheet",
      },
      data_attributes: { gtm: "attachment-preview" },
    )

    assert_select ".gem-c-attachment__thumbnail a.govuk-link[data-gtm='attachment-preview']"
    assert_select ".gem-c-attachment__title a.govuk-link[data-gtm='attachment-preview']"
  end

  it "shows reference details on the first metadata line if provided" do
    render_component(
      attachment: {
        title: "The government financial reporting review",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/791567/the_government_financial_reporting_review_web.pdf",
        filename: "department-for-transport-information-asset-register.csv",
        content_type: "application/pdf",
        file_size: 20_000,
        number_of_pages: 7,
        isbn: "978-1-5286-1173-2",
        unique_reference: "2259",
        command_paper_number: "Cd. 67",
      },
    )
    assert_select ".gem-c-attachment__metadata:nth-of-type(1)", text: "Ref: ISBN 978-1-5286-1173-2, 2259, Cd. 67"
  end

  it "shows a custom thumbnail image when one is provided" do
    thumbnail_url = "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/791567/thumbnail_the_government_financial_reporting_review_web.pdf.png"
    render_component(
      attachment: {
        title: "The government financial reporting review",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/791567/the_government_financial_reporting_review_web.pdf",
        filename: "department-for-transport-information-asset-register.csv",
        content_type: "application/pdf",
        file_size: 20_000,
        number_of_pages: 7,
        isbn: "978-1-5286-1173-2",
        unique_reference: "2259",
        command_paper_number: "Cd. 67",
        thumbnail_url:,
      },
    )
    assert_thumbnail "custom", src: thumbnail_url
  end

  it "shows unnumbered details on the second metadata line if marked so" do
    render_component(
      attachment: {
        title: "The government financial reporting review",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/791567/the_government_financial_reporting_review_web.pdf",
        filename: "department-for-transport-information-asset-register.csv",
        content_type: "application/pdf",
        file_size: 20_000,
        number_of_pages: 7,
        isbn: "978-1-5286-1173-2",
        unique_reference: "2259",
        unnumbered_command_paper: true,
      },
    )
    assert_select ".gem-c-attachment__metadata:nth-of-type(2)", text: "Unnumbered command paper"
  end

  it "shows 'View online' preview link if preview_url is provided" do
    render_component(
      attachment: {
        title: "Consular data: February 2018",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/687542/February_2018_Consular_MI.csv",
        filename: "February_2018_Consular_MI.csv",
        content_type: "text/csv",
        file_size: 51_496,
        preview_url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/687542/February_2018_Consular_MI.csv/preview",
      },
    )
    assert_select ".gem-c-attachment__metadata .govuk-link", text: "View online"
  end

  it "does not show 'View online' preview_url is omitted" do
    render_component(
      attachment: {
        title: "Consular data: February 2018",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/687542/February_2018_Consular_MI.csv",
        filename: "February_2018_Consular_MI.csv",
        content_type: "text/csv",
        file_size: 51_496,
      },
    )
    assert_select "a", text: "View online", count: 0
  end

  it "shows 'Order a copy' link on the third metadata line if it's an official document" do
    render_component(
      attachment: {
        title: "The government financial reporting review",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/791567/the_government_financial_reporting_review_web.pdf",
        filename: "department-for-transport-information-asset-register.csv",
        content_type: "application/pdf",
        file_size: 20_000,
        number_of_pages: 7,
        isbn: "978-1-5286-1173-2",
        command_paper_number: "Cd. 67",
      },
    )
    assert_select ".gem-c-attachment__metadata:nth-of-type(3) .govuk-link", text: "Order a copy"
  end

  it "does not show 'Order a copy' link if disabled" do
    render_component(
      attachment: {
        title: "The government financial reporting review",
        url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/791567/the_government_financial_reporting_review_web.pdf",
        filename: "department-for-transport-information-asset-register.csv",
        content_type: "application/pdf",
        file_size: 20_000,
        number_of_pages: 7,
        isbn: "978-1-5286-1173-2",
        command_paper_number: "Cd. 67",
      },
      hide_order_copy_link: true,
    )
    assert_select ".gem-c-attachment__metadata:nth-of-type(3) .govuk-link", false
  end

  it "displays a custom heading level if heading_level is specified" do
    render_component(heading_level: 3, attachment: { title: "Attachment", url: "https://gov.uk/attachment" })
    assert_select "h3.gem-c-attachment__title .gem-c-attachment__link", text: "Attachment"
  end

  it "defaults to h2 if heading_level is not specified" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment" })
    assert_select "h2.gem-c-attachment__title .gem-c-attachment__link", text: "Attachment"
  end

  it "renders HTML attachments" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment", type: "html" })
    assert_select ".gem-c-attachment__metadata", text: "HTML"
    assert_thumbnail "html"
  end

  it "renders External attachments" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment", type: "external" })
    assert_select ".gem-c-attachment__metadata", text: "https://gov.uk/attachment"
    assert_thumbnail "generic"
  end

  def assert_thumbnail(type, src: nil)
    assert_select ".gem-c-attachment__thumbnail-image.gem-c-attachment__thumbnail-image--#{type}" do |thumbnail|
      expect(thumbnail.first.attr("src")).to eq(src) if type == "custom"
    end
  end

  it "accepts margin_bottom" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment" }, margin_bottom: 6)
    assert_select '.gem-c-attachment[class~="govuk-!-margin-bottom-6"]'

    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment" }, margin_bottom: 3)
    assert_select '.gem-c-attachment[class~="govuk-!-margin-bottom-3"]'
  end

  it "defaults to no margin_bottom" do
    render_component(attachment: { title: "Attachment", url: "https://gov.uk/attachment" })
    assert_select '.gem-c-attachment:not([class*="govuk-!-margin-bottom-"])'
  end

  it "includes GA4 tracking on HTML attachment links by default" do
    render_component(
      attachment: {
        title: "Test",
        url: "https://example.com",
        filename: "test",
        type: "html",
      },
    )
    assert_select "section[data-module=ga4-link-tracker]"
    assert_select ".gem-c-attachment__thumbnail a[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"attachment\"}']"
    assert_select ".gem-c-attachment__link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"attachment\"}']"
  end

  it "includes GA4 tracking on file attachment links by default" do
    render_component(
      attachment: {
        title: "Test",
        url: "https://example.com",
        filename: "test",
        content_type: "application/pdf",
      },
    )

    assert_select "section[data-module=ga4-link-tracker]"
    assert_select ".gem-c-attachment__thumbnail a[data-ga4-link='{\"event_name\":\"file_download\",\"type\":\"attachment\"}']"
    assert_select ".gem-c-attachment__link[data-ga4-link='{\"event_name\":\"file_download\",\"type\":\"attachment\"}']"
  end
end
