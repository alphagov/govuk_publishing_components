require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::AssetHelper do
  describe "Asset helper" do
    include described_class

    # Create a mock request
    def request
      instance_double(ActionDispatch::Request, { path: "/" })
    end

    it "detect the total number of stylesheet paths" do
      expect(get_component_css_paths.count).to be(88)
    end

    it "initialize empty asset helper" do
      expect(all_component_stylesheets_being_used).to eql([])
    end

    it "initialize asset helper then add app component" do
      add_gem_component_stylesheet("accordion")

      expect(all_component_stylesheets_being_used).to eql(["govuk_publishing_components/components/_accordion.css"])
    end

    it "initialize asset helper then add calendar component stylesheet" do
      add_app_component_stylesheet("calendar")

      expect(all_component_stylesheets_being_used).to eql(["components/_calendar.css"])
    end

    it "initialize asset helper then add view stylesheet" do
      add_view_stylesheet("bank_holidays")

      expect(all_component_stylesheets_being_used).to eql(["views/_bank_holidays.css"])
    end

    it "initialize asset helper then add view stylesheet with a custom path" do
      add_stylesheet_path("views/calendar/_bank_holidays.css")

      expect(all_component_stylesheets_being_used).to eql(["views/calendar/_bank_holidays.css"])
    end
  end
end
