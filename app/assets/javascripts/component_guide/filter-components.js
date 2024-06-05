(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.FilterComponents = function filterList (searchTerm) {
    var itemsToFilter = document.querySelectorAll('.component-list li')

    for (var i = 0; i < itemsToFilter.length; i++) {
      var currentComponent = itemsToFilter[i]
      var componentText = currentComponent.innerText.toLowerCase()

      if (componentText.includes(searchTerm.toLowerCase())) {
        currentComponent.classList.remove('component-guide-hidden')
      } else {
        currentComponent.classList.add('component-guide-hidden')
      }
    }
  }

  var formElement = document.querySelector('[data-module=filter-components]')

  if (formElement) {
    var searchField = formElement.querySelector('input')

    // We don't want the form to submit/refresh the page on enter key
    formElement.addEventListener('submit', function (e) { e.preventDefault() })

    searchField.addEventListener('input', function (e) {
      var searchTerm = searchField.value
      window.GOVUK.FilterComponents(searchTerm)
    })

    // trigger search if search query exists in query string on page load
    window.GOVUK.FilterComponents(searchField.value)
  }
})()
