# Publishing to RubyGems

Before publishing a new version [check the open and approved pull requests](https://github.com/alphagov/govuk_publishing_components/pulls?q=is%3Apr+is%3Aopen+review%3Aapproved) and reach out to the authors to see if you can get their work published in the same release.

1. Checkout **master** and pull latest changes.

2. Create and checkout a new branch (`release-[version-number]`).
  The version number is determined by looking at the [current "Unreleased" changes in CHANGELOG](/CHANGELOG.md) and updating the previous release number depending on the kind of entries:

  - `Breaking changes` corresponds to a `major` (1.X.X) change.
  - `New features` corresponds to a `minor` (X.1.X) change.
  - `Fixes` corresponds to a `patch` (X.X.1) change.

  For example if the previous version is `2.3.0` and there are entries for `Breaking changes` then the new release should be `3.0.0`.

  See [Semantic Versioning](https://semver.org/) for more information.

3. Update [`CHANGELOG.md`](/CHANGELOG.md) "Unreleased" heading with the new version number and [review the latest commits](https://github.com/alphagov/govuk_publishing_components/commits/master) to make sure the latest changes are correctly reflected in the [CHANGELOG]((/CHANGELOG.md)).

4. Update [`lib/govuk_publishing_components/version.rb`](/lib/govuk_publishing_components/version.rb) version with the new version number.

5. Commit changes. These should include updates in the following files:
  - [`CHANGELOG.md`](/CHANGELOG.md)
  - [`lib/govuk_publishing_components/version.rb`](/lib/govuk_publishing_components/version.rb)
  - [`Gemfile.lock`](/Gemfile.lock)

6. Create a pull request and copy the changelog text for the current version in the pull request description.

7. Once the pull request is approved, merge to master. This action will trigger the CI to publish the new version to RubyGems. A [dependabot](https://github.com/dependabot) pull request will automatically be raised in frontend applications.

See an [example pull request](https://github.com/alphagov/govuk_publishing_components/pull/873/files) for publishing a new version to RubyGems.
