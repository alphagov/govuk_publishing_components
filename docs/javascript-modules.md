## JavaScript Modules

GOV.UK Publishing Components inherits a module pattern that makes it easy to write re-usable modular components, without having to worry about where and when the module should be instantiated.

### Usage

JavaScript modules can be specified in markup using `data-` attributes:

```html
<div data-module="some-module">
  <strong>Some other markup inside the module</strong>
</div>
```

Modules are found and started in [dependencies.js](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/dependencies.js) by including `./modules.js` and running the following. This should only be called once for all applications on GOV.UK.

```javascript
document.addEventListener('DOMContentLoaded', function () {
  GOVUK.modules.start()
})
```

This will attempt to find and start all modules in the page. For the example above it will look for a module at `GOVUK.Modules.SomeModule`. Note the value of the data attribute has been converted to _PascalCase_.

The module will be instantiated and then its `init` method called. The HTML element with the `data-module` attribute is passed as the first argument to the module. This limits modules to acting only within their containing elements.

This function name is not a reserved word, but was used to differentiate between modules that accept a jQuery object (`start`) and modules that accept a JS HTML node (`init`). We are removing jQuery from GOV.UK and eventually all modules will use an `init` method.

```javascript
module = new GOVUK.Modules.SomeModule(element)
module.init()
```

Running `GOVUK.modules.start()` multiple times will have no additional affect. When a module is started a flag is set on the element using the data attribute `module-started`. `data-module-started` is a reserved attribute. It can however be called with an element as the first argument, to allow modules to be started in dynamically loaded content:

```javascript
var $container = document.querySelector('.dynamic-content')
GOVUK.modules.start($container)
```

### Modules and cookie consent

Some modules might need cookie consent before doing anything. If a user consents to cookies on a page with such a module, that module should be started without the user having to reload the page.

This can be achieved by structuring a module to listen for the `cookie-consent` event. This event is fired by the cookie banner when the user consents to cookies.

```javascript
AnExampleModule.prototype.init = function ($module) {
  this.$module = $module
  var consentCookie = window.GOVUK.getConsentCookie()

  if (consentCookie?.usage === true || consentCookie?.aggregate === true) {
    this.startModule()
  }
}
```

This functionality runs like this:

- page loads, `GOVUK.modules.start()` is called normally and modules requiring cookie consent check for cookie consent
- if cookies have been consented, the module calls the rest of its code and carries on as normal
- if cookies have not been consented, the listener is created and calls the rest of the module when the `cookie-consent` event is fired by the cookie banner

### Module structure

A module must add its constructor to `GOVUK.Modules` and it must have an `init` method. The simplest module looks like:

```javascript
(function(Modules) {
  'use strict'

  function SomeModule ($element) {
    // variables and attributes
  }
  SomeModule.prototype.init = function() {
    // function calls and event bindings
  }
  Modules.SomeModule = SomeModule
})(window.GOVUK.Modules)
```

### Writing modules

Whilst this isn’t prescriptive, it helps if modules look and behave in a similar manner.

#### Use `js-` prefixed classes for interaction hooks

Make it clear where a javascript module will be applying behaviour:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">Toggle</a>
  <div class="js-toggle-target">Target</div>
</div>
```

#### Declare event listeners at the start

Beginning with a set of event listeners clearly indicates the module’s intentions.

```js
SomeModule.prototype.init = function () {
  this.$module.addEventListener('focus', this.handleFocus.bind(this))
  this.$module.addEventListener('click', this.handleClick.bind(this))
}
```

Where possible, assign listeners to the module element to minimise the number of listeners and to allow for flexible markup:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">This toggles</a>
  <div class="js-toggle-target">
    <p>Some content</p>
    <a href="/" class="js-toggle">This also toggles</a>
  </div>
</div>
```

#### Use data-attributes for configuration

Keep modules flexible by moving configuration to data attributes on the module’s element:

```html
<div
  data-module="html-stream"
  data-url="/some/endpoint"
  data-refresh-ms="5000">
  <!-- updates with content from end point -->
</div>
```

#### Include Jasmine specs

Modules should have their own tests, whether they’re being included with the GOV.UK Publishing Components or are app specific. These tests run as part of our build process using a headless version of Chrome, which means it runs the browser without initialising the GUI.

You can run the Jasmine tests in the components gem using this command:

```sh
yarn run jasmine:ci
```

You can run the Jasmine tests in an application using this command:

```sh
bundle exec rake jasmine:ci
```

The tests can also be run in a normal Chrome window, by removing `:ci` from the end of the previous commands, and opening http://localhost:8888 in your browser. This is useful because:

- console.log() commands will be visible in the browser console for debugging purposes
- individual tests or groups of tests can be run by clicking on the name of that test or group

If you are testing JavaScript changes it is recommended that the Jasmine tests are also run in Internet Explorer 11. This can be achieved using BrowserStack.
