/* eslint-env jasmine */
/* global GOVUK */

describe('An option select component', function () {
  'use strict'

  function optionSelectWithAttrs (attrs = '') {
    return '<div class="gem-c-option-select" ' + attrs + '>' +
      '<h2 class="gem-c-option-select__heading js-container-heading">' +
        '<span class="gem-c-option-select__title js-container-button">Hello World</span>' +
      '</h2>' +
      '<div class="gem-c-option-select__container js-options-container">' +
        '<div class="gem-c-option-select__container-inner js-auto-height-inner">' +
          '<div id="checkboxes-9b7ecc25" class="gem-c-checkboxes govuk-form-group" data-module="checkboxes">' +
            '<fieldset class="govuk-fieldset">' +
              '<legend class="govuk-fieldset__legend govuk-fieldset__legend--m gem-c-checkboxes__legend--hidden">Please select all that apply</legend>' +
              '<div class="govuk-checkboxes"></div>' +
            '</fieldset>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  }

  function createFixture () {
    container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
  }

  function createFixtureWithAttrs (attrs = '') {
    container = document.createElement('div')
    container.innerHTML = optionSelectWithAttrs(attrs)
    document.body.appendChild(container)
  }

  function initModule () {
    var optionSelect = document.querySelector('.gem-c-option-select')
    new GOVUK.Modules.OptionSelect(optionSelect).init()
    return optionSelect
  }

  function convertPxStringToNumber (pxString) {
    return Number(pxString.split('px')[0])
  }

  function getCheckboxesNumber (checkboxInputs) {
    var visibleCheckboxInputs = checkboxInputs.filter((checkbox) => checkbox.checkVisibility())
    var checkedCheckboxes = checkboxInputs.filter((checkbox) => checkbox.checked)
    return visibleCheckboxInputs.length + checkedCheckboxes.length
  }

  var container
  var optionSelect
  /* eslint-disable */
  var html = '\
    <form>' +
    '<div class="gem-c-option-select" data-module="option-select" data-closed-on-load="false">' +
      '<h2 class="gem-c-option-select__heading js-container-heading">' +
        '<span class="gem-c-option-select__title js-container-button">' +
          'Market sector' +
        '</span>' +
      '</h2>' +
      '<div class="gem-c-option-select__container js-options-container">' +
        '<div class="gem-c-option-select__container-inner js-auto-height-inner">' +
          '<div id="checkboxes-9b7ecc25" class="gem-c-checkboxes govuk-form-group" data-module="checkboxes">' +
            '<fieldset class="govuk-fieldset">' +
              '<legend class="govuk-fieldset__legend govuk-fieldset__legend--m gem-c-checkboxes__legend--hidden">Please select all that apply</legend>' +
              '<div class="govuk-checkboxes">' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="aerospace" value="aerospace" class="govuk-checkboxes__input" />' +
                  '<label for="aerospace" class="govuk-label govuk-checkboxes__label">Aerospace</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="agriculture-environment-and-natural-resources" value="agriculture-environment-and-natural-resources" class="govuk-checkboxes__input" />' +
                  '<label for="agriculture-environment-and-natural-resources" class="govuk-label govuk-checkboxes__label">Agriculture, environment, natural resources, agriculture, environment, natural resources, agriculture, environment, natural resources, agriculture, environment, natural resources, agriculture, environment, natural resources, agriculture, environment and natural resources.</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="building-and-construction" value="building-and-construction" class="govuk-checkboxes__input" />' +
                  '<label for="building-and-construction" class="govuk-label govuk-checkboxes__label">Building and construction</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="chemicals" value="chemicals" class="govuk-checkboxes__input" />' +
                  '<label for="chemicals" class="govuk-label govuk-checkboxes__label">Chemicals</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="clothing-footwear-and-fashion" value="clothing-footwear-and-fashion" class="govuk-checkboxes__input" />' +
                  '<label for="clothing-footwear-and-fashion" class="govuk-label govuk-checkboxes__label">Clothing, footwear and fashion</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="defence" value="defence" class="govuk-checkboxes__input" />' +
                  '<label for="defence" class="govuk-label govuk-checkboxes__label">Defence</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="distribution-and-service-industries" value="distribution-and-service-industries" class="govuk-checkboxes__input" />' +
                  '<label for="distribution-and-service-industries" class="govuk-label govuk-checkboxes__label">Distribution &amp; Service Industries</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="electronics-industry" value="electronics-industry" class="govuk-checkboxes__input" />' +
                  '<label for="electronics-industry" class="govuk-label govuk-checkboxes__label">Electronics Industry</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="energy" value="energy" class="govuk-checkboxes__input" />' +
                  '<label for="energy" class="govuk-label govuk-checkboxes__label">Energy</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="engineering" value="engineering" class="govuk-checkboxes__input" />' +
                  '<label for="engineering" class="govuk-label govuk-checkboxes__label">Engineering</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="thatdepartment" value="thatdepartment" class="govuk-checkboxes__input" />' +
                  '<label for="thatdepartment" class="govuk-label govuk-checkboxes__label">Closed organisation: Department for Fisheries, War Widows\' pay, Farmers’ rights - sheep and goats, Farmer\'s rights – cows & llamas</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                  '<input type="checkbox" name="market_sector[]" id="militarycourts" value="militarycourts" class="govuk-checkboxes__input" />' +
                  '<label for="militarycourts" class="govuk-label govuk-checkboxes__label">1st and 2nd Military Courts</label>' +
                '</div>' +
              '</div>' +
            '</fieldset>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</form>'
  /* eslint-enable */

  afterEach(function () {
    document.body.removeChild(container)
  })

  describe('on load', function () {
    it('instantiates a closed option-select if data-closed-on-load is true', function () {
      createFixtureWithAttrs('data-closed-on-load=true')
      var optionSelect = initModule()

      expect(optionSelect.querySelector('button').getAttribute('aria-expanded')).toBe('false')
    })

    it('instantiates an open option-select if data-closed-on-load is false', function () {
      createFixtureWithAttrs('data-closed-on-load=false')
      var optionSelect = initModule()

      expect(optionSelect.querySelector('button').getAttribute('aria-expanded')).toBe('true')
      expect(document.body.querySelector('.js-options-container').checkVisibility()).toBe(true)
    })

    it('instantiates an open option-select if data-closed-on-load is not present', function () {
      createFixtureWithAttrs()
      var optionSelect = initModule()

      expect(optionSelect.querySelector('button').getAttribute('aria-expanded')).toBe('true')
      expect(document.body.querySelector('.js-options-container').checkVisibility()).toBe(true)
    })

    it('sets the height of the options container as part of initialisation', function () {
      createFixture()
      var optionSelect = initModule()

      expect(optionSelect.querySelector('.js-options-container').style).toContain('height')
    })

    it('doesn\'t set the height of the options container as part of initialisation if closed-on-load is true', function () {
      createFixtureWithAttrs('data-closed-on-load=true')
      var optionSelect = initModule()

      expect(optionSelect.querySelector('.js-options-container').style).not.toContain('height')
    })

    it('replaces the `span.gem-c-option-select__title` with a button', function () {
      createFixture()
      var optionSelect = initModule()

      expect(optionSelect.querySelector('button')).toBeDefined()
    })

    it('accepts data attributes to be applied to the button element', function () {
      createFixture()

      var buttonAttrs = {
        test_attribute_with_many_underscores: 'oh yes',
        ga4_event: {
          event_name: 'select_content',
          type: 'finder'
        }
      }

      container.querySelector('.gem-c-option-select').setAttribute('data-button-data-attributes', JSON.stringify(buttonAttrs))

      new GOVUK.Modules.OptionSelect(container.querySelector('.gem-c-option-select')).init()
      expect(container.querySelector('.gem-c-option-select__button').getAttribute('data-test-attribute-with-many-underscores')).toBe('oh yes')
      expect(container.querySelector('.gem-c-option-select__button').getAttribute('data-ga4-event')).toBe(JSON.stringify(buttonAttrs.ga4_event))
    })

    it('does not error if invalid data attributes are passed for the button element', function () {
      createFixture()

      container.querySelector('.gem-c-option-select').setAttribute('data-button-data-attributes', 'not JSON')

      new GOVUK.Modules.OptionSelect(container).init()

      var optionSelectButton = container.querySelector('.gem-c-option-select__button')
      var optionSelectButtonAttribute = optionSelectButton.getAttribute('data-test-attribute-with-many-underscores')

      expect(optionSelectButtonAttribute).toBeNull()
    })
  })

  describe('toggleOptionSelect', function () {
    beforeEach(function () {
      createFixture()

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()
    })

    it('calls optionSelect.close() if the optionSelect is currently open', function () {
      container.querySelector('.gem-c-option-select').classList.remove('js-closed')
      spyOn(optionSelect, 'close')

      var optionSelectButton = container.querySelector('.js-container-button')
      optionSelectButton.click()
      expect(optionSelect.close.calls.count()).toBe(1)
    })

    it('calls optionSelect.open() if the optionSelect is currently closed', function () {
      container.querySelector('.gem-c-option-select').classList.add('js-closed')
      spyOn(optionSelect, 'open')

      var optionSelectButton = container.querySelector('.js-container-button')
      optionSelectButton.click()
      expect(optionSelect.open.calls.count()).toBe(1)
    })
  })

  describe('when the open/close button is clicked', function () {
    beforeEach(function () {
      createFixture()

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()
    })

    it('closes and opens the option select', function () {
      var optionSelectButton = container.querySelector('button')
      optionSelectButton.click()
      expect(container.querySelector('.gem-c-option-select')).toHaveClass('js-closed')
      optionSelectButton.click()
      expect(container.querySelector('.gem-c-option-select')).not.toHaveClass('js-closed')
    })

    it('updates aria-expanded accordingly', function () {
      var optionSelectButton = container.querySelector('button')
      optionSelectButton.click()
      expect(container.querySelector('button').getAttribute('aria-expanded')).toBe('false')
      optionSelectButton.click()
      expect(container.querySelector('button').getAttribute('aria-expanded')).toBe('true')
    })
  })

  describe('isCheckboxVisible', function () {
    var firstCheckbox, lastCheckbox

    beforeEach(function () {
      createFixture()

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()
      optionSelect.setContainerHeight(100)
      firstCheckbox = optionSelect.$allCheckboxes[0]
      lastCheckbox = optionSelect.$allCheckboxes[optionSelect.$allCheckboxes.length - 1]
    })

    it('returns true if a label is visible', function () {
      expect(optionSelect.isCheckboxVisible(firstCheckbox)).toBe(true)
    })

    it('returns true if a label is outside its container', function () {
      expect(optionSelect.isCheckboxVisible(lastCheckbox)).toBe(false)
    })
  })

  describe('getvisibleCheckboxes', function () {
    var lastLabelForAttribute, lastVisibleLabelForAttribute

    beforeEach(function () {
      createFixture()

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()
    })

    it('only returns some of the first checkboxes if the container\'s dimensions are constricted', function () {
      optionSelect.setContainerHeight(100)

      var visibleCheckboxes = optionSelect.getVisibleCheckboxes()
      expect(visibleCheckboxes.length).toBeLessThan(optionSelect.$allCheckboxes.length)

      lastLabelForAttribute = optionSelect.$allCheckboxes[optionSelect.$allCheckboxes.length - 1].getElementsByClassName('govuk-checkboxes__input')[0].getAttribute('id')
      lastVisibleLabelForAttribute = visibleCheckboxes[visibleCheckboxes.length - 1].getAttribute('id')
      expect(lastLabelForAttribute).not.toBe(lastVisibleLabelForAttribute)
    })
  })

  describe('setupHeight', function () {
    var checkboxList, checkboxListInner

    beforeEach(function () {
      createFixture()

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))

      // Set some visual properties which are done in the CSS IRL
      checkboxList = container.querySelector('.js-options-container')
      checkboxList.style.cssText = "height: 180px; position: 'relative'; overflow: 'scroll'"
      checkboxList.querySelector('label').style.display = 'block'

      checkboxListInner = checkboxList.querySelector('.js-auto-height-inner')
      optionSelect.init()
    })

    it('expands the checkbox-container to fit checkbox list if the list is < 50px larger than the container', function () {
      checkboxListInner.style.height = '181px'
      optionSelect.setupHeight()

      var checkboxHeightNumber = convertPxStringToNumber(checkboxList.style.height)

      // Wrapping HTML should adjust to fit inner height
      expect(checkboxHeightNumber).toBeGreaterThan(convertPxStringToNumber(checkboxListInner.style.height))
      expect(checkboxHeightNumber).toBeLessThan(230)
    })

    it('expands the checkbox-container just enough to cut the last visible item in half horizontally, if there are many items', function () {
      checkboxList.style.cssText = 'max-height: 180px; width: 600px'
      optionSelect.setupHeight()

      var checkboxHeightNumber = convertPxStringToNumber(checkboxList.style.height)

      // Wrapping HTML should not stretch as 251px is too big.
      expect(checkboxHeightNumber).toBeGreaterThan(100)
    })
  })

  describe('initialising when the parent is hidden', function () {
    beforeEach(function () {
      createFixture()

      var parentDivElement = document.querySelector('body div')
      parentDivElement.style.display = 'none'

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()
    })

    it('sets the height of the container sensibly', function () {
      var optionSelectContainer = document.querySelector('.js-options-container')
      var containerHeight = convertPxStringToNumber(optionSelectContainer.style.height)
      expect(containerHeight).toBeGreaterThan(181)
      expect(containerHeight).toBeLessThan(250)
    })
  })

  describe('initialising when the parent is hidden and data-closed-on-load is true', function () {
    beforeEach(function () {
      createFixture()
      container.setAttribute('data-closed-on-load', true)

      var parentDivElement = document.querySelector('body div')
      parentDivElement.style.display = 'none'

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()
    })

    it('sets the height of the container sensibly when the option select is opened', function () {
      var parentDivElement = document.querySelector('body div')
      parentDivElement.style.display = 'block'
      container.querySelector('button').click()

      var optionSelectContainer = document.querySelector('.js-options-container')
      var containerHeight = convertPxStringToNumber(optionSelectContainer.style.height)
      expect(containerHeight).toBeGreaterThan(180)
      expect(containerHeight).toBeLessThan(550)
    })
  })

  describe('filtering checkboxes', function () {
    var filterInput
    var count
    var checkboxInputs
    var visibleCheckboxes

    beforeEach(function () {
      createFixture()

      var filterMarkup =
            '&lt;label for=&quot;input-b7f768b7&quot; class=&quot;gem-c-label govuk-label&quot;&gt;' +
              'Filter Countries' +
            '&lt;/label&gt;' +
            '&lt;input name=&quot;option-select-filter&quot; class=&quot;gem-c-input gem-c-option-select__filter-input govuk-input&quot; id=&quot;input-b7f768b7&quot; type=&quot;text&quot; aria-describedby=&quot;checkboxes-9b7ecc25-count&quot; aria-controls=&quot;checkboxes-9b7ecc25&quot;&gt;'

      var filterSpan = document.createElement('span')
      filterSpan.id = 'checkboxes-9b7ecc25-count'
      filterSpan.classList.add('gem-c-option-select__count', 'govuk-visually-hidden')
      filterSpan.setAttribute('aria-live', 'polite')
      filterSpan.setAttribute('data-single', 'option found')
      filterSpan.setAttribute('data-multiple', 'options found')
      filterSpan.setAttribute('data-selected', 'selected')

      container.querySelector('.gem-c-option-select').setAttribute('data-filter-element', filterMarkup)
      container.querySelector('.gem-c-checkboxes').prepend(filterSpan)

      optionSelect = new GOVUK.Modules.OptionSelect(document.querySelector('.gem-c-option-select'))
      optionSelect.init()

      jasmine.clock().install()
      filterInput = document.querySelector('[name="option-select-filter"]')
      count = document.querySelector('#checkboxes-9b7ecc25-count')
    })

    afterEach(function () {
      jasmine.clock().uninstall()
    })

    it('filters the checkboxes and updates the filter count correctly', function () {
      var checkboxes = Array.from(document.querySelectorAll('.govuk-checkboxes__item'))
      visibleCheckboxes = checkboxes.filter((checkbox) => checkbox.checkVisibility())
      expect(visibleCheckboxes.length).toBe(12)

      filterInput.value = 'in'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(5)
      expect(count.textContent).toBe('5 options found, 0 selected')

      filterInput.value = 'ind'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(2)
      expect(count.textContent).toBe('2 options found, 0 selected')

      filterInput.value = 'shouldnotmatchanything'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(0)
      expect(count.textContent).toBe('0 options found, 0 selected')
    })

    it('prevents form submission if the key is Enter', function () {
      filterInput.addEventListener('keyup', function (event) {
        expect(event.defaultPrevented).toBe(true)
      })

      window.GOVUK.triggerEvent(filterInput, 'keyup', { keyCode: 13, cancelable: true })
    })

    it('does not prevent keypresses other than Enter', function () {
      filterInput.addEventListener('keyup', function (event) {
        expect(event.defaultPrevented).toBe(false)
      })

      window.GOVUK.triggerEvent(filterInput, 'keyup', { keyCode: 65, cancelable: true }) // key is 'a'
    })

    it('shows checked checkboxes regardless of whether they match the filter', function () {
      document.querySelector('#building-and-construction').checked = true
      document.querySelector('#chemicals').checked = true
      jasmine.clock().tick(100)

      filterInput.value = 'electronics'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(3)
      expect(count.textContent).toBe('3 options found, 2 selected')

      filterInput.value = 'shouldnotmatchanything'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(2)
      expect(count.textContent).toBe('2 options found, 2 selected')
    })

    it('matches a filter regardless of text case', function () {
      filterInput.value = 'electroNICS industry'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')

      filterInput.value = 'Building and construction'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')
    })

    it('matches ampersands correctly', function () {
      filterInput.value = 'Distribution & Service Industries'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')

      filterInput.value = 'Distribution &amp; Service Industries'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(0)
      expect(count.textContent).toBe('0 options found, 0 selected')
    })

    it('ignores whitespace around the user input', function () {
      filterInput.value = '   Clothing, footwear and fashion    '
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')
    })

    it('ignores duplicate whitespace in the user input', function () {
      filterInput.value = 'Clothing,     footwear      and      fashion'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')
    })

    it('ignores common punctuation characters', function () {
      filterInput.value = 'closed organisation department for Fisheries War Widows pay Farmers rights sheep and goats Farmers rights cows & llamas'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')
    })

    it('normalises & and and', function () {
      filterInput.value = 'cows & llamas'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')

      filterInput.value = 'cows and llamas'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')
    })

    // there was a bug in cleanString() where numbers were being ignored
    it('does not strip out numbers', function () {
      filterInput.value = '1st and 2nd Military Courts'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      checkboxInputs = Array.from(document.querySelectorAll('.govuk-checkboxes__input'))
      expect(getCheckboxesNumber(checkboxInputs)).toBe(1)
      expect(count.textContent).toBe('1 option found, 0 selected')

      filterInput.value = 'footwear and f23907234973204723094ashion'
      window.GOVUK.triggerEvent(filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect(getCheckboxesNumber(checkboxInputs)).toBe(0)
      expect(count.textContent).toBe('0 options found, 0 selected')
    })
  })
})
