/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('An option select component', function () {
  'use strict'

  function optionSelectWithAttrs (attrs) {
<<<<<<< HEAD
    return '<div class="gem-c-option-select" ' + attrs + '>' +
      '<h2 class="gem-c-option-select__heading js-container-heading">' +
        '<span class="gem-c-option-select__title js-container-button">Hello World</span>' +
=======
    return '<div class="app-c-option-select" ' + attrs + '>' +
      '<h2 class="app-c-option-select__heading js-container-heading">' +
        '<span class="app-c-option-select__title js-container-button">Hello World</span>' +
>>>>>>> f5da6cfdd (Add GA4 tracking to finder filters expanding/collapsing)
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

  var $element
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
    $('body').find('.gem-c-option-select').remove()
  })

  describe('on load', function () {
    it('instantiates a closed option-select if data-closed-on-load is true', function () {
      var $closedOnLoadFixture = $(optionSelectWithAttrs('data-closed-on-load=true'))
      $('body').append($closedOnLoadFixture)

      new GOVUK.Modules.OptionSelect($closedOnLoadFixture[0]).init()

      expect($closedOnLoadFixture.find('button').attr('aria-expanded')).toBe('false')
    })

    it('instantiates an open option-select if data-closed-on-load is false', function () {
      var $openOnLoadFixture = $(optionSelectWithAttrs('data-closed-on-load=false'))
      $('body').append($openOnLoadFixture)

      new GOVUK.Modules.OptionSelect($openOnLoadFixture[0]).init()

      expect($openOnLoadFixture.find('button').attr('aria-expanded')).toBe('true')
      expect($('body').find('.js-options-container').is(':visible')).toBe(true)
    })

    it('instantiates an open option-select if data-closed-on-load is not present', function () {
      var $openOnLoadFixture = $(optionSelectWithAttrs(''))
      $('body').append($openOnLoadFixture)

      new GOVUK.Modules.OptionSelect($openOnLoadFixture[0]).init()

      expect($openOnLoadFixture.find('button').attr('aria-expanded')).toBe('true')
      expect($('body').find('.js-options-container').is(':visible')).toBe(true)
    })

    it('sets the height of the options container as part of initialisation', function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      new GOVUK.Modules.OptionSelect($element.querySelector('.gem-c-option-select')).init()

      expect($($element).find('.js-options-container').attr('style')).toContain('height')
    })

    it('doesn\'t set the height of the options container as part of initialisation if closed-on-load is true', function () {
      var $closedOnLoadFixture = $(optionSelectWithAttrs('data-closed-on-load=true'))

      new GOVUK.Modules.OptionSelect($closedOnLoadFixture[0]).init()

      expect($closedOnLoadFixture.find('.js-options-container').attr('style')).not.toContain('height')
    })

    it('replaces the `span.gem-c-option-select__title` with a button', function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      new GOVUK.Modules.OptionSelect($element.querySelector('.gem-c-option-select')).init()

      expect($($element).find('button')).toBeDefined()
    })

<<<<<<< HEAD
    it('accepts data attributes to be applied to the button element', function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      var buttonAttrs = {
        test_attribute_with_many_underscores: 'oh yes',
        ga4_event: {
          event_name: 'select_content',
          type: 'finder'
        }
      }
      $element.querySelector('.gem-c-option-select').setAttribute('data-button-data-attributes', JSON.stringify(buttonAttrs))

      new GOVUK.Modules.OptionSelect($element.querySelector('.gem-c-option-select')).init()
      expect($($element).find('.gem-c-option-select__button').attr('data-test-attribute-with-many-underscores')).toBe('oh yes')
      expect($($element).find('.gem-c-option-select__button').attr('data-ga4-event')).toBe(JSON.stringify(buttonAttrs.ga4_event))
    })

    it('does not error if invalid data attributes are passed for the button element', function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      $element.querySelector('.gem-c-option-select').setAttribute('data-button-data-attributes', 'not JSON')

      new GOVUK.Modules.OptionSelect($element.querySelector('.gem-c-option-select')).init()
      expect($($element).find('.gem-c-option-select__button').attr('data-test-attribute-with-many-underscores')).toBe(undefined)
=======
    it('adds GA4 event tracking to the button', function () {
      var $ga4Fixture = $(optionSelectWithAttrs('data-ga4-index=\'{"index_section":1, "index_section_count": 3}\''))
      $('body').append($ga4Fixture)

      new GOVUK.Modules.OptionSelect($ga4Fixture[0]).init()
      window.GOVUK.triggerEvent(window, 'ga4-filter-indexes-added')

      var expected = JSON.stringify({
        event_name: 'select_content',
        type: 'finder',
        section: 'Hello World',
        index: {
          index_section: 1,
          index_section_count: 3
        }
      })

      expect($ga4Fixture.find('button').attr('data-ga4-event')).toEqual(expected)
>>>>>>> f5da6cfdd (Add GA4 tracking to finder filters expanding/collapsing)
    })
  })

  describe('toggleOptionSelect', function () {
    beforeEach(function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      $('body').append($element)

      optionSelect = new GOVUK.Modules.OptionSelect($element.querySelector('.gem-c-option-select'))
      optionSelect.init()
    })

    it('calls optionSelect.close() if the optionSelect is currently open', function () {
      $($element).find('.gem-c-option-select').removeClass('js-closed')
      spyOn(optionSelect, 'close')
      optionSelect.toggleOptionSelect(jQuery.Event('click'))
      expect(optionSelect.close.calls.count()).toBe(1)
    })

    it('calls optionSelect.open() if the optionSelect is currently closed', function () {
      $($element).find('.gem-c-option-select').addClass('js-closed')
      spyOn(optionSelect, 'open')
      optionSelect.toggleOptionSelect(jQuery.Event('click'))
      expect(optionSelect.open.calls.count()).toBe(1)
    })
  })

  describe('when the open/close button is clicked', function () {
    beforeEach(function () {
      $element = document.createElement('div')
      $element.innerHTML = html
      $('body').append($element)

      new GOVUK.Modules.OptionSelect($element.querySelector('.gem-c-option-select')).init()
    })

    it('closes and opens the option select', function () {
      var $button = $($element).find('button')
      $button.click()
      expect($($element).find('.gem-c-option-select').hasClass('js-closed')).toBe(true)

      $button.click()
      expect($($element).find('.gem-c-option-select').hasClass('js-closed')).toBe(false)
    })

    it('updates aria-expanded accordingly', function () {
      var $button = $($element).find('button')
      $button.click()
      expect($($element).find('button').attr('aria-expanded')).toBe('false')

      $button.click()
      expect($($element).find('button').attr('aria-expanded')).toBe('true')
    })
  })

  describe('isCheckboxVisible', function () {
    var firstCheckbox, lastCheckbox

    beforeEach(function () {
      $element = $(html)
      $('body').append($element)

      optionSelect = new GOVUK.Modules.OptionSelect($element.find('.gem-c-option-select')[0])
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
      $element = $(html)
      $('body').append($element)
      optionSelect = new GOVUK.Modules.OptionSelect($element.find('.gem-c-option-select')[0])
      optionSelect.init()
    })

    it('returns all the checkboxes if the container doesn\'t overflow', function () {
      expect(optionSelect.$allCheckboxes.length).toBe(optionSelect.getVisibleCheckboxes().length)
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
    var $checkboxList, $checkboxListInner

    beforeEach(function () {
      $element = $(html)
      $('body').append($element)

      optionSelect = new GOVUK.Modules.OptionSelect($element.find('.gem-c-option-select')[0])

      // Set some visual properties which are done in the CSS IRL
      $checkboxList = $element.find('.js-options-container')
      $checkboxList.css({
        height: 200,
        position: 'relative',
        overflow: 'scroll'
      })
      $checkboxList.find('label').css({
        display: 'block'
      })

      $checkboxListInner = $checkboxList.find(' > .js-auto-height-inner')
      optionSelect.init()
    })

    it('expands the checkbox-container to fit checkbox list if the list is < 50px larger than the container', function () {
      $checkboxListInner.height(201)
      optionSelect.setupHeight()

      // Wrapping HTML should adjust to fit inner height
      // but we add 1px because some browsers still add a scrollbar
      expect($checkboxList.height()).toBe($checkboxListInner.height() + 1)
    })

    it('expands the checkbox-container just enough to cut the last visible item in half horizontally, if there are many items', function () {
      $checkboxList.css({
        'max-height': 200,
        width: 600
      })
      optionSelect.setupHeight()

      // Wrapping HTML should not stretch as 251px is too big.
      expect($checkboxList.height()).toBeGreaterThan(100)
    })
  })

  describe('initialising when the parent is hidden', function () {
    beforeEach(function () {
      var $wrapper = $('<div/>').addClass('wrapper').html(html)
      $('body').append($wrapper)
      $wrapper.hide()

      optionSelect = new GOVUK.Modules.OptionSelect($wrapper.find('.gem-c-option-select')[0])
      optionSelect.init()
    })

    afterEach(function () {
      $('.wrapper').remove()
    })

    it('sets the height of the container sensibly', function () {
      var containerHeight = $('body').find('.js-options-container').height()
      expect(containerHeight).toBe(201)
    })
  })

  describe('initialising when the parent is hidden and data-closed-on-load is true', function () {
    beforeEach(function () {
      $element = $(html)
      $element.attr('data-closed-on-load', true)
      var $wrapper = $('<div/>').addClass('wrapper').hide().html($element)
      $('body').append($wrapper)
      optionSelect = new GOVUK.Modules.OptionSelect($element.find('.gem-c-option-select')[0])
      optionSelect.init()
    })

    afterEach(function () {
      $('.wrapper').remove()
    })

    it('sets the height of the container sensibly when the option select is opened', function () {
      $('.wrapper').show()
      $($element).find('button').click()

      var containerHeight = $('.js-options-container').height()
      expect(containerHeight).toBeGreaterThan(200)
      expect(containerHeight).toBeLessThan(550)
    })
  })

  describe('filtering checkboxes', function () {
    var $filterInput, $count

    beforeEach(function () {
      $element = $(html)
      var filterMarkup =
            '&lt;label for=&quot;input-b7f768b7&quot; class=&quot;gem-c-label govuk-label&quot;&gt;' +
              'Filter Countries' +
            '&lt;/label&gt;' +
            '&lt;input name=&quot;option-select-filter&quot; class=&quot;gem-c-input gem-c-option-select__filter-input govuk-input&quot; id=&quot;input-b7f768b7&quot; type=&quot;text&quot; aria-describedby=&quot;checkboxes-9b7ecc25-count&quot; aria-controls=&quot;checkboxes-9b7ecc25&quot;&gt;'

      var filterSpan = '<span id="checkboxes-9b7ecc25-count" class="gem-c-option-select__count govuk-visually-hidden" aria-live="polite" data-single="option found" data-multiple="options found" data-selected="selected"></span>'

      $element.find('.gem-c-option-select').attr('data-filter-element', filterMarkup)
      $element.find('.gem-c-checkboxes').prepend($(filterSpan))
      $('body').append($element)
      optionSelect = new GOVUK.Modules.OptionSelect($element.find('.gem-c-option-select')[0])
      optionSelect.init()

      jasmine.clock().install()
      $filterInput = document.querySelector('[name="option-select-filter"]')
      $count = $('#checkboxes-9b7ecc25-count')
    })

    afterEach(function () {
      jasmine.clock().uninstall()
    })

    it('filters the checkboxes and updates the filter count correctly', function () {
      expect($('.govuk-checkboxes__item:visible').length).toBe(12)

      $filterInput.value = 'in'
      window.GOVUK.triggerEvent($filterInput, 'keyup')

      jasmine.clock().tick(400)
      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(5)
      expect($count.text()).toBe('5 options found, 0 selected')

      $filterInput.value = 'ind'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)
      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(2)
      expect($count.html()).toBe('2 options found, 0 selected')

      $filterInput.value = 'shouldnotmatchanything'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)
      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(0)
      expect($count.html()).toBe('0 options found, 0 selected')
    })

    it('prevents form submission if the key is Enter', function () {
      $filterInput.addEventListener('keyup', function (event) {
        expect(event.defaultPrevented).toBe(true)
      })

      window.GOVUK.triggerEvent($filterInput, 'keyup', { keyCode: 13, cancelable: true })
    })

    it('does not prevent keypresses other than Enter', function () {
      $filterInput.addEventListener('keyup', function (event) {
        expect(event.defaultPrevented).toBe(false)
      })

      window.GOVUK.triggerEvent($filterInput, 'keyup', { keyCode: 65, cancelable: true }) // key is 'a'
    })

    it('shows checked checkboxes regardless of whether they match the filter', function () {
      $('#building-and-construction').prop('checked', true).change()
      $('#chemicals').prop('checked', true).change()
      jasmine.clock().tick(100)

      $filterInput.value = 'electronics'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(3)
      expect($count.html()).toBe('3 options found, 2 selected')

      $filterInput.value = 'shouldnotmatchanything'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(2)
      expect($count.html()).toBe('2 options found, 2 selected')
    })

    it('matches a filter regardless of text case', function () {
      $filterInput.value = 'electroNICS industry'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')

      $filterInput.value = 'Building and construction'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')
    })

    it('matches ampersands correctly', function () {
      $filterInput.value = 'Distribution & Service Industries'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')

      $filterInput.value = 'Distribution &amp; Service Industries'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(0)
      expect($count.html()).toBe('0 options found, 0 selected')
    })

    it('ignores whitespace around the user input', function () {
      $filterInput.value = '   Clothing, footwear and fashion    '
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')
    })

    it('ignores duplicate whitespace in the user input', function () {
      $filterInput.value = 'Clothing,     footwear      and      fashion'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')
    })

    it('ignores common punctuation characters', function () {
      $filterInput.value = 'closed organisation department for Fisheries War Widows pay Farmers rights sheep and goats Farmers rights cows & llamas'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')
    })

    it('normalises & and and', function () {
      $filterInput.value = 'cows & llamas'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')

      $filterInput.value = 'cows and llamas'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')
    })

    // there was a bug in cleanString() where numbers were being ignored
    it('does not strip out numbers', function () {
      $filterInput.value = '1st and 2nd Military Courts'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(1)
      expect($count.html()).toBe('1 option found, 0 selected')

      $filterInput.value = 'footwear and f23907234973204723094ashion'
      window.GOVUK.triggerEvent($filterInput, 'keyup')
      jasmine.clock().tick(400)

      expect($('.govuk-checkboxes__input:visible').length + $('.govuk-checkboxes__input:checked').length).toBe(0)
      expect($count.html()).toBe('0 options found, 0 selected')
    })
  })
})
