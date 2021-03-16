/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('An accordion component', function () {
  'use strict'

  var element
  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
      '<div class="gem-c-accordion govuk-!-margin-bottom-6" id="default-id" data-module="gem-accordion" data-anchor-navigation="true">' +
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

    document.body.appendChild(container)
    element = document.getElementById('default-id')
    new GOVUK.Modules.GemAccordion().start($(element))
  })

  afterEach(function () {
    document.body.removeChild(container)
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

      element.querySelectorAll('.gem-c-accordion__section').forEach(function (section, i) {
        expect(section).toHaveClass('gem-c-accordion__section--expanded')
        expect(section.querySelector('.gem-c-accordion__toggle-text').innerText).toEqual('Hide')
      })

      topLevelControl.click()
      expect(topLevelControl.innerText).toEqual('Show all sections')

      element.querySelectorAll('.gem-c-accordion__section').forEach(function (section, i) {
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
})
