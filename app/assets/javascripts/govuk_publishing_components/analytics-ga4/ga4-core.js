window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {};

(function (analytics) {
  'use strict'

  var core = {
    load: function () {
      var firstScript = document.getElementsByTagName('script')[0]
      var newScript = document.createElement('script')
      newScript.async = true

      // initialise GTM
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.blocklist': ['customPixels', 'customScripts', 'html', 'nonGoogleScripts'] })
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

      var auth = window.GOVUK.analyticsGa4.vars.auth || ''
      var preview = window.GOVUK.analyticsGa4.vars.preview || ''
      if (auth) {
        auth = '&gtm_auth=' + auth
      }
      if (preview) {
        preview = '&gtm_preview=' + preview + '&gtm_cookies_win=x'
      }

      this.googleSrc = 'https://www.googletagmanager.com/gtm.js?id=' + window.GOVUK.analyticsGa4.vars.id + auth + preview
      newScript.src = this.googleSrc
      firstScript.parentNode.insertBefore(newScript, firstScript)
    },

    getUserAgent: function () {
      return navigator.userAgent
    },

    getTimestamp: function () {
      return Date.now().toString()
    },

    sendData: function (data) {
      // Allows us to stop sending tracking at the moment a user sets their usage cookies to "false" on the cookie settings page.
      if (window.GOVUK.stopSendingAnalytics) {
        return false
      }

      data.govuk_gem_version = this.getGemVersion()
      data.timestamp = this.getTimestamp()

      // set this in the console as a debugging aid
      if (window.GOVUK.analyticsGa4.showDebug) {
        if (data.event_data) {
          data.event_data = this.sortEventData(data.event_data)
        } else if (data.page_view) {
          data.page_view = this.sortEventData(data.page_view)
        } else if (data.search_results) {
          data.search_results = this.sortEventData(data.search_results)
        }
        console.info(JSON.stringify(data, null, ' '))
      }

      // Send GA4 data to a fake dataLayer if smokey_cachebust or disable_ga4 is in the query string. Used to prevent Smokey/other tests from spamming our analytics.
      if (this.trackFunctions.getSearch().match(/[?&](disable_ga4|smokey_cachebust){1}/)) {
        window.fakeDataLayer = window.fakeDataLayer || []
        window.fakeDataLayer.push(data)
        return
      }

      window.dataLayer.push(data)
    },

    applySchemaAndSendData: function (data, name) {
      var schemas = new window.GOVUK.analyticsGa4.Schemas()
      var schema = schemas.mergeProperties(data, name)
      this.sendData(schema)
    },

    getGemVersion: function () {
      return window.GOVUK.analyticsGa4.vars.gem_version || 'not found'
    },

    sortEventData: function (eventData) {
      if (!Object.keys) { // check for IE9 and below
        return eventData
      }

      var keys = Object.keys(eventData)
      keys.sort()
      var newEventData = {}
      for (var i = 0; i < keys.length; i++) {
        newEventData[keys[i]] = eventData[keys[i]]
      }
      return newEventData
    },

    trackFunctions: {

      getDomainRegex: function () {
        // This regex matches a protocol and domain name at the start of a string such as https://www.gov.uk, http://gov.uk, //gov.uk
        return /^(http:||https:)?(\/\/)([^\/]*)/ // eslint-disable-line no-useless-escape
      },

      getSearch: function () {
        return window.location.search
      },

      findTrackingAttributes: function (clicked, trackingTrigger) {
        if (clicked.hasAttribute('[' + trackingTrigger + ']')) {
          return clicked
        } else {
          return clicked.closest('[' + trackingTrigger + ']')
        }
      },

      hrefIsRelative: function (href) {
        // Checks that a href is relative by the lack of http:, https:// or // at the start of the href.
        var domain = this.getDomainRegex().exec(href)

        return !domain
      },

      isMailToLink: function (href) {
        return href.substring(0, 7) === 'mailto:'
      },

      getClickType: function (event) {
        switch (event.type) {
          case 'click':
            if (event.ctrlKey) {
              return 'ctrl click'
            } else if (event.metaKey) {
              return 'command/win click'
            } else if (event.shiftKey) {
              return 'shift click'
            } else if (event.altKey) {
              return 'alt/option click'
            } else {
              return 'primary click'
            }
          case 'mousedown':
            return 'middle click'
          case 'contextmenu':
            return 'secondary click'
        }
      },

      isInternalLink: function (href) {
        var internalDomains = window.GOVUK.analyticsGa4.vars.internalDomains
        if (this.hrefIsRelative(href)) {
          return true
        }
        var result = false
        for (var i = 0; i < internalDomains.length; i++) {
          var internalDomain = internalDomains[i]
          if (this.hrefPointsToDomain(href, internalDomain)) {
            result = true
          }
        }
        return result
      },

      isExternalLink: function (href) {
        return !this.isInternalLink(href)
      },

      hrefPointsToDomain: function (href, domain) {
        /* Add a trailing slash to prevent an edge case such
        as the href www.gov.uk.domain.co.uk being detected as an internal link,
        if we were checking for 'www.gov.uk' instead of 'www.gov.uk/' */
        if (domain.substring(domain.length) !== '/') {
          domain = domain + '/'
        }

        /* If the href doesn't end in a slash, we add one.
        This fixes an edge case where the <a href> is exactly `https://www.gov.uk`
        but these checks would only look for `https://www.gov.uk/` */
        if (href.substring(href.length) !== '/') {
          href = href + '/'
        }
        // matches the domain preceded by https:// http:// or //
        var regex = new RegExp('^((http)*(s)*(:)*//)(' + domain + ')', 'g')
        return regex.test(href)
      },

      removeLinesAndExtraSpaces: function (text) {
        text = text.trim()
        text = text.replace(/(\r\n|\n|\r)/gm, ' ') // Replace line breaks with 1 space
        text = text.replace(/\s+/g, ' ') // Replace instances of 2+ spaces with 1 space
        return text
      },

      removeCrossDomainParams: function (href) {
        if (href.indexOf('_ga') !== -1 || href.indexOf('_gl') !== -1) {
          // _ga & _gl are values needed for cross domain tracking, but we don't want them included in our click tracking.
          href = href.replace(/_g[al]=([^&]*)/g, '')

          // The following code cleans up inconsistencies such as gov.uk/&&, gov.uk/?&hello=world, gov.uk/?, and gov.uk/&.
          href = href.replace(/(&&)+/g, '&')
          href = href.replace('?&', '?')
          if (this.stringEndsWith(href, '?') || this.stringEndsWith(href, '&')) {
            href = href.substring(0, href.length - 1)
          }
        }
        return href
      },

      stringStartsWith: function (string, stringToFind) {
        return string.substring(0, stringToFind.length) === stringToFind
      },

      stringEndsWith: function (string, stringToFind) {
        return string.substring(string.length - stringToFind.length, string.length) === stringToFind
      },

      populateLinkDomain: function (href) {
        // We always want mailto links to have an undefined link_domain
        if (this.isMailToLink(href)) {
          return undefined
        }

        if (this.hrefIsRelative(href)) {
          return this.getProtocol() + '//' + this.getHostname()
        } else {
          var domain = this.getDomainRegex().exec(href)
          if (domain) {
            return domain[0]
          }
        }
      },

      getPathname: function () {
        return window.location.pathname
      },

      getProtocol: function () {
        return window.location.protocol
      },

      getHostname: function () {
        return window.location.hostname
      },

      appendDomainsWithoutWWW: function (domainsArrays) {
        // Add domains with www. removed, in case site hrefs are marked up without www. included.
        for (var i = 0; i < domainsArrays.length; i++) {
          var domain = domainsArrays[i]
          if (this.stringStartsWith(domain, 'www.')) {
            var domainWithoutWww = domain.replace('www.', '')
            domainsArrays.push(domainWithoutWww)
          }
        }
      },

      // The index and index_total properties are usually set by the application's templating engine however in instances where this isn't possible,
      // we use JavaScript to calculate the index_total and append it to data-ga4-link and add an index property to each link
      setIndexes: function (module) {
        var links = module.querySelectorAll('a')
        var totalLinks = 0
        for (var i = 0; i < links.length; i++) {
          var link = links[i]
          // Ignore links that don't have a href, have a data-ga4-do-not-index attribute on them, or are search result links.
          if (!link.getAttribute('href') || link.getAttribute('data-ga4-ecommerce-path') || link.getAttribute('data-ga4-do-not-index') !== null) {
            continue
          }
          totalLinks++
          link.setAttribute('data-ga4-index', '{"index_link": ' + totalLinks + '}')
        }

        try {
          var ga4LinkData = JSON.parse(module.getAttribute('data-ga4-link'))
          // use index_total if it already exists, otherwise calculate it and set it
          ga4LinkData.index_total = ga4LinkData.index_total || totalLinks
          module.setAttribute('data-ga4-link', JSON.stringify(ga4LinkData))
        } catch (e) {
          // if there's a problem with the config, don't start the tracker
          console.error('Unable to JSON.parse or JSON.stringify index: ', e, window.location)
        }
      },

      applyRedactionIfRequired: function (PIIRemover, element, data) {
        return element.closest('[data-ga4-do-not-redact]') ? data : PIIRemover.stripPIIWithOverride(data, true, true)
      },

      appendPathToAnchorLinks: function (url) {
        if (!this.stringStartsWith(url, '#') || this.getPathname() === '/') {
          return url
        }
        return this.getPathname() + url
      },

      standardiseSearchTerm: function (searchTerm) {
        if (!searchTerm) {
          return undefined // Prevents conversion of undefined to a string by this function.
        }

        var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()
        searchTerm = searchTerm.replace(/\++|(%2B)+/gm, ' ') // Turn + characters or unicode + characters (%2B) into a space.
        searchTerm = window.GOVUK.analyticsGa4.core.trackFunctions.removeLinesAndExtraSpaces(searchTerm)
        searchTerm = PIIRemover.stripPIIWithOverride(searchTerm, true, true)
        searchTerm = searchTerm.toLowerCase()
        return searchTerm
      }
    },

    ecommerceHelperFunctions: {
      clearEcommerceObject: function () {
        window.GOVUK.analyticsGa4.core.sendData({ search_results: { ecommerce: null } })
      },

      getIndex: function (element, startPosition) {
        var index = element.getAttribute('data-ga4-ecommerce-index')

        if (!index) {
          return null
        }

        return parseInt(index) + startPosition - 1
      },

      getResultCount: function (element, id) {
        var resultCount = element.querySelector('#' + id)

        if (!resultCount) {
          return null
        }

        // Remove anything that isn't a number from the result count heading. E.g. 'Results:' or the comma in '1,234'
        resultCount = resultCount.textContent.replace(/[^0-9]+/g, '')

        return parseInt(resultCount)
      },

      populateEcommerceSchema: function (data) {
        var element = data.element
        var resultsId = data.resultsId
        var isClickEvent = data.event !== undefined
        var isSearchResult = element.getAttribute('data-ga4-search-query')

        var ecommerceSchema = new window.GOVUK.analyticsGa4.Schemas().ecommerceSchema()
        var DEFAULT_LIST_TITLE = 'Smart answer results'

        if (isSearchResult) {
          var searchQuery = window.GOVUK.analyticsGa4.core.trackFunctions.standardiseSearchTerm(element.getAttribute('data-ga4-search-query'))
          var variant = element.getAttribute('data-ga4-ecommerce-variant')
          DEFAULT_LIST_TITLE = 'Site search results'
        }

        var items = element.querySelectorAll('[data-ga4-ecommerce-path]')
        var listTitle = element.getAttribute('data-ga4-list-title') || DEFAULT_LIST_TITLE
        var startPosition = parseInt(element.getAttribute('data-ga4-ecommerce-start-index'), 10)

        ecommerceSchema.event = 'search_results'
        ecommerceSchema.search_results.event_name = isClickEvent ? 'select_item' : 'view_item_list'
        ecommerceSchema.search_results.results = window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(element, resultsId)
        ecommerceSchema.search_results.term = searchQuery || undefined
        ecommerceSchema.search_results.sort = variant || undefined

        if (isClickEvent) {
          var target = data.event.target
          ecommerceSchema.search_results.ecommerce.items.push({
            item_id: target.getAttribute('data-ga4-ecommerce-path'),
            item_content_id: target.getAttribute('data-ga4-ecommerce-content-id') || undefined,
            item_name: target.textContent,
            item_list_name: listTitle,
            index: window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(target, startPosition)
          })

          ecommerceSchema.event_data = {
            external: window.GOVUK.analyticsGa4.core.trackFunctions.isExternalLink(target.getAttribute('data-ga4-ecommerce-path')) ? 'true' : 'false'
          }
        } else {
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var path = item.getAttribute('data-ga4-ecommerce-path')

            // If the element does not have a data-ga4-ecommerce-index attribute, we set one so that we can use it later when setting the index property
            // on the ecommerce object.
            if (!item.getAttribute('data-ga4-ecommerce-index')) {
              item.setAttribute('data-ga4-ecommerce-index', i + 1)
            }

            var nextItem = {
              item_id: path,
              item_content_id: item.getAttribute('data-ga4-ecommerce-content-id') || undefined,
              item_list_name: listTitle,
              index: window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(item, startPosition)
            }

            // GA4 has a max payload, so ensure this array doesn't exceed 15,000 UTF-16 code units.
            if ((this.getArraySize(ecommerceSchema.search_results.ecommerce.items) + this.getArraySize(nextItem)) >= 15000) {
              break
            }

            ecommerceSchema.search_results.ecommerce.items.push(nextItem)
          }
        }

        return ecommerceSchema
      },

      getArraySize: function (array) {
        // .length represents the number of UTF-16 code units in a string, so we can stringify the array then grab the length of the string to get an 'accurate enough' number representing the size.
        return JSON.stringify(array).length
      }
    }
  }

  analytics.core = core
})(window.GOVUK.analyticsGa4)
