//= require libs/GlobalBarHelper.js

/* eslint-disable no-unused-vars */
function expectGlobalBarToShow () {
  expect($('html').hasClass('show-global-bar')).toBe(true)
}

function expectGlobalBarToBeHidden () {
  expect($('html').hasClass('show-global-bar')).toBe(false)
}

function expectGa4AttributeToExist () {
  expect($('#global-bar').attr('data-ga4-global-bar')).toBe('')
}

function expectGa4AttributeToNotExist () {
  expect($('#global-bar').attr('data-ga4-global-bar')).toBe(undefined)
}

function expectAdditionalSectionToBeVisible () {
  expect($('.global-bar-additional').hasClass('global-bar-additional--show')).toBe(true)
}

function expectAdditionalSectionToBeHidden () {
  expect($('.global-bar-additional').hasClass('global-bar-additional--show')).toBe(false)
}
