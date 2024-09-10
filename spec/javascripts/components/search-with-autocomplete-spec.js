/* eslint-env jasmine */
/* global GOVUK, KeyboardEvent, Event */

describe('Search with autocomplete component', () => {
  let autocomplete, fixture

  const loadAutocompleteComponent = (markup) => {
    fixture = document.createElement('div')
    document.body.appendChild(fixture)
    fixture.innerHTML = markup
    autocomplete = new GOVUK.Modules.SearchWithAutocomplete(fixture.querySelector('.gem-c-search-with-autocomplete'))
  }

  const html =
    '<div class="gem-c-search-with-autocomplete">' +
      '<label for="autocomplete-id" class="govuk-label">Countries</label>' +
      '<div class="gem-c-search__input-wrapper">' +
        '<input name="autocomplete-name" id="autocomplete-id" class="autocomplete__input autocomplete__input--default gem-c-search__item gem-c-search__input js-class-toggle" list="autocomplete-list" type="text" value="test value">' +
      '</div>' +
    '</div>'

  afterEach(() => {
    fixture.remove()
  })

  it('fails gracefully if there is no datalist', () => {
    loadAutocompleteComponent(html)
    spyOn(autocomplete, 'getResults').and.callThrough()
    autocomplete.init()

    expect(autocomplete.getResults).not.toHaveBeenCalled()
  })

  it('deletes the original input', () => {
    loadAutocompleteComponent(html)
    autocomplete.init()

    const inputs = fixture.querySelectorAll('input')
    expect(inputs.length).toEqual(1)
  })

  it('recreates the input exactly', () => {
    loadAutocompleteComponent(html)
    autocomplete.init()

    const input = fixture.querySelector('input')
    expect(input.getAttribute('name')).toEqual('autocomplete-name')
    expect(input.getAttribute('id')).toEqual('autocomplete-id')
    expect(input.getAttribute('type')).toEqual('text')
  })

  it('recreates the input with the same value', () => {
    loadAutocompleteComponent(html)
    autocomplete.init()

    const input = fixture.querySelector('input')
    expect(input.value).toEqual('test value')
  })

  describe('Results list', () => {
    it('sets the suggestion text with match highlighted', () => {
      loadAutocompleteComponent(html)
      autocomplete.init()

      fixture.querySelector('input').value = 'prime m'

      const container = document.createElement('div')
      container.insertAdjacentHTML('beforeend', autocomplete.constructSuggestionHTMLString('who is the prime minister'))

      expect(container.querySelector('.js-result-match').innerText).toBe('prime m')
    })

    it('form is submitted when user selects a suggestion', async () => {
      loadAutocompleteComponent(html)
      autocomplete.init(['france', 'germany'])

      spyOn(autocomplete, 'submitForm')
      const $input = fixture.querySelector('input')
      $input.value = 'f'
      await $input.dispatchEvent(new Event('input'))

      $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 }))
      $input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 }))

      document.querySelector('.autocomplete__menu li').click()

      expect(autocomplete.submitForm).toHaveBeenCalled()
    })
  })
})
