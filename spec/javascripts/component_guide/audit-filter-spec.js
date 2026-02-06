/* eslint-env jasmine */
/* global GOVUK */

describe('Audit component filtering', function () {
  var container
  var html =
    '<div data-audit-headings>' +
      '<div id="big" data-component-type="big">Big</div>' +
      '<div id="small" data-component-type="small">Small</div>' +
      '<div id="middling" data-component-type="middling">Middling</div>' +
    '</div>' +
    '<div data-audit-list>' +
      '<div data-application="content-data-admin">' +
        '<div data-component-type="big">yes</div>' +
        '<div data-component-type="small">yes</div>' +
        '<div data-component-type="middling">yes</div>' +
      '</div>' +
      '<div data-application="govuk_publishing_components">' +
        '<div data-component-type="big">yes</div>' +
        '<div data-component-type="small">yes</div>' +
        '<div data-component-type="middling"></div>' +
      '</div>' +
      '<div data-application="collections">' +
        '<div data-component-type="big">yes</div>' +
        '<div data-component-type="small"></div>' +
        '<div data-component-type="middling"></div>' +
      '</div>' +
      '<div data-application="govuk_publishing_components">' +
        '<div data-component-type="big"></div>' +
        '<div data-component-type="small"></div>' +
        '<div data-component-type="middling"></div>' +
      '</div>' +
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
    expect(select.checkVisibility()).toBe(true)
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

  it('displays column totals correctly for all rows', function () {
    var select = container.querySelector('.govuk-select')
    select.value = 'govuk_publishing_components'
    window.GOVUK.triggerEvent(select, 'change')
    expect(document.getElementById('big').innerText).toBe('Big (1)')
    expect(document.getElementById('small').innerText).toBe('Small (1)')
    expect(document.getElementById('middling').innerText).toBe('Middling (0)')

    select.value = 'all'
    window.GOVUK.triggerEvent(select, 'change')
    expect(document.getElementById('big').innerText).toBe('Big (3)')
    expect(document.getElementById('small').innerText).toBe('Small (2)')
    expect(document.getElementById('middling').innerText).toBe('Middling (1)')

    select.value = 'collections'
    window.GOVUK.triggerEvent(select, 'change')
    expect(document.getElementById('big').innerText).toBe('Big (1)')
    expect(document.getElementById('small').innerText).toBe('Small (0)')
    expect(document.getElementById('middling').innerText).toBe('Middling (0)')
  })
})
