/* eslint-env jasmine, jquery */
/* global GOVUK */
describe('GOVUK.Modules.AddAnother', function () {
  var fixture, addAnother, addButton, fieldset, fieldset0, fieldset1, fieldset2, fieldset3

  function checkEventData (visibleFields, startIndex = 1, indexSectionCount = null) {
    visibleFields.forEach(function (field, index) {
      var trackedRemoveButton = field.parentNode.querySelector('.js-add-another__remove-button[data-ga4-event]')

      expect(trackedRemoveButton).toBeTruthy()

      expect(trackedRemoveButton.dataset.ga4Event).toBe(JSON.stringify({
        event_name: 'select_content',
        type: 'add another',
        action: 'deleted'
      }))

      expect(trackedRemoveButton.dataset.indexSection).toBe(String(startIndex + index))
      expect(trackedRemoveButton.dataset.indexSectionCount).toBe(String(indexSectionCount || visibleFields.length))
    })
  }

  describe('One fieldset is rendered', function () {
    beforeEach(function () {
      fixture = document.createElement('form')
      fixture.setAttribute('data-module', 'AddAnother')
      fixture.setAttribute('data-fieldset-legend', 'Thing')
      fixture.setAttribute('data-add-button-text', 'Add another thing')
      fixture.setAttribute('data-component-id', '123')
      fixture.innerHTML = `
        <div>
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__empty" data-parent-component-id="123">
            <fieldset>
              <legend>Thing 2</legend>
              <input type="hidden" name="test[1][id]" value="test_id" />
              <label for="test_1_foo">Foo</label>
              <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
              <label for="test_1_bar"></label>
              <textarea id="test_1_bar" name="test[1][bar]"></textarea>
              <label for="test_1__destroy">Delete</label>
            </fieldset>
          </div>
          <template class="js-add-another__empty-template" data-parent-component-id="123">
            <div class="js-add-another__fieldset" data-parent-component-id="123">
              <fieldset>
                <legend>Thing 2</legend>
                <input type="hidden" name="test[1][id]" value="test_id" />
                <label for="test_1_foo">Foo</label>
                <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
                <label for="test_1_bar"></label>
                <textarea id="test_1_bar" name="test[1][bar]"></textarea>
                <label for="test_1__destroy">Delete</label>
              </fieldset>
            </div>
          </template>
        </div>
      `
      document.body.append(fixture)

      addAnother = new GOVUK.Modules.AddAnother(fixture)
      addButton = document.querySelector('.js-add-another__add-button')
    })

    afterEach(function () {
      document.body.removeChild(fixture)
    })

    it('should add a hidden "Remove" button to the fieldset when the component is initialised with `empty_fields` set to false', function () {
      fixture.setAttribute('data-empty-fields', 'false')
      addAnother.init()

      var removeButtons = document.querySelectorAll('.js-add-another__remove-button')

      expect(removeButtons).toHaveSize(1)
      expect(removeButtons[0].textContent).toBe('Delete')
      expect(removeButtons[0].classList.contains('js-add-another__remove-button--hidden')).toBe(true)
    })

    it('should add a visible "Remove" button to the fieldset when the component is initialised with `empty_fields` set to true', function () {
      fixture.setAttribute('data-empty-fields', 'true')
      addAnother.init()

      var removeButtons = document.querySelectorAll('.js-add-another__remove-button')

      expect(removeButtons).toHaveSize(1)
      expect(removeButtons[0].textContent).toBe('Delete')
      expect(removeButtons[0].classList.contains('js-add-another__remove-button--hidden')).toBe(false)
    })
  })

  describe('GA4 is disabled', function () {
    beforeEach(function () {
      fixture = document.createElement('form')
      fixture.setAttribute('data-module', 'AddAnother')
      fixture.setAttribute('data-disable-ga4', 'true')
      fixture.setAttribute('data-fieldset-legend', 'Thing')
      fixture.setAttribute('data-add-button-text', 'Add another thing')
      fixture.setAttribute('data-component-id', '123')
      fixture.innerHTML = `
        <div>
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__empty" data-parent-component-id="123">
            <fieldset>
              <legend>Thing 2</legend>
              <input type="hidden" name="test[1][id]" value="test_id" />
              <label for="test_1_foo">Foo</label>
              <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
              <label for="test_1_bar"></label>
              <textarea id="test_1_bar" name="test[1][bar]"></textarea>
              <label for="test_1__destroy">Delete</label>
            </fieldset>
          </div>
          <template class="js-add-another__empty-template" data-parent-component-id="123">
            <div class="js-add-another__fieldset" data-parent-component-id="123">
              <fieldset>
                <legend>Thing 2</legend>
                <input type="hidden" name="test[1][id]" value="test_id" />
                <label for="test_1_foo">Foo</label>
                <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
                <label for="test_1_bar"></label>
                <textarea id="test_1_bar" name="test[1][bar]"></textarea>
                <label for="test_1__destroy">Delete</label>
              </fieldset>
            </div>
          </template>
        </div>
      `
      document.body.append(fixture)

      addAnother = new GOVUK.Modules.AddAnother(fixture)
      addButton = document.querySelector('.js-add-another__add-button')
    })

    it('should not add data attributes', function () {
      var trackedElements = document.querySelectorAll('[data-ga4-event]')

      expect(trackedElements.length).toBeFalsy()
    })

    afterEach(function () {
      document.body.removeChild(fixture)
    })
  })

  describe('Two fieldsets are rendered', function () {
    beforeEach(function () {
      fixture = document.createElement('form')
      fixture.setAttribute('data-module', 'AddAnother')
      fixture.setAttribute('data-fieldset-legend', 'Thing')
      fixture.setAttribute('data-add-button-text', 'Add another thing')
      fixture.setAttribute('data-component-id', '123')
      fixture.innerHTML = `
        <div>
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__empty" data-parent-component-id="123">
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
          <template class="js-add-another__empty-template" data-parent-component-id="123">
            <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          </template>
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

    it('should add data attributes if GA4 enabled', function () {
      var visibleFields = document.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

      checkEventData(visibleFields)
    })

    it('should update GA4 data attributes when the "Add" button is clicked', function () {
      window.GOVUK.triggerEvent(addButton, 'click')

      var visibleFields = document.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

      checkEventData(visibleFields)
    })

    it('should add an "Add" button to the container when the component is initialised', function () {
      expect(addButton).toBeTruthy()
      expect(addButton.textContent).toBe('Add another thing')
    })

    it('should add hidden "Remove" buttons to each repeated fieldset when the component is initialised', function () {
      var removeButtons = document.querySelectorAll('.js-add-another__remove-button')
      expect(removeButtons).toHaveSize(2)
      expect(removeButtons[0].textContent).toBe('Delete')
      expect(removeButtons[0].classList.contains('js-add-another__remove-button--hidden')).toBe(false)
      expect(removeButtons[1].classList.contains('js-add-another__remove-button--hidden')).toBe(false)
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

    it('should update GA4 data attributes when an entry is removed', function () {
      window.GOVUK.triggerEvent(addButton, 'click')

      var visibleFields = document.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

      checkEventData(visibleFields)

      fieldset0 = document.querySelector('.js-add-another__fieldset')
      var removeButton = fieldset0.querySelector('.js-add-another__remove-button')
      window.GOVUK.triggerEvent(removeButton, 'click')

      visibleFields = document.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

      checkEventData(visibleFields)
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

    it('should ignore fieldsets with a different data-parent-component-id', function () {
      var foreignFieldset = document.createElement('div')
      foreignFieldset.className = 'js-add-another__fieldset'
      foreignFieldset.setAttribute('data-parent-component-id', '999')
      foreignFieldset.innerHTML = '<fieldset><legend>Foreign Thing</legend></fieldset>'
      fixture.appendChild(foreignFieldset)

      // Trigger an update which recalculates legends/indices
      window.GOVUK.triggerEvent(addButton, 'click')

      // The foreign fieldset legend should remain unchanged and not be counted
      expect(foreignFieldset.querySelector('legend').textContent).toBe('Foreign Thing')

      // Check that our module only sees its own 3 fieldsets (2 original + 1 added)
      var internalFieldsets = fixture.querySelectorAll('.js-add-another__fieldset[data-parent-component-id="123"]')
      expect(internalFieldsets.length).toBe(3)
      expect(internalFieldsets[2].querySelector('legend').textContent).toBe('Thing 3')
    })
  })

  describe('One fieldset is rendered with additional GA4 attributes set', function () {
    beforeEach(function () {
      fixture = document.createElement('form')
      fixture.setAttribute('data-module', 'add-another')
      fixture.setAttribute('data-fieldset-legend', 'Thing')
      fixture.setAttribute('data-add-button-text', 'Add another thing')
      fixture.setAttribute('data-ga4-start-index', '2')
      fixture.setAttribute('data-ga4-index-section-count', '5')
      fixture.setAttribute('data-component-id', '123')
      fixture.innerHTML = `
        <div>
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__empty" data-parent-component-id="123">
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
          <template class="js-add-another__empty-template" data-parent-component-id="123">
            <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          </template>
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

    it('should add data attributes if GA4 enabled', function () {
      var visibleFields = document.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

      checkEventData(visibleFields, 2, 5)
    })

    it('should update GA4 data attributes when the "Add" button is clicked', function () {
      window.GOVUK.triggerEvent(addButton, 'click')

      var visibleFields = document.querySelectorAll('.js-add-another__fieldset:not([hidden]) > fieldset')

      checkEventData(visibleFields, 2, 5)
    })
  })

  describe('starting modules on new fieldsets', function () {
    beforeEach(function () {
      GOVUK.Modules.TestModule = function (module) {}

      fixture = document.createElement('form')
      fixture.setAttribute('data-module', 'AddAnother')
      fixture.setAttribute('data-fieldset-legend', 'Thing')
      fixture.setAttribute('data-add-button-text', 'Add another thing')
      fixture.setAttribute('data-component-id', '123')
      fixture.innerHTML = `
        <div>
          <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          <div class="js-add-another__empty" data-parent-component-id="123">
            <fieldset>
              <legend>Thing 2</legend>
              <input type="hidden" name="test[1][id]" value="test_id" />
              <label for="test_1_foo">Foo</label>
              <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
              <label for="test_1_bar"></label>
              <textarea id="test_1_bar" name="test[1][bar]"></textarea>
              <label for="test_1__destroy">Delete</label>
            </fieldset>
          </div>
          <template class="js-add-another__empty-template" data-parent-component-id="123">
            <div class="js-add-another__fieldset" data-module="test-module" data-parent-component-id="123">
              <fieldset>
                <legend>Thing 2</legend>
                <input type="hidden" name="test[1][id]" value="test_id" />
                <label for="test_1_foo">Foo</label>
                <input type="text" id="test_1_foo" name="test[1][foo]" value="" />
                <label for="test_1_bar"></label>
                <textarea id="test_1_bar" name="test[1][bar]"></textarea>
                <label for="test_1__destroy">Delete</label>
              </fieldset>
            </div>
          </template>
        </div>
      `
      document.body.append(fixture)

      addAnother = new GOVUK.Modules.AddAnother(fixture)
      addAnother.init()

      addButton = document.querySelector('.js-add-another__add-button')
    })

    afterEach(function () {
      document.body.removeChild(fixture)
      delete GOVUK.Modules.TestModule
    })

    it('should start modules in new fields', function () {
      window.GOVUK.triggerEvent(addButton, 'click')
      var newFieldset = document.querySelectorAll('.js-add-another__fieldset')[1]
      expect(newFieldset.dataset.testModuleModuleStarted).toBeDefined()
    })
  })

  describe('AddAnother with sortable functionality', function () {
    let fixture
    let addAnother

    function checkMoveButtonsEventData (visibleFields, startIndex = 1, indexSectionCount = null) {
      visibleFields.forEach(function (field, index) {
        var trackedMoveUpButton = field.querySelector('.gem-c-add-another__move-button[data-ga4-event][data-action="move-up"]')
        var trackedMoveDownButton = field.querySelector('.gem-c-add-another__move-button[data-ga4-event][data-action="move-down"]')

        expect(trackedMoveUpButton).toBeTruthy()
        expect(trackedMoveDownButton).toBeTruthy()

        expect(trackedMoveUpButton.dataset.ga4Event).toBe(JSON.stringify({
          event_name: 'select_content',
          type: 'add another',
          action: 'move-up'
        }))

        expect(trackedMoveDownButton.dataset.ga4Event).toBe(JSON.stringify({
          event_name: 'select_content',
          type: 'add another',
          action: 'move-down'
        }))

        expect(trackedMoveUpButton.dataset.indexSection).toBe(String(startIndex + index))
        expect(trackedMoveUpButton.dataset.indexSectionCount).toBe(String(indexSectionCount || visibleFields.length))

        expect(trackedMoveDownButton.dataset.indexSection).toBe(String(startIndex + index))
        expect(trackedMoveDownButton.dataset.indexSectionCount).toBe(String(indexSectionCount || visibleFields.length))
      })
    }

    beforeEach(function () {
      fixture = document.createElement('form')
      fixture.setAttribute('data-module', 'AddAnother')
      fixture.setAttribute('data-fieldset-legend', 'Thing')
      fixture.setAttribute('data-add-button-text', 'Add another thing')
      fixture.setAttribute('data-sortable', 'true')
      fixture.setAttribute('data-component-id', '123')
      fixture.innerHTML = `
          <div class="js-add-another__fieldset" data-parent-component-id="123">
            <fieldset>
              <legend>Thing 1</legend>
              <div class="js-add-another__order-input">
                <label class="gem-c-label govuk-label">
                  Position<span class='govuk-visually-hidden'> for Thing 1</span>
                  <input class="gem-c-input govuk-input govuk-input--width-2" id="test_0_order" name="test[0]order" value="1">
                </label>
              </div>
              <input type="hidden" name="test[0][id]" value="test_id" />
              <label for="test_0_foo">Foo</label>
              <input type="text" id="test_0_foo" name="test[0][foo]" value="ABC" />
              <label for="test_0_bar"></label>
              <textarea id="test_0_bar" name="test[0][bar]">ABC</textarea>
              <label for="test_0__destroy">Delete</label>
              <div class="js-add-another__destroy-checkbox">
                <input type="checkbox" id="test_0_destroy" name="test[0][_destroy]" />
              </div>
            </fieldset>
          </div>
          <div class="js-add-another__fieldset" data-parent-component-id="123">
            <fieldset>
              <legend>Thing 2</legend>
              <div class="js-add-another__order-input">
                <label class="gem-c-label govuk-label">
                  Position<span class='govuk-visually-hidden'> for Thing 2</span>
                  <input class="gem-c-input govuk-input govuk-input--width-2" id="test_1_order" name="test[1]order" value="2">
                </label>
              </div>
              <input type="hidden" name="test[1][id]" value="test_id" />
              <label for="test_1_foo">Foo</label>
              <input type="text" id="test_1_foo" name="test[1][foo]" value="DEF" />
              <label for="test_1_bar"></label>
              <textarea id="test_1_bar" name="test[1][bar]">DEF</textarea>
              <label for="test_1__destroy">Delete</label>
              <div class="js-add-another__destroy-checkbox">
                <input type="checkbox" id="test_1_destroy" name="test[1][_destroy]" />
              </div>
            </fieldset>
          </div>
          <div class="js-add-another__empty" data-parent-component-id="123">
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
          <template class="js-add-another__empty-template" data-parent-component-id="123">
            <div class="js-add-another__fieldset" data-parent-component-id="123">
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
          </template>
`
      document.body.append(fixture)

      addAnother = new GOVUK.Modules.AddAnother(fixture)
      addAnother.init()
      addButton = document.querySelector('.js-add-another__add-button')
    })

    afterEach(function () {
      document.body.removeChild(fixture)
    })

    it('adds move buttons to each visible fieldset', function () {
      const fieldsets = fixture.querySelectorAll('.js-add-another__fieldset:not([hidden])')
      fieldsets.forEach(function (fieldset) {
        const wrapper = fieldset.querySelector('.gem-c-add-another__move-button-wrapper')
        expect(wrapper).not.toBeNull()
        expect(wrapper.querySelector('button[data-action="move-up"]')).not.toBeNull()
        expect(wrapper.querySelector('button[data-action="move-down"]')).not.toBeNull()
      })
    })

    it('hides the order inputs', function () {
      const fieldsets = fixture.querySelectorAll('.js-add-another__fieldset:not([hidden])')
      fieldsets.forEach(function (fieldset) {
        const orderInput = fieldset.querySelector('.js-add-another__order-input')
        expect(orderInput.hidden).toEqual(true)
      })
    })

    it('moves a fieldset down when move-down button is clicked', function () {
      let firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]
      const moveDownButton = firstFieldset.querySelector('button[data-action="move-down"]')
      window.GOVUK.triggerEvent(moveDownButton, 'click')

      firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]

      expect(firstFieldset.querySelector('legend').textContent).toEqual('Thing 1')
      expect(firstFieldset.querySelector('input[name="test[0][foo]"]').value).toEqual('DEF')
      expect(firstFieldset.querySelector('textarea[name="test[0][bar]"]').value).toEqual('DEF')

      expect(firstFieldset.querySelector('.js-add-another__order-input input').value).toEqual('1')

      var secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]

      expect(secondFieldset.querySelector('legend').textContent).toEqual('Thing 2')
      expect(secondFieldset.querySelector('input[name="test[1][foo]"]').value).toEqual('ABC')
      expect(secondFieldset.querySelector('textarea[name="test[1][bar]"]').value).toEqual('ABC')

      expect(secondFieldset.querySelector('.js-add-another__order-input input').value).toEqual('2')
    })

    it('moves a fieldset up when move-up button is clicked', function () {
      let secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]
      const moveUpButton = secondFieldset.querySelector('button[data-action="move-up"]')
      window.GOVUK.triggerEvent(moveUpButton, 'click')

      var firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]

      expect(firstFieldset.querySelector('legend').textContent).toEqual('Thing 1')
      expect(firstFieldset.querySelector('input[name="test[0][foo]"]').value).toEqual('DEF')
      expect(firstFieldset.querySelector('textarea[name="test[0][bar]"]').value).toEqual('DEF')

      expect(firstFieldset.querySelector('.js-add-another__order-input input').value).toEqual('1')

      secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]

      expect(secondFieldset.querySelector('legend').textContent).toEqual('Thing 2')
      expect(secondFieldset.querySelector('input[name="test[1][foo]"]').value).toEqual('ABC')
      expect(secondFieldset.querySelector('textarea[name="test[1][bar]"]').value).toEqual('ABC')

      expect(secondFieldset.querySelector('.js-add-another__order-input input').value).toEqual('2')
    })

    it('adds GA4 data attributes to move buttons', function () {
      const fieldsets = fixture.querySelectorAll('.js-add-another__fieldset:not([hidden])')
      checkMoveButtonsEventData(fieldsets)
    })

    it('updates GA4 data attributes on move buttons when move-up is clicked', function () {
      const secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]
      const moveUpButton = secondFieldset.querySelector('button[data-action="move-up"]')
      window.GOVUK.triggerEvent(moveUpButton, 'click')

      const fieldsets = fixture.querySelectorAll('.js-add-another__fieldset:not([hidden])')
      checkMoveButtonsEventData(fieldsets)
    })

    it('updates GA4 data attributes on move buttons when move-down is clicked', function () {
      const firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]
      const moveDownButton = firstFieldset.querySelector('button[data-action="move-down"]')
      window.GOVUK.triggerEvent(moveDownButton, 'click')

      const fieldsets = fixture.querySelectorAll('.js-add-another__fieldset:not([hidden])')
      checkMoveButtonsEventData(fieldsets)
    })

    it('allows moving a newly added fieldset when button is clicked', function () {
      window.GOVUK.triggerEvent(addButton, 'click')

      var newFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[2]

      newFieldset.querySelector('input[name="test[2][foo]"]').value = 'GHI'
      newFieldset.querySelector('textarea[name="test[2][bar]"]').value = 'GHI'

      const moveUpButton = newFieldset.querySelector('button[data-action="move-up"]')
      window.GOVUK.triggerEvent(moveUpButton, 'click')

      let firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]

      expect(firstFieldset.querySelector('legend').textContent).toEqual('Thing 1')
      expect(firstFieldset.querySelector('input[name="test[0][foo]"]').value).toEqual('ABC')
      expect(firstFieldset.querySelector('textarea[name="test[0][bar]"]').value).toEqual('ABC')

      let secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]

      expect(secondFieldset.querySelector('legend').textContent).toEqual('Thing 2')
      expect(secondFieldset.querySelector('input[name="test[1][foo]"]').value).toEqual('GHI')
      expect(secondFieldset.querySelector('textarea[name="test[1][bar]"]').value).toEqual('GHI')

      let thirdFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[2]

      expect(thirdFieldset.querySelector('legend').textContent).toEqual('Thing 3')
      expect(thirdFieldset.querySelector('input[name="test[2][foo]"]').value).toEqual('DEF')
      expect(thirdFieldset.querySelector('textarea[name="test[2][bar]"]').value).toEqual('DEF')

      const moveDownButton = newFieldset.querySelector('button[data-action="move-down"]')
      window.GOVUK.triggerEvent(moveDownButton, 'click')

      firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]

      expect(firstFieldset.querySelector('legend').textContent).toEqual('Thing 1')
      expect(firstFieldset.querySelector('input[name="test[0][foo]"]').value).toEqual('ABC')
      expect(firstFieldset.querySelector('textarea[name="test[0][bar]"]').value).toEqual('ABC')

      secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]

      expect(secondFieldset.querySelector('legend').textContent).toEqual('Thing 2')
      expect(secondFieldset.querySelector('input[name="test[1][foo]"]').value).toEqual('DEF')
      expect(secondFieldset.querySelector('textarea[name="test[1][bar]"]').value).toEqual('DEF')

      thirdFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[2]

      expect(thirdFieldset.querySelector('legend').textContent).toEqual('Thing 3')
      expect(thirdFieldset.querySelector('input[name="test[2][foo]"]').value).toEqual('GHI')
      expect(thirdFieldset.querySelector('textarea[name="test[2][bar]"]').value).toEqual('GHI')
    })

    it('re-initializes sortable after adding a new fieldset', function () {
      spyOn(addAnother, 'makeSortable').and.callThrough()
      const addButton = fixture.querySelector('.js-add-another__add-button')
      addButton.click()

      expect(addAnother.makeSortable).toHaveBeenCalled()
      const fieldsets = fixture.querySelectorAll('.js-add-another__fieldset:not([hidden])')
      expect(fieldsets.length).toBe(3)
      fieldsets.forEach(function (fieldset) {
        expect(fieldset.querySelector('.gem-c-add-another__move-button-wrapper')).not.toBeNull()
      })
    })

    it('makes the first move up and first down buttons disabled', function () {
      const firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]
      const secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]

      // Correct top and bottom fieldsets are disabled
      expect(firstFieldset.querySelector('button[data-action="move-up"]')).toBeDisabled()
      expect(firstFieldset.querySelector('button[data-action="move-down"]')).not.toBeDisabled()

      expect(secondFieldset.querySelector('button[data-action="move-up"]')).not.toBeDisabled()
      expect(secondFieldset.querySelector('button[data-action="move-down"]')).toBeDisabled()

      const addButton = fixture.querySelector('.js-add-another__add-button')
      addButton.click()

      // Newly added fieldset has the move down button disabled
      const newFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[2]
      expect(newFieldset.querySelector('button[data-action="move-down"]')).toBeDisabled()

      // Fieldset that was previously at the bottom does not have the move down button disabled
      expect(secondFieldset.querySelector('button[data-action="move-down"]')).not.toBeDisabled()
    })

    describe('setting focus', function () {
      function triggerKeyboardEvent (element) {
        var event = new window.Event('click')
        event.detail = 0
        element.dispatchEvent(event)
      }

      var firstFieldset
      var secondFieldset

      beforeEach(function () {
        firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]
        secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]
      })

      it('sets focus on the move down button when the target fieldset is at the top', function () {
        var moveUpButton = secondFieldset.querySelector('button[data-action="move-up"]')

        triggerKeyboardEvent(moveUpButton)

        firstFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[0]
        expect(document.activeElement === firstFieldset.querySelector('button[data-action="move-down"]')).toBeTruthy()
      })

      it('sets focus on the move up button when the target fieldset is at the bottom', function () {
        var moveDownButton = firstFieldset.querySelector('button[data-action="move-down"]')

        triggerKeyboardEvent(moveDownButton)

        secondFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]
        expect(document.activeElement === secondFieldset.querySelector('button[data-action="move-up"]')).toBeTruthy()
      })

      it('sets focus on the clicked button when the target fieldset is in the middle', function () {
        var addButton = fixture.querySelector('.js-add-another__add-button')
        addButton.click()

        var moveDownButton = firstFieldset.querySelector('button[data-action="move-down"]')

        triggerKeyboardEvent(moveDownButton)

        var middleFieldset = fixture.querySelectorAll('.js-add-another__fieldset')[1]

        expect(document.activeElement === middleFieldset.querySelector('button[data-action="move-down"]')).toBeTruthy()
      })
    })
  })
})
