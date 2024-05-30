'use strict'
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AuditFilter ($module) {
    this.module = $module
    this.data = this.module.querySelector('[data-audit-list]')
    this.headings = this.module.querySelector('[data-audit-headings]')
  }

  AuditFilter.prototype.init = function () {
    if (this.module && this.data) {
      this.getListOfApplications()
      this.createElements()

      this.filterComponentsFunction = this.filterComponents.bind(this)
      this.select.addEventListener('change', this.filterComponentsFunction)
      this.setHeadingCount()
    }
  }

  AuditFilter.prototype.getListOfApplications = function () {
    var applications = []
    var rows = this.data.querySelectorAll('[data-application]')
    for (var i = 0; i < rows.length; i++) {
      var application = rows[i].getAttribute('data-application')
      if (application) {
        if (!applications.includes(application)) {
          applications.push(application)
        }
      }
    }
    this.applications = applications.sort()
  }

  AuditFilter.prototype.createElements = function () {
    var selectWrapper = document.createElement('div')
    selectWrapper.classList.add('govuk-form-group')

    this.select = document.createElement('select')
    this.select.classList.add('govuk-select')
    this.select.setAttribute('id', 'sort-components')

    this.select.append(this.createOption('All', 'all'))
    for (var i = 0; i < this.applications.length; i++) {
      this.select.append(this.createOption(this.applications[i], this.applications[i]))
    }

    var selectLabel = document.createElement('label')
    selectLabel.classList.add('govuk-label')
    selectLabel.setAttribute('for', 'sort-components')
    selectLabel.textContent = 'Show'

    selectWrapper.append(selectLabel)
    selectWrapper.append(this.select)
    this.module.prepend(selectWrapper)
  }

  AuditFilter.prototype.createOption = function (text, value) {
    var option = document.createElement('option')
    option.textContent = text
    option.value = value
    return option
  }

  AuditFilter.prototype.filterComponents = function () {
    var selectedOption = this.select.value
    var rows = this.data.querySelectorAll('[data-application]')

    for (var i = 0; i < rows.length; i++) {
      rows[i].removeAttribute('hidden')
    }
    if (selectedOption !== 'all') {
      for (var j = 0; j < rows.length; j++) {
        if (rows[j].getAttribute('data-application') !== selectedOption) {
          rows[j].setAttribute('hidden', true)
        }
      }
    }
    this.setHeadingCount()
  }

  AuditFilter.prototype.setHeadingCount = function () {
    if (this.headings) {
      var visibleRows = this.data.querySelectorAll('[data-application]:not([hidden])')

      if (!this.headingLabels) {
        this.headingLabels = this.getHeadingLabels()
      }
      // need an array of zeroes same length as headingLabels to store the counts
      var headingCounts = new Array(this.headingLabels.length)
      for (var i = 0; i < this.headingLabels.length; ++i) {
        headingCounts[i] = 0
      }

      for (var j = 0; j < visibleRows.length; j++) {
        for (var k = 0; k < this.headingLabels.length; k++) {
          var cell = visibleRows[j].querySelector('[data-component-type=' + this.headingLabels[k] + ']')
          if (cell.textContent.trim().length) {
            headingCounts[k] += 1
          }
        }
      }

      var reg = /\([0-9]+\)/i
      for (var l = 0; l < this.headingLabels.length; l++) {
        var headingItem = this.headings.querySelector('[data-component-type=' + this.headingLabels[l] + ']')
        headingItem.textContent = headingItem.textContent.replace(reg, '') + ' (' + headingCounts[l] + ')'
      }
    }
  }

  AuditFilter.prototype.getHeadingLabels = function () {
    var headings = this.headings.querySelectorAll('[data-component-type]')
    var labels = []
    for (var i = 0; i < headings.length; i++) {
      var label = headings[i].getAttribute('data-component-type')
      if (labels.indexOf(label) === -1) {
        labels.push(label)
      }
    }
    return labels
  }

  Modules.AuditFilter = AuditFilter
})(window.GOVUK.Modules)
