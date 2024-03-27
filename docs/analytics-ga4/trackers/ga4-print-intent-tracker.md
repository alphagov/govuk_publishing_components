# Google Analytics 4 print intent tracker

This script tracks when the user opens the print prompt in their browser, e.g. when pressing Ctrl/Cmd + P or going to File > Print.

## How it works

Assuming that consent has been given, the print intent tracker is launched automatically by `init-ga4.js`, as there is a function in that file which automatically runs the `init()` function on anything namespaced under `window.GOVUK.analyticsGa4.analyticsModules`.

When initialised, a `beforeprint` event listener is added to the JavaScript `window`. If the `beforeprint` event is fired, the following dataLayer object is sent to GA4:

```JSON
{
  "event": "event_data",
  "event_data": {
    "event_name": "print_intent",
    "type": "print intent",
    "method": "browser print"
  }
}
```
