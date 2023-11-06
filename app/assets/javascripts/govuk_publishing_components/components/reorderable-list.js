//= require sortablejs/Sortable.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ReorderableList ($module) {
    this.$module = $module
    this.$upButtons = this.$module.querySelectorAll('.js-reorderable-list-up')
    this.$downButtons = this.$module.querySelectorAll('.js-reorderable-list-down')

    this.init()
  }

  ReorderableList.prototype.init = function () {
    this.sortable = window.Sortable.create(this.$module, { // eslint-disable-line new-cap
      chosenClass: 'gem-c-reorderable-list__item--chosen',
      dragClass: 'gem-c-reorderable-list__item--drag',
      onSort: function () {
        this.updateOrderIndexes()
        this.triggerEvent(this.$module, 'reorder-drag')
      }.bind(this)
    })

    if (typeof window.matchMedia === 'function') {
      this.setupResponsiveChecks()
    } else {
      this.sortable.option('disabled', true)
    }

    var boundOnClickUpButton = this.onClickUpButton.bind(this)
    for (var u = 0; u < this.$upButtons.length; u++) {
      this.$upButtons[u].addEventListener('click', boundOnClickUpButton)
    }

    var boundOnClickDownButton = this.onClickDownButton.bind(this)
    for (var d = 0; d < this.$downButtons.length; d++) {
      this.$downButtons[d].addEventListener('click', boundOnClickDownButton)
    }
  }

  ReorderableList.prototype.setupResponsiveChecks = function () {
    var tabletBreakpoint = '40.0625em' // ~640px
    this.mediaQueryList = window.matchMedia('(min-width: ' + tabletBreakpoint + ')')
    this.mediaQueryList.addListener(this.checkMode.bind(this))
    this.checkMode()
  }

  ReorderableList.prototype.checkMode = function () {
    this.sortable.option('disabled', !this.mediaQueryList.matches)
  }

  ReorderableList.prototype.onClickUpButton = function (e) {
    var item = e.target.closest('.gem-c-reorderable-list__item')
    var previousItem = item.previousElementSibling
    if (item && previousItem) {
      item.parentNode.insertBefore(item, previousItem)
      this.updateOrderIndexes()
    }
    // if triggered by keyboard preserve focus on button
    if (e.detail === 0) {
      if (item !== item.parentNode.firstElementChild) {
        e.target.focus()
      } else {
        e.target.nextElementSibling.focus()
      }
    }
    this.triggerEvent(e.target, 'reorder-move-up')
  }

  ReorderableList.prototype.onClickDownButton = function (e) {
    var item = e.target.closest('.gem-c-reorderable-list__item')
    var nextItem = item.nextElementSibling
    if (item && nextItem) {
      item.parentNode.insertBefore(item, nextItem.nextElementSibling)
      this.updateOrderIndexes()
    }
    // if triggered by keyboard preserve focus on button
    if (e.detail === 0) {
      if (item !== item.parentNode.lastElementChild) {
        e.target.focus()
      } else {
        e.target.previousElementSibling.focus()
      }
    }
    this.triggerEvent(e.target, 'reorder-move-down')
  }

  ReorderableList.prototype.updateOrderIndexes = function () {
    var $orderInputs = this.$module.querySelectorAll('.gem-c-reorderable-list__actions input')
    for (var i = 0; i < $orderInputs.length; i++) {
      $orderInputs[i].setAttribute('value', i + 1)
    }
  }

  ReorderableList.prototype.triggerEvent = function (element, eventName) {
    var params = { bubbles: true, cancelable: true }
    var event

    if (typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent(eventName, params)
    } else {
      event = document.createEvent('CustomEvent')
      event.initCustomEvent(eventName, params.bubbles, params.cancelable, null)
    }

    element.dispatchEvent(event)
  }

  Modules.ReorderableList = ReorderableList
})(window.GOVUK.Modules)
