MagicLamp.fixture(name: "details") do
  render partial: "govuk_publishing_components/components/details"
end

MagicLamp.fixture(name: "tabs") do
  render "tabs_example", layout: "dummy_admin_layout"
end
