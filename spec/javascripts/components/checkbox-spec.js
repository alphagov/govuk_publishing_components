describe("Checkbox component", function () {
  var FIXTURE = '<div class="gem-c-checkbox govuk-checkboxes__item" data-aria-controls="wrapper" data-module="checkbox">' +
    '<input id="checkbox-ba4e102e" name="happy" type="checkbox" value="happy" class="govuk-checkboxes__input">' +
    '<label class="govuk-label govuk-checkboxes__label" for="checkbox-ba4e102e">Are you happy?</label>' +
  '</div>';

  beforeEach(function () {
    setFixtures(FIXTURE);
    loadCheckbox();
  });

  it("adds aria controls if the data-aria-controls attribute is set", function () {
    expect($('.gem-c-checkbox .govuk-checkboxes__input').attr('aria-controls')).toBe('wrapper');
  });

  function loadCheckbox () {
    var checkbox = new GOVUK.Modules.Checkbox();
    checkbox.start($('.gem-c-checkbox'));
  }
});
