# GDS Stylelint Config

This provides a [Stylelint](https://stylelint.io/) configuration for linting
SCSS and CSS files as per the conventions of the [Government Digital Service
(GDS)](https://www.gov.uk/government/organisations/government-digital-service).

It builds upon [stylelint-config-standard][] with conventions GDS have adopted
over the years.

[stylelint-config-standard]: https://github.com/stylelint/stylelint-config-standard

## Project goals

This project was developed with a number of goals in mind, these should be
considered whenever proposals are made to add to or amend the rules.

1. Lean on community standards over defining our own rules as much as possible -
   it's not a good use of our time to debate preferences so let's follow [common
   community guidelines][stylelint-config-standard] unless we have a compelling
   reason not to do so.
1. Be consistent with [GOV.UK Design System][] patterns and conventions, most
   of the initial rules of this project were defined to maintain consistency.
1. Reflect modern CSS practices over providing compatibility for legacy
   projects, if it is unfeasible for legacy projects to adopt all these rules
   they are encouraged to disable problematic rules in their project
   configuration.
1. Support CSS and SCSS equally.
1. Be sufficiently agreeable that these rules can be used, or aspired to,
   across all GDS programmes.

[GOV.UK Design System]: https://design-system.service.gov.uk/

## Usage

These rules are expected to be mostly used for SCSS projects (as these are more
common at GDS) however the CSS rules can be used alone.

To add this to your project, install Stylelint and this module:

```bash
npm install --save-dev stylelint stylelint-config-gds
```

You then need to [configure](https://stylelint.io/user-guide/configure)
Stylelint.

To lint SCSS you can add the following property to your package.json:

```json
"stylelint": {
  "extends": "stylelint-config-gds/scss"
}
```

To lint CSS add the following:

```json
"stylelint": {
  "extends": "stylelint-config-gds/css"
}
```

You should then be able to run a lint with
`node_modules/.bin/stylelint '**/*.(s)?css'`.

## Development

Make changes to rules that affect both CSS and SCSS in `./css-rules.js`, for
rules that only apply to SCSS add them to `./scss-rules.js`.

You can lint the JS and run tests with `npm test`

## Releasing

GitHub Actions is used to release new versions of this module when a PR
is merged into the main branch and there is a new version number.

To create a new release you should amend `package.json` to have the new
version number (based on [semvar](https://semver.org/)) and run `npm install`
to update `package-lock.json`. You should then update the
[CHANGELOG.md](./CHANGELOG.md). Finally, open a PR - once this is merged
the change will be released.

## Licence

[MIT License](LICENCE)
