require "rails_helper"

describe "Tabs", type: :view do
  def component_name
    "tabs"
  end

  it "does not render anything if no data is passed" do
    assert_empty render_component({})
  end

  it "renders tabs and sections" do
    render_component(
      tabs: [
        {
          id: "tab1",
          label: "First section",
          content: "<p>Fusce at dictum tellus, ac accumsan est. Nulla vitae turpis in nulla gravida tincidunt. Duis lectus felis, tempus id bibendum sit amet, posuere ut elit. Donec enim odio, eleifend in urna a, sagittis egestas est. Proin id ex ultricies, porta eros id, vehicula quam. Morbi non sagittis velit.</p>",
        },
        {
          id: "tab2",
          label: "Second section",
          content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam congue elementum commodo. Vestibulum elit turpis, efficitur quis posuere vitae, commodo vitae augue. Donec ut pharetra ligula. Phasellus ac mauris eu felis bibendum dapibus rutrum sed quam. Pellentesque posuere ante id consequat pretium.</p>",
        },
      ],
    )
    assert_select ".govuk-tabs"
    assert_select ".govuk-tabs__tab", 2
    assert_select ".govuk-tabs__panel", 2
    assert_select "#tab1"
    assert_select "#tab1"
  end
end
