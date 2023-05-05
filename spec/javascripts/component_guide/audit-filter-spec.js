/* eslint-env jasmine */
/* global GOVUK */

describe('Audit component filtering', function () {
  var container
  var html =
    '<div data-audit-list>' +
      '<div data-application="content-data-admin"></div>' +
      '<div data-application="govuk_publishing_components"></div>' +
      '<div data-application="collections"></div>' +
      '<div data-application="govuk_publishing_components"></div>' +
    '</div>'

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    new GOVUK.Modules.AuditFilter(container).init()
  })

  afterEach(function () {
    container.remove()
  })

  it('creates expected elements', function () {
    var select = container.querySelector('.govuk-select')
    expect(select).toBeVisible()
    expect(select.querySelectorAll('option').length).toBe(4)
  })

  it('shows selected rows', function () {
    var select = container.querySelector('.govuk-select')
    select.value = 'govuk_publishing_components'
    window.GOVUK.triggerEvent(select, 'change')

    var rows = container.querySelectorAll('[data-application][hidden="true"]')
    expect(rows.length).toBe(2)

    select.value = 'all'
    window.GOVUK.triggerEvent(select, 'change')

    rows = container.querySelectorAll('[data-application][hidden="true"]')
    expect(rows.length).toBe(0)
  })
})
