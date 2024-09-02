/* eslint-env jasmine */
/* global GOVUK, KeyboardEvent, Event */

describe('Search autocomplete component', () => {
  let $autocomplete
  let $container
  let $input
  let $form
  let $resultsList
  let $status
  let instance
  let idPostfix
  const data = [
    'prime minister',
    'deputy prime minister',
    'contact prime minister',
    'email prime minister',
    'last prime minister'
  ]

  const html =
  `<div class="gem-c-search-autocomplete" data-base-class="gem-c-search-autocomplete" data-display-number-suggestions="5" data-id-postfix="test" data-source="http://url">
      <label for="input-1" class="gem-c-label govuk-label">Country</label>
      <input class="gem-c-search__input" name="country" type="text">
      <div class="gem-c-search__item gem-c-search__submit-wrapper">
        <button class="gem-c-search__submit" type="submit" enterkeyhint="search">Search</button>
      </div>
  </div>`

  const startAutocomplete = () => {
    return new GOVUK.Modules.GemSearchAutocomplete($autocomplete)
  }

  beforeEach(() => {
    $container = document.createElement('div')
    $form = document.createElement('form')
    $form.innerHTML = html
    $container.appendChild($form)
    document.body.appendChild($container)

    $autocomplete = document.querySelector('.gem-c-search-autocomplete')

    instance = startAutocomplete()
    instance.init()

    jasmine.Ajax.install()
    jasmine.clock().install()

    idPostfix = $autocomplete.getAttribute('data-id-postfix')
    $input = $autocomplete.querySelector('.gem-c-search__input')
    $resultsList = $autocomplete.querySelector('.gem-c-search-autocomplete__result-list')
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
    jasmine.clock().uninstall()
    document.body.removeChild($container)
  })

  describe('initial component state', () => {
    it('sets the correct aria attributes on a focusable input', () => {
      $input.focus()

      expect($input.getAttribute('role')).toBe('combobox')
      expect(document.activeElement).toEqual($input)
      expect($input.getAttribute('aria-autocomplete')).toBe('list')
      expect($input.getAttribute('autocomplete')).toBe('off')
      expect($input.getAttribute('aria-haspopup')).toBe('listbox')
      expect($input.getAttribute('aria-expanded')).toBe('false')
    })

    it('sets the correct input attributes', () => {
      $input.focus()

      expect($input.getAttribute('autocapitalize')).toBe('off')
      expect($input.getAttribute('spellcheck')).toBe('false')
    })

    it('sets a signpost on input that it owns result list', () => {
      $input.focus()
      const testId = $resultsList.id

      expect($input.getAttribute('aria-owns')).toBe(testId)
    })

    it('sets the status and instructions for users of assistive technology', () => {
      $input.focus()
      $status = document.querySelector('[role="status"]')

      expect($input.getAttribute('aria-expanded')).toBe('false')
      expect($status.innerHTML).toBe('No results.')

      expect($input.getAttribute('aria-describedby')).toBe(`gem-c-search-autocomplete-assistive-hint-${idPostfix}`)
      expect(document.querySelectorAll(`#gem-c-search-autocomplete-assistive-hint-${idPostfix}`).length).toBe(1)
    })

    it('set throttle delay time should delay new data updates but not disable user input', async () => {
      $autocomplete.setAttribute('data-throttle-delay-time', 1000)
      spyOn(instance, 'updateResults').and.callThrough()

      $input.focus()
      $input.value = 'p'
      await $input.dispatchEvent(new Event('change'))

      $input.value = 'pr'
      await $input.dispatchEvent(new Event('change'))
      expect($input.value).toBe('pr')

      jasmine.clock().tick(1000)

      $input.value = 'pri'
      await $input.dispatchEvent(new Event('change'))

      await jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify(data)
      })

      expect(instance.updateResults.calls.count()).toBe(2)
    })

    it('sets the result text with match highlighted', async () => {
      $input.focus()
      $input.value = 'prime m'

      await $input.dispatchEvent(new Event('change'))

      await jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify(data)
      })
      expect(document.querySelector('.gem-c-search-autocomplete ul li:nth-child(1) .js-result-match').innerText).toBe('prime m')
      expect(document.querySelector('.gem-c-search-autocomplete ul li:nth-child(2) .js-result-match').innerText).toBe('prime m')
      expect(document.querySelector('.gem-c-search-autocomplete ul li:nth-child(3) .js-result-match').innerText).toBe('prime m')
      expect(document.querySelector('.gem-c-search-autocomplete ul li:nth-child(4) .js-result-match').innerText).toBe('prime m')
      expect(document.querySelector('.gem-c-search-autocomplete ul li:nth-child(5) .js-result-match').innerText).toBe('prime m')
    })

    it('sets the result text with no highlight when no match', async () => {
      $input.focus()
      $input.value = 'prit'

      await $input.dispatchEvent(new Event('change'))
      expect(document.querySelector('.gem-c-search-autocomplete ul li:nth-child(1) .js-result-match')).toBeFalsy()
    })
  })

  describe('user interaction', () => {
    beforeEach(async () => {
      $input.focus()
      $input.value = 'p'
      await $input.dispatchEvent(new Event('change'))
      await jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify(data)
      })
      $status = document.querySelector('.js-assistive-hint')
    })

    describe('general behaviour', () => {
      it('inform the user that content has been expanded', () => {
        expect($autocomplete.getAttribute('data-expanded')).toBe('true')
        expect($input.getAttribute('aria-expanded')).toBe('true')
        expect($resultsList.getAttribute('role')).toBe('listbox')
        expect($status.getAttribute('aria-atomic')).toBe('true')
        expect($status.getAttribute('aria-live')).toBe('polite')
      })

      it('inform the user when there are matches', () => {
        expect($resultsList.querySelectorAll('li').length).toBe(5)
        expect($status.innerHTML).toBe('5 results available.')
      })

      it('allows user to select a suggestion and returns focus to input', () => {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 }))

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
      })

      it('on blur closes autocomplete', () => {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new Event('blur'))

        expect($input.getAttribute('aria-expanded')).toBe('false')
      })

      it('on focus gets suggestions if input element has value', async () => {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new Event('blur'))
        await $input.dispatchEvent(new Event('focus'))

        await jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          responseText: JSON.stringify(data)
        })

        expect($input.getAttribute('aria-expanded')).toBe('true')
        expect($resultsList.querySelectorAll('li').length).toBe(5)
      })
    })

    describe('keyboard behaviour', () => {
      beforeEach(() => {
        spyOn(instance, 'submitForm')
      })
      it('user can navigate the available matches using keyboard', () => {
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

        expect(instance.submitForm.calls.count()).toBe(0)
      })

      it('enter key closes the menu, sets the query, focuses the input and submits form', () => {
        instance.submitOnSelect = true

        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 }))

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')

        expect(instance.submitForm.calls.count()).toBe(1)
      })

      it('esc key closes the menu, focuses the input', () => {
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
        $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc', keyCode: 27 }))

        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')

        expect(instance.submitForm.calls.count()).toBe(0)
      })
    })

    describe('mouse behaviour', () => {
      it('user can select suggestion with mouse', () => {
        const $option1 = document.querySelector('.gem-c-search-autocomplete ul li:nth-child(1)')
        $option1.click()

        expect($input.value).toBe(data[0])
        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')
      })

      it('click outside input closes autocomplete', () => {
        document.body.click()
        expect(document.activeElement).toEqual($input)
        expect($input.getAttribute('aria-expanded')).toBe('false')
      })
    })
  })
})
