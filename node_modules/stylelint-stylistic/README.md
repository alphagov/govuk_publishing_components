# stylelint-stylistic

![main branch quality workflow](https://github.com/elirasza/stylelint-stylistic/actions/workflows/quality.yml/badge.svg?branch=main)
![latest tag release workflow](https://github.com/elirasza/stylelint-stylistic/actions/workflows/release.yml/badge.svg?event=push)
[![NPM](https://img.shields.io/npm/v/stylelint-stylistic?color=gray&logo=npm)](https://www.npmjs.com/package/stylelint-stylistic)

Plugin for endangered stylelint stylistic rules.

As of its version 15, the popular [stylelint](https://stylelint.io/) package will slowly [deprecate and remove 76 stylistic rules](https://stylelint.io/migration-guide/to-15/).

The proposed solution was to move to other specialized formatting packages like [prettier](https://prettier.io/), but it proved to be a tedious task on large projects. Not all of them are able to shift easily and fix the potential conflicts between different linters / formatters (especially on hybrid linting environments such as CSS-in-JS).

As these endangered rules were working quite well, and alongside the stylelint recommendation, I have decided to move them to this package in order to maintain them. Only a soft migration will be need to keep them in your projects.

## 1. Getting started

### Requirements

You will need [stylelint](https://www.npmjs.com/package/stylelint) 15.0.0 or higher as a peer dependency.

### Installation

Install the package :

```bash
npm install stylelint-stylistic --save-dev
```
or
```bash
yarn add stylelint-stylistic --dev
```

### Usage

Append the plugin to your stylelint configuration plugins :

```json
{
  "plugins": [
    "stylelint-stylistic"
  ]
}
```

Or alternatively, if you wish to use the plugin default config, you can directly extend it :

```json
{
  "extends": [
    "stylelint-stylistic/config"
  ]
}
```

## 2. Rules

All rules were moved, according to `stylelint` plugin convention, to the `stylistic` scope. If you already have some of them in your configuration, juste changed any `rule` to `stylistic/rule`.

| Rule                                                                                                                                                                                                                                        | Auto-fixable | Category          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------- |
| [`stylistic/color-hex-case`](./lib/rules/color-hex-case)<br />Specify lowercase or uppercase for hex colors.                                                                                                                                | yes          | Color             |
| [`stylistic/function-comma-newline-after`](./lib/rules/function-comma-newline-after)<br />Require a newline or disallow whitespace after the commas of functions.                                                                           | yes          | Function          |
| [`stylistic/function-comma-newline-before`](./lib/rules/function-comma-newline-before)<br />Require a newline or disallow whitespace before the commas of functions.                                                                        | yes          | Function          |
| [`stylistic/function-comma-space-after`](./lib/rules/function-comma-space-after)<br />Require a single space or disallow whitespace after the commas of functions.                                                                          | yes          | Function          |
| [`stylistic/function-comma-space-before`](./lib/rules/function-comma-space-before)<br />Require a single space or disallow whitespace before the commas of functions.                                                                       | yes          | Function          |
| [`stylistic/function-max-empty-lines`](./lib/rules/function-max-empty-lines)<br />Limit the number of adjacent empty lines within functions.                                                                                                | yes          | Function          |
| [`stylistic/function-parentheses-newline-inside`](./lib/rules/function-parentheses-newline-inside)<br />Require a newline or disallow whitespace on the inside of the parentheses of functions.                                             | yes          | Function          |
| [`stylistic/function-parentheses-space-inside`](./lib/rules/function-parentheses-space-inside)<br />Require a single space or disallow whitespace on the inside of the parentheses of functions.                                            | yes          | Function          |
| [`stylistic/function-whitespace-after`](./lib/rules/function-whitespace-after)<br />Require or disallow whitespace after functions.                                                                                                         | yes          | Function          |
| [`stylistic/number-leading-zero`](./lib/rules/number-leading-zero)<br />Require or disallow a leading zero for fractional numbers less than 1.                                                                                              | yes          | Number            |
| [`stylistic/number-no-trailing-zeros`](./lib/rules/number-no-trailing-zeros)<br />Disallow trailing zeros in numbers.                                                                                                                       | yes          | Number            |
| [`stylistic/string-quotes`](./lib/rules/string-quotes)<br />Specify single or double quotes around strings.                                                                                                                                 | yes          | String            |
| [`stylistic/unit-case`](./lib/rules/unit-case)<br />Specify lowercase or uppercase for units.                                                                                                                                               | yes          | Unit              |
| [`stylistic/value-list-comma-newline-after`](./lib/rules/value-list-comma-newline-after)<br />Require a newline or disallow whitespace after the commas of value lists.                                                                     | yes          | Value list        |
| [`stylistic/value-list-comma-newline-before`](./lib/rules/value-list-comma-newline-before)<br />Require a newline or disallow whitespace before the commas of value lists.                                                                  | **no**       | Value list        |
| [`stylistic/value-list-comma-space-after`](./lib/rules/value-list-comma-space-after)<br />Require a single space or disallow whitespace after the commas of value lists.                                                                    | yes          | Value list        |
| [`stylistic/value-list-comma-space-before`](./lib/rules/value-list-comma-space-before)<br />Require a single space or disallow whitespace before the commas of value lists.                                                                 | yes          | Value list        |
| [`stylistic/value-list-max-empty-lines`](./lib/rules/value-list-max-empty-lines)<br />Limit the number of adjacent empty lines within value lists.                                                                                          | yes          | Value list        |
| [`stylistic/property-case`](./lib/rules/property-case)<br />Specify lowercase or uppercase for properties.                                                                                                                                  | yes          | Property          |
| [`stylistic/declaration-bang-space-after`](./lib/rules/declaration-bang-space-after)<br />Require a single space or disallow whitespace after the bang of declarations.                                                                     | yes          | Declaration       |
| [`stylistic/declaration-bang-space-before`](./lib/rules/declaration-bang-space-before)<br />Require a single space or disallow whitespace before the bang of declarations.                                                                  | yes          | Declaration       |
| [`stylistic/declaration-colon-newline-after`](./lib/rules/declaration-colon-newline-after)<br />Require a newline or disallow whitespace after the colon of declarations.                                                                   | yes          | Declaration       |
| [`stylistic/declaration-colon-space-after`](./lib/rules/declaration-colon-space-after)<br />Require a single space or disallow whitespace after the colon of declarations.                                                                  | yes          | Declaration       |
| [`stylistic/declaration-colon-space-before`](./lib/rules/declaration-colon-space-before)<br />Require a single space or disallow whitespace before the colon of declarations.                                                               | yes          | Declaration       |
| [`stylistic/declaration-block-semicolon-newline-after`](./lib/rules/declaration-block-semicolon-newline-after)<br />Require a newline or disallow whitespace after the semicolons of declaration blocks.                                    | yes          | Declaration block |
| [`stylistic/declaration-block-semicolon-newline-before`](./lib/rules/declaration-block-semicolon-newline-before)<br />Require a newline or disallow whitespace before the semicolons of declaration blocks.                                 | **no**       | Declaration block |
| [`stylistic/declaration-block-semicolon-space-after`](./lib/rules/declaration-block-semicolon-space-after)<br />Require a single space or disallow whitespace after the semicolons of declaration blocks.                                   | yes          | Declaration block |
| [`stylistic/declaration-block-semicolon-space-before`](./lib/rules/declaration-block-semicolon-space-before)<br />Require a single space or disallow whitespace before the semicolons of declaration blocks.                                | yes          | Declaration block |
| [`stylistic/declaration-block-trailing-semicolon`](./lib/rules/declaration-block-trailing-semicolon)<br />Require or disallow a trailing semicolon within declaration blocks.                                                               | yes          | Declaration block |
| [`stylistic/block-closing-brace-empty-line-before`](./lib/rules/block-closing-brace-empty-line-before)<br />Require or disallow an empty line before the closing brace of blocks.                                                           | yes          | Block             |
| [`stylistic/block-closing-brace-newline-after`](./lib/rules/block-closing-brace-newline-after)<br />Require a newline or disallow whitespace after the closing brace of blocks.                                                             | yes          | Block             |
| [`stylistic/block-closing-brace-newline-before`](./lib/rules/block-closing-brace-newline-before)<br />Require a newline or disallow whitespace before the closing brace of blocks.                                                          | yes          | Block             |
| [`stylistic/block-closing-brace-space-after`](./lib/rules/block-closing-brace-space-after)<br />Require a single space or disallow whitespace after the closing brace of blocks.                                                            | **no**       | Block             |
| [`stylistic/block-closing-brace-space-before`](./lib/rules/block-closing-brace-space-before)<br />Require a single space or disallow whitespace before the closing brace of blocks.                                                         | yes          | Block             |
| [`stylistic/block-opening-brace-newline-after`](./lib/rules/block-opening-brace-newline-after)<br />Require a newline after the opening brace of blocks.                                                                                    | yes          | Block             |
| [`stylistic/block-opening-brace-newline-before`](./lib/rules/block-opening-brace-newline-before)<br />Require a newline or disallow whitespace before the opening brace of blocks.                                                          | yes          | Block             |
| [`stylistic/block-opening-brace-space-after`](./lib/rules/block-opening-brace-space-after)<br />Require a single space or disallow whitespace after the opening brace of blocks.                                                            | yes          | Block             |
| [`stylistic/block-opening-brace-space-before`](./lib/rules/block-opening-brace-space-before)<br />Require a single space or disallow whitespace before the opening brace of blocks.                                                         | yes          | Block             |
| [`stylistic/selector-attribute-brackets-space-inside`](./lib/rules/selector-attribute-brackets-space-inside)<br />Require a single space or disallow whitespace on the inside of the brackets within attribute selectors.                   | yes          | Selector          |
| [`stylistic/selector-attribute-operator-space-after`](./lib/rules/selector-attribute-operator-space-after)<br />Require a single space or disallow whitespace after operators within attribute selectors.                                   | yes          | Selector          |
| [`stylistic/selector-attribute-operator-space-before`](./lib/rules/selector-attribute-operator-space-before)<br />Require a single space or disallow whitespace before operators within attribute selectors.                                | yes          | Selector          |
| [`stylistic/selector-combinator-space-after`](./lib/rules/selector-combinator-space-after)<br />Require a single space or disallow whitespace after the combinators of selectors.                                                           | yes          | Selector          |
| [`stylistic/selector-combinator-space-before`](./lib/rules/selector-combinator-space-before)<br />Require a single space or disallow whitespace before the combinators of selectors.                                                        | yes          | Selector          |
| [`stylistic/selector-descendant-combinator-no-non-space`](./lib/rules/selector-descendant-combinator-no-non-space)<br />Disallow non-space characters for descendant combinators of selectors.                                              | yes          | Selector          |
| [`stylistic/selector-max-empty-lines`](./lib/rules/selector-max-empty-lines)<br />Limit the number of adjacent empty lines within selectors.                                                                                                | yes          | Selector          |
| [`stylistic/selector-pseudo-class-case`](./lib/rules/selector-pseudo-class-case)<br />Specify lowercase or uppercase for pseudo-class selectors.                                                                                            | yes          | Selector          |
| [`stylistic/selector-pseudo-class-parentheses-space-inside`](./lib/rules/selector-pseudo-class-parentheses-space-inside)<br />Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors. | yes          | Selector          |
| [`stylistic/selector-pseudo-element-case`](./lib/rules/selector-pseudo-element-case)<br />Specify lowercase or uppercase for pseudo-element selectors.                                                                                      | yes          | Selector          |
| [`stylistic/selector-list-comma-newline-after`](./lib/rules/selector-list-comma-newline-after)<br />Require a newline or disallow whitespace after the commas of selector lists.                                                            | yes          | Selector list     |
| [`stylistic/selector-list-comma-newline-before`](./lib/rules/selector-list-comma-newline-before)<br />Require a newline or disallow whitespace before the commas of selector lists.                                                         | yes          | Selector list     |
| [`stylistic/selector-list-comma-space-after`](./lib/rules/selector-list-comma-space-after)<br />Require a single space or disallow whitespace after the commas of selector lists.                                                           | yes          | Selector list     |
| [`stylistic/selector-list-comma-space-before`](./lib/rules/selector-list-comma-space-before)<br />Require a single space or disallow whitespace before the commas of selector lists.                                                        | yes          | Selector list     |
| [`stylistic/media-feature-colon-space-after`](./lib/rules/media-feature-colon-space-after)<br />Require a single space or disallow whitespace after the colon in media features.                                                            | yes          | Media feature     |
| [`stylistic/media-feature-colon-space-before`](./lib/rules/media-feature-colon-space-before)<br />Require a single space or disallow whitespace before the colon in media features.                                                         | yes          | Media feature     |
| [`stylistic/media-feature-name-case`](./lib/rules/media-feature-name-case)<br />Specify lowercase or uppercase for media feature names.                                                                                                     | yes          | Media feature     |
| [`stylistic/media-feature-parentheses-space-inside`](./lib/rules/media-feature-parentheses-space-inside)<br />Require a single space or disallow whitespace on the inside of the parentheses within media features.                         | yes          | Media feature     |
| [`stylistic/media-feature-range-operator-space-after`](./lib/rules/media-feature-range-operator-space-after)<br />Require a single space or disallow whitespace after the range operator in media features.                                 | yes          | Media feature     |
| [`stylistic/media-feature-range-operator-space-before`](./lib/rules/media-feature-range-operator-space-before)<br />Require a single space or disallow whitespace before the range operator in media features.                              | yes          | Media feature     |
| [`stylistic/media-query-list-comma-newline-after`](./lib/rules/media-query-list-comma-newline-after)<br />Require a newline or disallow whitespace after the commas of media query lists.                                                   | yes          | Media query list  |
| [`stylistic/media-query-list-comma-newline-before`](./lib/rules/media-query-list-comma-newline-before)<br />Require a newline or disallow whitespace before the commas of media query lists.                                                | **no**       | Media query list  |
| [`stylistic/media-query-list-comma-space-after`](./lib/rules/media-query-list-comma-space-after)<br />Require a single space or disallow whitespace after the commas of media query lists.                                                  | yes          | Media query list  |
| [`stylistic/media-query-list-comma-space-before`](./lib/rules/media-query-list-comma-space-before)<br />Require a single space or disallow whitespace before the commas of media query lists.                                               | yes          | Media query list  |
| [`stylistic/at-rule-name-case`](./lib/rules/at-rule-name-case)<br />Specify lowercase or uppercase for at-rules names.                                                                                                                      | yes          | At-rule           |
| [`stylistic/at-rule-name-newline-after`](./lib/rules/at-rule-name-newline-after)<br />Require a newline after at-rule names.                                                                                                                | **no**       | At-rule           |
| [`stylistic/at-rule-name-space-after`](./lib/rules/at-rule-name-space-after)<br />Require a single space after at-rule names.                                                                                                               | yes          | At-rule           |
| [`stylistic/at-rule-semicolon-newline-after`](./lib/rules/at-rule-semicolon-newline-after)<br />Require a newline after the semicolon of at-rules.                                                                                          | yes          | At-rule           |
| [`stylistic/at-rule-semicolon-space-before`](./lib/rules/at-rule-semicolon-space-before)<br />Require a single space or disallow whitespace before the semicolons of at-rules.                                                              | **no**       | At-rule           |
| [`stylistic/indentation`](./lib/rules/indentation)<br />Specify indentation.                                                                                                                                                                | yes          | General / Sheet   |
| [`stylistic/linebreaks`](./lib/rules/linebreaks)<br />Specify unix or windows linebreaks.                                                                                                                                                   | yes          | General / Sheet   |
| [`stylistic/max-empty-lines`](./lib/rules/max-empty-lines)<br />Limit the number of adjacent empty lines.                                                                                                                                   | yes          | General / Sheet   |
| [`stylistic/max-line-length`](./lib/rules/max-line-length)<br />Limit the length of a line.                                                                                                                                                 | **no**       | General / Sheet   |
| [`stylistic/no-empty-first-line`](./lib/rules/no-empty-first-line)<br />Disallow empty first lines.                                                                                                                                         | yes          | General / Sheet   |
| [`stylistic/no-eol-whitespace`](./lib/rules/no-eol-whitespace)<br />Disallow end-of-line whitespace.                                                                                                                                        | yes          | General / Sheet   |
| [`stylistic/no-extra-semicolons`](./lib/rules/no-extra-semicolons)<br />Disallow extra semicolons.                                                                                                                                          | yes          | General / Sheet   |
| [`stylistic/no-missing-end-of-source-newline`](./lib/rules/no-missing-end-of-source-newline)<br />Disallow missing end-of-source newlines.                                                                                                  | yes          | General / Sheet   |
| [`stylistic/unicode-bom`](./lib/rules/unicode-bom)<br />Require or disallow Unicode BOM.                                                                                                                                                    | **no**       | General / Sheet   |

## 3. Contribution

All contributions are welcome, I will read all pull requests. For now, my focus will be to move all the rules to TS modules, and try to improve them.

The project uses [yarn](https://www.npmjs.com/package/yarn) as a package manager. Once installed, clone the repository, and install the dependencies :

```bash
yarn reinstall
```

You will then be able to compile the library :

```bash
yarn build
```

Some examples are available in the `examples` folder as a playground zone.