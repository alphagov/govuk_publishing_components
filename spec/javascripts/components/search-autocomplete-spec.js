/* eslint-env jasmine */
/* global GOVUK */

describe('Search autocomplete component', function () {
  var $autocomplete
  var $container
  var $input
  var $status
  var $resultsList

  var idPostfix

  var html =
  `<div class="gem-c-search-autocomplete" data-id-postfix="test" data-source="[&quot;prime minister&quot;,&quot;deputy prime minister&quot;,&quot;contact prime minister&quot;,&quot;email prime minister&quot;,&quot;last prime minister&quot;]">
      <label for="input-1" class="gem-c-label govuk-label">Country</label>
      <input class="gem-c-input govuk-input" name="country" type="text">
  </div>`

  function startAutocomplete () {
    new GOVUK.Modules.GemSearchAutocomplete($autocomplete).init()
  }

  beforeEach(function () {
    $container = document.createElement('div')
    $container.innerHTML = html
    document.body.appendChild($container)
    $autocomplete = document.querySelector('.gem-c-search-autocomplete')

    startAutocomplete()

    jasmine.clock().install()

    idPostfix = $autocomplete.getAttribute('data-id-postfix')
    $input = $autocomplete.querySelector('input')
    $resultsList = $autocomplete.querySelector('.gem-c-search-autocomplete__result-list')
  })

  afterEach(function () {
    jasmine.clock().uninstall()
    document.body.removeChild($container)
  })

  describe('initial component state', function () {
    it('is an editable field that is focusable', async function () {
      await $input.focus()

      expect($input.getAttribute('role')).toBe('combobox')
      expect(document.activeElement).toEqual($input)
      expect($input.getAttribute('aria-autocomplete')).toBe('list')
      expect($input.getAttribute('autocomplete')).toBe('off')
      expect($input.getAttribute('aria-haspopup')).toBe('listbox')
      expect($input.getAttribute('aria-expanded')).toBe('false')
    })

    it('correct input attributes are set', async function () {
      await $input.focus()

      expect($input.getAttribute('autocapitalize')).toBe('off')
      expect($input.getAttribute('spellcheck')).toBe('false')
    })

    it('user is informed of status and instructions', async function () {
      await $input.focus()
      $status = document.querySelector('[role="status"]')

      expect($input.getAttribute('aria-expanded')).toBe('false')
      expect($status.innerHTML).toBe('No results.')

      expect($input.getAttribute('aria-describedby')).toBe(`gem-c-search-autocomplete-assistive-hint-${idPostfix}`)
      expect(document.querySelectorAll(`#gem-c-search-autocomplete-assistive-hint-${idPostfix}`).length).toBe(1)
    })

    it('input element is signposted that it owns result list', async function () {
      await $input.focus()
      var testId = $resultsList.id

      expect($input.getAttribute('aria-owns')).toBe(testId)
    })
  })
})
