describe('An expander module', function () {
  'use strict'

  var $element

  /* eslint-disable */
  var html = '\
    <div class="app-c-expander" data-module="expander" data-ga4-index=\'{\"index_section\":1, \"index_section_count\": 3}\'>\
      <h2 class="app-c-expander__heading">\
        <span class="app-c-expander__title js-toggle">Organisation</span>\
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="app-c-expander__icon app-c-expander__icon--up"><path d="m798.16 609.84l-256-256c-16.683-16.683-43.691-16.683-60.331 0l-256 256c-16.683 16.683-16.683 43.691 0 60.331s43.691 16.683 60.331 0l225.84-225.84 225.84 225.84c16.683 16.683 43.691 16.683 60.331 0s16.683-43.691 0-60.331z"/></svg>\
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="app-c-expander__icon app-c-expander__icon--down"><path d="m225.84 414.16l256 256c16.683 16.683 43.691 16.683 60.331 0l256-256c16.683-16.683 16.683-43.691 0-60.331s-43.691-16.683-60.331 0l-225.84 225.84-225.84-225.84c-16.683-16.683-43.691-16.683-60.331 0s-16.683 43.691 0 60.331z"/></svg>\
      </h2>\
      <div class="app-c-expander__content js-content" id="expander-content-2386afad">\
        This is some content that could appear inside this component. Its not very interesting or complicated but its still here, and thats fine.\
      </div>\
    </div>'
  /* eslint-enable */

  describe('in default mode', function () {
    beforeEach(function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      new GOVUK.Modules.Expander($element.querySelector('.app-c-expander')).init()
    })

    afterEach(function () {
      $(document).off()
    })

    it('collapses the content on page load', function () {
      expect($($element).find('.app-c-expander__content').is(':visible')).toBe(false)
    })

    it('replaces the span in the heading with a button and sets correct aria attributes', function () {
      expect($($element).find('.app-c-expander__button').text().trim()).toBe('Organisation')
      expect($($element).find('.app-c-expander__icon').length).toBe(2)
      expect($($element).find('.app-c-expander__heading .app-c-expander__icon').length).toBe(2)
      expect($($element).find('.app-c-expander__button').attr('type')).toBe('button')
      expect($($element).find('.app-c-expander__button').attr('aria-expanded')).toBe('false')
      expect($($element).find('.app-c-expander__button').attr('aria-controls')).toBe('expander-content-2386afad')
    })

    it('toggles the content when the button is clicked and updates aria attributes accordingly', function () {
      var $button = $($element).find('.app-c-expander__button')

      $button.click()
      expect($($element).find('.app-c-expander__content').hasClass('app-c-expander__content--visible')).toBe(true)
      expect($($element).find('.app-c-expander__button').attr('aria-expanded')).toBe('true')

      $button.click()
      expect($($element).find('.app-c-expander__content').hasClass('app-c-expander__content--visible')).toBe(false)
      expect($($element).find('.app-c-expander__button').attr('aria-expanded')).toBe('false')
    })
  })

  describe('an expander set to open on load', function () {
    beforeEach(function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      $($element).find('.app-c-expander').attr('data-open-on-load', true)
      $($element).find('.js-content').addClass('app-c-expander__content--visible')

      new GOVUK.Modules.Expander($element.querySelector('.app-c-expander')).init()
    })

    afterEach(function () {
      $(document).off()
    })

    it('does not collapse the content on page load', function () {
      expect($($element).find('.app-c-expander__content').hasClass('app-c-expander__content--visible')).toBe(true)
      $element.querySelector('.app-c-expander__button').click()
      expect($($element).find('.app-c-expander__content').hasClass('app-c-expander__content--visible')).toBe(false)
    })

    it('sets correct aria attributes on the button', function () {
      expect($($element).find('.app-c-expander__button').attr('aria-expanded')).toBe('true')
    })
  })

  describe('with user selected items', function () {
    /* eslint-disable */
    var html = '\
      <div class="app-c-expander" data-module="expander">\
        <h2 class="app-c-expander__heading">\
          <span class="app-c-expander__title js-toggle">Topic</span>\
          <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="app-c-expander__icon app-c-expander__icon--up"><path d="m798.16 609.84l-256-256c-16.683-16.683-43.691-16.683-60.331 0l-256 256c-16.683 16.683-16.683 43.691 0 60.331s43.691 16.683 60.331 0l225.84-225.84 225.84 225.84c16.683 16.683 43.691 16.683 60.331 0s16.683-43.691 0-60.331z"/></svg>\
          <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="app-c-expander__icon app-c-expander__icon--down"><path d="m225.84 414.16l256 256c16.683 16.683 43.691 16.683 60.331 0l256-256c16.683-16.683 16.683-43.691 0-60.331s-43.691-16.683-60.331 0l-225.84 225.84-225.84-225.84c-16.683-16.683-43.691-16.683-60.331 0s-16.683 43.691 0 60.331z"/></svg>\
        </h2>\
        <div class="app-c-expander__content js-content" id="expander-content-2386afad">\
          <select>\
            <option value="">All topics</option>\
            <option value="e48ab80a-de80-4e83-bf59-26316856a5f9" selected>Government</option>\
          </select>\
          <select>\
            <option value="">All sub topics</option>\
            <option value="a">Department A</option>\
            <option value="b" selected>Department B</option>\
          </select>\
          <input name="public_timestamp[from]" value="" type="text">\
          <input name="public_timestamp[to]" value="november" type="text">\
        </div>\
      </div>'
    /* eslint-enable */
    beforeEach(function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      new GOVUK.Modules.Expander($element.querySelector('.app-c-expander')).init()
    })

    afterEach(function () {
      $(document).off()
    })

    it('shows the number of selecteed items when select options or text inputs have a value', function () {
      expect($($element).find('.js-selected-counter').html()).toBe('3 selected')
    })

    it('expands the content on page load', function () {
      expect($($element).find('.app-c-expander__content').hasClass('app-c-expander__content--visible')).toBe(true)
    })

    it('sets correct aria attributes on the button', function () {
      expect($($element).find('.app-c-expander__button').attr('aria-expanded')).toBe('true')
    })
  })

  describe('GA4 tracking', function () {
    beforeEach(function () {
      $element = document.createElement('div')
      $element.innerHTML = html

      new GOVUK.Modules.Expander($element.querySelector('.app-c-expander')).init()
    })

    afterEach(function () {
      $(document).off()
    })

    it('adds the ga4 event tracker values to the button', function () {
      var $button = $($element).find('.app-c-expander__button')
      window.GOVUK.triggerEvent(window, 'ga4-filter-indexes-added')
      var expected = JSON.stringify({
        event_name: 'select_content',
        type: 'finder',
        section: 'Organisation',
        index: {
          index_section: 1,
          index_section_count: 3
        }
      })

      expect($button.attr('data-ga4-event')).toEqual(expected)
    })
  })
})
