describe("An accessible autocomplete component", function () {
  "use strict";

  function loadAutocompleteComponent(markup) {
    setFixtures(markup);
    var autocomplete = new GOVUK.Modules.AccessibleAutocomplete();
    autocomplete.start($('.gem-c-accessible-autocomplete'));
  }

  var html = '\
    <div class="gem-c-accessible-autocomplete" data-module="accessible-autocomplete">\
      <select id="test" class="govuk-select" data-track-category="category" data-track-action="action">\
        <option value=""></option>\
        <option value="mo">Moose</option>\
        <option value="de">Deer</option>\
      </select>\
    </div>';

  var multiselecthtml = '\
    <div class="gem-c-accessible-autocomplete" data-module="accessible-autocomplete">\
      <select id="test" class="govuk-select" multiple data-track-category="category" data-track-action="action">\
        <option value="mo">Moose</option>\
        <option value="de">Deer</option>\
      </select>\
    </div>';

  var multiselecthtmlwithoutfacets = '\
    <div class="gem-c-accessible-autocomplete gem-c-accessible-autocomplete--hide-facets" data-module="accessible-autocomplete" data-hint="ce1" data-selected-text="selected">\
      <label for="autocomplete-8b93b936" class="gem-c-label govuk-label ">\
        Countries\
      </label>\
      <span id="ce1" class="govuk-hint">0 selected</span>\
      <span class="govuk-hint gem-c-autocomplete__multiselect-instructions">To select multiple items in a list, hold down Ctrl (PC) or Cmd (Mac) key.</span>\
      <select name="autocomplete-8b93b936[]" id="autocomplete-8b93b936-select" multiple="multiple" class="govuk-select" described_by="describes_select">\
        <option value="fr" selected>France</option>\
        <option value="de" selected>Germany</option>\
        <option value="se">Sweden</option>\
        <option value="ch">Switzerland</option>\
        <option value="gb">United Kingdom</option>\
        <option value="us">United States</option>\
        <option value="tw">The Separate Customs Territory of Taiwan, Penghu, Kinmen, and Matsu (Chinese Taipei)</option>\
      </select>\
    </div>';

  // the autocomplete onConfirm function fires after the tests run unless we put
  // in a timeout like this - makes the tests a bit verbose unfortunately
  function testAsyncWithDeferredReturnValue() {
    var deferred = $.Deferred();

    setTimeout(function () {
      deferred.resolve();
    }, 500);

    return deferred.promise();
  }

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      loadAutocompleteComponent(html);

      // the autocomplete is complex enough that all of these
      // events are necessary to simulate user input
      $('.autocomplete__input').val('Moose').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur();

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('an option is selected', function () {
      expect($('select').val()).toEqual('mo');
    });
  });

  describe('updates the hidden select when', function () {
    beforeEach(function (done) {
      loadAutocompleteComponent(html);

      $('select').val('de').change();
      $('.autocomplete__input').val('Deer');

      $('.autocomplete__input').val('').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur();

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('the input is cleared', function () {
      expect($('select').val()).toEqual('');
    });
  });

  describe('triggers a Google Analytics event', function () {
    beforeEach(function (done) {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadAutocompleteComponent(html);

      $('.autocomplete__input').val('Moose').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur();

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('when a valid option is chosen', function () {
      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('category', 'action', Object({ label: 'Moose' }));
    });
  });

  describe('triggers a Google Analytics event', function () {
    beforeEach(function (done) {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      loadAutocompleteComponent(html);

      $('.autocomplete__input').val('Deer').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur();

      $('.autocomplete__input').val('').click().focus().trigger(
        $.Event('keypress', { which: 13, key: 13, keyCode: 13 })
      ).blur();

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('when an input is cleared', function () {
      expect(GOVUK.analytics.trackEvent).
        toHaveBeenCalledWith('category', 'action', Object({ label: '' }));
    });
  });

  describe('in multiple mode', function() {
    beforeEach(function (done) {
      loadAutocompleteComponent(multiselecthtml);
      // use the component api for this test
      // as methods in previous tests don't seem to
      // work in multiple mode
      var onConfirm = $('select').data('onconfirm');

      $('.autocomplete__input').val('Deer');
      onConfirm('Deer', 'de');

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('selects one option in the select', function () {
      expect($('select').val()).toEqual(['de']);
    });
  });

  describe('in multiple mode', function() {
    beforeEach(function (done) {
      loadAutocompleteComponent(multiselecthtml);
      var onConfirm = $('select').data('onconfirm');

      $('.autocomplete__input').val('Moose');
      onConfirm('Moose', 'mo');

      $('.autocomplete__input').val('Deer');
      onConfirm('Deer', 'de');

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('selects multiple options in the select', function () {
      expect($('select').val()).toEqual(['mo', 'de']);
    });
  });

  describe('in multiple mode with facets hidden', function() {
    it('shows the number of selected options text', function () {
      loadAutocompleteComponent(multiselecthtmlwithoutfacets);
      expect($('#ce1')).toHaveText("2 selected");
    });

    it('associates the input with the count element', function() {
      loadAutocompleteComponent(multiselecthtmlwithoutfacets);
      expect($('.autocomplete__input').attr('aria-describedby')).toBe('ce1');
    });
  });

  describe('in multiple mode with facets hidden', function() {
    beforeEach(function (done) {
      loadAutocompleteComponent(multiselecthtmlwithoutfacets);
      var onConfirm = $('select').data('onconfirm');

      $('.autocomplete__input').val('Germany');
      onConfirm('Germany', 'de');

      $('.autocomplete__input').val('Sweden');
      onConfirm('Sweden', 'se');

      testAsyncWithDeferredReturnValue().done(function () {
        done();
      });
    });

    it('updates the number of selected options text', function () {
      expect($('#ce1')).toHaveText("3 selected");
    });
  });
});
