/* eslint-env jasmine */
/* global GOVUK, Event, FormData */

describe('Search with autocomplete component', () => {
  let autocomplete, fixture

  const loadAutocompleteComponent = (markup) => {
    fixture = document.createElement('div')
    document.body.appendChild(fixture)
    fixture.innerHTML = markup
    autocomplete = new GOVUK.Modules.GemSearchWithAutocomplete(fixture.querySelector('.gem-c-search-with-autocomplete'))
  }

  const html = `
    <form id="search-form">
      <div
        class="gem-c-search-with-autocomplete"
        data-module="gem-search-with-autocomplete ga4-event-tracker"
        data-source-url="https://www.example.org/api/autocomplete.json?foo=bar"
        data-source-key="suggestions"
      >
        <div
          class="gem-c-search gem-c-search--separate-label"
          data-module="gem-toggle-input-class-on-focus"
        >
          <label for="search-main-7fdd251c" class="gem-c-search__label">Search on GOV.UK</label>
          <div class="gem-c-search__item-wrapper">
            <div class="js-search-input-wrapper">
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
    </form>
  `
  const performInput = (input, value, onDone) => {
    input.value = value
    input.dispatchEvent(new Event('input'))

    // "Tick the clock" and yield compute time to the autocomplete component so it can do its work
    // and potentially update the DOM. We could use a mutation observer for this, but that would
    // only work if there are any results (as there would be no updates if there are no results).
    setTimeout(onDone, 1)
  }

  const expectMenuToBeShownWithOptions = (options) => {
    const menu = fixture.querySelector('.gem-c-search-with-autocomplete__menu')
    const results = [...menu.querySelectorAll('.gem-c-search-with-autocomplete__option')].map(
      (r) => r.textContent.trim()
    )
    expect(menu.classList).toContain('gem-c-search-with-autocomplete__menu--visible')
    expect(results).toEqual(options)
  }

  const expectMenuNotToBeShown = () => {
    const menu = fixture.querySelector('.gem-c-search-with-autocomplete__menu')
    expect(menu.classList).not.toContain('gem-c-search-with-autocomplete__menu--visible')
  }

  const stubSuccessfulFetch = (suggestions) => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({ suggestions })
    }))
  }

  const stubLocalErrorFetch = () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network error')))
  }

  const stubServerErrorFetch = () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' })
    }))
  }

  beforeEach(() => {
    loadAutocompleteComponent(html)
    autocomplete.init()
  })

  afterEach(() => {
    fixture.remove()
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

    performInput(input, 'test query', (results) => {
      const expectedUrl = new URL(
        'https://www.example.org/api/autocomplete.json?foo=bar&q=test+query'
      )
      expect(window.fetch).toHaveBeenCalledWith(
        expectedUrl, { headers: { Accept: 'application/json' } }
      )

      done()
    })
  })

  it('handles empty results coming back from source', (done) => {
    const input = fixture.querySelector('input')
    stubSuccessfulFetch([])

    performInput(input, 'test query', () => {
      expectMenuNotToBeShown()

      done()
    })
  })

  it('handles a local error during fetch', (done) => {
    const input = fixture.querySelector('input')
    stubLocalErrorFetch()

    performInput(input, 'test query', () => {
      expectMenuNotToBeShown()

      done()
    })
  })

  it('handles a server error during fetch', (done) => {
    const input = fixture.querySelector('input')
    stubServerErrorFetch()

    performInput(input, 'test query', () => {
      expectMenuNotToBeShown()

      done()
    })
  })

  it('populates the autocomplete with the expected options given the source response', (done) => {
    const input = fixture.querySelector('input')
    stubSuccessfulFetch(['foo', 'bar', 'baz'])

    performInput(input, 'test query', () => {
      expectMenuToBeShownWithOptions(['foo', 'bar', 'baz'])

      done()
    })
  })

  it('highlights the matched part of the suggestion text', (done) => {
    const input = fixture.querySelector('input')
    stubSuccessfulFetch(['foo bar baz'])

    performInput(input, 'bar', () => {
      const suggestionText = fixture.querySelector('.gem-c-search-with-autocomplete__suggestion-text').innerHTML
      expect(suggestionText).toEqual('foo <mark class="gem-c-search-with-autocomplete__suggestion-highlight">bar</mark> baz')

      done()
    })
  })

  it('sanitizes potential garbled results from the source', (done) => {
    const input = fixture.querySelector('input')
    stubSuccessfulFetch(['<blink>&</blink>'])

    performInput(input, '1999', () => {
      const suggestionText = fixture.querySelector('.gem-c-search-with-autocomplete__suggestion-text').innerHTML
      expect(suggestionText).toEqual('&lt;blink&gt;&amp;&lt;/blink&gt;')

      done()
    })
  })

  it('submits the containing form when a suggestion is confirmed', (done) => {
    const form = fixture.querySelector('form')
    const input = fixture.querySelector('input')
    const submitSpy = spyOn(form, 'requestSubmit')

    stubSuccessfulFetch(['foo'])
    performInput(input, 'test query', () => {
      const firstOption = fixture.querySelector('.gem-c-search-with-autocomplete__option')
      firstOption.click()

      expect(submitSpy).toHaveBeenCalled()
      done()
    })
  })

  it('ensures that the form is submitted with the right value in the onConfirm callback', () => {
    const form = fixture.querySelector('form')
    const submitSpy = spyOn(form, 'requestSubmit')

    autocomplete.submitContainingForm('updated value')

    const formData = new FormData(form)
    expect(formData.get('q')).toEqual('updated value')
    expect(submitSpy).toHaveBeenCalled()
  })

  it('submits correct Ga4 event data when a suggestion is confirmed', (done) => {
    const $menu = fixture.querySelector('.gem-c-search-with-autocomplete__menu')
    const $input = fixture.querySelector('input')
    const $form = fixture.querySelector('form')

    const suggestions = ['foo', 'bar', 'baz']
    stubSuccessfulFetch(suggestions)

    $form.addEventListener('submit', (e) => {
      e.preventDefault()
    })

    performInput($input, 'test query', () => {
      $menu.querySelector('.gem-c-search-with-autocomplete__option').click()

      const ga4EventData = window.dataLayer[window.dataLayer.length - 1]

      expect(ga4EventData.event_data).toBeDefined()
      expect(ga4EventData.event_data.type).toBe('finder')
      expect(ga4EventData.event_data.event_name).toBe('select_content')
      expect(ga4EventData.event_data.tool_name).toBe('autocomplete')
      expect(ga4EventData.event_data.autocomplete_input).toBe($input.value)
      expect(ga4EventData.event_data.autocomplete_suggestions).toBe(suggestions.join('|'))
      expect(parseInt(ga4EventData.event_data.length, 10)).toBe(suggestions.length)

      done()
    })
  })
})
