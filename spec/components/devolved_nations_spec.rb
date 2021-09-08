require "rails_helper"

describe "Devolved Nations", type: :view do
  def component_name
    "devolved_nations"
  end

  it "renders a devolved nations component, which applies to one nation, correctly" do
    render_component(
      national_applicability: {
        england: {
          applicable: true,
        },
      },
    )
    assert_select ".gem-c-devolved-nations > h2", text: "Applies to England"
  end

  it "renders a devolved nations component, which applies to two nations, correctly" do
    render_component(
      national_applicability: {
        england: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      },
    )
    assert_select ".gem-c-devolved-nations > h2", text: "Applies to England and Wales"
  end

  it "renders a devolved nations component, which applies to three nations, correctly" do
    render_component(
      national_applicability: {
        england: {
          applicable: true,
        },
        scotland: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      },
    )
    assert_select ".gem-c-devolved-nations > h2", text: "Applies to England, Scotland and Wales"
  end

  it "renders a devolved nations component, which applies to one nation, with individual guidance available, correctly" do
    render_component(
      national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/guidance-northern-ireland",
        },
        scotland: {
          applicable: false,
          alternative_url: "/guidance-scotland",
        },
        wales: {
          applicable: false,
          alternative_url: "/guidance-wales",
        },
      },
    )
    assert_select ".gem-c-devolved-nations > h2", text: "Applies to England"
    assert_select ".gem-c-devolved-nations > ul > li:nth-child(1) > [href='/guidance-northern-ireland']", text: "Guidance for Northern Ireland"
    assert_select ".gem-c-devolved-nations > ul > li:nth-child(2) > [href='/guidance-scotland']", text: "Guidance for Scotland"
    assert_select ".gem-c-devolved-nations > ul > li:nth-child(3) > [href='/guidance-wales']", text: "Guidance for Wales"
  end

  it "renders a devolved nations component, which applies to three nations, with individual guidance available, correctly" do
    render_component(
      national_applicability: {
        england: {
          applicable: true,
        },
        northern_ireland: {
          applicable: false,
          alternative_url: "/guidance-northern-ireland",
        },
        scotland: {
          applicable: true,
        },
        wales: {
          applicable: true,
        },
      },
    )
    assert_select ".gem-c-devolved-nations > h2", text: "Applies to England, Scotland and Wales"
    assert_select ".gem-c-devolved-nations > ul > li:nth-child(1) > [href='/guidance-northern-ireland']", text: "Guidance for Northern Ireland"
  end

  it "renders a devolved nations component with different heading levels" do
    render_component(
      heading_level: 3,
      national_applicability: {
        england: {
          applicable: true,
        },
      },
    )
    assert_select ".gem-c-devolved-nations > h3", text: "Applies to England"
  end
end
