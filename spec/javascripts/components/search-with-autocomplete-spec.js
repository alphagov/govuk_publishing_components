/* eslint-env jasmine */
/* global GOVUK, Event, FormData, KeyboardEvent */

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
        data-module="gem-search-with-autocomplete"
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

    autocomplete.onConfirm('updated value')

    const formData = new FormData(form)
    expect(formData.get('q')).toEqual('updated value')
    expect(submitSpy).toHaveBeenCalled()
  })

  it('triggers a requestSubmit if Enter is pressed in the search field to work around library bug', (done) => {
    const form = fixture.querySelector('form')
    const input = fixture.querySelector('input')
    const submitSpy = spyOn(form, 'requestSubmit')

    stubSuccessfulFetch(['i am an undesirable result'])
    performInput(input, 'i just want to search the old-fashioned way', () => {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      })
      input.dispatchEvent(enterEvent)

      expect(submitSpy).toHaveBeenCalled()
      done()
    })
  })

  it('does not trigger a requestSubmit if Enter is pressed and the menu is not shown', (done) => {
    const form = fixture.querySelector('form')
    const input = fixture.querySelector('input')
    const submitSpy = spyOn(form, 'requestSubmit')

    stubSuccessfulFetch([])
    performInput(input, 'i just want to search once', () => {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      })
      input.dispatchEvent(enterEvent)

      expect(submitSpy).not.toHaveBeenCalled()
      done()
    })
  })

  describe('analytics data attributes', () => {
    it('sets data attributes on the input when suggestions are returned', (done) => {
      const input = fixture.querySelector('input')

      stubSuccessfulFetch([
        'my favourite song is red',
        'my favourite song is karma',
        'my favourite song is death by a thousand cuts'
      ])
      performInput(input, 'my favourite song is', () => {
        expect(input.dataset.autocompleteTriggerInput).toEqual('my favourite song is')
        expect(input.dataset.autocompleteSuggestions).toEqual(
          'my favourite song is red|' +
          'my favourite song is karma|' +
          'my favourite song is death by a thousand cuts'
        )
        expect(input.dataset.autocompleteSuggestionsCount).toEqual('3')
        expect(input.dataset.autocompleteAccepted).toEqual('false')
        done()
      })
    })
  })

  it('keeps the suggestions (but not the count) in the data attribute when subsequent requests return empty results', (done) => {
    // Allows us to override the spy on fetch to be able to stub out a subsequent request
    jasmine.getEnv().allowRespy(true)

    const input = fixture.querySelector('input')

    stubSuccessfulFetch([
      'my favourite song is red',
      'my favourite song is karma',
      'my favourite song is death by a thousand cuts'
    ])
    performInput(input, 'my favourite song is', () => {
      stubSuccessfulFetch([])
      performInput(input, 'my favourite song is espresso', () => {
        expect(input.dataset.autocompleteSuggestions).toEqual(
          'my favourite song is red|' +
          'my favourite song is karma|' +
          'my favourite song is death by a thousand cuts'
        )
        expect(input.dataset.autocompleteSuggestionsCount).toEqual('0')
        done()
      })
    })
  })

  it('limits the number of suggestions included in the data to 5', (done) => {
    const input = fixture.querySelector('input')

    stubSuccessfulFetch([
      'my favourite album is red',
      'my favourite album is midnights',
      'my favourite album is lover',
      'my favourite album is folklore',
      'my favourite album is reputation',
      'my favourite album is 1989'
    ])
    performInput(input, 'my favourite album is', () => {
      expect(input.dataset.autocompleteSuggestions).toEqual(
        'my favourite album is red|' +
        'my favourite album is midnights|' +
        'my favourite album is lover|' +
        'my favourite album is folklore|' +
        'my favourite album is reputation'
      )
      expect(input.dataset.autocompleteSuggestionsCount).toEqual('6')
      done()
    })
  })

  it('sets autocompleteAccepted when a suggestion is accepted', (done) => {
    const form = fixture.querySelector('form')
    const input = fixture.querySelector('input')
    spyOn(form, 'requestSubmit')

    stubSuccessfulFetch([
      'my favourite bonus track is message in a bottle',
      'my favourite bonus track is is it over now'
    ])
    performInput(input, 'my favourite bonus track is', () => {
      const secondOption = fixture.querySelectorAll('.gem-c-search-with-autocomplete__option')[1]
      secondOption.click()

      expect(input.dataset.autocompleteAccepted).toEqual('true')
      done()
    })
  })
})
