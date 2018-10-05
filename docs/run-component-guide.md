## Running the gem as a standalone app

If you want to work on this gem directly, without having to add it to another
application, you can run it in the development vm or on your local machine with:

```
./startup.sh
```

The app should start on http://localhost:3212 or http://publishing-components.dev.gov.uk/component-guide on GOV.UK development machines.


#### Running with bowl on the VM

```
$ cd /var/govuk/govuk_publishing_components
$ bundle
$ npm install

$ cd /var/govuk/govuk-puppet/development-vm
$ bowl publishing-components
```

Then visit [publishing-components.dev.gov.uk/component-guide](http://publishing-components.dev.gov.uk/component-guide).
