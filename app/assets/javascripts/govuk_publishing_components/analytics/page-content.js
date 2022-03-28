/* global GOVUK */

(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var PageContent = function () { }

  PageContent.getNumberOfSections = function () {
    switch (true) {
      case isNavigationGridPage():
        return 1 + document.querySelectorAll('.parent-topic-contents').length
      case isNavigationAccordionPage():
        return document.querySelectorAll('[data-track-count="accordionSection"]').length
      case isDocumentCollectionPage():
        return document.querySelectorAll('.document-collection .group-title').length
      case isNewBrowsePage():
        return document.querySelectorAll('[data-track-count="cardList"]').length
      case isMainstreamBrowsePage():
        return countVisible(document.querySelectorAll('#subsection ul')) || document.querySelectorAll('#section ul').length || document.querySelectorAll('#root ul').length
      case isTopicPage():
        return document.querySelectorAll('.topics-page nav.index-list').length
      case isPolicyAreaPage():
        return document.querySelectorAll('.topic section h1.label').length
      case isFinderPage():
      case isWhitehallFinderPage():
      case isNavigationLeafPage():
        // The default in finders should be one, so it's comparable with A-Z
        // lists in other navigation pages. Request made by performance
        // analysts.
        return 1
      default:
        // It's a content page, not a "finding" page
        var sidebarSections = document.querySelectorAll('[data-track-count="sidebarRelatedItemSection"]').length
        var sidebarTaxons = document.querySelectorAll('[data-track-count="sidebarTaxonSection"]').length

        return sidebarSections || sidebarTaxons
    }
  }

  PageContent.getNumberOfLinks = function () {
    switch (true) {
      case isNavigationGridPage():
        return document.querySelectorAll('a[data-track-category="navGridLinkClicked"]').length +
          document.querySelectorAll('a[data-track-category="navGridLeafLinkClicked"]').length
      case isNavigationAccordionPage():
        return document.querySelectorAll('a[data-track-category="navAccordionLinkClicked"]').length
      case isDocumentCollectionPage():
        return document.querySelectorAll('.document-collection .group-document-list li a').length
      case isNewBrowsePage():
        return document.querySelectorAll('[data-track-count="cardLink"]').length
      case isMainstreamBrowsePage():
        return countVisible(document.querySelectorAll('#subsection ul a')) || document.querySelectorAll('#section ul a').length || document.querySelectorAll('#root ul a').length
      case isTopicPage():
        return document.querySelectorAll('.topics-page .index-list ul a').length ||
          document.querySelectorAll('.topics-page .topics ul a').length
      case isPolicyAreaPage():
        return document.querySelectorAll('section.document-block a').length +
          document.querySelectorAll('section .collection-list h2 a').length
      case isFinderPage():
        return document.querySelectorAll('.finder-frontend-content li.document a').length
      case isWhitehallFinderPage():
        return document.querySelectorAll('.document-list .document-row h3 a').length
      case isNavigationLeafPage():
        return document.querySelectorAll('a[data-track-category="navLeafLinkClicked"]').length
      default:
        // It's a content page, not a "finding" page, count related links
        return document.querySelectorAll('a[data-track-category="relatedLinkClicked"]').length
    }
  }

  var metaApplicationSelector = 'meta[name="govuk:rendering-application"]'
  var metaFormatSelector = 'meta[name="govuk:format"]'
  var metaNavigationTypeSelector = 'meta[name="govuk:navigation-page-type"]'
  var metaSectionSelector = 'meta[name="govuk:section"]'

  function getMetaAttribute (selector) {
    var element = document.querySelector(selector)
    if (element) {
      return element.getAttribute('content').toLowerCase()
    }
  }

  function isNavigationGridPage () {
    return getMetaAttribute(metaApplicationSelector) === 'collections' &&
      getMetaAttribute(metaFormatSelector) === 'taxon' &&
      getMetaAttribute(metaNavigationTypeSelector) === 'grid'
  }

  function isNavigationAccordionPage () {
    return getMetaAttribute(metaApplicationSelector) === 'collections' &&
      getMetaAttribute(metaFormatSelector) === 'taxon' &&
      getMetaAttribute(metaNavigationTypeSelector) === 'accordion'
  }

  function isNavigationLeafPage () {
    return getMetaAttribute(metaApplicationSelector) === 'collections' &&
      getMetaAttribute(metaFormatSelector) === 'taxon' &&
      getMetaAttribute(metaNavigationTypeSelector) === 'leaf'
  }

  function isNewBrowsePage () {
    return getMetaAttribute(metaApplicationSelector) === 'collections' &&
      getMetaAttribute(metaSectionSelector) === 'new_browse_page' &&
      getMetaAttribute(metaFormatSelector) === 'mainstream_browse_page'
  }

  function isMainstreamBrowsePage () {
    return getMetaAttribute(metaApplicationSelector) === 'collections' &&
      getMetaAttribute(metaFormatSelector) === 'mainstream_browse_page'
  }

  function isTopicPage () {
    return getMetaAttribute(metaApplicationSelector) === 'collections' &&
      getMetaAttribute(metaFormatSelector) === 'topic'
  }

  function isPolicyAreaPage () {
    return getMetaAttribute(metaApplicationSelector) === 'whitehall' &&
      getMetaAttribute(metaFormatSelector) === 'placeholder_policy_area'
  }

  function isDocumentCollectionPage () {
    return getMetaAttribute(metaApplicationSelector) === 'government-frontend' &&
      getMetaAttribute(metaFormatSelector) === 'document_collection'
  }

  function isFinderPage () {
    return getMetaAttribute(metaApplicationSelector) === 'finder-frontend' &&
      getMetaAttribute(metaFormatSelector) === 'finder'
  }

  function isWhitehallFinderPage () {
    return getMetaAttribute(metaApplicationSelector) === 'whitehall' &&
      getMetaAttribute(metaFormatSelector) === 'finder'
  }

  function countVisible (elements) {
    var count = 0
    for (var i = 0; i < elements.length; i++) {
      var style = window.getComputedStyle(elements[i])
      if (!(style.display === 'none' || style.visibility === 'hidden')) {
        count++
      }
    }
    return count
  }

  GOVUK.PageContent = PageContent
})()
