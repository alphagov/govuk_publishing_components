# GOV.UK Publishing Components

[![status](https://badgen.net/github/status/alphagov/govuk_publishing_components/master)](https://ci.integration.publishing.service.gov.uk/job/govuk_publishing_components/job/master/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Stylelint Style Guide](https://img.shields.io/badge/code_style-stylelint-brightgreen.svg)](https://github.com/alphagov/stylelint-config-gds/)

A Ruby gem to document and distribute components for GOV.UK applications. It provides:

- a shared library of components
- helpers to generate component payloads
- an application to preview components and provide guidance
- [GOV.UK Design System](https://design-system.service.gov.uk/) styles and components (via [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend))

Components should be added to this gem if they are required in more than one application, otherwise they should be added to that application. All components should meet the same standards of browser and assistive technology support described in [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend#browser-and-assistive-technology-support).

## How to

- [Install and use this gem](docs/install-and-use.md)
- [Use a component in your application](docs/use-components.md)
- [Generate a new component](docs/generate-a-new-component.md)
- [Develop a component](docs/develop-component.md)
- [Move a component from an application to the gem](docs/moving-components-upstream-into-this-gem.md)
- [Publish/release a new version of the gem](docs/publishing-to-rubygems.md)
- [Keep this gem in sync with the Design System](docs/upgrade-govuk-frontend.md)

## Documentation

[See the rubydoc.info documentation](http://www.rubydoc.info/gems/govuk_publishing_components)

## Technical documentation

You can use the [GOV.UK Docker environment](https://github.com/alphagov/govuk-docker) or the local `startup.sh` script to run the app. Read the [guidance on local frontend development](https://docs.publishing.service.gov.uk/manual/local-frontend-development.html) to find out more about each approach, before you get started.

If you are using GOV.UK Docker, remember to combine it with the commands that follow. See the [GOV.UK Docker usage instructions](https://github.com/alphagov/govuk-docker#usage) for examples.

### Running the test suite

```sh
# run all linting / tests
bin/rake

# run JS tests in browser
bin/rake app:jasmine

# run JS tests on command line
bin/rake app:jasmine:ci
```

### View documentation

Preview documentation in your browser with:

```sh
bundle exec yard server --reload
```

## Licence

[MIT Licence](LICENCE.md)
