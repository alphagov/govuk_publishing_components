# GOV.UK Publishing Components

[![status](https://badgen.net/github/status/alphagov/govuk_publishing_components/master)](https://ci.integration.publishing.service.gov.uk/job/govuk_publishing_components/job/master/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Stylelint Style Guide](https://img.shields.io/badge/code_style-stylelint-brightgreen.svg)](https://github.com/alphagov/stylelint-config-gds/)

A Ruby gem to document and distribute components for GOV.UK applications. It provides:

- a shared library of components
- helpers to generate component payloads
- an application to preview components and provide guidance

Components should be added to this gem if they are required in more than one application, otherwise they should be added to that application.

## How to

- [Install and use this gem](docs/install-and-use.md)
- [Use a component in your application](docs/use-components.md)
- [Generate a new component](docs/generate-a-new-component.md)
- [Develop a component](docs/develop-component.md)
- [Move a component from an application to the gem](docs/moving-components-upstream-into-this-gem.md)
- [Publish/release a new version of the gem](docs/publishing-to-rubygems.md)
- [Keep this gem in sync with the Design System](docs/upgrade-govuk-frontend.md)

## Architecture / structure

![](https://docs.google.com/drawings/d/e/2PACX-1vRj6JM7cQvngDl3Gr_U9G4xga2gsU7Z-d2qHHQcsBdjsW4WaC9_eQdryBJIS69cLkrY7S0fK9BcrPSF/pub?w=960&amp;h=720)

[Source](https://docs.google.com/drawings/d/1N8-kbyCN_xOvvshN6d2HnQz5i5Bqed2WIatI3Nj9gNQ/edit)

There are 2 types of helper classes in this app:

- [AppHelpers](lib/govuk_publishing_components/app_helpers). Are exposed to the applications using this gem. They should be documented using RDoc.
- [Component Presenters](lib/govuk_publishing_components/presenters). Anything in these classes is only for use within the components. They should be marked `@private`.

## Relationship with GOV.UK Design System

GOV.UK Publishing Components also makes [GOV.UK Design System](https://design-system.service.gov.uk/) styles and components available to GOV.UK's frontend applications. This gem consumes [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) via [Yarn](https://classic.yarnpkg.com/).

## Browser and assistive technology support

GOV.UK Publishing Components shares the same standards in terms of browser and assistive technology support with [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend#browser-and-assistive-technology-support).

## Documentation

[See the rubydoc.info documentation](http://www.rubydoc.info/gems/govuk_publishing_components)

## Technical documentation

You can use the [GOV.UK Docker environment](https://github.com/alphagov/govuk-docker) or the local `startup.sh` script to run the app. Read the [guidance on local frontend development](https://docs.publishing.service.gov.uk/manual/local-frontend-development.html) to find out more about each approach, before you get started.

If you are using GOV.UK Docker, remember to combine it with the commands that follow. See the [GOV.UK Docker usage instructions](https://github.com/alphagov/govuk-docker#usage) for examples.

### Running tests

The default rake task runs all the linting and test tasks:

```sh
bin/rake
```
Javascript is tested using Jasmine and the [Jasmine gem](https://github.com/pivotal/jasmine-gem). Tests can be run either in the browser or on the command line via the dummy app’s tasks:

```sh
# browser
bin/rake app:jasmine

# command line
bin/rake app:jasmine:ci
```

### View documentation

Preview documentation in your browser with:

```sh
bundle exec yard server --reload
```

## Licence

[MIT Licence](LICENCE.md)
