// migrated from govuk_frontend_toolkit
;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  // Only show the first {n} items in a list, documentation is in the README.md
  var PrimaryList = function (el, selector) {
    this.el = el
    this.extraLinks = this.el.querySelectorAll('li:not(' + selector + ')')
    // only hide more than one extra link
    if (this.extraLinks.length > 1) {
      this.addToggleLink()
      this.hideExtraLinks()
    }
  }

  PrimaryList.prototype = {
    toggleText: function () {
      if (this.extraLinks.length > 1) {
        return '+' + this.extraLinks.length + ' others'
      } else {
        return '+' + this.extraLinks.length + ' other'
      }
    },
    addToggleLink: function () {
      this.toggleLink = document.createElement('a')
      this.toggleLink.href = '#'
      this.toggleLink.setAttribute('aria-expanded', 'false')
      this.toggleLink.innerText = this.toggleText()

      this.el.parentNode.insertBefore(this.toggleLink, this.el.nextSibling)
      this.toggleLink.addEventListener('click', this.toggleLinks.bind(this))
    },
    toggleLinks: function (e) {
      e.preventDefault()
      this.toggleLink.remove()
      this.showExtraLinks()
    },
    hideExtraLinks: function () {
      for (var i = 0; i < this.extraLinks.length; i++) {
        this.extraLinks[i].className = 'primary-links--display-none'
      }
    },
    showExtraLinks: function () {
      for (var i = 0; i < this.extraLinks.length; i++) {
        this.extraLinks[i].className = ''
      }
    }
  }

  GOVUK.PrimaryList = PrimaryList

  GOVUK.primaryLinks = {
    init: function (selector) {
      var allListItems = document.querySelectorAll(selector)
      var AllLists = []

      for (var i = 0; i < allListItems.length; i++) {
        var parent = allListItems[i].parentNode

        if (AllLists.indexOf(parent) < 0) {
          AllLists.push(parent)
        }
      }

      AllLists.forEach(function (el, i) {
        new GOVUK.PrimaryList(el, selector) // eslint-disable-line no-new
      })
    }
  }

  global.GOVUK = GOVUK
})(window)
