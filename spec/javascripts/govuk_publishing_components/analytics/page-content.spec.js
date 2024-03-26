/* eslint-env jasmine, jquery */

describe('Page content', function () {
  var globalClassName = 'for-testing'

  function createMetaTags (key, value) {
    var metatag = document.createElement('meta')
    metatag.setAttribute('name', 'govuk:' + key)
    metatag.setAttribute('content', value)
    document.getElementsByTagName('head')[0].appendChild(metatag)
  }

  function createDummyElement (elementType, className, id, attribute, attributeValue, parent) {
    var el = document.createElement(elementType)

    if (className) {
      el.setAttribute('class', className)
    }

    if (id) {
      el.setAttribute('id', id)
    }

    if (attribute) {
      el.setAttribute(attribute, attributeValue)
    }

    if (parent) {
      parent.appendChild(el)
    } else {
      document.querySelector('.' + globalClassName).appendChild(el)
    }

    return el
  }

  beforeEach(function () {
    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', globalClassName)
    document.querySelector('body').appendChild(wrapper)
  })

  afterEach(function () {
    var head = document.getElementsByTagName('head')[0]
    var metas = document.querySelectorAll("[name^='govuk']")
    for (var i = 0; i < metas.length; i++) {
      head.removeChild(metas[i])
    }

    var dummyElements = document.querySelector('.' + globalClassName)
    document.querySelector('body').removeChild(dummyElements)
  })

  describe('in a navigation grid page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'collections')
      createMetaTags('format', 'taxon')
      createMetaTags('navigation-page-type', 'grid')
    })

    it('gets the number of sections', function () {
      for (var i = 1; i <= 4; i++) {
        createDummyElement('div', 'parent-topic-contents')
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(5) // getNumberOfSections adds 1 if isNavigationGridPage
    })

    it('gets the number of links', function () {
      for (var i = 1; i <= 3; i++) {
        createDummyElement('a', false, false, 'data-track-category', 'navGridLinkClicked')
      }
      for (var q = 1; q <= 8; q++) {
        createDummyElement('a', false, false, 'data-track-category', 'navGridLeafLinkClicked')
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(11)
    })
  })

  describe('in a navigation accordion page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'collections')
      createMetaTags('format', 'taxon')
      createMetaTags('navigation-page-type', 'accordion')
    })

    it('gets the number of sections', function () {
      for (var i = 1; i <= 17; i++) {
        createDummyElement('div', false, false, 'data-track-count', 'accordionSection')
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(17)
    })

    it('gets the number of links', function () {
      for (var i = 1; i <= 6; i++) {
        createDummyElement('a', false, false, 'data-track-category', 'navAccordionLinkClicked')
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(6)
    })
  })

  describe('in a document collection page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'government-frontend')
      createMetaTags('format', 'document_collection')
    })

    it('gets the number of sections', function () {
      for (var i = 1; i <= 2; i++) {
        createDummyElement('div', 'document-collection')
      }

      var parents = document.querySelectorAll('.document-collection')
      for (var x = 0; x < parents.length; x++) {
        for (var y = 1; y <= 3; y++) {
          createDummyElement('div', 'group-title', false, false, false, parents[x])
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(6)
    })

    it('gets the number of links', function () {
      for (var a = 1; a <= 2; a++) {
        createDummyElement('div', 'document-collection')
      }

      var parents = document.querySelectorAll('.document-collection')
      for (var b = 0; b < parents.length; b++) {
        for (var c = 1; c <= 2; c++) {
          createDummyElement('div', 'group-document-list', false, false, false, parents[b])
        }
      }

      var children = document.querySelectorAll('.group-document-list')
      for (var d = 0; d < children.length; d++) {
        for (var e = 1; e <= 3; e++) {
          createDummyElement('li', false, false, false, false, children[d])
        }
      }

      var grandChildren = document.querySelectorAll('.group-document-list li')
      for (var f = 0; f < grandChildren.length; f++) {
        for (var g = 1; g <= 5; g++) {
          createDummyElement('a', false, false, false, false, grandChildren[f])
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(60)
    })
  })

  describe('in a mainstream browse page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'collections')
      createMetaTags('format', 'mainstream_browse_page')
    })

    it('gets the number of sections in the browse root', function () {
      var parent = createDummyElement('div', false, 'root')

      for (var i = 1; i <= 3; i++) {
        createDummyElement('ul', false, false, false, false, parent)
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(3)
    })

    it('gets the number of sections when there is a browse section', function () {
      var parent = createDummyElement('div', false, 'section')

      for (var i = 1; i <= 7; i++) {
        createDummyElement('ul', false, false, false, false, parent)
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(7)
    })

    it('gets the number of sections when there is a browse subsection', function () {
      var parent = createDummyElement('div', false, 'subsection')
      var el

      for (var i = 1; i <= 3; i++) {
        createDummyElement('ul', false, false, false, false, parent)
      }
      for (var j = 1; j <= 2; j++) {
        el = createDummyElement('ul', false, false, false, false, parent)
        el.style.display = 'none'
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(3)
    })

    it('gets the number of links in the browse root', function () {
      var parent = createDummyElement('div', false, 'section')
      var child

      for (var i = 1; i <= 2; i++) {
        child = createDummyElement('ul', false, false, false, false, parent)
        for (var x = 1; x <= 4; x++) {
          createDummyElement('a', false, false, false, false, child)
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(8)
    })

    it('gets the number of links when there is a browse section', function () {
      var parent = createDummyElement('div', false, 'section')
      var child

      for (var i = 1; i <= 3; i++) {
        child = createDummyElement('ul', false, false, false, false, parent)
        for (var x = 1; x <= 5; x++) {
          createDummyElement('a', false, false, false, false, child)
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(15)
    })

    it('gets the number of links when there is a browse subsection', function () {
      var parent = createDummyElement('div', false, 'subsection')
      var el

      for (var i = 1; i <= 3; i++) {
        createDummyElement('ul', false, false, false, false, parent)
      }

      var grandChildren = document.querySelectorAll('.' + globalClassName + ' ul')
      for (var x = 0; x < grandChildren.length; x++) {
        for (var y = 1; y <= 10; y++) {
          el = createDummyElement('a', false, false, false, false, grandChildren[x])
          if (y % 2 === 0) {
            el.style.display = 'none'
          }
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(15)
    })
  })

  describe('in a policy area page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'whitehall')
      createMetaTags('format', 'placeholder_policy_area')
    })

    it('gets the number of sections', function () {
      for (var p = 1; p <= 3; p++) {
        var parent = createDummyElement('div', 'topic')
        for (var c = 1; c <= 4; c++) {
          var child = createDummyElement('section', false, false, false, false, parent)
          createDummyElement('h1', 'label', false, false, false, child)
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(12)
    })

    it('gets the number of links', function () {
      for (var p = 1; p <= 2; p++) {
        var parent = createDummyElement('section', 'document-block')
        for (var c = 1; c <= 3; c++) {
          createDummyElement('a', false, false, false, false, parent)

          var child = createDummyElement('div', 'collection-list', false, false, false, parent)
          for (var g = 1; g <= 2; g++) {
            var grandChild = createDummyElement('h2', false, false, false, false, child)
            for (var gg = 1; gg <= 3; gg++) {
              createDummyElement('a', false, false, false, false, grandChild)
            }
          }
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(78)
    })
  })

  describe('in a whitehall finder page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'whitehall')
      createMetaTags('format', 'finder')
    })

    it('gets the number of sections', function () {
      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(1)
    })

    it('gets the number of links', function () {
      for (var p = 1; p <= 3; p++) {
        var parent = createDummyElement('div', 'document-list')
        for (var c = 1; c <= 3; c++) {
          var child = createDummyElement('div', 'document-row', false, false, false, parent)
          for (var g = 1; g <= 2; g++) {
            var grandChild = createDummyElement('h3', false, false, false, false, child)
            for (var gg = 1; gg <= 2; gg++) {
              createDummyElement('a', false, false, false, false, grandChild)
            }
          }
        }
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(36)
    })
  })

  describe('in a navigation leaf page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'collections')
      createMetaTags('format', 'taxon')
      createMetaTags('navigation-page-type', 'leaf')
    })

    it('gets the number of sections', function () {
      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(1)
    })

    it('gets the number of links', function () {
      for (var p = 1; p <= 7; p++) {
        createDummyElement('a', false, false, 'data-track-category', 'navLeafLinkClicked')
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(7)
    })
  })

  describe('in a second level browse page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'collections')
      createMetaTags('navigation-page-type', 'browse level 2')
    })

    it('gets the number of accordion sections', function () {
      for (var i = 1; i <= 4; i++) {
        createDummyElement('div', false, false, 'data-track-count', 'accordionSection')
      }
      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(4)
    })

    it('gets the number of links', function () {
      for (var i = 1; i <= 4; i++) {
        createDummyElement('a', false, false, 'data-track-count', 'contentLink')
      }
      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(4)
    })
  })

  // the template used for the two page types is the same
  // so testing only one will test both
  describe('in a browse level 0 or 1 page', function () {
    beforeEach(function () {
      createMetaTags('rendering-application', 'collections')
      createMetaTags('navigation-page-type', 'browse level 0')
      createMetaTags('format', 'mainstream_browse_page')
    })

    it('gets the number of card sections', function () {
      for (var i = 1; i <= 4; i++) {
        createDummyElement('div', false, false, 'data-track-count', 'cardList')
      }
      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(4)
    })

    it('gets the number of card links', function () {
      for (var i = 1; i <= 4; i++) {
        createDummyElement('a', false, false, 'data-track-count', 'cardLink')
      }
      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(4)
    })
  })

  describe('by default', function () {
    it('gets the number of sidebar sections', function () {
      for (var p = 1; p <= 4; p++) {
        createDummyElement('a', false, false, 'data-track-count', 'sidebarRelatedItemSection')
      }
      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(4)
    })

    it('gets the number of sidebar taxons', function () {
      for (var p = 1; p <= 3; p++) {
        createDummyElement('a', false, false, 'data-track-count', 'sidebarTaxonSection')
      }
      var result = window.GOVUK.PageContent.getNumberOfSections()
      expect(result).toEqual(3)
    })

    it('gets the number of links', function () {
      for (var p = 1; p <= 2; p++) {
        createDummyElement('a', false, false, 'data-track-category', 'relatedLinkClicked')
      }

      var result = window.GOVUK.PageContent.getNumberOfLinks()
      expect(result).toEqual(2)
    })
  })
})
