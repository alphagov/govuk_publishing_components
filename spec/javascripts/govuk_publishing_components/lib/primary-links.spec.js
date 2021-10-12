/* global describe it expect beforeEach spyOn */

describe('primary-links', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var shortList, mediumList, container

  beforeEach(function () {
    shortList = document.createElement('ul')
    mediumList = document.createElement('ul')
    container = document.createElement('div')

    shortList.innerHTML = '<li class="primary">one</li><li>two</li>'
    mediumList.innerHTML = '<li class="primary">one</li><li>two</li><li>three</li>'

    container.appendChild(shortList)
    container.appendChild(mediumList)
  })

  it('visually hides extra links', function () {
    new GOVUK.PrimaryList(mediumList, '.primary') // eslint-disable-line no-new

    expect(mediumList.querySelectorAll('.primary-links--display-none').length).toBe(2)
  })

  it('creates appropriate toggle text', function () {
    var short = new GOVUK.PrimaryList(shortList, '.primary')
    var medium = new GOVUK.PrimaryList(mediumList, '.primary')

    expect(short.toggleText()).toEqual('+1 other')
    expect(medium.toggleText()).toEqual('+2 others')
  })

  it('add a toggle link', function () {
    new GOVUK.PrimaryList(mediumList, '.primary') // eslint-disable-line no-new

    expect(container.querySelectorAll('a').length).toBe(1)
  })

  it('show extra links when toggled', function () {
    var list = new GOVUK.PrimaryList(mediumList, '.primary')
    var event = { preventDefault: function () {} }
    spyOn(event, 'preventDefault')
    spyOn(list, 'showExtraLinks')

    list.toggleLinks(event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(list.showExtraLinks).toHaveBeenCalled()
  })

  it('only adds toggle if more than one extra link', function () {
    new GOVUK.PrimaryList(shortList, '.primary') // eslint-disable-line no-new
    new GOVUK.PrimaryList(mediumList, '.primary') // eslint-disable-line no-new

    expect(shortList.querySelectorAll('.primary-links--display-none').length).toBe(0)
    expect(mediumList.querySelectorAll('.primary-links--display-none').length).toBe(2)
  })
})
