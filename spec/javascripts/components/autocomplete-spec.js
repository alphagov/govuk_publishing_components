/* eslint-env jasmine */
/* global GOVUK, KeyboardEvent */

describe('Autocomplete component', function () {
  var autocomplete
  var container
  var html =
    `<div class="gem-c-autocomplete" data-expanded="false" data-loading="false" data-source="/url" data-display-number-suggestions="5">
        <label for="input-1" class="gem-c-label govuk-label">Country</label>
        <input class="gem-c-input govuk-input" id="input-1" name="country" type="text" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false">
    </div>`
  var $input
  var $resultList
  var $status
  var data = [
    'prime minister',
    'deputy prime minister',
    'contact prime minister',
    'email prime minister',
    'last prime minister'
  ]

  function sourceMock () {
    return data
  }

  function startAutocomplete () {
    new GOVUK.Modules.GemAutocomplete(autocomplete).init(sourceMock)
  }

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    autocomplete = document.querySelector('.gem-c-autocomplete')
    startAutocomplete()

    jasmine.clock().install()

    $input = autocomplete.querySelector('input')
    $resultList = autocomplete.querySelector('.gem-c-autocomplete__result-list')
  })

  afterEach(function () {
    jasmine.clock().uninstall()
    document.body.removeChild(container)
  })

  describe('initial component state', function () {
    it('is an editable field that is focusable', async function () {
      await $input.focus()

      expect($input.getAttribute('role')).toBe('combobox')
      expect(document.activeElement).toEqual($input)
      expect($input.getAttribute('aria-autocomplete')).toBe('list')
    })

    it('user informed of status and instructions', async function () {
      await $input.focus()
      $status = document.querySelector('[role="status"]')

      expect($input.getAttribute('aria-expanded')).toBe('false')
      expect($status.innerHTML).toBe('No results.')

      var idPostfix = container.getAttribute('data-id-postfix')
      expect($input.getAttribute('aria-describedby')).toBe(`gem-c-autocomplete-assistive-hint-${idPostfix}`)
      expect(document.querySelectorAll(`#gem-c-autocomplete-assistive-hint-${idPostfix}`).length).toBe(1)
    })

    it('base class', async function () {
      // to be implemented
    })

    it('debounce', async function () {
      // to be implemented
    })

    it('form behaviour', async function () {
      // to be implemented
    })

    describe('user interaction', function () {
      beforeEach(async function () {
        $input.value = 'p'
        $status = document.querySelector('[role="status"]')
        await $input.focus()
      })

      describe('general behaviour', function () {
        it('inform the user that content has been expanded', function () {
          expect(autocomplete.getAttribute('data-expanded')).toBe('true')
          expect($input.getAttribute('aria-expanded')).toBe('true')
          expect($resultList.getAttribute('role')).toBe('listbox')
          expect($status.getAttribute('aria-atomic')).toBe('true')
          expect($status.getAttribute('aria-live')).toBe('polite')
        })

        it('inform the user when there are matches', function () {
          expect($resultList.querySelectorAll('li').length).toBe(5)
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
        it('user can navigate the available matches using keyboard', function () {
          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
          expect($input.getAttribute('aria-activedescendant')).toBe('gem-c-autocomplete__result-0')

          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', keyCode: 38 }))
          expect($input.getAttribute('aria-activedescendant')).toBe('gem-c-autocomplete__result-4')

          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
          expect($input.getAttribute('aria-activedescendant')).toBe('gem-c-autocomplete__result-0')
        })

        it('space key closes the menu, sets the query, focuses the input', () => {
          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', keyCode: 32 }))

          expect($input.value).toBe(data[0])
          expect(document.activeElement).toEqual($input)
          expect($input.getAttribute('aria-expanded')).toBe('false')
        })

        it('esc key closes the menu, focuses the input', () => {
          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
          $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc', keyCode: 27 }))

          expect($input.value).toBe('')
          expect(document.activeElement).toEqual($input)
          expect($input.getAttribute('aria-expanded')).toBe('false')
        })
      })

      describe('mouse behaviour', function () {
        it('user can select suggestion with mouse', async function () {
          var $option1 = document.querySelector('.gem-c-autocomplete ul li:nth-child(1)')
          $option1.click()

          expect($input.value).toBe(data[0])
          expect(document.activeElement).toEqual($input)
          expect($input.getAttribute('aria-expanded')).toBe('false')
        })
      })
    })
  })
})
