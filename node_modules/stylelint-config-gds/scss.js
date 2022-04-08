'use strict'

module.exports = {
  plugins: ['stylelint-scss'],
  extends: './css',
  rules: {
    // Disallow @debug
    // https://stylelint.io/user-guide/rules/at-rule-disallowed-list
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L166
    'at-rule-disallowed-list': ['debug'],
    // This is disabled for SCSS as it prevents SCSS specific @ rules (such as @if)
    // https://stylelint.io/user-guide/rules/at-rule-no-unknown
    'at-rule-no-unknown': null,
    // Require a new line after a @else { } statement
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-else-closing-brace-newline-after
    'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
    // Require a space after an @else {} before the next @else rule
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-else-closing-brace-space-after
    'scss/at-else-closing-brace-space-after': 'always-intermediate',
    // Disallow empty lines before an @else statement
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-else-empty-line-before
    'scss/at-else-empty-line-before': 'never',
    // Only allow @extend with a placeholder
    // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-extend-no-missing-placeholder
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L242
    'scss/at-extend-no-missing-placeholder': true,
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-function-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L88
    'scss/at-function-pattern': [
      /^_?([a-z0-9-])*$/, {
        message: 'Function names may only contain [a-z0-9-] characters and ' +
          'may start with an underscore'
      }
    ],
    // Require a new line character at the termination of a group of @if / @else
    // definitions
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-if-closing-brace-newline-after
    'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
    // Require a space between an @if {} ending and an @else beginning
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-if-closing-brace-space-after
    'scss/at-if-closing-brace-space-after': 'always-intermediate',
    // Disallow importing partials with a underscore prefix
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-import-no-partial-leading-underscore
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L46
    'scss/at-import-no-partial-leading-underscore': true,
    // Disallow importing partials with a underscore prefix
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-import-partial-extension
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L45
    'scss/at-import-partial-extension': 'never',
    // Disallow parenthesis when including a mixin with no parameters
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-mixin-argumentless-call-parentheses
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L48
    'scss/at-mixin-argumentless-call-parentheses': 'never',
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-mixin-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L125
    'scss/at-mixin-pattern': [
      /^_?([a-z0-9-])*$/, {
        message: 'Mixin names may only contain [a-z0-9-] characters and ' +
          'may start with an underscore'
      }
    ],
    // This lints that only @ rules known to SCSS are allowed
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/at-rule-no-unknown
    'scss/at-rule-no-unknown': true,
    // Disable CSS style comments in SCSS
    // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/comment-no-loud
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L162
    'scss/comment-no-loud': true,
    // https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/dollar-variable-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L507
    'scss/dollar-variable-pattern': [
      /^_?([a-z0-9-])*$/, {
        message: 'Variable names may only contain [a-z0-9-] characters and ' +
          'may start with an underscore'
      }
    ],
    // Require spaces around operators
    // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/operator-no-unspaced
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L467
    'scss/operator-no-unspaced': true,
    // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/percent-placeholder-pattern
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L246
    'scss/percent-placeholder-pattern': [
      /^[a-z0-9-]*$/, {
        message: 'Placeholders may only contain [a-z0-9-] characters'
      }
    ]
  }
}
