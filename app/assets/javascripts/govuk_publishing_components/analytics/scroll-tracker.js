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
    '/government/publications/coronavirus-outbreak-faqs-what-you-can-and-cant-do/coronavirus-outbreak-faqs-what-you-can-and-cant-do': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/government/publications/coronavirus-covid-19-online-education-resources/coronavirus-covid-19-list-of-online-education-resources-for-home-education': [
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
    '/guidance/saving-for-retirement-if-youre-aged-16-to-50': [
      ['Heading', 'Keep track of your State Pension'],
      ['Heading', 'Consider ways to improve your State Pension'],
      ['Heading', 'Personal and stakeholder pensions']
    ],
    '/guidance/planning-for-retirement-if-youre-aged-50-or-over': [
      ['Heading', 'Find out your State Pension age'],
      ['Heading', 'Consider ways to improve your State Pension'],
      ['Heading', 'Workplace, personal and stakeholder pensions'],
      ['Heading', 'Personal and stakeholder pensions']
    ],
    '/guidance/retirement-planning-for-current-pensioners': [
      ['Heading', 'If you reached State Pension age before 6 April 2016'],
      ['Heading', 'Other ways to increase your income in retirement'],
      ['Heading', 'Further support in retirement'],
      ['Heading', 'Winter Fuel Payments']
    ],
    '/government/collections/disability-confident-campaign': [
      ['Heading', 'Become a Disability Confident employer'],
      ['Heading', 'Aims and objectives'],
      ['Heading', 'Inclusive communication']
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
    '/openingupwork': [
      ['Heading', 'How Universal Credit makes work pay'],
      ['Heading', 'When you can claim Universal Credit'],
      ['Heading', 'Help and advice']
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
    '/guidance/living-in-the-eu-prepare-for-brexit': [
      ['Heading', 'Travelling in the EU']
    ],
    '/guidance/driving-in-the-eu-after-brexit-driving-licence-exchange': [
      ['Heading', 'Belgium']
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
    '/guidance/passport-rules-for-travel-to-europe-after-brexit': [
      ['Heading', 'List of countries affected']
    ],
    '/visit-europe-brexit': [
      ['Heading', 'Travel']
    ],
    '/guidance/uk-nationals-in-the-eu-benefits-and-pensions-in-a-no-deal-scenario': [
      ['Heading', 'Pensions and benefits paid by an EEA state or Switzerland']
    ],
    '/guidance/uk-students-in-the-eu-continuing-your-studies': [
      ['Heading', 'Check whether you’ll get financial help']
    ],
    '/government/publications/cross-border-maintenance-cases-after-brexit-guidance-for-public/cross-border-maintenance-cases-after-brexit': [
      ['Heading', '2. New cases after Brexit']
    ],
    '/guidance/social-security-contributions-for-uk-and-eu-workers-if-the-uk-leaves-the-eu-with-no-deal': [
      ['Heading', 'UK employers'],
      ['Heading', 'UK employees and self-employed']
    ],
    '/guidance/student-finance-arrangements-in-a-no-deal-scenario': [
      ['Heading', 'Other overseas study placements']
    ],
    '/guidance/advice-for-british-nationals-travelling-and-living-in-europe': [
      ['Heading', 'Travelling to the UK']
    ],
    '/guidance/living-in-france': [
      ['Heading', 'Passports and travel']
    ],
    '/family-permit': [
      ['Heading', 'EEA family permit']
    ],
    '/guidance/european-temporary-leave-to-remain-in-the-uk': [
      ['Heading', 'Applying for European temporary leave to remain']
    ],
    '/guidance/visiting-the-uk-after-brexit': [
      ['Heading', 'If the UK leaves the EU without a deal']
    ],
    '/guidance/healthcare-for-eu-and-efta-citizens-visiting-the-uk': [
      ['Heading', 'Travel insurance']
    ],
    '/guidance/qualified-teacher-status-qts': [
      ['Heading', 'Teachers recognised in the EEA or Switzerland']
    ],
    '/guidance/driving-in-the-eu-after-brexit': [
      ['Heading', 'GB stickers and number plates']
    ],
    '/visit-europe-brexit#travel': [
      ['Heading', 'Compensation if your travel is disrupted']
    ],
    '/apply-for-a-uk-residence-card': [
      ['Heading', 'Fees']
    ],
    '/guidance/studying-in-the-european-union-after-brexit': [
      ['Heading', 'Applying for Erasmus+']
    ],
    '/settled-status-eu-citizens-families/not-EU-EEA-Swiss-citizen': [
      ['Heading', 'If you’re a family member of an EU, EEA or Swiss citizen']
    ],
    '/guidance/get-your-eea-qualification-recognised-in-the-uk-after-brexit': [
      ['Heading', 'Professionals already working in the UK']
    ],
    '/guidance/visiting-the-uk-after-brexit#if-your-vehicle-is-not-insured-in-the-uk': [
      ['Heading', 'If your vehicle is not insured in the UK']
    ],
    '/guidance/uk-residents-visiting-the-eueea-and-switzerland-healthcare': [
      ['Heading', 'European Health Insurance Cards (EHIC)']
    ],
    '/guidance/pet-travel-to-europe-after-brexit': [
      ['Heading', 'Pet travel if there’s a no-deal Brexit']
    ],
    '/guidance/driving-in-the-eu-after-brexit-international-driving-permits': [
      ['Heading', 'Check which type of IDP you need']
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
    '/guidance/mobile-roaming-after-eu-exit': [
      ['Heading', 'If you live in Northern Ireland']
    ],
    '/government/publications/mobile-roaming-after-eu-exit/mobile-roaming-if-theres-no-brexit-deal': [
      ['Heading', '1.2 If there’s no deal']
    ],
    '/driving-abroad/international-driving-permit': [
      ['Heading', 'Check which IDP you need']
    ],
    '/vehicle-insurance/driving-abroad': [
      ['Heading', 'Driving in other countries']
    ],
    '/guidance/driving-in-the-eu-after-brexit#gb-stickers-and-number-plates': [
      ['Heading', 'GB stickers and number plates']
    ],
    '/guidance/importing-and-exporting-plants-and-plant-products-if-theres-no-withdrawal-deal': [
      ['Heading', 'Movement of wood packaging material']
    ],
    '/guidance/egg-marketing-standards-if-theres-a-no-deal-brexit': [
      ['Heading', 'Customs checks']
    ],
    '/guidance/hatching-eggs-and-chicks-marketing-standards-when-the-uk-leaves-the-eu': [
      ['Heading', 'Customs checks']
    ],
    '/guidance/poultry-meat-marketing-standards-when-the-uk-leaves-the-eu': [
      ['Heading', 'Marketing standards checks']
    ],
    '/guidance/plant-variety-rights-and-marketing-plant-reproductive-material-if-the-uk-leaves-the-eu-without-a-deal': [
      ['Heading', 'Rules for applying for plant variety rights if there’s a no deal Brexit']
    ],
    '/guidance/exporting-animals-animal-products-fish-and-fishery-products-if-the-uk-leaves-the-eu-with-no-deal': [
      ['Heading', 'Exports to non-EU countries (third countries) from the UK']
    ],
    '/guidance/the-farming-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Farm and rural payments: Basic Payment Scheme and Rural Development Programme for England']
    ],
    '/guidance/protecting-food-and-drink-names-if-theres-no-brexit-deal': [
      ['Heading', 'New product applications']
    ],
    '/guidance/trading-and-labelling-organic-food-if-theres-no-brexit-deal': [
      ['Heading', 'Exporting organic food to the EU']
    ],
    '/guidance/hops-and-hops-products-marketing-standards-if-the-uk-leaves-the-eu-without-a-deal': [
      ['Heading', 'How to apply for an EU Attestation of Equivalence']
    ],
    '/guidance/guidance-for-suppliers-of-cattle-sheep-and-goat-ear-tags': [
      ['Heading', 'Tagging information for livestock keepers']
    ],
    '/government/publications/meeting-climate-change-requirements-if-theres-no-brexit-deal/meeting-climate-change-requirements-if-theres-no-brexit-deal': [
      ['Heading', 'Summary of actions']
    ],
    '/guidance/food-labelling-changes-after-brexit': [
      ['Heading', 'Goods sold in the UK']
    ],
    '/guidance/export-horses-and-ponies-special-rules': [
      ['Heading', 'Moving equines to the EU in a no-deal Brexit']
    ],
    '/guidance/trading-and-moving-endangered-species-protected-by-cites-if-theres-no-withdrawal-deal': [
      ['Heading', 'Trading with the EU']
    ],
    '/guidance/wine-trade-regulations': [
      ['Heading', 'Rules for transporting wine into the UK']
    ],
    '/guidance/the-food-and-drink-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Importing and exporting']
    ],
    '/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal': [
      ['Heading', 'Send fish to an EU border control post']
    ],
    '/guidance/the-fisheries-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Licensing arrangements']
    ],
    '/guidance/import-fish-after-a-no-deal-brexit': [
      ['Heading', 'Direct landings into the UK']
    ],
    '/guidance/the-chemicals-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Energy and climate']
    ],
    '/government/publications/trading-electricity-if-theres-no-brexit-deal/trading-electricity-if-theres-no-brexit-deal': [
      ['Heading', 'Summary of actions']
    ],
    '/guidance/how-to-move-goods-between-or-through-common-transit-countries-including-the-eu': [
      ['Heading', 'Start moving your goods']
    ],
    '/guidance/ecmt-international-road-haulage-permits': [
      ['Heading', 'Apply for permits']
    ],
    '/guidance/transporting-goods-between-the-uk-and-eu-in-a-no-deal-brexit-guidance-for-hauliers': [
      ['Heading', 'Cross-border responsibilities when moving goods']
    ],
    '/guidance/carry-out-international-road-haulage-after-brexit': [
      ['Heading', 'Vehicle and trailer insurance']
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
    '/guidance/hauliers-and-commercial-drivers-you-will-need-new-documents-to-transport-goods-into-the-eu-after-brexit': [
      ['Heading', 'Driver documents']
    ],
    '/guidance/how-to-move-goods-through-roro-locations-in-a-no-deal-brexit-eu-to-uk-and-uk-to-eu': [
      ['Heading', 'EU to UK: pre-journey from EU to the UK']
    ],
    '/guidance/the-retail-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Importing and exporting']
    ],
    '/guidance/the-consumer-goods-sector-and-preparing-for-eu-exit': [
      ['Heading', 'Importing and exporting']
    ],
    '/guidance/textile-labelling-after-brexit': [
      ['Heading', 'Labelling requirements']
    ],
    '/guidance/footwear-labelling-after-brexit': [
      ['Heading', 'Labelling requirements']
    ],
    '/government/publications/banking-insurance-and-other-financial-services-if-theres-no-brexit-deal/banking-insurance-and-other-financial-services-if-theres-no-brexit-deal-information-for-financial-services-institutions': [
      ['Heading', '3. Action taken by the UK']
    ],
    '/government/publications/eu-lawyers-in-the-uk-after-a-no-deal-brexit/eu-lawyers-in-the-uk-after-a-no-deal-brexit': [
      ['Heading', 'Lawyers with EU, Norway, Iceland or Liechtenstein qualifications and professional titles']
    ],
    '/government/publications/further-guidance-note-on-the-regulation-of-medicines-medical-devices-and-clinical-trials-if-theres-no-brexit-deal/further-guidance-note-on-the-regulation-of-medicines-medical-devices-and-clinical-trials-if-theres-no-brexit-deal': [
      ['Heading', '1.4 Orphan medicines']
    ],
    '/guidance/accounting-if-theres-no-brexit-deal': [
      ['Heading', 'UK public companies with an EEA listing']
    ],
    '/guidance/broadcasting-and-video-on-demand-if-theres-no-brexit-deal': [
      ['Heading', 'Get local legal advice about your video on-demand services']
    ],
    '/guidance/changes-to-copyright-law-after-brexit': [
      ['Heading', 'Artist’s resale right']
    ],
    '/guidance/changes-to-eu-and-international-designs-and-trade-mark-protection-after-brexit': [
      ['Heading', 'Registered design']
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
    '/guidance/exhaustion-of-ip-rights-and-parallel-trade-after-brexit': [
      ['Heading', 'Actions for IP rights holders']
    ],
    '/guidance/exporting-nuclear-related-items-after-brexit': [
      ['Heading', 'Exporting dual-use items']
    ],
    '/guidance/guidance-on-substantial-amendments-to-a-clinical-trial-if-the-uk-leaves-the-eu-with-no-deal': [
      ['Heading', 'Investigational medicinal product (IMP) certification and importation']
    ],
    '/guidance/importing-and-exporting-waste-if-theres-no-brexit-deal': [
      ['Heading', 'Rules after the UK leaves the EU']
    ],
    '/guidance/merger-review-and-anti-competitive-activity-after-brexit': [
      ['Heading', 'Mergers']
    ],
    '/guidance/nis-regulations-what-uk-digital-service-providers-operating-in-the-eu-should-do-after-brexit': [
      ['Heading', 'How RDSPs are regulated in the UK']
    ],
    '/guidance/placing-manufactured-goods-on-the-eu-internal-market-if-theres-no-deal': [
      ['Heading', 'Appointing an authorised representative or responsible person in the EU']
    ],
    '/guidance/prepare-to-import-relevant-nuclear-materials-from-the-eu-after-brexit-licensing-requirements': [
      ['Heading', 'More information']
    ],
    '/guidance/prepare-to-use-the-ukca-mark-after-brexit': [
      ['Heading', 'Check whether you will need to use the new UKCA marking']
    ],
    '/guidance/prepare-to-work-and-operate-in-the-european-aviation-sector-after-brexit': [
      ['Heading', 'Requirements for aviation businesses operating in Europe after the UK leaves the EU']
    ],
    '/guidance/public-sector-procurement-after-a-no-deal-brexit': [
      ['Heading', 'What will change for contracting authorities and entities']
    ],
    '/guidance/satellites-and-space-programmes-after-brexit': [
      ['Heading', 'Copernicus']
    ],
    '/guidance/shipping-radioactive-waste-and-spent-fuel-after-brexit': [
      ['Heading', 'After Brexit']
    ],
    '/guidance/trading-timber-imports-and-exports-if-theres-no-brexit-deal': [
      ['Heading', 'Importing timber for the UK market']
    ],
    '/guidance/what-you-need-to-move-goods-between-or-through-common-transit-countries-including-the-eu': [
      ['Heading', 'Getting a guarantee']
    ],
    '/taking-goods-out-uk-temporarily/get-an-ata-carnet': [
      ['Heading', 'Using an ATA Carnet']
    ],
    '/wood-packaging-import-export': [
      ['Heading', 'Export solid wood packaging']
    ],
    '/government/publications/vat-for-businesses-if-theres-no-brexit-deal/vat-for-businesses-if-theres-no-brexit-deal': [
      ['Heading', 'UK businesses importing goods from the EU']
    ],
    '/guidance/answers-to-the-most-common-topics-asked-about-by-the-public-for-the-coronavirus-press-conference': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/eubusiness': [
      ['Heading', 'Additional help and support']
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
