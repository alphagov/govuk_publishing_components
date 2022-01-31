# Keep this gem in sync with the Design System

GOV.UK Publishing Components uses [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend), the frontend library built and maintained by the [GOV.UK Design System team](https://design-system.service.gov.uk/), to ensure consistency in styles and components with other services across the government.

This gem consumes [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) via [Yarn](https://classic.yarnpkg.com/).  [Dependabot](https://github.com/marketplace/dependabot-preview) will let us know when [a new version of `govuk-frontend` is available](https://github.com/alphagov/govuk_publishing_components/pulls?q=is%3Apr+is%3Aopen+label%3Adependencies+bump+govuk-frontend). There are a few checks to be done before merging in a 'Bump `govuk-frontend`' pull request.

## 1. Read the release notes

GOV.UK Frontend has well-documented [release notes](https://github.com/alphagov/govuk-frontend/releases/) that, depending on the release type, might contain the following sections:
 - Breaking changes (major release)
 - New features (minor release)
 - Fixes (patch release)

## 2. Assess changes

### Breaking changes (major release)

Check if and how the breaking changes affect this gem and GOV.UK applications dependent on this gem. For each breaking change follow the migration steps in the release notes and push the changes in a separate commit on the same Dependabot branch. Make sure to test GOV.UK applications with this branch. On major releases is always a good idea to involve someone from [the GOV.UK Design System team](https://github.com/orgs/alphagov/teams/team-gov-uk-design-system/members) in the review process as they have a thorough understanding of the changes.

### New features (minor release)

Check if and how the new feature changes affect this repository. If a new feature is added to a component, check the markup of the component associated with the feature mirrors the one in `govuk-frontend`. We usually benefit from the JavaScript and SCSS updates without requiring any changes, however make sure these are being imported in the component as expected. If a feature was pushed upstream from this gem to the GOV.UK Design System make sure to update the code to use the feature from upstream and remove the unused code in this gem. We decided that we will not bring features into `govuk_publishing_components` unless there is a user need for this (for example it improves the accessibility of a component) or it makes the code more robust (for example it provides better browser support).

### Fixes (patch release)

Check if the fixes require markup changes and, if so, adjust it to mirror the one in `govuk-frontend`. If a fix is in the JavaScript and/or SCSS we will benefit from this without requiring further changes.

## 3. Update CHANGELOG

Add a final commit with a [CHANGELOG](/CHANGELOG.md) entry mirroring the pull request name (for example "Bump govuk-frontend from 3.8.1 to 3.9.1"). This helps us keep track of such updates and debug potential issues.

## Notes

If the pull request required any code changes ask a colleague for a review, otherwise you can approve it and merge it yourself.

Note that the `govuk-frontend` release type does not dictate the `govuk_publishing_components` release type the latter being based on the required changes imposed by the former.

## Examples

See an [example pull request](https://github.com/alphagov/govuk_publishing_components/pull/1705) for upgrading to a new minor version of `govuk-frontend`.

See an [example pull request](https://github.com/alphagov/govuk_publishing_components/pull/1010) for upgrading to a new major version of `govuk-frontend`.
