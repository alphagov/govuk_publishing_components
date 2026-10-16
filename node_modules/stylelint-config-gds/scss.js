'use strict'

module.exports = {
  // Applies GDS specific overrides for CSS then SCSS to the
  // stylelint-config-standard-scss community rules
  extends: ['stylelint-config-standard-scss', './css-rules', './scss-rules']
}
