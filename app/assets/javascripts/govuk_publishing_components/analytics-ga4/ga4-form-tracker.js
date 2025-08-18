window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4FormTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-form' // elements with this attribute get tracked
    this.includeTextInputValues = this.module.hasAttribute('data-ga4-form-include-text')
    this.recordJson = this.module.hasAttribute('data-ga4-form-record-json')
    this.useTextCount = this.module.hasAttribute('data-ga4-form-use-text-count')
    this.splitText = this.module.hasAttribute('data-ga4-form-split-response-text')
    this.useSelectCount = this.module.hasAttribute('data-ga4-form-use-select-count')
    this.redacted = false
    this.useFallbackValue = this.module.hasAttribute('data-ga4-form-no-answer-undefined') ? undefined : 'No answer given'
  }

  Ga4FormTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.usage) {
      this.startModule()
    } else {
      this.start = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.start)
    }
  }

  // triggered by cookie-consent event, which happens when users consent to cookies
  Ga4FormTracker.prototype.startModule = function () {
    if (window.dataLayer) {
      window.removeEventListener('cookie-consent', this.start)
      this.module.addEventListener('submit', this.trackFormSubmit.bind(this))
    }
  }

  Ga4FormTracker.prototype.trackFormSubmit = function (event) {
    var target = window.GOVUK.analyticsGa4.core.trackFunctions.findTrackingAttributes(event.target, this.trackingTrigger)
    if (target) {
      try {
        var data = target.getAttribute(this.trackingTrigger)
        data = JSON.parse(data)
      } catch (e) {
        // if there's a problem with the config, don't start the tracker
        console.warn('GA4 configuration error: ' + e.message, window.location)
        return
      }

      var formInputs = this.getFormInputs()
      var formData = this.getInputValues(formInputs)
      data.text = data.text || this.combineGivenAnswers(formData) || this.useFallbackValue

      if (data.action === 'search' && data.text) {
        data.text = window.GOVUK.analyticsGa4.core.trackFunctions.standardiseSearchTerm(data.text)
      }

      if (data.text && this.splitText) {
        data = this.splitFormResponseText(data)
      }

      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
    }
  }

  Ga4FormTracker.prototype.splitFormResponseText = function (data) {
    var text = data.text
    var dimensions = Math.min(Math.ceil(data.text.length / 500), 5)

    data.text = text.slice(0, 500)

    for (var i = 1; i < dimensions; i++) {
      data['text_' + (i + 1)] = text.slice(i * 500, i * 500 + 500)
    }

    return data
  }

  Ga4FormTracker.prototype.getFormInputs = function () {
    var inputs = []
    var labels = this.module.querySelectorAll('label')

    for (var i = 0; i < labels.length; i++) {
      var label = labels[i]
      var labelFor = label.getAttribute('for')
      var input = false
      if (labelFor) {
        input = this.module.querySelector('[id=' + labelFor + ']')
      } else {
        input = label.querySelector('input')
      }
      inputs.push({
        input: input,
        label: label
      })
    }
    return inputs
  }

  Ga4FormTracker.prototype.getInputValues = function (inputs) {
    for (var i = inputs.length - 1; i >= 0; i--) {
      var input = inputs[i]
      var elem = input.input
      var labelText = input.label.innerText || input.label.textContent
      var inputType = elem.getAttribute('type')
      var inputNodename = elem.nodeName
      var inputTypes = ['text', 'search', 'email', 'number']

      input.section = labelText.replace(/\r?\n|\r/g, '')

      var isTextField = inputTypes.indexOf(inputType) !== -1 || inputNodename === 'TEXTAREA'
      var conditionalField = elem.closest('.govuk-checkboxes__conditional')
      var conditionalCheckbox = conditionalField && conditionalField.querySelector('[aria-controls="' + conditionalField.id + '"]')
      var conditionalCheckboxChecked = conditionalCheckbox && conditionalCheckbox.checked

      if (conditionalField && conditionalCheckboxChecked) {
        var conditionalCheckboxLabel = conditionalField.querySelector('[for="' + conditionalCheckbox.id + '"]')

        if (conditionalCheckboxLabel) {
          input.parentSection = conditionalCheckboxLabel.innerText
        }
      }

      if (conditionalCheckbox && !conditionalCheckboxChecked) {
        // don't include conditional field if condition not checked
        inputs.splice(i, 1)
      } else if (conditionalField && elem.hasAttribute('aria-controls')) {
        // don't include conditional field control in text
        inputs.splice(i, 1)
      } else if (elem.checked) {
        input.answer = labelText

        var fieldset = elem.closest('fieldset')

        if (fieldset) {
          var legend = fieldset.querySelector('legend')

          if (legend) {
            input.section = legend.innerText
          }
        }
      } else if (inputNodename === 'SELECT' && elem.querySelectorAll('option:checked')) {
        var selectedOptions = Array.from(elem.querySelectorAll('option:checked')).map(function (element) { return element.text })
        input.answer = this.useSelectCount ? selectedOptions.length : selectedOptions.join(',')
      } else if (isTextField && elem.value) {
        if (this.includeTextInputValues || elem.hasAttribute('data-ga4-form-include-input')) {
          if (this.useTextCount) {
            input.answer = elem.value.length
          } else {
            var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()
            input.answer = PIIRemover.stripPIIWithOverride(elem.value, true, true)
          }
        } else {
          // if recording JSON and text input not allowed
          // set the specific answer to '[REDACTED]'
          if (this.recordJson) {
            input.answer = '[REDACTED]'
          } else {
            this.redacted = true
          }
        }
      } else {
        // remove the input from those gathered as it has no value
        inputs.splice(i, 1)
      }
    }
    return inputs
  }

  Ga4FormTracker.prototype.combineGivenAnswers = function (data) {
    var answers = this.recordJson ? {} : []

    for (var i = 0; i < data.length; i++) {
      var answer = data[i].answer

      if (answer) {
        if (this.recordJson) {
          var fieldSection = data[i].section
          var parentFieldSection = data[i].parentSection

          if (fieldSection) {
            if (parentFieldSection) {
              answers[parentFieldSection] = answers[parentFieldSection] || {}
              answers[parentFieldSection][fieldSection] = answers[parentFieldSection][fieldSection] || ''
              answers[parentFieldSection][fieldSection] += ((answers[parentFieldSection][fieldSection] ? ',' : '') + answer)
            } else {
              answers[fieldSection] = answers[fieldSection] || ''
              answers[fieldSection] += ((answers[fieldSection] ? ',' : '') + answer)
            }
          }
        } else {
          answers.push(answer)
        }
      }
    }
    // default behaviour for redacted text is to omit
    // answer and append '[REDACTED]' to final joined text
    // if JSON being recorded then prevent this as answer
    // will be already redacted
    if (this.redacted && !this.recordJson) {
      answers.push('[REDACTED]')
    }

    return this.recordJson ? JSON.stringify(answers) : answers.join(',')
  }

  Modules.Ga4FormTracker = Ga4FormTracker
})(window.GOVUK.Modules)
