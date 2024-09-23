require "rails_helper"

describe "Radio", type: :view do
  def component_name
    "radio"
  end

  it "throws an error if items are passed but no name is passed" do
    assert_raises do
      render_component(items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ])
    end
  end

  it "renders radio-group with one item" do
    render_component(
      name: "radio-group-one-item",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-one-item]"
    assert_select ".govuk-radios__item:first-child .govuk-radios__label", text: "Use Government Gateway"
    assert_select "legend", false
    assert_select "legend h1", false
  end

  it "renders radio-group with multiple items" do
    render_component(
      name: "radio-group-multiple-items",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-multiple-items]"
    assert_select ".govuk-radios__item:first-child .govuk-radios__label", text: "Use Government Gateway"
    assert_select ".govuk-radios__item:last-child .govuk-radios__label", text: "Use GOV.UK Verify"
  end

  it "renders small radios" do
    render_component(
      name: "radio-group-multiple-items",
      small: true,
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-radios.govuk-radios--small"
  end

  it "renders inline radios" do
    render_component(
      name: "inline-radios",
      inline: true,
      items: [
        {
          value: "on",
          text: "On",
        },
        {
          value: "off",
          text: "Off",
        },
      ],
    )

    assert_select ".govuk-radios.govuk-radios--inline"
  end

  it "renders radios with the correct default margin bottom" do
    render_component(
      name: "radio-group-one-item",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select '.govuk-form-group.govuk-\!-margin-bottom-6'
  end

  it "renders radios with a given margin bottom" do
    render_component(
      name: "radio-group-one-item",
      margin_bottom: 9,
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select '.govuk-form-group.govuk-\!-margin-bottom-9'
  end

  it "renders radio-group with a legend" do
    render_component(
      name: "favourite-smartie",
      heading: "What is your favourite smartie?",
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend", "What is your favourite smartie?"
    assert_select "legend h1", false
  end

  it "renders radio-group with the legend as the page heading" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_level: 1,
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend h1", "What is your favourite skittle?"
  end

  it "renders radio-group with a legend" do
    render_component(
      name: "radio-group-legend",
      heading: "What is your favourite smartie?",
      heading_level: 0,
      heading_size: "l",
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend", "What is your favourite smartie?"
    assert_select "legend span.govuk-fieldset__heading", true
    assert_select "legend h2", false
  end

  it "renders radio-group with a page heading caption" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_caption: "Question 3 of 9",
      heading_level: 1,
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend h1", text: "What is your favourite skittle?"
    assert_select "legend span.govuk-caption-xl", "Question 3 of 9"
  end

  it "renders no caption if the header is not a page heading" do
    render_component(
      name: "favourite-skittle",
      heading_caption: "Question 3 of 9",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend h1", false
    assert_select "legend span.govuk-caption-xl", false
  end

  it "renders radio-group with a custom page heading size" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_caption: "Question 3 of 9",
      heading_size: "l",
      heading_level: 1,
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend.govuk-fieldset__legend--l h1.govuk-fieldset__heading", text: "What is your favourite skittle?"
    assert_select "legend span.govuk-caption-l", "Question 3 of 9"
  end

  it "renders radio-group with no custom page heading size" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_caption: "Question 3 of 9",
      heading_level: 1,
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend.govuk-fieldset__legend--xl h1.govuk-fieldset__heading", text: "What is your favourite skittle?"
    assert_select "legend span.govuk-caption-xl", "Question 3 of 9"
  end

  it "renders radio-group with heading size m if no custom size or page heading option is passed in" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-radios"
    assert_select "legend.govuk-fieldset__legend--m", text: "What is your favourite skittle?"
  end

  it "renders radio-group with custom heading size" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_size: "s",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-fieldset__legend.govuk-fieldset__legend--s", "What is your favourite skittle?"
  end

  it "renders radio-group with default heading size when passing an undefined size" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_size: "x",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-fieldset__legend.govuk-fieldset__legend--m", "What is your favourite skittle?"
  end

  it "renders radio-group with h2 heading level by default" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select "h2.govuk-fieldset__heading", text: "What is your favourite skittle?"
  end

  it "renders radio-group custom heading level if custom heading level is passed" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_level: 4,
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select "h4.govuk-fieldset__heading", text: "What is your favourite skittle?"
  end

  it "renders radio-group with a visually hidden heading if visually_hidden_heading is passed" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_level: 4,
      visually_hidden_heading: true,
    )

    assert_select "legend.govuk-visually-hidden", "What is your favourite skittle?"
  end

  it "renders radio-group with bold labels" do
    render_component(
      name: "radio-group-bold-labels",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
          bold: true,
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          bold: true,
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-bold-labels]"
    assert_select ".govuk-radios__item .govuk-label--s"
  end

  it "renders a radio item with contextual-guidance data attribute" do
    render_component(
      name: "radio-group-data-attributes",
      items: [
        {
          value: "cool-button",
          text: "Best button in town",
          data_attributes: { "contextual-guidance": "cool-buttons-guidance" },
        },
        {
          value: "no-data-attributes-button",
          text: "Worst button in town",
        },
      ],
    )

    assert_select ".govuk-radios__item:first-child .govuk-radios__input[data-contextual-guidance=cool-buttons-guidance]"
    assert_select ".govuk-radios__item:last-child .govuk-radios__input[data-contextual-guidance]", false
  end

  it "renders radio items with hint text" do
    render_component(
      name: "radio-group-hint-text",
      items: [
        {
          value: "government-gateway",
          hint_text: "You'll have a user ID if you've signed up to do things like sign up Self Assessment tax return online.",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          hint_text: "You'll have an account if you've already proved your identity with a certified company, such as the Post Office.",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-hint-text]"
    assert_select ".govuk-radios__item:first-child .govuk-radios__label", text: "Use Government Gateway"
    assert_select ".govuk-radios__item:first-child .govuk-hint", text: "You'll have a user ID if you've signed up to do things like sign up Self Assessment tax return online."
    assert_select ".govuk-radios__item:last-child .govuk-radios__label", text: "Use GOV.UK Verify"
    assert_select ".govuk-radios__item:last-child .govuk-hint", text: "You'll have an account if you've already proved your identity with a certified company, such as the Post Office."
  end

  it "renders radio-group with checked option" do
    render_component(
      name: "radio-group-checked-option",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          checked: true,
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-checked-option]"
    assert_select ".govuk-radios__input[checked]", value: "govuk-verify"
  end

  it "renders radio-group with custom id prefix" do
    render_component(
      id_prefix: "custom",
      name: "radio-group-custom-id-prefix",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-custom-id-prefix]"
    assert_select ".govuk-radios__input[id=custom-0]", value: "government-gateway"
    assert_select ".govuk-radios__label[for=custom-0]", text: "Use Government Gateway"
    assert_select ".govuk-radios__input[id=custom-1]", value: "govuk-verify"
    assert_select ".govuk-radios__label[for=custom-1]", text: "Use GOV.UK Verify"
  end

  it "renders radio-group with custom id" do
    render_component(
      id: "radio-group",
      name: "radio-group-custom-id",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-form-group[id=radio-group]"
  end

  it "renders radio-group with or divider" do
    render_component(
      name: "radio-group-or-divider",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        :or,
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-radios__input[name=radio-group-or-divider]"
    assert_select ".govuk-radios__item:first-child .govuk-radios__label", text: "Use Government Gateway"
    assert_select ".govuk-radios__divider", text: "or"
    assert_select ".govuk-radios__item:last-child .govuk-radios__label", text: "Use GOV.UK Verify"
  end

  it "renders radio-group with conditionally revealed content" do
    render_component(
      name: "radio-group-conditional",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
          conditional: "You’ll need to prove your identity using Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          conditional: "You’ll need to prove your identity using GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-radios[data-module=govuk-radios]"
    assert_select ".govuk-radios__conditional", text: "You’ll need to prove your identity using Government Gateway"
  end

  it "renders radio-group with hint text" do
    render_component(
      name: "radio-group-conditional",
      hint: "You’ll need to prove your identity using one of the following methods",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-hint", text: "You’ll need to prove your identity using one of the following methods"

    dom = Nokogiri::HTML(rendered)
    hint_id = dom.xpath('//div[contains(@class, "govuk-hint")]')[0].attr("id")
    assert_select ".govuk-fieldset[aria-describedby='#{hint_id}']"
  end

  it "renders radio-group with error message" do
    render_component(
      name: "radio-group-conditional",
      error_message: "Please select one option",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-error-message", text: "Error: Please select one option"

    dom = Nokogiri::HTML(rendered)
    error_id = dom.xpath("//p")[0].attr("id")
    assert_select ".govuk-fieldset[aria-describedby='#{error_id}']"
  end

  it "renders radio-group with error message and hint text" do
    render_component(
      name: "radio-group-conditional",
      hint: "You’ll need to prove your identity using one of the following methods",
      error_message: "Please select one option",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-error-message", text: "Error: Please select one option"

    dom = Nokogiri::HTML(rendered)
    hint_id = dom.xpath('//div[contains(@class, "govuk-hint")]')[0].attr("id")
    error_id = dom.xpath("//p")[0].attr("id")
    ids = "#{hint_id} #{error_id}"
    assert_select ".govuk-fieldset[aria-describedby='#{ids}']"
  end

  it "renders radio-group with error items" do
    render_component(
      name: "radio-group-conditional",
      error_items: [
        {
          text: "Error item 1",
        },
        {
          text: "Error item 2",
        },
      ],
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
        },
      ],
    )

    assert_select ".govuk-error-message", text: "Error: Error item 1Error item 2"
  end

  it "renders radio-group with welsh translated 'or'" do
    I18n.with_locale(:cy) do
      render_component(
        name: "radio-welsh-or",
        items: [
          {
            value: "government-gateway",
            text: "Use Government Gateway",
          },
          :or,
          {
            value: "govuk-verify",
            text: "Use GOV.UK Verify",
          },
        ],
      )
    end

    assert_select ".govuk-radios__divider", text: "neu"
  end

  it "renders a radio group with data-tracking-url attributes" do
    gateway_url = "https://www.tax.service.gov.uk/gg/sign-in?continue=%2Fcheck-your-state-pension%2Faccount&origin=nisp-frontend&accountType=individual"
    verify_url = "https://www.tax.service.gov.uk/check-your-state-pension/signin/verify?journey_hint=eidas_sign_in"
    render_component(
      name: "radio-group-tracking-urls",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
          url: gateway_url,
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          url: verify_url,
        },
      ],
    )

    assert_select ".govuk-radios input[data-tracking-url='#{gateway_url}']"
    assert_select ".govuk-radios input[data-tracking-url='#{verify_url}']"
  end

  it "renders description text" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-body", "This is a description about skittles."
  end

  it "renders govspeak description text" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      description: render(
        "govuk_publishing_components/components/govspeak",
        content: "<p>This is a description about skittles.</p>".html_safe,
      ),
      items: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-body", "This is a description about skittles."
  end
end

# This component can be interacted with, so use integration tests for these cases.
describe "Radio (integration)" do
  def input_visible
    false # our inputs are hidden with CSS, and rely on the label.
  end

  it "radio can choose an option" do
    visit "/component-guide/radio/default/preview"

    within ".component-guide-preview" do
      assert_text "Use GOV.UK Verify"
      assert_text "Use Government Gateway"

      expect(page).to_not have_selector("[@class='govuk-radios__input'][@checked='checked']", visible: input_visible)

      page.choose(option: "govuk-verify", allow_label_click: true)

      expect(page).to_not have_selector("[@class='govuk-radios__input'][@value='government-gateway'][@checked='checked']", visible: input_visible)
      expect(page).to have_selector("[@class='govuk-radios__input'][@value='govuk-verify'][@checked='checked']", visible: input_visible)
    end
  end

  it "radio can choose an option when already has one checked" do
    visit "/component-guide/radio/with_checked_option/preview"

    within ".component-guide-preview" do
      assert_text "Use Government Gateway"
      assert_text "Use GOV.UK Verify"

      expect(page).to have_selector("[@class='govuk-radios__input'][@value='govuk-verify'][@checked='checked']", visible: input_visible)
      expect(page).to_not have_selector("[@class='govuk-radios__input'][@value='government-gateway'][@checked='checked']", visible: input_visible)

      page.choose(option: "government-gateway", allow_label_click: true)

      expect(page).to have_selector("[@class='govuk-radios__input'][@value='government-gateway'][@checked='checked']", visible: input_visible)
      expect(page).to_not have_selector("[@class='govuk-radios__input'][@value='govuk-verify'][@checked='checked']", visible: input_visible)
    end
  end
end
