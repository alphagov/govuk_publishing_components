/* eslint-env jasmine */

describe('GOVUK Modules', function () {
  'use strict'
  var GOVUK = window.GOVUK

  it('finds modules in body', function () {
    var module = document.createElement('div')
    module.dataset.module = 'a-module'
    document.body.appendChild(module)

    var modules = GOVUK.modules.find()

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    module.remove()
  })

  it('finds modules in head', function () {
    var module = document.createElement('meta')
    module.setAttribute('content', 'blah')
    module.setAttribute('name', 'fake-meta')
    module.dataset.module = 'a-module'
    document.head.appendChild(module)

    var modules = GOVUK.modules.find()

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    module.remove()
  })

  it('finds modules in a page', function () {
    var headModule = document.createElement('meta')
    headModule.setAttribute('content', 'blah')
    headModule.setAttribute('name', 'fake-meta')
    headModule.dataset.module = 'head-module'
    document.head.appendChild(headModule)

    var bodyModule = document.createElement('div')
    bodyModule.dataset.module = 'body-module'
    document.body.appendChild(bodyModule)

    var modules = GOVUK.modules.find()

    expect(modules.length).toBe(2)
    expect(modules[0].getAttribute('data-module')).toBe('head-module')
    expect(modules[1].getAttribute('data-module')).toBe('body-module')
    headModule.remove()
    bodyModule.remove()
  })

  it('finds modules in a container', function () {
    var module = document.createElement('div')
    module.dataset.module = 'a-module'

    var container = document.createElement('div')
    container.appendChild(module)

    var modules = GOVUK.modules.find(container)

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    container.remove()
  })

  it('finds modules that are a container', function () {
    var module = document.createElement('div')
    module.dataset.module = 'a-module'

    var container = document.createElement('div')
    container.dataset.module = 'container-module'
    container.appendChild(module)

    var modules = GOVUK.modules.find(container)

    expect(modules.length).toBe(2)
    expect(modules[0].getAttribute('data-module')).toBe('a-module')
    expect(modules[1].getAttribute('data-module')).toBe('container-module')
    container.remove()
  })

  it('can find a module with a DOM element input', function () {
    var container = document.createElement('div')
    container.dataset.module = 'container-module'

    var modules = GOVUK.modules.find(container)

    expect(modules.length).toBe(1)
    expect(modules[0].getAttribute('data-module')).toBe('container-module')
  })

  describe('when modules exist', function () {
    var container
    var callbackFrontendModule
    var callbackFrontendModuleVersionFive
    var callbackGemFrontendModule

    beforeEach(function () {
      callbackFrontendModule = jasmine.createSpy()
      callbackFrontendModuleVersionFive = jasmine.createSpy()
      callbackGemFrontendModule = jasmine.createSpy()

      // GOV.UK Frontend Modules
      function TestAlertFrontendModule (element) {
        this.element = element
      }
      TestAlertFrontendModule.prototype.init = function () {
        callbackFrontendModule(this.element)
      }
      GOVUK.Modules.TestAlertFrontendModule = TestAlertFrontendModule

      // GOV.UK Frontend Modules - V5
      function TestAlertFrontendModuleVersionFive (element) {
        this.element = element
        this.initControls()
      }
      TestAlertFrontendModuleVersionFive.prototype.initControls = function () {
        callbackFrontendModuleVersionFive(this.element)
      }
      GOVUK.Modules.TestAlertFrontendModuleVersionFive = TestAlertFrontendModuleVersionFive

      // GOV.UK Gem Frontend Modules
      function GemTestAlertFrontendModule (element) {
        this.element = element
      }
      GemTestAlertFrontendModule.prototype.init = function () {
        callbackGemFrontendModule(this.element)
      }
      GOVUK.Modules.GemTestAlertFrontendModule = GemTestAlertFrontendModule

      // GOV.UK Frontend Module with a GOVUK Publishing Module counterpart
      function TestAlertPublishingAndFrontendModule (element) {
        this.element = element
      }
      TestAlertPublishingAndFrontendModule.prototype.init = function () {
        callbackFrontendModule(this.element)
      }
      GOVUK.Modules.TestAlertPublishingAndFrontendModule = TestAlertPublishingAndFrontendModule

      // GOV.UK Frontend Module that depends on cookies to start and delays
      function TestCookieDependencyModule (element) {
        this.element = element
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
      }
      TestErrorModule.prototype.init = function () {
        throw new Error('This is a deliberate error')
        callbackGemFrontendModule(this.element) // eslint-disable-line no-unreachable
      }
      GOVUK.Modules.TestErrorModule = TestErrorModule

      container = document.createElement('div')
    })

    afterEach(function () {
      delete GOVUK.Modules.TestAlertFrontendModule
      delete GOVUK.Modules.TestAlertFrontendModuleVersionFive
      delete GOVUK.Modules.GemTestAlertFrontendModule
      delete GOVUK.Modules.TestAlertPublishingAndFrontendModule
      delete GOVUK.Modules.TestCookieDependencyModule
      delete GOVUK.Modules.TestErrorModule

      container.remove()
    })

    it('starts modules within a container', function () {
      var frontendModule = document.createElement('div')
      frontendModule.dataset.module = 'test-alert-frontend-module'

      var publishingAndFrontendModule = document.createElement('div')
      publishingAndFrontendModule.dataset.module = 'govuk-test-alert-publishing-and-frontend-module'

      container.appendChild(frontendModule).appendChild(publishingAndFrontendModule)

      GOVUK.modules.start(container)
      expect(callbackFrontendModule).toHaveBeenCalled()
    })

    it('does not start modules that are already started', function () {
      var modules = document.createDocumentFragment()

      var testAlertFrontendModule = document.createElement('div')
      testAlertFrontendModule.dataset.module = 'test-alert-frontend-module'
      modules.appendChild(testAlertFrontendModule)

      var testAlertFrontendModuleV5 = document.createElement('div')
      testAlertFrontendModuleV5.dataset.module = 'test-alert-frontend-module-version-five'
      modules.appendChild(testAlertFrontendModuleV5)

      var gemTestAlertFrontendModule = document.createElement('div')
      gemTestAlertFrontendModule.dataset.module = 'gem-test-alert-frontend-module'
      modules.appendChild(gemTestAlertFrontendModule)

      document.body.appendChild(modules)
      GOVUK.modules.start()
      GOVUK.modules.start()
      expect(callbackFrontendModule.calls.count()).toBe(1)
      expect(callbackFrontendModuleVersionFive.calls.count()).toBe(1)
      expect(callbackGemFrontendModule.calls.count()).toBe(1)

      var allModules = document.querySelectorAll('[data-module]')
      allModules.forEach((module) => module.remove())
    })

    it('passes the HTML element to the module’s start method', function () {
      var module = document.createElement('div')
      module.dataset.module = 'test-alert-frontend-module'
      container.append(module)

      GOVUK.modules.start(container)

      var args = callbackFrontendModule.calls.argsFor(0)
      expect(args[0].getAttribute('data-module')).toBe('test-alert-frontend-module')
    })

    it('starts all modules that are on the page', function () {
      var modules = document.createDocumentFragment()

      var testAlertFrontendModule = document.createElement('div')
      testAlertFrontendModule.dataset.module = 'test-alert-frontend-module'
      modules.appendChild(testAlertFrontendModule)

      var testAlertFrontendModuleStrong = document.createElement('strong')
      testAlertFrontendModuleStrong.dataset.module = 'test-alert-frontend-module'
      modules.appendChild(testAlertFrontendModuleStrong)

      var testAlertFrontendModuleSpan = document.createElement('span')
      testAlertFrontendModuleSpan.dataset.module = 'test-alert-frontend-module'
      modules.appendChild(testAlertFrontendModuleSpan)

      var testAlertFrontendModuleV5 = document.createElement('div')
      testAlertFrontendModuleV5.dataset.module = 'test-alert-frontend-module-version-five'
      modules.appendChild(testAlertFrontendModuleV5)

      var testAlertFrontendModuleStrongV5 = document.createElement('strong')
      testAlertFrontendModuleStrongV5.dataset.module = 'test-alert-frontend-module-version-five'
      modules.appendChild(testAlertFrontendModuleStrongV5)

      var gemTestAlertFrontendModule = document.createElement('div')
      gemTestAlertFrontendModule.dataset.module = 'gem-test-alert-frontend-module'
      modules.appendChild(gemTestAlertFrontendModule)

      document.body.appendChild(modules)

      GOVUK.modules.start()
      expect(callbackFrontendModule.calls.count()).toBe(3)
      expect(callbackFrontendModuleVersionFive.calls.count()).toBe(2)
      expect(callbackGemFrontendModule.calls.count()).toBe(1)

      var allModules = document.querySelectorAll('[data-module]')
      allModules.forEach((module) => module.remove())
    })

    it('starts multiple modules on a single element', function () {
      var modules = document.createElement('div')
      modules.dataset.module = 'test-alert-frontend-module gem-test-alert-frontend-module'

      document.body.append(modules)
      GOVUK.modules.start()
      expect(callbackGemFrontendModule.calls.count()).toBe(1)
      expect(callbackFrontendModule.calls.count()).toBe(1)
      modules.remove()
    })

    it('starts govuk-frontend v5 and gem modules on a single element', function () {
      var modules = document.createElement('div')
      modules.dataset.module = 'test-alert-frontend-module-version-five gem-test-alert-frontend-module'

      document.body.append(modules)
      GOVUK.modules.start()
      expect(callbackGemFrontendModule.calls.count()).toBe(1)
      expect(callbackFrontendModuleVersionFive.calls.count()).toBe(1)
      modules.remove()
    })

    it('starts delayed modules once cookies have been consented', function () {
      var module = document.createElement('div')
      module.dataset.module = 'test-cookie-dependency-module'
      container.append(module)
      document.body.append(container)

      GOVUK.modules.start(container)
      expect(callbackFrontendModule.calls.count()).toBe(0)
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(callbackFrontendModule.calls.count()).toBe(1)
    })

    it('starts multiple delayed modules once cookies have been consented', function () {
      var module1 = document.createElement('div')
      module1.dataset.module = 'test-cookie-dependency-module'

      var module2 = document.createElement('div')
      module2.dataset.module = 'test-cookie-dependency-module'

      container.append(module1)
      container.append(module2)
      document.body.append(container)

      GOVUK.modules.start(container)
      expect(callbackFrontendModule.calls.count()).toBe(0)
      window.GOVUK.triggerEvent(window, 'cookie-consent')
      expect(callbackFrontendModule.calls.count()).toBe(2)
    })

    it('detects errors in modules and continues without failing', function () {
      var module1 = document.createElement('div')
      module1.dataset.module = 'test-error-module'

      var module2 = document.createElement('div')
      module2.dataset.module = 'gem-test-alert-frontend-module'

      container.append(module1)
      container.append(module2)
      document.body.append(container)

      GOVUK.modules.start(container)
      expect(callbackGemFrontendModule.calls.count()).toBe(1)
    })
  })
})
