// https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var DEFAULT_LIST_TITLE = 'Site search results';
  var DEFAULT_TRACK_CLICK_LABEL = 'Results';

  var Ecommerce = function (config) {
    this.init = function (element) {
      // Limiting to 100 characters to avoid noise from extra longs search queries
      // and to stop the size of the payload going over 8k limit.
      var searchQuery   = GOVUK.analytics.stripPII(element.attr('data-search-query')).substring(0, 100).toLowerCase();
      var ecommerceRows = element.find('[data-ecommerce-row]');
      var startPosition = parseInt(element.data('ecommerce-start-index'), 10);
      var listTitle     = element.data('list-title') || DEFAULT_LIST_TITLE;
      var variant       = element.data('ecommerce-variant');
      var trackClickLabel = element.data('track-click-label') || DEFAULT_TRACK_CLICK_LABEL;

      ecommerceRows.each(function(index, ecommerceRow) {
        var $ecommerceRow = $(ecommerceRow);
        var listSubheading  = $ecommerceRow.data('ecommerce-subheading') || undefined;
        var contentId = $ecommerceRow.attr('data-ecommerce-content-id'),
          path = $ecommerceRow.attr('data-ecommerce-path');

        var index_override = $ecommerceRow.attr('data-ecommerce-index');
        index = index_override ? parseInt(index_override, 10) - 1 : index;

        addImpression(contentId, path, index + startPosition, searchQuery, listTitle, listSubheading, variant);
        trackProductOnClick($ecommerceRow, contentId, path, index + startPosition, searchQuery, listTitle, listSubheading, variant, trackClickLabel);
      });
    }

    function constructData(contentId, path, position, listTitle, listSubheading, searchQuery, variant) {
      var data = {
        position: position,
        list: listTitle,
        dimension71: searchQuery
      }

      if (listSubheading !== undefined) {
        data.dimension94 = listSubheading
      }

      if (contentId !== undefined) {
        data.id = contentId
      }

      if (path !== undefined) {
        data.name = path
      }

      if (variant !== undefined) {
        data.variant = variant
      }

      return data
    }

    function addImpression (contentId, path, position, searchQuery, listTitle, listSubheading, variant) {
      if (contentId || path) {
        var impressionData = constructData(contentId, path, position, listTitle, listSubheading, searchQuery, variant)
        ga('ec:addImpression', impressionData);
      }
    }

    function trackProductOnClick (row, contentId, path, position, searchQuery, listTitle, listSubheading, variant, trackClickLabel) {
      row.click(function() {
        if (contentId || path) {
          var clickData = constructData(contentId, path, position, listTitle, listSubheading, searchQuery, variant)
          ga('ec:addProduct', clickData);
        }

        ga('ec:setAction', 'click', {list: listTitle});
        GOVUK.analytics.trackEvent('UX', 'click',
          GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({label: trackClickLabel})
        );
      });
    }
  }

  Ecommerce.ecLoaded = false;
  Ecommerce.start = function (element) {
    if (!window.ga) { return }
    element = element || $('[data-analytics-ecommerce]');
    if(element.length > 0) {
      if(!Ecommerce.ecLoaded) {
        ga('require', 'ec');
        Ecommerce.ecLoaded = true;
      }
      element.each(function(index){
        var ecommerce = new Ecommerce();
        ecommerce.init($(this));
      })
    }
  }

  GOVUK.Ecommerce = Ecommerce;
})()
