/* eslint-env jasmine, jquery */
/* global GOVUK */
describe('GOVUK.Modules.AddAnother', function () {
  let fixture, addAnother, addButton, removeButton, fields, fieldset0, fieldset1

  beforeEach(function () {
    fixture = document.createElement('form')
    fixture.setAttribute('data-module', 'AddAnother')
    fixture.setAttribute('data-add-button-text', 'Add another thing')
    fixture.innerHTML = `
      <div>
        <fieldset class="js-add-another__repeated-fields">
          <input type="hidden" name="test[0][id]" value="test_id" />
          <label for="test_0_foo">Foo</label>
          <input type="text" id="test_0_foo" name="test[0][foo]" value="test foo" />
          <label for="test_0_bar"></label>
          <textarea id="test_0_bar" name="test[0][bar]">test bar</textarea>
          <label for="test_0__destroy">Delete</label> 
          <input type="checkbox" id="test_0__destroy" name="test[0]_destroy" value="1" /> 
        </fieldset> 
        <!-- <fieldset class="js-add-another__repeated-fields">
          <label for="test_1_foo">Foo</label>
          <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
          <label for="test_1_bar"></label>
          <textarea id="test_1_bar" name="test[1][bar]">test bar</textarea>
        </fieldset> -->
      </div>
      
    `
    document.body.append(fixture)

    addAnother = new GOVUK.Modules.AddAnother(fixture)
    addAnother.init()

    addButton = document.querySelector('.js-add-another__add-button')
    removeButtons = document.querySelectorAll('.js-add-another__remove-button')
  })

  afterEach(function () {
    document.body.removeChild(fixture)
  })

  it('should add an "Add" button to the container when the component is initialised', function () {
    expect(addButton).toBeTruthy()
    expect(addButton.textContent).toBe('Add another thing')
  })

  it('should add a "Remove" button to each repeated fieldset when the component is initialised', function () {
    expect(removeButtons).toHaveSize(1)
    expect(removeButtons[0].textContent).toBe('Delete')
  })

  it('should add new fields with the correct values when the "Add" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    fieldset0 = document.querySelectorAll('.js-add-another__repeated-fields')[0]
    fieldset1 = document.querySelectorAll('.js-add-another__repeated-fields')[1]

    expect(document.querySelectorAll('.js-add-another__repeated-fields').length).toBe(2)
    expect(fieldset0.querySelector('input[type="hidden"]').value).toBe('test_id')
    expect(fieldset1.querySelector('input[type="hidden"]').value).toBe('')
    expect(fieldset0.querySelector('input[type="text"]').value).toBe('test foo')
    expect(fieldset1.querySelector('input[type="text"]').value).toBe('')
    expect(fieldset0.querySelector('textarea').value).toBe('test bar')
    expect(fieldset1.querySelector('textarea').value).toBe('')
  })

  it('should move focus to the first relevant field in the new set when the "Add" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    expect(document.activeElement).toBe(
      document.querySelector('input[name="test[1][foo]"]')
    )
  })

  it('should increment the id/name/for values of the added fields', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    fieldset0 = document.querySelectorAll('.js-add-another__repeated-fields')[0]
    fieldset1 = document.querySelectorAll('.js-add-another__repeated-fields')[1]

    expect(
      fieldset0.querySelector('input[type="hidden"]').getAttribute('name')
    ).toBe('test[0][id]')
    expect(
      fieldset1.querySelector('input[type="hidden"]').getAttribute('name')
    ).toBe('test[1][id]')
    expect(fieldset0.querySelectorAll('label')[0].getAttribute('for')).toBe(
      'test_0_foo'
    )
    expect(fieldset1.querySelectorAll('label')[0].getAttribute('for')).toBe(
      'test_1_foo'
    )
    expect(fieldset0.querySelector('input[type="text"]').getAttribute('id')).toBe(
      'test_0_foo'
    )
    expect(fieldset1.querySelector('input[type="text"]').getAttribute('id')).toBe(
      'test_1_foo'
    )
    expect(
      fieldset0.querySelector('input[type="text"]').getAttribute('name')
    ).toBe('test[0][foo]')
    expect(
      fieldset1.querySelector('input[type="text"]').getAttribute('name')
    ).toBe('test[1][foo]')
    expect(fieldset0.querySelectorAll('label')[1].getAttribute('for')).toBe(
      'test_0_bar'
    )
    expect(fieldset1.querySelectorAll('label')[1].getAttribute('for')).toBe(
      'test_1_bar'
    )
    expect(fieldset0.querySelector('textarea').getAttribute('id')).toBe('test_0_bar')
    expect(fieldset1.querySelector('textarea').getAttribute('id')).toBe('test_1_bar')
    expect(fieldset0.querySelector('textarea').getAttribute('name')).toBe(
      'test[0][bar]'
    )
    expect(fieldset1.querySelector('textarea').getAttribute('name')).toBe(
      'test[1][bar]'
    )
  })

  it('should add a hidden input field with the appropriate attributes for each removed set when the "Remove" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')
    window.GOVUK.triggerEvent(addButton, 'click')

    removeButton = document.querySelectorAll('.js-add-another__remove-button')[0]

    window.GOVUK.triggerEvent(removeButton, 'click')

    const hiddenField = document.querySelector('.js-hidden-destroy') || null

    expect(hiddenField).toBeTruthy()
    expect(hiddenField.id).toBe('test_0__destroy')
    expect(hiddenField.name).toBe('test[0][_destroy]')
    expect(hiddenField.value).toBe('true')
  })

  it('should remove the appropriate field when the "Remove" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')

    fields = document.querySelectorAll('.js-add-another__repeated-fields')
    removeButton = fields[0].querySelector('.js-add-another__remove-button')

    window.GOVUK.triggerEvent(removeButton, 'click')

    fieldset0 = document.querySelectorAll('.js-add-another__repeated-fields')[0]
    fieldset1 = document.querySelectorAll('.js-add-another__repeated-fields')[1]

    expect(document.querySelectorAll('.js-add-another__repeated-fields').length).toBe(1)
    expect(fieldset0).toBeTruthy()
    expect(fieldset1).toBeFalsy()
  })

  it('should move focus to the first visible field when any "Remove" button is clicked', function () {
    window.GOVUK.triggerEvent(addButton, 'click')
    window.GOVUK.triggerEvent(addButton, 'click')
    removeButton = document.querySelectorAll('.js-add-another__remove-button')[0]

    window.GOVUK.triggerEvent(removeButton, 'click')

    expect(document.activeElement).toBe(
      document.querySelector('input[name="test[1][foo]"]')
    )
  })
})
