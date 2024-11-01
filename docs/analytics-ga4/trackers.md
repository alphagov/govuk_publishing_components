# Trackers

For tracking different kinds of data on GOV.UK we have built several different trackers. Each type of tracking is handled by a separate script, but some code is shared between them as they often do similar things.

Most of the trackers work by adding a `data-module` attribute to an element along with additional data attributes to provide specific tracking information. Some components have this already built into their code by default. These components should also include a `disable_ga4` option as a failsafe.

## Auto tracker

The [auto tracker](trackers/ga4-auto-tracker.md) is used to cause an event to occur as soon as a page has finished loading (but after a page view). This is used to track significant moments in journeys, such as the successful completion of a smart answer, or an error.

## Copy tracker

The [copy tracker](trackers/ga4-copy-tracker.md) fires an event when text is copied from a page.

## Ecommerce tracker

The [ecommerce tracker](trackers/ga4-ecommerce-tracker.md) is used to track things like search results within a finder.

## Event tracker

The [event tracker](trackers/ga4-event-tracker.md) handles tracking on buttons or other interactive elements, such as tabs and details elements.

## Focus loss tracker

The [focus loss tracker](trackers/ga4-focus-loss-tracker.md) is designed to capture data about an element when it loses focus.

## Form tracker

The [form tracker](trackers/ga4-form-tracker.md) is designed to capture data about a form when it has been submitted.

## Link tracker

There are several types of link tracking. To distinguish them and simplify the code, we define them as follows.

- the [link tracker](trackers/ga4-link-tracker.md) handles link clicks with data attributes added to specific links, or to parent elements of groups of links
- the [specialist link tracker](trackers/ga4-specialist-link-tracker.md) automatically tracks clicks on 'special' links, such as external links, download links and mailto links

## Print intent tracker

The [print intent tracker](trackers/ga4-print-intent-tracker.md) tracks if the page has been requested to be printed.

## Scroll tracker

The [scroll tracker](trackers/ga4-scroll-tracker.md) tracks how much of a page has been viewed.

## Search tracker

The [search tracker](trackers/ga4-search-tracker.md) tracks user interaction with site search boxes in the header, on the homepage, and on the "all content" finder.

## Smart answer results tracker

The [smart answer results tracker](trackers/ga4-smart-answer-results-tracker.md) has been built specifically to track the Cost of Living smart answer.

## Video tracker

The [video tracker](trackers/ga4-video-tracker.md) tracks video views.
