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
    '<header role="banner" class="gem-c-layout-super-navigation-header gem-c-layout-super-navigation-header--blue-background" data-module="gem-track-click ga4-event-tracker ga4-link-tracker" data-track-links-only="" data-ga4-expandable="" data-gem-track-click-module-started="true" data-ga4-event-tracker-module-started="true" data-ga4-link-tracker-module-started="true">' +
      '<div class="gem-c-layout-super-navigation-header__container govuk-clearfix">' +
        '<div class="govuk-width-container">' +
          '<div class="gem-c-layout-super-navigation-header__header-logo gem-c-layout-super-navigation-header__header-logo--large-navbar">' +
            '<a class="govuk-header__link govuk-header__link--homepage gem-c-header__link--large-navbar" data-track-action="logoLink" data-track-category="headerClicked" data-track-label="http://www.dev.gov.uk" data-track-dimension="GOV.UK" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;external&quot;:&quot;false&quot;,&quot;text&quot;:&quot;GOV.UK&quot;,&quot;section&quot;:&quot;Logo&quot;,&quot;index_link&quot;:1,&quot;index_section&quot;:0,&quot;index_section_count&quot;:2,&quot;index_total&quot;:1}" id="logo" aria-label="Go to the GOV.UK homepage" href="http://www.dev.gov.uk">' +
                '<span class="govuk-visually-hidden">' +
                  'GOV.UK' +
                '</span>' +
                '<span class="govuk-header__logotype">' +
                  '<!--[if gt IE 8]><!-->' +
                  '<svg aria-hidden="true" class="govuk-header__logotype-crown gem-c-layout-super-navigation-header__logotype-crown gem-c-layout-super-navigation-header__logotype-crown--large-navbar" height="30" width="36" focusable="false" viewBox="0 0 132 97" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z" fill="currentColor" fill-rule="evenodd">' +
                    '</path>' +
                  '</svg>' +
                  '<!--<![endif]-->' +
                  '<!--[if IE 8]>' +
                    '<img src="/assets/static/govuk-logotype-crown-66ad9a9b8fca42cf0ba18979eef6afc2e8056d5f158ca9b27ce9afdf852aae87.png" alt="" class="govuk-header__logotype-crown-fallback-image" width="36" height="32">' +
                  '<![endif]-->' +
                '</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
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
                      '<div class="govuk-grid-row">' +
                          '<div class="govuk-grid-column-full">' +
                              '<h3 class="govuk-heading-m">Popular on GOV.UK</h3>' +
                              '<ul class="govuk-list">' +
                                  '<li class="gem-c-layout-super-navigation-header__popular-item">' +
                                      '<a class="govuk-link gem-c-layout-super-navigation-header__popular-link" data-track-action="popularLink" data-track-category="headerClicked" data-track-label="/check-benefits-financial-support" data-track-dimension="Check benefits and financial support you can get" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;2.2.1&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Popular on GOV.UK&quot;}" href="/check-benefits-financial-support">Check benefits and financial support you can get</a>' +
                                  '</li>' +
                                  '<li class="gem-c-layout-super-navigation-header__popular-item">' +
                                      '<a class="govuk-link gem-c-layout-super-navigation-header__popular-link" data-track-action="popularLink" data-track-category="headerClicked" data-track-label="/guidance/getting-the-energy-bills-support-scheme-discount" data-track-dimension="Find out about the Energy Bills Support Scheme" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;2.2.2&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Popular on GOV.UK&quot;}" href="/guidance/getting-the-energy-bills-support-scheme-discount">Find out about the Energy Bills Support Scheme</a>' +
                                  '</li>' +
                                  '<li class="gem-c-layout-super-navigation-header__popular-item">' +
                                      '<a class="govuk-link gem-c-layout-super-navigation-header__popular-link" data-track-action="popularLink" data-track-category="headerClicked" data-track-label="/find-a-job" data-track-dimension="Find a job" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;2.2.3&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Popular on GOV.UK&quot;}" href="/find-a-job">Find a job</a>' +
                                  '</li>' +
                                  '<li class="gem-c-layout-super-navigation-header__popular-item">' +
                                      '<a class="govuk-link gem-c-layout-super-navigation-header__popular-link" data-track-action="popularLink" data-track-category="headerClicked" data-track-label="/coronavirus" data-track-dimension="Coronavirus (COVID-19)" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;2.2.4&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Popular on GOV.UK&quot;}" href="/coronavirus">Coronavirus (COVID-19)</a>' +
                                  '</li>' +
                                  '<li class="gem-c-layout-super-navigation-header__popular-item">' +
                                      '<a class="govuk-link gem-c-layout-super-navigation-header__popular-link" data-track-action="popularLink" data-track-category="headerClicked" data-track-label="/sign-in-universal-credit" data-track-dimension="Universal Credit account: sign in" data-track-dimension-index="29" data-ga4-link="{&quot;event_name&quot;:&quot;navigation&quot;,&quot;type&quot;:&quot;header menu bar&quot;,&quot;index&quot;:&quot;2.2.5&quot;,&quot;index_total&quot;:29,&quot;section&quot;:&quot;Popular on GOV.UK&quot;}" href="/sign-in-universal-credit">Universal Credit account: sign in</a>' +
                                  '</li>' +
                              '</ul>' +
                          '</div>' +
                      '</div>' +
                  '</div>' +
              '</div>' +
          '</nav>' +
        '</div>' +
      '</header>'

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
      var $superNavigationHeader

      beforeEach(function () {
        $button = document.querySelector('#super-navigation-menu-toggle')
        $menu = document.querySelector('#super-navigation-menu')
        $superNavigationHeader = document.querySelector('.gem-c-layout-super-navigation-header')

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

      it('adds the `gem-c-layout-super-navigation-header--menu-open` class to the super navigation header element', function () {
        expect($superNavigationHeader).toHaveClass('gem-c-layout-super-navigation-header--menu-open')
      })
    })

    describe('updates correctly when clicked twice', function () {
      var $button
      var $menu
      var $superNavigationHeader

      beforeEach(function () {
        $button = document.querySelector('#super-navigation-menu-toggle')
        $menu = document.querySelector('#super-navigation-menu')
        $superNavigationHeader = document.querySelector('.gem-c-layout-super-navigation-header')

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

      it('adds and then removes the `gem-c-layout-super-navigation-header--menu-open` class from the super navigation header element', function () {
        expect($superNavigationHeader).toHaveClass('gem-c-layout-super-navigation-header--menu-open')
        $button.click()
        expect($superNavigationHeader).not.toHaveClass('gem-c-layout-super-navigation-header--menu-open')
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
      var $superNavigationHeader

      beforeEach(function () {
        $button = document.querySelector('#super-search-menu-toggle')
        $menu = document.querySelector('#super-search-menu')
        $superNavigationHeader = document.querySelector('.gem-c-layout-super-navigation-header')

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

      it('adds the `gem-c-layout-super-navigation-header--menu-open` class to the super navigation header element', function () {
        expect($superNavigationHeader).toHaveClass('gem-c-layout-super-navigation-header--menu-open')
      })
    })

    describe('updates correctly when clicked twice', function () {
      var $button
      var $menu
      var $superNavigationHeader

      beforeEach(function () {
        $button = document.querySelector('#super-search-menu-toggle')
        $menu = document.querySelector('#super-search-menu')
        $superNavigationHeader = document.querySelector('.gem-c-layout-super-navigation-header')

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

      it('adds and then removes the `gem-c-layout-super-navigation-header--menu-open` class from the super navigation header element', function () {
        expect($superNavigationHeader).toHaveClass('gem-c-layout-super-navigation-header--menu-open')
        $button.click()
        expect($superNavigationHeader).not.toHaveClass('gem-c-layout-super-navigation-header--menu-open')
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
