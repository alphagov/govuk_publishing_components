/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('GOVUK.StaticAnalytics', function () {
  var analytics

  beforeEach(function () {
    window.GOVUK.setConsentCookie({ usage: true })
    if (typeof window.ga === 'undefined') {
      window.ga = function () {}
    }
    spyOn(window, 'ga')
    spyOn(GOVUK.analyticsPlugins, 'printIntent')
    spyOn(GOVUK.analyticsPlugins, 'error')

    analytics = new GOVUK.StaticAnalytics({
      universalId: 'universal-id',
      cookieDomain: '.www.gov.uk'
    })
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  describe('when created', function () {
    var pageViewObject

    beforeEach(function () {
      pageViewObject = getPageViewObject()
    })

    it('configures a universal tracker', function () {
      expect(window.ga).toHaveBeenCalledWith('create', 'universal-id', { cookieDomain: '.www.gov.uk' })
    })

    it('sets the device pixel ratio', function () {
      expect(Object.keys(pageViewObject)).toContain('dimension11')
    })

    it('sets the HTTP status code', function () {
      expect(Object.keys(pageViewObject)).toContain('dimension15')
    })

    it('tracks a pageview in universal', function () {
      expect(window.ga).toHaveBeenCalledWith('send', 'pageview', pageViewObject)
    })

    it('begins print tracking', function () {
      expect(GOVUK.analyticsPlugins.printIntent).toHaveBeenCalled()
    })

    it('begins error tracking', function () {
      expect(GOVUK.analyticsPlugins.error).toHaveBeenCalled()
    })

    describe('when there are govuk: meta tags', function () {
      beforeEach(function () {
        window.ga.calls.reset()
      })

      afterEach(function () {
        $('head').find('meta[name^="govuk:"]').remove()
      })

      it('sets A/B meta tags as dimensions', function () {
        $('head').append(
          '<meta name="govuk:ab-test" content="name-of-test:name-of-ab-bucket" data-analytics-dimension="42">' +
          '<meta name="govuk:ab-test" content="name-of-other-test:name-of-other-ab-bucket" data-analytics-dimension="48">'
        )

        analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
        pageViewObject = getPageViewObject()

        expect(pageViewObject.dimension42).toEqual('name-of-test:name-of-ab-bucket')
        expect(pageViewObject.dimension48).toEqual('name-of-other-test:name-of-other-ab-bucket')
      })

      it('sets the search autocomplete status as dimension 21', function () {
        $('head').append(
          '<meta name="govuk:search-autocomplete-status" content="used">'
        )

        analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
        pageViewObject = getPageViewObject()

        expect(pageViewObject.dimension21).toEqual('used')
      })

      it('sets the spelling suggestion as dimension 81', function () {
        $('head').append(
          '<meta name="govuk:spelling-suggestion" content="driving">'
        )

        analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
        pageViewObject = getPageViewObject()

        expect(pageViewObject.dimension81).toEqual('driving')
      })

      it('ignores A/B meta tags with invalid dimensions', function () {
        $('head').append(
          '<meta name="govuk:ab-test" content="name-of-test:some-bucket">' +
          '<meta name="govuk:ab-test" content="name-of-test:some-other-bucket" data-analytics-dimension="not a number">'
        )

        analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
        pageViewObject = getPageViewObject()

        // 1. check the dimensions haven't been created by using the "value" of data-analytics-dimension
        var expected = Object.prototype.hasOwnProperty.call(pageViewObject, 'dimensionnot a number')
        expect(expected).toEqual(false)
        expected = Object.prototype.hasOwnProperty.call(pageViewObject, 'dimensionundefined')
        expect(expected).toEqual(false)

        // 2. check the values haven't been used at all
        var values = []
        for (var key in pageViewObject) {
          values.push(pageViewObject[key])
        }
        expect(values).not.toContain('name-of-test:some-bucket')
        expect(values).not.toContain('name-of-test:some-other-bucket')
      });

      [
        {
          name: 'themes',
          number: 3,
          defaultValue: 'other'
        },
        {
          name: 'navigation-page-type',
          number: 32,
          defaultValue: 'none'
        },
        {
          name: 'content-id',
          number: 4,
          defaultValue: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: 'taxon-slug',
          number: 56,
          defaultValue: 'other'
        },
        {
          name: 'taxon-id',
          number: 57,
          defaultValue: 'other'
        },
        {
          name: 'taxon-slugs',
          number: 58,
          defaultValue: 'other'
        },
        {
          name: 'taxon-ids',
          number: 59,
          defaultValue: 'other'
        },
        {
          name: 'navigation-legacy',
          number: 30,
          defaultValue: 'none'
        },
        {
          name: 'withdrawn',
          number: 12,
          defaultValue: 'not withdrawn'
        },
        {
          name: 'content-has-history',
          number: 39,
          defaultValue: 'false'
        }
      ].forEach(function (dimension) {
        it('sets the ' + dimension.name + ' dimension from a meta tag if present', function () {
          $('head').append(
            '<meta name="govuk:' + dimension.name + '" content="some-' + dimension.name + '-value">'
          )

          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()

          expect(pageViewObject['dimension' + dimension.number]).toEqual('some-' + dimension.name + '-value')
        })

        it('sets the default dimension if no ' + dimension.name + ' meta tag is present', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()

          expect(pageViewObject['dimension' + dimension.number]).toEqual(dimension.defaultValue)
        })
      });

      [
        {
          name: 'section',
          number: 1
        },
        {
          name: 'format',
          number: 2
        },
        {
          name: 'search-result-count',
          number: 5
        },
        {
          name: 'publishing-government',
          number: 6
        },
        {
          name: 'political-status',
          number: 7
        },
        {
          name: 'analytics:organisations',
          number: 9
        },
        {
          name: 'analytics:world-locations',
          number: 10
        },
        {
          name: 'schema-name',
          number: 17
        },
        {
          name: 'rendering-application',
          number: 20
        }
      ].forEach(function (dimension) {
        it('sets the ' + dimension.name + ' dimension from a meta tag if present', function () {
          $('head').append(
            '<meta name="govuk:' + dimension.name + '" content="some-' + dimension.name + '-value">'
          )

          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()

          expect(pageViewObject['dimension' + dimension.number]).toEqual('some-' + dimension.name + '-value')
        })

        it('does not send the dimension if no ' + dimension.name + ' meta tag is present', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()

          var expected = Object.prototype.hasOwnProperty.call(pageViewObject, 'dimension' + dimension.number)
          expect(expected).toEqual(false)
        })
      })
    })

    describe('setting custom dimensions based on elements of the page', function () {
      describe('on a page with a normal sidebar', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="government-frontend">' +
              '<meta name="govuk:format" content="transaction">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<aside class="govuk-related-items">' +
                '<h2 data-track-count="sidebarRelatedItemSection">Section 1</h2>' +
                '<nav role="navigation">' +
                  '<ul>' +
                    '<li>' +
                      '<a data-track-category="relatedLinkClicked">' +
                        'Link 1.1' +
                      '</a>' +
                    '</li>' +
                    '<li>' +
                      '<a data-track-category="relatedLinkClicked">' +
                        'Link 1.2' +
                      '</a>' +
                    '</li>' +
                  '</ul>' +
                '</nav>' +
                '<h2 data-track-count="sidebarRelatedItemSection">Section 2</h2>' +
                '<nav role="navigation">' +
                  '<ul>' +
                    '<li>' +
                      '<a data-track-category="relatedLinkClicked">' +
                        'Link 2.1' +
                      '</a>' +
                    '</li>' +
                  '</ul>' +
                '</nav>' +
              '</aside>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sidebar sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('2')
        })

        it('tracks the total number of related links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('3')
        })
      })

      describe('on a page with a taxon sidebar', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="government-frontend">' +
              '<meta name="govuk:format" content="transaction">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<aside class="govuk-taxonomy-sidebar">' +
                '<div class="sidebar-taxon" data-track-count="sidebarTaxonSection">' +
                  '<h2><a href data-track-category="relatedLinkClicked">Section 1</a></h2>' +
                  '<nav role="navigation">' +
                    '<ul>' +
                      '<li>' +
                        '<a href data-track-category="relatedLinkClicked">' +
                          'Link 1.1' +
                        '</a>' +
                      '</li>' +
                      '<li>' +
                        '<a href data-track-category="relatedLinkClicked">' +
                          'Link 1.2' +
                        '</a>' +
                      '</li>' +
                    '</ul>' +
                  '</nav>' +
                '</div>' +
                '<div class="sidebar-taxon" data-track-count="sidebarTaxonSection">' +
                  '<h2><a href data-track-category="relatedLinkClicked">Section 2</a></h2>' +
                  '<nav role="navigation">' +
                    '<ul>' +
                      '<li>' +
                        '<a href data-track-category="relatedLinkClicked">' +
                          'Link 2.1' +
                        '</a>' +
                      '</li>' +
                    '</ul>' +
                  '</nav>' +
                '</div>' +
              '</aside>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sidebar sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('2')
        })

        it('tracks the total number of related links, including headers', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('5')
        })
      })

      describe('on a page with an accordion', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="collections">' +
              '<meta name="govuk:navigation-page-type" content="accordion">' +
              '<meta name="govuk:format" content="taxon">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<div class="accordion-with-descriptions">' +
                '<div class="subsection-wrapper">' +
                  '<div class="subsection" data-track-count="accordionSection">' +
                    '<div class="subsection-header">' +
                      '<a href><h2>Section 1</h2></a>' +
                    '</div>' +
                    '<div class="subsection-content">' +
                      '<ol>' +
                        '<li>' +
                          '<a href data-track-category="navAccordionLinkClicked">' +
                            'Link 1.1' +
                          '</a>' +
                        '</li>' +
                        '<li>' +
                          '<a href data-track-category="navAccordionLinkClicked">' +
                            'Link 1.2' +
                          '</a>' +
                        '</li>' +
                      '</ol>' +
                    '</div>' +
                  '</div>' +
                  '<div class="subsection" data-track-count="accordionSection">' +
                    '<div class="subsection-header">' +
                      '<a href><h2>Section 2</h2></a>' +
                    '</div>' +
                    '<div class="subsection-content">' +
                      '<ol>' +
                        '<li>' +
                          '<a href data-track-category="navAccordionLinkClicked">' +
                            'Link 2.1' +
                          '</a>' +
                        '</li>' +
                      '</ol>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of accordion sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('2')
        })

        it('tracks the total number of accordion section links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('3')
        })
      })

      describe('on a page with a grid', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="collections">' +
              '<meta name="govuk:navigation-page-type" content="grid">' +
              '<meta name="govuk:format" content="taxon">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<main class="taxon-page">' +
                '<nav role="navigation">' +
                  '<ol>' +
                    '<li>' +
                      '<h2>' +
                        '<a href data-track-category="navGridLinkClicked">Link 1</a>' +
                      '</h2>' +
                    '</li>' +
                    '<li>' +
                      '<h2>' +
                        '<a href data-track-category="navGridLinkClicked">Link 2</a>' +
                      '</h2>' +
                    '</li>' +
                    '<li>' +
                      '<h2>' +
                        '<a href data-track-category="navGridLinkClicked">Link 3</a>' +
                      '</h2>' +
                    '</li>' +
                  '</ol>' +
                '</nav>' +
                '<div class="grid-row">' +
                  '<div class="parent-topic-contents">' +
                    '<div class="topic-content">' +
                      '<h2>Grid leaves</h2>' +
                      '<ol>' +
                        '<li><h2>' +
                          '<a href data-track-category="navGridLeafLinkClicked">' +
                            'Leaf 1' +
                          '</a>' +
                        '</h2></li>' +
                        '<li><h2>' +
                          '<a href data-track-category="navGridLeafLinkClicked">' +
                            'Leaf 2' +
                          '</a>' +
                        '</h2></li>' +
                      '</ol>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</main>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('2')
        })

        it('tracks the total number of grid links and leaf links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('5')
        })
      })

      describe('on a navigation leaf page', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="collections">' +
              '<meta name="govuk:navigation-page-type" content="leaf">' +
              '<meta name="govuk:format" content="taxon">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<div class="topic-content">' +
                '<ol>' +
                  '<li>' +
                    '<h2>' +
                      '<a href data-track-category="navLeafLinkClicked">' +
                        'Link 1' +
                      '</a>' +
                    '</h2>' +
                  '</li>' +
                  '<li>' +
                    '<h2>' +
                      '<a href data-track-category="navLeafLinkClicked">' +
                        'Link 2' +
                      '</a>' +
                    '</h2>' +
                  '</li>' +
                '</ol>' +
              '</div>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('does not track any sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('1')
        })

        it('tracks the total number of leaf links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('2')
        })
      })

      describe('on a policy area page', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="whitehall">' +
              '<meta name="govuk:format" content="placeholder_policy_area">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<div class="topic classification topic">' +
                '<section id="announcements" class="document-block">' +
                  '<h1 class="label">Announcements</h1>' +
                  '<div class="content">' +
                    '<ol class="document-list">' +
                      '<li class="news_article document-row">' +
                        '<h2>' +
                          '<a href="/government/news/news1">' +
                            'Announcement 1' +
                          '</a>' +
                        '</h2>' +
                      '</li>' +
                      '<li class="news_article document-row">' +
                        '<h2>' +
                          '<a href="/government/news/news2">' +
                            'Announcement 2' +
                          '</a>' +
                        '</h2>' +
                      '</li>' +
                    '</ol>' +
                  '</div>' +
                '</section>' +
                '<section class="detailed-guidance">' +
                  '<h1 class="label">Detailed guides</h1>' +
                  '<div class="content">' +
                    '<ol class="collection-list one-column">' +
                      '<li class="detailed_guide topic collection-item">' +
                        '<div class="container">' +
                          '<h2>' +
                            '<a href="/guidance/how-to">' +
                              'How to guidance' +
                            '</a>' +
                          '</h2>' +
                        '</div>' +
                      '</li>' +
                    '</ol>' +
                  '</div>' +
                '</section>' +
              '</div>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('2')
        })

        it('tracks the total number of links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('3')
        })
      })

      describe('on a document collection page', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="government-frontend">' +
              '<meta name="govuk:format" content="document_collection">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<main role="main" id="content" class="document-collection">' +
                '<h3 class="group-title" id="ancient-history">' +
                  'Ancient history' +
                '</h3>' +
                '<ol class="group-document-list">' +
                  '<li class="group-document-list-item">' +
                    '<h3 class="group-document-list-item-title">' +
                      '<a href="conditions-requirements-ancient-history">' +
                        'GCSE (9 to 1) subject-level conditions and requirements for ancient history' +
                      '</a>' +
                    '</h3>' +
                  '</li>' +
                '</ol>' +
                '<h3 class="group-title" id="ancient-languages">' +
                  'Ancient languages' +
                '</h3>' +
                '<ol class="group-document-list">' +
                  '<li class="group-document-list-item">' +
                    '<h3 class="group-document-list-item-title">' +
                      '<a href="/conditions-requirements-ancient-languages">' +
                        'GCSE (9 to 1) subject-level conditions and requirements for ancient languages' +
                      '</a>' +
                    '</h3>' +
                  '</li>' +
                  '<li class="group-document-list-item">' +
                    '<h3 class="group-document-list-item-title">' +
                      '<a href="/guidance-for-ancient-languages">' +
                        'GCSE (9 to 1) subject-level guidance for ancient languages' +
                      '</a>' +
                    '</h3>' +
                  '</li>' +
              '</ol>' +
              '</main>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('2')
        })

        it('tracks the total number of links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('3')
        })
      })

      describe('on a whitehall finder page (e.g Announcements)', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="whitehall">' +
              '<meta name="govuk:format" content="finder">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<ol class="document-list">' +
                '<li class="document-row">' +
                  '<h3>' +
                    '<a href="/government/news/news-article-1">' +
                      'Creative sector receives record boost of £700 million pounds' +
                    '</a>' +
                  '</h3>' +
                '</li>' +
                '<li class="document-row">' +
                  '<h3>' +
                    '<a href="/government/news/news-article-2">' +
                      'Dangerous occurrence at Broad Oak level crossing' +
                    '</a>' +
                  '</h3>' +
                '</li>' +
                '<li class="document-row">' +
                  '<h3>' +
                    '<a href="/government/news/news-article-3">' +
                      'Outbreaks of Koi herpesvirus (KHV) disease in 2017' +
                    '</a>' +
                  '</h3>' +
                '</li>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('1')
        })

        it('tracks the total number of links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('3')
        })
      })

      describe('on a finder page', function () {
        beforeEach(function () {
          $('head').append(
            '<div class="test-meta-tags">' +
              '<meta name="govuk:rendering-application" content="finder-frontend">' +
              '<meta name="govuk:format" content="finder">' +
            '</div>'
          )
          $('body').append(
            '<div class="test-fixture">' +
              '<main id="content" role="main" class="finder-frontend-content">' +
                '<div id="finder-frontend">' +
                  '<div class="filtering">' +
                    '<div class="filtered-results">' +
                      '<div id="js-results">' +
                        '<ul>' +
                          '<li class="document">' +
                            '<h3>' +
                              '<a href="/2012-olympic-and-paralympic-legacy">' +
                                '2012 Olympic and Paralympic legacy' +
                              '</a>' +
                            '</h3>' +
                          '</li>' +
                          '<li class="document">' +
                            '<h3>' +
                              '<a href="/academies-and-free-schools">Academies and free schools</a></h3>' +
                          '</li>' +
                          '<li class="document">' +
                            '<h3><a href="/government/policies/access-to-financial-services">Access to financial services</a></h3>' +
                          '</li>' +
                        '</ul>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</main>' +
            '</div>'
          )
        })

        afterEach(function () {
          $('.test-meta-tags').remove()
          $('.test-fixture').remove()
        })

        it('tracks the number of sections', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension26).toEqual('1')
        })

        it('tracks the total number of links', function () {
          analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
          pageViewObject = getPageViewObject()
          expect(pageViewObject.dimension27).toEqual('3')
        })
      })

      it('sets the page language from the main element as a custom dimension', function () {
        $('.test-fixture').remove()
        $('body').append(
          '<div class="test-fixture">' +
            '<main role="main" id="content" class="document-collection" lang="fr"></main>' +
          '</div>'
        )
        analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
        pageViewObject = getPageViewObject()
        expect(pageViewObject.dimension23).toEqual('fr')
        $('.test-fixture').remove()
      })

      it('sets the page language as "unknown" if the main element has no lang attribute as a custom dimension', function () {
        $('.test-fixture').remove()
        $('body').append(
          '<div class="test-fixture">' +
            '<main role="main" id="content" class="document-collection"></main>' +
          '</div>'
        )
        analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
        pageViewObject = getPageViewObject()
        expect(pageViewObject.dimension23).toEqual('unknown')
        $('.test-fixture').remove()
      })
    })

    it('marks all custom dimensions as PIISafe to avoid breaking data we control by stripping bits out of it', function () {
      var customDimensions = GOVUK.CustomDimensions.customDimensions()

      for (var dimension in customDimensions) {
        expect(customDimensions[dimension] instanceof GOVUK.Analytics.PIISafe).toBeTruthy()
      }
    })
  })

  describe('when there is a TLSversion cookie', function () {
    var pageViewObject

    beforeEach(function () {
      GOVUK.cookie('TLSversion', 'TLSv2')
      window.ga.calls.reset()
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
      pageViewObject = getPageViewObject()
    })

    it('sets the cookie value as the value of the tls version custom dimension', function () {
      expect(pageViewObject.dimension16).toEqual('TLSv2')
    })
  })

  describe('when there is no TLSversion cookie', function () {
    var pageViewObject

    beforeEach(function () {
      GOVUK.cookie('TLSversion', null)
      window.ga.calls.reset()
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
      pageViewObject = getPageViewObject()
    })

    it('sets unknown as the value of the tls version custom dimension', function () {
      expect(pageViewObject.dimension16).toEqual('unknown')
    })
  })

  describe('when the consent cookie has been set', function () {
    beforeEach(function () {
      window.ga.calls.reset()
    })

    it('does not set analytics cookies as normal when usage cookies are allowed', function () {
      window.GOVUK.setConsentCookie({ usage: false })
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })

      expect(Object.keys(analytics).length).toBe(0)
    })

    it('does set analytics cookies as normal when usage cookies are allowed', function () {
      window.GOVUK.setConsentCookie({ usage: true })
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })

      expect(Object.keys(analytics).length).toBe(1)
      expect(analytics.analytics.pii.stripDatePII).toBe(false)
      expect(analytics.analytics.pii.stripPostcodePII).toBe(false)
    })
  })

  describe('when the seen_cookie_message cookie does not exist', function () {
    var pageViewObject

    beforeEach(function () {
      GOVUK.cookie('seen_cookie_message', null)
      window.ga.calls.reset()
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
      pageViewObject = getPageViewObject()
    })

    it('sets dimension100 to true', function () {
      expect(pageViewObject.dimension100).toEqual('true')
    })
  })

  describe('when the cookie banner is displayed on the page', function () {
    var pageViewObject

    beforeEach(function () {
      GOVUK.cookie('seen_cookie_message', 'false')
      window.ga.calls.reset()
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
      pageViewObject = getPageViewObject()
    })

    it('sets dimension100 to true when the cookie banner is shown', function () {
      expect(pageViewObject.dimension100).toEqual('true')
    })
  })

  describe('when the cookie banner is not displayed on the page', function () {
    var pageViewObject

    beforeEach(function () {
      GOVUK.cookie('seen_cookie_message', 'true')
      window.ga.calls.reset()
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
      pageViewObject = getPageViewObject()
    })

    it('sets dimension100 to false when the cookie banner has been dismissed', function () {
      expect(pageViewObject.dimension100).toEqual('false')
    })
  })

  describe('when tracking pageviews and events', function () {
    it('tracks them in universal', function () {
      analytics.trackPageview('/path', 'Title')
      var trackingArguments = window.ga.calls.mostRecent().args
      expect(trackingArguments[0]).toEqual('send')
      expect(trackingArguments[1]).toEqual('pageview')
      expect(trackingArguments[2].page).toEqual('/path')
      expect(trackingArguments[2].title).toEqual('Title')

      analytics.trackEvent('category', 'action')

      var lastArguments = window.ga.calls.mostRecent().args
      expect(lastArguments[0]).toEqual('send')

      var trackingOptions = lastArguments[1]
      expect(trackingOptions.hitType).toEqual('event')
      expect(trackingOptions.eventCategory).toEqual('category')
      expect(trackingOptions.eventAction).toEqual('action')
    })
  })

  describe('when tracking social media shares', function () {
    it('tracks them in universal', function () {
      analytics.trackShare('network')

      var lastArguments = window.ga.calls.mostRecent().args
      expect(lastArguments[0]).toEqual('send')

      var trackingOptions = lastArguments[1]
      expect(trackingOptions.hitType).toEqual('social')
      expect(trackingOptions.socialNetwork).toEqual('network')
      expect(trackingOptions.socialAction).toEqual('share')
      expect(trackingOptions.socialTarget).toEqual(jasmine.any(String))
    })
  })

  describe('when setting an options object for the next pageview', function () {
    beforeEach(function () {
      analytics.setCookie('analytics_next_page_call', null)
    })

    it('sets a cookie with the options', function () {
      analytics.setOptionsForNextPageview({ dimension99: 'Test' })
      expect(analytics.getCookie('analytics_next_page_call')).toEqual({ dimension99: 'Test' })
    })

    it('sets a cookie with the options when set sequentially', function () {
      analytics.setOptionsForNextPageview({ dimension1: 'First' })
      analytics.setOptionsForNextPageview({ dimension2: 'Second' })
      expect(analytics.getCookie('analytics_next_page_call')).toEqual({ dimension1: 'First', dimension2: 'Second' })
    })
  })

  describe('when there is a cookie setting options for the next pageview', function () {
    beforeEach(function () {
      analytics.setCookie('analytics_next_page_call', { dimension99: 'Test' })
      window.ga.calls.reset()
      analytics = new GOVUK.StaticAnalytics({ universalId: 'universal-id' })
    })

    it('includes the options for the pageview', function () {
      var pageViewObject = getPageViewObject()
      expect(pageViewObject.dimension99).toEqual('Test')
    })

    it('clears the cookie after being used', function () {
      expect(GOVUK.cookie('analytics_next_page_call')).toBeNull()
    })
  })

  function getPageViewObject () {
    // The execution of trackPageView happens by invoking the bound function
    // in static-analytics.js. The bound function is passed to ga:
    //
    // ga(function (tracker) {
    //   this.gaClientId = tracker.get('clientId')
    //
    //   // Track initial pageview
    //   this.trackPageview(null, null, trackingOptions)
    //
    //   ...
    // }.bind(this))
    //
    // Normally this is triggered automatically by GA, but in Jasmine this function
    // needs to be called manually. We do this below and reload the arguments sent
    // to window.ga in order to obtain the trackPageView args as well.

    // 1. get all arguments to all calls to the ga() function
    var universalSetupArguments = window.ga.calls.allArgs()

    // 2. get the ga(function(tracker) { ...}) call - it's the last one:
    var bound = universalSetupArguments[universalSetupArguments.length - 1][0]

    // 3. trigger the callback with a canned tracker object that has a stubbed
    //    get method that always retuns the same client id.  This is the only
    //    method we expect to call on the tracker object - calling anything
    //    else should cause these specs to fail.
    bound({ get: function () { return '12345.67890' } })

    // 4. get all the calls to ga() again as executing the callback will add a
    //    5th call.  This time it's the one to to send "pageview" which is the
    //    initial page view tracking we're interested in.
    universalSetupArguments = window.ga.calls.allArgs()
    var lastArgumentSet = universalSetupArguments.pop()

    // 5. make sure this final set of arguments is the one we're looking for
    //    and fail the test otherwise.
    expect(lastArgumentSet[0]).toEqual('send')
    expect(lastArgumentSet[1]).toEqual('pageview')

    // 6. extract the arguments to that last call and return them
    var pageViewObject = lastArgumentSet[2]

    return pageViewObject
  }
})
