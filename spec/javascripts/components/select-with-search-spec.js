/* eslint-env jasmine */
/* global GOVUK */

describe('GOVUK.Modules.SelectWithSearch', function () {
  let component, module, select

  function getOptions () {
    const items = component.querySelectorAll(
      '.choices__list .choices__item--choice'
    )
    return Array.from(items).map((item) => item.textContent.trim())
  }

  describe('with a simple select', () => {
    beforeEach(function () {
      component = document.createElement('div')
      component.innerHTML = `
        <label for="example">Choose a colour</label>
        <select id="example">
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      `
      select = component.querySelector('select')

      module = new GOVUK.Modules.SelectWithSearch(select)
      module.init()
    })

    it('initialises Choices.js', function () {
      expect(
        component.querySelector('.choices[data-type="select-one"]')
      ).toBeTruthy()
    })

    it('does not reorder the provided options', () => {
      expect(getOptions()).toEqual(['Red', 'Green', 'Blue'])
    })

    it('shows a search field', () => {
      expect(component.querySelector('input[type=search]').placeholder).toEqual(
        'Search in list'
      )
    })
  })

  describe('select with `aria-describedby`', () => {
    const ariaDescribedBy = 'hint-id error-id'

    beforeEach(function () {
      component = document.createElement('div')
      component.innerHTML = `
        <label for="example">Choose a colour</label>
        <select aria-describedby="${ariaDescribedBy}" id="example">
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      `
      select = component.querySelector('select')

      module = new GOVUK.Modules.SelectWithSearch(select)
      module.init()
    })

    it('includes `aria-describedby` of select in `aria-labelledby`', () => {
      expect(
        component.querySelector(`[aria-labelledby="example-label ${ariaDescribedBy}"]`)
      ).toBeTruthy()
    })
  })

  describe('simple select which can be left blank', () => {
    beforeEach(function () {
      component = document.createElement('div')
      component.innerHTML = `
        <label for="example">Choose a colour</label>
        <select id="example">
          <option value=""></option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      `
      select = component.querySelector('select')
      module = new GOVUK.Modules.SelectWithSearch(select)
      module.init()
    })

    it('shows a "Select one" placeholder', () => {
      expect(
        component.querySelector('.choices__placeholder').textContent
      ).toEqual('Select one')
    })
  })

  describe('with grouped options', () => {
    beforeEach(function () {
      component = document.createElement('div')
      component.innerHTML = `
        <label for="example">Choose a city</label>
        <select id="example">
          <optgroup label="England">
            <option value="bath">Bath</option>
            <option value="bristol">Bristol</option>
            <option value="london">London</option>
            <option value="manchester">Manchester</option>
          </optgroup>
          <optgroup label="Ireland">
            <option value="bangor">Bangor</option>
            <option value="belfast">Belfast</option>
          </optgroup>
          <optgroup label="Scotland">
            <option value="dundee">Dundee</option>
            <option value="edinburgh">Edinburgh</option>
            <option value="glasgow">Glasgow</option>
          </optgroup>
          <optgroup label="Wales">
            <option value="cardiff">Cardiff</option>
            <option value="swansea">Swansea</option>
          </optgroup>
        </select>
      `
      select = component.querySelector('select')

      module = new GOVUK.Modules.SelectWithSearch(select)
      module.init()
    })

    it('renders groups and options', () => {
      const list = component.querySelector('.choices__list--dropdown')
      expect(list.querySelectorAll('.choices__group').length).toEqual(4)
      expect(list.querySelectorAll('.choices__item--choice').length).toEqual(11)
    })
  })
})
