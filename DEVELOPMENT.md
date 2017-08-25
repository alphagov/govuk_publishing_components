### Running tests

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
