describe('liveSearch', function () {
  var $form, $results, _supportHistory, liveSearch, $atomAutodiscoveryLink, $count
  var dummyResponse = {
    display_total: 1,
    pluralised_document_noun: 'reports',
    applied_filters: " \u003Cstrong\u003ECommercial - rotorcraft \u003Ca href='?format=json\u0026keywords='\u003E×\u003C/a\u003E\u003C/strong\u003E",
    atom_url: 'http://an-atom-url.atom?some-query-param',
    documents: [
      {
        document: {
          title: 'Test report',
          slug: 'aaib-reports/test-report',
          metadata: [
            {
              label: 'Aircraft category',
              value: 'General aviation - rotorcraft',
              is_text: true
            }, {
              label: 'Report type',
              value: 'Annual safety report',
              is_text: true
            }, {
              label: 'Occurred',
              is_date: true,
              machine_date: '2013-11-03',
              human_date: '3 November 2013'
            }
          ]
        },
        document_index: 1
      }
    ],
    search_results: '<div class="finder-results js-finder-results" data-module="gem-track-click">' +
      '<ol class="gem-c-document-list">' +
        '<li class="gem-c-document-list__item">' +
          '<a data-track-category="navFinderLinkClicked" data-track-action="" data-track-label="" class="gem-c-document-list__item-title" href="aaib-reports/test-report">Test report</a>' +
            '<p class="gem-c-document-list__item-description">The English business survey will provide Ministers and officials with information about the current economic and business conditions across</p>' +
            '<ul class="gem-c-document-list__item-metadata">' +
                '<li class="gem-c-document-list__attribute">' +
                    'Document type: Official Statistics' +
                '</li>' +
                '<li class="gem-c-document-list__attribute">' +
                    'Part of a collection: English business survey' +
                '</li>' +
                '<li class="gem-c-document-list__attribute">' +
                    'Organisation: Closed organisation: Department for Business, Innovation &amp; Skills' +
                '</li>' +
                '<li class="gem-c-document-list__attribute">' +
                    'Updated: <time datetime="2012-12-21">21 December 2012</time>' +
                '</li>' +
            '</ul>' +
        '</li>' +
      '</ol>' +
    '</div>'
  }

  var responseWithSortOptions = {
    sort_options_markup: '<select id="order">' +
      '<option ' +
        'value="option-val" ' +
        'data_track_category="option-data_track_category"' +
        'data_track_action="option-data_track_action"' +
        'data_track_label="option-data_track_label"' +
        'selected' +
        '/>' +
      '<option ' +
        'value="option-val-2" ' +
        'data_track_category="option-data_track_category-2"' +
        'data_track_action="option-data_track_action-2"' +
        'data_track_label="option-data_track_label-2"' +
        'disabled' +
        '/>' +
    '</select>'
  }

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  function denyCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
  }

  beforeEach(function () {
    jasmine.Ajax.install()
    var count = '<div aria-live="assertive" id="js-search-results-info"><h2 class="result-region-header__counter" id="f-result-count"></h2></div>'
    var sortList = '<select id="order" class="js-order-results" data-relevance-sort-option="relevance"><option>Test 1</option><option value="relevance" disabled>Relevance</option>'
    var results = '<div class="js-live-search-results-block"><div id="js-loading-message"></div><div id="js-sort-options">' + sortList + '</div></div>'
    var emailSubscriptionLinks = '<a href="https://a-url/email-signup?query_param=something">Get emails</a>'
    var feedSubscriptionLinks = '<a href="http://an-atom-url.atom?query_param=something">Subscribe to feed</a>'
    $form = $('<form action="/somewhere" class="js-live-search-form">' +
                '<input type="checkbox" name="field" value="sheep" checked>' +
                '<input type="checkbox" name="people[]" value="john">' +
                '<input type="checkbox" name="people[]" value="paul">' +
                '<label for="published_at">Published at</label>' +
                '<input type="text" name="published_at" value="2004" />' +
                '<input type="text" name="option-select-filter" value="notincluded"/>' +
                '<input type="text" name="unused_facet"/>' +
                '<input type="submit" value="Filter results" class="button js-live-search-fallback"/>' +
                emailSubscriptionLinks +
                feedSubscriptionLinks +
                count +
                results +
              '</form>')
    $results = $form.find('.js-live-search-results-block')
    $atomAutodiscoveryLink = $('<link href="http://an-atom-url.atom" rel="alternate" title="ATOM" type="application/atom+xml">')
    $count = $form.find('#js-search-results-info')
    $('body').append($form)
    $('head').append('<meta name="govuk:base_title" content="All Content - GOV.UK">').append($atomAutodiscoveryLink)
    _supportHistory = GOVUK.support.history
    GOVUK.support.history = function () { return true }
    window.ga = function () {}
    spyOn(window, 'ga')
    liveSearch = new GOVUK.LiveSearch({ $form: $form[0], $results: $results[0], $atomAutodiscoveryLink: $atomAutodiscoveryLink[0] })
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
    $form.remove()
    $results.remove()
    $atomAutodiscoveryLink.remove()
    var url = encodeURI(window.location.pathname)
    window.history.pushState('', '', url)
    GOVUK.support.history = _supportHistory
  })

  it('sets the GA transport to beacon', function () {
    expect(window.ga).toHaveBeenCalledWith('set', 'transport', 'beacon')
  })

  it('should save initial state (serialized and compacted)', function () {
    expect(liveSearch.state).toEqual([{ name: 'field', value: 'sheep' }, { name: 'published_at', value: '2004' }])
  })

  it('should detect a new state', function () {
    expect(liveSearch.isNewState()).toBe(false)
    $form.find('input[name="field"]').prop('checked', false)
    expect(liveSearch.isNewState()).toBe(true)
  })

  it('should update state to current state', function () {
    expect(liveSearch.state).toEqual([{ name: 'field', value: 'sheep' }, { name: 'published_at', value: '2004' }])
    $form.find('input[name="field"]').prop('checked', false)
    liveSearch.saveState()
    expect(liveSearch.state).toEqual([{ name: 'published_at', value: '2004' }])
  })

  it('should update state to passed in state', function () {
    expect(liveSearch.state).toEqual([{ name: 'field', value: 'sheep' }, { name: 'published_at', value: '2004' }])
    $form.find('input[name="field"]').prop('checked', false)
    liveSearch.saveState({ my: 'new', state: 'object' })
    expect(liveSearch.state).toEqual({ my: 'new', state: 'object' })
  })

  it('should not request new results if they are in the cache', function () {
    liveSearch.resultCache['more=results'] = 'exists'
    liveSearch.state = { more: 'results' }
    spyOn(liveSearch, 'displayResults')
    spyOn(XMLHttpRequest.prototype, 'send')

    liveSearch.updateResults()
    expect(liveSearch.displayResults).toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).not.toHaveBeenCalled()
  })

  it('should show error indicator when error loading new results', function () {
    liveSearch.state = { not: 'cached' }
    spyOn(liveSearch, 'displayResults')
    spyOn(liveSearch, 'showErrorIndicator')
    liveSearch.updateResults()

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500
    })
    expect(liveSearch.showErrorIndicator).toHaveBeenCalled()
  })

  it('should return cache items for current state', function () {
    liveSearch.state = { not: 'cached' }
    expect(liveSearch.cache('some-slug')).toBe(undefined)
    liveSearch.cache('some-slug', 'something in the cache')
    expect(liveSearch.cache('some-slug')).toBe('something in the cache')
  })

  describe('changing the search options', function () {
    beforeEach(function () {
      // clear these options to simplify the URLs
      $form.find('input[name=field]').prop('checked', false)
      $form.find('input[name=published_at]').val('')
    })

    it('should update the URL', function () {
      $form.find('input[value="john"]').click()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: '{}'
      })

      expect(window.location.search).toContain('people%5B%5D=john')
    })

    it('should update the URL when the search result is already cached', function () {
      var urls = [
        'people%5B%5D=john',
        'people%5B%5D=john&people%5B%5D=paul'
      ]
      for (var i = 0; i < urls.length; i++) {
        jasmine.Ajax.stubRequest('/somewhere.json?' + urls[i]).andReturn({
          status: 200,
          response: '{}'
        })
      }
      $form.find('input[value="john"]').click() // only john is selected
      $form.find('input[value="paul"]').click() // john and paul are selected
      $form.find('input[value="paul"]').click() // only john is selected (cached from before)
      expect(window.location.search).toContain('people%5B%5D=john')
      expect(window.location.search).not.toContain('people%5B%5D=paul')
    })
  })

  describe('should not display out of date results', function () {
    it('should not update the results if the state associated with these results is not the current state of the page', function () {
      liveSearch.state = 'cma-cases.json?keywords=123'
      spyOn(liveSearch, 'updateElement')
      liveSearch.displayResults(dummyResponse, 'made up state')
      expect(liveSearch.updateElement).not.toHaveBeenCalled()
    })

    it('should have an order state selected when keywords are present', function () {
      liveSearch.state = 'find-eu-exit-guidance-business.json?keywords=123'
      expect(liveSearch.$orderSelect.value).not.toBe(null)
    })

    it('should update the results if the state of these results matches the state of the page', function () {
      liveSearch.state = { search: 'state' }
      spyOn(liveSearch, 'updateElement')
      liveSearch.displayResults(dummyResponse, $.param(liveSearch.state))
      expect(liveSearch.updateElement).toHaveBeenCalled()
    })
  })

  it('should show the filter results button if the GOVUK.support.history returns false', function () {
    // Hide the filter button (this is done in the CSS under the .js-enabled selector normally)
    $form.find('.js-live-search-fallback').hide()
    expect($form.find('.js-live-search-fallback').is(':visible')).toBe(false)
    GOVUK.support.history = function () { return false }
    liveSearch = new GOVUK.LiveSearch({ $form: $form[0], $results: $results[0], $atomAutodiscoveryLink: $atomAutodiscoveryLink[0] })
    expect($form.find('.js-live-search-fallback').is(':visible')).toBe(true)
  })

  describe('with relevant DOM nodes set', function () {
    beforeEach(function () {
      liveSearch.$form = $form[0]
      liveSearch.$resultsBlock = $results[0]
      liveSearch.$countBlock = $count[0]
      liveSearch.state = { field: 'sheep', published_at: '2004' }
      liveSearch.$atomAutodiscoveryLink = $atomAutodiscoveryLink[0]
    })

    it('should update save state and update results when checkbox is changed', function () {
      var promise = jasmine.createSpyObj('promise', ['done'])
      spyOn(liveSearch, 'updateResults').and.returnValue(promise)
      $form.find('input[name="field"]').prop('checked', false)

      liveSearch.formChange()
      expect(liveSearch.state).toEqual([{ name: 'published_at', value: '2004' }])
      expect(liveSearch.updateResults).toHaveBeenCalled()
    })

    it('should call updateLinks function when a facet is changed', function () {
      spyOn(liveSearch, 'updateLinks')
      $form.find('input[name="field"]').prop('checked', false)

      liveSearch.formChange()
      expect(liveSearch.state).toEqual([{ name: 'published_at', value: '2004' }])
      expect(liveSearch.updateLinks).toHaveBeenCalled()
    })

    it('should trigger analytics trackpage when checkbox is changed', function () {
      spyOn(liveSearch, 'updateResults').and.callThrough()
      spyOn(GOVUK.SearchAnalytics, 'trackPageview')
      spyOn(liveSearch, 'trackingInit')

      liveSearch.state = []

      liveSearch.formChange()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: '{"total":81,"display_total":"81 reports","facet_tags":"","search_results":"","display_selected_facets_count":"","sort_options_markup":"","next_and_prev_links":"","suggestions":"","errors":{}}'
      })

      expect(liveSearch.trackingInit).toHaveBeenCalled()
      expect(GOVUK.SearchAnalytics.trackPageview).toHaveBeenCalled()
      var trackArgs = GOVUK.SearchAnalytics.trackPageview.calls.first().args[0]
      expect(trackArgs.split('?')[1], 'field=sheep')
    })

    it("should do nothing if state hasn't changed when a checkbox is changed", function () {
      spyOn(liveSearch, 'updateResults')

      liveSearch.formChange()

      expect(liveSearch.state).toEqual({ field: 'sheep', published_at: '2004' })
      expect(liveSearch.updateResults).not.toHaveBeenCalled()
    })

    it('should trigger filterClicked custom event when input type is text and analytics are not suppressed', function () {
      GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent = function (event) {}
      spyOn(GOVUK.LiveSearch.prototype, 'fireTextAnalyticsEvent')

      var dateInput = $form.find('input[name="published_at"]').val('2005')[0]
      window.GOVUK.triggerEvent(dateInput, 'change')

      expect(GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent).toHaveBeenCalledTimes(1)
    })

    it('should trigger filterClicked for both change and enter key events on text input', function () {
      GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent = function (event) {}
      spyOn(GOVUK.LiveSearch.prototype, 'fireTextAnalyticsEvent')

      var publishedAt = $form.find('input[name="published_at"]').val('searchChange')[0]
      window.GOVUK.triggerEvent(publishedAt, 'change')

      expect(GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent).toHaveBeenCalledTimes(1)

      publishedAt.value = 'searchEnter'
      window.GOVUK.triggerEvent(publishedAt, 'keypress', { keyCode: 13 })

      expect(GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent).toHaveBeenCalledTimes(2)
    })

    it('should not trigger multiple tracking events if the search term stays the same', function () {
      GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent = function (event) {}
      spyOn(GOVUK.LiveSearch.prototype, 'fireTextAnalyticsEvent')

      $form.find('input[name="published_at"]').val('same term').trigger('change')
      $form.find('input[name="published_at"]').val('same term').trigger('change')

      var publishedAt = $form.find('input[name="published_at"]')[0]
      window.GOVUK.triggerEvent(publishedAt, 'keypress', { keyCode: 13 })

      expect(GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent).toHaveBeenCalledTimes(1)
    })

    it('should not trigger filterClicked custom event when input type is text and analytics are suppressed', function () {
      GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent = function (event) {}
      spyOn(GOVUK.LiveSearch.prototype, 'fireTextAnalyticsEvent')

      $form.find('input[name="published_at"]').val('2005').trigger({
        type: 'change',
        suppressAnalytics: true
      })

      expect(GOVUK.LiveSearch.prototype.fireTextAnalyticsEvent).toHaveBeenCalledTimes(0)
    })

    it('should display results from the cache', function () {
      liveSearch.resultCache['the=first'] = dummyResponse
      liveSearch.state = { the: 'first' }
      liveSearch.displayResults(dummyResponse, $.param(liveSearch.state))
      expect($results.find('a').text()).toMatch('Test report')
      expect($count.text()).toMatch(/^\s*1\s*/)
    })

    it('should update the Atom autodiscovery link', function () {
      liveSearch.displayResults(dummyResponse, $.param(liveSearch.state))
      expect($atomAutodiscoveryLink[0].getAttribute('href')).toEqual(dummyResponse.atom_url)
    })
  })

  describe('popState', function () {
    var dummyHistoryState

    beforeEach(function () {
      dummyHistoryState = { originalEvent: { state: true } }
    })

    it('should call restoreBooleans, restoreTextInputs, saveState and updateResults if there is an event in the history', function () {
      spyOn(liveSearch, 'restoreBooleans')
      spyOn(liveSearch, 'restoreTextInputs')
      spyOn(liveSearch, 'saveState')
      spyOn(liveSearch, 'updateResults')

      liveSearch.popState(dummyHistoryState)

      expect(liveSearch.restoreBooleans).toHaveBeenCalled()
      expect(liveSearch.restoreTextInputs).toHaveBeenCalled()
      expect(liveSearch.saveState).toHaveBeenCalled()
      expect(liveSearch.updateResults).toHaveBeenCalled()
    })
  })

  describe('restoreBooleans', function () {
    beforeEach(function () {
      liveSearch.state = [{ name: 'list_1[]', value: 'checkbox_1' }, { name: 'list_1[]', value: 'checkbox_2' }, { name: 'list_2[]', value: 'radio_1' }]
      liveSearch.$form = $('<form action="/somewhere" class="js-live-search-form"><input id="check_1" type="checkbox" name="list_1[]" value="checkbox_1"><input type="checkbox" id="check_2"  name="list_1[]" value="checkbox_2"><input type="radio" id="radio_1"  name="list_2[]" value="radio_1"><input type="radio" id="radio_2"  name="list_2[]" value="radio_2"><input type="submit"/></form>')[0]
    })

    it('should check a checkbox if in the state it is checked in the history', function () {
      expect(liveSearch.$form.querySelectorAll('input[type=checkbox]:checked').length).toBe(0)
      liveSearch.restoreBooleans()
      expect(liveSearch.$form.querySelectorAll('input[type=checkbox]:checked').length).toBe(2)
    })

    it('should not check all the checkboxes if only one is checked', function () {
      liveSearch.state = [{ name: 'list_1[]', value: 'checkbox_2' }]
      expect(liveSearch.$form.querySelectorAll('input[type=checkbox]:checked').length).toBe(0)
      liveSearch.restoreBooleans()
      expect($(liveSearch.$form).find('input[type=checkbox][checked=true]')[0].id).toBe('check_2')
      expect($(liveSearch.$form).find('input[type=checkbox][checked=true]').length).toBe(1)
    })

    it('should pick a radiobox if in the state it is picked in the history', function () {
      expect(liveSearch.$form.querySelectorAll('input[type=radio]:checked').length).toBe(0)
      liveSearch.restoreBooleans()
      expect(liveSearch.$form.querySelectorAll('input[type=radio]:checked').length).toBe(1)
    })
  })

  describe('restoreKeywords', function () {
    beforeEach(function () {
      liveSearch.state = [{ name: 'text_1', value: 'Monday' }]
      liveSearch.$form = $('<form action="/somewhere"><input id="text_1" type="text" name="text_1"><input id="text_2" type="text" name="text_2"></form>')[0]
    })

    it('should put the right text back in the right box', function () {
      expect($(liveSearch.$form).find('#text_1').val()).toBe('')
      expect($(liveSearch.$form).find('#text_2').val()).toBe('')
      liveSearch.restoreTextInputs()
      expect($(liveSearch.$form).find('#text_1').val()).toBe('Monday')
      expect($(liveSearch.$form).find('#text_2').val()).toBe('')
    })
  })

  describe('indexTrackingData', function () {
    var groupedResponse = {
      search_results:
        '<ul class="finder-results js-finder-results" data-module="gem-track-click">' +
          '<li class="filtered-results__group">' +
            '<h2 class="filtered-results__facet-heading">Primary group</h2>' +
            '<ol class="gem-c-document-list">' +
              '<li class="gem-c-document-list__item ">' +
                '<a data-track-category="navFinderLinkClicked" data-track-action="foo" data-track-label="" class="gem-c-document-list__item-title " href="/reports/test-report-1">Test report 1</a>' +
                '<ul class="gem-c-document-list__item-metadata"></ul>' +
              '</li>' +
              '<li class="gem-c-document-list__item ">' +
                '<a data-track-category="navFinderLinkClicked" data-track-action="foo" data-track-label="" class="gem-c-document-list__item-title " href="/reports/test-report-4">Test report 4</a>' +
                '<ul class="gem-c-document-list__item-metadata"></ul>' +
              '</li>' +
            '</ol>' +
          '</li>' +
          '<li class="filtered-results__group">' +
            '<h2 class="filtered-results__facet-heading">Default group</h2>' +
            '<ol class="gem-c-document-list">' +
              '<li class="gem-c-document-list__item ">' +
                '<a data-track-category="navFinderLinkClicked" data-track-action="foo" data-track-label="" class="gem-c-document-list__item-title " href="/reports/test-report-3">Test report 3</a>' +
                '<ul class="gem-c-document-list__item-metadata"></ul>' +
              '</li>' +
              '<li class="gem-c-document-list__item ">' +
                '<a data-track-category="navFinderLinkClicked" data-track-action="foo" data-track-label="" class="gem-c-document-list__item-title " href="/reports/test-report-2">Test report 2</a>' +
                '<ul class="gem-c-document-list__item-metadata"></ul>' +
              '</li>' +
            '</ol>' +
          '</li>' +
        '</ul>'
    }

    beforeEach(function () {
      liveSearch.$form = $form[0]
      liveSearch.$resultsBlock = $results[0]
      liveSearch.state = { search: 'state' }
    })

    it('is called by trackingInit()', function () {
      spyOn(liveSearch, 'indexTrackingData')
      liveSearch.trackingInit()
      expect(liveSearch.indexTrackingData).toHaveBeenCalled()
    })

    it('re-indexes tracking actions for grouped items', function () {
      liveSearch.displayResults(groupedResponse, $.param(liveSearch.state))
      liveSearch.indexTrackingData()

      var $firstGroup = $results.find('.filtered-results__group:nth-child(1)')
      var $defaultGroup = $results.find('.filtered-results__group:nth-child(2)')

      expect($firstGroup.find('h2').text()).toMatch('Primary group')
      expect($firstGroup.find('a[data-track-action="foo.1.1"]').text()).toMatch('Test report 1')
      expect($firstGroup.find('a[data-track-action="foo.1.2"]').text()).toMatch('Test report 4')

      expect($defaultGroup.find('h2').text()).toMatch('Default group')
      expect($defaultGroup.find('a[data-track-action="foo.2.1"]').text()).toMatch('Test report 3')
      expect($defaultGroup.find('a[data-track-action="foo.2.2"]').text()).toMatch('Test report 2')
    })
  })

  it('should replace links with new links when state changes', function () {
    liveSearch.updateLinks()
    expect(liveSearch.$emailLinks[0].getAttribute('href')).toBe('https://a-url/email-signup?field=sheep&published_at=2004')
    expect(liveSearch.$atomLinks[0].getAttribute('href')).toBe('http://an-atom-url.atom?field=sheep&published_at=2004')
    expect(liveSearch.$atomAutodiscoveryLink.getAttribute('href')).toBe('http://an-atom-url.atom?field=sheep&published_at=2004')
    $form.find('input[name="field"]').prop('checked', false)
    liveSearch.saveState()
    liveSearch.updateLinks()
    expect(liveSearch.$emailLinks[0].getAttribute('href')).toBe('https://a-url/email-signup?published_at=2004')
    expect(liveSearch.$atomLinks[0].getAttribute('href')).toBe('http://an-atom-url.atom?published_at=2004')
    expect(liveSearch.$atomAutodiscoveryLink.getAttribute('href')).toBe('http://an-atom-url.atom?published_at=2004')
  })

  describe('updateSortOptions', function () {
    it('replaces the sort options with new data', function () {
      liveSearch.$form = $form[0]
      liveSearch.$resultsBlock = $results[0]
      liveSearch.state = { search: 'state' }

      expect($('#order option').length).toBe(2)
      $('#order').remove()
      expect($('#order option').length).toBe(0)
      // We receive new data, which adds the sort options to the DOM.
      liveSearch.updateSortOptions(responseWithSortOptions, $.param(liveSearch.state))
      expect($('#order option').length).toBe(2)
      expect($('#order option:disabled').length).toBe(1)
      expect($('#order option:selected').length).toBe(1)
    })
  })

  describe('spelling suggestions', function () {
    var $suggestionBlock = $('<div class="spelling-suggestions" id="js-spelling-suggestions"></div>')
    var responseWithSpellingSuggestions = {
      display_total: 1,
      pluralised_document_noun: 'reports',
      applied_filters: " \u003Cstrong\u003ECommercial - rotorcraft \u003Ca href='?format=json\u0026keywords='\u003E×\u003C/a\u003E\u003C/strong\u003E",
      atom_url: 'http://an-atom-url.atom?some-query-param',
      documents: [
        {
          document: {
            title: 'Test report',
            slug: 'aaib-reports/test-report',
            metadata: [
              {
                label: 'Aircraft category',
                value: 'General aviation - rotorcraft',
                is_text: true
              }, {
                label: 'Report type',
                value: 'Annual safety report',
                is_text: true
              }, {
                label: 'Occurred',
                is_date: true,
                machine_date: '2013-11-03',
                human_date: '3 November 2013'
              }
            ]
          },
          document_index: 1
        }
      ],
      search_results: '<div class="finder-results js-finder-results" data-module="gem-track-click">' +
        '<ol class="gem-c-document-list">' +
          '<li class="gem-c-document-list__item">' +
            '<a data-track-category="navFinderLinkClicked" data-track-action="" data-track-label="" class="gem-c-document-list__item-title" href="aaib-reports/test-report">Test report</a>' +
              '<p class="gem-c-document-list__item-description">The English business survey will provide Ministers and officials with information about the current economic and business conditions across</p>' +
              '<ul class="gem-c-document-list__item-metadata">' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Document type: Official Statistics' +
                  '</li>' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Part of a collection: English business survey' +
                  '</li>' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Organisation: Closed organisation: Department for Business, Innovation &amp; Skills' +
                  '</li>' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Updated: <time datetime="2012-12-21">21 December 2012</time>' +
                  '</li>' +
              '</ul>' +
          '</li>' +
        '</ol>' +
      '</div>',
      suggestions: '<p class="govuk-body">Did you mean' +
      '<a class="govuk-link govuk-!-font-weight-bold" data-ecommerce-content-id="dd395436-9b40-41f3-8157-740a453ac972"' +
      'data-ecommerce-row="1" data-track-options="{"dimension81":"driving licences"}" href="/search/all?keywords=driving+licences&order=relevance">' +
      'driving licences</a> </p>'
    }

    var responseWithNoSpellingSuggestions = {
      display_total: 1,
      pluralised_document_noun: 'reports',
      applied_filters: " \u003Cstrong\u003ECommercial - rotorcraft \u003Ca href='?format=json\u0026keywords='\u003E×\u003C/a\u003E\u003C/strong\u003E",
      atom_url: 'http://an-atom-url.atom?some-query-param',
      documents: [
        {
          document: {
            title: 'Test report',
            slug: 'aaib-reports/test-report',
            metadata: [
              {
                label: 'Aircraft category',
                value: 'General aviation - rotorcraft',
                is_text: true
              }, {
                label: 'Report type',
                value: 'Annual safety report',
                is_text: true
              }, {
                label: 'Occurred',
                is_date: true,
                machine_date: '2013-11-03',
                human_date: '3 November 2013'
              }
            ]
          },
          document_index: 1
        }
      ],
      search_results: '<div class="finder-results js-finder-results" data-module="gem-track-click">' +
        '<ol class="gem-c-document-list">' +
          '<li class="gem-c-document-list__item">' +
            '<a data-track-category="navFinderLinkClicked" data-track-action="" data-track-label="" class="gem-c-document-list__item-title" href="aaib-reports/test-report">Test report</a>' +
              '<p class="gem-c-document-list__item-description">The English business survey will provide Ministers and officials with information about the current economic and business conditions across</p>' +
              '<ul class="gem-c-document-list__item-metadata">' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Document type: Official Statistics' +
                  '</li>' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Part of a collection: English business survey' +
                  '</li>' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Organisation: Closed organisation: Department for Business, Innovation &amp; Skills' +
                  '</li>' +
                  '<li class="gem-c-document-list__attribute">' +
                      'Updated: <time datetime="2012-12-21">21 December 2012</time>' +
                  '</li>' +
              '</ul>' +
          '</li>' +
        '</ol>' +
      '</div>',
      suggestions: ''
    }
    beforeEach(function () {
      $form.append($suggestionBlock)
      liveSearch = new GOVUK.LiveSearch({ $form: $form[0], $results: $results[0], $suggestionBlock: $suggestionBlock[0], $atomAutodiscoveryLink: $atomAutodiscoveryLink[0] })
    })

    afterEach(function () {
      $form.remove()
    })

    it('are shown if there are available in the data', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithSpellingSuggestions, $.param(liveSearch.state))
      expect($('#js-spelling-suggestions a').text()).toBe('driving licences')
      expect($('#js-spelling-suggestions a').attr('href')).toBe('/search/all?keywords=driving+licences&order=relevance')
    })

    it('are not shown if there are none in the data', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithNoSpellingSuggestions, $.param(liveSearch.state))
      expect($('#js-spelling-suggestions').text()).toBe('')
    })

    it('tracking has been called', function () {
      liveSearch.state = { search: 'state' }
      spyOn(liveSearch, 'trackSpellingSuggestionsImpressions')
      liveSearch.displayResults(responseWithSpellingSuggestions, $.param(liveSearch.state))
      expect(liveSearch.trackSpellingSuggestionsImpressions).toHaveBeenCalled()
    })
  })

  describe('validation of user date input', function () {
    var $filterDateBlock = $('<div class="app-c-date-filter" id="public_timestamp">' +
    '<div class="govuk-form-group">' +
    '<label for="public_timestamp[from]" class="gem-c-label govuk-label">Updated after</label>' +
    '<div id="hint-3d03f42d" class="gem-c-hint govuk-hint govuk-!-margin-bottom-3">' +
      'For example, 2005 or 21/11/2014' +
    '</div>' +
    '<input name="public_timestamp[from]" value="" class="gem-c-input govuk-input" ' +
    'id="public_timestamp[from]" type="text" aria-describedby="hint-3d03f42d" aria-controls="js-search-results-info">' +
    '</div>' +
    '<div class="govuk-form-group govuk-form-group--error">' +
    '<label for="public_timestamp[to]" class="gem-c-label govuk-label">Updated before</label>' +
    '<div id="hint-3626790f" class="gem-c-hint govuk-hint govuk-!-margin-bottom-3">' +
      'For example, 2005 or 21/11/2014' +
    '</div>' +
    '<span id="error-to" class="gem-c-error-message govuk-error-message">' +
    '<span class="govuk-visually-hidden">Error:</span> Enter a real date</span>' +
    '<input name="public_timestamp[to]" value="" class="gem-c-input govuk-input govuk-input--error" id="public_timestamp[to]" ' +
    'type="text" aria-describedby="hint-3626790f error-to" aria-controls="js-search-results-info">' +
    '</div></div>')
    var responseWithDateErrors = {
      errors: {
        public_timestamp: {
          from: true,
          to: false
        }
      }
    }
    beforeEach(function () {
      $form.append($filterDateBlock)
      liveSearch = new GOVUK.LiveSearch({ $form: $form[0], $results: $results[0], $atomAutodiscoveryLink: $atomAutodiscoveryLink[0] })
    })

    afterEach(function () {
      $form.remove()
    })

    it('calls renderErrorMessage function if a key in JSON property public_timestamp_errors is true', function () {
      liveSearch.state = { search: 'state' }
      spyOn(liveSearch, 'renderErrorMessage')
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect(liveSearch.renderErrorMessage).toHaveBeenCalled()
    })

    it('calls removeErrorMessage function if a key in JSON property public_timestamp_errors is false', function () {
      liveSearch.state = { search: 'state' }
      spyOn(liveSearch, 'removeErrorMessage')
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect(liveSearch.removeErrorMessage).toHaveBeenCalled()
    })

    it('adds the error class to the element where the JSON error property is set to true', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect($('input[name*="[from]"]').hasClass('govuk-input--error')).toBe(true)
    })

    it('adds the error message to the element where the JSON error property is set to true', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect($form.find('.govuk-form-group:eq(0) .govuk-error-message').length).toBe(1)
    })

    it('adds the error class to the form group of the element where the JSON error property is set to true', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect($form.find('.govuk-form-group:eq(0)').hasClass('govuk-form-group--error')).toBe(true)
    })

    it('removes the error class to the element where the JSON error property is set to false', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect($('input[name*="[to]"]').hasClass('govuk-input--error')).toBe(false)
    })

    it('removes the error message to the element where the JSON error property is set to false', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect($form.find('.govuk-form-group:eq(1) .govuk-error-message').length).toBe(0)
    })

    it('removes the error class from the form group of the element where the JSON error property is set to false', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(responseWithDateErrors, $.param(liveSearch.state))
      expect($form.find('.govuk-form-group:eq(1)').hasClass('govuk-form-group--error')).toBe(false)
    })
  })

  describe('on mobile viewport', function () {
    var $filterButtonOnMobile = $(
      '<button class="app-c-button-as-link app-mobile-filters-link js-show-mobile-filters">' +
        'Filter <span class="govuk-visually-hidden"> results</span>' +
        '<span class="js-selected-filter-count"></span>' +
      '</button>')
    var dummyResponse = {
      display_total: 1,
      display_selected_facets_count: '(6)<span class="govuk-visually-hidden"> filters currently selected</span>'
    }

    beforeEach(function () {
      $form.append($filterButtonOnMobile)
      liveSearch = new GOVUK.LiveSearch({ $form: $form[0], $results: $results[0], $atomAutodiscoveryLink: $atomAutodiscoveryLink[0] })
    })

    afterEach(function () {
      $form.remove()
    })

    it('should update the count in the "Filter" button with the number of currently selected filters', function () {
      liveSearch.state = { search: 'state' }
      liveSearch.displayResults(dummyResponse, $.param(liveSearch.state))
      expect($('.js-selected-filter-count').html()).toBe('(6)<span class="govuk-visually-hidden"> filters currently selected</span>')
    })
  })

  describe('GA4 tracking', function () {
    beforeEach(function () {
      agreeToCookies()

      liveSearch = new GOVUK.LiveSearch({ $form: $form[0], $results: $results[0], $atomAutodiscoveryLink: $atomAutodiscoveryLink[0] })
      liveSearch.state = { search: 'state' }

      spyOn(window.GOVUK.analyticsGa4.Ga4FinderTracker, 'trackChangeEvent')
    })

    afterEach(function () {
      $form.remove()
    })

    it('calls GA4 finder tracker on form update when data-ga4-change-category exists on the target', function () {
      var $input = $form.find('input[name="field"]')
      $input.attr('data-ga4-change-category', 'update-filter checkbox')

      liveSearch.state = []

      liveSearch.formChange({ target: $input[0] })
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: '{"total":81,"display_total":"81 reports","facet_tags":"","search_results":"","display_selected_facets_count":"","sort_options_markup":"","next_and_prev_links":"","suggestions":"","errors":{}}'
      })

      expect(window.GOVUK.analyticsGa4.Ga4FinderTracker.trackChangeEvent).toHaveBeenCalled()
    })

    it('ignores GA4 finder tracker on form update without an event target', function () {
      liveSearch.state = []

      liveSearch.formChange()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: '{"total":81,"display_total":"81 reports","facet_tags":"","search_results":"","display_selected_facets_count":"","sort_options_markup":"","next_and_prev_links":"","suggestions":"","errors":{}}'
      })

      expect(window.GOVUK.analyticsGa4.Ga4FinderTracker.trackChangeEvent).not.toHaveBeenCalled()
    })

    it('ignores GA4 finder tracker on form update without data-ga4-change-category on the event target', function () {
      var $input = $form.find('input[name="field"]')

      liveSearch.state = []

      liveSearch.formChange({ target: $input[0] })
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: '{"total":81,"display_total":"81 reports","facet_tags":"","search_results":"","display_selected_facets_count":"","sort_options_markup":"","next_and_prev_links":"","suggestions":"","errors":{}}'
      })

      expect(window.GOVUK.analyticsGa4.Ga4FinderTracker.trackChangeEvent).not.toHaveBeenCalled()
    })

    it('ignores GA4 finder tracker if cookies are rejected', function () {
      denyCookies()

      var $input = $form.find('input[name="field"]')
      $input.attr('data-ga4-change-category', 'update-filter checkbox')

      liveSearch.state = []

      liveSearch.formChange({ target: $input[0] })
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: '{"total":81,"display_total":"81 reports","facet_tags":"","search_results":"","display_selected_facets_count":"","sort_options_markup":"","next_and_prev_links":"","suggestions":"","errors":{}}'
      })

      expect(window.GOVUK.analyticsGa4.Ga4FinderTracker.trackChangeEvent).not.toHaveBeenCalled()
    })
  })
})
