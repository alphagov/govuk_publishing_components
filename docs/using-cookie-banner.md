# Using the cookie banner within a government service

The cookie banner and cookie functions in this gem can be used for cookie consent mechanisms on other government services.

To use these, you will need to [install the `govuk_publishing_components` gem](/docs/install-and-use.md) in your application.


To include the cookie banner component in your layout:

```erb
<%= render "govuk_publishing_components/components/cookie_banner" %>
```

> Note: this will use the default cookie banner text and also assumes you have a cookie settings page at /help/cookies. See the [component documentation](https://components.publishing.service.gov.uk/component-guide/cookie_banner) for details on how to change this.

The cookie consent mechanism is bundled in with the cookie banner. It sets a `cookies_policy` cookie containing a user's cookie preferences. It is your responsibility to add checks to your application to ensure this consent cookie is checked each time you set any cookies. A quick way to do this is by setting all cookies using our helper methods, for example:

```javascript
window.GOVUK.setCookie('cookie_name', 'cookie-value')
```

This gem includes a default list of all cookies we explicitly allow on GOV.UK. If using this in your own service, you __must__ define your own list. You can do this by adding the following Javascript to your application:

```javascript
window.GOVUK.overrideCookieCategories = function () {
    var cookieCategories = {
      'cookies_policy': 'essential',
      'cookies_preferences_set': 'essential',
      // include any other cookies specific to your service here
      // there are 4 categories these cookies can fall into: essential; settings; usage; campaign
    }
}
```
