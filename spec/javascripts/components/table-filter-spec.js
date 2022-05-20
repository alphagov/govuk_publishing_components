/* eslint-env jasmine */
/* global GOVUK */

describe('Table Filter component', function () {
  'use strict'

  var element
  var filter
  var searchInput
  var rows
  var message
  var tableFilter
  var hiddenClass
  var event
  var FIXTURE =
    '<div data-module="table-filter">' +
      '<div class="js-gem-c-table__filter govuk-!-display-none">' +
        '<input name="filter">' +
      '</div>' +
      '<table>' +
        '<thead></thead>' +
        '<tbody class="govuk-table__body">' +
          '<tr class="js-govuk-table__row">' +
            '<td>bcd</td>' +
            '<td>efg</td>' +
            '<td>hio</td>' +
          '</tr>' +
          '<tr class="js-govuk-table__row">' +
            '<td>klm</td>' +
            '<td>nop</td>' +
            '<td>£35</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>' +
      '<p class="js-gem-c-table__message govuk-!-display-none">That search returns no results.</p>' +
    '</div>'

  beforeAll(function () {
    window.setFixtures(FIXTURE)

    element = document.querySelector('[data-module="table-filter"]')
    filter = document.querySelector('.js-gem-c-table__filter')
    searchInput = document.querySelector('input')
    rows = document.querySelectorAll('.js-govuk-table__row')
    message = document.querySelector('.js-gem-c-table__message')
    tableFilter = new GOVUK.Modules.TableFilter(element)
    hiddenClass = tableFilter.hiddenClass
    event = new window.Event('input')
  })

  describe('When the component is intialised', function () {
    beforeAll(function () {
      spyOn(tableFilter, 'updateRows')
      tableFilter.init()
    })

    it('Displays the filter section', function () {
      expect(filter.classList.contains(hiddenClass)).toBe(false)
    })

    it('Sets up the event listener', function () {
      searchInput.dispatchEvent(event)
      expect(tableFilter.updateRows).toHaveBeenCalledTimes(1)
    })
  })

  describe('When the user inputs a value', function () {
    beforeAll(function () {
      tableFilter.init()
    })

    it('Hides all rows and displays a message when a non-matching term is input', function () {
      searchInput.value = 'a'
      searchInput.dispatchEvent(event)
      expect(rows[0].classList.contains(hiddenClass)).toBe(true)
      expect(rows[1].classList.contains(hiddenClass)).toBe(true)
      expect(message.classList.contains(hiddenClass)).toBe(false)
    })

    it('Shows the correct rows and does not display a message when a matching term is input', function () {
      searchInput.value = 'b'
      searchInput.dispatchEvent(event)
      expect(rows[0].classList.contains(hiddenClass)).toBe(false)
      expect(rows[1].classList.contains(hiddenClass)).toBe(true)
      expect(message.classList.contains(hiddenClass)).toBe(true)
    })

    it('Shows the correct rows when the case of the input term differs from the table row content', function () {
      searchInput.value = 'OP'
      searchInput.dispatchEvent(event)
      expect(rows[0].classList.contains(hiddenClass)).toBe(true)
      expect(rows[1].classList.contains(hiddenClass)).toBe(false)
    })

    it('Shows all the rows when the input is cleared', function () {
      searchInput.value = ''
      searchInput.dispatchEvent(event)
      expect(rows[0].classList.contains(hiddenClass)).toBe(false)
      expect(rows[1].classList.contains(hiddenClass)).toBe(false)
    })
  })
})
