# GOV.UK Publishing Components
[![status](https://github.com/alphagov/govuk_publishing_components/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alphagov/govuk_publishing_components/actions/workflows/ci.yml?query=branch%3Amain)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Stylelint Style Guide](https://img.shields.io/badge/code_style-stylelint-brightgreen.svg)](https://github.com/alphagov/stylelint-config-gds/)
[![Rubocop Style Guide](https://img.shields.io/badge/code_style-rubocop-brightgreen.svg)](https://github.com/alphagov/rubocop-govuk)
[![erb_lint Style Guide](https://img.shields.io/badge/code_style-erb_lint-brightgreen.svg)](https://github.com/Shopify/erb_lint)

govuk_publishing_components is a Ruby gem to document and distribute components for GOV.UK applications. It provides:

- a shared library of components
- helpers to generate component payloads
- an application to preview components and provide guidance
- [GOV.UK Design System](https://design-system.service.gov.uk/) styles and components (via [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend))

Only add a component to this gem if it is required in more than one application. Please do not add application-specific components to govuk_publishing_components.

All components should meet the accessibility standards for browser and assistive technology support described in [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend#browser-and-assistive-technology-support).

## Technical documentation

### Run the application

```sh
./startup.sh
```

See also [Local frontend development](https://docs.publishing.service.gov.uk/manual/local-frontend-development.html).

### Run the test suite

```sh
bundle install
yarn install
bundle exec rake
```

### Run the JavaScript tests alone

With text-only output to the terminal:

```sh
yarn run jasmine:ci
```

With output viewable in a browser at <http://localhost:8888/>:

```sh
yarn run jasmine:browser
```

You need to restart the `jasmine:browser` test server for it to pick up any changes to JavaScript code.

### Use the gem

- [Install and use this gem](docs/install-and-use.md)
- [Use a component in your application](docs/use-components.md)
- [Test a branch of the gem](docs/test-a-branch-of-the-gem.md)

### Manage the gem

- [Publish/release a new version of the gem](docs/publishing-to-rubygems.md)
- [Keep this gem in sync with the Design System](docs/upgrade-govuk-frontend.md)
- [Move a component from an application to the gem](docs/moving-components-upstream-into-this-gem.md)

### Make a new component

- [Generate a new component](docs/generate-a-new-component.md)
- [Component conventions](docs/component_conventions.md)
- [Component principles](docs/component_principles.md)

### Further documentation

- [Test a component](docs/testing-components.md)
- [Component auditing](docs/auditing.md)
- [Code documentation on rubydoc.info](http://www.rubydoc.info/gems/govuk_publishing_components)
- [Our analytics approach](docs/analytics-ga4/analytics.md)

There is more documentation in the [docs directory](docs/).

## Licence

[MIT Licence](LICENCE.md)
