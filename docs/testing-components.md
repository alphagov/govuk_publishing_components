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

For an example of this check [test-component-with-no-image-alt.yml](../spec/dummy/app/views/components/docs/test_component_with_no_image_alt.yml)

## Visual regression testing

Visual regression tests are run on each pull request using a third-party tool called [Percy](https://percy.io) through a [GitHub Action workflow][1].

Percy captures screenshots of our components at defined viewport widths and compares them against the previously approved baseline. This helps identify unintended visual changes before they are merged.

Visual regression tests run against Safari to better represent our users and increase coverage of WebKit-specific rendering behaviour. As of December 2025, [61% (622 million)](https://insidegovuk.blog.gov.uk/2026/01/28/how-people-used-gov-uk-in-2025/) of monthly GOV.UK visits were on mobile, with Safari and Chrome accounting for around [90% of browser usage](https://gs.statcounter.com/browser-market-share/mobile/united-kingdom).

### Reviewing visual changes

Percy screenshots are public and can be viewed without logging in. A BrowserStack account is required to approve or reject changes.

Percy is a required status check. If visual differences are detected, the check will remain unapproved and prevent the pull request from being merged until the changes have been reviewed and approved.

The person reviewing the pull request is responsible for reviewing any differences highlighted by Percy, clarifying with a designer if necessary, and approving the changes when they are expected.

### Viewport widths

Component screenshots are captured at the following viewport widths:

- Mobile: 320px
- Tablet: 641px
- Desktop: 1280px

These sizes have been chosen to best align our visual regression tests with the breakpoints used by [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-breakpoints).

### Full-width component screenshots

By default, Percy captures the component itself rather than the full available viewport width.

For components that need to be tested at the full viewport width, add the following option to the component's documentation YAML file:

```yml
capture_full_width_screenshot: true
```

This is useful for components whose layout or behaviour depends on the available page width.

### Testing interactive component states

Percy can capture interactive component states by taking a snapshot before and after an interaction, such as a click. This allows visual changes in both states to be tested for regressions.

This is useful for components where important content or layout changes are only visible following a user interaction.

To add a new component state check, add the component to the `INTERACTIVE_COMPONENTS` list in the [visual regression test config file](https://github.com/alphagov/govuk_publishing_components/blob/d0fa804bb1a468b6a80122e48988470ecbef878a/spec/visual_regression_tests/all_components_config.rb). Each entry should include: 

- `state_name` - the name of the state being tested
- `toggle_selector` - selector for the target element to click
- `wait_selector` – the selector for the element expected to be visible after the interaction

### Relevant Percy setup documentation

- [Visual Testing with Percy](https://www.browserstack.com/docs/percy)
- [Using Percy with Rails and Capybara](https://docs.percy.io/docs/capybara)
- [Running Percy in a GitHub Action](https://docs.percy.io/docs/github-actions)

[1]: https://github.com/alphagov/govuk_publishing_components/blob/e455358c8a031403c6b5b0670f891c922919a3ca/.github/workflows/visual-regression-tests.yml
