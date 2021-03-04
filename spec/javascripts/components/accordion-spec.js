/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('An accordion component', function () {
  'use strict'

  var element
  var container = document.createElement('div')
  var localeData = {}
  var html =
      '<div class="gem-c-accordion govuk-!-margin-bottom-6" id="default-id" data-module="gem-accordion" data-anchor-navigation="true" data-show-text="Show" data-hide-text="Hide" data-show-all-text="Show all sections" data-hide-all-text="Hide all sections" data-this-section-visually-hidden=" this section">' +
        '<section class="gem-c-accordion__section">' +
          '<div class="gem-c-accordion__section-header">' +
            '<h2 class="gem-c-accordion__section-heading">' +
              '<span id="default-id-heading-1" class="gem-c-accordion__section-button">Accordion 1</span>' +
            '</h2>' +
          '</div>' +
          '<div id="default-id-content-1" class="gem-c-accordion__section-content" aria-label="Accordion 1">' +
            '<p class="govuk-body">This is content for accordion 1 of 2</p>' +
            '<p class="govuk-body">This content contains a <a href="#anchor-nav-test" class="govuk-link">link</a></p>' +
          '</div>' +
        '</section>' +
        '<section class="gem-c-accordion__section">' +
          '<div class="gem-c-accordion__section-header">' +
            '<h2 class="gem-c-accordion__section-heading">' +
              '<span id="default-id-heading-2" class="gem-c-accordion__section-button">Accordion 2</span>' +
            '</h2>' +
          '</div>' +
          '<div id="default-id-content-2" class="gem-c-accordion__section-content" aria-label="Accordion 2">' +
            '<p class="govuk-body" id="anchor-nav-test">This is content for accordion 2 of 2</p>' +
          '</div>' +
        '</section>' +
      '</div>'

  beforeEach(function () {
    container.innerHTML = html
    document.body.appendChild(container)

    // This gunky eslint disable is to account for ruby's rules on object (hash) attribute keys
    /* eslint-disable dot-notation */
    localeData['show_text'] = 'st'
    localeData['hide_text'] = 'ht'
    localeData['show_all_text'] = 'sa'
    localeData['hide_all_text'] = 'ha'
    localeData['this_section_visually_hidden'] = 'vh'
    /* eslint-enable dot-notation */

    // Because we're passing stringified JSON data, we have to pass this separately so that innerHTML doesn't strip anything and break these tests unexpectedly
    container.querySelector('.gem-c-accordion').setAttribute('data-locale', JSON.stringify(localeData))

    element = document.getElementById('default-id')
    new GOVUK.Modules.GemAccordion().start($(element))
  })

  afterEach(function () {
    $(document).off()
    window.sessionStorage.clear()
    document.body.removeChild(container)

    // This is to account for the anchor link test persisting the page hash after clicking the link
    window.location.hash = ''
  })

  describe('on page load', function () {
    it('marks the accordion as active', function () {
      expect(element).toHaveClass('gem-c-accordion--active')
    })

    it('loads the accordion show/all/hide all controls', function () {
      var controls = element.querySelector('.gem-c-accordion__controls')

      expect(controls).toBeTruthy()
      expect(controls.innerText).toEqual('Show all sections')
    })

    it('marks up the accordion titles as buttons with show/hide controls', function () {
      var header = element.querySelector('.gem-c-accordion__section-header')
      var headerControl = header.querySelector('.gem-c-accordion__toggle-text')

      expect(headerControl).toBeTruthy()
      expect(headerControl.innerText).toEqual('Show')
    })
  })

  describe('when opening and closing accordions', function () {
    it('opens and closes an accordion', function () {
      var section = element.querySelector('.gem-c-accordion__section')
      var header = section.querySelector('.gem-c-accordion__section-header')
      var headerControl = header.querySelector('.gem-c-accordion__toggle-text')

      header.click()
      expect(section).toHaveClass('gem-c-accordion__section--expanded')
      expect(headerControl.innerText).toEqual('Hide')

      header.click()
      expect(section).not.toHaveClass('gem-c-accordion__section--expanded')
      expect(headerControl.innerText).toEqual('Show')
    })

    it('opens and closes all accordions when the show/hide all controls are used', function () {
      var topLevelControl = element.querySelector('.gem-c-accordion__open-all')

      topLevelControl.click()
      expect(topLevelControl.innerText).toEqual('Hide all sections')

      element.querySelectorAll('.gem-c-accordion__section').forEach(function (section) {
        expect(section).toHaveClass('gem-c-accordion__section--expanded')
        expect(section.querySelector('.gem-c-accordion__toggle-text').innerText).toEqual('Hide')
      })

      topLevelControl.click()
      expect(topLevelControl.innerText).toEqual('Show all sections')

      element.querySelectorAll('.gem-c-accordion__section').forEach(function (section) {
        expect(section).not.toHaveClass('gem-c-accordion__section--expanded')
        expect(section.querySelector('.gem-c-accordion__toggle-text').innerText).toEqual('Show')
      })
    })
  })

  describe('when using the anchor navigation feature flag', function () {
    // For this test, we base the function on the markup snapshot above.
    // The anchor link is in the first accordion whilst the anchor is in the second accordion
    it('opens an accordion based on anchors within that accordion when the associated anchor link is clicked', function () {
      var link = element.querySelector('.gem-c-accordion__section').querySelector('.govuk-link')

      link.click()
      expect(element.querySelectorAll('.gem-c-accordion__section')[1]).toHaveClass('gem-c-accordion__section--expanded')
    })
  })

  describe('when translation is applied to accordion', function () {
    // These tests rely on the locale value passed in the markup snapshot above in the form of the following JSON object:
    // {
    //   show_text: 'st',
    //   hide_text: 'ht',
    //   show_all_text: 'sa',
    //   hide_all_text: 'ha',
    //   this_section_visually_hidden: 'vh'
    // }
    it('sets lang attributes if locale attribute is present', function () {
      expect(element.querySelector('.gem-c-accordion__open-all-text').lang).toEqual('sa')

      element.querySelectorAll('.gem-c-accordion__section-button').forEach(function (control) {
        expect(control.querySelector('.gem-c-accordion__toggle-text').lang).toEqual('st')
        expect(control.querySelectorAll('.govuk-visually-hidden')[1].lang).toEqual('vh')
      })
    })

    it('resets lang attributes upon button click if the locales for hide text is different', function () {
      var topLevelControlText = element.querySelector('.gem-c-accordion__open-all-text')

      topLevelControlText.click()

      expect(topLevelControlText.lang).toEqual('ha')

      element.querySelectorAll('.gem-c-accordion__section-button').forEach(function (control) {
        expect(control.querySelector('.gem-c-accordion__toggle-text').lang).toEqual('ht')
      })
    })
  })
})
