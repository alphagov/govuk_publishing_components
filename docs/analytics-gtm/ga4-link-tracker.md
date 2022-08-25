# Google Analytics link tracker

A module for tracking link clicks on GOV.UK.

When initialised, the JS adds an event listener to the `<body>` of the page with the following listeners:

- A `click` listener (for left clicks, control clicks, and "Meta key" clicks - "Meta key" clicks are command + clicks or windows key + clicks.)
- A `mousedown` listener (for middle clicks.)
- A `contextmenu` listener (for right clicks / context menu keypresses.)

When one of these listeners are fired, they check if the `event.target` is an `<a>` tag with a `href`. If so, it will then check if the link is:

- A `generic download` - This is either a href to `assets.publishing.service.gov.uk` or a href on the `www.gov.uk` domain pointing to the `/government/uploads/` path.
- A `preview` link - This is either a href to `assets.publishing.service.gov.uk` or a href on the `www.gov.uk` domain pointing to the `/government/uploads/` path which has `/preview` in the URL after the file path.
- A `mailto` link - This is an email href that starts with `mailto:`.
- An `generic link`  - This is a href that is not on the `www.gov.uk` domain.
    - To calculate this, it checks if the href starts with `http://www.gov.uk/`, `https://www.gov.uk/`, `//www.gov.uk/`, `www.gov.uk/`, `http://gov.uk/`, `https://gov.uk/`, `//gov.uk`, or `gov.uk/` (NB: `gov.uk/` and `www./` are technically relative links as a href must contain a `/` or http method at the start to be treated as non-relative).
    - It also checks if a `href` starts with `/` and does not start with `//` to determine if it's a relative link like `/bank-holidays` , but not a protocol relative link such as `//google.com`.
    - If the `href` does not meet both of these criteria, then it is considered an external link.

Events can either have an `event_name` of `navigation` or `file_download`. Download and preview links will use the `file_download` value, while generic external links and mailto links will use `navigation`.

## Basic use

`<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/742746/A_quick_guide_to_govt_healthy_eating_update.pdf">A Quick Guide to the Government’s Healthy Eating Recommendations</a>`

In the example above, on a left click of the link, the following would be pushed to the dataLayer, using the `eventSchema` found in `ga4-schemas.js`:

```
{
    "event": "event_data",
    "event_data": {
        "event_name": "file_download",
        "type": "generic download",
        "url": "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/742746/A_quick_guide_to_govt_healthy_eating_update.pdf",
        "text": "A Quick Guide to the Government’s Healthy Eating Recommendations",
        "index": null,
        "index_total": null,
        "section": null,
        "action": null,
        "external": "false",
        "link_method": "primary click"
    }
}
```

External links would turn `external` to `true` and `type` to `generic link`.

Mailto links would turn `external` to `true` and `type` to `email`

For `link_method`:

- Left clicks are a `primary click`
- Right clicks and context menu keypresses are `secondary click`
- Middle mouse button clicks are `middle click`
- Meta key clicks are `command/win click`
- Control clicks are `ctrl click`