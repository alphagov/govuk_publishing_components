/* global GOVUK, $ */

(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var PageContent = function () { }

  PageContent.getNumberOfSections = function () {
    switch (true) {
      case isNavigationGridPage():
        return 1 + $('.parent-topic-contents').length
      case isNavigationAccordionPage():
        return $('[data-track-count="accordionSection"]').length
      case isDocumentCollectionPage():
        return $('.document-collection .group-title').length
      case isMainstreamBrowsePage():
        return $('#subsection ul:visible').length || $('#section ul').length
      case isTopicPage():
        return $('.topics-page nav.index-list').length
      case isPolicyAreaPage():
        return $('.topic section h1.label').length
      case isFinderPage():
      case isWhitehallFinderPage():
      case isNavigationLeafPage():
        // The default in finders should be one, so it's comparable with A-Z
        // lists in other navigation pages. Request made by performance
        // analysts.
        return 1
      default:
        // It's a content page, not a "finding" page
        var sidebarSections = $('[data-track-count="sidebarRelatedItemSection"]').length
        var sidebarTaxons = $('[data-track-count="sidebarTaxonSection"]').length

        return sidebarSections || sidebarTaxons
    }
  }

  PageContent.getNumberOfLinks = function () {
    switch (true) {
      case isNavigationGridPage():
        return $('a[data-track-category="navGridLinkClicked"]').length +
          $('a[data-track-category="navGridLeafLinkClicked"]').length
      case isNavigationAccordionPage():
        return $('a[data-track-category="navAccordionLinkClicked"]').length
      case isDocumentCollectionPage():
        return $('.document-collection .group-document-list li a').length
      case isMainstreamBrowsePage():
        return $('#subsection ul a:visible').length ||
          $('#section ul a').length
      case isTopicPage():
        return $('.topics-page .index-list ul a').length ||
          $('.topics-page .topics ul a').length
      case isPolicyAreaPage():
        return $('section.document-block a').length +
          $('section .collection-list h2 a').length
      case isFinderPage():
        return $('.finder-frontend-content li.document a').length
      case isWhitehallFinderPage():
        return $('.document-list .document-row h3 a').length
      case isNavigationLeafPage():
        return $('a[data-track-category="navLeafLinkClicked"]').length
      default:
        // It's a content page, not a "finding" page, count related links
        return $('a[data-track-category="relatedLinkClicked"]').length
    }
  }

  function getRenderingApplication () {
    return $('meta[name="govuk:rendering-application"]').attr('content')
  };

  function getFormat () {
    return $('meta[name="govuk:format"]').attr('content')
  };

  function getNavigationPageType () {
    return $('meta[name="govuk:navigation-page-type"]').attr('content')
  };

  function isNavigationGridPage () {
    return getRenderingApplication() === 'collections' &&
      getFormat() === 'taxon' &&
      getNavigationPageType() === 'grid'
  };

  function isNavigationAccordionPage () {
    return getRenderingApplication() === 'collections' &&
      getFormat() === 'taxon' &&
      getNavigationPageType() === 'accordion'
  };

  function isNavigationLeafPage () {
    return getRenderingApplication() === 'collections' &&
      getFormat() === 'taxon' &&
      getNavigationPageType() === 'leaf'
  };

  function isMainstreamBrowsePage () {
    return getRenderingApplication() === 'collections' &&
      getFormat() === 'mainstream_browse_page'
  };

  function isTopicPage () {
    return getRenderingApplication() === 'collections' &&
      getFormat() === 'topic'
  };

  function isPolicyAreaPage () {
    return getRenderingApplication() === 'whitehall' &&
      getFormat() === 'placeholder_policy_area'
  };

  function isDocumentCollectionPage () {
    return getRenderingApplication() === 'government-frontend' &&
      getFormat() === 'document_collection'
  };

  function isFinderPage () {
    return getRenderingApplication() === 'finder-frontend' &&
      getFormat() === 'finder'
  };

  function isWhitehallFinderPage () {
    return getRenderingApplication() === 'whitehall' &&
      getFormat() === 'finder'
  };

  GOVUK.PageContent = PageContent
})()
