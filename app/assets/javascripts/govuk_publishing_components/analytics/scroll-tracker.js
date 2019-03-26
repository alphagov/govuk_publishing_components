(function() {
  "use strict";

  window.GOVUK = window.GOVUK || {};

  var CONFIG = {
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
    ]
  };

  function ScrollTracker(sitewideConfig) {
    this.config = this.getConfigForCurrentPath(sitewideConfig);
    this.SCROLL_TIMEOUT_DELAY = 10;

    if ( !this.config ) {
      this.enabled = false;
      return;
    }
    this.enabled = true;

    this.trackedNodes = this.buildNodes(this.config);

    $(window).scroll($.proxy(this.onScroll, this));
    this.trackVisibleNodes();
  }

  ScrollTracker.prototype.getConfigForCurrentPath = function (sitewideConfig) {
    for ( var path in sitewideConfig ) {
      if (this.normalisePath(window.location.pathname) == this.normalisePath(path)) {
        return sitewideConfig[path];
      }
    }
  };

  ScrollTracker.prototype.buildNodes = function (config) {
    var nodes = [];
    var nodeConstructor, nodeData;

    for (var i=0; i<config.length; i++) {
      nodeConstructor = ScrollTracker[config[i][0] + "Node"];
      nodeData = config[i][1];
      nodes.push(new nodeConstructor(nodeData));
    }

    return nodes;
  };

  ScrollTracker.prototype.normalisePath = function (path){
    return path.split("/").join("");
  };

  ScrollTracker.prototype.onScroll = function () {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY);
  };

  ScrollTracker.prototype.trackVisibleNodes = function () {
    for ( var i=0; i<this.trackedNodes.length; i++ ) {
      if ( this.trackedNodes[i].isVisible() && !this.trackedNodes[i].alreadySeen ) {
        this.trackedNodes[i].alreadySeen = true;

        var action = this.trackedNodes[i].eventData.action,
            label = this.trackedNodes[i].eventData.label;

        GOVUK.analytics.trackEvent('ScrollTo', action, {label: label, nonInteraction: true});
      }
    }
  };

  ScrollTracker.HeadingNode = function (headingText) {
    this.$element = getHeadingElement(headingText);
    this.eventData = {action: "Heading", label: headingText};

    function getHeadingElement(headingText) {
      var $headings = $('h1, h2, h3, h4, h5, h6');
      for ( var i=0; i<$headings.length; i++ ) {
        if ( $.trim($headings.eq(i).text()).replace(/\s/g, ' ') == headingText ) return $headings.eq(i);
      }
    }
  };

  ScrollTracker.HeadingNode.prototype.isVisible = function () {
    if ( !this.$element ) return false;
    return this.elementIsVisible(this.$element);
  }

  ScrollTracker.HeadingNode.prototype.elementIsVisible = function ($element) {
    var $window = $(window);
    var positionTop = $element.offset().top;
    return ( positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()) );
  };

  $().ready(function() {
    window.GOVUK.scrollTracker = new ScrollTracker(CONFIG);
  });

  window.GOVUK.ScrollTracker = ScrollTracker;
}());
