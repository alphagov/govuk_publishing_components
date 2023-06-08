//= require ../vendor/polyfills/closest.js
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

    ensureIndexesArePopulated: function (data) {
      if (!data.event_data) {
        return data
      }

      if (!data.event_data.index) {
        return data
      }

      var indexKeys = ['index_link', 'index_section', 'index_section_count']

      for (var i = 0; i < indexKeys.length; i++) {
        var indexKey = indexKeys[i]

        // If the index key isn't in the object, populate it. However if it's set to 0, leave it as 0. 0 is falsy so we have to add this extra check.
        if (!data.event_data.index[indexKey] && data.event_data.index[indexKey] !== 0) {
          data.event_data.index[indexKey] = undefined
        }
      }

      return data
    },

    sendData: function (data) {
      data = this.ensureIndexesArePopulated(data)

      data.govuk_gem_version = this.getGemVersion()
      // set this in the console as a debugging aid
      if (window.GOVUK.analyticsGa4.showDebug) {
        console.info(JSON.stringify(data, null, ' '))
      }
      window.dataLayer.push(data)
    },

    getGemVersion: function () {
      return window.GOVUK.analyticsGa4.vars.gem_version || 'not found'
    },

    trackFunctions: {

      getDomainRegex: function () {
        // This regex matches a protocol and domain name at the start of a string such as https://www.gov.uk, http://gov.uk, //gov.uk
        return /^(http:||https:)?(\/\/)([^\/]*)/ // eslint-disable-line no-useless-escape
      },

      findTrackingAttributes: function (clicked, trackingTrigger) {
        if (clicked.hasAttribute('[' + trackingTrigger + ']')) {
          return clicked
        } else {
          return clicked.closest('[' + trackingTrigger + ']')
        }
      },

      // create an object to split up long URLs and get around the 100 character limit on GTM data
      // this gets reassembled in GA4
      populateLinkPathParts: function (href) {
        var path = ''
        if (this.hrefIsRelative(href) || this.isMailToLink(href)) {
          path = href
        } else {
          // This regex matches a protocol and domain name at the start of a string such as https://www.gov.uk, http://gov.uk, //gov.uk
          path = href.replace(/^(http:||https:)?(\/\/)([^\/]*)/, '') // eslint-disable-line no-useless-escape
        }

        if (path === '/' || path.length === 0) {
          return
        }

        return this.splitStringIntoParts(path)
      },

      splitStringIntoParts: function (string) {
        /*
        This will create an object with 5 keys that are indexes ("1", "2", etc.)
        The values will be each part of the string split every 100 characters, or undefined.
        For example: {"1": "/hello/world/etc...", "2": "/more/path/text...", "3": undefined, "4": undefined, "5": undefined}
        Undefined values are needed to override the persistent object in GTM so that any values from old pushes are overwritten.
        */
        var parts = string.match(/.{1,100}/g)
        var obj = {}
        for (var i = 0; i < 5; i++) {
          obj[(i + 1).toString()] = parts[i]
        }
        return obj
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
          href = href.replaceAll(/_g[al]=([^&]*)/g, '')

          // The following code cleans up inconsistencies such as gov.uk/&&, gov.uk/?&hello=world, gov.uk/?, and gov.uk/&.
          href = href.replaceAll(/(&&)+/g, '&')
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
          // Only index links that are not search results or do not have a data-ga4-do-not-index attribute
          if (link.getAttribute('data-ga4-ecommerce-path') || link.getAttribute('data-ga4-do-not-index') !== null) {
            continue
          }
          totalLinks++
          link.setAttribute('data-ga4-index', '{"index_link": ' + totalLinks + '}')
        }

        try {
          var ga4LinkData = JSON.parse(module.getAttribute('data-ga4-link'))
          ga4LinkData.index_total = totalLinks
          module.setAttribute('data-ga4-link', JSON.stringify(ga4LinkData))
        } catch (e) {
          // if there's a problem with the config, don't start the tracker
          console.error('Unable to JSON.parse or JSON.stringify index: ' + e.message, window.location)
        }
      },

      addAttributesToElements: function (selector, dataAttributes) {
        var targetElements = document.querySelectorAll(selector)

        for (var i = 0; i < targetElements.length; i++) {
          var element = targetElements[i]

          for (var j = 0; j < dataAttributes.length; j++) {
            var key = dataAttributes[j].key
            var value = dataAttributes[j].value

            // value must check for undefined only as it would return false on an empty string, the number 0, etc.
            if (key && value !== undefined) {
              var existingAttributeValue = element.getAttribute(key)

              if (key === 'data-module' && existingAttributeValue) {
                // Combines values to prevent replacing any existing data-module values.
                element.setAttribute(key, existingAttributeValue + ' ' + value)
              } else {
                element.setAttribute(key, value)
              }
            }
          }
        }
      }
    },

    ecommerceHelperFunctions: {
      clearEcommerceObject: function () {
        window.GOVUK.analyticsGa4.core.sendData({ search_results: { ecommerce: null } })
      },

      getIndex: function (element, startPosition) {
        var index = element.getAttribute('data-ecommerce-index')

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

        // In order to extract the number of results from resultCount (which is a string at this point (e.g. '12,345 results')), we remove the comma and
        // split string at the space character so it can be parsed as an integer
        resultCount = resultCount.textContent.replace(',', '')
        resultCount = resultCount.split(' ')[0]

        return parseInt(resultCount)
      },

      populateEcommerceSchema: function (data) {
        var element = data.element
        var resultsId = data.resultsId
        var isClickEvent = data.event !== undefined
        var isSearchResult = element.getAttribute('data-search-query')

        var ecommerceSchema = new window.GOVUK.analyticsGa4.Schemas().ecommerceSchema()
        var PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()
        var DEFAULT_LIST_TITLE = 'Smart answer results'

        if (isSearchResult) {
          // Limiting to 100 characters to avoid noise from extra long search queries and to stop the size of the payload going over 8k limit.
          var searchQuery = PIIRemover.stripPII(element.getAttribute('data-search-query')).substring(0, 100).toLowerCase()
          var variant = element.getAttribute('data-ecommerce-variant')
          DEFAULT_LIST_TITLE = 'Site search results'
        }

        var items = element.querySelectorAll('[data-ga4-ecommerce-path]')
        var listTitle = element.getAttribute('data-list-title') || DEFAULT_LIST_TITLE
        var startPosition = parseInt(element.getAttribute('data-ecommerce-start-index'), 10)

        ecommerceSchema.event = 'search_results'
        ecommerceSchema.search_results.event_name = isClickEvent ? 'select_item' : 'view_item_list'
        ecommerceSchema.search_results.results = window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getResultCount(element, resultsId)
        ecommerceSchema.search_results.term = searchQuery || undefined
        ecommerceSchema.search_results.sort = variant || undefined

        if (isClickEvent) {
          var target = data.event.target
          ecommerceSchema.search_results.ecommerce.items.push({
            item_id: target.getAttribute('data-ga4-ecommerce-path'),
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

            // If the element does not have a data-ecommerce-index attribute, we set one so that we can use it later when setting the index property
            // on the ecommerce object.
            if (!item.getAttribute('data-ecommerce-index')) {
              item.setAttribute('data-ecommerce-index', i + 1)
            }

            ecommerceSchema.search_results.ecommerce.items.push({
              item_id: path,
              item_list_name: listTitle,
              index: window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.getIndex(item, startPosition)
            })
          }
        }

        return ecommerceSchema
      }
    }
  }

  analytics.core = core
})(window.GOVUK.analyticsGa4)
