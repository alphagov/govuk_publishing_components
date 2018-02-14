# GOV.UK Publishing Components

A gem to 1) document components in GOV.UK frontend applications and 2) provide shared components to applications.

Components should be added to this gem if they are required in more than one application, otherwise they should be added to that application.

![Screenshot of component guide](docs/screenshot.png)

## How to

- [Install and use this gem](/docs/install-and-use.md)
- [Use a component in your application](/docs/use-components.md)
- [Generate a new component](/docs/generate-a-new-component.md)
- [Develop a component](/docs/develop-component.md)
- [Run the component guide](/docs/run-component-guide.md)
- [Move a component from an application to the gem](/docs/moving-components-upstream-into-this-gem.md)

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
