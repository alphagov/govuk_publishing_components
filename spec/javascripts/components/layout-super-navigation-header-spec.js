/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('The super header navigation', function () {
  'use strict'

  var container
  var thisModule

  beforeEach(function () {
    container = document.createElement('div')
    container.className = 'govuk-frontend-supported'
    container.innerHTML = `
      <nav aria-labelledby="super-navigation-menu-heading" class="gem-c-layout-super-navigation-header__content"
        data-module="super-navigation-mega-menu">
        <div class="gem-c-layout-super-navigation-header__header-logo">
          <a class="govuk-header__link govuk-header__link--homepage"
            data-ga4-link="{'event_name':'navigation','type':'header menu bar','external':'false','text':'GOV.UK','section':'Logo','index_link':1,'index_section':0,'index_section_count':2,'index_total':1}"
            id="logo" aria-label="Go to the GOV.UK homepage" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" viewBox="0 0 324 60" height="30" width="162"
              fill="currentcolor" class="govuk-header__logotype" aria-label="GOV.UK">
              <title>GOV.UK</title>
              <g>
                <circle cx="20" cy="17.6" r="3.7"></circle>
                <circle cx="10.2" cy="23.5" r="3.7"></circle>
                <circle cx="3.7" cy="33.2" r="3.7"></circle>
                <circle cx="31.7" cy="30.6" r="3.7"></circle>
                <circle cx="43.3" cy="17.6" r="3.7"></circle>
                <circle cx="53.2" cy="23.5" r="3.7"></circle>
                <circle cx="59.7" cy="33.2" r="3.7"></circle>
                <circle cx="31.7" cy="30.6" r="3.7"></circle>
                <path
                  d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z">
                </path>
              </g>
              <circle class="govuk-logo-dot" cx="226" cy="36" r="7.3"></circle>
              <path
                d="M93.94 41.25c.4 1.81 1.2 3.21 2.21 4.62 1 1.4 2.21 2.41 3.61 3.21s3.21 1.2 5.22 1.2 3.61-.4 4.82-1c1.4-.6 2.41-1.4 3.21-2.41.8-1 1.4-2.01 1.61-3.01s.4-2.01.4-3.01v.14h-10.86v-7.02h20.07v24.08h-8.03v-5.56c-.6.8-1.38 1.61-2.19 2.41-.8.8-1.81 1.2-2.81 1.81-1 .4-2.21.8-3.41 1.2s-2.41.4-3.81.4a18.56 18.56 0 0 1-14.65-6.63c-1.6-2.01-3.01-4.41-3.81-7.02s-1.4-5.62-1.4-8.83.4-6.02 1.4-8.83a20.45 20.45 0 0 1 19.46-13.65c3.21 0 4.01.2 5.82.8 1.81.4 3.61 1.2 5.02 2.01 1.61.8 2.81 2.01 4.01 3.21s2.21 2.61 2.81 4.21l-7.63 4.41c-.4-1-1-1.81-1.61-2.61-.6-.8-1.4-1.4-2.21-2.01-.8-.6-1.81-1-2.81-1.4-1-.4-2.21-.4-3.61-.4-2.01 0-3.81.4-5.22 1.2-1.4.8-2.61 1.81-3.61 3.21s-1.61 2.81-2.21 4.62c-.4 1.81-.6 3.71-.6 5.42s.8 5.22.8 5.22Zm57.8-27.9c3.21 0 6.22.6 8.63 1.81 2.41 1.2 4.82 2.81 6.62 4.82S170.2 24.39 171 27s1.4 5.62 1.4 8.83-.4 6.02-1.4 8.83-2.41 5.02-4.01 7.02-4.01 3.61-6.62 4.82-5.42 1.81-8.63 1.81-6.22-.6-8.63-1.81-4.82-2.81-6.42-4.82-3.21-4.41-4.01-7.02-1.4-5.62-1.4-8.83.4-6.02 1.4-8.83 2.41-5.02 4.01-7.02 4.01-3.61 6.42-4.82 5.42-1.81 8.63-1.81Zm0 36.73c1.81 0 3.61-.4 5.02-1s2.61-1.81 3.61-3.01 1.81-2.81 2.21-4.41c.4-1.81.8-3.61.8-5.62 0-2.21-.2-4.21-.8-6.02s-1.2-3.21-2.21-4.62c-1-1.2-2.21-2.21-3.61-3.01s-3.21-1-5.02-1-3.61.4-5.02 1c-1.4.8-2.61 1.81-3.61 3.01s-1.81 2.81-2.21 4.62c-.4 1.81-.8 3.61-.8 5.62 0 2.41.2 4.21.8 6.02.4 1.81 1.2 3.21 2.21 4.41s2.21 2.21 3.61 3.01c1.4.8 3.21 1 5.02 1Zm36.32 7.96-12.24-44.15h9.83l8.43 32.77h.4l8.23-32.77h9.83L200.3 58.04h-12.24Zm74.14-7.96c2.18 0 3.51-.6 3.51-.6 1.2-.6 2.01-1 2.81-1.81s1.4-1.81 1.81-2.81a13 13 0 0 0 .8-4.01V13.9h8.63v28.15c0 2.41-.4 4.62-1.4 6.62-.8 2.01-2.21 3.61-3.61 5.02s-3.41 2.41-5.62 3.21-4.62 1.2-7.02 1.2-5.02-.4-7.02-1.2c-2.21-.8-4.01-1.81-5.62-3.21s-2.81-3.01-3.61-5.02-1.4-4.21-1.4-6.62V13.9h8.63v26.95c0 1.61.2 3.01.8 4.01.4 1.2 1.2 2.21 2.01 2.81.8.8 1.81 1.4 2.81 1.81 0 0 1.34.6 3.51.6Zm34.22-36.18v18.92l15.65-18.92h10.82l-15.03 17.32 16.03 26.83h-10.21l-11.44-20.21-5.62 6.22v13.99h-8.83V13.9">
              </path>
            </svg>
          </a>
        </div>
        <h2 id="super-navigation-menu-heading" class="govuk-visually-hidden">
          Navigation menu
        </h2>
        <div class="gem-c-layout-super-navigation-header__navigation-item">
          <a class="gem-c-layout-super-navigation-header__navigation-item-link" href="/browse">
            <span class="gem-c-layout-super-navigation-header__navigation-item-link-inner">Menu</span>
          </a>
          <button aria-controls="super-navigation-menu" aria-expanded="false" aria-label="Show navigation menu"
            class="gem-c-layout-super-navigation-header__navigation-top-toggle-button"
            data-text-for-hide="Hide navigation menu" data-text-for-show="Show navigation menu"
            data-toggle-desktop-group="top" data-toggle-mobile-group="top"
            data-ga4-event="{'event_name':'select_content','type':'header menu bar','text':'Menu','index_section':1,'index_section_count':2,'section':'Menu'}"
            hidden="hidden" id="super-navigation-menu-toggle" type="button">
            <span class="gem-c-layout-super-navigation-header__navigation-top-toggle-button-inner">Menu</span>
          </button>
        </div>
        <div id="super-navigation-menu" hidden="hidden"
          class="gem-c-layout-super-navigation-header__navigation-dropdown-menu">
          <div class="govuk-grid-row gem-c-layout-super-navigation-header__navigation-items">
            <div
              class="govuk-grid-column-two-thirds-from-desktop gem-c-layout-super-navigation-header__column--services-and-information">
              <h3 class="govuk-heading-m gem-c-layout-super-navigation-header__column-header">
                Services and information
              </h3>
              <ul
                class="gem-c-layout-super-navigation-header__navigation-second-items gem-c-layout-super-navigation-header__navigation-second-items--services-and-information">
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':1,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/benefits">Benefits</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':2,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/births-deaths-marriages">Births, death, marriages and care</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':3,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/business">Business and self-employed</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':4,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/childcare-parenting">Childcare and parenting</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':5,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/citizenship">Citizenship and living in the UK</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':6,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/justice">Crime, justice and the law</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':7,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/disabilities">Disabled people</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':8,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/driving">Driving and transport</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':9,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/education">Education and learning</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':10,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/employing-people">Employing people</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':11,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/environment-countryside">Environment and countryside</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':12,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/housing-local-services">Housing and local services</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':13,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/tax">Money and tax</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':14,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/abroad">Passports, travel and living abroad</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':15,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/visas-immigration">Visas and immigration</a>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':1,'index_link':16,'index_section_count':3,'index_total':16,'section':'Services and information'}"
                    href="/browse/working">Working, jobs and pensions</a>
                </li>
              </ul>
            </div>
            <div
              class="govuk-grid-column-one-third-from-desktop gem-c-layout-super-navigation-header__column--government-activity">
              <h3 class="govuk-heading-m gem-c-layout-super-navigation-header__column-header">
                Government activity
              </h3>
              <ul
                class="gem-c-layout-super-navigation-header__navigation-second-items gem-c-layout-super-navigation-header__navigation-second-items--government-activity">
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':2,'index_link':1,'index_section_count':3,'index_total':6,'section':'Government activity'}"
                    href="/government/organisations">Departments</a>
                  <p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Departments, agencies
                    and public bodies</p>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':2,'index_link':2,'index_section_count':3,'index_total':6,'section':'Government activity'}"
                    href="/search/news-and-communications">News</a>
                  <p class="gem-c-layout-super-navigation-header__navigation-second-item-description">News stories, speeches,
                    letters and notices</p>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':2,'index_link':3,'index_section_count':3,'index_total':6,'section':'Government activity'}"
                    href="/search/guidance-and-regulation">Guidance and regulation</a>
                  <p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Detailed guidance,
                    regulations and rules</p>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':2,'index_link':4,'index_section_count':3,'index_total':6,'section':'Government activity'}"
                    href="/search/research-and-statistics">Research and statistics</a>
                  <p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Reports, analysis and
                    official statistics</p>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':2,'index_link':5,'index_section_count':3,'index_total':6,'section':'Government activity'}"
                    href="/search/policy-papers-and-consultations">Policy papers and consultations</a>
                  <p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Consultations and
                    strategy</p>
                </li>
                <li class="gem-c-layout-super-navigation-header__dropdown-list-item">
                  <a class="govuk-link gem-c-layout-super-navigation-header__navigation-second-item-link gem-c-layout-super-navigation-header__navigation-second-item-link--with-description"
                    data-ga4-link="{'event_name':'navigation','type':'header menu bar','index_section':2,'index_link':6,'index_section_count':3,'index_total':6,'section':'Government activity'}"
                    href="/search/transparency-and-freedom-of-information-releases">Transparency</a>
                  <p class="gem-c-layout-super-navigation-header__navigation-second-item-description">Data, Freedom of
                    Information releases and corporate reports</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="gem-c-layout-super-navigation-header__search-item">
          <button id="super-search-menu-toggle" class="gem-c-layout-super-navigation-header__search-toggle-button"
            aria-controls="super-search-menu" aria-expanded="true" aria-label="Hide search menu"
            data-text-for-hide="Hide search menu" data-text-for-show="Show search menu" data-toggle-mobile-group="top"
            data-toggle-desktop-group="top"
            data-ga4-event="{'event_name':'select_content','type':'header menu bar','text':'Search','index_section':2,'index_section_count':2,'section':'Search'}"
            hidden="hidden" type="button">
            <span class="govuk-visually-hidden">
              Search GOV.UK
            </span>
            <svg class="gem-c-layout-super-navigation-header__search-toggle-button-link-icon" width="27" height="27"
              viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" />
              <line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" />
            </svg>
            <span aria-hidden="true" class="gem-c-layout-super-navigation-header__navigation-top-toggle-close-icon"
              focusable="false">
              &times;
            </span>
          </button>
          <a class="gem-c-layout-super-navigation-header__search-item-link" href="/search">
            <span class="govuk-visually-hidden">
              Search GOV.UK
            </span>
            <svg class="gem-c-layout-super-navigation-header__search-item-link-icon" width="27" height="27"
              viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" />
              <line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor" stroke-width="3" />
            </svg>
          </a>
        </div>
        <div id="super-search-menu" hidden="hidden" class="gem-c-layout-super-navigation-header__navigation-dropdown-menu">
          <div
            class="gem-c-layout-super-navigation-header__search-container gem-c-layout-super-navigation-header__search-items">
            <h3 class="govuk-visually-hidden">
              Search
            </h3>
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-full">
                <form class="gem-c-layout-super-navigation-header__search-form" id="search" data-module="ga4-search-tracker"
                  data-ga4-search-type="header menu bar" data-ga4-search-url="/search/all"
                  data-ga4-search-section="Search GOV.UK" data-ga4-search-index-section="3"
                  data-ga4-search-index-section-count="3" action="/search/all" method="get" role="search"
                  aria-label="Site-wide">
                  <div class="gem-c-search-with-autocomplete gem-c-search-with-autocomplete--large govuk-!-margin-bottom-0"
                    data-module="gem-search-with-autocomplete"
                    data-source-url="https://www.gov.uk/api/search/autocomplete.json" data-source-key="suggestions">
                    <div data-module="gem-toggle-input-class-on-focus"
                      class="gem-c-search govuk-!-display-none-print gem-c-search--large gem-c-search--on-white gem-c-search--separate-label govuk-!-margin-bottom-0">
                      <label for="search-main-3a26e85b"
                        class="govuk-label govuk-label--m gem-c-layout-super-navigation-header__search-label--large-navbar">Search GOV.UK</label>
                      <div class="gem-c-search__item-wrapper">
                        <div class="js-search-input-wrapper">
                          <input enterkeyhint="search" class="gem-c-search__item gem-c-search__input js-class-toggle"
                            id="search-main-3a26e85b" name="keywords" title="Search" type="search" value="" autocorrect="off"
                            autocapitalize="off">
                        </div>
                        <div class="gem-c-search__item gem-c-search__submit-wrapper">
                          <button class="gem-c-search__submit" type="submit" enterkeyhint="search">
                            Search
                            <svg class="gem-c-search__icon" width="27" height="27" viewBox="0 0 27 27" fill="none"
                              xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                              <circle cx="12.0161" cy="11.0161" r="8.51613" stroke="currentColor" stroke-width="3" />
                              <line x1="17.8668" y1="17.3587" x2="26.4475" y2="25.9393" stroke="currentColor"
                                stroke-width="3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `

    document.body.appendChild(container)

    var $element = document.querySelector('[data-module="super-navigation-mega-menu"]')
    thisModule = new GOVUK.Modules.SuperNavigationMegaMenu($element)
  })

  afterEach(function () {
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
