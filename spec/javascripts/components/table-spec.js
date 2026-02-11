/* eslint-env jasmine */
/* global GOVUK */

describe('Table component', function () {
  'use strict'

  var container
  var element
  var filter
  var filterCount
  var searchInput
  var rows
  var message
  var table
  var hiddenClass

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
      '<div data-module="table">' +
        '<div class="js-gem-c-table__filter govuk-!-display-none">' +
          '<input name="filter">' +
          '<p id="filterCount" class="js-filter-count" data-count-text="results for the term entered"></p>' +
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

    document.body.appendChild(container)

    element = document.querySelector('[data-module="table"]')
    filter = document.querySelector('.js-gem-c-table__filter')
    filterCount = document.querySelector('.js-filter-count')
    searchInput = document.querySelector('input')
    rows = document.querySelectorAll('.js-govuk-table__row')
    message = document.querySelector('.js-gem-c-table__message')
    table = new GOVUK.Modules.Table(element)
    hiddenClass = table.hiddenClass

    spyOn(table, 'updateRows').and.callThrough()
    table.init()
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  describe('When the component is intialised', function () {
    it('Displays the filter section', function () {
      expect(filter.classList.contains(hiddenClass)).toBe(false)
    })

    it('Sets up the event listener', function () {
      window.GOVUK.triggerEvent(searchInput, 'input')
      expect(table.updateRows).toHaveBeenCalledTimes(1)
    })
  })

  describe('When the user inputs a value', function () {
    it('Hides all rows and displays a message when a non-matching term is input', function () {
      searchInput.value = 'a'
      window.GOVUK.triggerEvent(searchInput, 'input')
      expect(rows[0].classList.contains(hiddenClass)).toBe(true)
      expect(rows[1].classList.contains(hiddenClass)).toBe(true)
      expect(message.classList.contains(hiddenClass)).toBe(false)
      expect(filterCount.textContent).toEqual('0 results for the term entered')
    })

    it('Shows the correct rows and does not display a message when a matching term is input', function () {
      searchInput.value = 'b'
      window.GOVUK.triggerEvent(searchInput, 'input')
      expect(rows[0].classList.contains(hiddenClass)).toBe(false)
      expect(rows[1].classList.contains(hiddenClass)).toBe(true)
      expect(message.classList.contains(hiddenClass)).toBe(true)
      expect(filterCount.textContent).toEqual('1 results for the term entered')
    })

    it('Shows the correct rows when the case of the input term differs from the table row content', function () {
      searchInput.value = 'OP'
      window.GOVUK.triggerEvent(searchInput, 'input')
      expect(rows[0].classList.contains(hiddenClass)).toBe(true)
      expect(rows[1].classList.contains(hiddenClass)).toBe(false)
      expect(filterCount.textContent).toEqual('1 results for the term entered')
    })

    it('Shows all the rows when the input is cleared', function () {
      searchInput.value = 'k'
      window.GOVUK.triggerEvent(searchInput, 'input')
      expect(rows[0].classList.contains(hiddenClass)).toBe(true)
      expect(rows[1].classList.contains(hiddenClass)).toBe(false)
      expect(filterCount.textContent).toEqual('1 results for the term entered')

      searchInput.value = ''
      window.GOVUK.triggerEvent(searchInput, 'input')
      expect(rows[0].classList.contains(hiddenClass)).toBe(false)
      expect(rows[1].classList.contains(hiddenClass)).toBe(false)
      expect(filterCount.textContent).toEqual('2 results for the term entered')
    })
  })
})
