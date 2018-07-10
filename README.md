# GOV.UK Publishing Components

This gem:

- Provides shared components for applications
- Provides helpers to generate component payloads
- Provides an application to preview components

Components should be added to this gem if they are required in more than one application, otherwise they should be added to that application.

![Screenshot of component guide](docs/screenshot.png)

## How to

- [Install and use this gem](/docs/install-and-use.md)
- [Use a component in your application](/docs/use-components.md)
- [Generate a new component](/docs/generate-a-new-component.md)
- [Develop a component](/docs/develop-component.md)
- [Run the component guide](/docs/run-component-guide.md)
- [Move a component from an application to the gem](/docs/moving-components-upstream-into-this-gem.md)

## Architecture / structure

![](https://docs.google.com/drawings/d/e/2PACX-1vRj6JM7cQvngDl3Gr_U9G4xga2gsU7Z-d2qHHQcsBdjsW4WaC9_eQdryBJIS69cLkrY7S0fK9BcrPSF/pub?w=960&amp;h=720)

[Source](https://docs.google.com/drawings/d/1N8-kbyCN_xOvvshN6d2HnQz5i5Bqed2WIatI3Nj9gNQ/edit)

There are 2 types of helper classes in this app:

- [AppHelpers](lib/govuk_publishing_components/app_helpers). Are exposed to the applications using this gem. They should be documented using RDoc.
- [Component Presenters](lib/govuk_publishing_components/presenters). Anything in these classes is only for use within the components. They should be marked `@private`.

## GOV.UK Frontend

This gem is the way GOV.UK consumes [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend), part of the GOV.UK Design System.

We use NPM to pull in the GOV.UK Frontend styles and Javascript, but we don't commit
the `node_modules` directory. To install GOV.UK Frontend on your machine, run:

```
npm install
```

You'll need to have installed Node and NPM for this.

## Documentation

[See the rubydoc.info documentation](http://www.rubydoc.info/gems/govuk_publishing_components)

Run the documentation locally with:

```
bundle exec yard server --reload
```

## Running tests

The default rake task runs all tests:

```
bundle exec rake
```

Javascript is tested using Jasmine and the [Jasmine gem](https://github.com/pivotal/jasmine-gem). Tests can be run either in the browser or on the command line via the dummy app’s tasks:

```sh
# browser
bundle exec rake app:jasmine

# command line
bundle exec rake app:jasmine:ci
```

## Licence

[MIT Licence](LICENCE.md)
