/* eslint-env jasmine, jquery */

describe('Cross Domain Tracking', function () {
  'use strict'
  var GOVUK = window.GOVUK

  beforeEach(function () {
    GOVUK.Modules.crossDomainLinkedTrackers = []
    spyOn(GOVUK.analytics, 'addLinkedTrackerDomain')
  })

  it('tracks realistic example', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.registertovote.service.gov.uk/register-to-vote/start'
    anchorToTest.className = 'gem-c-button gem-c-button--start'
    anchorToTest.setAttribute('role', 'button')
    anchorToTest.setAttribute('data-module', 'cross-domain-tracking')
    anchorToTest.setAttribute('data-tracking-code', 'UA-23066786-5')
    anchorToTest.setAttribute('data-tracking-name', 'transactionTracker')
    anchorToTest.textContent = 'Start Now'

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(anchorToTest)[0])

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-23066786-5', 'transactionTracker', 'www.registertovote.service.gov.uk')
  })

  it('tracks links with cross-domain-analytics data attributes', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchorToTest.setAttribute('data-module', 'cross-domain-tracking')
    anchorToTest.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchorToTest.setAttribute('data-tracking-name', 'govspeakButtonTracker')

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(wrapperDiv)[0])

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-XXXXXXXXX-Y', 'govspeakButtonTracker', 'www.gov.uk')
  })

  it('tracks multiple links', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchorToTest.setAttribute(
      'data-tracking-code',
      'UA-XXXXXXXXX-Y'
    )
    anchorToTest.setAttribute(
      'data-tracking-name',
      'govspeakButtonTracker'
    )

    var secondAnchorToTest = document.createElement('a')
    secondAnchorToTest.href = 'https://www.registertovote.service.gov.uk/register-to-vote/start'
    secondAnchorToTest.setAttribute(
      'data-tracking-code',
      'UA-23066786-5'
    )
    secondAnchorToTest.setAttribute(
      'data-tracking-name',
      'transactionTracker'
    )

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)
    wrapperDiv.appendChild(secondAnchorToTest)

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(wrapperDiv)[0])

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-XXXXXXXXX-Y', 'govspeakButtonTracker', 'www.gov.uk')

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-23066786-5', 'transactionTracker', 'www.registertovote.service.gov.uk')
  })

  it('tracks doesnt track if data attributes are not there', function () {
    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.registertovote.service.gov.uk/register-to-vote/start'

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(wrapperDiv)[0])

    expect(GOVUK.analytics.addLinkedTrackerDomain).not.toHaveBeenCalled()
  })

  it('can be configured to track events', function () {
    spyOn(GOVUK.analytics, 'trackEvent')

    var anchorToTest = document.createElement('a')
    anchorToTest.href = 'https://www.gov.uk/browse/citizenship/voting'
    anchorToTest.innerText = 'Do some voting'
    anchorToTest.setAttribute('data-module', 'cross-domain-tracking')
    anchorToTest.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchorToTest.setAttribute('data-tracking-name', 'govspeakButtonTracker')
    anchorToTest.setAttribute('data-tracking-track-event', 'true')

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchorToTest)

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(wrapperDiv)[0])

    expect(
      GOVUK.analytics.addLinkedTrackerDomain
    ).toHaveBeenCalledWith('UA-XXXXXXXXX-Y', 'govspeakButtonTracker', 'www.gov.uk')

    window.GOVUK.triggerEvent($(anchorToTest)[0], 'click')

    expect(
      GOVUK.analytics.trackEvent
    ).toHaveBeenCalledWith('External Link Clicked', 'Do some voting', { trackerName: 'govspeakButtonTracker' })
  })

  it('adds the linked tracker domain once for multiple cross domain tracking elements', function () {
    spyOn(GOVUK.analytics, 'trackEvent')

    var anchor1 = document.createElement('a')
    anchor1.href = 'https://www.gov.uk/browse/citizenship/surfing'
    anchor1.setAttribute('data-module', 'cross-domain-tracking')
    anchor1.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchor1.setAttribute('data-tracking-name', 'govspeakButtonTracker')
    anchor1.setAttribute('data-tracking-track-event', 'true')
    anchor1.innerText = 'Do some surfing'

    var anchor2 = document.createElement('a')
    anchor2.href = 'https://www.gov.uk/browse/citizenship/shopping'
    anchor2.setAttribute('data-module', 'cross-domain-tracking')
    anchor2.setAttribute('data-tracking-code', 'UA-XXXXXXXXX-Y')
    anchor2.setAttribute('data-tracking-name', 'govspeakButtonTracker')
    anchor2.setAttribute('data-tracking-track-event', 'true')
    anchor2.innerText = 'Do some shopping'

    var wrapperDiv = document.createElement('div')
    wrapperDiv.appendChild(anchor1)
    wrapperDiv.appendChild(anchor2)

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(wrapperDiv)[0])

    /* eslint-disable no-new */
    new GOVUK.Modules.CrossDomainTracking($(anchor2)[0])

    expect(GOVUK.analytics.addLinkedTrackerDomain.calls.count()).toBe(1)

    window.GOVUK.triggerEvent($(anchor1)[0], 'click')

    expect(
      GOVUK.analytics.trackEvent
    ).toHaveBeenCalledWith('External Link Clicked', 'Do some surfing', { trackerName: 'govspeakButtonTracker' })

    window.GOVUK.triggerEvent($(anchor2)[0], 'click')

    expect(
      GOVUK.analytics.trackEvent
    ).toHaveBeenCalledWith('External Link Clicked', 'Do some shopping', { trackerName: 'govspeakButtonTracker' })
  })
})
