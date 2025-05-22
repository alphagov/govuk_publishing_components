# Single Consent client

The Single Consent client is a small Javascript which can be embedded in a
website to enable easily sharing a user's consent or rejection of cookies across
different websites.

See the [Single Consent service README](../README.md).

## Quick start

See the [CommonJS example](https://github.com/alphagov/consent-api/blob/main/client/examples/commonJS-usage/index.js).

Contact data-tools-team@digital.cabinet-office.gov.uk to get the URL of the API endpoint.

The library provides the following static methods for finding out which types of
cookies a user has consented to.

- `hasConsentedToEssential`
- `hasConsentedToUsage`
- `hasConsentedToCampaigns`
- `hasConsentedToSetting`

The method `GovSingleConsent.getConsents()` provides the current state of the
user's consents to all types of cookies.

### 1. Install with npm

In order to set first-party cookies, the client Javascript must be served with
your application.

We recommend installing the Single Consent client using
[node package manager (npm)](https://www.npmjs.com/).

```sh
npm i govuk-single-consent
```

https://www.npmjs.com/package/govuk-single-consent

### 2. Including the Javascript client

The javascript client can be included in different ways. Choose one below.

#### CommonJS

See the [example](https://github.com/alphagov/consent-api/blob/main/client/examples/commonJS-usage/index.js).

#### Typescript

See the [example](https://github.com/alphagov/consent-api/blob/main/client/examples/typescript-usage/index.ts).

#### HTML script tag (IIFE)

The javascript client makes available the object `window.GovSingleConsent` for
interacting with the API. It needs to be loaded on any page that could be an
entry point to your web application, that allows modifying cookie consent, or
provides a link to another domain with which you want to share cookie consent
status. It is probably easiest to add the script to a base template used for all
pages.

On the same pages, you need to load your javascript for interacting with the
`window.GovSingleConsent` object.

See the following examples.

- [Cookie banner script](https://github.com/alphagov/consent-api/blob/main/client/example/cookie-banner.js)
- [Cooke page script](https://github.com/alphagov/consent-api/blob/main/client/example/cookies-page.js)

It is common practice to add Javascript tags just before the end `</body>` tag,
eg:

```html
    ...

    <script src="{path_to_client_js}/singleconsent.js"></script>
    <script src="{path_to_cookie_banner_script}.js"></script>
    <script src="{path_to_cookies_page_script}.js"></script>
  </body>
</html>
```

### 3. Passing the base URL to the constructor

You can either pass an environment string, or a custom base URL.

If using an environment string, its value should be either `staging` or `production`.

e.g

```javascript
const dummyCallback = () => {}

// With an environemnt string to the staging environment
new GovSingleConsent(dummyCallback, 'staging')

// With an environemnt string to the production environment
new GovSingleConsent(dummyCallback, 'production')

// With a custom base URL
new GovSingleConsent(dummyCallback, 'http://some-development-url.com')
```

### 4. Share the user's consent to cookies via the API

When the user interacts with your cookie banner or cookie settings page to
consent to or reject cookies you can update the central database by invoking the
following function:

```typescript
exampleCookieConsentStatusObject: Consents = {
  essential: true,
  settings: false,
  usage: true,
  campaigns: false,
}

singleConsentObject.setConsents(exampleCookieConsentStatusObject)
```

## Content Security Policy

If your website is served with a
[`Content-Security-Policy` HTTP header or `<meta>` element](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), you
may need to modify it to allow the client to access the Single Consent service.
The value of the header or meta element should contain the following:

```
connect-src 'self' https://consent-api-nw.a.run.app/api/v1/consent [... other site URLs separated by spaces];
```

## What the library does

The library manages all read/write operations with a cookie that stores the
state of a user's consent.

### Callback

Websites using the Consent API must provide a callback function. This will be
invoked each time the consent has been updated. It will be called with three
parameters:

- `consents` An object describing the new consent state.
- `consentsPreferencesSet` Boolean, the cookie banner must be displayed if this
  value is `false`.
- `error` An object describing any error, otherwise `null`. If there is an
  error, then the `consents` object will say that the consents have been
  revoked.

The structure of the consent data object is currently based on the
[GOV.UK `cookies_policy` cookie](https://www.gov.uk/help/cookies). If your
website cookies do not fall into any of the four categories listed, please
contact us.

## Getting updates

To be notified when there's a new release, you can watch the
[consent-api Github repository](https://github.com/alphagov/consent-api).
