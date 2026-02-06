/* eslint-env jasmine */
/* global GOVUK */

describe('The metadata component', function () {
  var element,
    module,
    target

  beforeEach(function () {
    element = document.createElement('div')

    spyOn(GOVUK.Modules.GemToggle.prototype, 'toggleOnClick')
  })

  afterEach(function () {
    document.body.lastElementChild.remove()
  })

  describe('when the "See all updates" link is clicked', function () {
    it('clicks the target if target exists and is not already expanded', function () {
      element.innerHTML = `
        <div data-module="metadata">
          <a href="#toggle-me" class="js-see-all-updates-link"></a>
        </div>
        <div id="toggle-me" data-module="gem-toggle">
          <a data-controls="target" data-expanded aria-expanded="false"></a>
          <div id="target" class="js-hidden">Target</div>
        </div>
      `
      document.body.appendChild(element)

      module = document.querySelector('[data-module="metadata"]')
      target = document.querySelector('#toggle-me')

      init(element, target)

      var trigger = module.querySelector('.js-see-all-updates-link')
      trigger.click()
      expect(GOVUK.Modules.GemToggle.prototype.toggleOnClick).toHaveBeenCalled()
    })

    it('does not click target if target does not exist', function () {
      element.innerHTML = '<div data-module="metadata"><a href="#toggle-me" class="js-see-all-updates-link"></a></div>'
      document.body.appendChild(element)

      module = document.querySelector('[data-module="metadata"]')

      init(module)

      var trigger = module.querySelector('.js-see-all-updates-link')
      trigger.click()

      expect(GOVUK.Modules.GemToggle.prototype.toggleOnClick).not.toHaveBeenCalled()
    })

    it('does not click target if target is already expanded', function () {
      element.innerHTML = '<div data-module="metadata"><a href="#toggle-me" class="js-see-all-updates-link"></a></div><div id="toggle-me" data-module="gem-toggle"><a aria-expanded="true"></a></div>'
      document.body.appendChild(element)

      module = document.querySelector('[data-module="metadata"]')
      target = document.querySelector('#toggle-me')

      init(module, target)

      var trigger = module.querySelector('.js-see-all-updates-link')
      trigger.click()

      expect(GOVUK.Modules.GemToggle.prototype.toggleOnClick).not.toHaveBeenCalled()
    })
  })

  function init (element, target) {
    new GOVUK.Modules.Metadata(element).init()
    var toggle = new GOVUK.Modules.GemToggle(target)
    target && toggle.init()
  }
})
