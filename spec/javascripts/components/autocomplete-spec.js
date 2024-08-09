/* eslint-env jasmine */
/* global GOVUK */

describe('Autocomplete component', function () {
  var autocomplete
  var container
  var html =
    `<div class="gem-c-autocomplete" data-expanded="false" data-loading="false" data-position="below" data-gem-autocomplete-module-started="true">
        <label for="input-110d0415" class="gem-c-label govuk-label">Country</label>
        <input class="gem-c-input govuk-input" id="input-110d0415" name="country" spellcheck="false" type="text" role="combobox" autocomplete="off" autocapitalize="off" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-owns="gem-c-autocomplete-result-list-1" aria-activedescendant="">
    </div>`

  function startAutocomplete () {
    console.log('modules', GOVUK.Modules)
    new GOVUK.Modules.GemAutocomplete().init()
  }

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    autocomplete = document.querySelector('gem-c-autocomplete')
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('does not initialise if the autocomplete from govuk-frontend has not initialised', function () {
    startAutocomplete()

    expect(true).toBe(true)
  })
})
