# Changelog

- We use the [GOV.UK versioning guidelines](https://docs.publishing.service.gov.uk/manual/publishing-a-ruby-gem.html#versioning).
- Mark breaking changes with `BREAKING:`. Be sure to include instructions on how applications should be upgraded.
- Include a link to your pull request.
- Don't include changes that are purely internal. The CHANGELOG should be a
  useful summary for people upgrading their application, not a replication
  of the commit log.

## Unreleased

* Iterate FAQ schema to split content around h2 headings. [PR #1127](https://github.com/alphagov/govuk_publishing_components/pull/1127)

## 20.5.2

* Update to [govuk-frontend to 3.2.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.2.0) ([PR #1113](https://github.com/alphagov/govuk_publishing_components/pull/1113))
* Fix focus state on step by step nav when header element is hovered [PR #1119](https://github.com/alphagov/govuk_publishing_components/pull/1119)

## 20.5.1

* Fix IE-specific CSS for chevron banner ([PR #1116](https://github.com/alphagov/govuk_publishing_components/pull/1116))

## 20.5.0

* Add font-size option to contents list component ([PR #1112](https://github.com/alphagov/govuk_publishing_components/pull/1112))
* Add margin-bottom option to lead paragraph component ([PR #1114](https://github.com/alphagov/govuk_publishing_components/pull/1114))

## 20.4.0

* Update ODT guidance link ([PR #906](https://github.com/alphagov/govuk_publishing_components/pull/906))
* Fix focus states on cookie-banner confirmation message ([PR #1109](https://github.com/alphagov/govuk_publishing_components/pull/1109))
* Allow custom heading size on checkboxes and radios ([PR #1107](https://github.com/alphagov/govuk_publishing_components/pull/1107))

## 20.3.0

* Add ability to pass language to heading component ([PR #1102](https://github.com/alphagov/govuk_publishing_components/pull/1102))
* Fix chapter URLs in FAQ page schema ([PR #1105](https://github.com/alphagov/govuk_publishing_components/pull/1105)).

## 20.2.2

* Fix data attributes in delete summary list item ([PR #1103](https://github.com/alphagov/govuk_publishing_components/pull/1103))

## 20.2.1

* Improve chevron banner component ([PR #1098](https://github.com/alphagov/govuk_publishing_components/pull/1098))
* Add input style override override ([PR #1099](https://github.com/alphagov/govuk_publishing_components/pull/1099))

## 20.2.0

* Ensure input styles are not overridden by static ([PR #1094](https://github.com/alphagov/govuk_publishing_components/pull/1094))
* Fixes focus state spacing on 'extensive' related navigation links ([PR #1085](https://github.com/alphagov/govuk_publishing_components/pull/1085))
* Add chevron banner component ([PR #1084](https://github.com/alphagov/govuk_publishing_components/pull/1084))

## 20.1.0

* Add FAQPage schema ([PR #1087](https://github.com/alphagov/govuk_publishing_components/pull/1087))

## 20.0.0

* **BREAKING:** Remove the inverse flag for contents list component ([PR #1090](https://github.com/alphagov/govuk_publishing_components/pull/1090))
    * Will stop any inverse flags on the contents list component from working
* Set all branded links to correct focus colour ([PR #1088](https://github.com/alphagov/govuk_publishing_components/pull/1088))
* Fix components focus state spacing ([PR #1054](https://github.com/alphagov/govuk_publishing_components/pull/1054))
* Allow inset-text to take a block ([PR #1078](https://github.com/alphagov/govuk_publishing_components/pull/1078))

## 19.0.0

* **BREAKING:** Remove govuk_frontend_toolkit sass dependencies ([PR #1069](https://github.com/alphagov/govuk_publishing_components/pull/1069))
    * This will break apps that rely on mixins and variables from govuk_frontend_toolkit - you must replace these with mixins and variables from GOV.UK Frontend
* Restore margin bottom to the image card ([PR #1079](https://github.com/alphagov/govuk_publishing_components/pull/1079))
* Allow summary_list to render without borders ([PR #1073](https://github.com/alphagov/govuk_publishing_components/pull/1073))
* Explicitly set focus states ([PR #1071](https://github.com/alphagov/govuk_publishing_components/pull/1071))
* Override edit link text on summary-link component ([PR #1076](https://github.com/alphagov/govuk_publishing_components/pull/1076))

## 18.3.1

* Adjust share links column width ([PR #1074](https://github.com/alphagov/govuk_publishing_components/pull/1074))

## 18.3.0

* `value` and `name` can be set on button component ([PR #1059](https://github.com/alphagov/govuk_publishing_components/pull/1059))
* Consolidate input aria documentation and tests ([PR #1062](https://github.com/alphagov/govuk_publishing_components/pull/1062))

## 18.2.0

* Fix nested checkboxes js ([PR #1065](https://github.com/alphagov/govuk_publishing_components/pull/1065))
* Fix image card responsiveness ([PR #1055](https://github.com/alphagov/govuk_publishing_components/pull/1055))
* Make contextual title accept and present lang parameter ([PR #1056](https://github.com/alphagov/govuk_publishing_components/pull/1056))
* Add summary-list component based on GOV.UK Frontend ([PR #1061](https://github.com/alphagov/govuk_publishing_components/pull/1061))

## 18.1.2

* Restore jquery as gem dependency ([PR #1051](https://github.com/alphagov/govuk_publishing_components/pull/1051))
* Fix share links columns option layout ([PR #1050](https://github.com/alphagov/govuk_publishing_components/pull/1050))

## 18.1.1

* Restore node_modules gem dependencies ([PR #1048](https://github.com/alphagov/govuk_publishing_components/pull/1048))

## 18.1.0

* Expand share links component ([PR #1046](https://github.com/alphagov/govuk_publishing_components/pull/1046))
* Add locale option so `lang` attribute can be used on related links ([PR #1026](https://github.com/alphagov/govuk_publishing_components/pull/1026))
* Rejigs related navigation line height to avoid focus state overlap ([PR #1045](https://github.com/alphagov/govuk_publishing_components/pull/1045))

## 18.0.1

* Make the gem _slimmer_ by only including GOV.UK Frontend ([PR #1041](https://github.com/alphagov/govuk_publishing_components/pull/1041))
* Remove unused image assets previously used in the button component and references to zombie image assets ([PR #1042](https://github.com/alphagov/govuk_publishing_components/pull/1042))
* Fix start button showing SVG code ([PR #1043](https://github.com/alphagov/govuk_publishing_components/pull/1043))

## 18.0.0

* BREAKING: Update to [govuk-frontend 3.0.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.0.0) ([PR #1010](https://github.com/alphagov/govuk_publishing_components/pull/1010))

  You must make the following changes when you migrate to this release:
  - Check application's dependencies on deprecated projects (`govuk_frontend_toolkit`, `govuk_elements_rails` and `govuk_template`) and set [compatibility flags](https://govuk-frontend-review.herokuapp.com/docs/#settings/compatibility) appropriately before importing `govuk_publishing_components`. Note that all applications that rely on a layout from static depend indirectly on `govuk_template` and most frontend applications rely on `govuk_frontend_toolkit`. [Example commit](https://github.com/alphagov/calendars/commit/edd649e6c2c7732d4a2e44713dd9463feeaf990b)
  - Update [`govuk-colour` mixins](https://govuk-frontend-review.herokuapp.com/docs/#helpers/colour-function-govuk-colour) to support legacy colours. [Example commit](https://github.com/alphagov/calendars/commit/ccd2b25873ee026858958d4732d42071bea57255)
  - Check [govuk-frontend 3.0 changelog](https://github.com/alphagov/govuk-frontend/releases/tag/v3.0.0) to see if and how the breaking release affects your application.

* BREAKING: Remove the accessible-autocomplete component ([PR #1038](https://github.com/alphagov/govuk_publishing_components/pull/1038))
  [content-data-admin](https://github.com/alphagov/content-data-admin) is the only application that uses the accessible-autocomplete component. In order to migrate to this release it you must copy the files removed in PR #1038.

* Update feedback component to use govuk-frontend layout classes ([PR #1010](https://github.com/alphagov/govuk_publishing_components/pull/1010))
* Fix focus and hover states for breadcrumbs, contents-list, highlight-boxes, modal-dialogue, step-by-step-nav, previous-and-next-navigation and title component ([PR #1010](https://github.com/alphagov/govuk_publishing_components/pull/1010))
* Normalise falsey values to nil for subscription links component ([PR #1021](https://github.com/alphagov/govuk_publishing_components/pull/1021))
* Add inverse flag to contents list components ([PR #1037](https://github.com/alphagov/govuk_publishing_components/pull/1037))

## 17.21.0

* Add tests for email feedback form ([PR #1017](https://github.com/alphagov/govuk_publishing_components/pull/1017))
* Add `lang` attribute option to subscription links ([PR #1019](https://github.com/alphagov/govuk_publishing_components/pull/1019))
* Fix for select height zoom problem ([PR #1018](https://github.com/alphagov/govuk_publishing_components/pull/1018))

## 17.20.0

* Add full width option to select component ([PR #1012](https://github.com/alphagov/govuk_publishing_components/pull/1012))
* Change statistics header link to link to new finder ([PR #1015](https://github.com/alphagov/govuk_publishing_components/pull/1015))

## 17.19.1

* Replace subscription links images with SVG ([PR #1008](https://github.com/alphagov/govuk_publishing_components/pull/1008))
* Change subscription links CSS ([PR #1007](https://github.com/alphagov/govuk_publishing_components/pull/1007))

## 17.19.0

* Remove expectation that sprockets is installed when used in a Rails app ([PR #999](https://github.com/alphagov/govuk_publishing_components/pull/999))
* Fix tabs list overwrite on mobile ([PR #1003](https://github.com/alphagov/govuk_publishing_components/pull/1003))
* Set the origin when rendering the YouTube player ([PR #1004](https://github.com/alphagov/govuk_publishing_components/pull/1004))

## 17.18.0

* Replace accessible media player with Youtube player ([PR #908](https://github.com/alphagov/govuk_publishing_components/pull/908))
* Prevent the cookie banner component from rendering when in an iframe ([PR #995](https://github.com/alphagov/govuk_publishing_components/pull/995))

## 17.17.0

* Restore missing field to feedback survey form ([PR #998](https://github.com/alphagov/govuk_publishing_components/pull/998))
* Use div elements for hint messages ([PR #996](https://github.com/alphagov/govuk_publishing_components/pull/996))

## 17.16.0

* Track when primary or secondary step by step are shown ([PR #989](https://github.com/alphagov/govuk_publishing_components/pull/989))
* Update image-card to use govuk-frontend ([PR #967](https://github.com/alphagov/govuk_publishing_components/pull/967))
* Update search to use govuk-frontend ([PR #977](https://github.com/alphagov/govuk_publishing_components/pull/977))

## 17.15.0

* Add no underline option to document list component ([PR #990](https://github.com/alphagov/govuk_publishing_components/pull/990))

## 17.14.0

* Update cookie banner component to hide if cross-origin message has `hideCookieBanner` set to `true` ([PR #988](https://github.com/alphagov/govuk_publishing_components/pull/988))
* Change paragraph to div for descriptions to support govspeak description in checkboxes and radios ([PR #985](https://github.com/alphagov/govuk_publishing_components/pull/985))

## 17.13.0

* Add support for description text ([PR #971](https://github.com/alphagov/govuk_publishing_components/pull/971))
* Stop duplicate links within feedback form ([PR #981](https://github.com/alphagov/govuk_publishing_components/pull/981))
* Add spacing to the feedback form ([PR #981](https://github.com/alphagov/govuk_publishing_components/pull/981))

## 17.12.2

* Make some tab component styles more specific to override `.content-block` ([PR #978](https://github.com/alphagov/govuk_publishing_components/pull/978))

## 17.12.1

* Reset focus when feedback component is closed before submit ([PR #975](https://github.com/alphagov/govuk_publishing_components/pull/975))

## 17.12.0

* Remove references to old `gem-c-cookie-banner--new` class ([PR #972](https://github.com/alphagov/govuk_publishing_components/pull/972))
* Change title margin option ([PR #969](https://github.com/alphagov/govuk_publishing_components/pull/969))

## 17.11.0

* Stop the hardcoding of a google client ID in the feedback footer ([PR #957](https://github.com/alphagov/govuk_publishing_components/pull/957))

## 17.10.0

* Enable data attributes for table header links ([PR #962](https://github.com/alphagov/govuk_publishing_components/pull/962))

## 17.9.0

* Use shared_helper for heading margin ([PR #958](https://github.com/alphagov/govuk_publishing_components/pull/958))

## 17.8.0

* Remove old cookie banner code and new_cookie_banner flag ([PR #959](https://github.com/alphagov/govuk_publishing_components/pull/959))

## 17.7.0

* Add an inverse flag to the phase banner ([PR #954](https://github.com/alphagov/govuk_publishing_components/pull/954))

## 17.6.1

* Fix confirmation message being read to screenreaders ([PR #952](https://github.com/alphagov/govuk_publishing_components/pull/952))
* Hide 'Accept Cookies' button when Javascript not available ([PR #948](https://github.com/alphagov/govuk_publishing_components/pull/948))

## 17.6.0

* Add landmark to cookie banner ([PR #949](https://github.com/alphagov/govuk_publishing_components/pull/949))
* Cookie banner confirmation message is read automatically to screenreaders ([PR #949](https://github.com/alphagov/govuk_publishing_components/pull/949))

## 17.5.0

* Increase spacing between inline buttons on desktop ([PR #946](https://github.com/alphagov/govuk_publishing_components/pull/946))

## 17.4.0

* Add inverse option to contextual breadcrumbs ([PR #943](https://github.com/alphagov/govuk_publishing_components/pull/943))
* Adds support for secondary content items for step by step ([PR #900](https://github.com/alphagov/govuk_publishing_components/pull/900))
* Adds missing tests for related to step navs ([PR #900](https://github.com/alphagov/govuk_publishing_components/pull/900))
* Adds missing tests for also part of step navs component ([PR #900](https://github.com/alphagov/govuk_publishing_components/pull/900))

## 17.3.0

* Set the expiry of consent cookie to 1 year ([PR #940](https://github.com/alphagov/govuk_publishing_components/pull/940))
* Sets the default expiry of cookies to 30 days if not specified ([PR #940](https://github.com/alphagov/govuk_publishing_components/pull/940))

## 17.2.0

* Change step by step navigation active step link state ([PR #937](https://github.com/alphagov/govuk_publishing_components/pull/937))
* Fix dialog element role in modal dialogue component ([PR #920](https://github.com/alphagov/govuk_publishing_components/pull/920))
* Add ministers to organisation page schema. ([PR #921](https://github.com/alphagov/govuk_publishing_components/pull/921))
* Add options to document list component ([PR #917](https://github.com/alphagov/govuk_publishing_components/pull/917))

## 17.1.1

* Fix resetting cookie mechanism for new banner ([PR #935](https://github.com/alphagov/govuk_publishing_components/pull/935))

## 17.1.0

* Add tracking to the hide button on new cookie banner ([PR #928](https://github.com/alphagov/govuk_publishing_components/pull/928))
* Delete cookies when a user removes consent ([PR #923](https://github.com/alphagov/govuk_publishing_components/pull/923))
* Reset seen_cookie_message if new cookie banner present ([PR #925](https://github.com/alphagov/govuk_publishing_components/pull/925))

## 17.0.0

* Fix allowing/denying cookies ([PR #922](https://github.com/alphagov/govuk_publishing_components/pull/922))
* Update feedback component error handling ([PR #918](https://github.com/alphagov/govuk_publishing_components/pull/918))
* Support data attributes for error summary items ([PR #924](https://github.com/alphagov/govuk_publishing_components/pull/924))
* Disable youtube embeds if campaign cookies turned off ([PR #919](https://github.com/alphagov/govuk_publishing_components/pull/919))
* Add aria-live flag to notice component ([PR #911](https://github.com/alphagov/govuk_publishing_components/pull/911))
* BREAKING: Check the consent cookie before setting cookies ([PR #916](https://github.com/alphagov/govuk_publishing_components/pull/916))
* Override vertical align: top for inline buttons ([PR #912](https://github.com/alphagov/govuk_publishing_components/pull/912))
* Change cookie banner text to green ([PR #912](https://github.com/alphagov/govuk_publishing_components/pull/912))
* Accessibility and design fixes for cookie banner ([PR #912](https://github.com/alphagov/govuk_publishing_components/pull/912))

## 16.29.0

* Accept error_items on date input component ([PR #907](https://github.com/alphagov/govuk_publishing_components/pull/907))
* Accept items on error message component ([PR #907](https://github.com/alphagov/govuk_publishing_components/pull/907))

## 16.28.0

* Make inline buttons 50% width from mobile - tablet ([PR #898](https://github.com/alphagov/govuk_publishing_components/pull/898))
* Remove dependence on Poltergeist and PhantomJS by moving to govuk_test gem ([PR #905](https://github.com/alphagov/govuk_publishing_components/pull/905))

## 16.27.1

* Add descriptions for search actions on machine readable components ([PR #897](https://github.com/alphagov/govuk_publishing_components/pull/897))

## 16.27.0

* Allow target attribute on links for the error summary component ([PR #894](https://github.com/alphagov/govuk_publishing_components/pull/894))

## 16.26.0

* Add machine readable breadcrumbs to the step by step header ([PR #892](https://github.com/alphagov/govuk_publishing_components/pull/892))

## 16.25.0

* Support data attributes in modal dialogue ([PR #890](https://github.com/alphagov/govuk_publishing_components/pull/890))

## 16.24.0

* Update notice component to render without title ([PR #884](https://github.com/alphagov/govuk_publishing_components/pull/884))
* Add margin option to notice component ([PR #884](https://github.com/alphagov/govuk_publishing_components/pull/884))
* Remove related step by steps from CreativeWork schema ([PR #888](https://github.com/alphagov/govuk_publishing_components/pull/888))

## 16.23.0

* Add contents list heading Welsh translation ([PR #881](https://github.com/alphagov/govuk_publishing_components/pull/881))
* Enable passing data attributes to attachment components ([PR #874](https://github.com/alphagov/govuk_publishing_components/pull/874))
* Add potentialSearchAction to the GovernmentOrganization schema ([PR #870](https://github.com/alphagov/govuk_publishing_components/pull/870))
* Add potentialSearchAction to manuals ([PR #879](https://github.com/alphagov/govuk_publishing_components/pull/879))

## 16.22.0

* Update inline button styling on mobile ([PR #872](https://github.com/alphagov/govuk_publishing_components/pull/872))

## 16.21.0

* Add request different format section to attachment component ([PR #858](https://github.com/alphagov/govuk_publishing_components/pull/858))
* Fix broken call to content_type fallback method ([PR #869](https://github.com/alphagov/govuk_publishing_components/pull/869))
* Change default new cookie banner consent to on ([PR #864](https://github.com/alphagov/govuk_publishing_components/pull/864))
* Hide new cookie banner on cookie settings page ([PR #864](https://github.com/alphagov/govuk_publishing_components/pull/864))

## 16.20.1

* Remove links to Whitehall publications ([PR #823](https://github.com/alphagov/govuk_publishing_components/pull/823))
* Revert 'Prevent double click by default for submit buttons' ([PR #865](https://github.com/alphagov/govuk_publishing_components/pull/865))

## 16.20.0

* Add SearchResultsPage schema.org schema ([PR #861](https://github.com/alphagov/govuk_publishing_components/pull/861))

## 16.19.0

* Adds support to allow parent finder to show as breadcrumbs ([PR #831](https://github.com/alphagov/govuk_publishing_components/pull/831))

## 16.18.0

* Add inline radio button option ([PR #860](https://github.com/alphagov/govuk_publishing_components/pull/860))
* Add new version of (experimental) cookie banner ([PR #845](https://github.com/alphagov/govuk_publishing_components/pull/845))
* Add inline variation for button component ([PR #845](https://github.com/alphagov/govuk_publishing_components/pull/845))
* Fix govspeak overriding attachment styling ([PR #856](https://github.com/alphagov/govuk_publishing_components/pull/856))

## 16.17.0

* Replace gems version of warning button with GOV.UK Frontend version ([PR #848](https://github.com/alphagov/govuk_publishing_components/pull/848))
* Prevent double click by default for submit buttons ([PR #849](https://github.com/alphagov/govuk_publishing_components/pull/849))
* Add inline SVG icons to attachment component ([PR #850](https://github.com/alphagov/govuk_publishing_components/pull/850))
* Update contextual navigation feature tests to use examples from govuk-content-schemas ([PR #847](https://github.com/alphagov/govuk_publishing_components/pull/847))

## 16.16.0

* Add attachment (experimental) component ([PR #842](https://github.com/alphagov/govuk_publishing_components/pull/842))

## 16.15.0

* Update cookie-banner behaviour without Javascript ([PR #843](https://github.com/alphagov/govuk_publishing_components/pull/843))

## 16.14.1

* Revert the cookie banner tracking which was added in v16.12.0 ([PR #839](https://github.com/alphagov/govuk_publishing_components/pull/839))

## 16.14.0

* Add attachment link (experimental) component ([PR #833](https://github.com/alphagov/govuk_publishing_components/pull/833))
* Add plek as a dependency ([PR #834](https://github.com/alphagov/govuk_publishing_components/pull/834))
* Provide `GovukPublishingComponents.render` method for rendering components outside of views ([PR #832](https://github.com/alphagov/govuk_publishing_components/pull/832))
* Remove govspeak dependency with kramdown for markdown rendering ([PR #827](https://github.com/alphagov/govuk_publishing_components/pull/827))

## 16.13.0

* Add an option to display search icon in input element ([PR #824](https://github.com/alphagov/govuk_publishing_components/pull/824))
* Permit Document List metadata fields to have nil values. ([PR #828](https://github.com/alphagov/govuk_publishing_components/pull/828))
* Upgrade to GOV.UK Frontend version 2.11.0. ([PR #826](https://github.com/alphagov/govuk_publishing_components/pull/826))

## 16.12.0

* Fire GA event when cookie banner isn't shown, instead of when it is ([PR #821](https://github.com/alphagov/govuk_publishing_components/pull/821))

## 16.11.0

* Fix script in header component not being compatible with the govuk_template script ([PR #818](https://github.com/alphagov/govuk_publishing_components/pull/818))
* Upgrade to govuk-frontend 2.10.0 ([PR #817](https://github.com/alphagov/govuk_publishing_components/pull/817))

## 16.10.1

* Enforce compatibility with deprecated packages for media print stylesheet ([PR #815](https://github.com/alphagov/govuk_publishing_components/pull/815))

## 16.10.0

* Support dynamic resizing of the modal component ([PR #812](https://github.com/alphagov/govuk_publishing_components/pull/812))

## 16.9.2

* Correct breadcrumb structured data for missing URL ([PR #810](https://github.com/alphagov/govuk_publishing_components/pull/810))
* Fix the modal component to prevent the page from scrolling behind it when open ([PR #805](https://github.com/alphagov/govuk_publishing_components/pull/805))

## 16.9.1

* Fix margin spacing for small form subscription links ([PR #808](https://github.com/alphagov/govuk_publishing_components/pull/808))
* Use relative path for linking to the cookies help page from the Cookie banner ([PR #807](https://github.com/alphagov/govuk_publishing_components/pull/807))

## 16.9.0

* Control when checkboxes change event sends Google Analytics tracking info ([PR #801](https://github.com/alphagov/govuk_publishing_components/pull/801))
* Updates govuk-frontend from 2.5.1 to 2.9.0 ([PR #794](https://github.com/alphagov/govuk_publishing_components/pull/794))
* Adds small form option to subscription component ([PR #803](https://github.com/alphagov/govuk_publishing_components/pull/803))
* Suppress subscription components heading ([PR #804](https://github.com/alphagov/govuk_publishing_components/pull/804))

## 16.8.0

* Add date input component based on GOV.UK Frontend ([PR #792](https://github.com/alphagov/govuk_publishing_components/pull/792))
* Add cookie banner component and migrate the remaining [govuk-template.js](https://github.com/alphagov/govuk_template/blob/master/source/assets/javascripts/govuk-template.js) scripts from [govuk_template](https://github.com/alphagov/govuk_template/) ([PR #795](https://github.com/alphagov/govuk_publishing_components/pull/795))

## 16.7.0

* Update fieldset component to use GOV.UK Frontend styles ([PR #791](https://github.com/alphagov/govuk_publishing_components/pull/791))
* Add width option to input component ([PR #790](https://github.com/alphagov/govuk_publishing_components/pull/790))
* Add tracking to toggle.js ([PR #796](https://github.com/alphagov/govuk_publishing_components/pull/796))

## 16.6.0

* Allow custom name attribute on search input ([PR #787](https://github.com/alphagov/govuk_publishing_components/pull/787))
* Suppress search components submit button ([PR #786](https://github.com/alphagov/govuk_publishing_components/pull/786))
* Fixes issue in test for consultations header link ([PR #788](https://github.com/alphagov/govuk_publishing_components/pull/788))

## 16.5.0

* Change consultations header link to link to new finders ([PR #783](https://github.com/alphagov/govuk_publishing_components/pull/783))

## 16.4.0

* Add `autocomplete` attribute option to input component and use it on feedback component's survey signup form ([PR #733](https://github.com/alphagov/govuk_publishing_components/pull/733))
* Add experimental modal dialogue component from Content Publisher ([PR #778](https://github.com/alphagov/govuk_publishing_components/pull/778))

## 16.3.0

* Fix issue embedding videos in govspeak after YouTube API is loaded ([PR #775](https://github.com/alphagov/govuk_publishing_components/pull/775))

## 16.2.0

* BREAKING: Reduce checkboxes markup ([PR #767](https://github.com/alphagov/govuk_publishing_components/pull/767))
* Support data attributes for the back-link component ([PR #773](https://github.com/alphagov/govuk_publishing_components/pull/773))
* Create shared helper for components ([PR #759](https://github.com/alphagov/govuk_publishing_components/pull/759))
* Use delegated event handlers for checkbox events ([PR #770](https://github.com/alphagov/govuk_publishing_components/pull/770))
* Add margin option to details component ([PR #768](https://github.com/alphagov/govuk_publishing_components/pull/768))

## 16.1.0

* Enable ability to add data attributes to a single radio button ([PR #766](https://github.com/alphagov/govuk_publishing_components/pull/766))

## 16.0.0

* BREAKING: Apply JS enhancements to govspeak ([PR #751](https://github.com/alphagov/govuk_publishing_components/pull/751))
* Refactor accessible autocomplete ([PR #764](https://github.com/alphagov/govuk_publishing_components/pull/764))
* Remove autocomplete hide facets option ([PR #761](https://github.com/alphagov/govuk_publishing_components/pull/761))
* Enable rendering an open details element ([PR #762](https://github.com/alphagov/govuk_publishing_components/pull/762))
* Remove classes option from inset-text, label, radio and warning-text components ([PR #727](https://github.com/alphagov/govuk_publishing_components/pull/727))
* Add margin option to textarea component ([PR #757](https://github.com/alphagov/govuk_publishing_components/pull/757))
* Update alert components to use consistent bottom margin ([PR #765](https://github.com/alphagov/govuk_publishing_components/pull/765))
* Change header link from Announcements to News and communications ([PR #752](https://github.com/alphagov/govuk_publishing_components/pull/752))

## 15.3.0

* Update skip-link to allow custom link text ([PR #755](https://github.com/alphagov/govuk_publishing_components/pull/755))
* Support an embed option on examples to allow embedding a component in a particular HTML context ([PR #747](https://github.com/alphagov/govuk_publishing_components/pull/747))

## 15.2.0

* Add margin option to subscription links ([PR #748](https://github.com/alphagov/govuk_publishing_components/pull/748))
* Add multiple selection option to autocomplete ([PR #723](https://github.com/alphagov/govuk_publishing_components/pull/723))

## 15.1.0

* Add description option to notice component ([PR #740](https://github.com/alphagov/govuk_publishing_components/pull/740), [PR #742](https://github.com/alphagov/govuk_publishing_components/pull/742))

## 15.0.0

* BREAKING: Adds custom event category for checkbox change events. Any app with it's own tracking logic for checkboxes will need to remove it ([PR #729](https://github.com/alphagov/govuk_publishing_components/pull/729))

## 14.0.0

* BREAKING: Add govuk-frontend spacing scale to hint ([PR #724](https://github.com/alphagov/govuk_publishing_components/pull/724))
* Increase focus contrast of feedback links ([PR #731](https://github.com/alphagov/govuk_publishing_components/pull/731))

## 13.8.1

* Fix autocomplete to allow it to handle HTML entities in the select list ([PR #728](https://github.com/alphagov/govuk_publishing_components/pull/728))

## 13.8.0

* Update contextual breadcrumbs to not show taxonomy breadcrumbs when showing specialist documents ([PR #725](https://github.com/alphagov/govuk_publishing_components/pull/725))

## 13.7.0

* Extend accessible autocomplete onConfirm function ([PR #718](https://github.com/alphagov/govuk_publishing_components/pull/718))
* Add Accordion component based on GOV.UK Frontend ([PR #714](https://github.com/alphagov/govuk_publishing_components/pull/714))
* Add type option to button component ([PR #711](https://github.com/alphagov/govuk_publishing_components/pull/711))

## 13.6.1

* Extend toggle module ([PR #712](https://github.com/alphagov/govuk_publishing_components/pull/712))

## 13.6.0

* Add search to component guide ([PR #706](https://github.com/alphagov/govuk_publishing_components/pull/706))

## 13.5.4

* Allow navigation items to only show in collapsed menu ([PR #691](https://github.com/alphagov/govuk_publishing_components/pull/691))
* Update panel component to support prepended and appended content ([PR #701](https://github.com/alphagov/govuk_publishing_components/pull/701))

## 13.5.3

* Update error-summary component to use govuk-frontend styles ([PR #692](https://github.com/alphagov/govuk_publishing_components/pull/692))
* Fix issues with data submission in the Feedback component ([PR #698](https://github.com/alphagov/govuk_publishing_components/pull/698), [PR #699](https://github.com/alphagov/govuk_publishing_components/pull/699), [PR #700](https://github.com/alphagov/govuk_publishing_components/pull/700))

## 13.5.2

* Improve autocomplete appearance without js ([PR #695](https://github.com/alphagov/govuk_publishing_components/pull/695))
* Adds tracking to select component ([PR #690](https://github.com/alphagov/govuk_publishing_components/pull/690))

## 13.5.1

* Add value check to accessible autocomplete custom onConfirm function ([PR #693](https://github.com/alphagov/govuk_publishing_components/pull/693))
* Move all commonly used imports into all_components.scss ([PR #683](https://github.com/alphagov/govuk_publishing_components/pull/683))

## 13.5.0

* Allow heading on single checkbox ([PR #686](https://github.com/alphagov/govuk_publishing_components/pull/686))

## 13.4.0

* Change heading/legend/hint options on checkboxes component ([PR #684](https://github.com/alphagov/govuk_publishing_components/pull/684))

## 13.3.0

* Put margin bottom on autocomplete ([PR #680](https://github.com/alphagov/govuk_publishing_components/pull/680))
* Adds hidden class to conditional reveals for radio to resolve flicker issue ([PR #679](https://github.com/alphagov/govuk_publishing_components/pull/679))
* Limit hint styles to checkboxes ([PR #681](https://github.com/alphagov/govuk_publishing_components/pull/681))

## 13.2.0

* Add guard for user agent and url being nil in feedback ([PR #677](https://github.com/alphagov/govuk_publishing_components/pull/677))

## 13.1.0

* Accessible autocomplete triggers change if tracking data is supplied ([PR #666](https://github.com/alphagov/govuk_publishing_components/pull/666))

## 13.0.0

* Encode feedback component to ensure UTF-8 characters are rendered ([PR #673](https://github.com/alphagov/govuk_publishing_components/pull/673))
* Fix autocomplete styles ([PR #671](https://github.com/alphagov/govuk_publishing_components/pull/671))
* BREAKING: Merge checkbox components ([PR #659](https://github.com/alphagov/govuk_publishing_components/pull/659))
* Accept a maxlength attribute for input ([PR #670](https://github.com/alphagov/govuk_publishing_components/pull/670))

## 12.21.0

* Retires the taxonomy navigation component ([PR #606](https://github.com/alphagov/govuk_publishing_components/pull/606))
* Introduces a new contextual footer component ([PR #606](https://github.com/alphagov/govuk_publishing_components/pull/606))
* Use ERB comments not HTML comments in template markup ([PR #667](https://github.com/alphagov/govuk_publishing_components/pull/667))
* Layout footer component now accepts an attributes hash for each link element ([PR #664](https://github.com/alphagov/govuk_publishing_components/pull/664))

## 12.20.0

* Error alert supports data attributes on root element ([PR #662](https://github.com/alphagov/govuk_publishing_components/pull/662))
* Error summary supports data attributes on root element ([PR #662](https://github.com/alphagov/govuk_publishing_components/pull/662))

## 12.19.0

* Tabs supports data attributes on the tab element ([PR #660](https://github.com/alphagov/govuk_publishing_components/pull/660))
* Details supports data attributes on root element ([PR #660](https://github.com/alphagov/govuk_publishing_components/pull/660))
* Copy to clipboard supports data attributes for the input element ([PR #660](https://github.com/alphagov/govuk_publishing_components/pull/660))
* Put nested checkboxes into lists to add support for screen readers ([PR #642](https://github.com/alphagov/govuk_publishing_components/pull/642))

## 12.18.0

* Add inverse option to metadata component ([PR #657](https://github.com/alphagov/govuk_publishing_components/pull/657))
* Modify warning text component ([PR #655](https://github.com/alphagov/govuk_publishing_components/pull/655))

## 12.17.0

* Add data attributes to select component ([PR #650](https://github.com/alphagov/govuk_publishing_components/pull/650))

## 12.16.0

* Update components for finders ([PR #643](https://github.com/alphagov/govuk_publishing_components/pull/643))

## 12.15.0

* Support embedding content inside textarea formgroup ([PR #649](https://github.com/alphagov/govuk_publishing_components/pull/649))
* Accept a maxlength attribute for textarea ([PR #649](https://github.com/alphagov/govuk_publishing_components/pull/649))

## 12.14.1

* Edit ERB view to prevent invalid HTML generation. ([PR #647](https://github.com/alphagov/govuk_publishing_components/pull/647))

## 12.14.0

* Add accessible autocomplete component. ([PR #621](https://github.com/alphagov/govuk_publishing_components/pull/621))
* Descope govuk-frontend styles in the admin layout ([PR #646](https://github.com/alphagov/govuk_publishing_components/pull/646))

## 12.13.0

* Add heading options to radio component ([PR #635](https://github.com/alphagov/govuk_publishing_components/pull/635))
* Add tests for checkbox JS (PR# 636)

## 12.12.1

* Corrects name for checkboxes documentation ([PR #638](https://github.com/alphagov/govuk_publishing_components/pull/638))

## 12.12.0

* Add a readonly option to input component ([PR #633](https://github.com/alphagov/govuk_publishing_components/pull/633))
* Copy to clipboard is readonly and selects input on click ([PR #633](https://github.com/alphagov/govuk_publishing_components/pull/633))
* Copy to clipboard supports data attributes for the button element ([PR #633](https://github.com/alphagov/govuk_publishing_components/pull/633))
* Update back link component to allow injection of custom text ([PR #628](https://github.com/alphagov/govuk_publishing_components/pull/628))
* Update panel component to only render div if description is provided ([PR #628](https://github.com/alphagov/govuk_publishing_components/pull/628))

## 12.11.0

* Make the legend as page heading optional ([PR #630](https://github.com/alphagov/govuk_publishing_components/pull/630))

## 12.10.0

* Add support to checkboxes to allow nested checkboxes and add new checkbox component ([PR #626](https://github.com/alphagov/govuk_publishing_components/pull/626))

## 12.9.1

* Fix showing multiple error items in a form field ([PR #625](https://github.com/alphagov/govuk_publishing_components/pull/625))

## 12.9.0

* Add option to checkboxes to allow preselected items ([PR #623](https://github.com/alphagov/govuk_publishing_components/pull/623))

## 12.8.0

* Add 'error_items' option for input, radio, textarea and file upload components ([PR #615](https://github.com/alphagov/govuk_publishing_components/pull/615))
* Update layout header to allow a full width option ([PR #616](https://github.com/alphagov/govuk_publishing_components/pull/616))
* Correctly import the govspeak-html-publication component ([PR #618](https://github.com/alphagov/govuk_publishing_components/pull/618))

## 12.7.1

* Update phase banner component to use GOV.UK Frontend styles ([PR #613](https://github.com/alphagov/govuk_publishing_components/pull/613))
* Update phase banner component to support application name ([PR #613](https://github.com/alphagov/govuk_publishing_components/pull/613))

## 12.6.0

* Adds separate tracking data for a link to the homepage on breadcrumbs ([PR #610](https://github.com/alphagov/govuk_publishing_components/pull/610))

## 12.5.0

* Add a hidden 'Maybe' option to the feedback component. ([PR #608](https://github.com/alphagov/govuk_publishing_components/pull/608))

## 12.4.0

* Updates current breadcrumbs components to be based on GOV.UK Frontend ([PR #593](https://github.com/alphagov/govuk_publishing_components/pull/593))
* Expands image card component to handle smaller images gracefully ([PR #605](https://github.com/alphagov/govuk_publishing_components/pull/605))

## 12.3.0

* Expose a high resolution image in meta tags ([PR #592](https://github.com/alphagov/govuk_publishing_components/pull/592))
* Add Warning text component based on GOV.UK Frontend ([PR #588](https://github.com/alphagov/govuk_publishing_components/pull/588))
* Add Checkboxes component based on GOV.UK Frontend ([PR #590](https://github.com/alphagov/govuk_publishing_components/pull/590))

## 12.2.0

* Fix regression for buttons in govspeak section ([PR #582](https://github.com/alphagov/govuk_publishing_components/pull/582))
* Add character count component based on GOV.UK Frontend ([PR #583](https://github.com/alphagov/govuk_publishing_components/pull/583))

## 12.1.0

* Add option to send the `user_organisation` in admin analytics component ([PR #577](https://github.com/alphagov/govuk_publishing_components/pull/577))
* Add a bottom margin to the error-alert component ([PR #578](https://github.com/alphagov/govuk_publishing_components/pull/578))
* Update the way we include Javascript and Stylesheets in the admin layout
  component. Make sure to follow the [installation instructions](docs/install-and-use.md) ([PR #571](https://github.com/alphagov/govuk_publishing_components/pull/571)) if your using the admin layout component.
* Fix background colour for focused buttons ([PR #579](https://github.com/alphagov/govuk_publishing_components/pull/579))

## 12.0.1

* Add a bottom margin to the success-alert component ([PR #573](https://github.com/alphagov/govuk_publishing_components/pull/573))

## 12.0.0

* Append the product name to the browser title ([PR #563](https://github.com/alphagov/govuk_publishing_components/pull/563))
* BREAKING: Remove Slimmer as a dependency
This comprises many minor changes to components so they no longer rely on
Static provided stylesheets.
- If your app uses Slimmer, the component guide will no longer use it and you
  can no longer rely on any resets/global rules provided
- If your app removes the Slimmer middleware this will now break as Slimmer
  will be an undefined constant
- Apps which the admin layout no longer need to include jQuery as this comes
  bundled in the admin scripts.
* Use a purple environment colour on Heroku ([PR #566](https://github.com/alphagov/govuk_publishing_components/pull/566)). Make sure to add a `HEROKU` environment variable to Heroku instances.
* Use a red favicon colour on production ([PR #566](https://github.com/alphagov/govuk_publishing_components/pull/566))

## 11.2.0

* Fix toggle behaviour in related navigation and taxonomy navigation when JS disabled ([PR #551](https://github.com/alphagov/govuk_publishing_components/pull/551))
* Make "GOV.UK Publishing" the default product name ([PR #557](https://github.com/alphagov/govuk_publishing_components/pull/557) and [PR #561](https://github.com/alphagov/govuk_publishing_components/pull/561))
* Change the colour of production to red ([PR #557](https://github.com/alphagov/govuk_publishing_components/pull/557))
* Add environment tag in the header for all environments ([PR #557](https://github.com/alphagov/govuk_publishing_components/pull/557))

## 11.1.0

* Add Admin analytics script ([PR #555](https://github.com/alphagov/govuk_publishing_components/pull/555))
* You can now use `GovukPublishingComponents::AppHelpers::Environment.current_acceptance_environment` to get the current environment, for use in the admin layout components ([PR #548](https://github.com/alphagov/govuk_publishing_components/pull/548))
* Update GOV.UK Frontend from 1.2.0 to 2.1.0 and manage breaking changes ([PR #545](https://github.com/alphagov/govuk_publishing_components/pull/545))
* Add navigation and meta links to footer component ([PR #550](https://github.com/alphagov/govuk_publishing_components/pull/550))
* Allow autofocus on input component ([PR #552](https://github.com/alphagov/govuk_publishing_components/pull/552))
* Fix label in component guide ([PR #553](https://github.com/alphagov/govuk_publishing_components/pull/553))

## 11.0.0

* BREAKING: Use time element in image card component, breaking change.
This will require an update to usages of the image card component.
The way in which context information is passed to the component has changed from `context: "some context"` to `context: {text: "some context", date: "2017-06-14"`}

## 10.2.0

* Add data-tracking-url for radio inputs for the purposes of cross domain tracking ([PR #539](https://github.com/alphagov/govuk_publishing_components/pull/539))

## 10.1.0

* Add isPartOf schema to content with document collections ([PR #542](https://github.com/alphagov/govuk_publishing_components/pull/542))

## 10.0.0

* BREAKING: Code related to `Policies` has been removed, including the
`related_policies` method. This shouldn't be used anymore, as all `Policies`
are being unpublished. Use the new single Topic Taxonomy instead. ([PR #540](https://github.com/alphagov/govuk_publishing_components/pull/540))

## 9.28.0

* Show step by step when the navigation is disabled but a user is actively interacting with the step by step ([PR #535](https://github.com/alphagov/govuk_publishing_components/pull/535))

## 9.27.0

* Remove 'Policies' link from government navbar ([PR #529](https://github.com/alphagov/govuk_publishing_components/pull/529))

## 9.26.1

* Add parentOrganization and subOrganization properties to org schemas ([PR #533](https://github.com/alphagov/govuk_publishing_components/pull/533))
* Remove RummagerTaxonomySidebarLinks from contextual navigation ([PR #530](https://github.com/alphagov/govuk_publishing_components/pull/530))

## 9.26.0

* Add table component ([PR #531](https://github.com/alphagov/govuk_publishing_components/pull/531))
* Add destructive modifier to button component ([PR #523](https://github.com/alphagov/govuk_publishing_components/pull/523))

## 9.25.0

* Add a hasPart schema to collection pages ([PR #522](https://github.com/alphagov/govuk_publishing_components/pull/522))

## 9.24.0

* Insert component guide script elements before closing body element ([PR #525](https://github.com/alphagov/govuk_publishing_components/pull/525))

## 9.23.0

* Add half_width flag for higlight boxes ([PR #520](https://github.com/alphagov/govuk_publishing_components/pull/520))

## 9.22.0

* Refactor header component to provide options for head or list ([PR #516](https://github.com/alphagov/govuk_publishing_components/pull/516))

## 9.21.0

* Add file upload component based on GOV.UK Frontend ([PR #515](https://github.com/alphagov/govuk_publishing_components/pull/515))
* Use divs for the alert message bodies ([PR #517](https://github.com/alphagov/govuk_publishing_components/pull/517))

## 9.20.0

* Pass label params through for input component ([PR #512](https://github.com/alphagov/govuk_publishing_components/pull/512))

## 9.19.0

* Make 'title' optional on error_summary component ([PR #510](https://github.com/alphagov/govuk_publishing_components/pull/510))
* Make 'href' optional for items in the error_summary ([PR #510](https://github.com/alphagov/govuk_publishing_components/pull/510))

## 9.18.0

* Show relevant step by step nav based on user journey ([PR #501](https://github.com/alphagov/govuk_publishing_components/pull/501))
* Add Error alert component ([PR #503](https://github.com/alphagov/govuk_publishing_components/pull/503))
* Add experimental panel component based on GOV.UK Frontend ([PR #507](https://github.com/alphagov/govuk_publishing_components/pull/507))
* Adds step by step content ID to links inside steps ([PR #502](https://github.com/alphagov/govuk_publishing_components/pull/502))
* Pass through label params from textarea component ([PR #508](https://github.com/alphagov/govuk_publishing_components/pull/508))

## 9.17.1

* Fix bug in success alert component ([PR #503](https://github.com/alphagov/govuk_publishing_components/pull/503))

## 9.17

* Support a description for Success Alert component ([PR #499](https://github.com/alphagov/govuk_publishing_components/pull/499))
* Bugfix for Radios component ([PR #496](https://github.com/alphagov/govuk_publishing_components/pull/496))
* Fix for Google Tag Manager component ([PR #497](https://github.com/alphagov/govuk_publishing_components/pull/497))
* Add Copy to clipboard component ([PR #494](https://github.com/alphagov/govuk_publishing_components/pull/494))

## 9.16.1

* Bugfix for Google Tag Manager component ([PR #492](https://github.com/alphagov/govuk_publishing_components/pull/492))

## 9.16.0

* Allow target attribute for links generated with the button component ([PR #488](https://github.com/alphagov/govuk_publishing_components/pull/488))
* Add Google Tag Manager script as component ([PR #489](https://github.com/alphagov/govuk_publishing_components/pull/489))

## 9.15.0

* Update tabs component to make the heading inside the panel optional and to add a modifier for panel without border ([PR #485](https://github.com/alphagov/govuk_publishing_components/pull/485))
* Add secondary and secondary quiet modifiers to button component ([PR #484](https://github.com/alphagov/govuk_publishing_components/pull/484))

## 9.14.0

* Add the 'about' property for the schema.org schema for an Article with live taxons ([PR #482](https://github.com/alphagov/govuk_publishing_components/pull/482))
* Improve step by step component double dot problem solving code ([PR #473](https://github.com/alphagov/govuk_publishing_components/pull/473))

## 9.13.0

* Allow custom tags in `<head>` for admin layout ([PR #480](https://github.com/alphagov/govuk_publishing_components/pull/480))
* Adds taxonomy list component ([PR #476](https://github.com/alphagov/govuk_publishing_components/pull/476))

## 9.12.2

* Remove fixed 'name=button' attribute for buttons, to avoid them becoming a form param ([PR #479](https://github.com/alphagov/govuk_publishing_components/pull/479))

## 9.12.1

* Renames the publishing-app metatag to publishing-application, to be consistent with rendering-application ([PR #475](https://github.com/alphagov/govuk_publishing_components/pull/475))

## 9.12.0

* Adds publishing-app metatag ([PR #470](https://github.com/alphagov/govuk_publishing_components/pull/470))

## 9.11.0

* Add data attributes and spellcheck support for textarea component ([PR #468](https://github.com/alphagov/govuk_publishing_components/pull/468))
* Add data attributes support for input component ([PR #469](https://github.com/alphagov/govuk_publishing_components/pull/469))
* Relevant step by step should now be open inside simple smart answers ([PR #472](https://github.com/alphagov/govuk_publishing_components/pull/472))

## 9.10.0

* Enables bold styling in govspeak blocks, removes rich govspeak feature ([PR #463](https://github.com/alphagov/govuk_publishing_components/pull/463))

## 9.9.1

* Stop document list rendering titles as headings ([PR #465](https://github.com/alphagov/govuk_publishing_components/pull/465))

## 9.9.0

* Step by step component, Google snippet improvement ([PR #461](https://github.com/alphagov/govuk_publishing_components/pull/461))
* Add tabs component ([PR #455](https://github.com/alphagov/govuk_publishing_components/pull/455))
* Adds styling for singular related step by step navs ([PR #458](https://github.com/alphagov/govuk_publishing_components/pull/458))
* Add schema.org `isPartOf` links from articles to step by steps ([PR #384](https://github.com/alphagov/govuk_publishing_components/pull/384))

## 9.8.0

* Add error message and hint components based on GOV.UK Frontend ([PR #446](https://github.com/alphagov/govuk_publishing_components/pull/446))
* Update feedback component to use GOV.UK Frontend styles ([PR #447](https://github.com/alphagov/govuk_publishing_components/pull/447))
* Remove brackets from show/hide links ([PR #448](https://github.com/alphagov/govuk_publishing_components/pull/448))
* Add experimental inset text component based on GOV.UK Frontend ([PR #449](https://github.com/alphagov/govuk_publishing_components/pull/449))
* Add experimental textarea component based on GOV.UK Frontend ([PR #450](https://github.com/alphagov/govuk_publishing_components/pull/450))
* Add reset styles to document list component ([PR #451](https://github.com/alphagov/govuk_publishing_components/pull/451))
* Add tests for contextual breadcrumbs ([PR #457](https://github.com/alphagov/govuk_publishing_components/pull/457))
* Allow prioritising taxonomy breadcrumbs ([PR #457](https://github.com/alphagov/govuk_publishing_components/pull/457))
* Contextual breadcrumbs will show taxon based breadcrumbs if prioritise_taxon_breadcrumbs is true (defaults to false if not passed) ([PR #457](https://github.com/alphagov/govuk_publishing_components/pull/457))

## 9.7.0

* Update radio component to use GOV.UK Frontend styles ([PR #433](https://github.com/alphagov/govuk_publishing_components/pull/433))
* Update button component to use GOV.UK Frontend styles ([PR #439](https://github.com/alphagov/govuk_publishing_components/pull/439))
* Update back-link component to use GOV.UK Frontend styles ([PR #440](https://github.com/alphagov/govuk_publishing_components/pull/440))
* Add conditional reveal support for radios using GOV.UK Frontend scripts ([PR #441](https://github.com/alphagov/govuk_publishing_components/pull/441))
* Update input component to use GOV.UK Frontend styles ([PR #442](https://github.com/alphagov/govuk_publishing_components/pull/442))
* Update label component to use GOV.UK Frontend styles ([PR #443](https://github.com/alphagov/govuk_publishing_components/pull/443))
* Upgrade to the latest version of the Design System ([PR #444](https://github.com/alphagov/govuk_publishing_components/pull/444))

## 9.6.0

* Change breadcrumb class name ([PR #435](https://github.com/alphagov/govuk_publishing_components/pull/435))
* Add admin component for select ([PR #434](https://github.com/alphagov/govuk_publishing_components/pull/434))
* Extend the double dot problem solution ([PR #432](https://github.com/alphagov/govuk_publishing_components/pull/432))

## 9.5.3

* Improve metadata positioning in document list for rtl layouts ([PR #429](https://github.com/alphagov/govuk_publishing_components/pull/429))
* Add favicon to admin layout ([PR #426](https://github.com/alphagov/govuk_publishing_components/pull/426))
* Disable GOV.UK Frontend global styles ([PR #427](https://github.com/alphagov/govuk_publishing_components/pull/427))
* Replace the location URL sent to Google Analytics with one that masks email addresses ([PR #428](https://github.com/alphagov/govuk_publishing_components/pull/428))

## 9.5.2

* Attempt to improve Google snippet display ([PR #424](https://github.com/alphagov/govuk_publishing_components/pull/424))
* Add JavaScript detection, HTML5 shim and IE8 stylesheet to admin layout ([PR #419](https://github.com/alphagov/govuk_publishing_components/pull/419))

## 9.5.1

* Extends the page title component to add in margin_bottom ([PR #419](https://github.com/alphagov/govuk_publishing_components/pull/419))
* Fix the step by step title sizing and spacing on mobile when it appears as a footer ([PR #413](https://github.com/alphagov/govuk_publishing_components/pull/413))

## 9.5.0

* Improve step nav 'remember open steps' code ([PR #406](https://github.com/alphagov/govuk_publishing_components/pull/406))
* The Notice component now accepts blocks ([PR #407](https://github.com/alphagov/govuk_publishing_components/pull/407))
* Add experimental layout-header component based on GOV.UK Frontend ([PR #408](https://github.com/alphagov/govuk_publishing_components/pull/408))
* Add robots nofollow meta tag to admin layout ([PR #409](https://github.com/alphagov/govuk_publishing_components/pull/409))
* Improve the accessibility of the previous/next arrows on mainstream guides ([PR #410](https://github.com/alphagov/govuk_publishing_components/pull/410))
* Import and initialise GOV.UK Frontend scripts in the admin layout ([PR #415](https://github.com/alphagov/govuk_publishing_components/pull/415))
* Remove unneeded options from step nav component ([PR #416](https://github.com/alphagov/govuk_publishing_components/pull/416))
* Add experimental skip link component based on GOV.UK Frontend ([PR #417](https://github.com/alphagov/govuk_publishing_components/pull/417))
* Add CSRF meta tag to admin layout ([PR #418](https://github.com/alphagov/govuk_publishing_components/pull/418))

## 9.4.0

* Add experimental admin layout ([PR #371](https://github.com/alphagov/govuk_publishing_components/pull/371))
* Add the [GOV.UK Frontend](https://design-system.service.gov.uk/) library to the gem ([PR #398](https://github.com/alphagov/govuk_publishing_components/pull/398))
* Allow linking to the Design System on component pages ([PR #401](https://github.com/alphagov/govuk_publishing_components/pull/401))
* Add govuk:analytics:organisations meta tag if the current page is an organisation ([PR #397](https://github.com/alphagov/govuk_publishing_components/pull/397))
* Move the highlight box component from Collections to the gem ([PR #403](https://github.com/alphagov/govuk_publishing_components/pull/403))
* Add experimental layout-footer component based on GOV.UK Frontend ([PR #404](https://github.com/alphagov/govuk_publishing_components/pull/404))

## 9.3.6

* Make heading tag optional on image card ([PR #394](https://github.com/alphagov/govuk_publishing_components/pull/394))

## 9.3.5

* Extend image card to support html description ([PR #392](https://github.com/alphagov/govuk_publishing_components/pull/392))

## 9.3.4

* Adjust metadata spacing in image card ([PR #390](https://github.com/alphagov/govuk_publishing_components/pull/390))
* Fix focus states in branding model ([PR #389](https://github.com/alphagov/govuk_publishing_components/pull/389))

## 9.3.3

* Add explicit Civil Service branding ([PR #387](https://github.com/alphagov/govuk_publishing_components/pull/387))

## 9.3.2

* Fix heading structure in feedback component ([PR #385](https://github.com/alphagov/govuk_publishing_components/pull/385))

## 9.3.1

* Allow image card component to not have main link ([PR #382](https://github.com/alphagov/govuk_publishing_components/pull/382))

## 9.3.0

* Add Metadata component from Static ([PR #374](https://github.com/alphagov/govuk_publishing_components/pull/374))
* Remove the special casing to run this component in Static ([PR #379](https://github.com/alphagov/govuk_publishing_components/pull/379))

## 9.2.3

* Add metadata to image card component ([PR #377](https://github.com/alphagov/govuk_publishing_components/pull/377))
* Modify share links component ([PR #376](https://github.com/alphagov/govuk_publishing_components/pull/376))
* Remove underline on image card title link ([PR #375](https://github.com/alphagov/govuk_publishing_components/pull/375))

## 9.2.2

* Add no10 to the branding model ([PR #372](https://github.com/alphagov/govuk_publishing_components/pull/372))

## 9.2.1

* Add no margin top option to translation nav ([PR #368](https://github.com/alphagov/govuk_publishing_components/pull/368))

## 9.2.0

* Add organisation logo component from static ([PR #365](https://github.com/alphagov/govuk_publishing_components/pull/365))
* Tweaks document list spacing for context text on smaller screens ([PR #363](https://github.com/alphagov/govuk_publishing_components/pull/363))
* Makes heading component use h2 by default ([PR #362](https://github.com/alphagov/govuk_publishing_components/pull/362))

## 9.1.1

* Add placeholders for pages that don't have an image (#359)
* It is no longer allowed to pass in unsafe HTML into the Govspeak component (#356).
  This will result in a warning for now, but in a future version this will become
  an error.

### How to upgrade

Change instances like this:

```erb
<%= render 'govuk_publishing_components/components/govspeak', content:
"<p>Foo #{bar}</p>" %>
```

into the following safe version:

```erb
<%= render 'govuk_publishing_components/components/govspeak' do %>
  <p>Foo <%= bar %></p>
<% end %>
```

This will prevent XSS vulnerabilities where `bar` is user input.

## 9.1.0

* Extend the document list component ([PR #355](https://github.com/alphagov/govuk_publishing_components/pull/355))
* Remove policies from the taxonomy navigation sidebar ([PR #357](https://github.com/alphagov/govuk_publishing_components/pull/357))

## 9.0.1

* The component guide is no longer using `Slimmer::GovukComponents`, so this
  gem can now be used with [Slimmer 13.0.0][s13] ([PR #353](https://github.com/alphagov/govuk_publishing_components/pull/353))

[s13]: https://github.com/alphagov/slimmer/blob/master/CHANGELOG.md#1300

## 9.0.0

* Import images for the button component from static ([PR #338](https://github.com/alphagov/govuk_publishing_components/pull/338))
* Add contents list component ([PR #342](https://github.com/alphagov/govuk_publishing_components/pull/342))
* BREAKING: Iterate share links component ([PR #316](https://github.com/alphagov/govuk_publishing_components/pull/316))
* Add image card component ([PR #322](https://github.com/alphagov/govuk_publishing_components/pull/322))
* Add notice component ([PR #346](https://github.com/alphagov/govuk_publishing_components/pull/346))
* Iterate contents list component ([PR #351](https://github.com/alphagov/govuk_publishing_components/pull/351))
* Add "person" schema to the Machine readable metadata component ([PR #343](https://github.com/alphagov/govuk_publishing_components/pull/343))

### Upgrade instructions

Replace the govspeak component by running the following:

```
find app/views -type f -print0 | xargs -0 sed -i '' 's/govuk_component\/govspeak/govuk_publishing_components\/components\/govspeak/
```

The share links component has changed fundamentally, the PR to update it in [government-frontend is here](https://github.com/alphagov/government-frontend/pull/906) and it isn't used in any other app yet.

## 8.2.0

* Add better meta tags for third parties to the "Machine readable metadata"
  component. If you're using this component you should remove any canonical
  tags, OpenGraph tags and Twitter cards ([PR #335](https://github.com/alphagov/govuk_publishing_components/pull/335))
* Move the Title component from static ([PR #324](https://github.com/alphagov/govuk_publishing_components/pull/324))
* Move the Lead paragraph component from static ([PR #325](https://github.com/alphagov/govuk_publishing_components/pull/325))
* Move the Next and previous component from static ([PR #329](https://github.com/alphagov/govuk_publishing_components/pull/329))
* Move the Government navigation component from static ([PR #334](https://github.com/alphagov/govuk_publishing_components/pull/334))
* Add a Phase banner component to replace the Alpha/Beta banners in Static ([PR #333](https://github.com/alphagov/govuk_publishing_components/pull/333))

### Upgrade instructions

Replace the Title and Lead paragraph by running the following:

```
find app/views -type f -print0 | xargs -0 sed -i '' 's/govuk_component\/previous_and_next_navigation/govuk_publishing_components\/components\/previous_and_next_navigation/g'
find app/views -type f -print0 | xargs -0 sed -i '' 's/govuk_component\/title/govuk_publishing_components\/components\/title/g'
find app/views -type f -print0 | xargs -0 sed -i '' 's/govuk_component\/lead_paragraph/govuk_publishing_components\/components\/lead_paragraph/g'
find app/views -type f -print0 | xargs -0 sed -i '' 's/govuk_component\/government_navigation/govuk_publishing_components\/components\/government_navigation/g'
```

Your tests are likely to need updating as well.

## 8.1.0

* Add the "Machine readable metadata" component ([PR #318](https://github.com/alphagov/govuk_publishing_components/pull/318))

## 8.0.1

* Fix a bug in subscription links attributes ([PR #314](https://github.com/alphagov/govuk_publishing_components/pull/314))

## 8.0.0

* BREAKING: The Button component no longer accepts unescaped HTML in the `info_text`,
  you'll have to call `html_safe` on it yourself. Probably the only affected
  application is `frontend` ([PR #305](https://github.com/alphagov/govuk_publishing_components/pull/305))
* BREAKING: Remove optional `canonical` meta tag (applications can add this tag explicitly if they need it)
* BREAKING: Iterate heading component ([PR #307](https://github.com/alphagov/govuk_publishing_components/pull/307))

* Use new breadcrumbs component in contextual breadcrumbs ([PR #313](https://github.com/alphagov/govuk_publishing_components/pull/313))
* Add share links component ([PR #308](https://github.com/alphagov/govuk_publishing_components/pull/308))
* Translation nav add brand and tracking ([PR #298](https://github.com/alphagov/govuk_publishing_components/pull/298))
* Subscription links add colour and tracking ([PR #299](https://github.com/alphagov/govuk_publishing_components/pull/299))
* Add breadcrumbs component ([PR #309](https://github.com/alphagov/govuk_publishing_components/pull/309)) with schema data ([PR #310](https://github.com/alphagov/govuk_publishing_components/pull/310))

## 7.3.0

* Fix automated a11y test error with input ([PR #303](https://github.com/alphagov/govuk_publishing_components/pull/303))
* Add an optional `canonical` meta tag ([PR #302](https://github.com/alphagov/govuk_publishing_components/pull/302))
* Iterate branding model ([PR #300](https://github.com/alphagov/govuk_publishing_components/pull/300))

## 7.2.0

* Add department colours to components ([PR #296](https://github.com/alphagov/govuk_publishing_components/pull/296))
* Modify subscription links component ([PR #294](https://github.com/alphagov/govuk_publishing_components/pull/294))

## 7.1.0

* Add subscription links component ([PR #290](https://github.com/alphagov/govuk_publishing_components/pull/290))
* Add translation nav component ([PR #289](https://github.com/alphagov/govuk_publishing_components/pull/289))
* Make components CSS available to static in the component guide ([PR #286](https://github.com/alphagov/govuk_publishing_components/pull/286))
* Add heading component ([PR #288](https://github.com/alphagov/govuk_publishing_components/pull/288))

## 7.0.0

* BREAKING: Breaks the search component (at the moment only used by finder-frontend, so if won't be breaking for other apps).
* Add an optional meta tag to signal dates should be stripped from
  data sent to Google Analytics. ([PR #282](https://github.com/alphagov/govuk_publishing_components/pull/282))

## 6.7.0

* Feedback component: send users a different survey ([PR #280](https://github.com/alphagov/govuk_publishing_components/pull/280))
* Add the Meta tags component. This component should be used in place of the
  "analytics meta tags" component in static. They have the same behaviour. ([PR #278](https://github.com/alphagov/govuk_publishing_components/pull/278))

## 6.6.0

* Show all mainstream browse pages in the sidebar ([PR #273](https://github.com/alphagov/govuk_publishing_components/pull/273))
* Show "normal" navigation in addition to step by step, make sidebars consistent ([PR #275](https://github.com/alphagov/govuk_publishing_components/pull/275))
* Simplify the internal logic of breadcrumbs and sidebar ([PR #277](https://github.com/alphagov/govuk_publishing_components/pull/277))

## 6.5.0

* Add button component ([PR #271](https://github.com/alphagov/govuk_publishing_components/pull/271))

## 6.4.0

* Move text for JS appended elements into step nav template ([PR #263](https://github.com/alphagov/govuk_publishing_components/pull/263))
* Add link to step nav research ([PR #261](https://github.com/alphagov/govuk_publishing_components/pull/261))
* Add search component ([PR #267](https://github.com/alphagov/govuk_publishing_components/pull/267))

## 6.3.0

* Remove bottom border for last item in document lists ([PR #266](https://github.com/alphagov/govuk_publishing_components/pull/266))
* Create success alert component ([PR #254](https://github.com/alphagov/govuk_publishing_components/pull/254))
* Add padding-top flag to inverse header

## 6.2.0

* Always use the related links sidebar for travel advice ([PR #264](https://github.com/alphagov/govuk_publishing_components/pull/264))
* Add padding-top flag to inverse header

## 6.1.0

* Add taxonomy navigation component, this will eventually supersede the static component.
  It may well be possible to merge with parts of the related navigation component as some
  of the functionality is shared between the two.

## 6.0.0

* Fix visited link colour on focus for white feedback links ([PR #239](https://github.com/alphagov/govuk_publishing_components/pull/239))
* Fix input error colour ([PR #241](https://github.com/alphagov/govuk_publishing_components/pull/241))
* Add helper for generating breadcrumbs on taxon and taxonomy-based finder pages ([PR #242](https://github.com/alphagov/govuk_publishing_components/pull/242))
* BREAKING: merge the [govuk_navigation_helpers][] gem into this project ([PR #244](https://github.com/alphagov/govuk_publishing_components/pull/244)). To upgrade, you will have to use the contextual navigation components ([sidebar](https://components.publishing.service.gov.uk/component-guide/contextual_sidebar) and [breadcrumbs](https://components.publishing.service.gov.uk/component-guide/contextual_breadcrumbs)) .

[govuk_navigation_helpers]: https://github.com/alphagov/govuk_navigation_helpers

## 5.7.0

* Restore underline to step nav related links links ([PR #236](https://github.com/alphagov/govuk_publishing_components/pull/236))
* Improve substep creation ([PR #231](https://github.com/alphagov/govuk_publishing_components/pull/231))
* Improve spacing of inverse header to allow it to replace publication header component in government-frontend ([PR #238](https://github.com/alphagov/govuk_publishing_components/pull/238))
* Improve list and link classnames ([PR #230](https://github.com/alphagov/govuk_publishing_components/pull/230))
* Remove preventLinkFollowingForCurrentTab code ([PR #229](https://github.com/alphagov/govuk_publishing_components/pull/229))

## 5.6.0

* Restore 'referer' field to feedback component form submission ([PR #232](https://github.com/alphagov/govuk_publishing_components/pull/232))
* Create single breadrumb and sidebar contextual navigation components. Not a breaking change, but you can drop `govuk_navigation_helpers` as a dependency now.
* You can now add require a single Javascript to include all components, just like CSS.

Replace all individual includes with:

```js
# application.js
//= require govuk_publishing_components/all_components
```

* Update document list component with smaller margin spacing ([PR #234](https://github.com/alphagov/govuk_publishing_components/pull/234))

## 5.5.6

* Add optional margin top flag for feedback component ([PR #222](https://github.com/alphagov/govuk_publishing_components/pull/222))

## 5.5.5

* Add optional flags for spacing around document list component ([PR #217](https://github.com/alphagov/govuk_publishing_components/pull/217))

## 5.5.4

* Make changes released in 5.5.3 backwards compatible.

## 5.5.3

* Enforce white content in inverse component ([PR #214](https://github.com/alphagov/govuk_publishing_components/pull/214)).

## 5.5.2

* Add `full-width` flag to remove left and right padding when using a full width page header ([PR #212](https://github.com/alphagov/govuk_publishing_components/pull/212)).
* Update design of document list component for topic pages ([PR #202](https://github.com/alphagov/govuk_publishing_components/pull/202))

## 5.5.1

* Fix bug in `related_navigation` helper that did not gracefully handle ordered
related items that aren't tagged to a mainstream browse page ([PR #210](https://github.com/alphagov/govuk_publishing_components/pull/210)).

## 5.5.0

* Add new inverse header component ([PR #203](https://github.com/alphagov/govuk_publishing_components/pull/203)).

## 5.4.1

* Remove worldwide organisation links from the payload used by the `related_navigation` component, as they're not required.
* Fix bug where the correct number of mainstream browse pages weren't displaying
in the `related_navigation` component in cases where a grandparent mainstream
browse page is present ([PR #205](https://github.com/alphagov/govuk_publishing_components/pull/205)).

## 5.4.0

* Add document_list component from government-frontend, so that it can be used by collections. This is not a breaking change, but it is not backwards compatible with previous versions of the component. ([PR #199](https://github.com/alphagov/govuk_publishing_components/pull/199))

## 5.3.0

* Add step by step navigation component helpers

## 5.2.3

* Feedback: add role button to links ([PR #193](https://github.com/alphagov/govuk_publishing_components/pull/193))
* Feedback: fix styling on older layouts ([PR #194](https://github.com/alphagov/govuk_publishing_components/pull/194))

## 5.2.2

* Feedback: add spacing above component ([PR #191](https://github.com/alphagov/govuk_publishing_components/pull/191))
* Feedback: set font sizes ([PR #190](https://github.com/alphagov/govuk_publishing_components/pull/190))
* Feedback: improve link spacing ([PR #188](https://github.com/alphagov/govuk_publishing_components/pull/188))

## 5.2.1

* Feedback: changes to the event tracking ([PR #184](https://github.com/alphagov/govuk_publishing_components/pull/184))
* Related Navigation: accessibility improvements ([PR #182](https://github.com/alphagov/govuk_publishing_components/pull/182))

## 5.2.0

* Add related_navigation component from government-frontend, so that it can also
be used by frontend. This is not a breaking change, but it is not backwards
compatible with previous versions of the component. ([PR #164](https://github.com/alphagov/govuk_publishing_components/pull/164))

## 5.1.3

* Accessibility fixes for the feedback component ([PR #173](https://github.com/alphagov/govuk_publishing_components/pull/173))

## 5.1.2

* Fix feedback component when JS disabled ([PR #175](https://github.com/alphagov/govuk_publishing_components/pull/175))
* Step nav accessibility changes ([PR #160](https://github.com/alphagov/govuk_publishing_components/pull/160))

## 5.1.1

* Improvements for the feedback component on mobile ([PR #168](https://github.com/alphagov/govuk_publishing_components/pull/168) and [PR #169](https://github.com/alphagov/govuk_publishing_components/pull/169))

## 5.1.0

* Support other a customisable type attribute for input component ([PR #165](https://github.com/alphagov/govuk_publishing_components/pull/165))
* Add unique tracking to all GA events on step nav components ([PR #162](https://github.com/alphagov/govuk_publishing_components/pull/162))
* Add feedback component ([PR #163](https://github.com/alphagov/govuk_publishing_components/pull/163))

## 5.0.0

* BREAKING: Rename task list components ([PR #156](https://github.com/alphagov/govuk_publishing_components/pull/156)), breaking change
* BREAKING: Remove task list groups ([PR #154](https://github.com/alphagov/govuk_publishing_components/pull/154)), breaking change

* To include the CSS for all components in the gem, you can now do:

```css
## application.scss
@import "govuk_publishing_components/all_components";
```

And for print styles

```css
## print.scss
@import "govuk_publishing_components/all_components_print";
```

## 4.1.1

* Fix Heroku review apps ([PR #149](https://github.com/alphagov/govuk_publishing_components/pull/149))
* Remove doubly included stylesheets ([PR #148](https://github.com/alphagov/govuk_publishing_components/pull/148))
* Update installation instructions ([PR #147](https://github.com/alphagov/govuk_publishing_components/pull/147))
* Refactor task list component code ([PR #143](https://github.com/alphagov/govuk_publishing_components/pull/143))
* Fix task list related namespace ([PR #141](https://github.com/alphagov/govuk_publishing_components/pull/141))

## 4.1.0

* Move error summary component into gem ([PR #138](https://github.com/alphagov/govuk_publishing_components/pull/138))

## 4.0.0

* BREAKING: Namespace hosted components with `govuk_publishing_components` ([PR #136](https://github.com/alphagov/govuk_publishing_components/pull/136))
  * References to components hosted in gem need to point to `govuk_publishing_components/components` rather than `/components`. This includes stylesheets, partials and javascripts.
  * References to task list print styles must be updated to point at the new /print subdirectory

## 3.3.0

* Move back link component in gem ([PR #131](https://github.com/alphagov/govuk_publishing_components/pull/131))

## 3.2.1

* Fix radio component not including welsh translation ([PR #128](https://github.com/alphagov/govuk_publishing_components/pull/128))

## 3.2.0

* Remove unneeded CSS from component guide ([PR #126](https://github.com/alphagov/govuk_publishing_components/pull/126))
* Add heading element into task list component and change get help link behaviour ([PR #113](https://github.com/alphagov/govuk_publishing_components/pull/113))
* Improve task list print styles ([PR #125](https://github.com/alphagov/govuk_publishing_components/pull/125))
* Move form components into gem ([PR #116](https://github.com/alphagov/govuk_publishing_components/pull/116))

## 3.1.0

* Add support for components which accept a block ([PR #117](https://github.com/alphagov/govuk_publishing_components/pull/117))

## 3.0.3

* Sort components by name in the component list ([PR #114](https://github.com/alphagov/govuk_publishing_components/pull/114))
* Remove ES6 syntax (replace const with var) to fix uglifier errors when compiling assets ([PR #114](https://github.com/alphagov/govuk_publishing_components/pull/114))
* Add procfile to allow running the dummy app ([PR #115](https://github.com/alphagov/govuk_publishing_components/pull/115))

## 3.0.2

* Add styles for active link where active link is in a choice list, and fix focus states on same in Firefox ([PR #110](https://github.com/alphagov/govuk_publishing_components/pull/110))

## 3.0.1

* Fix indent bug and number white background bug on newer iphones, overflow issue causing problem when text zoomed, fallback for older iphones, and improve print styles ([PR #108](https://github.com/alphagov/govuk_publishing_components/pull/108))

## 3.0.0

* Allow the gem to host components ([PR #105](https://github.com/alphagov/govuk_publishing_components/pull/105))
* Added task_list, task_list_header and task_list_related components which were
  in Static.  It's not a breaking change to this gem to include them, but they
  are not backwardly compatible with previous versions of the components. ([PR #105](https://github.com/alphagov/govuk_publishing_components/pull/105))
* Work to tidy up the dummy application to more closely represent GOV.UK rails
  apps ([PR #104](https://github.com/alphagov/govuk_publishing_components/pull/104))

## 2.0.0

BREAKING: breaking release, should be easy to migrate.

Previously with aXe we excluded all warnings relating to duplicate ids, this release allows you to exclude any rules you'd like to but removes this default.
Any components that relied on this default will need this rule adding to their documentation file.

See [test/.../docs/test-component-with-duplicate-ids.yml](spec/dummy/app/views/components/docs/test-component-with-duplicate-ids.yml) for an example of how this looks. ([PR #101](https://github.com/alphagov/govuk_publishing_components/pull/101))

## 1.12.1

* Use lead paragraph component ([PR #95](https://github.com/alphagov/govuk_publishing_components/pull/95))

## 1.12.0

* Add warnings and fail tests when no accessibility criteria are defined for a component ([PR #90](https://github.com/alphagov/govuk_publishing_components/pull/90))

## 1.11.0

* Add task to check for components existing without corresponding docs ([PR #86](https://github.com/alphagov/govuk_publishing_components/pull/86))
* Render aXe violations in component guide ([PR #82](https://github.com/alphagov/govuk_publishing_components/pull/82))
* Remove component guide hover styles ([PR #81](https://github.com/alphagov/govuk_publishing_components/pull/81))

## 1.10.0

* Add visual diff tool ([PR #61](https://github.com/alphagov/govuk_publishing_components/pull/61))
* Disable duplicate ID aXe rule ([PR #80](https://github.com/alphagov/govuk_publishing_components/pull/80))

## 1.9.0

* Use local govuk_components for static's component guide ([PR #74](https://github.com/alphagov/govuk_publishing_components/pull/74))

## 1.8.2

* Force cookie and survey banner styling on ([PR #76](https://github.com/alphagov/govuk_publishing_components/pull/76))

## 1.8.1

* Remove cookie and survey banner using CSS instead of setting cookies ([PR #71](https://github.com/alphagov/govuk_publishing_components/pull/71))
* Fix syntax highlighting styles (PR #70 and #73)

## 1.8.0

* Add integration tests for apps to use when testing their component guide ([PR #68](https://github.com/alphagov/govuk_publishing_components/pull/68))

## 1.7.0

* Remove cookie and survey banners from the component guide to allow visual diff tool comparison ([PR #65](https://github.com/alphagov/govuk_publishing_components/pull/65))
* Make it clear when aXe has failed, succeeded or found errors ([PR #64](https://github.com/alphagov/govuk_publishing_components/pull/64))

## 1.6.0

* Set X-Frame-Options header to allowall, to allow inclusion of component guide in iFrames ([PR #53](https://github.com/alphagov/govuk_publishing_components/pull/53))
* Add shared accessibility criteria in component guide pages([PR #58](https://github.com/alphagov/govuk_publishing_components/pull/58))

## 1.5.0

* Add links to component guide homepage linking to conventions and principles ([PR #52](https://github.com/alphagov/govuk_publishing_components/pull/52))

## 1.4.0

* Add dark_background context to examples ([PR #49](https://github.com/alphagov/govuk_publishing_components/pull/49))

## 1.3.0

* Add optional descriptions to examples ([PR #47](https://github.com/alphagov/govuk_publishing_components/pull/47))

## 1.2.0

* Exposes incomplete warnings from aXe in component guide pages ([PR #40](https://github.com/alphagov/govuk_publishing_components/pull/40))

## 1.1.0

* Allow gem to be used with static ([PR #43](https://github.com/alphagov/govuk_publishing_components/pull/43))

## 1.0.1

Fixes issue around page scrolling unexpectedly.

* Add context param to aXe so that options are passed correctly

## 1.0.0

All documentation will need updating when upgrading ([PR #37](https://github.com/alphagov/govuk_publishing_components/pull/37)):
* Rename fixtures to examples in YAML documentation
* Nest example data within a named block to give examples more features

Steps to upgrade:
* Rename fixtures in YAML files to "examples"
* Nest data for each example in a `data:` block

```yaml
fixtures:
  some_name:
    some_param: some_value
```

becomes:

```yaml
examples:
  some_name:
    data:
      some_param: some_value
```

## 0.9.0

* Add aXe accessibility testing javascript to component guide pages ([PR #33](https://github.com/alphagov/govuk_publishing_components/pull/33))
* Mark strings in YAML fixtures as HTML safe ([PR #36](https://github.com/alphagov/govuk_publishing_components/pull/36))
* Refactor internal structs to use classes ([PR #34](https://github.com/alphagov/govuk_publishing_components/pull/34))

## 0.8.0

* Add preview pages to component guide, to allow components to be viewed in isolation ([PR #27](https://github.com/alphagov/govuk_publishing_components/pull/27))
* Includes addition of 'preview all' and 'preview' pages

## 0.7.0

* Relax required version of dependencies to allow gem to work with a Rails 5.1 project ([PR #29](https://github.com/alphagov/govuk_publishing_components/pull/29))
* Fix text in generator yml template ([PR #30](https://github.com/alphagov/govuk_publishing_components/pull/30))

## 0.6.0

* Add component generator ([PR #24](https://github.com/alphagov/govuk_publishing_components/pull/24))

## 0.5.0

* Allow print styles to be shown in guide ([PR #19](https://github.com/alphagov/govuk_publishing_components/pull/19))

## 0.4.2

* Relax slimmer version ([PR #20](https://github.com/alphagov/govuk_publishing_components/pull/20))

## 0.4.1

* Fix overlap issue with code snippets ([PR #15](https://github.com/alphagov/govuk_publishing_components/pull/15))

## 0.4.0

* Add syntax highlighting to code block showing how to call a component ([PR #10](https://github.com/alphagov/govuk_publishing_components/pull/10))

## 0.3.1

* Remove ApplicationRecord files from gem ([PR #8](https://github.com/alphagov/govuk_publishing_components/pull/8))

## 0.3.0

* Include body and accessibility acceptance criteria on component pages ([PR #6](https://github.com/alphagov/govuk_publishing_components/pull/6))
* Fix load ordering bug which would sometimes cause the component guide to use the app’s layout ([PR #5](https://github.com/alphagov/govuk_publishing_components/pull/5))

## 0.2.0

* Allow components to use application view helpers ([PR #3](https://github.com/alphagov/govuk_publishing_components/pull/3))

## 0.1.0

* Initial release
