/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('The super header navigation', function () {
  'use strict'

  var container
  var thisModule

  beforeEach(function () {
    container = document.createElement('div')
    container.className = 'js-enabled'
    container.innerHTML =
      '<nav aria-labelledby="super-navigation-menu-heading" class="gem-c-layout-super-navigation-header__content js-module-initialised" data-module="super-navigation-mega-menu" data-super-navigation-mega-menu-module-started="true">' +
          '<h2 id="super-navigation-menu-heading" class="govuk-visually-hidden">' +
              'Navigation menu' +
          '</h2>' +
          '<div class="govuk-width-container gem-c-layout-super-navigation-header__button-width-container">' +
              '<div class="gem-c-layout-super-navigation-header__button-container">' +
                  '<div class="gem-c-layout-super-navigation-header__navigation-item">' +
                      '<a class="gem-c-layout-super-navigation-header__navigation-item-link" data-track-action="menuLink" data-track-category="headerClicked" data-track-label="/browse" data-track-dimension="Menu" data-track-dimension-index="29" href="/browse" hidden="hidden">' +
                          '<span class="gem-c-layout-super-navigation-header__navigation-item-link-inner">' +
                              'Menu' +
                          '</span>' +
                      '</a>' +
                      '<button aria-controls="super-navigation-menu" aria-expanded="false" aria-label="Show navigation menu" class="gem-c-layout-super-navigation-header__navigation-top-toggle-button" data-text-for-hide="Hide navigation menu" data-text-for-show="Show navigation menu" data-toggle-desktop-group="top" data-toggle-mobile-group="top" data-tracking-key="testing" data-ga4-event="{&quot;event_name&quot;:&quot;select_content&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;text&quot;:&quot;Menu&quot;,&quot;index&quot;:1,&quot;index_total&quot;:2,&quot;section&quot;:&quot;Menu&quot;}" id="super-navigation-menu-toggle" type="button">' +
                          '<span class="gem-c-layout-super-navigation-header__navigation-top-toggle-button-inner">Menu</span>' +
                      '</button> </div>' +
                  '<div class="gem-c-layout-super-navigation-header__search-item">' +
                      '<button aria-controls="super-search-menu" aria-expanded="false" aria-label="Show search menu" class="gem-c-layout-super-navigation-header__search-toggle-button" data-text-for-hide="Hide search menu" data-text-for-show="Show search menu" data-toggle-mobile-group="top" data-toggle-desktop-group="top" data-tracking-key="search" id="super-search-menu-toggle" type="button" data-ga4-event="{&quot;event_name&quot;:&quot;select_content&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;text&quot;:&quot;Search&quot;,&quot;index&quot;:2,&quot;index_total&quot;:2,&quot;section&quot;:&quot;Search&quot;}">' +
                          '<span class="govuk-visually-hidden">' +
                              'Search GOV.UK' +
                          '</span>' +
                          '<svg class="gem-c-layout-super-navigation-header__search-toggle-button-link-icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
                              '<circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3"></circle>' +
                              '<line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3"></line>' +
                          '</svg>' +
                          '<span aria-hidden="true" class="gem-c-layout-super-navigation-header__navigation-top-toggle-close-icon" focusable="false">' +
                              '×' +
                          '</span>' +
                      '</button>' +
                      '<a class="gem-c-layout-super-navigation-header__search-item-link" href="/search" hidden="hidden">' +
                          '<span class="govuk-visually-hidden">' +
                              'Search GOV.UK' +
                          '</span>' +
                          '<svg class="gem-c-layout-super-navigation-header__search-item-link-icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
                              '<circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3"></circle>' +
                              '<line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3"></line>' +
                          '</svg>' +
                      '</a>' +
                  '</div>' +
              '</div>' +
          '</div>' +
          '<div id="super-navigation-menu" hidden="" class="gem-c-layout-super-navigation-header__navigation-dropdown-menu">' +
              '<div class="govuk-width-container">' +
                  '<div class="govuk-grid-row gem-c-layout-super-navigation-header__navigation-items">' +
                      '<div class="govuk-grid-column-two-thirds-from-desktop gem-c-layout-super-navigation-header__column--topics">' +
                          '<h3 class="govuk-heading-m gem-c-layout-super-navigation-header__column-header">' +
                              'Topics' +
                          '</h3>' +
                          '<ul class="gem-c-layout-super-navigation-header__navigation-second-items gem-c-layout-super-navigation-header__navigation-second-items--topics">' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/benefits" data-track-dimension="Benefits" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.1&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/benefits">Benefits</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/births-deaths-marriages" data-track-dimension="Births, death, marriages and care" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.2&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/births-deaths-marriages">Births, death, marriages and care</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/business" data-track-dimension="Business and self-employed" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.3&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/business">Business and self-employed</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/childcare-parenting" data-track-dimension="Childcare and parenting" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.4&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/childcare-parenting">Childcare and parenting</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/citizenship" data-track-dimension="Citizenship and living in the UK" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.5&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/citizenship">Citizenship and living in the UK</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/cost-of-living" data-track-dimension="Cost of living support" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.6&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/cost-of-living">Cost of living support</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/justice" data-track-dimension="Crime, justice and the law" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.7&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/justice">Crime, justice and the law</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/disabilities" data-track-dimension="Disabled people" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.8&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/disabilities">Disabled people</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/driving" data-track-dimension="Driving and transport" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.9&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/driving">Driving and transport</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/education" data-track-dimension="Education and learning" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.10&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/education">Education and learning</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/employing-people" data-track-dimension="Employing people" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.11&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/employing-people">Employing people</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/environment-countryside" data-track-dimension="Environment and countryside" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.12&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/environment-countryside">Environment and countryside</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/housing-local-services" data-track-dimension="Housing and local services" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.13&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/housing-local-services">Housing and local services</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/tax" data-track-dimension="Money and tax" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.14&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/tax">Money and tax</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/abroad" data-track-dimension="Passports, travel and living abroad" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.15&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/abroad">Passports, travel and living abroad</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/visas-immigration" data-track-dimension="Visas and immigration" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.16&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/visas-immigration">Visas and immigration</a>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link" data-track-action="topicsLink" data-track-category="headerClicked" data-track-label="/browse/working" data-track-dimension="Working, jobs and pensions" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.1.17&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Topics&quot;}" href="/browse/working">Working, jobs and pensions</a>' +
                              '</li>' +
                          '</ul>' +
                      '</div>' +
                      '<div class="govuk-grid-column-one-third-from-desktop gem-c-layout-super-navigation-header__column--government-activity">' +
                          '<h3 class="govuk-heading-m gem-c-layout-super-navigation-header__column-header">' +
                              'Government activity' +
                          '</h3>' +
                          '<ul class="gem-c-layout-super-navigation-header__navigation-second-items gem-c-layout-super-navigation-header__navigation-second-items--government-activity">' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description" data-track-action="governmentactivityLink" data-track-category="headerClicked" data-track-label="/government/organisations" data-track-dimension="Departments" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.2.1&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Government activity&quot;}" href="/government/organisations">Departments</a>' +
                                  '<p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Departments, agencies and public bodies</p>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description" data-track-action="governmentactivityLink" data-track-category="headerClicked" data-track-label="/search/news-and-communications" data-track-dimension="News" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.2.2&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Government activity&quot;}" href="/search/news-and-communications">News</a>' +
                                  '<p class="gem-c-layout-super-navigation-header__navigation-second-item-description">News stories, speeches, letters and notices</p>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description" data-track-action="governmentactivityLink" data-track-category="headerClicked" data-track-label="/search/guidance-and-regulation" data-track-dimension="Guidance and regulation" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.2.3&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Government activity&quot;}" href="/search/guidance-and-regulation">Guidance and regulation</a>' +
                                  '<p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Detailed guidance, regulations and rules</p>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description" data-track-action="governmentactivityLink" data-track-category="headerClicked" data-track-label="/search/research-and-statistics" data-track-dimension="Research and statistics" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.2.4&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Government activity&quot;}" href="/search/research-and-statistics">Research and statistics</a>' +
                                  '<p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Reports, analysis and official statistics</p>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description" data-track-action="governmentactivityLink" data-track-category="headerClicked" data-track-label="/search/policy-papers-and-consultations" data-track-dimension="Policy papers and consultations" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.2.5&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Government activity&quot;}" href="/search/policy-papers-and-consultations">Policy papers and consultations</a>' +
                                  '<p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Consultations and strategy</p>' +
                              '</li>' +
                              '<li class="gem-c-layout-super-navigation-header__dropdown-list-item">' +
                                  '<a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description" data-track-action="governmentactivityLink" data-track-category="headerClicked" data-track-label="/search/transparency-and-freedom-of-information-releases" data-track-dimension="Transparency" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;1.2.6&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Government activity&quot;}" href="/search/transparency-and-freedom-of-information-releases">Transparency</a>' +
                                  '<p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Data, Freedom of Information releases and corporate reports</p>' +
                              '</li>' +
                          '</ul>' +
                      '</div>' +
                  '</div>' +
              '</div>' +
          '</div>' +
          '<div id="super-search-menu" hidden="hidden" class="gem-c-layout-super-navigation-header__navigation-dropdown-menu">' +
              '<div class="govuk-width-container gem-c-layout-super-navigation-header__search-container gem-c-layout-super-navigation-header__search-items">' +
                  '<h3 class="govuk-visually-hidden">' +
                      'Search' +
                  '</h3>' +
                  '<div class="govuk-grid-row">' +
                      '<div class="govuk-grid-column-full">' +
                          '<form class="gem-c-layout-super-navigation-header__search-form" id="search" action="/search" method="get" role="search" aria-label="Site-wide">' +
                              '<div class="gem-c-search govuk-!-display-none-print  gem-c-search--large gem-c-search--on-white gem-c-search--separate-label" data-module="gem-toggle-input-class-on-focus" data-gem-toggle-input-class-on-focus-module-started="true">' +
                                  '<label for="search-main-a566c535" class="govuk-label govuk-label--m">Search GOV.UK</label>' +
                                  '<div class="gem-c-search__item-wrapper">' +
                                      '<input enterkeyhint="search" class="gem-c-search__item gem-c-search__input js-class-toggle" id="search-main-a566c535" name="q" title="Search" type="search" value="">' +
                                      '<div class="gem-c-search__item gem-c-search__submit-wrapper">' +
                                          '<button class="gem-c-search__submit" type="submit" data-track-category="headerClicked" data-track-action="searchSubmitted" data-track-label="/search/all" data-track-dimension="Search on GOV.UK" data-track-dimension-index="29" data-module="gem-track-click" enterkeyhint="search">' +
                                              'Search' +
                                              '<svg class="gem-c-search__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
                                                  '<circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3"></circle>' +
                                                  '<line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3"></line>' +
                                              '</svg>' +
                                          '</button> </div>' +
                                  '</div>' +
                              '</div>' +
                          '</form>' +
                      '</div>' +
                  '</div>' +
              '</div>' +
          '</div>' +
      '</nav>'

    document.body.appendChild(container)

    var $element = document.querySelector('[data-module="super-navigation-mega-menu"]')
    thisModule = new GOVUK.Modules.SuperNavigationMegaMenu($element)

    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }

    document.body.removeChild(container)
  })

  describe('on both small and large screens', function () {
    beforeEach(function () {
      thisModule.init()
    })

    it('has the initialised class once the JavaScript has run', function () {
      var $module = document.querySelector('[data-module="super-navigation-mega-menu"]')

      expect($module).toHaveClass('js-module-initialised')
    })
  })

  describe('navigation toggle button', function () {
    var $button

    beforeEach(function () {
      thisModule.init()
      $button = document.querySelector('#super-navigation-menu-toggle')
    })

    it('does not have the `hidden` attribute', function () {
      expect($button).not.toHaveAttr('hidden')
    })

    describe('has the correct ARIA attributes', function () {
      it('has `aria-controls` set to "super-navigation-menu"', function () {
        expect($button).toHaveAttr('aria-controls', 'super-navigation-menu')
      })

      it('has `aria-label` set to "Show navigation menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Show navigation menu')
      })

      it('has `aria-expanded` set to false', function () {
        expect($button).toHaveAttr('aria-expanded', 'false')
      })
    })

    describe('updates correctly when clicked once', function () {
      var $button
      var $menu

      beforeEach(function () {
        $button = document.querySelector('#super-navigation-menu-toggle')
        $menu = document.querySelector('#super-navigation-menu')

        $button.click()
      })

      it('opens the menu', function () {
        expect($menu).not.toHaveAttr('hidden')
      })

      it('updates the button’s `aria-expanded` attribute to true', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
      })

      it('updates the button’s `aria-label`', function () {
        var hideLabel = $button.getAttribute('data-text-for-hide')
        expect($button).toHaveAttr('aria-label', hideLabel)
      })

      it('triggers the correct google analytics custom event', function () {
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('headerClicked', 'testingOpened', {
          label: 'none'
        })
      })
    })

    describe('updates correctly when clicked twice', function () {
      var $button
      var $menu

      beforeEach(function () {
        $button = document.querySelector('#super-navigation-menu-toggle')
        $menu = document.querySelector('#super-navigation-menu')

        $button.click()
      })

      it('opens and then closes the menu', function () {
        expect($menu).not.toHaveAttr('hidden')
        $button.click()
        expect($menu).toHaveAttr('hidden')
      })

      it('sets the button’s `aria-expanded` attribute to true, then false', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
        $button.click()
        expect($button).toHaveAttr('aria-expanded', 'false')
      })

      it('sets the button’s `aria-label` attribute to "Hide navigation menu", then "Show navigation menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Hide navigation menu')
        $button.click()
        expect($button).toHaveAttr('aria-label', 'Show navigation menu')
      })

      it('triggers the correct google analytics custom event', function () {
        $button.click()
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('headerClicked', 'testingClosed', {
          label: 'none'
        })
      })
    })

    it('toggles the other menus in its group', function () {
      var $searchButton = document.querySelector('#super-search-menu-toggle')
      var $searchMenu = document.querySelector('#super-search-menu')

      $button.click()

      expect($searchButton).toHaveAttr('aria-expanded', 'false')
      expect($searchButton).toHaveAttr('aria-label', 'Show search menu')
      expect($searchMenu).toHaveAttr('hidden')

      $searchButton.click()

      expect($searchButton).toHaveAttr('aria-expanded', 'true')
      expect($searchButton).toHaveAttr('aria-label', 'Hide search menu')
      expect($searchMenu).not.toHaveAttr('hidden')

      $button.click()

      expect($searchButton).toHaveAttr('aria-expanded', 'false')
      expect($searchButton).toHaveAttr('aria-label', 'Show search menu')
      expect($searchMenu).toHaveAttr('hidden')
    })
  })

  describe('tab key', function () {
    var $navMenuButton
    var $searchMenuButton
    var $navMenu
    var $navLinks
    var $firstNavLink
    var $lastNavLink
    var $searchMenu
    var $searchMenuTabbable
    var $lastSearchMenuTabbable

    beforeEach(function () {
      thisModule.init()
      $navMenuButton = document.querySelector('#super-navigation-menu-toggle')
      $searchMenuButton = document.querySelector('#super-search-menu-toggle')
      $navMenu = document.querySelector('#super-navigation-menu')
      $navLinks = $navMenu.querySelectorAll('li a')
      $firstNavLink = $navLinks[0]
      $lastNavLink = $navLinks[$navLinks.length - 1]
      $searchMenu = document.querySelector('#super-search-menu')
      $searchMenuTabbable = $searchMenu.querySelectorAll('li a, input, button')
      $lastSearchMenuTabbable = $searchMenuTabbable[$searchMenuTabbable.length - 1]
    })

    it('when the Menu button is focussed, the nav menu is open and the tab key is pressed focus moves to the first nav menu link', function () {
      $navMenu.removeAttribute('hidden')
      $navMenuButton.focus()
      window.GOVUK.triggerEvent($navMenuButton, 'keydown', { keyCode: 9, cancelable: true })

      expect(document.activeElement).toEqual($navLinks[0])
    })

    it('when the last nav menu link is focussed and the tab key is pressed focus moves to the search button and the nav menu is closed', function () {
      $navMenu.removeAttribute('hidden')
      $lastNavLink.focus()
      window.GOVUK.triggerEvent($lastNavLink, 'keydown', { keyCode: 9, cancelable: true })

      expect(document.activeElement).toEqual($searchMenuButton)
      expect($navMenu.hasAttribute('hidden')).toEqual(true)
      expect($navMenuButton.getAttribute('aria-expanded')).toEqual('false')
      expect($navMenuButton.getAttribute('aria-label')).toEqual('Show navigation menu')
      expect($navMenuButton.classList).not.toContain('gem-c-layout-super-navigation-header__open-button')
    })

    it('when the first nav menu link is focussed, the nav menu is open and the shift and tab keys are pressed focus moves to the Menu button', function () {
      $navMenu.removeAttribute('hidden')
      $firstNavLink.focus()
      window.GOVUK.triggerEvent($firstNavLink, 'keydown', { keyCode: 9, cancelable: true, shiftKey: true })

      expect(document.activeElement).toEqual($navMenuButton)
    })

    it('when the search button is focussed, the nav menu is open and the shift and tab keys are pressed focus moves to the last nav menu link', function () {
      $navMenu.removeAttribute('hidden')
      $searchMenuButton.focus()
      window.GOVUK.triggerEvent($searchMenuButton, 'keydown', { keyCode: 9, cancelable: true, shiftKey: true })

      expect(document.activeElement).toEqual($lastNavLink)
    })

    it('when the last tabbable element in the search menu is focussed and the tab key is pressed the search menu is closed', function () {
      $searchMenu.removeAttribute('hidden')
      $lastSearchMenuTabbable.focus()
      window.GOVUK.triggerEvent($lastSearchMenuTabbable, 'keydown', { keyCode: 9, cancelable: true })

      expect($searchMenu.hasAttribute('hidden')).toEqual(true)
      expect($searchMenuButton.getAttribute('aria-expanded')).toEqual('false')
      expect($searchMenuButton.getAttribute('aria-label')).toEqual('Show search menu')
      expect($searchMenuButton.classList).not.toContain('gem-c-layout-super-navigation-header__open-button')
    })
  })

  describe('escape key', function () {
    var $navMenu
    var $navMenuButton
    var $searchMenu
    var $searchMenuButton

    beforeEach(function () {
      thisModule.init()
      $navMenu = document.querySelector('#super-navigation-menu')
      $navMenuButton = document.querySelector('#super-navigation-menu-toggle')
      $searchMenu = document.querySelector('#super-search-menu')
      $searchMenuButton = document.querySelector('#super-search-menu-toggle')
    })

    it('when the user presses the escape key and the nav menu is open the menu is closed and focus moves back to the Menu button', function () {
      $navMenu.removeAttribute('hidden')
      $navMenuButton.setAttribute('aria-expanded', 'true')
      window.GOVUK.triggerEvent($navMenu, 'keydown', { keyCode: 27, cancelable: true })

      expect($navMenu.hasAttribute('hidden')).toEqual(true)
      expect(document.activeElement).toEqual($navMenuButton)
      expect($navMenuButton.getAttribute('aria-expanded')).toEqual('false')
      expect($navMenuButton.getAttribute('aria-label')).toEqual('Show navigation menu')
      expect($navMenuButton.classList).not.toContain('gem-c-layout-super-navigation-header__open-button')
    })

    it('when the user presses the escape key and the search menu is open the menu is closed and focus moves back to the Search button', function () {
      $searchMenu.removeAttribute('hidden')
      $searchMenuButton.setAttribute('aria-expanded', 'true')
      $searchMenuButton.classList.add('gem-c-layout-super-navigation-header__open-button')
      window.GOVUK.triggerEvent($searchMenu, 'keydown', { keyCode: 27, cancelable: true })

      expect($searchMenu.hasAttribute('hidden')).toEqual(true)
      expect(document.activeElement).toEqual($searchMenuButton)
      expect($searchMenuButton.getAttribute('aria-expanded')).toEqual('false')
      expect($searchMenuButton.getAttribute('aria-label')).toEqual('Show search menu')
      expect($searchMenuButton.classList).not.toContain('gem-c-layout-super-navigation-header__open-button')
    })
  })

  describe('search toggle button', function () {
    var $button

    beforeEach(function () {
      thisModule.init()
      $button = document.querySelector('#super-search-menu-toggle')
    })

    it('does not have the `hidden` attribute', function () {
      expect($button).not.toHaveAttr('hidden')
    })

    describe('has the correct ARIA attributes', function () {
      it('has `aria-controls` set to "super-search-menu"', function () {
        expect($button).toHaveAttr('aria-controls', 'super-search-menu')
      })

      it('has `aria-label` set to "Show search menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Show search menu')
      })

      it('has `aria-expanded` set to false', function () {
        expect($button).toHaveAttr('aria-expanded', 'false')
      })
    })

    describe('updates correctly when clicked once', function () {
      var $button
      var $menu

      beforeEach(function () {
        $button = document.querySelector('#super-search-menu-toggle')
        $menu = document.querySelector('#super-search-menu')

        $button.click()
      })

      it('opens the menu', function () {
        expect($menu).not.toHaveAttr('hidden')
      })

      it('updates the button’s `aria-expanded` attribute to true', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
      })

      it('updates the button’s `aria-label`', function () {
        var hideLabel = $button.getAttribute('data-text-for-hide')
        expect($button).toHaveAttr('aria-label', hideLabel)
      })
    })

    describe('updates correctly when clicked twice', function () {
      var $button
      var $menu

      beforeEach(function () {
        $button = document.querySelector('#super-search-menu-toggle')
        $menu = document.querySelector('#super-search-menu')

        $button.click()
      })

      it('opens and then closes the menu', function () {
        expect($menu).not.toHaveAttr('hidden')
        $button.click()
        expect($menu).toHaveAttr('hidden')
      })

      it('sets the button’s `aria-expanded` attribute to true, then false', function () {
        expect($button).toHaveAttr('aria-expanded', 'true')
        $button.click()
        expect($button).toHaveAttr('aria-expanded', 'false')
      })

      it('sets the button’s `aria-label` attribute to "Hide search menu", then "Show search menu"', function () {
        expect($button).toHaveAttr('aria-label', 'Hide search menu')
        $button.click()
        expect($button).toHaveAttr('aria-label', 'Show search menu')
      })
    })

    it('toggles the other menus in its group', function () {
      var $navigationButton = document.querySelector('#super-navigation-menu-toggle')
      var $navigationMenu = document.querySelector('#super-navigation-menu')

      $button.click()

      expect($navigationButton).toHaveAttr('aria-expanded', 'false')
      expect($navigationButton).toHaveAttr('aria-label', 'Show navigation menu')
      expect($navigationMenu).toHaveAttr('hidden')

      $navigationButton.click()

      expect($navigationButton).toHaveAttr('aria-expanded', 'true')
      expect($navigationButton).toHaveAttr('aria-label', 'Hide navigation menu')
      expect($navigationMenu).not.toHaveAttr('hidden')

      $button.click()

      expect($navigationButton).toHaveAttr('aria-expanded', 'false')
      expect($navigationButton).toHaveAttr('aria-label', 'Show navigation menu')
      expect($navigationMenu).toHaveAttr('hidden')
    })
  })
})
