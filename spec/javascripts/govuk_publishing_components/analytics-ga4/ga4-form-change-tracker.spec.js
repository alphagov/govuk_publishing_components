/* eslint-env jasmine */

describe('Ga4 Form Change Tracker', function () {
  const GOVUK = window.GOVUK

  let trackedInputs, mockGa4SendData, form, container

  const Form = window.GOVUK.Modules.JasmineHelpers.Form

  const expectedAttributes = {
    event_name: 'select_content',
    section: Form.formDefaultOptions.label,
    text: Form.formDefaultOptions.value
  }

  beforeEach(function () {
    window.dataLayer = []
    this.agreeToCookies()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe('should fire correct event from a tracked form', () => {
    const createFormAndSetup = (container, ...fields) => {
      form = new Form(fields)

      form.appendToParent(container)
      form.setAttribute('data-ga4-form-change-tracker', true)
      const tracker = new GOVUK.Modules.Ga4FormChangeTracker(form.form)
      tracker.init()
    }

    beforeAll(() => {
      mockGa4SendData = spyOn(
        window.GOVUK.analyticsGa4.core,
        'applySchemaAndSendData'
      )
    })

    beforeEach(() => {
      document.body.appendChild(container)
      mockGa4SendData.calls.reset()
    })

    it('when a standard input or select is selected and changed', () => {
      trackedInputs = ['radio', 'checkbox', 'text', 'textarea', 'select']

      createFormAndSetup(container, ...trackedInputs)

      trackedInputs.forEach((field, index) => {
        mockGa4SendData.calls.reset()

        const dataIndex = {
          index_section: index,
          index_section_count: trackedInputs.length
        }

        const trackedInput = form
          .querySelector(`input[type="${field}"], ${field}`)

        trackedInput.setAttribute('data-ga4-index', JSON.stringify(dataIndex))

        form.triggerChange(`input[type="${field}"], ${field}`)

        expect(mockGa4SendData).toHaveBeenCalledWith(
          {
            ...expectedAttributes,
            ...(field.match('text') ? { text: expectedAttributes.text.length } : {}),
            ...dataIndex,
            action: 'select'
          },
          'event_data'
        )
      })
    })

    it('when a radio input within a redacted container with a non-permitted value is selected and changed', () => {
      createFormAndSetup(container, 'radio')

      const fieldset = container.querySelector('fieldset')
      const input = container.querySelector('input')
      const label = container.querySelector('label')

      fieldset.setAttribute('data-ga4-redact', true)

      mockGa4SendData.calls.reset()

      input.value = '1234'
      label.innerHTML = 'Test User'

      input.click()

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          text: '[REDACTED]',
          action: 'select'
        },
        'event_data'
      )
    })

    it('when a radio input within a redacted container with a permitted value is selected and changed', () => {
      createFormAndSetup(container, 'radio')

      const fieldset = container.querySelector('fieldset')
      const input = container.querySelector('input')
      const label = container.querySelector('label')

      fieldset.setAttribute('data-ga4-redact', true)
      input.setAttribute('data-ga4-redact-permit', true)

      mockGa4SendData.calls.reset()

      input.value = 'none'
      label.innerHTML = 'None'

      input.click()

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          text: 'None',
          action: 'select'
        },
        'event_data'
      )
    })

    it('when a checkbox with a non-permitted value within a redacted container input is selected and changed', () => {
      createFormAndSetup(container, 'checkbox')

      const fieldset = container.querySelector('fieldset')
      const input = container.querySelector('input')
      const label = container.querySelector('label')

      fieldset.setAttribute('data-ga4-redact', true)

      mockGa4SendData.calls.reset()

      input.value = '1234'
      label.innerHTML = 'Test User'

      input.click()

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          text: '[REDACTED]',
          action: 'select'
        },
        'event_data'
      )
    })

    it('when a checkbox with a permitted value within a redacted container input is selected and changed', () => {
      createFormAndSetup(container, 'checkbox')

      const fieldset = container.querySelector('fieldset')
      const input = container.querySelector('input')
      const label = container.querySelector('label')

      fieldset.setAttribute('data-ga4-redact', true)
      input.setAttribute('data-ga4-redact-permit', true)

      mockGa4SendData.calls.reset()

      input.value = 'none'
      label.innerHTML = 'None'

      input.click()

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          text: 'None',
          action: 'select'
        },
        'event_data'
      )
    })

    it('when a labelled field within a fieldset is changed', () => {
      createFormAndSetup(container, 'addAnotherFieldSet')

      const index = {
        index_section: 0,
        index_section_count: 1
      }

      mockGa4SendData.calls.reset()

      const text = container.querySelector('input[type="text"]')
      text.setAttribute('data-ga4-index', JSON.stringify(index))

      form.triggerChange('input')

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          text: expectedAttributes.text.length,
          section: `${Form.formDefaultOptions.label}`,
          ...index,
          action: 'select'
        },
        'event_data'
      )
    })

    it('should track input with a value containing newlines', () => {
      createFormAndSetup(container, 'radio')

      mockGa4SendData.calls.reset()

      const input = container.querySelector('input')
      const label = container.querySelector('label')

      label.innerHTML = `this is a value

        with a new line
      `

      input.click()

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          text: 'this is a value with a new line',
          action: 'select'
        },
        'event_data'
      )
    })

    it('when a checkbox is deselected', () => {
      createFormAndSetup(container, 'checkbox')

      const index = {
        index_section: 0,
        index_section_count: 1
      }

      const checkbox = container.querySelector('input[type="checkbox"]')
      checkbox.setAttribute('data-ga4-index', JSON.stringify(index))

      form.triggerChange('input[type="checkbox"]')

      mockGa4SendData.calls.reset()

      form.triggerChange('input[type="checkbox"]')

      expect(mockGa4SendData).toHaveBeenCalledWith(
        {
          ...expectedAttributes,
          ...index,
          action: 'remove'
        },
        'event_data'
      )
    })

    describe('when the date component', () => {
      let inputs
      const index = {
        index_section: 0,
        index_section_count: 1
      }

      beforeEach(() => {
        createFormAndSetup(container, 'date')

        inputs = form.querySelectorAll('input')

        inputs.forEach((input) => {
          input.setAttribute('data-ga4-index', JSON.stringify(index))
          form.triggerChange(`input[name="${input.name}"]`)
        })
      })

      it('is entirely filled in', () => {
        expect(mockGa4SendData).toHaveBeenCalledWith(
          {
            ...expectedAttributes,
            ...index,
            action: 'select',
            text: Array(3).fill(expectedAttributes.text).join('/')
          },
          'event_data'
        )
      })

      it('is not entirely filled in', () => {
        mockGa4SendData.calls.reset()

        inputs[0].value = ''

        expect(mockGa4SendData).not.toHaveBeenCalled()
      })
    })

    describe('when multiple select', () => {
      const index = {
        index_section: 0,
        index_section_count: 1
      }
      let select, options

      beforeEach(() => {
        createFormAndSetup(container, 'select-multiple')

        select = form.querySelector('select')

        select.setAttribute('data-ga4-index', JSON.stringify(index))

        options = form.querySelectorAll('option')
        options[0].selected = true
        options[1].selected = true

        mockGa4SendData.calls.reset()
      })

      it('has an option deselected', () => {
        options[1].selected = false

        mockGa4SendData.calls.reset()

        select.dispatchEvent(
          new window.CustomEvent('change', {
            bubbles: true,
            detail: { value: options[1].value }
          })
        )

        expect(mockGa4SendData).toHaveBeenCalledWith(
          {
            ...expectedAttributes,
            ...index,
            action: 'remove'
          },
          'event_data'
        )
      })
    })
  })
})
