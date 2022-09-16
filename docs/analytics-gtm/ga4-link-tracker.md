# Google Analytics link tracker

A module for tracking link clicks on GOV.UK.

When initialised, the JS adds an event listener to the `<body>` of the page with the following listeners:

- A `click` listener (for left clicks, control clicks, and "Meta key" clicks - "Meta key" clicks are command + clicks or windows key + clicks.)
- A `mousedown` listener (for middle clicks.)
- A `contextmenu` listener (for right clicks / context menu keypresses.)

When one of these listeners are fired, they check if the `event.target` is an `<a>` tag with a `href`. If so, it will then check if the link is:

- A `share` or `follow` link - This allows analysts to track if a page was shared, or if a user clicked on one of our social media channels, which are usually under a 'Follow us' heading. The tracking is added to the component by adding `track_as_share: true` or `track_as_follow: true` to the template import of a share links component. If one of these booleans is set to true, a `data-ga4-link` attribute is added to all the component's `<a>` tags. This `data-ga4-link` attribute houses a stringified JSON, containing the relevant data to push to GTM. The link tracker will always check for `data-ga4-link` first before checking the link matches our other link types. Therefore, this `data-ga4-link` pattern can be expanded to track other types of links, which can't be categorised by simply running checks against the href. Some keys in the JSON cannot be calculated in the template. Therefore, the value of these keys are set to `"[populated-via-js]"`. This `"[populated-via-js]"` is detected by the JS, and is subsequently overwritten in JS with the correct value.
- A `generic download` - This is either a href to `assets.publishing.service.gov.uk` or a href on the `www.gov.uk` domain pointing to the `/government/uploads/` path.
- A `preview` link - This is either a href to `assets.publishing.service.gov.uk` or a href on the `www.gov.uk` domain pointing to the `/government/uploads/` path which has `/preview` in the URL after the file path.
- A `mailto` link - This is an email href that starts with `mailto:`.
- An `generic link`  - This is a href that is not on the internal domains. Internal domains include the current hostname, and any domains passed through to the `init({internalDomains: []})` array.
    - To calculate this, it checks the start of the href. If we were to use `www.gov.uk` as an example, it would check if the href starts with:
        - `http://www.gov.uk/`,
        - `https://www.gov.uk/`,
        - `//www.gov.uk/`,
        - `www.gov.uk/`,
        - (NB: `www.gov.uk/` is technically a relative link, as a href must contain a `/` or http method at the start to be treated as non-relative).
    - It also checks if a `href` starts with `/` and does not start with `//` to determine if it's a relative link like `/bank-holidays` , but not a protocol relative link such as `//google.com`.
    - If the `href` does not meet the above criteria, then it is considered an external link.

Events can either have an `event_name` of `navigation`, `file_download`, or `share`. Download and preview links will use the `file_download` value, while generic external links, mailto links, and follow links will use `navigation`. Share links use `share`.

## Basic use

```JavaScript
//= require ./analytics-ga4/ga4-link-tracker

window.GOVUK.analyticsGA4.linkTracker.init()
```

Passing a config object with arrays to `init()` is optional, but passing each array enables extra functionality:
- Passing an `internalDomains` array allows you to class domains which aren't the current hostname as internal domains. For example, if you were adding tracking and your hostname was `helpforhouseholds.campaign.gov.uk`, `www.gov.uk` links would be classed as external links, unless you add `www.gov.uk` to this array. The link tracker will automatically add the domain with `www.` removed as well (`gov.uk` in this case,) as sometimes `www.` is omitted from `href` values.
- Passing an `internalDownloadPaths` array allows you to specify paths which should be classified as paths to a downloads route in your internal domains. If the path exists in an internal `href`, it will be treated as a download link.
- Passing a `dedicatedDownloadDomains` array allows you to specify domains which will always be classed as a download link. For example, `dropbox.com` could be added to always track dropbox links as download links.
- Passing `disableListeners: true` prevents click listeners from being added to the page on initilisation. This is useful if you'd like use the link detection features elsewhere without adding extra click listeners to the DOM.

```JavaScript
//= require ./analytics-ga4/ga4-link-tracker

window.GOVUK.analyticsGA4.linkTracker.init({
    internalDomains: ['www.gov.uk'],
    internalDownloadPaths: ['/government/uploads/', '/downloads/'],
    dedicatedDownloadDomains: ['assets.publishing.service.gov.uk', 'dropbox.com'],
    disableListeners: // true/false
})

```

`<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/742746/A_quick_guide_to_govt_healthy_eating_update.pdf">A Quick Guide to the Government’s Healthy Eating Recommendations</a>`

In the example above, on a left click of the link, the following would be pushed to the dataLayer, using the `eventSchema` found in `ga4-schemas.js`:

```JSON
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
        "external": "true",
        "link_method": "primary click"
    }
}
```

Preview links would turn `type` to `preview`.

External links would turn `event_name` to `navigation` and `type` to `generic link`.

Mailto links would turn turn `event_name` to `navigation` and `type` to `email`.

Share links would turn `event_name` to `share` and type to `share this page`.

Follow links would turn `event_name` to `navigation` and type to `follow us`

For `link_method`:

- Left clicks are a `primary click`
- Right clicks and context menu keypresses are `secondary click`
- Middle mouse button clicks are `middle click`
- Meta key clicks are `command/win click`
- Shift key clicks are `shift click`
- Control clicks are `ctrl click`
