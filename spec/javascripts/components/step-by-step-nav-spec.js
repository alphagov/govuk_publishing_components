/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('A stepnav module', function () {
  'use strict'

  var $element, element
  var html =
    '<div data-module="gemstepnav" class="gem-c-step-nav js-hidden" data-id="unique-id" data-show-text="Show" data-hide-text="Hide" data-show-all-text="Show all steps" data-hide-all-text="Hide all steps">' +
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

  var expectedstepnavStepCount = 0
  var expectedstepnavContentCount = 0
  var expectedstepnavLinkCount = 0

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

  beforeEach(function () {
    $element = $(html)
    new GOVUK.Modules.Gemstepnav($element[0]).init()
    expectedstepnavStepCount = $element.find('.gem-c-step-nav__step').length
    expectedstepnavContentCount = $element.find('.gem-c-step-nav__step').first().find('.js-link').length
    expectedstepnavLinkCount = $element.find('.gem-c-step-nav__list-item').length
  })

  afterEach(function () {
    $(document).off()
    window.sessionStorage.clear()
  })

  function clickShowHideAll () {
    $element.find('.js-step-controls-button').click()
  }

  it('has a class of gem-c-step-nav--active to indicate the js has loaded', function () {
    expect($element).toHaveClass('gem-c-step-nav--active')
  })

  it('is not hidden', function () {
    expect($element).not.toHaveClass('js-hidden')
  })

  it('has a show/hide all button', function () {
    var $showHideAllButton = $element.find('.js-step-controls-button')

    expect($showHideAllButton).toExist()
    expect($showHideAllButton).toHaveText('Show all steps')
    // It has an aria-expanded false attribute as all steps are hidden
    expect($showHideAllButton).toHaveAttr('aria-expanded', 'false')
    // It has an aria-controls attribute that includes all the step_content IDs
    expect($showHideAllButton).toHaveAttr('aria-controls', 'step-panel-topic-step-one-1')
    // It generates a chevron SVG icon for visual affordance
    expect($showHideAllButton.find('.gem-c-step-nav__chevron')).toExist()
  })

  it('has no steps which have an shown state', function () {
    var shownSteps = $element.find('.step-is-shown').length
    expect(shownSteps).toEqual(0)
  })

  it('inserts a button into each step to show/hide content', function () {
    var $titleButton = $element.find('.js-step-title-button')

    expect($titleButton).toHaveClass('gem-c-step-nav__button--title')
    expect($titleButton).toHaveAttr('aria-expanded', 'false')
    expect($titleButton[0]).toHaveAttr('aria-controls', 'step-panel-topic-step-one-1')
    expect($titleButton[1]).toHaveAttr('aria-controls', 'step-panel-topic-step-two-1')
  })

  it('ensures all step content is hidden', function () {
    $element.find('.gem-c-step-nav__step').each(function (index, $step) {
      expect($step).not.toHaveClass('step-is-shown')
    })
  })

  it('adds a show/hide element to each step', function () {
    var $stepHeader = $element.find('.js-toggle-panel')
    expect($stepHeader).toContainElement('.gem-c-step-nav__toggle-link-focus')
    $stepHeader.find('.gem-c-step-nav__toggle-link-focus').each(function () {
      expect($(this)).toHaveText('Show')
      // It generates a chevron SVG icon for visual affordance
      expect($(this).find('.gem-c-step-nav__chevron')).toExist()
    })
  })

  describe('Clicking the "Show all steps" button', function () {
    beforeEach(function () {
      clickShowHideAll()
    })

    it('adds a .step-is-shown class to each step to hide the icon', function () {
      var stepCount = $element.find('.gem-c-step-nav__step').length
      expect($element.find('.step-is-shown').length).toEqual(stepCount)
    })

    it('adds an aria-expanded attribute to each step link', function () {
      var stepCount = $element.find('.gem-c-step-nav__step').length
      expect($element.find('.js-step-title-button[aria-expanded="true"]').length).toEqual(stepCount)
    })

    it('changes the Show/Hide all button text to "Hide all steps"', function () {
      expect($element.find('.js-step-controls-button')).toContainText('Hide all steps')
    })

    it('changes all the "show" elements to say "hide"', function () {
      $element.find('.js-toggle-link-text').each(function () {
        expect($(this)).toHaveText('Hide')
      })
    })
  })

  describe('Clicking the "Hide all steps" button', function () {
    beforeEach(function () {
      clickShowHideAll()
      clickShowHideAll()
    })

    it('changes the Show/Hide all button text to "Show all steps"', function () {
      expect($element.find('.js-step-controls-button')).toContainText('Show all steps')
    })

    it('changes all the "hide" elements to say "show"', function () {
      $element.find('.js-toggle-link-text').each(function () {
        expect($(this)).toHaveText('Show')
      })
    })
  })

  describe('Opening a step', function () {
    // When a step is open (testing: toggleStep, openStep)

    it('has a class of step-is-shown', function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title').first()
      var $step = $element.find('.gem-c-step-nav__step').first()
      $stepLink.click()
      expect($step).toHaveClass('step-is-shown')
    })

    // When a step is open (testing: toggleState, setExpandedState)
    it('has a an aria-expanded attribute and the value is true', function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title').first()
      $stepLink.click()
      expect($stepLink).toHaveAttr('aria-expanded', 'true')
    })
  })

  describe('Hiding a step', function () {
    // When a step is hidden (testing: toggleStep, hideStep)

    it('removes the step-is-shown class', function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title')
      var $step = $element.find('.gem-c-step-nav__step')
      $stepLink.click()
      expect($step).toHaveClass('step-is-shown')
      $stepLink.click()
      expect($step).not.toHaveClass('step-is-shown')
    })

    // When a step is hidden (testing: toggleState, setExpandedState)
    it('has a an aria-expanded attribute and the value is false', function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title')
      $stepLink.click()
      expect($stepLink).toHaveAttr('aria-expanded', 'true')
      $stepLink.click()
      expect($stepLink).toHaveAttr('aria-expanded', 'false')
    })
  })

  describe('when the option to remember which steps are open is on', function () {
    beforeEach(function () {
      $element = $(html)
      $element.attr('data-remember', true)
      $element.addClass('gem-c-step-nav--large')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('remembers individually opened steps', function () {
      var $stepLink1 = $element.find('#topic-step-one .js-toggle-panel')
      var $stepLink2 = $element.find('#topic-step-two .js-toggle-panel')

      $stepLink1.click() // open
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one"]')

      $stepLink2.click() // open
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two"]')

      $stepLink1.click() // close
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-two"]')

      $stepLink2.click() // close
      expect(window.sessionStorage.getItem('unique-id')).toBe('[]')
    })

    it('remembers opened and closed steps using show/hide all steps', function () {
      var $showHideAllButton = $element.find('.js-step-controls-button')
      var $stepLink2 = $element.find('#topic-step-two .js-toggle-panel')

      $showHideAllButton.click() // show all
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]')

      $stepLink2.click() // close
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-three"]')

      $showHideAllButton.click() // show all
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]')

      $showHideAllButton.click() // hide all
      expect(window.sessionStorage.getItem('unique-id')).toBe(null) // 'hide all steps' removes the session data entirely
    })
  })

  describe('when open steps have been remembered', function () {
    beforeEach(function () {
      $element = $(html)
      $element.attr('data-remember', true)
      $element.addClass('gem-c-step-nav--large')
      window.sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-three"]')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('opens the steps it has remembered', function () {
      var $step1 = $element.find('#topic-step-one')
      expect($step1).toHaveClass('step-is-shown')
      expect($step1.find('.js-panel')).not.toHaveClass('js-hidden')

      var $step3 = $element.find('#topic-step-three')
      expect($step3).toHaveClass('step-is-shown')
      expect($step3.find('.js-panel')).not.toHaveClass('js-hidden')
    })

    it('leaves the other steps hidden', function () {
      var $step2 = $element.find('#topic-step-two')
      expect($step2).not.toHaveClass('step-is-shown')
    })

    it('sets the show/hide link text to "hide"', function () {
      var $step1 = $element.find('#topic-step-one')
      expect($step1.find('.js-toggle-link-text')).toHaveText('Hide')
    })

    it('sets the show all/hide all button text correctly', function () {
      var $showHideAllButton = $element.find('.js-step-controls-button')
      expect($showHideAllButton).toHaveText('Show all steps')
    })
  })

  describe('when all steps have been opened and remembered', function () {
    beforeEach(function () {
      $element = $(html)
      $element.attr('data-remember', true)
      $element.addClass('gem-c-step-nav--large')
      window.sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-two","topic-step-three"]')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('sets the show all/hide all button text correctly', function () {
      var $showHideAllButton = $element.find('.js-step-controls-button')
      expect($showHideAllButton).toHaveText('Hide all steps')
    })
  })

  describe('when the remember open steps option is applied to a small step nav', function () {
    beforeEach(function () {
      $element = $(html)
      $element.attr('data-remember', true)
      window.sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-two","topic-step-three"]')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      window.sessionStorage.removeItem('unique-id')
    })

    it('doesn\'t do anything', function () {
      var $step1 = $element.find('#topic-step-one')
      var $step2 = $element.find('#topic-step-two')
      var $step3 = $element.find('#topic-step-three')

      expect($step1).not.toHaveClass('step-is-shown')
      expect($step2).not.toHaveClass('step-is-shown')
      expect($step3).not.toHaveClass('step-is-shown')

      $step1.click()
      expect(window.sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]') // i.e. unchanged
    })
  })

  describe('when a step is supposed to be shown by default', function () {
    beforeEach(function () {
      $element = $(html)
      $element.find('#topic-step-two').attr('data-show', '')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    it('shows the step it\'s supposed to', function () {
      var $openStep = $element.find('#topic-step-two')
      expect($openStep).toHaveClass('step-is-shown')
    })

    it('leaves the other steps closed', function () {
      var $closedStep1 = $element.find('#topic-step-one')
      var $closedStep3 = $element.find('#topic-step-three')

      expect($closedStep1).not.toHaveClass('step-is-shown')
      expect($closedStep3).not.toHaveClass('step-is-shown')
    })
  })

  describe('in a double dot situation', function () {
    beforeEach(function () {
      $element = $(html)
      $element.find('.js-will-be-an-active-link').addClass('gem-c-step-nav__list-item--active')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      $element.find('.js-will-be-an-active-link').removeClass('gem-c-step-nav__list-item--active')
      window.sessionStorage.removeItem('govuk-step-nav-active-link_unique-id')
    })

    it('puts a clicked link in session storage', function () {
      $element.find('.js-link[data-position="3.1"]')[0].click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.1')
    })

    it('does not put an external clicked link in session storage', function () {
      $element.find('.js-link[data-position="3.3"]')[0].click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe(null)
    })

    it('highlights the first active link and its parent step if no sessionStorage value is set', function () {
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe(null)
      var $active = $element.find('.js-link[data-position="2.1"]')
      expect($active.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect($active.closest('.js-step')).toHaveClass('gem-c-step-nav__step--active')
      expect($element.find('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect($element.find('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect($element.find('.step-is-shown').length).toBe(1)
    })

    it('ensures only the active link has a hidden span for screen readers to indicate which is the active link', function () {
      var $spans = $element.find('.js-link .visuallyhidden')
      expect($spans.length).toBe(1)
    })

    it('highlights a clicked #content link and its parent step, and removes other highlighting', function () {
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1)

      var $firstLink = $element.find('.js-link[data-position="3.4"]')[0]
      $firstLink.click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.4')
      expect($firstLink.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect($firstLink.closest('.js-step')).toHaveClass('gem-c-step-nav__step--active')
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1)
      expect($element.find(('.gem-c-step-nav__step--active')).length).toBe(1)

      var $secondLink = $element.find('.js-link[data-position="3.5"]')[0]
      $secondLink.click()
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.5')
      expect($secondLink.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect($secondLink.closest('.js-step')).toHaveClass('gem-c-step-nav__step--active')
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1)
      expect($element.find(('.gem-c-step-nav__step--active')).length).toBe(1)
    })
  })

  describe('in a double dot situation where a clicked link is already stored on page load', function () {
    beforeEach(function () {
      $element = $(html)
      $element.find('.js-will-be-an-active-link').addClass('gem-c-step-nav__list-item--active')
      window.sessionStorage.setItem('govuk-step-nav-active-link_unique-id', '3.5')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      $element.find('.js-will-be-an-active-link').removeClass('gem-c-step-nav__list-item--active')
      window.sessionStorage.removeItem('govuk-step-nav-active-link_unique-id')
    })

    it('highlights only one link', function () {
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe('3.5')
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1)
      expect($element.find(('.gem-c-step-nav__step--active')).length).toBe(1)
    })
  })

  // it's possible that the stored value for active link is invalid - perhaps because the step nav id matches
  // another one that already stored a value. In this situation we want to make sure the code behaves sensibly
  // i.e. it doesn't fail to find the stored link and remove the active styling from everything
  describe('in a double dot situation where a clicked link that is not highlighted is already stored on page load', function () {
    beforeEach(function () {
      $element = $(html)
      $element.find('.js-will-be-an-active-link').addClass('gem-c-step-nav__list-item--active')
      window.sessionStorage.setItem('govuk-step-nav-active-link_unique-id', 'definitelynotvalid')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      $element.find('.js-will-be-an-active-link').removeClass('gem-c-step-nav__list-item--active')
      window.sessionStorage.removeItem('govuk-step-nav-active-link_unique-id')
    })

    it('highlights only one link', function () {
      expect($element.find('.gem-c-step-nav__list-item--active').length).toBe(1)
      expect($element.find('.gem-c-step-nav__step--active').length).toBe(1)
    })
  })

  describe('in a double dot situation where there is no active step', function () {
    beforeEach(function () {
      $element = $(html)
      $element.find('.js-will-be-an-active-link').addClass('gem-c-step-nav__list-item--active')
      $element.find('.gem-c-step-nav__step').removeClass('gem-c-step-nav__step--active')
      new GOVUK.Modules.Gemstepnav($element[0]).init()
    })

    afterEach(function () {
      $element.find('.js-will-be-an-active-link').removeClass('gem-c-step-nav__list-item--active')
    })

    it('highlights the first active link if no sessionStorage value is set', function () {
      expect(window.sessionStorage.getItem('govuk-step-nav-active-link_unique-id')).toBe(null)
      expect($element.find('.js-link[data-position="2.1"]').closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active')
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1)
    })
  })

  describe('with GA4 tracking enabled', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.innerHTML = html
      element.childNodes[0].setAttribute('data-module', 'gemstepnav ga4-event-tracker')
      element.childNodes[0].setAttribute('data-ga4-expandable', '')
      element.querySelector('.js-step-title').innerText = "This title's got quotation marks \" in it."
      new GOVUK.Modules.Gemstepnav(element.childNodes[0]).init()
    })

    it('adds the "Show all" JSON to the JS generated "show all steps" button', function () {
      var stepNav = element.childNodes[0]
      var showAllButton = stepNav.querySelector('button.js-step-controls-button')

      expect(showAllButton.getAttribute('data-ga4-event')).toEqual('{"event_name":"select_content","type":"step by step","index_section":0,"index_section_count":3}')
    })

    it('adds the data-ga4-event attribute to the JS generated step button', function () {
      var stepNav = element.childNodes[0]
      var stepButton = stepNav.querySelector('#topic-step-one .js-step-title button')

      expect(stepButton.getAttribute('data-ga4-event')).toEqual('{"event_name":"select_content","type":"step by step","text":"This title\'s got quotation marks \\" in it.","index_section":1,"index_section_count":3,"index_total":1}')
    })
  })
})
