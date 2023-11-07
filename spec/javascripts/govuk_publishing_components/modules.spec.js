/* eslint-env jasmine, jquery */

var $ = window.jQuery

describe('GOVUK Modules', function () {
  'use strict'
  var GOVUK = window.GOVUK

  it('finds modules in body', function () {
    var module = $('<div data-module="a-module"></div>')
    $('body').append(module)
    var modules = GOVUK.modules.find()

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    module.remove()
  })

  it('finds modules in head', function () {
    var module = $('<meta name="fake-meta" content="blah" data-module="a-module">')
    $('head').append(module)
    var modules = GOVUK.modules.find()

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    module.remove()
  })

  it('finds modules in a page', function () {
    var headModule = $('<meta name="fake-meta" content="blah" data-module="head-module">')
    $('head').append(headModule)

    var bodyModule = $('<div data-module="body-module"></div>')
    $('body').append(bodyModule)

    var modules = GOVUK.modules.find()

    expect(modules.length).toBe(2)
    expect(modules[0].getAttribute('data-module')).toBe('head-module')
    expect(modules[1].getAttribute('data-module')).toBe('body-module')
    headModule.remove()
    bodyModule.remove()
  })

  it('finds modules in a container', function () {
    var module = $('<div data-module="a-module"></div>')
    var container = $('<div></div>').append(module)
    var modules = GOVUK.modules.find(container[0])

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    container.remove()
  })

  it('finds modules that are a container', function () {
    var module = $('<div data-module="a-module"></div>')
    var container = $('<div data-module="container-module"></div>').append(module)
    var modules = GOVUK.modules.find(container[0])

    expect(modules.length).toBe(2)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    expect(modules[1].getAttribute('data-module')).toBe('container-module')
    container.remove()
  })

  it('can find a module with a DOM element input', function () {
    var container = $('<div data-module="container-module"></div>')
    var modules = GOVUK.modules.find(container[0])

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('container-module')
  })

  describe('when modules exist', function () {
    var container
    var callbackFrontendModule
    var callbackGemFrontendModule

    beforeEach(function () {
      callbackFrontendModule = jasmine.createSpy()
      callbackGemFrontendModule = jasmine.createSpy()

      // GOV.UK Frontend Modules
      function TestAlertFrontendModule (element) {
        this.element = element
        this.init()
      }
      TestAlertFrontendModule.prototype.init = function () {
        callbackFrontendModule(this.element)
      }
      GOVUK.Modules.TestAlertFrontendModule = TestAlertFrontendModule

      // GOV.UK Gem Frontend Modules
      function GemTestAlertFrontendModule (element) {
        this.element = element
        this.init()
      }
      GemTestAlertFrontendModule.prototype.init = function () {
        callbackGemFrontendModule(this.element)
      }
      GOVUK.Modules.GemTestAlertFrontendModule = GemTestAlertFrontendModule

      // GOV.UK Frontend Module with a GOVUK Publishing Module counterpart
      function TestAlertPublishingAndFrontendModule (element) {
        this.element = element
        this.init()
      }
      TestAlertPublishingAndFrontendModule.prototype.init = function () {
        callbackFrontendModule(this.element)
      }
      GOVUK.Modules.TestAlertPublishingAndFrontendModule = TestAlertPublishingAndFrontendModule

      // GOV.UK Frontend Module that depends on cookies to start and delays
      function TestCookieDependencyModule (element) {
        this.element = element
        this.init()
      }
      TestCookieDependencyModule.prototype.init = function () {
        this.startModule = this.startModule.bind(this)
        window.addEventListener('cookie-consent', this.startModule)
      }
      TestCookieDependencyModule.prototype.startModule = function () {
        window.removeEventListener('cookie-consent', this.startModule)
        callbackFrontendModule(this.element)
      }
      GOVUK.Modules.TestCookieDependencyModule = TestCookieDependencyModule

      // module with a deliberate error in it
      function TestErrorModule (element) {
        this.element = element
        this.init()
      }
      TestErrorModule.prototype.init = function () {
        throw new Error('This is a deliberate error')
        callbackGemFrontendModule(this.element) // eslint-disable-line no-unreachable
      }
      GOVUK.Modules.TestErrorModule = TestErrorModule

      container = $('<div></div>')
    })

    afterEach(function () {
      delete GOVUK.Modules.TestAlertFrontendModule
      delete GOVUK.Modules.GemTestAlertFrontendModule
      delete GOVUK.Modules.TestAlertPublishingAndFrontendModule
      delete GOVUK.Modules.TestCookieDependencyModule
      delete GOVUK.Modules.TestErrorModule

      container.remove()
    })

    it('starts modules within a container', function () {
      var frontendModule = $('<div data-module="test-alert-frontend-module"></div>')
      var publishingAndFrontendModule = $('<div data-module="govuk-test-alert-publishing-and-frontend-module"></div>')
      container.append(frontendModule).append(publishingAndFrontendModule)

      GOVUK.modules.start(container[0])
      expect(callbackFrontendModule).toHaveBeenCalled()
    })

    it('does not start modules that are already started', function () {
      var module = $('<div data-module="test-alert-frontend-module"></div>')
      container.append(module)

      GOVUK.modules.start(module[0])
      GOVUK.modules.start(module[0])
      expect(callbackFrontendModule.calls.count()).toBe(1)
    })

    it('passes the HTML element to the module’s start method', function () {
      var module = $('<div data-module="test-alert-frontend-module"></div>')
      container.append(module)

      GOVUK.modules.start(container[0])

      var args = callbackFrontendModule.calls.argsFor(0)
      expect(args[0].getAttribute('data-module')).toBe('test-alert-frontend-module')
    })

    it('starts all modules that are on the page', function () {
      var modules = $(
        '<div data-module="test-alert-frontend-module"></div>' +
        '<strong data-module="test-alert-frontend-module"></strong>' +
        '<span data-module="test-alert-frontend-module"></span>'
      )

      $('body').append(modules)
      GOVUK.modules.start()
      expect(callbackFrontendModule.calls.count()).toBe(3)
      modules.remove()
    })

    it('starts multiple modules on a single element', function () {
      var modules = $(
        '<div data-module="test-alert-frontend-module gem-test-alert-frontend-module"></div>'
      )

      $('body').append(modules)
      GOVUK.modules.start()
      expect(callbackGemFrontendModule.calls.count()).toBe(1)
      expect(callbackFrontendModule.calls.count()).toBe(1)
      modules.remove()
    })

    it('starts delayed modules once cookies have been consented', function () {
      var module = $('<div data-module="test-cookie-dependency-module"></div>')
      container.append(module)
      $('body').append(container)

      GOVUK.modules.start(container[0])
      expect(callbackFrontendModule.calls.count()).toBe(0)
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(callbackFrontendModule.calls.count()).toBe(1)
    })

    it('starts multiple delayed modules once cookies have been consented', function () {
      var module1 = $('<div data-module="test-cookie-dependency-module"></div>')
      var module2 = $('<div data-module="test-cookie-dependency-module"></div>')
      container.append(module1)
      container.append(module2)
      $('body').append(container)

      GOVUK.modules.start(container[0])
      expect(callbackFrontendModule.calls.count()).toBe(0)
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(callbackFrontendModule.calls.count()).toBe(2)
    })

    it('detects errors in modules and continues without failing', function () {
      var module1 = $('<div data-module="test-error-module"></div>')
      var module2 = $('<div data-module="gem-test-alert-frontend-module"></div>')
      container.append(module1)
      container.append(module2)
      $('body').append(container)

      GOVUK.modules.start(container[0])
      expect(callbackGemFrontendModule.calls.count()).toBe(1)
    })
  })
})
