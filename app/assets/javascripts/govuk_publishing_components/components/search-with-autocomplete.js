/* global accessibleAutocomplete, fetch */
//= require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  class GemSearchWithAutocomplete {
    constructor ($module) {
      this.$module = $module

      this.$originalInput = this.$module.querySelector('input')
      this.$inputWrapper = this.$module.querySelector('.js-search-input-wrapper')
      this.$form = this.$module.closest('form')

      this.sourceUrl = this.$module.getAttribute('data-source-url')
      this.sourceKey = this.$module.getAttribute('data-source-key')
    }

    init () {
      const configOptions = {
        element: this.$inputWrapper,
        id: this.$originalInput.id,
        name: this.$originalInput.name,
        inputClasses: this.$originalInput.classList,
        defaultValue: this.$originalInput.value,
        cssNamespace: 'gem-c-search-with-autocomplete',
        confirmOnBlur: false,
        showNoOptionsFound: false,
        source: this.getResults.bind(this),
        onConfirm: this.submitContainingForm.bind(this),
        templates: {
          suggestion: this.constructSuggestionHTMLString.bind(this)
        },
        tStatusNoResults: () => 'No search suggestions found',
        tStatusQueryTooShort: (minQueryLength) => `Type in ${minQueryLength} or more characters for search suggestions`,
        tStatusResults: (length, contentSelectedOption) => {
          const words = {
            result: (length === 1) ? 'search suggestion' : 'search suggestions',
            is: (length === 1) ? 'is' : 'are'
          }

          return `${length} ${words.result} ${words.is} available. ${contentSelectedOption}`
        },
        tAssistiveHint: () => 'When search suggestions are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.'
      }
      accessibleAutocomplete(configOptions)

      // The accessible-autocomplete component is meant to generate a new input element rather than enhancing an existing one, so we need to do some cleanup here.
      this.$autocompleteInput = this.$inputWrapper.querySelector(
        '.gem-c-search-with-autocomplete__input'
      )
      // Ensure the new input element generated by accessible-autocomplete has the correct type
      this.$autocompleteInput.setAttribute('type', 'search')
      // Remove the original input from the DOM
      this.$originalInput.parentNode.removeChild(this.$originalInput)
    }

    // Callback used by accessible-autocomplete to generate the HTML for each suggestion based on
    // the values returned from the source
    constructSuggestionHTMLString (result) {
      const sanitizedResult = this.sanitizeResult(result)
      const inputValue = this.$inputWrapper.querySelector('input').value.toLowerCase()

      const index = sanitizedResult.toLowerCase().indexOf(inputValue)

      let html = sanitizedResult
      if (index !== -1) {
        const before = sanitizedResult.slice(0, index)
        const match = sanitizedResult.slice(index, index + inputValue.length)
        const after = sanitizedResult.slice(index + inputValue.length)

        html = `${before}<mark class="gem-c-search-with-autocomplete__suggestion-highlight">${match}</mark>${after}`
      }

      return `
        <div class="gem-c-search-with-autocomplete__option-wrapper">
          <span class="gem-c-search-with-autocomplete__suggestion-icon"></span>
          <span class="gem-c-search-with-autocomplete__suggestion-text">${html}</span>
        </div>
      `
    }

    // Callback used by accessible-autocomplete to fetch results from the source
    getResults (query, populateResults) {
      const url = new URL(this.sourceUrl)
      url.searchParams.set('q', query)
      fetch(url, { headers: { Accept: 'application/json' } })
        .then(response => response.json())
        .then((data) => { populateResults(data[this.sourceKey]) })
        .catch(() => { populateResults([]) })
    }

    // Callback used by accessible-autocomplete to submit the containing form when a suggestion is
    // confirmed by the user (e.g. by pressing Enter or clicking on it)
    submitContainingForm (value) {
      if (this.$form) {
        // The accessible-autocomplete component calls this callback _before_ it updates its
        // internal state, so the value of the input field is not yet updated when this callback is
        // called. We need to force the value to be updated before submitting the form, but the rest
        // of the state can catch up later.
        this.$autocompleteInput.value = value

        if (this.$form.requestSubmit) {
          this.$form.requestSubmit()
        } else {
          // Fallback for certain Grade C browsers that don't support `requestSubmit`
          this.$form.submit()
        }
      }
    }

    // Sanitises a result coming back from the source to prevent XSS issues if the result happens to
    // contain HTML.
    sanitizeResult (value) {
      const scratch = document.createElement('div')
      scratch.textContent = value
      return scratch.innerHTML
    }
  }

  Modules.GemSearchWithAutocomplete = GemSearchWithAutocomplete
})(window.GOVUK.Modules)
