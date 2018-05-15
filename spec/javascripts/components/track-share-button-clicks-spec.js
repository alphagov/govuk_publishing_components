/* global describe beforeEach it spyOn expect */

//var $ = window.jQuery

describe('A share button click tracker', function () {
  'use strict'

  var GOVUK = window.GOVUK
  var tracker
  var element

  GOVUK.analytics = GOVUK.analytics || {}
  GOVUK.analytics.trackShare = function () {}

  beforeEach(function () {
    tracker = new GOVUK.Modules.GemTrackShareButtonClicks()
  })

  it('tracks click events on share buttons', function () {
    GOVUK.analytics = {
      trackShare: function () {
      }
    };
    spyOn(GOVUK.analytics, 'trackShare')
    element = $(
      '<div>' +
        '<a href="#" class="js-share-facebook" data-network="facebook">Share</a>' +
        '<a href="#" class="js-share-twitter" data-network="twitter">Share</a>' +
      '</div>'
    )

    tracker.start(element)
    element.find('.js-share-facebook').trigger('click')
    element.find('.js-share-twitter').trigger('click')

    expect(GOVUK.analytics.trackShare).toHaveBeenCalledWith('facebook')
    expect(GOVUK.analytics.trackShare).toHaveBeenCalledWith('twitter')
  })
})
