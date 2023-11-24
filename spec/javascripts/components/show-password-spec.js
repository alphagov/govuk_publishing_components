/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('A show password component', function () {
  var element

  describe('in password reveal mode', function () {
    beforeEach(function () {
      element = $(
        '<div class="gem-c-show-password" data-module="show-password" data-disable-form-submit-check="false" data-show-text="Show" data-hide-text="Hide" data-show-full-text="Show password" data-hide-full-text="Hide password" data-announce-show="Your password is shown" data-announce-hide="Your password is hidden">' +
          '<div class="govuk-form-group">' +
            '<label for="input" class="gem-c-label govuk-label">Please enter your password</label>' +
            '<input name="password" value="this is my password" class="gem-c-input govuk-input" id="input" type="password" autocomplete="off">' +
          '</div>' +
        '</div>'
      )
      /* eslint-disable no-new */
      /* eslint-disable no-new */
      new GOVUK.Modules.ShowPassword(element[0])
    })

    afterEach(function () {
      element.remove()
    })

    it('adds the required elements for password reveal', function () {
      expect(element.find('.gem-c-show-password__input-wrapper').length).toBe(1)
      expect(element.find('.gem-c-input.gem-c-input--with-password').length).toBe(1)
      expect(element.find('.gem-c-show-password__toggle').length).toBe(1)
      expect(element.find('.gem-c-show-password__toggle').text()).toBe('Show')
      expect(element.find('.gem-c-show-password__toggle').attr('aria-label')).toBe('Show password')
      expect(element.find('.gem-c-show-password__toggle').attr('aria-controls')).toBe('input')
      expect(element.find('.gem-c-show-password__toggle').attr('type')).toBe('button')
      expect(element.find('.govuk-visually-hidden').length).toBe(1)
      expect(element.find('.govuk-visually-hidden').text()).toBe('Your password is hidden')
    })

    it('reveals the password when clicked', function () {
      element.find('.gem-c-show-password__toggle').trigger('click')

      expect(element.find('.gem-c-show-password__toggle').text()).toBe('Hide')
      expect(element.find('.gem-c-show-password__toggle').attr('aria-label')).toBe('Hide password')
      expect(element.find('input[name="password"]').attr('type')).toBe('text')
      expect(element.find('.govuk-visually-hidden').text()).toBe('Your password is shown')
    })

    it('hides the password when clicked again', function () {
      element.find('.gem-c-show-password__toggle').trigger('click')
      element.find('.gem-c-show-password__toggle').trigger('click')

      expect(element.find('.gem-c-show-password__toggle').text()).toBe('Show')
      expect(element.find('.gem-c-show-password__toggle').attr('aria-label')).toBe('Show password')
      expect(element.find('input[name="password"]').attr('type')).toBe('password')
      expect(element.find('.govuk-visually-hidden').text()).toBe('Your password is hidden')
    })
  })

  describe('in password reveal mode inside a form', function () {
    beforeEach(function () {
      element = $(
        '<form>' +
          '<div class="gem-c-show-password" data-module="show-password" data-show-text="Show" data-hide-text="Hide" data-show-full-text="Show password" data-hide-full-text="Hide password" data-announce-show="Your password is shown" data-announce-hide="Your password is hidden">' +
            '<div class="govuk-form-group">' +
              '<label for="input" class="gem-c-label govuk-label">Please enter your password</label>' +
              '<input name="password" value="this is my password" class="gem-c-input govuk-input" id="input" type="password" autocomplete="off">' +
            '</div>' +
          '</div>' +
          '<button type="submit">Submit</button>' +
        '</form>'
      )
      $('body').append(element)
      /* eslint-disable no-new */
      /* eslint-disable no-new */
      new GOVUK.Modules.ShowPassword(element.find('.gem-c-show-password')[0])
      $('body').on('submit', function (e) {
        e.preventDefault()
      })
    })

    afterEach(function () {
      element.remove()
      $('body').off()
    })

    it('reverts the inputs to type password when the form is submitted', function () {
      element.find('.gem-c-show-password__toggle').trigger('click')
      expect(element.find('input[name="password"]').attr('type')).toBe('text')

      element.find('button[type="submit"]').click()
      expect(element.find('.gem-c-show-password__toggle').text()).toBe('Show')
      expect(element.find('.gem-c-show-password__toggle').attr('aria-label')).toBe('Show password')
      expect(element.find('input[name="password"]').attr('type')).toBe('password')
      expect(element.find('.govuk-visually-hidden').text()).toBe('Your password is hidden')
    })
  })

  describe('in password reveal mode inside a form', function () {
    beforeEach(function () {
      element = $(
        '<form>' +
          '<div class="gem-c-show-password" data-module="show-password" data-disable-form-submit-check="true" data-show-text="Show" data-hide-text="Hide" data-show-full-text="Show password" data-hide-full-text="Hide password" data-announce-show="Your password is shown" data-announce-hide="Your password is hidden">' +
            '<div class="govuk-form-group">' +
              '<label for="input" class="gem-c-label govuk-label">Please enter your password</label>' +
              '<input name="password" value="this is my password" class="gem-c-input govuk-input" id="input" type="password" autocomplete="off">' +
            '</div>' +
          '</div>' +
          '<button type="submit">Submit</button>' +
        '</form>'
      )
      $('body').append(element)
      /* eslint-disable no-new */
      /* eslint-disable no-new */
      new GOVUK.Modules.ShowPassword(element.find('.gem-c-show-password')[0])
      $('body').on('submit', function (e) {
        e.preventDefault()
      })
    })

    afterEach(function () {
      element.remove()
      $('body').off()
    })

    it('doesn\'t revert the inputs to type password when the form is submitted if the disable check flag is set', function () {
      element.find('.gem-c-show-password__toggle').trigger('click')
      expect(element.find('input[name="password"]').attr('type')).toBe('text')

      element.find('button[type="submit"]').click()
      expect(element.find('.gem-c-show-password__toggle').text()).toBe('Hide')
      expect(element.find('.gem-c-show-password__toggle').attr('aria-label')).toBe('Hide password')
      expect(element.find('input[name="password"]').attr('type')).toBe('text')
      expect(element.find('.govuk-visually-hidden').text()).toBe('Your password is shown')
    })
  })

  describe('with data attributes', function () {
    beforeEach(function () {
      element = $(
        '<div class="gem-c-show-password" data-module="show-password" data-disable-form-submit-check="false" data-show-text="Show" data-hide-text="Hide" data-show-full-text="Show password" data-hide-full-text="Hide password" data-announce-show="Your password is shown" data-announce-hide="Your password is hidden">' +
          '<div class="govuk-form-group">' +
            '<label for="input" class="gem-c-label govuk-label">Please enter your password</label>' +
            '<input name="password" value="this is my password" class="gem-c-input govuk-input" id="input" type="password" autocomplete="off" data-normal-attribute-one="one" data-normal-attribute-two="two" data-button-moving-attribute-one="button-one" data-button-moving-attribute-two="button-two">' +
          '</div>' +
        '</div>'
      )
      /* eslint-disable no-new */
      new GOVUK.Modules.ShowPassword(element[0])
    })

    afterEach(function () {
      element.remove()
    })

    it('applies data attributes to the button correctly', function () {
      expect(element.find('input').attr('data-normal-attribute-one')).toBe('one')
      expect(element.find('input').attr('data-normal-attribute-two')).toBe('two')
      expect(element.find('input')[0].hasAttribute('data-button-moving-attribute-one')).toBe(false)
      expect(element.find('input')[0].hasAttribute('data-button-moving-attribute-two')).toBe(false)

      expect(element.find('button').attr('data-moving-attribute-one')).toBe('button-one')
      expect(element.find('button').attr('data-moving-attribute-two')).toBe('button-two')
    })
  })
})
