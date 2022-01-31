# Testing components

## Accessibility testing

If you create a component in the application, you can run accessibility tests against it.

The gem [includes integration tests](lib/govuk_publishing_components/minitest/component_guide_test.rb) to check that your component guide and examples are error free and that they meet basic accessibility needs.

Automated accessibility tests use [aXe](https://github.com/dequelabs/axe-core). Using our `AccessibilityTest` wrapper the gem runs the aXe suite against each example and throws JavaScript errors for any violations. These JavaScript errors can be used to fail a build in CI.

You can set this up by adding the following integration test.

```ruby
# test/integration/component_guide_test.rb
require 'govuk_publishing_components/minitest/component_guide_test'

class ComponentGuideTest < ActionDispatch::IntegrationTest
  include GovukPublishingComponents::Minitest::ComponentGuideTest
end
```

(There's no RSpec variant for this yet, PRs welcome)

### Exclude accessibility rules

Sometimes you will have a component that will throw an error due to it being in isolation, for example radio buttons not being in a fieldset.

For this case you can add `accessibility_excluded_rules` to your components' documentation yml file with the rules you want to exclude. These rules can be found in brackets in the error messages displayed.

For an example of this check [test-component-with-duplicate-ids.yml](../spec/dummy/app/views/components/docs/test-component-with-duplicate-ids.yml)


## Visual regression testing

Visual regression tests are run on each pull request using a third-party tool called [Percy](https://percy.io). This isn't a mandatory check, so any changes that are highlighted by Percy won't prevent a pull request from being merged in.

The screenshots are public, so they can be checked without logging in. A BrowserStack account is needed to approve or reject any changes. It's the responsibility of the person reviewing the pull request code to approve any visual changes that Percy highlights.
