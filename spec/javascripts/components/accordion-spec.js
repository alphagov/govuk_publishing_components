/* eslint-env jasmine */
/* global GOVUK */

describe('Accordion component', function () {
  var accordion
  var container
  // this markup intentionally contains elements added by JavaScript i.e. the 'Show all sections' link
  // this link is created by JS from govuk-frontend, which cannot be executed as part of this test
  // so we add the markup manually
  var html =
    '<div class="gem-c-accordion" data-show-text="Show" data-hide-text="Hide" data-show-all-text="Show all sections" data-hide-all-text="Hide all sections" data-this-section-visually-hidden=" this section">' +
      '<div class="govuk-accordion__controls">' +
        '<button type="button" class="govuk-accordion__show-all" aria-expanded="false">' +
          '<span class="govuk-accordion__show-all-text">Show all sections</span>' +
        '</button>' +
      '</div>' +
      '<div class="govuk-accordion__section">' +
        '<div class="govuk-accordion__section-header">' +
          '<h2 class="govuk-accordion__section-heading">' +
            '<button type="button" class="govuk-accordion__section-button" aria-expanded="false">' +
              '<span class="govuk-accordion__section-heading-text">' +
                'Accordion Section Heading Text' +
              '</span>' +
            '</button>' +
          '</h2>' +
        '</div>' +
      '</div>' +
      '<div class="govuk-accordion__section">' +
        '<div class="govuk-accordion__section-header">' +
          '<h2 class="govuk-accordion__section-heading">' +
            '<span class="govuk-accordion__section-button" id="default-id-078ef791-heading-1">Writing well for the web</span>' +
          '</h2>' +
        '</div>' +
        '<div id="default-id-078ef791-content-1" class="govuk-accordion__section-content" aria-labelledby="default-id-078ef791-heading-1">' +
          '<p class="govuk-body">This is the content for Writing well for the web.</p>' +
        '</div>' +
      '</div>' +
      '<div class="govuk-accordion__section">' +
        '<div class="govuk-accordion__section-header">' +
          '<h2 class="govuk-accordion__section-heading">' +
            '<span class="govuk-accordion__section-button" id="default-id-078ef791-heading-2">Writing well for specialists</span>' +
          '</h2>' +
        '</div>' +
        '<div id="default-id-078ef791-content-2" class="govuk-accordion__section-content" aria-labelledby="default-id-078ef791-heading-2">' +
          '<p class="govuk-body">This is the content for Writing well for specialists.</p>' +
        '</div>' +
      '</div>' +
    '</div>'

  function startAccordion () {
    new GOVUK.Modules.GemAccordion(accordion).init()
  }

  beforeEach(function () {
    container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    accordion = document.querySelector('.gem-c-accordion')
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('does not initialise if the accordion from govuk-frontend has not initialised', function () {
    var accordionShowAllButton = accordion.querySelector('.govuk-accordion__show-all')
    accordionShowAllButton.classList.remove('govuk-accordion__show-all')
    startAccordion()

    expect(accordion.querySelector('.govuk-accordion__controls button')).not.toHaveClass('gem-c-accordion__show-all')
  })

  it('applies GA4 data attributes to the show/hide all link', function () {
    var ga4Object = {
      event_name: 'select_content',
      type: 'accordion',
      index_section: 0,
      index_section_count: 3
    }
    accordion.setAttribute('data-module', accordion.getAttribute('data-module') + ' ga4-event-tracker')
    startAccordion()

    expect(document.querySelector('.govuk-accordion__show-all').getAttribute('data-ga4-event')).toEqual(JSON.stringify(ga4Object))
  })
})
