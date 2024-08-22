require "rails_helper"

describe "Chat entry", type: :view do
  def component_name
    "chat_entry"
  end

  it "renders the chat entry component" do
    render_component({})

    assert_select ".gem-c-chat-entry"
    assert_select "h2.gem-c-chat-entry__heading [href]", href: "/chat", text: "Try GOV.UK Chat"
    assert_select ".gem-c-chat-entry__description .govuk-body", text: "Sign up to GOV.UK’s experimental new AI tool and find answers to your business questions"
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

    assert_select "h3.gem-c-chat-entry__heading [href]", href: "/chat", text: "Try GOV.UK Chat"
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
end
