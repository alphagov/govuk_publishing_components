## Trigger Event

The trigger event script provides a cross browser compatible way of triggering a JavaScript event on a DOM element, such as a click or submit.

### Usage

Basic usage:

```javascript
window.GOVUK.triggerEvent(element, eventType)
```
Where `element` must be a valid DOM node and `eventType` must be a valid event type e.g. `'click'` or `'submit'`.

With parameters:

```javascript
var element = document.querySelector('.my-element')
window.GOVUK.triggerEvent(element, 'click', { detail: { test: true } })
```

With a keyCode:

```javascript
window.GOVUK.triggerEvent(element, 'keyup', { keyCode: 13 })
```

Prevent the event from bubbling up the DOM:

```javascript
window.GOVUK.triggerEvent(element, 'click', { bubbles: false })
```

Prevent the event from being cancelled:

```javascript
window.GOVUK.triggerEvent(element, 'keypress', { cancelable: false })
```
