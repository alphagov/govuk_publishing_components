// https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
(function () {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var Ecommerce = function (config) {
    this.init = function (element) {
      // Limiting to 100 characters to avoid noise from extra longs search queries
      // and to stop the size of the payload going over 8k limit.
      var searchQuery   = GOVUK.analytics.stripPII(element.attr('data-search-query')).substring(0, 100).toLowerCase();
      var ecommerceRows = element.find('[data-ecommerce-row]');
      var startPosition = parseInt(element.data('ecommerce-start-index'), 10);

      ecommerceRows.each(function(index, ecommerceRow) {
        var $ecommerceRow = $(ecommerceRow);

        var contentId = $ecommerceRow.attr('data-ecommerce-content-id'),
          path = $ecommerceRow.attr('data-ecommerce-path');

        addImpression(contentId, path, index + startPosition, searchQuery);
        trackProductOnClick($ecommerceRow, contentId, path, index + startPosition, searchQuery);
      });
    }

    function addImpression (contentId, path, position, searchQuery) {
      // We only add the id to GA as additional product data is linked when it is uploaded.
      // This approach is taken to avoid the GA data packet exceeding the 8k limit
      ga('ec:addImpression', {
        id: contentId || path,
        position: position,
        list: 'Site search results',
        dimension71: searchQuery
      });
    }

    function trackProductOnClick (row, contentId, path, position, searchQuery) {
      row.click(function(event) {
        ga('ec:addProduct', {
          id: contentId || path,
          position: position,
          dimension71: searchQuery
        });

        ga('ec:setAction', 'click', {list: 'Site search results'});
        GOVUK.analytics.trackEvent('UX', 'click',
          GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({label: 'Results'})
        );
      });
    }
  }

  Ecommerce.ecLoaded = false;
  Ecommerce.start = function (element) {
    element = element || $('[data-analytics-ecommerce]');
    if(element.length > 0) {
      if(!Ecommerce.ecLoaded) {
        ga('require', 'ec');
        Ecommerce.ecLoaded = true;
      }
      var ecommerce = new Ecommerce();
      ecommerce.init(element);
    }
  }

  GOVUK.Ecommerce = Ecommerce;
})()
