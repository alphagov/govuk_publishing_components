require "rails_helper"

describe "Acronym", type: :view do
    def component_name
      "acronym"
    end

    it "does not render anything if no data is passed" do
        test_data = {}
        assert_empty render_component(test_data)
    end

    it "shows an acronym" do    
        render_component(
            acronym: "WWW"
        )
        assert_select '.gem-c-acronym', text: 'WWW'
end
