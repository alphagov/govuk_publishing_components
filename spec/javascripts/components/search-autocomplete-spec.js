/* eslint-env jasmine */
/* global GOVUK, KeyboardEvent */

describe('Search autocomplete component', function () {
  var $autocomplete
  var $container
  var $input
  var $resultsList
  var $status
  var instance
  var idPostfix
  var data = [
    'prime minister',
    'deputy prime minister',
    'contact prime minister',
    'email prime minister',
    'last prime minister'
  ]

  var html =
  `<div class="gem-c-search-autocomplete" data-base-class="gem-c-search-autocomplete" data-display-number-suggestions="5" data-id-postfix="test" data-source="[&quot;prime minister&quot;,&quot;deputy prime minister&quot;,&quot;contact prime minister&quot;,&quot;email prime minister&quot;,&quot;last prime minister&quot;]">
      <label for="input-1" class="gem-c-label govuk-label">Country</label>
      <input class="gem-c-search__input" name="country" type="text">
  </div>`

  function startAutocomplete () {
    return new GOVUK.Modules.GemSearchAutocomplete($autocomplete)
  }

  beforeEach(function () {
    $container = document.createElement('div')
    $form = document.createElement('form')
    $form.innerHTML = html
    $container.appendChild($form)

    document.body.appendChild($container)
    $autocomplete = document.querySelector('.gem-c-search-autocomplete')

    instance = startAutocomplete()
    instance.init()

    jasmine.clock().install()

    idPostfix = $autocomplete.getAttribute('data-id-postfix')
    $input = $autocomplete.querySelector('.gem-c-search__input')
    $resultsList = $autocomplete.querySelector('.gem-c-search-autocomplete__result-list')
  })

  afterEach(function () {
    jasmine.clock().uninstall()
    document.body.removeChild($container)
  })

  describe('initial component state', function () {
    it('sets the correct aria attributes on a focusable input', async function () {
      await $input.focus()

      expect($input.getAttribute('role')).toBe('combobox')
      expect(document.activeElement).toEqual($input)
      expect($input.getAttribute('aria-autocomplete')).toBe('list')
      expect($input.getAttribute('autocomplete')).toBe('off')
      expect($input.getAttribute('aria-haspopup')).toBe('listbox')
      expect($input.getAttribute('aria-expanded')).toBe('false')
    })

    it('sets the correct input attributes', async function () {
      await $input.focus()

      expect($input.getAttribute('autocapitalize')).toBe('off')
      expect($input.getAttribute('spellcheck')).toBe('false')
    })

    it('sets a signpost on input that it owns result list', async function () {
      await $input.focus()
      var testId = $resultsList.id

      expect($input.getAttribute('aria-owns')).toBe(testId)
    })

    it('sets the status and instructions for users of assistive technology', async function () {
      await $input.focus()
      $status = document.querySelector('[role="status"]')

      expect($input.getAttribute('aria-expanded')).toBe('false')
      expect($status.innerHTML).toBe('No results.')

      expect($input.getAttribute('aria-describedby')).toBe(`gem-c-search-autocomplete-assistive-hint-${idPostfix}`)
      expect(document.querySelectorAll(`#gem-c-search-autocomplete-assistive-hint-${idPostfix}`).length).toBe(1)
    })

    it('throttle delay time', async function () {
      spyOn(window.GOVUK.Modules.GemSearchAutocomplete.prototype, 'updateResults').and.callThrough()

      $input.value = 'r'
      await $input.focus()
      await $input.blur()
      await $input.focus()

      // broken this should be one when throttle time is set
      expect(window.GOVUK.Modules.GemSearchAutocomplete.prototype.updateResults.calls.count()).toBe(2)
    })
  })

  describe('user interaction', function () {
    beforeEach(async function () {
      $input.value = 'p'
      $status = document.querySelector('.js-assistive-hint')
      await $input.focus()
    })

    describe('general behaviour', function () {
      it('inform the user that content has been expanded', function () {
        expect($autocomplete.getAttribute('data-expanded')).toBe('true')
        expect($input.getAttribute('aria-expanded')).toBe('true')
        expect($resultsList.getAttribute('role')).toBe('listbox')
        expect($status.getAttribute('aria-atomic')).toBe('true')
        expect($status.getAttribute('aria-live')).toBe('polite')
      })

      it('inform the user when there are matches', function () {
        expect($resultsList.querySelectorAll('li').length).toBe(5)
        expect($status.innerHTML).toBe('5 results available.')
      })

      it('allows user to select a suggestion and returns focus to input', function () {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 }))

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
      })
    })

    describe('keyboard behaviour', function () {
      beforeEach(function () {
        spyOn(window.GOVUK.Modules.GemSearchAutocomplete.prototype, 'submitForm')
      })
      it('user can navigate the available matches using keyboard', function () {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        expect($input.getAttribute('aria-activedescendant')).toBe('gem-c-search-autocomplete-result-0')

        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', keyCode: 38 }))
        expect($input.getAttribute('aria-activedescendant')).toBe('gem-c-search-autocomplete-result-4')

        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        expect($input.getAttribute('aria-activedescendant')).toBe('gem-c-search-autocomplete-result-0')
      })

      it('space key closes the menu, sets the query, focuses the input', () => {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', keyCode: 32 }))

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')

        expect(window.GOVUK.Modules.GemSearchAutocomplete.prototype.submitForm.calls.count()).toBe(0)
      })

      it('enter key closes the menu, sets the query, focuses the input and submits form', () => {
        instance.submitOnSelect = true

        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 }))

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')

        expect(window.GOVUK.Modules.GemSearchAutocomplete.prototype.submitForm.calls.count()).toBe(1)
      })

      it('esc key closes the menu, focuses the input', () => {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc', keyCode: 27 }))

        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')

        expect(window.GOVUK.Modules.GemSearchAutocomplete.prototype.submitForm.calls.count()).toBe(0)
      })
    })

    describe('mouse behaviour', function () {
      it('user can select suggestion with mouse', async function () {
        var $option1 = document.querySelector('.gem-c-search-autocomplete ul li:nth-child(1)')
        $option1.click()

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')
      })
    })
  })
})
