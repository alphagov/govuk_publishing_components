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

  const html = `
    <div
      class="gem-c-search-with-autocomplete"
      data-module="search-with-autocomplete"
      data-source="https://www.example.org/api/autocomplete.json?foo=bar"
      data-source-key="suggestions"
    >
      <div
        class="gem-c-search gem-c-search--separate-label"
        data-module="gem-toggle-input-class-on-focus"
      >
        <label for="search-main-7fdd251c" class="gem-c-search__label">Search on GOV.UK</label>
        <div class="gem-c-search__item-wrapper">
          <div class="gem-c-search__input-wrapper">
            <input
              enterkeyhint="search"
              class="gem-c-search__item gem-c-search__input js-class-toggle" id="search-main-7b87262d"
              name="q"
              title="Search"
              type="search"
              value="i've been looking for freedom"
            >
          </div>

          <div class="gem-c-search__item gem-c-search__submit-wrapper">
            <button class="gem-c-search__submit" type="submit" enterkeyhint="search">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  // Enters a value into the input, triggers an input event, and waits for the autocomplete results
  // to be populated before calling the onUpdated callback with the results.
  const performInputAndWaitForResults = (input, value, onUpdated) => {
    input.value = value
    input.dispatchEvent(new Event('input'))

    const observer = new MutationObserver(() => {
      const results = [...fixture.querySelectorAll('.autocomplete__option')].map(
        (r) => r.textContent.trim()
      )

      const menu = fixture.querySelector('.autocomplete__menu')
      if (menu && menu.classList.contains('autocomplete__menu--visible')) {
        observer.disconnect()
        onUpdated(results)
      }
    })

    observer.observe(fixture, { childList: true, subtree: true, attributeFilter: ['class'] })
  }

  const stubSuccessfulFetch = (suggestions) => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({ suggestions })
    }))
  }

  beforeEach(() => {
    loadAutocompleteComponent(html)
    autocomplete.init()
  })

  afterEach(() => {
    fixture.remove()
  })

  it('deletes the original input', () => {
    const inputs = fixture.querySelectorAll('input')

    expect(inputs.length).toEqual(1)
  })

  it('recreates the input exactly', () => {
    const input = fixture.querySelector('input')

    expect(input.getAttribute('name')).toEqual('q')
    expect(input.getAttribute('id')).toEqual('search-main-7b87262d')
    expect(input.getAttribute('type')).toEqual('search')
    expect(input.value).toEqual("i've been looking for freedom")
  })

  it('fetches data from the correct source', (done) => {
    const input = fixture.querySelector('input')
    stubSuccessfulFetch(['foo'])

    performInputAndWaitForResults(input, 'test query', (results) => {
      const expectedUrl = new URL(
        'https://www.example.org/api/autocomplete.json?foo=bar&q=test+query'
      )
      expect(window.fetch).toHaveBeenCalledWith(expectedUrl)

      done()
    })
  })

  it('populates the autocomplete with the expected options given the source response', (done) => {
    const input = fixture.querySelector('input')
    stubSuccessfulFetch(['foo', 'bar', 'baz'])

    performInputAndWaitForResults(input, 'test query', (results) => {
      expect(results).toEqual(['foo', 'bar', 'baz'])

      done()
    })
  })
})
