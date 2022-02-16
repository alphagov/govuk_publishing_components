/* eslint-env jasmine, jquery */
/* global GOVUK */

//component-guide/accordion/with_the_anchor_link_navigation/preview#anchor-nav-test
describe('An accordion component', function () {
    'use strict'

    var element
    var container = document.createElement('div')
    var localeData = {}
    var html =
    '<div class="gem-c-accordion govuk-accordion govuk-!-margin-bottom-6" id="default-id" data-module="govuk-accordion gem-accordion" data-anchor-navigation="true" data-show-text="Show" data-hide-text="Hide" data-show-all-text="Show all sections" data-hide-all-text="Hide all sections" data-this-section-visually-hidden=" this section">'+
    '  <div class="govuk-accordion__section">'+
    '    <div class="govuk-accordion__section-header">'+
    '      <h2 class="govuk-accordion__section-heading" id="writing-well-for-the-web"><span class="govuk-accordion__section-button" id="default-id-heading-1">Writing well for the web</span></h2>'+
    '    </div>'+
    '    <div id="default-id-content-1" class="govuk-accordion__section-content" aria-labelledby="default-id-heading-1">'+
    '      <p class="govuk-body">This is content for accordion 1 of 2</p>'+
    '      <p class="govuk-body">This content contains a <a href="#anchor-nav-test" class="govuk-link">link</a></p>'+
    '    </div>'+
    '  </div>'+
    '  <div class="govuk-accordion__section">'+
    '    <div class="govuk-accordion__section-header">'+
    '      <h2 class="govuk-accordion__section-heading"><span class="govuk-accordion__section-button" id="default-id-heading-2">Writing well for specialists</span></h2>'+
    '    </div>'+
    '    <div id="default-id-content-2" class="govuk-accordion__section-content" aria-labelledby="default-id-heading-2">'+
    '      <p class="govuk-body" id="anchor-nav-test">This is content for accordion 2 of 2</p>'+
    '    </div>'+
    '  </div>'+
    '  <div class="govuk-accordion__section">'+
    '    <div class="govuk-accordion__section-header">'+
    '      <h2 class="govuk-accordion__section-heading"><span class="govuk-accordion__section-button" id="default-id-heading-3">Know your audience</span></h2>'+
    '    </div>'+
    '    <div id="default-id-content-3" class="govuk-accordion__section-content" aria-labelledby="default-id-heading-3">'+
    '      <p class="govuk-body">This is the content for Know your audience.</p>'+
    '    </div>'+
    '  </div>'+
    '  <div class="govuk-accordion__section">'+
    '    <div class="govuk-accordion__section-header">'+
    '      <h2 class="govuk-accordion__section-heading"><span class="govuk-accordion__section-button" id="default-id-heading-4">How people read</span></h2>'+
    '    </div>'+
    '    <div id="default-id-content-4" class="govuk-accordion__section-content" aria-labelledby="default-id-heading-4">'+
    '      <p class="govuk-body">This is the content for How people read.</p>'+
    '    </div>'+
    '  </div>'+

    beforeEach(function () {
        container.innerHTML = html
        document.body.appendChild(container)

        // This gunky eslint disable is to account for ruby's rules on object (hash) attribute keys
        /* eslint-disable dot-notation */
        localeData['show_text'] = 'st'
        localeData['hide_text'] = 'ht'
        localeData['show_all_text'] = 'sa'
        localeData['hide_all_text'] = 'ha'
        localeData['this_section_visually_hidden'] = 'vh'
        /* eslint-enable dot-notation */

        // Because we're passing stringified JSON data, we have to pass this separately so that innerHTML doesn't strip anything and break these tests unexpectedly
        container.querySelector('.gem-c-accordion').setAttribute('data-locale', JSON.stringify(localeData))

        element = document.getElementById('default-id')
        new GOVUK.Modules.GemAccordion(element).init()
    })

    afterEach(function () {
        $(document).off()
        window.sessionStorage.clear()
        document.body.removeChild(container)

        // This is to account for the anchor link test persisting the page hash after clicking the link
        window.location.hash = ''
    })

    describe('on page load', function () {
        it('marks the accordion as active', function () {
            expect(element).toHaveClass('gem-c-accordion--active')
        })

        it('loads the accordion show/all/hide all controls', function () {
            var controls = element.querySelector('.govuk-accordion__controls')

            expect(controls).toBeTruthy()
            expect(controls.innerText).toEqual('Show all sections')
        })

        it('marks up the accordion titles as buttons with show/hide controls', function () {
            var header = element.querySelector('.govuk-accordion__section-header')
            var headerControl = header.querySelector('.govuk-accordion__section-toggle-focus')
      
            expect(headerControl).toBeTruthy()
            expect(headerControl.innerText).toEqual('Show\nthis section')
          })
    })

    describe('when opening and closing accordions', function () {
        it('opens and closes an accordion', function () {
            var section = element.querySelector('.govuk-accordion__section')
            var header = section.querySelector('.govuk-accordion__section-header')
            var headerControl = header.querySelector('.govuk-accordion__section-button')
            var headerText = headerControl.querySelector('.govuk-accordion__section-toggle-focus')

            headerControl.click()

            expect(section).toHaveClass('govuk-accordion__section--expanded')
            expect(headerText.innerText).toEqual('Hide\nthis section')

            header.click()
            expect(section).not.toHaveClass('govuk-accordion__section--expanded')
            expect(headerText.innerText).toEqual('Show\nthis section')
        })

        it('opens and closes all accordions when the show/hide all controls are used', function () {
            var topLevelControl = element.querySelector('.govuk-accordion__show-all')

            topLevelControl.click()
            expect(topLevelControl.innerText).toEqual('Hide all sections')

            var sections = element.querySelectorAll('.govuk-accordion__section')
            for (var s = 0; s < sections.length; s++) {
                var section = sections[s]
                expect(section).toHaveClass('govuk-accordion__section--expanded')
                expect(section.querySelector('.govuk-accordion__section-toggle').innerText).toEqual('Hide\nthis section')
            }

            topLevelControl.click()
            expect(topLevelControl.innerText).toEqual('Show all sections')

            for (var q = 0; q < sections.length; q++) {
                section = sections[q]
                expect(section).not.toHaveClass('govuk-accordion__section--expanded')
                expect(section.querySelector('.govuk-accordion__section-toggle').innerText).toEqual('Show\nthis section')
            }
        })
    })

    describe('when using the anchor navigation feature flag', function () {
        // For this test, we base the function on the markup snapshot above.
        // The anchor link is in the first accordion whilst the anchor is in the second accordion
        it('opens an accordion based on anchors within that accordion when the associated anchor link is clicked', function () {
            var link = element.querySelector('.govuk-accordion__section').querySelector('.govuk-link')

            link.click()

            expect(element.querySelectorAll('.govuk-accordion__section')[1]).toHaveClass('govuk-accordion__section--expanded')
        })
    })

    describe('when translation is applied to accordion', function () {
    // These tests rely on the locale value passed in the markup snapshot above in the form of the following JSON object:
    // {
    //     show_text: 'st',
    //     hide_text: 'ht',
    //     show_all_text: 'sa',
    //     hide_all_text: 'ha',
    //     this_section_visually_hidden: 'vh'
    // }
    it('sets lang attributes if locale attribute is present', function () {
        expect(element.querySelector('.govuk-accordion__show-all-text').lang).toEqual('sa')

        var buttons = element.querySelectorAll('.govuk-accordion__section-button')
        for (var b = 0; b < buttons.length; b++) {
            var control = buttons[b]
            expect(control.querySelector('.govuk-accordion__section-toggle-text').lang).toEqual('st')
            expect(control.querySelectorAll('.govuk-visually-hidden')[1].lang).toEqual('vh')
        }
    })

    it('resets lang attributes upon button click if the locales for hide text is different', function () {
            var topLevelControlText = element.querySelector('.govuk-accordion__show-all')

            topLevelControlText.click()

            expect(topLevelControlText.lang).toEqual('ha')

            var buttons = element.querySelectorAll('.govuk-accordion__section-button')
            for (var b = 0; b < buttons.length; b++) {
                expect(buttons[b].querySelector('.govuk-accordion__section-toggle-text').lang).toEqual('ht')
            }
        })
    })
})
