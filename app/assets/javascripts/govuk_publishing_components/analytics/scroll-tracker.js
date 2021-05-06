/* global GOVUK, $ */

(function () {
  'use strict'

  window.GOVUK = window.GOVUK || {}

  var CONFIG = {
    '/transition': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/guidance/coronavirus-covid-19-information-for-the-public': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/government/publications/the-essential-trustee-what-you-need-to-know-cc3/the-essential-trustee-what-you-need-to-know-what-you-need-to-do': [
      ['Heading', '1. About this guidance'],
      ['Heading', '2. Trustees’ duties at a glance'],
      ['Heading', '3. Who can be a trustee and how trustees are appointed'],
      ['Heading', '4. Ensure your charity is carrying out its purposes for the public benefit'],
      ['Heading', '5. Comply with your charity’s governing document and the law'],
      ['Heading', '6. Act in your charity’s best interests'],
      ['Heading', '7. Manage your charity’s resources responsibly'],
      ['Heading', '8. Act with reasonable care and skill'],
      ['Heading', '9. Ensure your charity is accountable'],
      ['Heading', '10. Reduce the risk of liability'],
      ['Heading', '11. Your charity’s legal structure and what it means'],
      ['Heading', '12. Charity officers - the chair and treasurer'],
      ['Heading', '13. Technical terms used in this guidance']
    ],
    '/guidance/universal-credit-how-it-helps-you-into-work': [
      ['Heading', 'Support from your work coach'],
      ['Heading', 'Help available for parents'],
      ['Heading', 'When you can claim Universal Credit'],
      ['Heading', 'More detailed advice']
    ],
    '/government/publications/spring-budget-2017-documents/spring-budget-2017': [
      ['Heading', '1. Executive summary'],
      ['Heading', '2. Economic context and public finances'],
      ['Heading', '3. Policy decisions'],
      ['Heading', '4. Tax'],
      ['Heading', '5. Productivity'],
      ['Heading', '6. Public services and markets'],
      ['Heading', '7. Annex A: Financing'],
      ['Heading', '8. Annex B: Office for Budget Responsibility\'s Economic and fiscal outlook']
    ],
    '/settled-status-eu-citizens-families': [
      ['Heading', 'When you can apply']
    ],
    '/guidance/returning-to-the-uk': [
      ['Heading', 'Ending your time living abroad']
    ],
    '/council-housing': [
      ['Heading', 'Choice-based lettings']
    ],
    '/guidance/foreign-travel-insurance': [
      ['Heading', 'What your travel insurance policy should cover']
    ],
    '/guidance/social-security-contributions-for-uk-and-eu-workers-if-the-uk-leaves-the-eu-with-no-deal': [
      ['Heading', 'UK employers'],
      ['Heading', 'UK employees and self-employed']
    ],
    '/guidance/student-finance-arrangements-in-a-no-deal-scenario': [
      ['Heading', 'Other overseas study placements']
    ],
    '/guidance/living-in-france': [
      ['Heading', 'Passports and travel']
    ],
    '/family-permit': [
      ['Heading', 'EEA family permit']
    ],
    '/guidance/healthcare-for-eu-and-efta-citizens-visiting-the-uk': [
      ['Heading', 'Travel insurance']
    ],
    '/guidance/driving-in-the-eu-after-brexit': [
      ['Heading', 'GB stickers and number plates']
    ],
    '/guidance/driving-in-the-eu-after-brexit#insurance-for-your-vehicle-caravan-or-trailer': [
      ['Heading', 'Trailer registration']
    ],
    '/driving-abroad': [
      ['Heading', 'Check your insurance if you’re taking your own vehicle']
    ],
    '/get-a-passport-urgently': [
      ['Heading', 'Ways to apply']
    ],
    '/driving-abroad/international-driving-permit': [
      ['Heading', 'Check which IDP you need']
    ],
    '/guidance/driving-in-the-eu-after-brexit#gb-stickers-and-number-plates': [
      ['Heading', 'GB stickers and number plates']
    ],
    '/guidance/guidance-for-suppliers-of-cattle-sheep-and-goat-ear-tags': [
      ['Heading', 'Tagging information for livestock keepers']
    ],
    '/guidance/wine-trade-regulations': [
      ['Heading', 'Rules for transporting wine into the UK']
    ],
    '/guidance/the-chemicals-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Energy and climate']
    ],
    '/guidance/how-to-move-goods-between-or-through-common-transit-countries-including-the-eu': [
      ['Heading', 'Start moving your goods']
    ],
    '/guidance/ecmt-international-road-haulage-permits': [
      ['Heading', 'Apply for permits']
    ],
    '/guidance/prepare-to-drive-in-the-eu-after-brexit-lorry-and-goods-vehicle-drivers': [
      ['Heading', 'Driver CPC for lorry drivers']
    ],
    '/guidance/run-international-bus-or-coach-services-after-brexit': [
      ['Heading', 'Run regular international services']
    ],
    '/guidance/vehicle-type-approval-if-theres-no-brexit-deal': [
      ['Heading', 'Existing vehicle and component type-approvals']
    ],
    '/guidance/the-retail-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Importing and exporting']
    ],
    '/guidance/the-consumer-goods-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Importing and exporting']
    ],
    '/government/publications/banking-insurance-and-other-financial-services-if-theres-no-brexit-deal/banking-insurance-and-other-financial-services-if-theres-no-brexit-deal-information-for-financial-services-institutions': [
      ['Heading', '3. Action taken by the UK']
    ],
    '/government/publications/further-guidance-note-on-the-regulation-of-medicines-medical-devices-and-clinical-trials-if-theres-no-brexit-deal/further-guidance-note-on-the-regulation-of-medicines-medical-devices-and-clinical-trials-if-theres-no-brexit-deal': [
      ['Heading', '1.4 Orphan medicines']
    ],
    '/guidance/check-temporary-rates-of-customs-duty-on-imports-after-eu-exit': [
      ['Heading', 'Tariff-rate quotas (TRQ)']
    ],
    '/guidance/construction-products-regulation-if-there-is-no-brexit-deal': [
      ['Heading', 'UK manufacturers exporting to the EU']
    ],
    '/guidance/european-and-domestic-funding-after-brexit': [
      ['Heading', 'What you need to do']
    ],
    '/guidance/guidance-on-substantial-amendments-to-a-clinical-trial-if-the-uk-leaves-the-eu-with-no-deal': [
      ['Heading', 'Investigational medicinal product (IMP) certification and importation']
    ],
    '/taking-goods-out-uk-temporarily/get-an-ata-carnet': [
      ['Heading', 'Using an ATA Carnet']
    ],
    '/wood-packaging-import-export': [
      ['Heading', 'Export solid wood packaging']
    ],
    '/guidance/answers-to-the-most-common-topics-asked-about-by-the-public-for-the-coronavirus-press-conference': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/coronavirus': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/coronavirus/education-and-childcare': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/coronavirus/worker-support': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/coronavirus/business-support': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/get-coronavirus-test': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ]
  }

  function ScrollTracker (sitewideConfig) {
    this.config = this.getConfigForCurrentPath(sitewideConfig)
    this.SCROLL_TIMEOUT_DELAY = 10

    if (!this.config) {
      this.enabled = false
      return
    }
    this.enabled = true

    this.trackedNodes = this.buildNodes(this.config)

    $(window).scroll($.proxy(this.onScroll, this))
    this.trackVisibleNodes()
  };

  ScrollTracker.prototype.getConfigForCurrentPath = function (sitewideConfig) {
    for (var path in sitewideConfig) {
      if (this.normalisePath(window.location.pathname) === this.normalisePath(path)) {
        return sitewideConfig[path]
      }
    }
  }

  ScrollTracker.prototype.buildNodes = function (config) {
    var nodes = []
    var NodeConstructor, nodeData

    for (var i = 0; i < config.length; i++) {
      NodeConstructor = ScrollTracker[config[i][0] + 'Node']
      nodeData = config[i][1]
      nodes.push(new NodeConstructor(nodeData))
    }

    return nodes
  }

  ScrollTracker.prototype.normalisePath = function (path) {
    return path.split('/').join('')
  }

  ScrollTracker.prototype.onScroll = function () {
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY)
  }

  ScrollTracker.prototype.trackVisibleNodes = function () {
    for (var i = 0; i < this.trackedNodes.length; i++) {
      if (this.trackedNodes[i].isVisible() && !this.trackedNodes[i].alreadySeen) {
        this.trackedNodes[i].alreadySeen = true

        var action = this.trackedNodes[i].eventData.action
        var label = this.trackedNodes[i].eventData.label

        GOVUK.analytics.trackEvent('ScrollTo', action, { label: label, nonInteraction: true })
      }
    }
  }

  ScrollTracker.PercentNode = function (percentage) {
    this.percentage = percentage
    this.eventData = { action: 'Percent', label: String(percentage) }
  }

  ScrollTracker.PercentNode.prototype.isVisible = function () {
    return this.currentScrollPercent() >= this.percentage
  }

  ScrollTracker.PercentNode.prototype.currentScrollPercent = function () {
    var $document = $(document)
    var $window = $(window)
    return (($window.scrollTop() / ($document.height() - $window.height())) * 100.0)
  }

  ScrollTracker.HeadingNode = function (headingText) {
    this.$element = getHeadingElement(headingText)
    this.eventData = { action: 'Heading', label: headingText }

    function getHeadingElement (headingText) {
      var $headings = $('h1, h2, h3, h4, h5, h6')
      for (var i = 0; i < $headings.length; i++) {
        if ($.trim($headings.eq(i).text()).replace(/\s/g, ' ') === headingText) return $headings.eq(i)
      }
    }
  }

  ScrollTracker.HeadingNode.prototype.isVisible = function () {
    if (!this.$element) return false
    return this.elementIsVisible(this.$element)
  }

  ScrollTracker.HeadingNode.prototype.elementIsVisible = function ($element) {
    var $window = $(window)
    var positionTop = $element.offset().top
    return (positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()))
  }

  $().ready(function () {
    window.GOVUK.scrollTracker = new ScrollTracker(CONFIG)
  })

  window.GOVUK.ScrollTracker = ScrollTracker
}())
