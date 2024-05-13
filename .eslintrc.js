module.exports = {
  extends: 'standard',
  rules: {
    'no-var': 0,
    'object-shorthand': 0
  },
  ignorePatterns: [
    'app/assets/javascripts/component_guide/vendor/**/*.js',
    'app/assets/javascripts/govuk_publishing_components/vendor/**/*.js',
    'spec/javascripts/helpers/*.js',
    'spec/javascripts/vendor/*.js'
  ],
  env: {
    browser: true
  },
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 5
  },
  globals: {
    GOVUK: 'writable'
  }
}
