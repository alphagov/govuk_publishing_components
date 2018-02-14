## Running the gem as a standalone app

If you want to work on this gem directly, without having to add it to another
application, you can run it in the development vm:

```
./startup.sh
```

The app should start on http://localhost:3212 or http://publishing-components.dev.gov.uk/component-guide on GOV.UK development machines.

```
./startup.sh --live
```

This will run the app and point it at the production `static` instance.

#### Running with bowl on the VM

```
$ cd /var/govuk/govuk_publishing_components
$ bundle

$ cd /var/govuk/govuk-puppet/development-vm
$ bowl publishing-components
```

Then visit [publishing-components.dev.gov.uk/component-guide](http://publishing-components.dev.gov.uk/component-guide).

#### Running locally

If you don't want to run it in the development vm, you can start the app with:

```
$ cd /var/govuk/govuk_publishing_components
$ bundle

$ PLEK_SERVICE_STATIC_URI=assets.publishing.service.gov.uk bundle exec foreman start
```

Then visit [localhost:5000/component-guide](http://localhost:5000/component-guide).
