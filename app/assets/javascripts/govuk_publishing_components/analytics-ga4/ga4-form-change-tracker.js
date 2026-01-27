window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

// This does not meet Grade C browser support for Edge
// as `CSS.escape` is not supported in Edge 12-18.
//
// Running this will cause an error in Edge 12-18
// but will not impact other JS being run.

(function (Modules) {
  'use strict'

  function Ga4FormChangeTracker (module) {
    this.module = module
  }

  Ga4FormChangeTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.usage) {
      this.startModule()
    } else {
      this.start = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.start)
    }
  }

  // triggered by cookie-consent event, which happens when users consent to cookies
  Ga4FormChangeTracker.prototype.startModule = function () {
    if (window.dataLayer) {
      window.removeEventListener('cookie-consent', this.start)
      this.module.addEventListener('change', this.trackFormChange.bind(this))
    }
  }

  Ga4FormChangeTracker.prototype.getSection = function (target, checkableValue) {
    const { id } = target

    const fieldset = target.closest('fieldset')
    const legend = fieldset && fieldset.querySelector('legend')
    const sectionContainer = this.module.closest('[data-ga4-section]')
    const label = this.module.querySelector(`label[for='${window.CSS.escape(id)}']`)

    const ga4FormSectionContainer = target.closest('[data-ga4-form-section]')

    // by default use the nearest `data-ga4-section` (if present)
    let section = sectionContainer && sectionContainer.dataset.ga4Section

    // unless there is a nearest `data-ga4-form-section`
    if (ga4FormSectionContainer) {
      section = ga4FormSectionContainer.dataset.ga4FormSection
    } else {
      // otherwise use the label of input (if it is a text field)
      section = label ? label.innerText : section
      // or use the legend of the input (if it is checkable field)
      section = legend && checkableValue ? legend.innerText : section
    }

    return section
  }

  Ga4FormChangeTracker.prototype.handleDateComponent = function (target) {
    const isDateComponent = target.closest('.govuk-date-input')
    const value = target.value

    if (!isDateComponent) { return value.length }

    // only track if completely filled in
    const inputs = [
      ...target.closest('.govuk-date-input').querySelectorAll('input')
    ]
    const allInputsSet = inputs.every((input) => input.value)

    if (allInputsSet) {
      return inputs.map((input) => input.value).join('/')
    }
  }

  Ga4FormChangeTracker.prototype.trackFormChange = function (event) {
    const target = event.target
    const { type, id } = target

    if (type === 'search') return

    const indexContainer =
      window.GOVUK.analyticsGa4.core.trackFunctions.findTrackingAttributes(
        target,
        'data-ga4-index'
      )

    let index = {}

    if (indexContainer) {
      try {
        index = JSON.parse(indexContainer.getAttribute('data-ga4-index'))
      } catch (e) {
        console.warn('GA4 configuration error: ' + e.message, window.location)
      }
    }

    const value = (event.detail && event.detail.value) || target.value

    // a radio or check input with a `name` and `value`
    // or an option of `value` within a `select` with `name`
    const checkableValue = this.module.querySelector(
      `#${window.CSS.escape(id)}[value="${window.CSS.escape(value)}"], #${window.CSS.escape(id)} [value="${window.CSS.escape(value)}"]`
    )

    let action = 'select'
    let text

    if (checkableValue) {
      const fieldset = checkableValue.closest('fieldset') || null
      const redactedFieldset = fieldset && fieldset.dataset.ga4Redact

      // radio, check, option can have `:checked` pseudo-class
      if (!checkableValue.matches(':checked')) {
        action = 'remove'
      }

      if (redactedFieldset && !checkableValue.dataset.ga4RedactPermit) {
        text = '[REDACTED]'
      } else {
        text = checkableValue.innerText || this.module.querySelector(`label[for='${window.CSS.escape(id)}']`).innerText
      }

      if (text) {
        text = text.replace(/\r?\n|\r/g, ' ')
      }
    } else if (!text) {
      // it's a free form text field
      text = this.handleDateComponent(target)

      if (!text) return
    }

    window.GOVUK.analyticsGa4.core.applySchemaAndSendData(
      {
        ...index,
        section: this.getSection(
          target,
          checkableValue && checkableValue.matches(':not(option)')
        ),
        event_name: 'select_content',
        action,
        text
      },
      'event_data'
    )
  }

  Modules.Ga4FormChangeTracker = Ga4FormChangeTracker
})(window.GOVUK.Modules)
