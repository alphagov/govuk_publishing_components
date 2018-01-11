# Moving components from an application into this gem

Normally you want to build components as close to their point of use, but at some point you will want to share a component between applications.

Try not to move components into this gem 'just in case', only do so when there is a real need.

## Example

We originally added some form components into [`government-frontend`](https://github.com/alphagov/government-frontend) which needed to be used in [`email-alert-frontend`](https://github.com/alphagov/email-alert-frontend).

This meant we moved these components into this gem. You can see how this worked happened with the following PRs. Generally the steps are as follows:

1. [Move the component into the gem (update the namespace from `app` to `gem`)](https://github.com/alphagov/govuk_publishing_components/pull/138). Component tests in the gem use rspec, these made need to be updated if the app a component is ported from uses minitest or another test framework.
2. [Release a new version of the gem](https://github.com/alphagov/govuk_publishing_components/pull/140)
3. [Update the application with this version and delete old app component files](https://github.com/alphagov/government-frontend/pull/684)
