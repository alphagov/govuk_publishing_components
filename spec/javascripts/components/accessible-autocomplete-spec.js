describe("An accessible autocomplete component", function () {
  "use strict";

  var html = '\
    <div class="gem-c-accessible-autocomplete" data-module="accessible-autocomplete">\
      <select id="test" class="govuk-select" data-track-category="category" data-track-action="action">\
        <option value=""></option>\
        <option value="mo">Moose</option>\
        <option value="de">Deer</option>\
      </select>\
    </div>\
  ';

  // the autocomplete onConfirm function fires after the tests run unless we put
  // in a timeout like this - makes the tests a bit verbose unfortunately
  function testAsyncWithDeferred(done) {
    var deferred = $.Deferred();

    setTimeout(function () {
      deferred.resolve();
    }, 10);

    return deferred.promise();
  }

  beforeEach(function() {
    setFixtures(html);
    var autocomplete = new GOVUK.Modules.AccessibleAutocomplete();
    autocomplete.start($('.gem-c-accessible-autocomplete'));
  });

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      $('.autocomplete__input').val('Moose').click().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      );

      testAsyncWithDeferred().done(done());
    });

    it('an option is selected', function () {
      $('.autocomplete__option:first-child').click();
      expect($('select').val()).toEqual('mo');
    });
  });

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      $('select').val('de').change();
      $('.autocomplete__input').val('Deer');

      $('.autocomplete__input').val('').click().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      );

      testAsyncWithDeferred().done(done());
    });

    it('the input is cleared', function () {
      $('.autocomplete__option:first-child').click();
      expect($('select').val()).toEqual('');
    });
  });

  describe('triggers a Google Analytics event', function () {
    beforeEach(function (done) {
      $('.autocomplete__input').val('Moose').click().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      );

      testAsyncWithDeferred().done(done());
    });

    it('when a valid option is chosen', function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      $('.autocomplete__option:first-child').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('category', 'action', Object({ label: 'Moose' }));
    });
  });

  describe('triggers a Google Analytics event', function () {
    beforeEach(function (done) {
      $('.autocomplete__input').val('Deer').click().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      );
      $('.autocomplete__option:first-child').click();

      $('.autocomplete__input').val('').click().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      );

      testAsyncWithDeferred().done(done());
    });

    it('when an input is cleared', function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      $('.autocomplete__option').click();

      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('category', 'action', Object({ label: '' }));
    });
  });
});
