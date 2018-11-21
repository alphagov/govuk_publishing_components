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
        <div class="govuk-checkboxes" data-nested="true">\
           <div class="gem-c-checkbox govuk-checkboxes__item">\
              <input id="checkboxes-1ac8e5cf-0" name="favourite_colour" type="checkbox" value="red" class="govuk-checkboxes__input">\
              <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0">Red</label>\
           </div>\
           <div id="checkboxes-1ac8e5cf-nested-0" class="govuk-checkboxes govuk-checkboxes--nested" data-parent="checkboxes-1ac8e5cf-0">\
              <div class="gem-c-checkbox govuk-checkboxes__item">\
                 <input id="checkboxes-1ac8e5cf-0-0" name="favourite_colour" type="checkbox" value="light_red" class="govuk-checkboxes__input">\
                 <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0-0">Light Red</label>\
              </div>\
              <div class="gem-c-checkbox govuk-checkboxes__item">\
                 <input id="checkboxes-1ac8e5cf-0-1" name="favourite_colour" type="checkbox" value="dark_red" class="govuk-checkboxes__input">\
                 <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-0-1">Dark Red</label>\
              </div>\
           </div>\
           <div class="gem-c-checkbox govuk-checkboxes__item">\
              <input id="checkboxes-1ac8e5cf-1" name="favourite_colour" type="checkbox" value="blue" class="govuk-checkboxes__input">\
              <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1">Blue</label>\
           </div>\
           <div id="checkboxes-1ac8e5cf-nested-1" class="govuk-checkboxes govuk-checkboxes--nested" data-parent="checkboxes-1ac8e5cf-1">\
              <div class="gem-c-checkbox govuk-checkboxes__item">\
                 <input id="checkboxes-1ac8e5cf-1-0" name="favourite_colour" type="checkbox" value="light_blue" class="govuk-checkboxes__input">\
                 <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1-0">Light blue</label>\
              </div>\
              <div class="gem-c-checkbox govuk-checkboxes__item">\
                 <input id="checkboxes-1ac8e5cf-1-1" name="favourite_colour" type="checkbox" value="dark_blue" class="govuk-checkboxes__input">\
                 <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-1-1">Dark blue</label>\
              </div>\
           </div>\
           <div class="gem-c-checkbox govuk-checkboxes__item">\
              <input id="checkboxes-1ac8e5cf-2" name="favourite_colour" type="checkbox" value="other" class="govuk-checkboxes__input">\
              <label class="govuk-label govuk-checkboxes__label" for="checkboxes-1ac8e5cf-2">Other</label>\
           </div>\
        </div>\
     </fieldset>\
  </div>';

  var $parentCheckboxWrapper;
  var $parentCheckbox;
  var $nestedChildren;

  beforeEach(function() {
    setFixtures(FIXTURE);
    loadCheckboxesComponent();

    $parentCheckboxWrapper = $('.govuk-checkboxes--nested:eq(0)').prev('.govuk-checkboxes__item');
    $parentCheckbox = $parentCheckboxWrapper.find('.govuk-checkboxes__input');
    $nestedChildren = $parentCheckboxWrapper.next('.govuk-checkboxes--nested').find('.govuk-checkboxes__input');
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
});
