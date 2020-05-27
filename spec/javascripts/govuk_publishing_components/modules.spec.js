/* eslint-env jasmine, jquery */

var $ = window.jQuery

describe('GOVUK Modules', function () {
  'use strict'
  var GOVUK = window.GOVUK

  it('finds modules', function () {
    var module = $('<div data-module="a-module"></div>')
    $('body').append(module)

    expect(GOVUK.modules.find().length).toBe(1)
    expect(GOVUK.modules.find()[0].getAttribute('data-module')).toBe('a-module')
    module.remove()
  })

  it('finds modules in a container', function () {
    var module = $('<div data-module="a-module"></div>')
    var container = $('<div></div>').append(module)

    expect(GOVUK.modules.find(container).length).toBe(1)
    expect(GOVUK.modules.find(container)[0].getAttribute('data-module')).toBe('a-module')
    container.remove()
  })

  it('finds modules that are a container', function () {
    var module = $('<div data-module="a-module"></div>')
    var container = $('<div data-module="container-module"></div>').append(module)

    expect(GOVUK.modules.find(container).length).toBe(2)
    expect(GOVUK.modules.find(container)[1].getAttribute('data-module')).toBe('container-module')
    expect(GOVUK.modules.find(container)[0].getAttribute('data-module')).toBe('a-module')
    container.remove()
  })

  describe('when modules exist', function () {
    var container
    var callbackLegacyModule
    var callbackGovukModule
    var callbackFrontendModule

    beforeEach(function () {
      callbackLegacyModule = jasmine.createSpy()
      callbackGovukModule = jasmine.createSpy()
      callbackFrontendModule = jasmine.createSpy()

      // GOV.UK Frontend Toolkit Modules
      GOVUK.Modules.LegacyTestAlertModule = function () {
        var that = this
        that.start = function (element) {
          callbackLegacyModule(element)
        }
      }

      // GOV.UK Publishing Modules
      function GovukTestAlertModule () { }
      GovukTestAlertModule.prototype.start = function (element) {
        callbackGovukModule(element)
      }
      GOVUK.Modules.GovukTestAlertModule = GovukTestAlertModule

      // GOV.UK Frontend Modules
      function TestAlertModule (element) {
        this.element = element
      }
      TestAlertModule.prototype.init = function () {
        callbackFrontendModule(this.element)
      }
      GOVUK.Modules.TestAlertModule = TestAlertModule

      container = $('<div></div>')
    })

    afterEach(function () {
      delete GOVUK.Modules.LegacyTestAlertModule
      delete GOVUK.Modules.GovukTestAlertModule
      delete GOVUK.Modules.TestAlertModule

      container.remove()
    })

    it('starts modules within a container', function () {
      var legacyModule = $('<div data-module="legacy-test-alert-module"></div>')
      var publishingModule = $('<div data-module="govuk-test-alert-module"></div>')
      var frontendModule = $('<div data-module="test-alert-module"></div>')
      container.append(legacyModule).append(publishingModule).append(frontendModule)

      GOVUK.modules.start(container)
      expect(callbackLegacyModule).toHaveBeenCalled()
      expect(callbackGovukModule).toHaveBeenCalled()
      expect(callbackFrontendModule).toHaveBeenCalled()
    })

    it('does not start modules that are already started', function () {
      var module = $('<div data-module="legacy-test-alert-module"></div>')
      container.append(module)

      GOVUK.modules.start(module)
      GOVUK.modules.start(module)
      expect(callbackLegacyModule.calls.count()).toBe(1)
    })

    it('passes the HTML element to the module’s start method', function () {
      var module = $('<div data-module="legacy-test-alert-module"></div>')
      container.append(module)

      GOVUK.modules.start(container)

      var args = callbackLegacyModule.calls.argsFor(0)
      expect(args[0].getAttribute('data-module')).toBe('legacy-test-alert-module')
    })

    it('starts all modules that are on the page', function () {
      var modules = $(
        '<div data-module="legacy-test-alert-module"></div>' +
        '<strong data-module="legacy-test-alert-module"></strong>' +
        '<span data-module="legacy-test-alert-module"></span>' +
        '<div data-module="govuk-test-alert-module"></div>' +
        '<div data-module="test-alert-module"></div>'
      )

      $('body').append(modules)
      GOVUK.modules.start()
      expect(callbackLegacyModule.calls.count()).toBe(3)
      expect(callbackGovukModule.calls.count()).toBe(1)
      expect(callbackFrontendModule.calls.count()).toBe(1)
      modules.remove()
    })
  })
})
