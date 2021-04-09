## JavaScript Modules

GOV.UK Publishing Components inherits a module pattern that makes it easy to write re-usable modular components, without having to worry about where and when the module should be instantiated.

### Usage

Javascript modules can be specified in markup using `data-` attributes:

```html
<div data-module="some-module">
  <strong>Some other markup inside the module</strong>
</div>
```

Modules can be found and started by including `govuk/modules.js` and running:

```javascript
$(document).ready(function(){
  GOVUK.modules.start()
});
```

This will attempt to find and start all modules in the page. For the example above it will look for a module at `GOVUK.Modules.SomeModule`. Note the value of the data attribute has been converted to _PascalCase_.

The module will be instantiated and then its `start` method called. The HTML element with the `data-module` attribute is passed as the first argument to the module. This limits modules to acting only within their containing elements.

```javascript
module = new GOVUK.Modules[type]()
module.start(element)
```

Running `GOVUK.modules.start()` multiple times will have no additional affect for most modules. When a module is started a flag is set on the element using the data attribute `module-started`. `data-module-started` is a reserved attribute. It can however be called with an element as the first argument, to allow modules to be started in dynamically loaded content:

```javascript
var $container = $('.dynamic-content')
GOVUK.modules.start($container)
```

### Modules and cookie consent

Some modules might rely on cookie consent being granted before doing anything. If a user consents to cookies on a page with such a module, that module should be started without the user having to reload the page.

Modules that check for cookie consent in their `start` method can be loaded in this way by setting the `data-module-started` attribute in their template to `delay`. When cookies are accepted, the cookie banner calls `GOVUK.modules.start()`, which will start delayed modules a second time. The flow for this process looks like this:

** Without cookie consent **

- page loads, `GOVUK.modules.start()` is called normally
- delayed modules are started, find that cookie consent has not been given, and do nothing
- user consents to cookies
- the cookie banner calls `GOVUK.modules.start()` for a second time
- all existing normal modules on the page are not started, because they have `data-module-started` set to `true`
- delayed modules are started a second time, find that cookie consent has been given, and execute

** With cookie consent **

- page loads, `GOVUK.modules.start()` is called normally
- delayed modules are started, find that cookie consent has been given, and execute as normal

### Module structure

A module must add its constructor to `GOVUK.Modules` and it must have a `start` method.
The simplest module looks like:

```javascript
(function(Modules) {
  'use strict'

  function SomeModule () {}
  SomeModule.prototype.start = function($element) {
    // module code
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
SomeModule.prototype.start = function($element) {
  $element.on('click', '.js-toggle', toggle)
  $element.on('click', '.js-cancel', cancel)
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

Modules should have their own tests, whether they’re being included with the GOV.UK Publishing Components or are app specific.
