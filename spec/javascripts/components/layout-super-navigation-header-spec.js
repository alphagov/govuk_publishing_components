/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('The super header navigation', function () {
  'use strict'

  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.className = 'js-enabled'
    container.innerHTML =
      '<header role="banner" class="gem-c-layout-super-navigation-header">' +
        '<div class="gem-c-layout-super-navigation-header__container govuk-width-container govuk-clearfix">' +
          '<div class="gem-c-layout-super-navigation-header__header-logo">' +
            '<a href="https://www.gov.uk/"' +
                'title="Go to the GOV.UK homepage"' +
                'class="govuk-header__link govuk-header__link--homepage"' +
                'id="logo"' +
                'data-module="gem-track-click"' +
                'data-track-category="homeLinkClicked"' +
                'data-track-action="homeHeader">' +
              '<span class="govuk-header__logotype">' +
                '<svg aria-hidden="true"' +
                      'focusable="false"' +
                      'class="govuk-header__logotype-crown gem-c-layout-super-navigation-header__logotype-crown"' +
                      'xmlns="http://www.w3.org/2000/svg"' +
                      'viewBox="0 0 132 97"' +
                      'height="30"' +
                      'width="36">' +
                  '<path fill="currentColor"' +
                        'fill-rule="evenodd"' +
                        'd="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z">' +
                  '</path>' +
                '</svg>' +
                '<span class="govuk-header__logotype-text">' +
                  'GOV.UK' +
                '</span>' +
              '</span>' +
            '</a>' +
          '</div>' +
          '<nav class="gem-c-layout-super-navigation-header__content" aria-labelledby="navigation-menu-heading" data-module="super-navigation-toggle">' +
            '<h2 id="navigation-menu-heading" class="govuk-visually-hidden">Navigation menu</h2>' +
            '<ul id="navigation" class="gem-c-layout-super-navigation-header__items">' +
              '<li class="govuk-header__navigation-item gem-c-layout-super-navigation-header__item">' +
                '<a class="govuk-header__link gem-c-layout-super-navigation-header__item-link" href="/example-one">' +
                  'Example one' +
                '</a>' +
                '<div class="gem-c-layout-super-navigation-header__dropdown-menu">' +
                  '<ul class="govuk-list">' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/benefits">' +
                          'Benefits' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/births-deaths-marriages">' +
                          'Births, death, marriages and care' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/brexit">' +
                          'Brexit' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/business">' +
                          'Business and self-employed' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/childcare-parenting">' +
                          'Childcare and parenting' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/citizenship">' +
                          'Citizenship and living in the UK' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/coronavirus">' +
                          'Coronavirus (COVID‑19)' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/justice">' +
                          'Crime, justice and the law' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/disabilities">' +
                          'Disabled people' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/driving">' +
                          'Driving and transport' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/education">' +
                          'Education and learning' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/employing-people">' +
                          'Employing people' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/environment-countryside">' +
                          'Environment and countryside' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/housing-local-services">' +
                          'Housing and local services' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/tax">' +
                          'Money and tax' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/abroad">' +
                          'Passports, travel and living abroad' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/visas-immigration">' +
                          'Visas and immigration' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/browse/working">' +
                          'Working, jobs and pensions' +
                        '</a>' +
                      '</li>' +
                    '</ul>' +
                '</div>' +
              '</li>' +
              '<li class="govuk-header__navigation-item gem-c-layout-super-navigation-header__item">' +
                '<a class="govuk-header__link gem-c-layout-super-navigation-header__item-link" href="/example-two">' +
                  'Example two' +
                '</a>' +
              '</li>' +
              '<li class="govuk-header__navigation-item gem-c-layout-super-navigation-header__item">' +
                '<a class="govuk-header__link gem-c-layout-super-navigation-header__item-link" href="/example-three">' +
                  'Example three' +
                '</a>' +
                '<div class="gem-c-layout-super-navigation-header__dropdown-menu">' +
                  '<ul class="govuk-list">' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/search/news-and-communications">' +
                          'News' +
                        '</a>' +
                        '<p class="govuk-body-s gem-c-layout-super-navigation-header__dropdown-list-item-description">News stories, speeches, letters and notices</p>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/search/guidance-and-regulation">' +
                          'Guidance and regulation' +
                        '</a>' +
                        '<p class="govuk-body-s gem-c-layout-super-navigation-header__dropdown-list-item-description">Detailed guidance, regulations and rules</p>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/search/research-and-statistics">' +
                          'Research and statistics' +
                        '</a>' +
                        '<p class="govuk-body-s gem-c-layout-super-navigation-header__dropdown-list-item-description">Reports, analysis and official statistics</p>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/search/policy-papers-and-consultations">' +
                          'Policy papers and consultation' +
                        '</a>' +
                        '<p class="govuk-body-s gem-c-layout-super-navigation-header__dropdown-list-item-description">Consultations and strategy</p>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/search/transparency-and-freedom-of-information-releases">' +
                          'Transparency' +
                        '</a>' +
                        '<p class="govuk-body-s gem-c-layout-super-navigation-header__dropdown-list-item-description">Government data, freedom of information releases and corporate reports</p>' +
                      '</li>' +
                  '</ul>' +
                  '<ul class="govuk-list">' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/government/how-government-works">' +
                          'How government works' +
                        '</a>' +
                      '</li>' +
                      '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                        '<a class="govuk-link gem-c-layout-super-navigation-header__dropdown-list-item-link" href="/government/get-involved">' +
                          'Get involved' +
                        '</a>' +
                      '</li>' +
                  '</ul>' +
              '</div>' +
              '</li>' +
              '<li class="govuk-header__navigation-item gem-c-layout-super-navigation-header__item gem-c-layout-super-navigation-header__item--search">' +
                '<a class="govuk-header__link gem-c-layout-super-navigation-header__item-link gem-c-layout-super-navigation-header__item-link--search" href="/search">' +
                  '<span class="gem-c-layout-super-navigation-header__item-link-text--search">Search</span>' +
                  '<svg class="gem-c-layout-super-navigation-header__item-link-icon--search" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
                    '<circle cx="10.0161" cy="10.0161" r="8.51613" stroke="currentColor" stroke-width="3" />' +
                    '<line x1="15.8668" y1="16.3587" x2="25.4475" y2="25.9393" stroke="currentColor" stroke-width="3" />' +
                  '</svg>' +
                '</a>' +
              '</li>' +
            '</ul>' +
          '</nav>' +
        '</div>' +
      '</header>'

    document.body.appendChild(container)

    var $element = document.querySelector('[data-module="super-navigation-toggle"]')
    new GOVUK.Modules.SuperNavigationToggle($element).init()
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }

    document.body.removeChild(container)
  })

  describe('the Menu button', function () {
    var $button

    beforeEach(function () {
      $button = document.querySelector('.gem-c-layout-super-navigation-header__menu-button')
    })

    it('is present', function () {
      expect($button).toExist()
    })

    it('has the correct text', function () {
      expect($button).toHaveText('Menu')
    })

    it('is correctly visible depending on the screen size', function () {
      if (window.innerWidth >= 769) {
        expect($button).toBeHidden()
      } else {
        expect($button).toBeVisible()
      }
    })

    describe('with the correct ARIA attributes', function () {
      it('has `aria-controls` set to "navigation"', function () {
        expect($button).toHaveAttr('aria-controls', 'navigation')
      })

      it('has `aria-label` set to "Show navigation menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Show navigation menu')
      })

      it('has `aria-expanded` set to false', function () {
        expect($button).toHaveAttr('aria-expanded', 'false')
      })
    })
  })

  describe('clicking the "Menu" button once', function () {
    var $button
    var $menu

    beforeEach(function () {
      $button = document.querySelector('.gem-c-layout-super-navigation-header__menu-button')
      $menu = document.querySelector('.gem-c-layout-super-navigation-header__items')

      $button.click()
    })

    it('opens the menu', function () {
      expect($menu).toHaveClass('gem-c-layout-super-navigation-header__items--open')
    })

    it('updates the button’s `aria-expanded` attribute to true', function () {
      expect($button).toHaveAttr('aria-expanded', 'true')
    })

    it('updates the button’s `aria-label` to "Hide navigation menu"', function () {
      expect($button).toHaveAttr('aria-label', 'Hide navigation menu')
    })

    it('updates button’s state', function () {
      expect($button).toHaveClass('govuk-header__menu-button--open')
    })
  })

  describe('clicking the "Menu" button twice', function () {
    var $button
    var $menu

    beforeEach(function () {
      $button = document.querySelector('.gem-c-layout-super-navigation-header__menu-button')
      $menu = document.querySelector('.gem-c-layout-super-navigation-header__items')

      $button.click()
    })

    it('opens and then closes the menu', function () {
      expect($menu).toHaveClass('gem-c-layout-super-navigation-header__items--open')

      $button.click()

      expect($menu).not.toHaveClass('gem-c-layout-super-navigation-header__items--open')
    })

    it('sets the button’s `aria-expanded` attribute to true, then false', function () {
      expect($button).toHaveAttr('aria-expanded', 'true')

      $button.click()

      expect($button).toHaveAttr('aria-expanded', 'false')
    })

    it('sets the button’s `aria-label` attribute to "Hide navigation menu", then "Show navigation menu"', function () {
      expect($button).toHaveAttr('aria-label', 'Hide navigation menu')

      $button.click()

      expect($button).toHaveAttr('aria-label', 'Show navigation menu')
    })

    it('updates the button’s state', function () {
      expect($button).toHaveClass('govuk-header__menu-button--open')

      $button.click()

      expect($button).not.toHaveClass('govuk-header__menu-button--open')
    })
  })
})
