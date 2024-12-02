/* eslint-env jasmine, jquery */
/* global GOVUK */
describe('GOVUK.Modules.AddAnother', function () {
  var fixture, addAnother, addButton, fieldset, fieldset0, fieldset1, fieldset2, fieldset3

  beforeEach(function () {
    fixture = document.createElement('form')
    fixture.setAttribute('data-module', 'AddAnother')
    fixture.setAttribute('data-fieldset-legend', 'Thing')
    fixture.setAttribute('data-add-button-text', 'Add another thing')
    fixture.innerHTML = `
      <div>
        <div class="js-add-another__fieldset">
          <fieldset>
            <legend>Thing 1</legend>
            <input type="hidden" name="test[0][id]" value="test_id" />
            <label for="test_0_foo">Foo</label>
            <input type="text" id="test_0_foo" name="test[0][foo]" value="test foo" />
            <label for="test_0_bar"></label>
            <textarea id="test_0_bar" name="test[0][bar]">test bar</textarea>
            <label for="test_0__destroy">Delete</label>
            <div class="js-add-another__destroy-checkbox">
              <input type="checkbox" id="test_0_destroy" name="test[0][_destroy]" />
            </div>
          </fieldset>
        </div>
        <div class="js-add-another__fieldset">
          <fieldset>
            <legend>Thing 2</legend>
            <input type="hidden" name="test[1][id]" value="test_id" />
            <label for="test_1_foo">Foo</label>
            <input type="text" id="test_1_foo" name="test[1][foo]" value="test foo" />
            <label for="test_1_bar"></label>
            <textarea id="test_1_bar" name="test[1][bar]">test bar</textarea>
            <label for="test_1__destroy">Delete</label>
            <div class="js-add-another__destroy-checkbox">
              <input type="checkbox" id="test_1_destroy" name="test[1][_destroy]" />
            </div>
          </fieldset>
        </div>
        <div class="js-add-another__empty">
          <fieldset>
            <legend>Thing 3</legend>
            <input type="hidden" name="test[2][id]" value="test_id" />
            <label for="test_2_foo">Foo</label>
            <input type="text" id="test_2_foo" name="test[2][foo]" value="" />
            <label for="test_2_bar"></label>
            <textarea id="test_2_bar" name="test[2][bar]"></textarea>
            <label for="test_2__destroy">Delete</label>
          </fieldset>
        </div>
      </div>
    `
    document.body.append(fixture)

    addAnother = new GOVUK.Modules.AddAnother(fixture)
    addAnother.init()

    addButton = document.querySelector('.js-add-another__add-button')
  })

  afterEach(function () {
    document.body.removeChild(fixture)
  })

  it('should add an "Add" button to the container when the component is initialised', function () {
    expect(addButton).toBeTruthy()
    expect(addButton.textContent).toBe('Add another thing')
  })

  it('should add a "Remove" button to each repeated fieldset when the component is initialised', function () {
    var removeButtons = document.querySelectorAll('.js-add-another__remove-button')
    expect(removeButtons).toHaveSize(2)
    expect(removeButtons[0].textContent).toBe('Delete')
  })

  it('should hide the destroy checkbox for each repeated fieldset when the component is initialised', function () {
    var destroyCheckboxes = document.querySelectorAll('.js-add-another__destroy-checkbox')
    destroyCheckboxes.forEach(function (checkbox) {
      expect(checkbox).toBeHidden()
    })
  })

  it('should remove the empty fieldset when the component is initialised', function () {
    expect(document.querySelectorAll('.js-add-another__empty')).toHaveSize(0)
  })

  it('should add new fields with the correct values when the "Add" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    fieldset0 = document.querySelectorAll('.js-add-another__fieldset')[0]
    fieldset2 = document.querySelectorAll('.js-add-another__fieldset')[2]

    expect(document.querySelectorAll('.js-add-another__fieldset').length).toBe(3)
    expect(fieldset0.querySelector('input[type="hidden"]').value).toBe('test_id')
    expect(fieldset0.querySelector('input[type="text"]').value).toBe('test foo')
    expect(fieldset2.querySelector('input[type="text"]').value).toBe('')
    expect(fieldset0.querySelector('textarea').value).toBe('test bar')
    expect(fieldset2.querySelector('textarea').value).toBe('')
    expect(fieldset0.querySelector('legend').textContent).toBe('Thing 1')
    expect(fieldset2.querySelector('legend').textContent).toBe('Thing 3')
  })

  it('should move focus to the first relevant field in the new set when the "Add" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    expect(document.activeElement).toBe(
      document.querySelector('input[name="test[2][foo]"]')
    )
  })

  it('should increment the id/name/for values of the added fields', function () {
    window.GOVUK.triggerEvent(addButton, 'click')
    window.GOVUK.triggerEvent(addButton, 'click')

    fieldset1 = document.querySelectorAll('.js-add-another__fieldset')[1]
    fieldset2 = document.querySelectorAll('.js-add-another__fieldset')[2]
    fieldset3 = document.querySelectorAll('.js-add-another__fieldset')[3]

    expect(
      fieldset1.querySelector('input[type="hidden"]').getAttribute('name')
    ).toBe('test[1][id]')
    expect(
      fieldset2.querySelector('input[type="hidden"]').getAttribute('name')
    ).toBe('test[2][id]')
    expect(
      fieldset3.querySelector('input[type="hidden"]').getAttribute('name')
    ).toBe('test[3][id]')
    expect(fieldset1.querySelectorAll('label')[0].getAttribute('for')).toBe(
      'test_1_foo'
    )
    expect(fieldset2.querySelectorAll('label')[0].getAttribute('for')).toBe(
      'test_2_foo'
    )
    expect(fieldset3.querySelectorAll('label')[0].getAttribute('for')).toBe(
      'test_3_foo'
    )
    expect(fieldset1.querySelector('input[type="text"]').getAttribute('id')).toBe(
      'test_1_foo'
    )
    expect(fieldset2.querySelector('input[type="text"]').getAttribute('id')).toBe(
      'test_2_foo'
    )
    expect(fieldset3.querySelector('input[type="text"]').getAttribute('id')).toBe(
      'test_3_foo'
    )
    expect(
      fieldset1.querySelector('input[type="text"]').getAttribute('name')
    ).toBe('test[1][foo]')
    expect(
      fieldset2.querySelector('input[type="text"]').getAttribute('name')
    ).toBe('test[2][foo]')
    expect(
      fieldset3.querySelector('input[type="text"]').getAttribute('name')
    ).toBe('test[3][foo]')
    expect(fieldset1.querySelectorAll('label')[1].getAttribute('for')).toBe(
      'test_1_bar'
    )
    expect(fieldset2.querySelectorAll('label')[1].getAttribute('for')).toBe(
      'test_2_bar'
    )
    expect(fieldset3.querySelectorAll('label')[1].getAttribute('for')).toBe(
      'test_3_bar'
    )
    expect(fieldset1.querySelector('textarea').getAttribute('id')).toBe('test_1_bar')
    expect(fieldset2.querySelector('textarea').getAttribute('id')).toBe('test_2_bar')
    expect(fieldset3.querySelector('textarea').getAttribute('id')).toBe('test_3_bar')
    expect(fieldset1.querySelector('textarea').getAttribute('name')).toBe(
      'test[1][bar]'
    )
    expect(fieldset2.querySelector('textarea').getAttribute('name')).toBe(
      'test[2][bar]'
    )
    expect(fieldset3.querySelector('textarea').getAttribute('name')).toBe(
      'test[3][bar]'
    )
  })

  it('should hide and check the destroy checkbox for an existing field when its "Remove" button is clicked', function () {
    fieldset = document.querySelector('.js-add-another__fieldset')

    var removeButton = fieldset.querySelector('.js-add-another__remove-button')
    window.GOVUK.triggerEvent(removeButton, 'click')

    var destroyCheckbox = fieldset.querySelector('.js-add-another__destroy-checkbox input')
    expect(destroyCheckbox).toBeTruthy()
    expect(fieldset).toBeHidden()
  })

  it('should remove a new fieldset when its "Remove" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    fieldset = document.querySelectorAll('.js-add-another__fieldset')[2]

    var removeButton = fieldset.querySelector('.js-add-another__remove-button')
    window.GOVUK.triggerEvent(removeButton, 'click')

    expect(document.querySelectorAll('.js-add-another__fieldset').length).toBe(2)
  })

  it('should update the fieldset legends when an entry is removed', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    fieldset0 = document.querySelector('.js-add-another__fieldset')
    fieldset1 = document.querySelectorAll('.js-add-another__fieldset')[1]
    fieldset2 = document.querySelectorAll('.js-add-another__fieldset')[2]

    expect(fieldset0.querySelector('legend').textContent).toBe('Thing 1')
    expect(fieldset1.querySelector('legend').textContent).toBe('Thing 2')
    expect(fieldset2.querySelector('legend').textContent).toBe('Thing 3')

    var removeButton = fieldset0.querySelector('.js-add-another__remove-button')
    window.GOVUK.triggerEvent(removeButton, 'click')

    expect(fieldset1.querySelector('legend').textContent).toBe('Thing 1')
    expect(fieldset2.querySelector('legend').textContent).toBe('Thing 2')
  })

  it('should move focus to the add another button when any "Remove" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')
    window.GOVUK.triggerEvent(addButton, 'click')

    var removeButton = document.querySelectorAll('.js-add-another__remove-button')[0]
    window.GOVUK.triggerEvent(removeButton, 'click')

    expect(document.activeElement).toBe(
      document.querySelector('.js-add-another__add-button')
    )
  })
})