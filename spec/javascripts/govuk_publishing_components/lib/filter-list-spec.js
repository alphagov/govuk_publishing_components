/* eslint-env jasmine */

describe('The filter list code', function () {
  const el = document.createElement('div')
  let input
  const markup = `
    <p data-filter-item="a">United Kingdom</p>
    <p data-filter-item="b">United States</p>
    <p data-filter-item="c">United Kingdom of Smaller Countries</p>
  `

  beforeEach(function () {
    document.body.appendChild(el)
  })

  afterEach(function () {
    delete window.GOVUK.vars.filterStarted
    document.body.removeChild(el)
  })

  it('does nothing if there is nothing to filter', function () {
    el.innerHTML = ''
    new window.GOVUK.Modules.FilterList(el).init()
    expect(el.innerHTML).toEqual('')
  })

  describe('filtering', function () {
    beforeEach(function () {
      el.innerHTML = markup
      new window.GOVUK.Modules.FilterList(el).init()
      input = el.querySelector('input')
    })

    it('only creates one instance of itself', function () {
      const markup2 = `
        <p data-filter-item="a">United Kingdom</p>
        <p data-filter-item="b">United States</p>
      `
      const el2 = document.createElement('div')
      el2.innerHTML = markup2
      document.body.appendChild(el2)
      new window.GOVUK.Modules.FilterList(el2).init()
      expect(document.querySelectorAll('input.gem-c-input')).toHaveSize(1)
      document.body.removeChild(el2)
    })

    it('creates an input if there is something to filter', function () {
      expect(el.querySelectorAll('label.gem-c-label')).toHaveSize(1)
      expect(el.querySelectorAll('input.gem-c-input')).toHaveSize(1)
      expect(el.querySelector('input.gem-c-input').getAttribute('aria-describedby')).toBe('filter-results-count')
      expect(el.querySelectorAll('.govuk-hint')).toHaveSize(1)
      expect(el.querySelector('.govuk-hint').textContent).toBe('')
      expect(el.querySelector('.govuk-hint').getAttribute('aria-live')).toBe('polite')
    })

    it('shows one element based on user input', function () {
      input.value = 'united states'
      window.GOVUK.triggerEvent(input, 'input')
      expect(el.querySelector('[data-filter-item="a"]')).toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="b"]')).not.toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="c"]')).toHaveClass('govuk-!-display-none')
      expect(el.querySelector('.govuk-hint').textContent).toBe('1 result found')
    })

    it('shows multiple elements based on user input', function () {
      input.value = 'united kingdom'
      window.GOVUK.triggerEvent(input, 'input')
      expect(el.querySelector('[data-filter-item="a"]')).not.toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="b"]')).toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="c"]')).not.toHaveClass('govuk-!-display-none')
      expect(el.querySelector('.govuk-hint').textContent).toBe('2 results found')
    })

    it('shows no results if the input does not match', function () {
      input.value = 'france'
      window.GOVUK.triggerEvent(input, 'input')
      expect(el.querySelector('[data-filter-item="a"]')).toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="b"]')).toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="c"]')).toHaveClass('govuk-!-display-none')
      expect(el.querySelector('.govuk-hint').textContent).toBe('No results found')
    })

    it('resets if the input is cleared', function () {
      input.value = ''
      window.GOVUK.triggerEvent(input, 'input')
      expect(el.querySelector('[data-filter-item="a"]')).not.toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="b"]')).not.toHaveClass('govuk-!-display-none')
      expect(el.querySelector('[data-filter-item="c"]')).not.toHaveClass('govuk-!-display-none')
      expect(el.querySelector('.govuk-hint').textContent).toBe('')
    })
  })

  describe('configuration', function () {
    it('accepts a value for a label', function () {
      el.innerHTML = markup
      el.setAttribute('data-filter-label', 'click me')
      new window.GOVUK.Modules.FilterList(el).init()
      expect(el.querySelector('label.gem-c-label').textContent).toEqual('click me')
    })
  })
})
