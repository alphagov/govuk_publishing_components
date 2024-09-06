/* eslint-env jasmine */
/* global GOVUK */

describe('Search with autocomplete component', () => {
  let autocomplete, fixture

  function loadAutocompleteComponent (markup) {
    fixture = document.createElement('div')
    document.body.appendChild(fixture)
    fixture.innerHTML = markup
    autocomplete = new GOVUK.Modules.SearchWithAutocomplete(fixture.querySelector('.gem-c-search-with-autocomplete'))
  }

  const htmlWithoutDataList =
  '<div class="gem-c-search-with-autocomplete">' +
    '<label for="autocomplete-id" class="govuk-label">Countries</label>' +
    '<div class="gem-c-search__input-wrapper">' +
      '<input name="autocomplete-name" id="autocomplete-id" class="govuk-input gem-c-search__input-wrapper" list="autocomplete-list" type="text">' +
    '</div>' +
  '</div>'

  const html =
    '<div class="gem-c-search-with-autocomplete">' +
      '<label for="autocomplete-id" class="govuk-label">Countries</label>' +
      '<input name="autocomplete-name" id="autocomplete-id" class="govuk-input" list="autocomplete-list" type="text" value="test value">' +
      '<datalist id="autocomplete-list">' +
        '<option value="France"></option>' +
        '<option value="Germany"></option>' +
      '</datalist>' +
    '</div>'

  afterEach(() => {
    fixture.remove()
  })

  it('fails gracefully if there is no datalist', () => {
    loadAutocompleteComponent(htmlWithoutDataList)
    spyOn(autocomplete, 'getResults').and.callThrough()
    autocomplete.init()

    expect(autocomplete.getResults).not.toHaveBeenCalled()
  })

  it('deletes the original input', function () {
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
      loadAutocompleteComponent(htmlWithoutDataList)
      autocomplete.init()

      fixture.querySelector('input').value = 'prime m'

      const container = document.createElement('div')
      container.insertAdjacentHTML('beforeend', autocomplete.constructSuggestionHTMLString('who is the prime minister'))

      expect(container.querySelector('.js-result-match').innerText).toBe('prime m')
    })
  })
})
