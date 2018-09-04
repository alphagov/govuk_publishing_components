require 'rails_helper'

describe "Radio", type: :view do
  def component_name
    "radio"
  end

  it "throws an error if items are passed but no name is passed" do
    assert_raises do
      render_component(items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        }
      ])
    end
  end

  it "renders radio-group with one item" do
    render_component(
      name: "radio-group-one-item",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        }
      ]
    )

    assert_select ".govuk-radios__input[name=radio-group-one-item]"
    assert_select ".govuk-radios__item:first-child .govuk-radios__label", text: "Use Government Gateway"
  end

  it "renders radio-group with multiple items" do
    render_component(
      name: "radio-group-multiple-items",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify"
        }
      ]
    )

    assert_select ".govuk-radios__input[name=radio-group-multiple-items]"
    assert_select ".govuk-radios__item:first-child .govuk-radios__label", text: "Use Government Gateway"
    assert_select ".govuk-radios__item:last-child .govuk-radios__label", text: "Use GOV.UK Verify"
  end

  it "renders radio-group with bold labels" do
    render_component(
      name: "radio-group-bold-labels",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
          bold: true
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          bold: true
        }
      ]
    )

    assert_select ".govuk-radios__input[name=radio-group-bold-labels]"
    assert_select ".govuk-radios__item .govuk-label--s"
  end

  it "renders radio items with hint text" do
    render_component(
      name: "radio-group-hint-text",
      items: [
        {
          value: "government-gateway",
          hint_text: "You'll have a user ID if you've signed up to do things like sign up Self Assessment tax return online.",
          text: "Use Government Gateway"
        },
        {
          value: "govuk-verify",
          hint_text: "You'll have an account if you've already proved your identity with a certified company, such as the Post Office.",
          text: "Use GOV.UK Verify"
        }
      ]
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
          text: "Use Government Gateway"
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          checked: true
        }
      ]
    )

    assert_select ".govuk-radios__input[name=radio-group-checked-option]"
    assert_select ".govuk-radios__input[checked]", value: "govuk-verify"
  end

  it "renders radio-group with custom id prefix" do
    render_component(
      id_prefix: 'custom',
      name: "radio-group-custom-id-prefix",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify"
        }
      ]
    )

    assert_select ".govuk-radios__input[name=radio-group-custom-id-prefix]"
    assert_select ".govuk-radios__input[id=custom-0]", value: "government-gateway"
    assert_select ".govuk-radios__label[for=custom-0]", text: "Use Government Gateway"
    assert_select ".govuk-radios__input[id=custom-1]", value: "govuk-verify"
    assert_select ".govuk-radios__label[for=custom-1]", text: "Use GOV.UK Verify"
  end

  it "renders radio-group with or divider" do
    render_component(
      name: "radio-group-or-divider",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        },
        :or,
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify"
        }
      ]
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
          conditional: "You’ll need to prove your identity using Government Gateway"
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify",
          conditional: "You’ll need to prove your identity using GOV.UK Verify"
        }
      ]
    )

    assert_select ".govuk-radios[data-module=radios]"
    assert_select ".govuk-radios__conditional", text: "You’ll need to prove your identity using Government Gateway"
  end

  it "renders radio-group with hint text" do
    render_component(
      name: "radio-group-conditional",
      hint: "You’ll need to prove your identity using one of the following methods",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify"
        }
      ]
    )

    assert_select ".govuk-hint", text: "You’ll need to prove your identity using one of the following methods"
  end

  it "renders radio-group with error message" do
    render_component(
      name: "radio-group-conditional",
      error_message: "Please select one option",
      items: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        },
        {
          value: "govuk-verify",
          text: "Use GOV.UK Verify"
        }
      ]
    )

    assert_select ".govuk-error-message", text: "Please select one option"
  end

  it "renders radio-group with welsh translated 'or'" do
    I18n.with_locale(:cy) do
      render_component(
        name: "radio-welsh-or",
        items: [
          {
            value: "government-gateway",
            text: "Use Government Gateway"
          },
          :or,
          {
            value: "govuk-verify",
            text: "Use GOV.UK Verify"
          }
        ]
      )
    end

    assert_select ".govuk-radios__divider", text: "neu"
  end
end

# This component can be interacted with, so use integration tests for these cases.
describe 'Radio (integration)' do
  def input_visible
    false # our inputs are hidden with CSS, and rely on the label.
  end

  it "radio can choose an option" do
    visit '/component-guide/radio/default/preview'

    within '.component-guide-preview' do
      assert_text 'Use GOV.UK Verify'
      assert_text 'Use Government Gateway'

      expect(page).to_not have_selector("[@class='govuk-radios__input'][@checked='checked']", visible: input_visible)

      page.choose(option: 'govuk-verify', allow_label_click: true)

      expect(page).to_not have_selector("[@class='govuk-radios__input'][@value='government-gateway'][@checked='checked']", visible: input_visible)
      expect(page).to have_selector("[@class='govuk-radios__input'][@value='govuk-verify'][@checked='checked']", visible: input_visible)
    end
  end

  it "radio can choose an option when already has one checked" do
    visit '/component-guide/radio/with_checked_option/preview'

    within '.component-guide-preview' do
      assert_text 'Use Government Gateway'
      assert_text 'Use GOV.UK Verify'

      expect(page).to have_selector("[@class='govuk-radios__input'][@value='govuk-verify'][@checked='checked']", visible: input_visible)
      expect(page).to_not have_selector("[@class='govuk-radios__input'][@value='government-gateway'][@checked='checked']", visible: input_visible)

      page.choose(option: 'government-gateway', allow_label_click: true)

      expect(page).to have_selector("[@class='govuk-radios__input'][@value='government-gateway'][@checked='checked']", visible: input_visible)
      expect(page).to_not have_selector("[@class='govuk-radios__input'][@value='govuk-verify'][@checked='checked']", visible: input_visible)
    end
  end
end
