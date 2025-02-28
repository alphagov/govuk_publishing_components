'use strict'

// These are GDS specific overrides for SCSS linting rules that are built
// styleint-config-standard-scss - https://github.com/stylelint-scss/stylelint-config-standard-scss
// These are expected to complement the rules in ./css-rules.js and only contain
// rules that are solely for SCSS (whether scss specific rules or general CSS
// ones that apply to CSS syntax)
module.exports = {
  rules: {
    // Allow Sass flags like !default and !global
    // https://stylelint.io/user-guide/rules/annotation-no-unknown/
    'annotation-no-unknown': [
      true, {
        ignoreAnnotations: [
          'default',
          'global',

          // Allow conditional !important
          // if($important, !important, null)
          'important'
        ]
      }
    ],
    // Disallow @debug
    // https://stylelint.io/user-guide/rules/at-rule-disallowed-list/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L166
    'at-rule-disallowed-list': ['debug'],
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/at-function-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L88
    'scss/at-function-pattern': [
      /^_?([a-z0-9-])*$/, {
        message: 'Function names may only contain [a-z0-9-] characters and ' +
          'may start with an underscore'
      }
    ],
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/at-mixin-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L125
    'scss/at-mixin-pattern': [
      /^_?([a-z0-9-])*$/, {
        message: 'Mixin names may only contain [a-z0-9-] characters and ' +
          'may start with an underscore'
      }
    ],
    // Disabled because this disallows separate paragraphs in comments (as
    // SCSS style comments are used for all comments)
    // https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/comment-no-empty/README.md
    'scss/comment-no-empty': null,
    // Disable CSS style comments in SCSS
    // https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/comment-no-loud
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L162
    'scss/comment-no-loud': true,
    // Disables require having consistent empty line usage before dollar variables,
    // GDS SCSS tends to group dollar variables and uses empty lines to
    // separate the groups
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/dollar-variable-empty-line-before
    'scss/dollar-variable-empty-line-before': null,
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/dollar-variable-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L507
    'scss/dollar-variable-pattern': [
      /^_?([a-z0-9-])*$/, {
        message: 'Variable names may only contain [a-z0-9-] characters and ' +
          'may start with an underscore'
      }
    ],
    // Disabled due to it being common to use an empty line before comments for
    // grouping, but no empty line when inside a block
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/double-slash-comment-empty-line-before
    'scss/double-slash-comment-empty-line-before': null,
    // This is a best practice that can only be embraced on dart-sass and many
    // GDS projects are still using node-sass
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/no-global-function-names
    'scss/no-global-function-names': null,
    // This rule catches string concantenation and would disable the SCSS
    // approach to splitting a long string across multiple lines
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/operator-no-newline-after
    'scss/operator-no-newline-after': null,
    // This rule catches string concantenation and would disable the SCSS
    // approach to splitting a long string across multiple lines
    // https://github.com/stylelint-scss/stylelint-scss/tree/master/src/rules/operator-no-newline-before
    'scss/operator-no-newline-before': null,
    // https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/percent-placeholder-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L246
    'scss/percent-placeholder-pattern': [
      /^[a-z0-9-]*$/, {
        message: 'Placeholders may only contain [a-z0-9-] characters'
      }
    ],
    // Disable @import needing to be first declarations
    // @import has a different usage in SCSS to CSS and may be scoped or follow SCSS conditionals
    // https://stylelint.io/user-guide/rules/no-invalid-position-at-import-rule/
    'no-invalid-position-at-import-rule': null
  }
}
