# Testing components

## Tests directory structure

Tests are stored in the [spec](../spec) directory with the Ruby tests written using RSpec and JavaScript tests written using Jasmine.

As per Rails convention, most of the directories within the `spec` directory contain Ruby [unit tests](#unit-testing) with the directories matching those within the `app` directory. Code that is stored in the `lib` directory has corresponding tests in the `spec/lib` directory.

Directories within `spec` that don’t contain Ruby unit tests are as follows:

- `dummy` - contains a generic frontend application to test the gem with;
- `dummy_gem` - required to test the [component auditing](auditing.md);
- `features` - contains [feature tests](#feature-testing), which test that a user can accomplish a task by interacting with a component;
- `javascripts` - contains unit tests for [JavaScript files](./javascript-modules.md), configuration and helper files for Jasmine;
- `support` - contains helper files for shared test methods and logic;
- `visual_regression_tests` - contains the [visual regression test runner](#visual-regression-testing).

## Unit testing

The purpose of these tests is to test individual units of the system in isolation. They are intended to provide exhaustive tests of the code paths through a particular class or view through its public interface. As per the test pyramid approach to software testing, these should provide the greatest volume of tests for the library.

Characteristics of unit tests:

- they should be concerned with the logic within the class/view being tested, and not test logic defined elsewhere;
- they may mock dependent objects and/or assert that particular external methods are called;
- they should test all code paths through a class/view;
- they should follow the conventions of [RSpec Rails view tests](https://relishapp.com/rspec/rspec-rails/v/3-9/docs/view-specs/view-spec).

## Feature testing

The purpose of these tests is to assert that a user can accomplish a task through interacting with components (for example switching a tab or opening an accordion section).

This type of test provides a high level functional test and helps to validate that a user can use a component to complete the tasks they use it for. This makes these tests some of the most valuable of the application, however they are slower than other tests to run and can be difficult to debug. Therefore they are not intended to exhaustively test all the scenarios that can occur as part of a distinct feature.

Characteristics of feature tests:

- they should navigate the application through the web interface with a minimal amount of set-up and direct visiting of links, for example most navigation should be achieved by user clicking;
- they may mock and/or assert that particular API calls are made to external services.

## Accessibility testing

If you create a component in the application, you can run accessibility tests against it.

The gem [includes integration tests](../lib/govuk_publishing_components/minitest/component_guide_test.rb) to check that your component guide and examples are error free and that they meet basic accessibility needs.

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

Visual regression tests are run on each pull request using a third-party tool called [Percy](https://percy.io) using a [GitHub Action workflow][1]. This isn't a mandatory check, so any changes that are highlighted by Percy won't prevent a pull request from being merged in.

The screenshots are public, so they can be checked without logging in. A BrowserStack account is needed to approve or reject any changes. It's the responsibility of the person reviewing the pull request code to approve any visual changes that Percy highlights.

If you want to capture full width screenshots for a component, add the flag below to the component documentation YAML file.

```yml
capture_full_width_screenshot: true
```

Relevant Percy setup documentation:

- [Using Percy with Rails and Capybara](https://docs.percy.io/docs/capybara)
- [Running Percy in a GitHub Action](https://docs.percy.io/docs/github-actions)

[1]: https://github.com/alphagov/govuk_publishing_components/blob/e455358c8a031403c6b5b0670f891c922919a3ca/.github/workflows/visual-regression-tests.yml
