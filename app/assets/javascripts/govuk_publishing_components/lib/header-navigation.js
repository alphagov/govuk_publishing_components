/* eslint-disable no-var */

// used by the header navigation from govuk_template

(function () {
  'use strict'

  if (document.querySelectorAll && document.addEventListener) {
    var els = document.querySelectorAll('.js-header-toggle')
    for (var i = 0; i < els.length; i++) {
      // Reassign current index to bypass rules in Chrome and Firefox around indexed property setting
      var thisEl = els[i]

      // If the element is an a tag, convert it to a button
      // This is to target instances where we want to change behaviour between a js and a no-js view eg: the search button on the mobile menu for some government pages. On no-js it's just a link to /search
      // This swaps a link for no-js to a button, making it interactable. Using a link for interactivity is poor accessibility as it's a misuse of the link tag and can be confusing to assistive tech users

      if (thisEl.tagName === 'A') {
        var attributes = thisEl.attributes
        var button = document.createElement('button')

        for (var k = 0; k < attributes.length; k++) {
          var thisAttr = attributes[k].name

          if (thisAttr === 'href') {
            if (button.getAttribute('data-search-toggle-for')) {
              continue
            } else {
              button.setAttribute('data-search-toggle-for', thisEl.getAttribute('href').substr(1))
            }
          } else if (thisAttr !== 'data-button-text') {
            button.setAttribute(thisAttr, thisEl.getAttribute(thisAttr))
          }
        }

        button.innerText = thisEl.getAttribute('data-button-text') || thisEl.innerText

        thisEl.parentNode.replaceChild(button, thisEl)
        thisEl = button
      }

      thisEl.addEventListener('click', function (e) {
        e.preventDefault()
        var target = document.getElementById(this.getAttribute('data-search-toggle-for'))
        var targetClass = target.getAttribute('class') || ''
        var sourceClass = this.getAttribute('class') || ''
        var isSearchToggle = sourceClass.match('search-toggle')
        var showText = this.getAttribute('data-show-text') || 'Show search'
        var hideText = this.getAttribute('data-hide-text') || 'Hide search'
        var buttonName = this.getAttribute('data-button-name') || 'menu'

        if (targetClass.indexOf('js-visible') !== -1) {
          target.setAttribute('class', targetClass.replace(/(^|\s)js-visible(\s|$)/, ''))
          if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
            window.GOVUK.analytics.trackEvent('headerClicked', buttonName + 'Closed', { label: 'none' })
          }
        } else {
          target.setAttribute('class', targetClass + ' js-visible')
          if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
            window.GOVUK.analytics.trackEvent('headerClicked', buttonName + 'Opened', { label: 'none' })
          }
        }
        if (sourceClass.indexOf('js-visible') !== -1) {
          this.setAttribute('class', sourceClass.replace(/(^|\s)js-visible(\s|$)/, ''))
          if (isSearchToggle) {
            this.innerText = showText
          }
        } else {
          this.setAttribute('class', sourceClass + ' js-visible')
          if (isSearchToggle) {
            this.innerText = hideText
          }
        }
        this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') !== 'true')
        target.setAttribute('aria-hidden', target.getAttribute('aria-hidden') === 'false')
      })
    }
  }
}).call(this)

;(function () {
  var $menuToggleButtons = document.querySelectorAll('.govuk-js-header-toggle')

  for (var j = 0; j < $menuToggleButtons.length; j++) {
    var element = $menuToggleButtons[j]

    element.addEventListener('click', function (event) {
      var buttonName = event.target.getAttribute('data-button-name') || 'menu'
      var expanded = event.target.getAttribute('aria-expanded')

      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        if (expanded === 'true') {
          window.GOVUK.analytics.trackEvent('headerClicked', buttonName + 'Closed', { label: 'none' })
        } else {
          window.GOVUK.analytics.trackEvent('headerClicked', buttonName + 'Opened', { label: 'none' })
        }
      }
    })
  }
})()
