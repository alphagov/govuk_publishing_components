describe("Checkboxes component", function () {
  function loadCheckboxesComponent () {
    var checkboxes = new GOVUK.Modules.Checkboxes();
    checkboxes.start($('.gem-c-checkboxes'));
  }

  var FIXTURE = '\
  <div id="checkboxes-1ac8e5cf" class="gem-c-checkboxes govuk-form-group " data-module="checkboxes">\
     <fieldset class="govuk-fieldset" aria-describedby="checkboxes-1ac8e5cf-hint ">\
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">\
           <h1 class="govuk-fieldset__heading">What is your favourite colour?</h1>\
        </legend>\
        <span id="checkboxes-1ac8e5cf-hint" class="govuk-hint">Select all that apply.</span>\
        <ul class="govuk-checkboxes gem-c-checkboxes__list" data-nested="true">\
           <li class="govuk-checkboxes__item">\
              <input id="checkboxes-1ac8e5cf-0" name="favourite_colour" type="checkbox" value="red" class="govuk-checkboxes__input" data-track-category="choseFavouriteColour" data-track-action="favourite-color" data-track-label="red" data-track-value="1" data-track-options=\'{"dimension28": "wubbalubbadubdub","dimension29": "Pickle Rick"}\'>\
              <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0">Red</label>\
              <ul id="checkboxes-1ac8e5cf-nested-0" class="govuk-checkboxes govuk-checkboxes--nested" data-parent="checkboxes-1ac8e5cf-0">\
                <li class="govuk-checkboxes__item">\
                   <input id="checkboxes-1ac8e5cf-0-0" name="favourite_colour" type="checkbox" value="light_red" class="govuk-checkboxes__input" data-controls="thing">\
                   <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0-0">Light Red</label>\
                </li>\
                <li class="govuk-checkboxes__item">\
                   <input id="checkboxes-1ac8e5cf-0-1" name="favourite_colour" type="checkbox" value="dark_red" class="govuk-checkboxes__input">\
                   <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0-1">Dark Red</label>\
                </li>\
              </ul>\
           </li>\
           <li class="govuk-checkboxes__item">\
              <input id="checkboxes-1ac8e5cf-1" name="favourite_colour" type="checkbox" value="blue" class="govuk-checkboxes__input" data-track-category="choseFavouriteColour" data-uncheck-track-category="unselectedFavouriteColour" data-track-action="favourite-color" data-track-label="blue" data-track-value="2" data-track-options=\'{"dimension28":"Get schwifty","dimension29":"Squanch"}\'>\
              <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1">Blue</label>\
              <ul id="checkboxes-1ac8e5cf-nested-1" class="govuk-checkboxes govuk-checkboxes--nested" data-parent="checkboxes-1ac8e5cf-1">\
                <li class="govuk-checkboxes__item">\
                   <input id="checkboxes-1ac8e5cf-1-0" name="favourite_colour" type="checkbox" value="light_blue" class="govuk-checkboxes__input" data-controls="thing2">\
                   <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1-0">Light blue</label>\
                </li>\
                <li class="govuk-checkboxes__item">\
                   <input id="checkboxes-1ac8e5cf-1-1" name="favourite_colour" type="checkbox" value="dark_blue" class="govuk-checkboxes__input">\
                   <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1-1">Dark blue</label>\
                </li>\
              </ul>\
           </li>\
           <li class="govuk-checkboxes__item">\
              <input id="checkboxes-1ac8e5cf-2" name="favourite_colour" type="checkbox" value="other" class="govuk-checkboxes__input">\
              <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-2">Other</label>\
           </li>\
        </ul>\
     </fieldset>\
  </div>';

  var $parentCheckboxWrapper;
  var $parentCheckbox;
  var $nestedChildren;
  var $checkboxesWrapper;
  var expectedRedOptions;
  var expectedBlueOptions;

  beforeEach(function() {
    setFixtures(FIXTURE);
    loadCheckboxesComponent();

    $parentCheckboxWrapper = $('.govuk-checkboxes--nested:eq(0)').closest('.govuk-checkboxes__item');
    $parentCheckbox = $parentCheckboxWrapper.find('> .govuk-checkboxes__input');
    $nestedChildren = $parentCheckboxWrapper.find('.govuk-checkboxes--nested .govuk-checkboxes__input');
    $checkboxesWrapper = $(".gem-c-checkboxes");
    expectedRedOptions =  {label: "red", value: 1, dimension28: "wubbalubbadubdub", dimension29: "Pickle Rick"};
    expectedBlueOptions = {label: "blue", value: 2, dimension28: "Get schwifty", dimension29: "Squanch"};

    GOVUK.analytics = {
      trackEvent: function(){}
    };

    spyOn(GOVUK.analytics, 'trackEvent');
  });

  it('checking a parent checkbox checks all its children', function () {
    $parentCheckbox.click();

    expect($nestedChildren.length).toEqual($nestedChildren.filter(':checked').length);
  });

  it('checks parent when all children are selected', function () {
    $nestedChildren.each(function (idx, child) {
      $(child).click();
    });

    expect($parentCheckbox.is(':checked')).toEqual(true);
  });

  it('unchecks parent when one or more children are deselected', function () {
    $parentCheckbox.click();
    expect($nestedChildren.length).toEqual($nestedChildren.filter(':checked').length);
    expect($parentCheckbox.is(':checked')).toEqual(true);

    $nestedChildren.eq(0).click();
    expect($parentCheckbox.is(':checked')).toEqual(false);
  });

  it('applies aria-controls attributes if it finds data-controls attributes', function () {
    expect($('#checkboxes-1ac8e5cf-0-0.govuk-checkboxes__input').attr('aria-controls')).toBe('thing');
    expect($('#checkboxes-1ac8e5cf-1-0.govuk-checkboxes__input').attr('aria-controls')).toBe('thing2');
    expect($('#checkboxes-1ac8e5cf-0.govuk-checkboxes__input').attr('aria-controls')).toBe(undefined);
  });

  it('fires a Google analytics event when it is checked', function () {
    $checkbox = $checkboxesWrapper.find(":input[value='red']");
    $checkbox.trigger("click");
    expect($checkbox.is(":checked")).toBe(true);

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith("choseFavouriteColour", "favourite-color", expectedRedOptions);
  });

  it('fires a Google analytics event when it is unchecked and there is no uncheck track category', function () {
    $checkbox = $checkboxesWrapper.find(":input[value='red']");
    $checkbox.trigger("click");
    expect($checkbox.is(":checked")).toBe(true);

    GOVUK.analytics.trackEvent.calls.reset();

    $checkbox.trigger("click");
    expect($checkbox.is(":checked")).toBe(false);

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith("choseFavouriteColour", "favourite-color", expectedRedOptions);
  });

  it('fires a Google analytics event when it is unchecked and there is an uncheck track category', function () {
    $checkbox = $checkboxesWrapper.find(":input[value='blue']");
    $checkbox.trigger("click");
    expect($checkbox.is(":checked")).toBe(true);
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith("choseFavouriteColour", "favourite-color", expectedBlueOptions);

    $checkbox.trigger("click");
    expect($checkbox.is(":checked")).toBe(false);
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith("unselectedFavouriteColour", "favourite-color", expectedBlueOptions);
  });
});
