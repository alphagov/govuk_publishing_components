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

  beforeEach(() => {
    loadAutocompleteComponent(html)
    autocomplete.init()

    window.fetch = jasmine.createSpy().and.returnValue(Promise.resolve({
      json: () => Promise.resolve({ suggestions: ['foo', 'bar', 'baz'] })
    }))
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
  })

  it('recreates the input with the same value', () => {
    const input = fixture.querySelector('input')
    expect(input.value).toEqual("i've been looking for freedom")
  })

  it('fetches data from the source and populates the options', (done) => {
    const input = fixture.querySelector('input')
    input.value = 'test query'
    input.dispatchEvent(new Event('input'))

    const expectedUrl = new URL(
      'https://www.example.org/api/autocomplete.json?foo=bar&q=test+query'
    )
    expect(window.fetch).toHaveBeenCalledWith(expectedUrl)

    // Wait for the component to catch up with itself
    const observer = new MutationObserver(() => {
      const results = [...fixture.querySelectorAll('.autocomplete__option')].map(
        (r) => r.textContent.trim()
      )

      const menu = fixture.querySelector('.autocomplete__menu')
      if (menu && menu.classList.contains('autocomplete__menu--visible')) {
        observer.disconnect()
        expect(results).toEqual(['foo', 'bar', 'baz'])
        done()
      }
    })

    observer.observe(fixture, { childList: true, subtree: true, attributeFilter: ['class'] })
  })
})
