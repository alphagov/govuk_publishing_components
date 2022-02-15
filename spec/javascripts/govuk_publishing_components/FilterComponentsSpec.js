/* eslint-env jasmine */

var FilterComponents = window.GOVUK.FilterComponents

var form, list

function addFormInput () {
  form = document.createElement('form')
  form.setAttribute('data-module', 'filter-components')
  document.body.appendChild(form)
};

function removeFormInput () {
  document.body.removeChild(form)
}

function addComponents () {
  list = document.createElement('ul')
  list.classList.add('component-list')

  // Set up accordion component
  var accordionLi = document.createElement('li')
  var accordionLink = document.createElement('a')
  var accordionP = document.createElement('p')
  accordionLink.innerText = 'Accordion'
  accordionP.innerText = 'A group of expanding/collapsing sections'
  accordionLi.setAttribute('id', 'accordion')
  accordionLi.appendChild(accordionP)
  accordionLi.appendChild(accordionLink)

  // Set up back link component
  var backLinkLi = document.createElement('li')
  var backLink = document.createElement('a')
  var backLinkP = document.createElement('p')
  backLink.innerText = 'Back link'
  backLinkP.innerText = 'A link used to help users get back, useful when not using other navigation such as breadcrumbs'
  backLinkLi.setAttribute('id', 'back-link')
  backLinkLi.appendChild(backLinkP)
  backLinkLi.appendChild(backLink)

  list.appendChild(accordionLi)
  list.appendChild(backLinkLi)

  document.body.appendChild(list)
};

function removeComponents () {
  document.body.removeChild(list)
}

describe('FilterComponents', function () {
  beforeAll(function () {
    addFormInput()
    addComponents()
  })

  afterAll(function () {
    removeFormInput()
    removeComponents()
  })

  it('hides all components that do not match search criteria', function () {
    FilterComponents('Accordion')

    expect(document.getElementById('back-link').classList.toString()).toBe('component-guide-hidden')
  })

  it('shows all components that match search criteria', function () {
    FilterComponents('Accordion')

    expect(document.getElementById('accordion').classList.toString()).toBe('')
  })

  it('searches both the component name and description', function () {
    FilterComponents('navigation')

    expect(document.getElementById('back-link').classList.toString()).toBe('')
    expect(document.getElementById('accordion').classList.toString()).toBe('component-guide-hidden')
  })

  it('the search is not case-sensitive', function () {
    FilterComponents('ACCORDION')

    expect(document.getElementById('accordion').classList.toString()).toBe('')
    expect(document.getElementById('back-link').classList.toString()).toBe('component-guide-hidden')
  })
})
