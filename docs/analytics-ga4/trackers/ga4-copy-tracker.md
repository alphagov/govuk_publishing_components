# Google Analytics 4 copy tracker

This script creates an event when text is copied from a GOV.UK page. When initialised, it adds an event listener to the page for the `copy` event. An event will be fired if the following are true:

- some text has been selected
- the selected text is not inside an INPUT or TEXTAREA
- the selected text is not within a parent node that has `data-ga4-no-copy` set

The second check is based around concerns over PII. Text copied from the body of a GOV.UK page should not include PII, but text inside a text input is written by users, and therefore could contain PII. Note that if text is selected spanning multiple elements including a text input, the browser automatically does not include the text from inputs.

When a 'valid' copy event occurs, the following is sent to the dataLayer.

```JSON
{
  "event": "event_data",
  "event_data": {
    "event_name": "copy",
    "type": "copy",
    "action": "copy",
    "method": "browser copy",
    "text": "Some copied text",
    "length": 245
  }
}
```

The `text` attribute contains the first 30 characters of the copied text, with PII removed.

The `length` attribute shows the original number of characters that were copied.