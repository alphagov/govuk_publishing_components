require "rails_helper"

describe "Chat entry", type: :view do
  def component_name
    "chat_entry"
  end

  it "renders nothing when no data is provided" do
    assert_empty render_component({})
  end
end
