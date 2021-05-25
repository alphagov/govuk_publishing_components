/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Contextual guidance component', function () {
  'use strict'

  var container

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML =
      '<div id="document-title-guidance" class="gem-c-contextual-guidance" data-module="contextual-guidance">' +
        '<input id="document-title" type="text" class="gem-c-input govuk-input">' +

        '<div class="gem-c-contextual-guidance__wrapper" for="document-title">' +
          '<div class="gem-c-contextual-guidance__guidance">' +
            '<h2 class="govuk-heading-s">Title</h2>' +
            '<p>The title should be unique and specific. It must make clear what the content offers users. Use the words your users do to help them find this. Avoid wordplay or teases.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div id="document-summary-guidance" class="gem-c-contextual-guidance" data-module="contextual-guidance">' +
        '<textarea id="document-summary" class="gem-c-textarea govuk-textarea"></textarea>' +

        '<div class="gem-c-contextual-guidance__wrapper" for="document-summary">' +
          '<div class="gem-c-contextual-guidance__guidance">' +
            '<h2 class="govuk-heading-s">Summary</h2>' +
            '<p>The summary should explain the main point of the story. It is the first line of the story so don’t repeat it in the body and end with a full stop.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div id="document-description-guidance" class="gem-c-contextual-guidance" data-module="contextual-guidance">' +
        '<textarea id="document-description" class="gem-c-textarea govuk-textarea" data-contextual-guidance-hide-only="true"></textarea>' +

        '<div class="gem-c-contextual-guidance__wrapper" for="document-description">' +
          '<div class="gem-c-contextual-guidance__guidance">' +
            '<h2 class="govuk-heading-s">Summary</h2>' +
            '<p>The description should describe the story.</p>' +
          '</div>' +
        '</div>' +
      '</div>'

    document.body.classList.add('js-enabled')
    document.body.appendChild(container)
    var titleContextualGuidance = document.getElementById('document-title-guidance')
    var summaryContextualGuidance = document.getElementById('document-summary-guidance')
    var descriptionContextualGuidance = document.getElementById('document-description-guidance')
    new GOVUK.Modules.ContextualGuidance().start($(titleContextualGuidance))
    new GOVUK.Modules.ContextualGuidance().start($(summaryContextualGuidance))
    new GOVUK.Modules.ContextualGuidance().start($(descriptionContextualGuidance))
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('should show associated guidance on focus', function () {
    var title = document.getElementById('document-title')
    var titleGuidance = document.querySelector('#document-title-guidance .gem-c-contextual-guidance__wrapper')

    var summaryGuidance = document.querySelector('#document-summary-guidance .gem-c-contextual-guidance__wrapper')

    title.dispatchEvent(new window.Event('focus'))

    expect(titleGuidance.style.display).toEqual('block')
    expect(summaryGuidance.style.display).toEqual('none')
  })

  it('should hide associated guidance when another element is focused', function () {
    var title = document.getElementById('document-title')
    var titleGuidance = document.querySelector('#document-title-guidance .gem-c-contextual-guidance__wrapper')

    var summary = document.getElementById('document-summary')
    var summaryGuidance = document.querySelector('#document-summary-guidance .gem-c-contextual-guidance__wrapper')

    title.dispatchEvent(new window.Event('focus'))
    summary.dispatchEvent(new window.Event('focus'))

    expect(titleGuidance.style.display).toEqual('none')
    expect(summaryGuidance.style.display).toEqual('block')
  })

  it('should not show associated guidance on focus if the hide-only attribute is present', function () {
    var description = document.getElementById('document-description')
    var descriptionGuidance = document.querySelector('#document-description-guidance .gem-c-contextual-guidance__wrapper')

    var titleGuidance = document.querySelector('#document-title-guidance .gem-c-contextual-guidance__wrapper')
    var summaryGuidance = document.querySelector('#document-summary-guidance .gem-c-contextual-guidance__wrapper')

    description.dispatchEvent(new window.Event('focus'))

    expect(titleGuidance.style.display).toEqual('none')
    expect(summaryGuidance.style.display).toEqual('none')
    expect(descriptionGuidance.style.display).toEqual('none')
  })
})
