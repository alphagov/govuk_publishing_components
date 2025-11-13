module GovukPublishingComponents
  module Minitest
    module ComponentGuideTest
      extend ActiveSupport::Concern

      included do
        test "renders all component guide preview pages without erroring" do
          visit "/component-guide"

          # Confirm accessibility JS test is available
          assert_equal "function", evaluate_script("typeof window.GOVUK.AccessibilityTest"), "AccessibilityTest JavaScript isn’t available"
          assert_equal "string", evaluate_script("typeof window.axe.version"), "aXe accessibility test library isn’t available"

          all(:css, ".govuk-list.govuk-list--bullet a").map { |el| "#{el[:href]}/preview" }.each do |component|
            visit component
            assert page.has_css?(".js-test-a11y-finished"), "Accessibility test did not run on #{component}"
            assert page.has_css?(".js-test-a11y-success"), "Accessibility test found violations on #{component}"
          end
        end
      end
    end
  end
end
