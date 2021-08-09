/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('The super header navigation', function () {
  'use strict'

  var container
  var thisModule

  beforeEach(function () {
    container = document.createElement('div')
    container.className = 'js-enabled'
    container.innerHTML =
      '<nav ' +
        'aria-labelledby="super-navigation-menu-heading" ' +
        'class="gem-c-layout-super-navigation-header__content" ' +
        'data-module="super-navigation-mega-menu" ' +
        'data-text-for-generic-button="Toggle section" ' +
        'data-text-for-show-generic="Show section" ' +
        'data-text-for-hide-generic="Hide section" ' +
      '>' +
        '<h2 id="super-navigation-menu-heading" class="govuk-visually-hidden">' +
          'Navigation menu ' +
        '</h2>' +
        '<button ' +
          'aria-controls="super-navigation-menu" ' +
          'aria-expanded="true" ' +
          'aria-label="Hide navigation menu" ' +
          'class="gem-c-layout-super-navigation-header__navigation-top-toggle-button" ' +
          'data-text-for-hide="Hide navigation menu" ' +
          'data-text-for-show="Show navigation menu" ' +
          'data-toggle-desktop-group="hidden" ' +
          'data-toggle-mobile-group="top" ' +
          'data-tracking-key="testing" ' +
          'hidden ' +
          'id="super-navigation-menu-toggle" ' +
          'type="button" ' +
        '>' +
          'Menu ' +
        '</button>' +
        '<ul ' +
          'id="super-navigation-menu" ' +
          'class="gem-c-layout-super-navigation-header__navigation-items" ' +
        '>' +
          '<li ' +
            'class=" ' +
              'gem-c-layout-super-navigation-header__navigation-item ' +
              'gem-c-layout-super-navigation-header__navigation-item--with-children ' +
            '" ' +
          '>' +
            '<a ' +
              'class=" ' +
                'govuk-header__link ' +
                'gem-c-layout-super-navigation-header__navigation-item-link ' +
              '" ' +
              'href="/browse" ' +
            '>' +
              'Topics ' +
            '</a>' +
            '<button ' +
              'aria-controls="super-navigation-menu__section-1b6ef312" ' +
              'aria-expanded="false" ' +
              'aria-label="Show Topics section" ' +
              'class=" ' +
                'gem-c-layout-super-navigation-header__navigation-second-toggle-button ' +
              '" ' +
              'data-text-for-hide="Hide Topics section" ' +
              'data-text-for-show="Show Topics section" ' +
              'data-toggle-desktop-group="top" ' +
              'data-toggle-mobile-group="second" ' +
              'hidden ' +
              'id="super-navigation-menu__section-1b6ef312-toggle" ' +
              'type="button" ' +
            '>' +
              'Topics ' +
            '</button>' +
            '<div ' +
              'hidden ' +
              'class="gem-c-layout-super-navigation-header__navigation-dropdown-menu" ' +
              'id="super-navigation-menu__section-1b6ef312" ' +
            '>' +
              '<ul class="govuk-list">' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/benefits" ' +
                  '>' +
                    'Benefits ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/births-deaths-marriages" ' +
                  '>' +
                    'Births, death, marriages and care ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/brexit" ' +
                  '>' +
                    'Brexit ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/business" ' +
                  '>' +
                    'Business and self-employed ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/childcare-parenting" ' +
                  '>' +
                    'Childcare and parenting ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/citizenship" ' +
                  '>' +
                    'Citizenship and living in the UK ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/coronavirus" ' +
                  '>' +
                    'Coronavirus (COVID‑19) ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/justice" ' +
                  '>' +
                    'Crime, justice and the law ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/disabilities" ' +
                  '>' +
                    'Disabled people ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/driving" ' +
                  '>' +
                    'Driving and transport ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/education" ' +
                  '>' +
                    'Education and learning ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/employing-people" ' +
                  '>' +
                    'Employing people ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/environment-countryside" ' +
                  '>' +
                    'Environment and countryside ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/housing-local-services" ' +
                  '>' +
                    'Housing and local services ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/tax" ' +
                  '>' +
                    'Money and tax ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/abroad" ' +
                  '>' +
                    'Passports, travel and living abroad ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/visas-immigration" ' +
                  '>' +
                    'Visas and immigration ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/browse/working" ' +
                  '>' +
                    'Working, jobs and pensions ' +
                  '</a>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</li>' +
          '<li class="gem-c-layout-super-navigation-header__navigation-item">' +
            '<a ' +
              'class=" ' +
                'govuk-header__link ' +
                'gem-c-layout-super-navigation-header__navigation-item-link ' +
              '" ' +
              'href="/government/organisations" ' +
            '>' +
              'Departments ' +
            '</a>' +
          '</li>' +
          '<li ' +
            'class=" ' +
              'gem-c-layout-super-navigation-header__navigation-item ' +
              'gem-c-layout-super-navigation-header__navigation-item--with-children ' +
            '" ' +
          '>' +
            '<a ' +
              'class=" ' +
                'govuk-header__link ' +
                'gem-c-layout-super-navigation-header__navigation-item-link ' +
              '" ' +
              'href="/search/news-and-communications" ' +
            '>' +
              'Government activity ' +
            '</a>' +
            '<button ' +
              'aria-controls="super-navigation-menu__section-7e5c3450" ' +
              'aria-expanded="false" ' +
              'aria-label="Show Government activity section" ' +
              'class=" ' +
                'gem-c-layout-super-navigation-header__navigation-second-toggle-button ' +
              '" ' +
              'data-text-for-hide="Hide Government activity section" ' +
              'data-text-for-show="Show Government activity section" ' +
              'data-toggle-desktop-group="top" ' +
              'data-toggle-mobile-group="second" ' +
              'hidden ' +
              'id="super-navigation-menu__section-7e5c3450-toggle" ' +
              'type="button" ' +
            '>' +
              'Government activity ' +
            '</button>' +
            '<div ' +
              'hidden ' +
              'class="gem-c-layout-super-navigation-header__navigation-dropdown-menu" ' +
              'id="super-navigation-menu__section-7e5c3450" ' +
            '>' +
              '<ul class="govuk-list">' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/search/news-and-communications" ' +
                  '>' +
                    'News ' +
                  '</a>' +
                  '<p ' +
                    'class=" ' +
                      'govuk-body-s ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-description ' +
                    '" ' +
                  '>' +
                    'News stories, speeches, letters and notices ' +
                  '</p>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/search/guidance-and-regulation" ' +
                  '>' +
                    'Guidance and regulation ' +
                  '</a>' +
                  '<p ' +
                    'class=" ' +
                      'govuk-body-s ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-description ' +
                    '" ' +
                  '>' +
                    'Detailed guidance, regulations and rules ' +
                  '</p>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/search/research-and-statistics" ' +
                  '>' +
                    'Research and statistics ' +
                  '</a>' +
                  '<p ' +
                    'class=" ' +
                      'govuk-body-s ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-description ' +
                    '" ' +
                  '>' +
                    'Reports, analysis and official statistics ' +
                  '</p>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/search/policy-papers-and-consultations" ' +
                  '>' +
                    'Policy papers and consultation ' +
                  '</a>' +
                  '<p ' +
                    'class=" ' +
                      'govuk-body-s ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-description ' +
                    '" ' +
                  '>' +
                    'Consultations and strategy ' +
                  '</p>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/search/transparency-and-freedom-of-information-releases" ' +
                  '>' +
                    'Transparency ' +
                  '</a>' +
                  '<p ' +
                    'class=" ' +
                      'govuk-body-s ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-description ' +
                    '" ' +
                  '>' +
                    'Government data, freedom of information releases and corporate ' +
                    'reports ' +
                  '</p>' +
                '</li>' +
              '</ul>' +
              '<ul class="govuk-list">' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/government/how-government-works" ' +
                  '>' +
                    'How government works ' +
                  '</a>' +
                '</li>' +
                '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                  '<a ' +
                    'class=" ' +
                      'govuk-link ' +
                      'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                    '" ' +
                    'href="/government/get-involved" ' +
                  '>' +
                    'Get involved ' +
                  '</a>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</li>' +
        '</ul>' +
' ' +
        '<button ' +
          'aria-controls="super-search-menu" ' +
          'aria-expanded="true" ' +
          'aria-label="Hide search menu" ' +
          'class="gem-c-layout-super-navigation-header__search-toggle-button" ' +
          'data-text-for-hide="Hide search menu" ' +
          'data-text-for-show="Show search menu" ' +
          'data-toggle-mobile-group="top" ' +
          'data-toggle-desktop-group="top" ' +
          'hidden ' +
          'id="super-search-menu-toggle" ' +
          'type="button" ' +
        '>' +
          '<span ' +
            'class=" ' +
              'gem-c-layout-super-navigation-header__search-toggle-button-link-text ' +
            '" ' +
            '>Search GOV.UK</span ' +
          '>' +
          '<svg ' +
            'class=" ' +
              'gem-c-layout-super-navigation-header__search-toggle-button-link-icon ' +
            '" ' +
            'width="27" ' +
            'height="27" ' +
            'viewBox="0 0 27 27" ' +
            'fill="none" ' +
            'xmlns="http://www.w3.org/2000/svg" ' +
            'aria-hidden="true" ' +
            'focusable="false" ' +
          '>' +
            '<circle ' +
              'cx="10.0161" ' +
              'cy="10.0161" ' +
              'r="8.51613" ' +
              'stroke="currentColor" ' +
              'stroke-width="3" ' +
            '></circle>' +
            '<line ' +
              'x1="15.8668" ' +
              'y1="16.3587" ' +
              'x2="25.4475" ' +
              'y2="25.9393" ' +
              'stroke="currentColor" ' +
              'stroke-width="3" ' +
            '></line>' +
          '</svg>' +
        '</button>' +
' ' +
        '<div ' +
          'id="super-search-menu" ' +
          'class="gem-c-layout-super-navigation-header__search-items" ' +
        '>' +
          '<h3 ' +
            'class=" ' +
              'govuk-visually-hidden ' +
              'gem-c-layout-super-navigation-header__search-subheading ' +
            '" ' +
          '>' +
            'Search ' +
          '</h3>' +
          '<div class="gem-c-layout-super-navigation-header__search-item">' +
            '<a ' +
              'class=" ' +
                'govuk-header__link ' +
                'gem-c-layout-super-navigation-header__search-item-link ' +
              '" ' +
              'href="/search" ' +
            '>' +
              '<span ' +
                'class="gem-c-layout-super-navigation-header__search-item-link-text" ' +
                '>Search GOV.UK</span ' +
              '>' +
              '<svg ' +
                'class="gem-c-layout-super-navigation-header__search-item-link-icon" ' +
                'width="27" ' +
                'height="27" ' +
                'viewBox="0 0 27 27" ' +
                'fill="none" ' +
                'xmlns="http://www.w3.org/2000/svg" ' +
                'aria-hidden="true" ' +
                'focusable="false" ' +
              '>' +
                '<circle ' +
                  'cx="10.0161" ' +
                  'cy="10.0161" ' +
                  'r="8.51613" ' +
                  'stroke="currentColor" ' +
                  'stroke-width="3" ' +
                '></circle>' +
                '<line ' +
                  'x1="15.8668" ' +
                  'y1="16.3587" ' +
                  'x2="25.4475" ' +
                  'y2="25.9393" ' +
                  'stroke="currentColor" ' +
                  'stroke-width="3" ' +
                '></line>' +
              '</svg>' +
            '</a>' +
          '</div>' +
          '<div class="gem-c-layout-super-navigation-header__search-and-popular">' +
            '<form ' +
              'id="search" ' +
              'action="/search" ' +
              'method="get" ' +
              'role="search" ' +
              'aria-label="Site-wide" ' +
            '>' +
              '<div ' +
                'class=" ' +
                  'gem-c-search ' +
                  'govuk-!-display-none-print ' +
                  'gem-c-search--large ' +
                  'gem-c-search--on-white ' +
                  'gem-c-search--separate-label ' +
                '" ' +
                'data-module="gem-toggle-input-class-on-focus" ' +
              '>' +
                '<label for="search-main-5dfcaa4f" class="gem-c-search__label">' +
                  'Search GOV.UK ' +
                '</label>' +
                '<div class="gem-c-search__item-wrapper">' +
                  '<input ' +
                    'class="gem-c-search__item gem-c-search__input js-class-toggle" ' +
                    'id="search-main-5dfcaa4f" ' +
                    'name="q" ' +
                    'title="Search" ' +
                    'type="search" ' +
                    'value="" ' +
                  '/>' +
                  '<div class="gem-c-search__item gem-c-search__submit-wrapper">' +
                    '<button ' +
                      'class="gem-c-search__submit" ' +
                      'type="submit" ' +
                      'data-module="gem-track-click" ' +
                    '>' +
                      'Search ' +
                    '</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<h3 class="govuk-heading-m">Popular on GOV.UK</h3>' +
            '<ul class="govuk-list">' +
              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                '<a ' +
                  'class=" ' +
                    'govuk-link ' +
                    'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                  '" ' +
                  'href="/guidance/covid-19-coronavirus-restrictions-what-you-can-and-cannot-do" ' +
                '>' +
                  'Coronavirus (COVID-19): rules ' +
                '</a>' +
              '</li>' +
              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                '<a ' +
                  'class=" ' +
                    'govuk-link ' +
                    'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                  '" ' +
                  'href="/brexit" ' +
                '>' +
                  'Brexit: check what you need to do ' +
                '</a>' +
              '</li>' +
              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                '<a ' +
                  'class=" ' +
                    'govuk-link ' +
                    'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                  '" ' +
                  'href="/personal-tax-account" ' +
                '>' +
                  'Sign in to your personal tax account ' +
                '</a>' +
              '</li>' +
              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                '<a ' +
                  'class=" ' +
                    'govuk-link ' +
                    'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                  '" ' +
                  'href="/find-a-job" ' +
                '>' +
                  'Find a job ' +
                '</a>' +
              '</li>' +
              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                '<a ' +
                  'class=" ' +
                    'govuk-link ' +
                    'gem-c-layout-super-navigation-header__dropdown-list-item-link ' +
                  '" ' +
                  'href="/sign-in-universal-credit" ' +
                '>' +
                  'Sign in to your Universal Credit account ' +
                '</a>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</nav>'

    document.body.appendChild(container)

    var $element = document.querySelector('[data-module="super-navigation-mega-menu"]')
    thisModule = new GOVUK.Modules.SuperNavigationMegaMenu($element)

    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }

    document.body.removeChild(container)
  })

  describe('on small screens', function () {
    beforeEach(function () {
      // `windowSize` returns `'mobile'` or `'desktop'` depending on the screen
      // size. As we can't change the size of the browser window, we need to
      // change the return of this function to force the mobile or desktop
      // behaviour.
      thisModule.windowSize = function () {
        return 'mobile'
      }

      thisModule.init()
    })

    describe('the navigation toggle button', function () {
      var $button

      beforeEach(function () {
        $button = document.querySelector('#super-navigation-menu-toggle')
      })

      it('does not have the `hidden` attribute', function () {
        expect($button).not.toHaveAttr('hidden')
      })

      describe('has the correct ARIA attributes', function () {
        it('has `aria-controls` set to "super-navigation-menu"', function () {
          expect($button).toHaveAttr('aria-controls', 'super-navigation-menu')
        })

        it('has `aria-label` set to "Show navigation menu"', function () {
          expect($button).toHaveAttr('aria-label', 'Show navigation menu')
        })

        it('has `aria-expanded` set to false', function () {
          expect($button).toHaveAttr('aria-expanded', 'false')
        })
      })

      describe('updates correctly when clicked once', function () {
        var $button
        var $menu

        beforeEach(function () {
          $button = document.querySelector('#super-navigation-menu-toggle')
          $menu = document.querySelector('#super-navigation-menu')

          $button.click()
        })

        it('opens the menu', function () {
          expect($menu).not.toHaveAttr('hidden')
        })

        it('updates the button’s `aria-expanded` attribute to true', function () {
          expect($button).toHaveAttr('aria-expanded', 'true')
        })

        it('updates the button’s `aria-label`', function () {
          var hideLabel = $button.getAttribute('data-text-for-hide')
          expect($button).toHaveAttr('aria-label', hideLabel)
        })

        it('triggers the correct google analytics custom event', function () {
          expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('headerClicked', 'testingOpened', {
            label: 'none'
          })
        })
      })

      describe('updates correctly when clicked twice', function () {
        var $button
        var $menu

        beforeEach(function () {
          $button = document.querySelector('#super-navigation-menu-toggle')
          $menu = document.querySelector('#super-navigation-menu')

          $button.click()
        })

        it('opens and then closes the menu', function () {
          expect($menu).not.toHaveAttr('hidden')
          $button.click()
          expect($menu).toHaveAttr('hidden')
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

        it('triggers the correct google analytics custom event', function () {
          $button.click()
          expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('headerClicked', 'testingClosed', {
            label: 'none'
          })
        })
      })

      it('toggles the other menus in its group', function () {
        var $searchButton = document.querySelector('#super-search-menu-toggle')
        var $searchMenu = document.querySelector('#super-search-menu')

        $button.click()

        expect($searchButton).toHaveAttr('aria-expanded', 'false')
        expect($searchButton).toHaveAttr('aria-label', 'Show search menu')
        expect($searchMenu).toHaveAttr('hidden')

        $searchButton.click()

        expect($searchButton).toHaveAttr('aria-expanded', 'true')
        expect($searchButton).toHaveAttr('aria-label', 'Hide search menu')
        expect($searchMenu).not.toHaveAttr('hidden')

        $button.click()

        expect($searchButton).toHaveAttr('aria-expanded', 'false')
        expect($searchButton).toHaveAttr('aria-label', 'Show search menu')
        expect($searchMenu).toHaveAttr('hidden')
      })
    })

    describe('the search toggle button', function () {
      var $button

      beforeEach(function () {
        $button = document.querySelector('#super-search-menu-toggle')
      })

      it('does not have the `hidden` attribute', function () {
        expect($button).not.toHaveAttr('hidden')
      })

      describe('has the correct ARIA attributes', function () {
        it('has `aria-controls` set to "super-search-menu"', function () {
          expect($button).toHaveAttr('aria-controls', 'super-search-menu')
        })

        it('has `aria-label` set to "Show search menu"', function () {
          expect($button).toHaveAttr('aria-label', 'Show search menu')
        })

        it('has `aria-expanded` set to false', function () {
          expect($button).toHaveAttr('aria-expanded', 'false')
        })
      })

      describe('updates correctly when clicked once', function () {
        var $button
        var $menu

        beforeEach(function () {
          $button = document.querySelector('#super-search-menu-toggle')
          $menu = document.querySelector('#super-search-menu')

          $button.click()
        })

        it('opens the menu', function () {
          expect($menu).not.toHaveAttr('hidden')
        })

        it('updates the button’s `aria-expanded` attribute to true', function () {
          expect($button).toHaveAttr('aria-expanded', 'true')
        })

        it('updates the button’s `aria-label`', function () {
          var hideLabel = $button.getAttribute('data-text-for-hide')
          expect($button).toHaveAttr('aria-label', hideLabel)
        })
      })

      describe('updates correctly when clicked twice', function () {
        var $button
        var $menu

        beforeEach(function () {
          $button = document.querySelector('#super-search-menu-toggle')
          $menu = document.querySelector('#super-search-menu')

          $button.click()
        })

        it('opens and then closes the menu', function () {
          expect($menu).not.toHaveAttr('hidden')
          $button.click()
          expect($menu).toHaveAttr('hidden')
        })

        it('sets the button’s `aria-expanded` attribute to true, then false', function () {
          expect($button).toHaveAttr('aria-expanded', 'true')
          $button.click()
          expect($button).toHaveAttr('aria-expanded', 'false')
        })

        it('sets the button’s `aria-label` attribute to "Hide search menu", then "Show search menu"', function () {
          expect($button).toHaveAttr('aria-label', 'Hide search menu')
          $button.click()
          expect($button).toHaveAttr('aria-label', 'Show search menu')
        })
      })

      it('toggles the other menus in its group', function () {
        var $navigationButton = document.querySelector('#super-navigation-menu-toggle')
        var $navigationMenu = document.querySelector('#super-navigation-menu')

        $button.click()

        expect($navigationButton).toHaveAttr('aria-expanded', 'false')
        expect($navigationButton).toHaveAttr('aria-label', 'Show navigation menu')
        expect($navigationMenu).toHaveAttr('hidden')

        $navigationButton.click()

        expect($navigationButton).toHaveAttr('aria-expanded', 'true')
        expect($navigationButton).toHaveAttr('aria-label', 'Hide navigation menu')
        expect($navigationMenu).not.toHaveAttr('hidden')

        $button.click()

        expect($navigationButton).toHaveAttr('aria-expanded', 'false')
        expect($navigationButton).toHaveAttr('aria-label', 'Show navigation menu')
        expect($navigationMenu).toHaveAttr('hidden')
      })
    })
  })

  describe('on large screens', function () {
    beforeEach(function () {
      // `windowSize` returns `'mobile'` or `'desktop'` depending on the screen
      // size. As we can't change the size of the browser window, we need to
      // change the return of this function to force the mobile or desktop
      // behaviour.
      thisModule.windowSize = function () {
        return 'desktop'
      }

      thisModule.init()
    })

    describe('the navigation toggle button', function () {
      var $button

      beforeEach(function () {
        $button = document.querySelector('#super-navigation-menu-toggle')
      })

      it('does have the `hidden` attribute', function () {
        expect($button).toHaveAttr('hidden')
      })
    })

    describe('the search button', function () {
      var $button

      beforeEach(function () {
        $button = document.querySelector('#super-search-menu-toggle')
      })

      it('does not have the `hidden` attribute', function () {
        expect($button).not.toHaveAttr('hidden')
      })

      describe('has the correct ARIA attributes', function () {
        it('has `aria-controls` set to "super-search-menu"', function () {
          expect($button).toHaveAttr('aria-controls', 'super-search-menu')
        })

        it('has `aria-label` set to "Show search menu"', function () {
          expect($button).toHaveAttr('aria-label', 'Show search menu')
        })

        it('has `aria-expanded` set to false', function () {
          expect($button).toHaveAttr('aria-expanded', 'false')
        })
      })
    })
  })
})
