/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('The _layout_header_one_login', function () {
  'use strict'

  var container
  var thisModule

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
      '<header class="gem-c-cross-service-header" role="banner" data-module="cross-service-header">' +
      '<div class="gem-c-one-login-header" data-one-login-header-nav>' +
        '<div class="gem-c-one-login-header__container govuk-width-container">' +
          '<div class="gem-c-one-login-header__logo">' +
            '<a href="https://www.gov.uk/" class="gem-c-one-login-header__link gem-c-one-login-header__link--homepage">' +
              '<span class="gem-c-one-login-header__logotype">' +
                '<!--[if gt IE 8]>' + '<!-->' +
                '<svg aria-hidden="true" focusable="false" class="gem-c-one-login-header__logotype-crown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 97" height="30" width="36">' +
                  '<path fill="currentColor" fill-rule="evenodd"' +
                    'd="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z"' +
                  '>' + '</path>' +
                '</svg>' +
                '<!--<![endif]-->' +
                '<span>GOV.UK</span>' +
              '</span>' +
            '</a>' +
          '</div>' +
          '<button ' +
            'type="button"' +
            'aria-controls="one-login-header__nav"' +
            'aria-label="Show GOV.UK One Login menu"' +
            'data-open-class="gem-c-cross-service-header__button--open"' +
            'data-label-for-show="Show GOV.UK One Login menu"' +
            'data-label-for-hide="Hide GOV.UK One Login menu"' +
            'aria-expanded="false"' +
            'class="gem-c-cross-service-header__button gem-c-cross-service-header__button--one-login js-x-header-toggle"' +
          '>' +
            '<span class="gem-c-cross-service-header__button-content">One Login</span>' +
            '<!--[if gt IE 8]>' + '<!-->' +
            '<span class="gem-c-cross-service-header__button-icon gem-c-cross-service-header__button-icon--default">' +
              '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">' +
                '<circle cx="11" cy="11" r="11" fill="white" />' +
                '<path fill-rule="evenodd" clip-rule="evenodd" d="M3.29297 18.8487C4.23255 15.4753 7.32741 13 11.0004 13C14.6731 13 17.7678 15.4749 18.7076 18.848C17.8058 19.7338 16.752 20.4654 15.5889 21H11.0004H6.41097C5.24819 20.4655 4.19463 19.7342 3.29297 18.8487Z" fill="#1D70B8" />' +
                '<circle cx="11" cy="7.75" r="3.75" fill="#1D70B8" />' +
                '<circle cx="11" cy="11" r="10" stroke="white" stroke-width="2" />' +
              '</svg>' +
            '</span>' +
            '<!--<![endif]-->' +

            '<!--[if gt IE 8]>' + '<!-->' +
            '<span class="gem-c-cross-service-header__button-icon gem-c-cross-service-header__button-icon--focus">' +
              '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">' +
                '<circle cx="11" cy="11" r="11" fill="black" />' +
                '<path fill-rule="evenodd" clip-rule="evenodd" d="M3.29297 18.8487C4.23255 15.4753 7.32741 13 11.0004 13C14.6731 13 17.7678 15.4749 18.7076 18.848C17.8058 19.7338 16.752 20.4654 15.5889 21H11.0004H6.41097C5.24819 20.4655 4.19463 19.7342 3.29297 18.8487Z" fill="white" />' +
                '<circle cx="11" cy="7.75" r="3.75" fill="white" />' +
                '<circle cx="11" cy="11" r="10" stroke="black" stroke-width="2" />' +
              '</svg>' +
            '</span>' +
            '<!--<![endif]-->' +
          '</button>' +
          '<nav aria-label="GOV.UK One Login menu" class="gem-c-one-login-header__nav" data-open-class="gem-c-one-login-header__nav--open" id="one-login-header__nav">' +
            '<ul class="gem-c-one-login-header__nav__list">' +
              '<li class="gem-c-one-login-header__nav__list-item">' +
                '<a class="gem-c-one-login-header__nav__link gem-c-one-login-header__nav__link--one-login" data-module="explicit-cross-domain-links" href="#">' +
                  '<span class="gem-c-one-login-header__nav__link-content">GOV.UK One Login</span>' +
                  '<!--[if gt IE 8]>' + '<!-->' +
                  '<span class="gem-c-cross-service-header__button-icon gem-c-cross-service-header__button-icon--default">' +
                    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">' +
                      '<circle cx="11" cy="11" r="11" fill="white" />' +
                      '<path fill-rule="evenodd" clip-rule="evenodd" d="M3.29297 18.8487C4.23255 15.4753 7.32741 13 11.0004 13C14.6731 13 17.7678 15.4749 18.7076 18.848C17.8058 19.7338 16.752 20.4654 15.5889 21H11.0004H6.41097C5.24819 20.4655 4.19463 19.7342 3.29297 18.8487Z" fill="#1D70B8" />' +
                      '<circle cx="11" cy="7.75" r="3.75" fill="#1D70B8" />' +
                      '<circle cx="11" cy="11" r="10" stroke="white" stroke-width="2" />' +
                    '</svg>' +
                  '</span>' +
                  '<!--<![endif]-->' +
                  '<!--[if gt IE 8]>' + '<!-->' +
                  '<span class="gem-c-cross-service-header__button-icon gem-c-cross-service-header__button-icon--focus">' +
                    '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">' +
                      '<circle cx="11" cy="11" r="11" fill="black" />' +
                      '<path fill-rule="evenodd" clip-rule="evenodd" d="M3.29297 18.8487C4.23255 15.4753 7.32741 13 11.0004 13C14.6731 13 17.7678 15.4749 18.7076 18.848C17.8058 19.7338 16.752 20.4654 15.5889 21H11.0004H6.41097C5.24819 20.4655 4.19463 19.7342 3.29297 18.8487Z" fill="white" />' +
                      '<circle cx="11" cy="7.75" r="3.75" fill="white" />' +
                      '<circle cx="11" cy="11" r="10" stroke="black" stroke-width="2" />' +
                    '</svg>' +
                  '</span>' +
                  '<!--<![endif]-->' +
                '</a>' +
              '</li>' +
              '<li class="gem-c-one-login-header__nav__list-item">' +
                '<a class="gem-c-one-login-header__nav__link" data-module="explicit-cross-domain-links" href="#">Sign out</a>' +
              '</li>' +
            '</ul>' +
          '</nav>' +
        '</div>' +
      '</div>' +
      '<div class="gem-c-service-header" data-one-login-header-nav>' +
        '<div class="govuk-width-container">' +
          '<div class="gem-c-service-header__container">' +
            '<h2 class="gem-c-service-header__heading">GOV.UK email subscriptions</h2>' +
            '<div>' +
              '<button ' +
                'type="button"' +
                'aria-controls="service-header__nav"' +
                'data-open-class="gem-c-cross-service-header__button--open"' +
                'aria-label="Show service navigation menu"' +
                'data-label-for-show="Show service navigation menu"' +
                'data-label-for-hide="Hide service navigation menu"' +
                'data-text-for-show="Menu"' +
                'data-text-for-hide="Close"' +
                'aria-expanded="false"' +
                'class="gem-c-cross-service-header__button gem-c-cross-service-header__button--service-header js-x-header-toggle">' +
                '<span class="gem-c-service-header__button-content">Menu</span>' +
              '</button>' +
              '<nav aria-label="Service menu">' +
                '<ul class="gem-c-service-header__nav-list gem-c-service-header__nav" id="service-header__nav" data-open-class="gem-c-service-header__nav--open">' +
                  '<li class="gem-c-service-header__nav-list-item">' +
                    '<a class="gem-c-service-header__nav-list-item-link" href="#">Example link 1</a>' +
                  '</li>' +
                  '<li class="gem-c-service-header__nav-list-item">' +
                    '<a class="gem-c-service-header__nav-list-item-link" href="#">Example link 2</a>' +
                  '</li>' +
                  '<li class="gem-c-service-header__nav-list-item">' +
                    '<a class="gem-c-service-header__nav-list-item-link" href="#">Example link 3</a>' +
                  '</li>' +
                '</ul>' +
              '</nav>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>'

    document.body.appendChild(container)

    var $element = document.querySelector('[data-module="cross-service-header"]')
    thisModule = new GOVUK.Modules.CrossServiceHeader($element)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  describe('One Login header', function () {
    var $button

    beforeEach(function () {
      thisModule.init()
      $button = document.querySelector('.gem-c-cross-service-header__button--one-login.js-x-header-toggle')
    })

    describe('has the correct ARIA attributes', function () {
      it('has `aria-controls` set to "one-login-header__nav"', function () {
        expect($button).toHaveAttr('aria-controls', 'one-login-header__nav')
      })

      it('has `aria-label` set to "Show GOV.UK One Login menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Show GOV.UK One Login menu')
      })

      it('has `aria-expanded` set to false', function () {
        expect($button).toHaveAttr('aria-expanded', 'false')
      })
    })

    describe('updates correctly when clicked once', function () {
      var $button, $menu

      beforeEach(function () {
        $button = document.querySelector('.gem-c-cross-service-header__button--one-login.js-x-header-toggle')
        $menu = document.querySelector('#one-login-header__nav')

        $button.click()
      })

      it('opens the menu', function () {
        expect($menu).not.toHaveAttr('hidden')
      })

      it('updates the button’s `aria-expanded` attribute to true', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
      })

      it('updates the button’s `aria-label`', function () {
        var hideLabel = $button.getAttribute('data-label-for-hide')
        expect($button).toHaveAttr('aria-label', hideLabel)
      })
    })

    describe('updates correctly when clicked twice', function () {
      var $button, $menu

      beforeEach(function () {
        $button = document.querySelector('.gem-c-cross-service-header__button--one-login.js-x-header-toggle')
        $menu = document.querySelector('#one-login-header__nav')

        $button.click()
      })

      it('opens and then closes the menu', function () {
        expect($menu).toHaveClass('gem-c-one-login-header__nav--open')
        $button.click()
        expect($menu).not.toHaveClass('gem-c-one-login-header__nav--open')
      })

      it('sets the button’s `aria-expanded` attribute to true, then false', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
        $button.click()
        expect($button).toHaveAttr('aria-expanded', 'false')
      })

      it('sets the button’s `aria-label` attribute to "Hide navigation menu", then "Show navigation menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Hide GOV.UK One Login menu')
        $button.click()
        expect($button).toHaveAttr('aria-label', 'Show GOV.UK One Login menu')
      })
    })
  })

  describe('Service navigation menu', function () {
    var $button

    beforeEach(function () {
      thisModule.init()
      $button = document.querySelector('.gem-c-cross-service-header__button--service-header.js-x-header-toggle')
    })

    describe('has the correct ARIA attributes', function () {
      it('has `aria-controls` set to "service-header__nav"', function () {
        expect($button).toHaveAttr('aria-controls', 'service-header__nav')
      })

      it('has `aria-label` set to "Show service navigation menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Show service navigation menu')
      })

      it('has `aria-expanded` set to false', function () {
        expect($button).toHaveAttr('aria-expanded', 'false')
      })
    })

    describe('updates correctly when clicked once', function () {
      var $button, $menu

      beforeEach(function () {
        $button = document.querySelector('.gem-c-cross-service-header__button--service-header.js-x-header-toggle')
        $menu = document.querySelector('#service-header__nav')

        $button.click()
      })

      it('opens the menu', function () {
        expect($menu).not.toHaveAttr('hidden')
      })

      it('updates the button’s `aria-expanded` attribute to true', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
      })

      it('updates the button’s `aria-label`', function () {
        var hideLabel = $button.getAttribute('data-label-for-hide')
        expect($button).toHaveAttr('aria-label', hideLabel)
      })
    })

    describe('updates correctly when clicked twice', function () {
      var $button, $menu

      beforeEach(function () {
        $button = document.querySelector('.gem-c-cross-service-header__button--service-header.js-x-header-toggle')
        $menu = document.querySelector('#service-header__nav')

        $button.click()
      })

      it('opens and then closes the menu', function () {
        expect($menu).toHaveClass('gem-c-service-header__nav--open')
        $button.click()
        expect($menu).not.toHaveClass('gem-c-service-header__nav--open')
      })

      it('sets the button’s text to "Menu", then "Close"', function () {
        expect($button.textContent).toBe('Close')
        $button.click()
        expect($button.textContent).toBe('Menu')
      })

      it('sets the button’s `aria-expanded` attribute to true, then false', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
        $button.click()
        expect($button).toHaveAttr('aria-expanded', 'false')
      })

      it('sets the button’s `aria-label` attribute to "Hide service navigation menu", then "Show service navigation menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Hide service navigation menu')
        $button.click()
        expect($button).toHaveAttr('aria-label', 'Show service navigation menu')
      })
    })
  })
})
