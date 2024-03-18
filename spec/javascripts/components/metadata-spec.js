/* eslint-env jasmine,jquery */
/* global GOVUK */

describe('The metadata component', function () {
  var element
  var target

  beforeEach(function () {
    spyOn(GOVUK.Modules.GemToggle.prototype, 'toggleOnClick')
  })

  describe('when the "See all updates" link is clicked', function () {
    it('clicks the target if target exists and is not already expanded', function () {
      var FIXTURE =
        '<div data-module="metadata">' +
          '<a href="#toggle-me" class="js-see-all-updates-link"></a>' +
        '</div>' +
        '<div id="toggle-me" data-module="gem-toggle">' +
          '<a data-controls="target" data-expanded aria-expanded="false"></a>' +
          '<div id="target" class="js-hidden">Target</div>' +
        '</div>'
      window.setFixtures(FIXTURE)
      element = document.querySelector('[data-module="metadata"]')
      target = document.querySelector('#toggle-me')

      init(element, target)

      var trigger = $(element).find('.js-see-all-updates-link')
      trigger[0].click()
      expect(GOVUK.Modules.GemToggle.prototype.toggleOnClick).toHaveBeenCalled()
    })

    it('does not click target if target does not exist', function () {
      var FIXTURE = '<div data-module="metadata"><a href="#toggle-me" class="js-see-all-updates-link"></a></div>'
      window.setFixtures(FIXTURE)
      element = document.querySelector('[data-module="metadata"]')

      init(element)

      var trigger = $(element).find('.js-see-all-updates-link')
      trigger[0].click()

      expect(GOVUK.Modules.GemToggle.prototype.toggleOnClick).not.toHaveBeenCalled()
    })

    it('does not click target if target is already expanded', function () {
      var FIXTURE = '<div data-module="metadata"><a href="#toggle-me" class="js-see-all-updates-link"></a></div><div id="toggle-me" data-module="gem-toggle"><a aria-expanded="true"></a></div>'
      window.setFixtures(FIXTURE)
      element = document.querySelector('[data-module="metadata"]')
      target = document.querySelector('#toggle-me')

      init(element, target)

      var trigger = $(element).find('.js-see-all-updates-link')
      trigger[0].click()

      expect(GOVUK.Modules.GemToggle.prototype.toggleOnClick).not.toHaveBeenCalled()
    })
  })

  function init (element, target) {
    new GOVUK.Modules.Metadata(element).init()
    /* eslint-disable no-new */
    target && new GOVUK.Modules.GemToggle($(target)[0])
  }
})
