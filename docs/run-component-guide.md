## Running the component guide as a standalone app

If you want to work on this gem directly, without having to add it to another
application, you can run it on your local machine or using [govuk-docker](https://github.com/alphagov/govuk-docker). You'll need [Ruby](https://www.ruby-lang.org/en/downloads/) and [Node.js](https://nodejs.org/en/) installed to get this project running.

### Running the component guide on your local machine
```
cd ~/govuk/govuk_publishing_components
./startup.sh
```

The app should start on [http://localhost:3212/component-guide/](http://localhost:3212/component-guide/).

### Running the component guide in [govuk-docker](https://github.com/alphagov/govuk-docker)

```
cd ~/govuk/govuk-docker
make govuk_publishing_components

cd ~/govuk/govuk_publishing_components
govuk-docker up govuk_publishing_components-app
```

Then visit [http://govuk-publishing-components.dev.gov.uk/component-guide/](http://govuk-publishing-components.dev.gov.uk/component-guide/).
