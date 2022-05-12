/* eslint-env jasmine */
/* global LUX */

// This test will only work if the browser running it supports the HTML5
// Performance API.
if (typeof window.performance !== 'undefined') {
  // These test checks that the LUX real user measurement script is correctly
  // reporting the HTTP protocol. In the browser the LUX measurer is run as
  // soon as the JavaScript is parsed - this gives the most accurate measurement
  // possible.
  //
  // In the Jasmine test, the LUX measurer script[1] is added to the configuration
  // file[2] - and is run as soon as the JavaScript is parsed to emulate the
  // behaviour on a page. Because of this these tests have no set up because the
  // measurer script is run automatically.
  //
  // [1]: https://github.com/alphagov/govuk_publishing_components/blob/36820906c2dc06ccb353ab91e3e276a9dbeeff01/app/assets/javascripts/govuk_publishing_components/vendor/lux/lux-measurer.js
  // [2]: https://github.com/alphagov/govuk_publishing_components/blob/36820906c2dc06ccb353ab91e3e276a9dbeeff01/spec/support/jasmine-browser.json#L8
  describe('The LUX addData function should report the the HTTP protocol', function () {
    it('reports once only', function () {
      // Because the script being tested is loaded and run as soon as possible,
      // a spy won't work - by the time the spy has been set up, the script has
      // already run.
      //
      // To get around this, we need to use an internal API - an array which is
      // used to store the data that is going to be sent - `LUX.ac`. This is
      // what can be used to check to see if the data is being recorded
      // correctly.
      expect(LUX.ac).toHaveSize(1)
    })

    it('reports the HTTP protocol in the correct manner', function () {
      // For example: ['addData', 'http-protocol', 'http2'].
      //
      // This is unable to use `equalTo` to compare this as an array because the
      // final item in the array depends on the type of HTTP protocol that's
      // being used, so a string check is done instead.
      expect(LUX.ac[0]).toHaveSize(3)
      expect(LUX.ac[0][0]).toBe('addData')
      expect(LUX.ac[0][1]).toBe('http-protocol')
      expect(typeof LUX.ac[0][2]).toBe('string')
    })
  })
}
