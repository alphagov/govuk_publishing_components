'use strict'

// These are GDS specific overrides for CSS linting rules that are built
// to augment the community rules from stylelint-config-standard - https://github.com/stylelint/stylelint-config-standard
// or styleint-config-standard-scss - https://github.com/stylelint-scss/stylelint-config-standard-scss.
// There should be no SCSS rules applied here
module.exports = {
  rules: {
    // GDS predominantly uses a conventional to specify opacity values with
    // decimals
    // https://stylelint.io/user-guide/rules/alpha-value-notation/
    'alpha-value-notation': 'number',
    // This rule is disabled because our house style has a lot of at-rules
    // via SCSS where new lines are used indiscriminately for readability.
    // https://stylelint.io/user-guide/rules/at-rule-empty-line-before/
    'at-rule-empty-line-before': null,
    // This rule expects autoprefixer to be used but we don't consistently use
    // that tool across GDS products.
    // https://stylelint.io/user-guide/rules/at-rule-no-vendor-prefix/
    'at-rule-no-vendor-prefix': null,
    // Require commas to separate numbers in colour functions, this is
    // required for Internet Explorer support which doesn't understand the
    // modern syntax.
    // https://stylelint.io/user-guide/rules/color-function-notation/
    'color-function-notation': 'legacy',
    // Disallow using CSS named colours
    // https://stylelint.io/user-guide/rules/color-named/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L149
    'color-named': 'never',
    // Require 6 character hex definitions when 3 would work
    // https://stylelint.io/user-guide/rules/color-hex-length/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/master/docs/contributing/coding-standards/css.md#colours-defined-as-variables-should-be-in-lowercase-and-in-full-length
    'color-hex-length': 'long',
    // Requires that if all longhand properties are used then shorthand must be
    // used (i.e. if all margin-top, margin-right, margin-bottom, margin-left
    // are used you must use margin).
    // https://stylelint.io/user-guide/rules/declaration-block-no-redundant-longhand-properties/
    // This is disabled due to concerns that
    // it produces less readable code (see: https://github.com/alphagov/govuk-frontend/pull/2567)
    'declaration-block-no-redundant-longhand-properties': null,
    // Require all rules to be multiline
    // https://stylelint.io/user-guide/rules/declaration-block-single-line-max-declarations/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L32
    'declaration-block-single-line-max-declarations': 0,
    // It's common for us to break up groups of CSS with an empty line
    // https://stylelint.io/user-guide/rules/declaration-empty-line-before/
    'declaration-empty-line-before': null,
    // Disallow !important within declarations
    // https://stylelint.io/user-guide/rules/declaration-no-important/
    'declaration-no-important': true,
    // Properties and values that are disallowed
    // https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/
    'declaration-property-value-disallowed-list': {
      // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L222
      '/transition/': ['/all/']
    },
    // Disallow scheme relative URLs such as //www.gov.uk
    // https://stylelint.io/user-guide/rules/function-url-no-scheme-relative?
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L230
    'function-url-no-scheme-relative': true,
    // Always require quotes in url function calls
    // https://stylelint.io/user-guide/rules/function-url-quotes/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L430
    'function-url-quotes': 'always',
    // Disallow absolute URLs with scheme other than data, assets should be local
    // https://stylelint.io/user-guide/rules/function-url-scheme-allowed-list/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L230
    'function-url-scheme-allowed-list': ['data'],
    // Traditionally GDS linters haven't had line length rules, which means
    // this would be inconsistent with JS linting and have a lot of churn
    // to apply
    // https://stylelint.io/user-guide/rules/max-line-length/
    'max-line-length': null,
    // Disallow deep nesting, ideally only exceptions (such as .js-enabled) should
    // have nesting
    // https://stylelint.io/user-guide/rules/max-nesting-depth/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L136
    'max-nesting-depth': [
      2, {
        ignore: ['blockless-at-rules', 'pseudo-classes']
      }
    ],
    // This rule expects autoprefixer to be used but we don't consistently use
    // that tool across GDS products.
    // https://stylelint.io/user-guide/rules/media-feature-name-no-vendor-prefix/
    'media-feature-name-no-vendor-prefix': null,
    // Require media query feature ranges to use prefix notation, this is
    // required for Internet Explorer support which doesn't understand the
    // modern syntax.
    // https://stylelint.io/user-guide/rules/media-feature-range-notation/
    'media-feature-range-notation': 'prefix',
    // This rules attempts to prevent defining defining rules with a more
    // specific selector than a previous one, where they may override. This
    // is disables as it conflicts with our common usage of nesting rules
    // within a BEM modifier where a selector may be more or less specific
    // than a previous rule.
    // https://stylelint.io/user-guide/rules/no-descending-specificity/
    'no-descending-specificity': null,
    // This rule expects autoprefixer to be used but we don't consistently use
    // that tool across GDS products.
    // https://stylelint.io/user-guide/rules/property-no-vendor-prefix/
    'property-no-vendor-prefix': null,
    // Require all class selectors to be in a hyphenated BEM format
    // https://stylelint.io/user-guide/rules/selector-class-pattern/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L39
    'selector-class-pattern': [
      // a loose interpretation on hyphenated BEM in order to allow BEM
      // style and govuk-! overrides
      /^[a-z]([a-z0-9-_!])*$/, {
        resolveNestedSelectors: true,
        message: 'Class names may only contain [a-z0-9-_!] characters and ' +
          'must start with [a-z]'
      }
    ],
    // Require any allowed id selectors to be in a hyphenated lowercase form
    // https://stylelint.io/user-guide/rules/selector-id-pattern/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L107
    'selector-id-pattern': [
      /^[a-z]([a-z0-9-])*$/, {
        resolveNestedSelectors: true,
        message: 'Ids may only contain [a-z0-9-] characters and ' +
          'must start with [a-z]'
      }
    ],
    // Disallow all ids in selectors
    // https://stylelint.io/user-guide/rules/selector-max-id/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L186
    'selector-max-id': 0,
    // Disallows qualifying a selector based on the element
    // https://stylelint.io/user-guide/rules/selector-no-qualifying-type/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L206
    'selector-no-qualifying-type': [
      true, {
        // allowed for input[type=button] and similar
        ignore: ['attribute']
      }
    ],
    // This rule expects autoprefixer to be used but we don't consistently use
    // that tool across GDS products.
    // https://stylelint.io/user-guide/rules/selector-no-vendor-prefix/
    'selector-no-vendor-prefix': null,
    // Disallow complex `:not()` notation (CSS Selectors Level 4) for backwards
    // compatibility in older browsers
    // https://stylelint.io/user-guide/rules/selector-not-notation/
    'selector-not-notation': 'simple',
    // Disallow redundant properties in rules (for example: margin: 1px 1px 1px;)
    // https://stylelint.io/user-guide/rules/shorthand-property-no-redundant-values/
    // Originates from: https://github.com/alphagov/govuk-frontend/blob/e248b4027102b2684f592a0501630075bdfa1fab/config/.sass-lint.yml#L436
    'shorthand-property-no-redundant-values': true,
    // This rule expects autoprefixer to be used but we don't consistently use
    // that tool across GDS products.
    // https://stylelint.io/user-guide/rules/value-no-vendor-prefix/
    'value-no-vendor-prefix': null
  }
}
