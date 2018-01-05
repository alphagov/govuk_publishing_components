# Moving components upstream into this gem

Normally you want to build components as close to their point of use, but at some point you will want to share a component between applications.

Try not to move components into this gem 'just in case', only do so when there is a real need.

## Example of moving components into this gem from an applications
We originally added some form components into [`government-frontend`](https://github.com/alphagov/government-frontend) which needed to be used in [`email-alert-frontend`](https://github.com/alphagov/email-alert-frontend).

This meant we moved these components into this gem.


The applications copy of assets will take precedence over the gems'.
This means you can bump an application and it'll continue to use the applications version until they're migrated.

You can see how this worked happened with the following PRs.

Generally the steps are as follows:

1. [Move the component into the gem (update the namespace from `app` to `gem`)](https://github.com/alphagov/govuk_publishing_components/pull/116)
2. [Release a new version of the gem](https://github.com/alphagov/govuk_publishing_components/pull/130)
3. [Update the application with this new version](https://github.com/alphagov/government-frontend/pull/670)
4. [Remove old source files for the component (this could and step 3. could be done in one PR)](https://github.com/alphagov/government-frontend/pull/671)
  - Update any integration tests so that their namespace is `gem` instead of `app`
