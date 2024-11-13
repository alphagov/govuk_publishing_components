require "rails_helper"

describe "Chat entry", type: :view do
  def component_name
    "chat_entry"
  end

  it "renders the chat entry component" do
    render_component({})

    assert_select ".gem-c-chat-entry"
    assert_select "h2.gem-c-chat-entry__heading [href]", href: "/chat", text: "Ask GOV.UK Chat"
    assert_select ".gem-c-chat-entry__description .govuk-body", text: "Get quick, tailored answers to your business questions with GOV.UK’s new AI tool"
  end

  it "renders the chat entry component with a custom href, heading and description" do
    render_component({
      href: "/govuk-chat",
      heading_text: "Go to GOV.UK Chat",
      description_text: "Get answers to your business questions",
    })

    assert_select ".gem-c-chat-entry"
    assert_select "h2.gem-c-chat-entry__heading [href]", href: "/govuk-chat", text: "Go to GOV.UK Chat"
    assert_select ".gem-c-chat-entry__description .govuk-body", text: "Get answers to your business questions"
  end

  it "renders the chat entry component with a different heading level" do
    render_component({
      heading_level: 3,
    })

    assert_select "h3.gem-c-chat-entry__heading [href]", href: "/chat", text: "Ask GOV.UK Chat"
  end

  it "renders the chat entry component with a border top" do
    render_component({
      border_top: true,
    })

    assert_select ".gem-c-chat-entry.gem-c-chat-entry--border-top"
  end

  it "renders the chat entry component with a border bottom" do
    render_component({
      border_bottom: true,
    })

    assert_select ".gem-c-chat-entry.gem-c-chat-entry--border-bottom"
  end

  it "renders the chat entry component with a border top and a border bottom" do
    render_component({
      border_top: true,
      border_bottom: true,
    })

    assert_select ".gem-c-chat-entry.gem-c-chat-entry--border-top.gem-c-chat-entry--border-bottom"
  end

  it "renders the chat entry component with ga4 data attributes by default" do
    render_component({})

    assert_select '.gem-c-chat-entry[data-module="ga4-link-tracker"]'
    assert_select '.gem-c-chat-entry .govuk-link[data-ga4-link=\'{"event_name":"navigation","type":"callout","section":"GOV.UK Chat entry"}\']'
  end

  it "renders the chat entry component without ga4 data attributes when passed disable_ga4: true" do
    render_component({
      disable_ga4: true,
    })

    assert_select '.gem-c-chat-entry[data-module="ga4-link-tracker"]', false
    assert_select ".gem-c-chat-entry[data-ga4-link]", false
  end
end
