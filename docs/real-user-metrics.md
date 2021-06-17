# Real User Metrics

Real user metrics allow a user's browser to report on how a page loaded using the [Performance API]. The tool that we use to do this is called [LUX] - short for Live User Experience - and is run by Speedcurve.

The benefit of RUM is that it shows how pages are performing in real situations, rather than on synthetic tests. This means that we don't have to guess at what conditions might be - RUM provides insight into what conditions actually are.

## Loading

The LUX scripts should only be loaded when a user has opted into usage tracking. This is done using the `rum-loader` script, which checks if the `usage` cookie is `true` and then loads the required scripts. This is already part of the [Public Layout component].

## Custom changes when updating LUX

The scripts for the real user metrics are loaded from our servers - this allows us to know what is contained within the scripts and reduce the risk of unwelcome things being added to GOV.UK.

Because of this, the scripts are audited before being updated and then two extra lines are added to make sure it works correctly. These two lines set the customer ID and turn on beacon mode.

### Customer ID

The customer ID is an identifier for the site using LUX, not for the user visiting the site. It won't change from page to page, or from visitor to visitor.

When loading `lux.js` from Speedcurve's CDN, the customer ID is appended to the end of the URI as a query string. The script looks for a script in the DOM with a source of `lux.js`, and from that extracts the customer ID.

Rails adds a fingerprint to the URI which means that `lux.js` becomes (for example) `lux.self-7137780d5344a93190a2c698cd660619d4197420b9b1ef963b639a825a6aa5ff.js` and the script can't find itself.

Because of this the customer ID needs to be set at the end of the `lux.js` file:

```javascript
LUX.customerid = 47044334
```

### Beacon mode

LUX has two methods of sending information which involves loading a file from a remote server. The default is to fetch a JavaScript file; and the other method is to load an image.

The [content security policy in `govuk_app_config`][csp-govuk-app-config] allows only images to be loaded from `lux.speedcurve.com`. When this CSP is enforced it will mean that the JavaScript method will be blocked and LUX will stop working.

Setting the beacon mode to `"simple"` turns the non-default image method on:

```javascript
LUX.beaconMode = 'simple'
```

### Sample rate

LUX defaults to sending every event to Speedcurve - this can be changed by setting `LUX.samplerate` to a integer:

```javascript
LUX.samplerate = 1 // Whole number from 1 to 100.
```

This then only sends 1% of visits.

**This must be set at the top of the main `LUX` function or it will default to 100% sample rate.**

### Debugging (bonus mode)

```javascript
LUX.debug = true
```
Debug is turned off by default - setting this to `true` it will log what LUX is doing in the browser's console.

Usefully, running `LUX.getDebug()` in the browser's console will show the history of what's happened whether `debug` is `true` or `false`:

```javascript
LUX.getDebug()
```

Sampling can also be forced by placing `LUX.forceSample()` at the end of the file:

```javascript
LUX.forceSample()
```

[Performance API]: https://developer.mozilla.org/en-US/docs/Web/API/Performance_API

[LUX]: https://speedcurve.com/features/lux/

[Public Layout component]: https://components.publishing.service.gov.uk/component-guide/layout_for_public

[csp-govuk-app-config]: https://github.com/alphagov/govuk_app_config/blob/87e445eccee5fba2449a170d5ba628e8a380fcb8/lib/govuk_app_config/govuk_content_security_policy.rb#L36-L38
