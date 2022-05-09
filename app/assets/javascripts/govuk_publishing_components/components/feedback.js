window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  var CONDITION = 0
  var CALLBACK = 1
  var NEXT_STATE = 2

  function StateMachine (initialState, transitionTable) {
    this.state = this.initialState = initialState
    this.transitionTable = transitionTable
  }

  StateMachine.prototype.handleInput = function (input) {
    var transitions = (this.transitionTable[this.state] || {})[input] || []
    for (var i in transitions) {
      if (Object.prototype.hasOwnProperty.call(transitions, i)) {
        var transition = transitions[i]
        if (this.isConditionMet(transition[CONDITION])) {
          this.executeCallback(transition[CALLBACK])
          this.state = transition[NEXT_STATE]
          return this.state
        }
      }
    }
    throw new Error('Invalid input for current state')
  }

  StateMachine.prototype.isConditionMet = function (condition) {
    if (typeof condition === 'function') {
      return condition()
    } else if (condition === null) {
      return true
    }
    return condition
  }

  StateMachine.prototype.executeCallback = function (callback) {
    if (typeof callback === 'function') {
      callback()
    }
  }

  function Feedback ($module) {
    this.$module = $module

    this.states = this.$module.querySelectorAll('.js-feedback-state')
    this.closeForms = this.$module.querySelectorAll('.js-close-form')
    this.prompt = this.$module.querySelector('.js-prompt')
    this.promptQuestions = this.$module.querySelectorAll('.js-prompt-questions')
    this.forms = this.$module.querySelectorAll('.js-feedback-form')

    this.HIDE_ALL = function () { return false }
    this.SHOW_ALL = function () { return true }

    this.variant = 'variant_A'

    this.workflows = {
      default: [
        'feedback-prompt',
        {
          'feedback-prompt': {
            useful: [
              [null, null, 'feedback-success']
            ],
            'not-useful': [
              [null, null, 'page-is-not-useful']
            ],
            'report-a-problem': [
              [null, null, 'something-is-wrong']
            ]
          },
          'page-is-not-useful': {
            close: [
              [null, null, 'feedback-prompt']
            ],
            submit: [
              [null, this.sendSurvey(), 'feedback-success']
            ]
          },
          'something-is-wrong': {
            close: [
              [null, null, 'feedback-prompt']
            ],
            submit: [
              [null, this.reportProblem(), 'feedback-success']
            ]
          }
        }
      ],
      variant_A: [
        'useful_or_not',
        {
          useful_or_not: {
            useful: [
              [null, null, 'thanks']
            ],
            not_useful: [
              [null, null, 'why_not']
            ]
          },
          why_not: {
            continue: [
              [this.is_checked('[name="why_not_useful"][value="error"]'), this.set_flag('error', true), 'what_wrong'],
              [null, this.set_flag('error', false), 'what_doing']
            ],
            back: [
              [null, null, 'useful_or_not']
            ]
          },
          what_wrong: {
            continue: [
              [null, null, 'what_doing']
            ],
            back: [
              [null, null, 'why_not']
            ]
          },
          what_doing: {
            continue: [
              [null, null, 'use_assistive']
            ],
            back: [
              [this.is_flag_set('error'), null, 'what_wrong'],
              [null, null, 'why_not']
            ]
          },
          use_assistive: {
            continue: [
              [this.is_checked('[name="use_assistive"][value="yes"]'), null, 'which_assistive'],
              [null, null, 'thanks']
            ],
            back: [
              [null, null, 'what_doing']
            ]
          },
          which_assistive: {
            continue: [
              [null, null, 'thanks']
            ],
            back: [
              [null, null, 'use_assistive']
            ]
          }
        }
      ],
      variant_B: [
        'tell_experience',
        {
          tell_experience: {
            submit: [
              [null, null, 'useful_or_not_b']
            ]
          },
          useful_or_not_b: {
            continue: [
              [this.is_checked('[name="useful"][value="yes"]'), null, 'thanks'],
              [null, null, 'why_not']
            ],
            back: [
              [null, null, 'tell_experience']
            ]
          },
          why_not: {
            continue: [
              [this.is_checked('[name="why_not_useful"][value="error"]'), this.set_flag('error', true), 'what_wrong'],
              [null, this.set_flag('error', false), 'what_doing']
            ],
            back: [
              [null, null, 'useful_or_not_b']
            ]
          },
          what_wrong: {
            continue: [
              [null, null, 'what_doing']
            ],
            back: [
              [null, null, 'why_not']
            ]
          },
          what_doing: {
            continue: [
              [null, null, 'use_assistive']
            ],
            back: [
              [this.is_flag_set('error'), null, 'what_wrong'],
              [null, null, 'why_not']
            ]
          },
          use_assistive: {
            continue: [
              [this.is_checked('[name="use_assistive"][value="yes"]'), null, 'which_assistive'],
              [null, null, 'thanks']
            ],
            back: [
              [null, null, 'what_doing']
            ]
          },
          which_assistive: {
            continue: [
              [null, null, 'thanks']
            ],
            back: [
              [null, null, 'use_assistive']
            ]
          }
        }
      ]
    }
  }

  Feedback.prototype.init = function () {
    this.flags = {}
    this.initialiseWorkflow(this.getVariant())
    this.showState(this.workflow.initialState)
    this.addStateTransitionListeners()
    this.addFormSubmitHandlers()
    this.showHide(this.closeForms, this.SHOW_ALL)
    this.showHide(this.promptQuestions, this.SHOW_ALL)
  }

  Feedback.prototype.getVariant = function () {
    var matches = window.location.search.match(/variant=([^&]*)/)
    if (matches) {
      return matches[1] || 'default'
    }
    return 'default'
  }

  Feedback.prototype.initialiseWorkflow = function (variant) {
    var args = this.workflows[variant]
    this.workflow = new StateMachine(args[0], args[1])
  }

  Feedback.prototype.showState = function (id) {
    var shouldShow = function (state) { return state.id === id }

    // special case for feedback-success because the success message is in the
    // feedback-prompt div
    if (id === 'feedback-success') {
      shouldShow = this.showSuccess
      this.showHide(this.promptQuestions, this.HIDE_ALL)
    }

    this.showHide(this.states, shouldShow)
  }

  Feedback.prototype.showHide = function (elements, filter) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].hidden = !filter(elements[i])
    }
  }

  Feedback.prototype.addStateTransitionListeners = function () {
    var inputs = this.$module.querySelectorAll('.js-feedback-input')
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('click', function (e) {
        var el = e.target
        if (el.getAttribute('data-prevent-default')) {
          e.preventDefault()
        }
        this.workflow.handleInput(el.getAttribute('data-feedback-input'))
        this.showState(this.workflow.state)
        // this.trackEvent(this.getTrackEventParams(el))
      }.bind(this))
    }
  }

  Feedback.prototype.addFormSubmitHandlers = function () {
    // IE11 does not support JSON as an XMLHttpRequest response type.
    // This check fails on IE, allowing form submits to happend normally
    if (typeof window.URLSearchParams !== 'function') return

    for (var i = 0; i < this.forms.length; i++) {
      this.forms[i].addEventListener('submit', function (e) {
        e.preventDefault()
      })
    }
  }

  Feedback.prototype.is_checked = function (selector) {
    return function () {
      var radio = this.$module.querySelector(selector)
      if (radio) {
        return radio.checked
      }
      return false
    }.bind(this)
  }

  Feedback.prototype.set_flag = function (flag, value) {
    return function () {
      this.flags[flag] = !!value
    }.bind(this)
  }

  Feedback.prototype.is_flag_set = function (flag) {
    return function () {
      return !!this.flags[flag]
    }.bind(this)
  }

  Feedback.prototype.showSuccess = function (state) {
    return state.id === 'feedback-success' || state.id === 'feedback-prompt'
  }

  Feedback.prototype.sendSurvey = function () {
    return function () {
      console.log('send survey')
    }
  }

  Feedback.prototype.reportProblem = function () {
    return function () {
      console.log('report problem')
    }
  }

  Modules.Feedback = Feedback
})(window.GOVUK.Modules)
