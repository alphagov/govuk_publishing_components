require "rails_helper"

describe "Input", type: :view do
  def component_name
    "input"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders text input with name and label text" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
    )

    assert_select ".govuk-input[type='text']"
    assert_select ".govuk-input[name='email-address']"

    assert_select ".govuk-label", text: "What is your email address?"
  end

  it "renders inputs with a configurable type" do
    render_component(
      name: "email-address",
      type: "email",
    )

    assert_select ".govuk-input[type='email']"
    assert_select ".govuk-input[name='email-address']"
    assert_select ".govuk-input[spellcheck='false']"
  end

  # https://design-system.service.gov.uk/components/text-input/#numbers
  it "renders inputs with type number as per GOV.UK Design System guidance" do
    render_component(
      name: "account-number",
      type: "number",
    )

    assert_select ".govuk-input[type='text'][inputmode='numeric']"
    assert_select ".govuk-input[spellcheck='false']"
  end

  it "renders an input with a given id" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      id: "test",
    )

    assert_select ".govuk-input#test"
  end

  it "sets the 'for' on the label to the input id" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
    )

    input = css_select(".govuk-input")
    input_id = input.attr("id").text

    assert_select ".govuk-label[for='#{input_id}']"
  end

  it "sets the value when provided" do
    render_component(
      name: "email-address",
      value: "example@example.com",
    )

    assert_select ".govuk-input[value='example@example.com']"
  end

  it "renders inputs with aria attributes if provided" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      describedby: "something",
      controls: "something-else",
    )

    assert_select ".govuk-input[aria-describedby='something'][aria-controls='something-else']"
  end

  it "renders inputs with an autocomplete attribute if provided" do
    render_component(
      label: { text: "What is your name?" },
      name: "name",
      autocomplete: "name",
    )

    assert_select ".govuk-input[autocomplete='name']"
    assert_select ".govuk-input[spellcheck='false']"
  end

  it "renders input with a data attributes" do
    render_component(
      data: { module: "contextual-guidance" },
      name: "with-data-attributes",
    )

    assert_select ".govuk-input[data-module='contextual-guidance']"
  end

  it "renders autofocused input" do
    render_component(
      label: { text: "Username" },
      name: "username",
      autofocus: true,
      tabindex: 0,
    )

    assert_select ".govuk-input[autofocus][tabindex='0']"
  end

  it "sets the maxlength when provided" do
    render_component(
      name: "email-address",
      maxlength: 10,
    )

    assert_select ".govuk-input[maxlength='10']"
  end

  it "renders input with custom width" do
    render_component(
      name: "email-address",
      width: 10,
    )

    assert_select ".govuk-input.govuk-input--width-10"
  end

  it "renders default input width if the custom width is not supported" do
    render_component(
      name: "email-address",
      width: 11,
    )

    assert_select ".govuk-input--width-10", false
  end

  context "when a hint is provided" do
    before do
      render_component(
        name: "email-address",
        hint: "Please enter a valid email address",
      )
    end

    it "renders the hint" do
      assert_select ".govuk-hint", text: "Please enter a valid email address"
    end

    it "has 'aria-describedby' the hint id" do
      hint_id = css_select(".govuk-hint").attr("id")

      assert_select ".govuk-input[aria-describedby='#{hint_id}']"
    end
  end

  context "when an error_message is provided" do
    before do
      render_component(
        name: "email-address",
        error_message: "Please enter a valid email address",
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Error: Please enter a valid email address"
    end

    it "has 'aria-describedby' the error message id" do
      error_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-input[aria-describedby='#{error_id}']"
    end
  end

  context "when error_items are provided" do
    before do
      render_component(
        name: "email-address",
        error_items: [
          {
            text: "Error item 1",
          },
          {
            text: "Error item 2",
          },
        ],
      )
    end

    it "renders the error message" do
      assert_select ".govuk-error-message", text: "Error: Error item 1Error item 2"
    end

    it "has 'aria-describedby' the error message id" do
      error_id = css_select(".govuk-error-message").attr("id")

      assert_select ".govuk-input[aria-describedby='#{error_id}']"
    end
  end

  it "renders text input different sized labels" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      heading_size: "xl",
    )

    assert_select ".govuk-label.govuk-label--xl"
  end

  it "renders the label wrapped in a heading" do
    render_component(
      label: { text: "Where's your head at?" },
      name: "heading",
      heading_level: 3,
    )

    assert_select "h3.govuk-label-wrapper .govuk-label", text: "Where's your head at?"
  end

  it "only renders a label wrapped in a heading if specified" do
    render_component(
      label: { text: "What is your email address?" },
      name: "email-address",
      heading_size: "xl",
    )

    assert_select ".govuk-label-wrapper", false
  end

  it "renders text input with prefix" do
    render_component(
      label: { text: "Cost per item, in pounds" },
      name: "cost-per-item",
      prefix: "£",
    )
    assert_select ".govuk-input__wrapper .gem-c-input[name=cost-per-item]"
    assert_select ".govuk-input__wrapper .govuk-input__prefix[aria-hidden=true]", text: "£"
  end

  it "renders text input with suffix" do
    render_component(
      label: { text: "Approximate lead times, in days" },
      name: "lead-times",
      suffix: "days",
    )
    assert_select ".govuk-input__wrapper .gem-c-input[name=lead-times]"
    assert_select ".govuk-input__wrapper .govuk-input__suffix[aria-hidden=true]", text: "days"
  end

  it "renders input with search icon" do
    render_component(
      label: { text: "Search the internet" },
      name: "search-box",
      search_icon: true,
    )
    assert_select ".gem-c-input--with-search-icon"
    assert_select ".gem-c-input__search-icon"
  end

  it "renders input with an `enterkeyhint` attribute" do
    render_component(
      name: "with-enterkeyhint-attribute",
      enterkeyhint: "search",
    )

    assert_select ".govuk-input[enterkeyhint='search']"
  end

  it "doesn't add tje `enterkeyhint` attribute if not an appropriate value" do
    render_component(
      name: "without-enterkeyhint-attribute",
      enterkeyhint: "chocolate",
    )

    assert_select ".govuk-input[enterkeyhint='chocolate']", false
  end

  it "renders the input and label with the correct `dir` attribute when the input is set to 'right_to_left: true'" do
    render_component(
      name: "rtl-input-text",
      value: "العربيَّة",
      right_to_left: true,
      label: {
        text: "Some label text that displays right to left",
      },
    )

    assert_select ".govuk-input[dir='rtl']"
    assert_select ".govuk-label[dir='rtl']"
  end

  it "renders the input and help text (label, hint and error messages) with the correct `dir` attribute when `right_to_left` is set to true and `right_to_left_help` is set to false" do
    render_component(
      name: "rtl-input-text",
      value: "العربيَّة",
      hint: "Some hint text that is displayed left to right",
      right_to_left: true,
      right_to_left_help: false,
      error_message: "An error message that is displayed left to right",
      label: {
        text: "Some label text that displays left to right",
      },
    )

    assert_select ".govuk-input[dir='rtl']"
    assert_select ".govuk-label[dir='rtl']", false
    assert_select ".govuk-hint[dir='rtl']", false
    assert_select ".govuk-error-message[dir='rtl']", false
  end
end
