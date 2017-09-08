/* global describe, afterEach, it, expect */

var VisualDiffTool = window.GOVUK.VisualDiffTool;
var windowLocation;

describe('VisualDiffTool', function () {

  describe('throws errors', function () {
    it('throws error if not running on local page', function () {
      expect(VisualDiffTool).toThrow();
    });
  });

  describe('URL processing', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough();
    });

    afterEach(function() {
      // We need to call this again to 'turn off' the diff tool that's running from each test
      VisualDiffTool();
      windowLocation = null;
    });

    it('compares dev.gov.uk to gov.uk', function() {
      windowLocation = {
        href: 'http://government-frontend.dev.gov.uk',
        host: 'government-frontend.dev.gov.uk'
      };

      VisualDiffTool(windowLocation);

      expect(console.log.calls.mostRecent().args[0]).toContain("https://www.gov.uk");
    });

    it('compares local component guide to heroku deploy', function() {
      windowLocation = {
        href: 'http://government-frontend.dev.gov.uk/component-guide',
        host: 'government-frontend.dev.gov.uk'
      };

      VisualDiffTool(windowLocation);

      expect(console.log.calls.mostRecent().args[0]).toContain("https://government-frontend.herokuapp.com/component-guide");
    });

    it('compares pr heroku app to master heroku deploy', function() {
      windowLocation = {
        href: 'https://government-frontend-pr-100.herokuapp.com',
        host: 'government-frontend-pr-100.herokuapp.com'
      };

      VisualDiffTool(windowLocation);

      expect(console.log.calls.mostRecent().args[0]).toContain("https://government-frontend.herokuapp.com");
    });

    it('compares local static url to live static deploy', function() {
      windowLocation = {
        href: 'https://static.dev.gov.uk/component-guide/title',
        host: 'static.dev.gov.uk'
      };

      VisualDiffTool(windowLocation);

      expect(console.log.calls.mostRecent().args[0]).toContain("https://govuk-static.herokuapp.com/component-guide/title");
    });
  });
});
