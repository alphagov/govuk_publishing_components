# 2. Google Analytics 4 tracking and code location

Date: 2022-05-09

## Status

Accepted

## Context
Glossary of terms/acronyms

- GA - Google Analytics
- UA - Universal analytics, sometimes referred to as GA3, the version of GA we are upgrading from
- GA4 - the new version of UA that we are upgrading to
- GTM - Google Tag Manager

GOV.UK currently uses UA for analytics. However, UA is due to be retired next year. We will have to upgrade to GA4. We are taking this opportunity to do a full overhaul of our existing analytics. This will involve rethinking how our analytics works, bringing consistency into the way we do it, and introducing GTM.

## Decision
We will put the new code for GA4/GTM analytics into govuk_publishing_components:

- other options were static or a new gem
- static was rejected because ultimately [we’re trying to retire static](https://github.com/alphagov/govuk-rfcs/blob/bc8ffe85cdf5cdf5005502cba50d5b64237f1b71/rfc-084-frontend-in-a-gem.md), although no team is actively working on this
- a new gem was considered but this would require time and effort to set up, and we’re not yet sure how the new analytics code will need to interact with the cookie consent code (also in govuk_publishing_components)

GTM tracking will be done using specific data attributes attached to elements, which contains the data to send to GA.

An alternative plan using component specific analytics was originally considered, but this would have added code to every component and involved DOM traversal to find relevant information.

GTM will be configured in a minimal way, the majority of the code will be part of GOV.UK.

## Consequences

Having the analytics code in govuk_publishing_components has an impact on deployments:

- the code is included once for all of GOV.UK via static
- changes to the analytics code will require a new version of govuk_publishing_components and a deployment of static, which combined can take at least an hour if not more

Using data attributes for tracking means that these attributes will need to be added manually wherever they are needed on GOV.UK:

- this will be a lot of work, as attributes are numerous and often implemented in complex code

The minimal configuration of GTM will mean the following:

- code will be discoverable as part of the GOV.UK codebase
- scripts will not be added to GTM, which could have slowed down the site for users or introduce security risks
- we will not be taking advantage of the full capability of GTM
- developers will still be required to make any changes to the tracking on GOV.UK
