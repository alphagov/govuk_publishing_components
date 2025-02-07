# Real User Metrics

Real user metrics (RUM) allow a user's browser to report on how a page loaded using the [Performance API]. The tool that we use to do this is called [LUX] - short for Live User Experience - and is run by SpeedCurve.

The benefit of RUM is that it shows how pages are performing in real situations, rather than on synthetic tests. This means that we don't have to guess at what conditions might be - RUM provides insight into what conditions actually are.

## Loading

The LUX scripts should only be loaded when a user has opted into usage tracking. This is done using the `rum-loader` script, which checks if the `usage` cookie is `true` and then loads the required scripts. This is already part of the [Public Layout component].

## How it works

The scripts for the real user metrics are loaded from our servers - this allows us to know what is contained within the scripts and reduce the risk of unwelcome things being added to GOV.UK. Normally LUX is loaded from SpeedCurve's servers, so our setup is unusual.

### The scripts

There are three scripts involved.

- [the loader](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/rum-loader.js) is a script that we wrote. If cookies have been accepted, it [finds the LUX script](https://github.com/alphagov/govuk_publishing_components/commit/0edd70614589d5fbd2a619483d3a63272714b384#diff-68c3e9ad18ca1324acd992819b248cd5b0e3e336f923a972b98ab09e8a06bd9dR58), attaches it to the DOM and executes it. If cookies haven't been accepted, it sets a listener for the `cookie-consent` event.
- [the measurer](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/vendor/lux/lux-measurer.js) measures performance from the start of page load, but doesn't report anything. This file shouldn't ever change. The source is from the RUM dashboard, in Settings, Edit RUM, at the end. We don't use this in the way SpeedCurve recommends, because we load the scripts ourselves.
- [the reporter](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/vendor/lux/lux-reporter.js) is the script that the loader pulls down and attaches to the DOM. This file is [compiled as a separate asset](https://github.com/alphagov/govuk_publishing_components/blob/0a70273097ab4cc4abb9b81726c3fc84db880091/app/assets/config/govuk_publishing_components_manifest.js#L12-L13) and isn't included until users consent to cookies.

The reporter is the file that SpeedCurve occasionally changes (in SpeedCurve's repo it's called `lux.js`). Because we load our own modified copy of this script we currently have to manually download and update it. The script is audited before being updated and then two extra lines are added to make sure it works correctly. These two lines set the customer ID and set the sampling rate.

### Customer ID

The customer ID is an identifier for the site using LUX, not for the user visiting the site. It won't change from page to page, or from visitor to visitor.

When loading `lux.js` from SpeedCurve's CDN, the customer ID is appended to the end of the URI as a query string. The script looks for a script in the DOM with a source of `lux.js`, and from that extracts the customer ID.

Rails adds a fingerprint to the URI which means that `lux.js` becomes (for example) `lux.self-7137780d5344a93190a2c698cd660619d4197420b9b1ef963b639a825a6aa5ff.js` and the script can't find itself. Because of this that part of the script would fail. Instead, we modify the `getCustomerId()` function to simply return `LUX.customerid`.

Because of this the customer ID needs to be set in the `lux.js` file:

```javascript
LUX.customerid = 47044334
```

### Sending information

LUX needs the [content security policy in `govuk_app_config`][csp-govuk-app-config] to be configured to allow communication to LUX servers. [Documentation](https://support.speedcurve.com/docs/add-rum-to-your-csp) is provided on how to configure this.

### Sample rate

LUX defaults to sending every event to SpeedCurve - this can be changed by setting `LUX.samplerate` to a integer:

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

## How to update to a new version

### Being notified

2nd line have an icinga alert set up to tell us when a new version of LUX is available. This checks the [live LUX script](https://cdn.speedcurve.com/js/lux.js?id=47044334) for a variable called `SCRIPT_VERSION`. Since the file is minified it is actually looking for the pattern `V=[version_number]`, where `version_number` is currently `302`. If it does not match this, an alert is triggered.

The [icinga alert was originally added in this PR](https://github.com/alphagov/govuk-puppet/pull/11339), for reference.

### Getting the new code

You will need to download the new script from [the SpeedCurve github repo](https://github.com/SpeedCurve-Metrics/lux.js). It's worth turning on notifications for this repo in case the icinga alert fails.

The script is written in TypeScript so you will first need to `npm install` and `npm run build` to create a JavaScript version of the file (see repo README for details).

### Updating

To update `lux-reporter.js`, you'll need to clone [the lux.js source code](https://github.com/SpeedCurve-Metrics/lux.js) to your local machine. Run `npm install` and `npm run build` in that repo to create a `dist/lux.js` file.

You can also build the version of `lux.js` that's currently on GOV.UK by using the source code on their [releases page](https://github.com/SpeedCurve-Metrics/lux.js/releases/). You can then use this to run a diff check of our version against the new version. If the changes are small enough, you could decide to just manually copy and paste the changed lines to our `lux-reporter.js` file as a simple way to update LUX.

If the changes between versions are large enough, you can copy and paste all the code in the new version of `lux.js` into our `lux-reporter.js`. You will then need to update the code to include the variables mentioned below. Try to format the file as well, so that indenting differences don't make reviewing difficult.

Instructions for how to update are in our copy of the file. In summary:

- `LUX.customerid` and `LUX.samplerate` are the things we need to set (copy them from the current version)
- `LUX.customerid` has to be inside the `LUX = (function () {` declaration
- update the `getCustomerId` function to simply return the customerid, see [this PR for related information](https://github.com/alphagov/govuk_publishing_components/pull/3592)
- Preserve the comments we have written - there's one at the top of our file, and one next to the `LUX = (function () {` declaration

### Testing

You can test the changes locally to ensure the file has been updated correctly.

- temporarily set the `debug` option in the reporter to `true` for testing purposes
- load a local application pointed at your local components gem, and accept cookies
- paste this command into the browser console: `copy(window.LUX.getDebug())` (it'll say `undefined` but the output will be in your copy/paste buffer)
- visit the [SpeedCurve debugging tool](https://speedcurve-metrics.github.io/lux.js/debug-parser.html) and paste the output into it, and check the output for errors

If you're using docker to run the application, your local server will have a `dev.gov.uk` domain name and it is possible to set up SpeedCurve to see the data from it. You will need to uncomment the `forceSample` line to make this work.

## Protocol measuring

We've added an extra bit to the end of the measurer script to [determine what protocol is in use](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/vendor/lux/lux-measurer.js#L161-L196) - HTTP 1, 2 or 3. This shouldn't need any updating as the measurer shouldn't change.

[Performance API]: https://developer.mozilla.org/en-US/docs/Web/API/Performance_API

[LUX]: https://speedcurve.com/features/lux/

[Public Layout component]: https://components.publishing.service.gov.uk/component-guide/layout_for_public

[csp-govuk-app-config]: https://github.com/alphagov/govuk_app_config/blob/87e445eccee5fba2449a170d5ba628e8a380fcb8/lib/govuk_app_config/govuk_content_security_policy.rb#L36-L38
