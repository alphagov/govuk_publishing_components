# Google Analytics 4 auto tracker

This script is intended for adding GA4 tracking to any page where something must be recorded outside of a normal page view and without user interaction. The script is triggered when the page loads. It depends upon the main GA4 analytics code to function.

## Basic use

```html
<div
  data-module="ga4-auto-tracker"
  data-ga4-auto='{ "event_name": "event name", "type": "a type", "section": "a section", "action": "an action", "tool_name": "a tool name" }'>
</div>
```

This module was created to record events within smart answers such as a question input error and reaching a results page, but can be used elsewhere with different attributes.
