/* eslint-env jasmine */
/* global GOVUK */

describe('A stepnav module', function () {
  'use strict'

  var element
  var container

  function clickShowHideAll () {
    element.querySelector('.js-step-controls-button').click()
  }

  function createFixture (attr = '', css = '') {
    container = document.createElement('div')
    container.innerHTML = '<div data-module="gemstepnav" class="gem-c-step-nav js-hidden ' + css + '" data-id="unique-id" data-show-text="Show" data-hide-text="Hide" data-show-all-text="Show all steps" data-hide-all-text="Hide all steps"' + attr + '>' +
      '<ol class="gem-c-step-nav__steps">' +
        '<li class="gem-c-step-nav__step js-step" id="topic-step-one">' +
          '<div class="gem-c-step-nav__header js-toggle-panel" data-position="1">' +
            '<h2 class="gem-c-step-nav__title">' +
              '<div class="gem-c-step-nav__circle">' +
                '<span class="gem-c-step-nav__circle-inner">' +
                  '<span class="gem-c-step-nav__circle-background">' +
                    '<span class="visuallyhidden">Step</span> 1' +
                  '</span>' +
                '</span>' +
              '</div>' +
              '<span class="js-step-title">Topic Step One</span>' +
            '</h2>' +
          '</div>' +
          '<div class="gem-c-step-nav__panel js-panel" id="step-panel-topic-step-one-1">' +
            '<ol class="gem-c-step-nav__list" data-length="1">' +
              '<li class="gem-c-step-nav__list-item js-list-item">' +
                '<a href="#link1" class="gem-c-step-nav__link js-link" data-position="1.1">Link 1</a>' +
              '</li>' +
            '</ol>' +
          '</div>' +
        '</li>' +
        '<li class="gem-c-step-nav__step js-step" id="topic-step-two">' +
          '<div class="gem-c-step-nav__header js-toggle-panel" data-position="2">' +
            '<h2 class="gem-c-step-nav__title">' +
              '<div class="gem-c-step-nav__circle">' +
                '<span class="gem-c-step-nav__circle-inner">' +
                  '<span class="gem-c-step-nav__circle-background">' +
                    '<span class="visuallyhidden">Step</span> 2' +
                  '</span>' +
                '</span>' +
              '</div>' +
              '<span class="js-step-title">Topic Step Two</span>' +
            '</h2>' +
          '</div>' +
          '<div class="gem-c-step-nav__panel js-panel" id="step-panel-topic-step-two-1">' +
            '<ol class="gem-c-step-nav__list" data-length="2">' +
              '<li class="gem-c-step-nav__list-item js-will-be-an-active-link js-list-item">' +
                '<a href="#link2" class="gem-c-step-nav__link js-link" data-position="2.1"><span class="visuallyhidden">You are currently viewing: </span>Link 2</a>' +
              '</li>' +
              '<li class="gem-c-step-nav__list-item js-list-item">' +
                '<a href="#link3" class="gem-c-step-nav__link js-link" data-position="2.2">Link 3</a>' +
              '</li>' +
              '<li class="gem-c-step-nav__list-item js-will-be-an-active-link js-list-item">' +
                '<a href="#content" class="gem-c-step-nav__link js-link" data-position="2.3"><span class="visuallyhidden">You are currently viewing: </span>Link 4</a>' +
              '</li>' +
            '</ol>' +
          '</div>' +
        '</li>' +
        '<li class="gem-c-step-nav__step gem-c-step-nav__step--active js-step" id="topic-step-three" data-optional>' +
          '<div class="gem-c-step-nav__header js-toggle-panel" data-position="3">' +
            '<h2 class="gem-c-step-nav__title">' +
              '<div class="gem-c-step-nav__circle">' +
                '<span class="gem-c-step-nav__circle-inner">' +
                  '<span class="gem-c-step-nav__circle-background">' +
                    '<span class="visuallyhidden">Step</span> 3' +
                  '</span>' +
                '</span>' +
              '</div>' +
              '<span class="js-step-title">Topic Step Three</span>' +
            '</h2>' +
          '</div>' +
          '<div class="gem-c-step-nav__panel js-panel" id="step-panel-topic-step-three-1">' +
            '<ol class="gem-c-step-nav__list" data-length="5">' +
              '<li class="gem-c-step-nav__list-item js-will-be-an-active-link js-list-item">' +
                '<a href="#link4" class="gem-c-step-nav__link js-link" data-position="3.1"><span class="visuallyhidden">You are currently viewing: </span>Link 5</a>' +
              '</li>' +
              '<li class="gem-c-step-nav__list-item js-will-be-an-active-link js-list-item">' +
                '<a href="#link5" class="gem-c-step-nav__link js-link" data-position="3.2"><span class="visuallyhidden">You are currently viewing: </span>Link 6</a>' +
              '</li>' +
              '<li class="gem-c-step-nav__list-item js-list-item">' +
                '<a href="#www.gov.uk" class="gem-c-step-nav__link js-link" data-position="3.3" rel="external">Link 7</a>' +
              '</li>' +
              '<li class="gem-c-step-nav__list-item js-will-be-an-active-link js-list-item">' +
                '<a href="#content" class="gem-c-step-nav__link js-link" data-position="3.4"><span class="visuallyhidden">You are currently viewing: </span>Link 8</a>' +
              '</li>' +
              '<li class="gem-c-step-nav__list-item js-will-be-an-active-link js-list-item">' +
                '<a href="#content" class="gem-c-step-nav__link js-link" data-position="3.5"><span class="visuallyhidden">You are currently viewing: </span>Link 9</a>' +
              '</li>' +
            '</ol>' +
          '</div>' +
        '</li>' +
      '</ol>' +
    '</div>'

    document.body.appendChild(container)
  }

  function initialiseStepByStepModule () {
    element = document.querySelector('[data-module^="gemstepnav"]')
    new GOVUK.Modules.Gemstepnav(element).init()
  }

  beforeAll(function () {
    var store = {}
    var mock = (function () {
      return {
        getItem: function (key) {
          return store[key] || null
        },
        setItem: function (key, value) {
          store[key] = value + ''
          return store[key]
        },
        removeItem: function (key) {
          delete store[key]
        },
        clear: function () {
          store = {}
        }
      }
    })()
    Object.defineProperty(window, 'sessionStorage', { value: mock, configurable: true, enumerable: true, writable: true })
  })

  afterEach(function () {
    document.body.removeChild(container)
    window.sessionStorage.clear()
  })

  describe('on load', function () {
    beforeEach(function () {
      createFixture()
      initialiseStepByStepModule()
    })

    it('has a class of gem-c-step-nav--active to indicate the js has loaded', function () {
      expect(element).toHaveClass('gem-c-step-nav--active')
    })

    it('is not hidden', function () {
      expect(element).not.toHaveClass('js-hidden')
    })

    it('has a show/hide all button', function () {
      var showHideAllButton = element.querySelector('.js-step-controls-button')

      expect(showHideAllButton).not.toBeNull()
      expect(showHideAllButton.textContent).toContain('Show all steps')
      // It has an aria-expanded false attribute as all steps are hidden
      expect(showHideAllButton.getAttribute('aria-expanded')).toBe('false')
      // It has an aria-controls attribute that includes all the step_content IDs
      expect(showHideAllButton.getAttribute('aria-controls')).toBe('step-panel-topic-step-one-1')
      // It generates a chevron SVG icon for visual affordance
      expect(showHideAllButton.querySelector('.gem-c-step-nav__chevron')).not.toBeNull()
    })

    it('has no steps which have an shown state', function () {
      var shownSteps = element.querySelectorAll('.step-is-shown').length
      expect(shownSteps).toEqual(0)
    })

    it('inserts a button into each step to show/hide content', function () {
      var titleButtons = element.querySelectorAll('.js-step-title-button')

      titleButtons.forEach((button) => {
        expect(button).toHaveClass('gem-c-step-nav__button--title')
        expect(button.getAttribute('aria-expanded')).toBe('false')
      })

      expect(titleButtons[0].getAttribute('aria-controls')).toBe('step-panel-topic-step-one-1')
      expect(titleButtons[1].getAttribute('aria-controls')).toBe('step-panel-topic-step-two-1')
      expect(titleButtons[2].getAttribute('aria-controls')).toBe('step-panel-topic-step-three-1')
    })

    it('ensures all step content is hidden', function () {
      element.querySelectorAll('.gem-c-step-nav__step').forEach((step) => {
        expect(step).not.toHaveClass('step-is-shown')
      })
    })

    it('adds a show/hide element to each step', function () {
      var stepHeader = element.querySelectorAll('.js-toggle-panel')
      var toggleButtons = element.querySelectorAll('.js-toggle-panel .gem-c-step-nav__toggle-link-focus')
      expect(stepHeader.length).toEqual(toggleButtons.length)

      toggleButtons.forEach((toggleButton) => {
        expect(toggleButton.textContent).toEqual('Show')
        // It generates a chevron SVG icon for visual affordance
        expect(toggleButton.firstElementChild).toHaveClass('gem-c-step-nav__chevron')
      })
    })
  })

  describe('Clicking the "Show all steps" button', function () {
    beforeEach(function () {
      createFixture()
      initialiseStepByStepModule()
      clickShowHideAll()
    })

    it('adds a .step-is-shown class to each step to hide the icon', function () {
      var stepCount = element.querySelectorAll('.gem-c-step-nav__step').length
      expect(element.querySelectorAll('.step-is-shown').length).toEqual(stepCount)
    })

    it('adds an aria-expanded attribute to each step link', function () {
      var stepCount = element.querySelector('.gem-c-step-nav__step').length
      expect(element.querySelector('.js-step-title-button[aria-expanded="true"]').length).toEqual(stepCount)
    })

    it('changes the Show/Hide all button text to "Hide all steps"', function () {
      expect(element.querySelector('.js-step-controls-button').textContent).toEqual('Hide all steps')
    })

    it('changes all the "show" elements to say "hide"', function () {
      element.querySelectorAll('.js-toggle-link-text').forEach((toggleTextSpan) => {
        expect(toggleTextSpan.textContent).toEqual('Hide')
      })
    })
  })

  describe('Clicking the "Hide all steps" button', function () {
    beforeEach(function () {
      createFixture()
      initialiseStepByStepModule()
      clickShowHideAll()
      clickShowHideAll()
    })

    it('changes the Show/Hide all button text to "Show all steps"', function () {
      expect(element.querySelector('.js-step-controls-button').textContent).toEqual('Show all steps')
    })

    it('changes all the "hide" elements to say "show"', function () {
      element.querySelectorAll('.js-toggle-link-text').forEach((toggleTextSpan) => {
        expect(toggleTextSpan.textContent).toEqual('Show')
      })
    })
  })

  describe('Opening a step', function () {
    // When a step is open (testing: toggleStep, openStep)
    beforeEach(function () {
      createFixture()
      initialiseStepByStepModule()
    })

    it('has a class of step-is-shown', function () {
      var stepLink = element.querySelector('.gem-c-step-nav__header .gem-c-step-nav__button--title')
      var step = element.querySelector('.gem-c-step-nav__step')
      stepLink.click()
      expect(step).toHaveClass('step-is-shown')
    })

    // When a step is open (testing: toggleState, setExpandedState)
    it('has a an aria-expanded attribute and the value is true', function () {
      var stepLink = element.querySelector('.gem-c-step-nav__header .gem-c-step-nav__button--title')
      stepLink.click()
      expect(stepLink.getAttribute('aria-expanded')).toBe('true')
    })
  })

  describe('Hiding a step', function () {
    // When a step is hidden (testing: toggleStep, hideStep)
    beforeEach(function () {
      createFixture()
      initialiseStepByStepModule()
    })

    it('removes the step-is-shown class', function () {
      var stepLink = element.querySelector('.gem-c-step-nav__header .gem-c-step-nav__button--title')
      var step = element.querySelector('.gem-c-step-nav__step')
      stepLink.click()
      expect(step).toHaveClass('step-is-shown')
      stepLink.click()
      expect(step).not.toHaveClass('step-is-shown')
    })

    // When a step is hidden (testing: toggleState, setExpandedState)
    it('has a an aria-expanded attribute and the value is false', function () {
      var stepLink = element.querySelector('.gem-c-step-nav__header .gem-c-step-nav__button--title')
      stepLink.click()
      expect(stepLink.getAttribute('aria-expanded')).toBe('true')
      stepLink.click()
      expect(stepLink.getAttribute('aria-expanded')).toBe('false')
    })
  })

  describe('when the option to remember which steps are open is on', function () {
    beforeEach(function () {
      createFixture('data-remember="true"', 'gem-c-step-nav--large')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('remembers individually opened steps', function () {
      var stepLink1 = element.querySelector('#topic-step-one .js-toggle-panel')
      var stepLink2 = element.querySelector('#topic-step-two .js-toggle-panel')

      stepLink1.click() // open
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one"]')

      stepLink2.click() // open
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two"]')

      stepLink1.click() // close
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-two"]')

      stepLink2.click() // close
      expect(window.sessionStorage.getItem('unique-id')).toBe('[]')
    })

    it('remembers opened and closed steps using show/hide all steps', function () {
      var showHideAllButton = element.querySelector('.js-step-controls-button')
      var stepLink2 = element.querySelector('#topic-step-two .js-toggle-panel')

      showHideAllButton.click() // show all
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]')

      stepLink2.click() // close
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-three"]')

      showHideAllButton.click() // show all
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]')

      showHideAllButton.click() // hide all
      expect(window.sessionStorage.getItem('unique-id')).toBe(null) // 'hide all steps' removes the session data entirely
    })
  })

  describe('when open steps have been remembered', function () {
    beforeEach(function () {
      createFixture('data-remember="true"', 'gem-c-step-nav--large')
      window.sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-three"]')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('opens the steps it has remembered', function () {
      var step1 = element.querySelector('#topic-step-one')
      expect(step1).toHaveClass('step-is-shown')
      expect(step1.querySelector('.js-panel')).not.toHaveClass('js-hidden')

      var step3 = element.querySelector('#topic-step-three')
      expect(step3).toHaveClass('step-is-shown')
      expect(step3.querySelector('.js-panel')).not.toHaveClass('js-hidden')
    })

    it('leaves the other steps hidden', function () {
      var step2 = element.querySelector('#topic-step-two')
      expect(step2).not.toHaveClass('step-is-shown')
    })

    it('sets the show/hide link text to "hide"', function () {
      var step1 = element.querySelector('#topic-step-one')
      expect(step1.querySelector('.js-toggle-link-text').textContent).toBe('Hide')
    })

    it('sets the show all/hide all button text correctly', function () {
      var showHideAllButton = element.querySelector('.js-step-controls-button')
      expect(showHideAllButton.textContent).toBe('Show all steps')
    })
  })

  describe('when all steps have been opened and remembered', function () {
    beforeEach(function () {
      createFixture('data-remember="true"', 'gem-c-step-nav--large')
      window.sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-two","topic-step-three"]')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('sets the show all/hide all button text correctly', function () {
      var showHideAllButton = element.querySelector('.js-step-controls-button')
      expect(showHideAllButton.textContent).toBe('Hide all steps')
    })
  })

  describe('when the remember open steps option is applied to a small step nav', function () {
    beforeEach(function () {
      createFixture('data-remember="true"')
      window.sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-two","topic-step-three"]')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('doesn\'t do anything', function () {
      var step1 = element.querySelector('#topic-step-one')
      var step2 = element.querySelector('#topic-step-two')
      var step3 = element.querySelector('#topic-step-three')

      expect(step1).not.toHaveClass('step-is-shown')
      expect(step2).not.toHaveClass('step-is-shown')
      expect(step3).not.toHaveClass('step-is-shown')

      step1.click()
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]') // i.e. unchanged
    })
  })

  describe('when a step is supposed to be shown by default', function () {
    beforeEach(function () {
      createFixture('data-remember="true"')
      container.querySelector('#topic-step-two').setAttribute('data-show', '')
      initialiseStepByStepModule()
    })

    it('shows the step it\'s supposed to', function () {
      var openStep = element.querySelector('#topic-step-two')
      expect(openStep).toHaveClass('step-is-shown')
    })

    it('leaves the other steps closed', function () {
      var closedStep1 = element.querySelector('#topic-step-one')
      var closedStep3 = element.querySelector('#topic-step-three')

      expect(closedStep1).not.toHaveClass('step-is-shown')
      expect(closedStep3).not.toHaveClass('step-is-shown')
    })
  })

  describe('in a double dot situation', function () {
    beforeEach(function () {
      createFixture()
      var activeLinks = container.querySelectorAll('.js-will-be-an-active-link')
      activeLinks.forEach((link) => {
        link.classList.add('gem-c-step-nav__list-item--active')
      })
      initialiseStepByStepModule()
    })

    afterEach(function () {
      var activeLinks = element.querySelectorAll('.js-will-be-an-active-link')
      activeLinks.forEach((link) => {
        link.classList.remove('gem-c-step-nav__list-item--active')
      })
      window.sessionStorage.removeItem('govuk-step-nav-active-link_unique-id')
    })

    it('puts a clicked link in session storage', function () {
      element.querySelector('.js-link[data-position="3.1"]').click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.1')
    })

    it('does not put an external clicked link in session storage', function () {
      element.querySelector('.js-link[data-position="3.3"]').click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe(null)
    })

    it('highlights the first active link and its parent step if no sessionStorage value is set', function () {
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe(null)
      var active = element.querySelector('.js-link[data-position="2.1"]')
      expect(active.parentElement).toHaveClass('gem-c-step-nav__list-item--active')
      expect(element.querySelector('#topic-step-two')).toHaveClass('gem-c-step-nav__step--active')
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect(element.querySelectorAll('.step-is-shown').length).toBe(1)
    })

    it('ensures only the active link has a hidden span for screen readers to indicate which is the active link', function () {
      var spans = element.querySelectorAll('.js-link .visuallyhidden')
      expect(spans.length).toBe(1)
    })

    it('highlights a clicked #content link and its parent step, and removes other highlighting', function () {
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)

      var firstLink = element.querySelector('.js-link[data-position="3.4"]')
      firstLink.click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.4')
      expect(firstLink.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect(firstLink.closest('.js-step')).toHaveClass('gem-c-step-nav__step--active')
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect(element.querySelectorAll('.gem-c-step-nav__step--active').length).toBe(1)

      var secondLink = element.querySelector('.js-link[data-position="3.5"]')
      secondLink.click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.5')
      expect(secondLink.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect(secondLink.closest('.js-step')).toHaveClass('gem-c-step-nav__step--active')
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect(element.querySelectorAll('.gem-c-step-nav__step--active').length).toBe(1)
    })
  })

  describe('in a double dot situation where a clicked link is already stored on page load', function () {
    beforeEach(function () {
      createFixture()
      container.querySelector('.js-will-be-an-active-link').classList.add('gem-c-step-nav__list-item--active')
      window.sessionStorage.setItem('govuk-step-nav-active-link_unique-id', '3.5')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      element.querySelector('.js-will-be-an-active-link').classList.remove('gem-c-step-nav__list-item--active')
      window.sessionStorage.removeItem('govuk-step-nav-active-link_unique-id')
    })

    it('highlights only one link', function () {
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.5')
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect(element.querySelectorAll('.gem-c-step-nav__step--active').length).toBe(1)
    })
  })

  // it's possible that the stored value for active link is invalid - perhaps because the step nav id matches
  // another one that already stored a value. In this situation we want to make sure the code behaves sensibly
  // i.e. it doesn't fail to find the stored link and remove the active styling from everything
  describe('in a double dot situation where a clicked link that is not highlighted is already stored on page load', function () {
    beforeEach(function () {
      createFixture()
      container.querySelector('.js-will-be-an-active-link').classList.add('gem-c-step-nav__list-item--active')
      window.sessionStorage.setItem('govuk-step-nav-active-link_unique-id', 'definitelynotvalid')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      element.querySelector('.js-will-be-an-active-link').classList.remove('gem-c-step-nav__list-item--active')
      window.sessionStorage.removeItem('govuk-step-nav-active-link_unique-id')
    })

    it('highlights only one link', function () {
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect(element.querySelectorAll('.gem-c-step-nav__step--active').length).toBe(1)
    })
  })

  describe('in a double dot situation where there is no active step', function () {
    beforeEach(function () {
      createFixture()
      container.querySelector('.js-will-be-an-active-link').classList.add('gem-c-step-nav__list-item--active')
      container.querySelector('.gem-c-step-nav__step').classList.remove('gem-c-step-nav__step--active')
      initialiseStepByStepModule()
    })

    afterEach(function () {
      element.querySelector('.js-will-be-an-active-link').classList.remove('gem-c-step-nav__list-item--active')
    })

    it('highlights the first active link if no sessionStorage value is set', function () {
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe(null)
      expect(element.querySelector('.js-link[data-position="2.1"]').closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect(element.querySelectorAll('.gem-c-step-nav__list-item--active').length).toBe(1)
    })
  })

  describe('with GA4 tracking enabled', function () {
    beforeEach(function () {
      createFixture('data-ga4-expandable')
      container.querySelector('.gem-c-step-nav').dataset.module = 'gemstepnav ga4-event-tracker'
      container.querySelector('.js-step-title').innerText = "This title's got quotation marks \" in it."
      initialiseStepByStepModule()
    })

    it('adds the "Show all" JSON to the JS generated "show all steps" button', function () {
      var stepNav = element.firstElementChild
      var showAllButton = stepNav.querySelector('button.js-step-controls-button')

      expect(showAllButton.getAttribute('data-ga4-event')).toEqual('{"event_name":"select_content","type":"step by step","index_section":0,"index_section_count":3}')
    })

    it('adds the data-ga4-event attribute to the JS generated step button', function () {
      var stepButton = element.querySelector('#topic-step-one .js-step-title button')
      expect(stepButton.getAttribute('data-ga4-event')).toEqual('{"event_name":"select_content","type":"step by step","text":"This title\'s got quotation marks \\" in it.","index_section":1,"index_section_count":3,"index_total":1}')
    })
  })
})
