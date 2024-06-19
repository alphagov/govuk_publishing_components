/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Checkboxes component', function () {
  function loadCheckboxesComponent () {
    new GOVUK.Modules.GemCheckboxes($('.gem-c-checkboxes')[0]).init()
  }

  var FIXTURE =
  '<div id="checkboxes-1ac8e5cf" class="gem-c-checkboxes govuk-form-group " data-module="gem-checkboxes">' +
     '<fieldset class="govuk-fieldset" aria-describedby="checkboxes-1ac8e5cf-hint ">' +
        '<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">' +
           '<h1 class="govuk-fieldset__heading">What is your favourite colour?</h1>' +
        '</legend>' +
        '<span id="checkboxes-1ac8e5cf-hint" class="govuk-hint">Select all that apply.</span>' +
        '<div class="govuk-checkboxes" data-nested="true">' +
           '<div class="govuk-checkboxes__item">' +
              '<input id="checkboxes-1ac8e5cf-0" name="favourite_colour" type="checkbox" value="red" class="govuk-checkboxes__input" data-test-exclusive>' +
              '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0">Red</label>' +
              '<div id="checkboxes-1ac8e5cf-nested-0" class="govuk-checkboxes--nested" data-parent="checkboxes-1ac8e5cf-0">' +
                '<div class="govuk-checkboxes__item">' +
                   '<input id="checkboxes-1ac8e5cf-0-0" name="favourite_colour" type="checkbox" value="light_red" class="govuk-checkboxes__input" data-controls="thing">' +
                   '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0-0">Light Red</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                   '<input id="checkboxes-1ac8e5cf-0-1" name="favourite_colour" type="checkbox" value="dark_red" class="govuk-checkboxes__input">' +
                   '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0-1">Dark Red</label>' +
                '</div>' +
              '</div>' +
           '</div>' +
           '<div class="govuk-checkboxes__item">' +
              '<input id="checkboxes-1ac8e5cf-1" name="favourite_colour" type="checkbox" value="blue" class="govuk-checkboxes__input" data-test-exclusive>' +
              '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1">Blue</label>' +
              '<div id="checkboxes-1ac8e5cf-nested-1" class="govuk-checkboxes--nested" data-parent="checkboxes-1ac8e5cf-1">' +
                '<div class="govuk-checkboxes__item">' +
                   '<input id="checkboxes-1ac8e5cf-1-0" name="favourite_colour" type="checkbox" value="light_blue" class="govuk-checkboxes__input" data-controls="thing2">' +
                   '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1-0">Light blue</label>' +
                '</div>' +
                '<div class="govuk-checkboxes__item">' +
                   '<input id="checkboxes-1ac8e5cf-1-1" name="favourite_colour" type="checkbox" value="dark_blue" class="govuk-checkboxes__input">' +
                   '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1-1">Dark blue</label>' +
                '</div>' +
              '</div>' +
           '</div>' +
           '<div class="govuk-checkboxes__item">' +
              '<input id="checkboxes-1ac8e5cf-2" name="favourite_colour" type="checkbox" value="other" class="govuk-checkboxes__input" data-behaviour="exclusive">' +
              '<label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-2">Other</label>' +
           '</div>' +
        '</div>' +
     '</fieldset>' +
  '</div>'

  var $parentCheckboxWrapper
  var $parentCheckbox
  var $nestedChildren
  var $checkboxesWrapper
  var $exclusiveOption
  var $nonExclusiveOptions

  beforeEach(function () {
    window.setFixtures(FIXTURE)
    loadCheckboxesComponent()

    $parentCheckboxWrapper = $('.govuk-checkboxes--nested:eq(0)').closest('.govuk-checkboxes__item')
    $parentCheckbox = $parentCheckboxWrapper.find('> .govuk-checkboxes__input')
    $nestedChildren = $parentCheckboxWrapper.find('.govuk-checkboxes--nested .govuk-checkboxes__input')
    $checkboxesWrapper = $('.gem-c-checkboxes')
    $exclusiveOption = $checkboxesWrapper.find('input[type=checkbox][data-test-exclusive]')
    $nonExclusiveOptions = $checkboxesWrapper.find('input[type=checkbox][data-behaviour="exclusive"]')
  })

  it('checking a parent checkbox checks all its children', function () {
    $parentCheckbox.click()

    expect($nestedChildren.length).toEqual($nestedChildren.filter(':checked').length)
  })

  it('checks parent when all children are selected', function () {
    $nestedChildren.each(function (idx, child) {
      $(child).click()
    })

    expect($parentCheckbox.is(':checked')).toEqual(true)
  })

  it('unchecks parent when one or more children are deselected', function () {
    $parentCheckbox.click()
    expect($nestedChildren.length).toEqual($nestedChildren.filter(':checked').length)
    expect($parentCheckbox.is(':checked')).toEqual(true)

    $nestedChildren.eq(0).click()
    expect($parentCheckbox.is(':checked')).toEqual(false)
  })

  it('applies aria-controls attributes if it finds data-controls attributes', function () {
    expect($('#checkboxes-1ac8e5cf-0-0.govuk-checkboxes__input').attr('aria-controls')).toBe('thing')
    expect($('#checkboxes-1ac8e5cf-1-0.govuk-checkboxes__input').attr('aria-controls')).toBe('thing2')
    expect($('#checkboxes-1ac8e5cf-0.govuk-checkboxes__input').attr('aria-controls')).toBe(undefined)
  })

  describe('with exclusive option', function () {
    it('unchecks non-exclusive options when exclusive option is checked', function () {
      $nonExclusiveOptions.first().click()
      $exclusiveOption.click()
      expect($nonExclusiveOptions.length).toEqual($nonExclusiveOptions.filter(':not(checked)').length)
      expect($exclusiveOption.is(':checked')).toEqual(true)
    })

    it('unchecks exclusive option when a non-exclusive option is checked', function () {
      $nonExclusiveOptions.first().click()
      expect($exclusiveOption.is(':checked')).toEqual(false)
    })
  })
})
