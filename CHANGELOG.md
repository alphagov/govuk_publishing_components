# Changelog

- We use the [GOV.UK versioning guidelines](https://docs.publishing.service.gov.uk/manual/publishing-a-ruby-gem.html#versioning).
- Mark breaking changes with `BREAKING:`. Be sure to include instructions on how applications should be upgraded.
- Include a link to your pull request.
- Don't include changes that are purely internal. The CHANGELOG should be a
  useful summary for people upgrading their application, not a replication
  of the commit log.

## Unreleased
* Tidy up untranslated content and formatting on accordion docs ([PR #1958](https://github.com/alphagov/govuk_publishing_components/pull/1958)) PATCH
* Add visual regression testing tool Percy ([PR #1013](https://github.com/alphagov/govuk_publishing_components/pull/1013)) PATCH

## 24.9.1

* Change to the exceptions list for Brexit branding ([PR #2011](https://github.com/alphagov/govuk_publishing_components/pull/2011))

## 24.9.0

* Image card link size option ([PR #2007](https://github.com/alphagov/govuk_publishing_components/pull/2007))
* Update success notice component ([PR #1929](https://github.com/alphagov/govuk_publishing_components/pull/1929))
* Tidy up success alert markup ([PR #2004](https://github.com/alphagov/govuk_publishing_components/pull/2004))

## 24.8.0

* Add cookie ([PR #1999](https://github.com/alphagov/govuk_publishing_components/pull/1999)) PATCH
* Change button margin option ([PR #1998](https://github.com/alphagov/govuk_publishing_components/pull/1998)) MINOR
* Add auditing to applications ([PR #1949](https://github.com/alphagov/govuk_publishing_components/pull/1949)) PATCH
* Update auditing ([PR #1996](https://github.com/alphagov/govuk_publishing_components/pull/1996)) PATCH
* Update default footer links ([PR #1989](https://github.com/alphagov/govuk_publishing_components/pull/1989)) PATCH
* Remove Sass `extend` from title component ([PR #1994](https://github.com/alphagov/govuk_publishing_components/pull/1994)) PATCH

## 24.7.1

* Add placeholder locale files to standardise apps. ([PR #1992](https://github.com/alphagov/govuk_publishing_components/pull/1992))

## 24.7.0

* Add GOVUK Frontend Details module to GOVUK Modules and amend modules.js start function ([PR #1985](https://github.com/alphagov/govuk_publishing_components/pull/1985))
* Rescope Brexit CTA to en/cy locale only ([PR #1984](https://github.com/alphagov/govuk_publishing_components/pull/1984))
* Add js tests for accordion component ([PR #1977](https://github.com/alphagov/govuk_publishing_components/pull/1977))
* Fix search component label background ([PR #1983](https://github.com/alphagov/govuk_publishing_components/pull/1983))
* Allow emergency banner and global bar in public layout component ([PR #1978](https://github.com/alphagov/govuk_publishing_components/pull/1915)) MINOR

## 24.6.1

* Fix bug in summary list link text ([PR #1978](https://github.com/alphagov/govuk_publishing_components/pull/1978))

## 24.6.0

* Remove title attribute from summary list ([PR #1973](https://github.com/alphagov/govuk_publishing_components/pull/1973))
* Summary list changes ([PR #1971](https://github.com/alphagov/govuk_publishing_components/pull/1971))
* Rework accordion anchor link nav to allow for colon anchors ([PR #1974](https://github.com/alphagov/govuk_publishing_components/pull/1974))

## 24.5.0

* Add title option to summary list links ([PR #1967](https://github.com/alphagov/govuk_publishing_components/pull/1967))
* Remove lists from summary action links ([PR #1956](https://github.com/alphagov/govuk_publishing_components/pull/1956))
* Fix GOV.UK Frontend deprecation warning for component-guide print stylesheet ([PR #1961](https://github.com/alphagov/govuk_publishing_components/pull/1961))
* Update search box button ([PR #1957](https://github.com/alphagov/govuk_publishing_components/pull/1957))
* Adds Reorderable lists component ([PR #1905](https://github.com/alphagov/govuk_publishing_components/pull/1905))

## 24.4.1

* Fix tracking in `details.js` ([PR #1962](https://github.com/alphagov/govuk_publishing_components/pull/1962))

## 24.4.0

* Add border option to breadcrumb ([PR #1952](https://github.com/alphagov/govuk_publishing_components/pull/1952)) MINOR
* Add custom heading level option to radio component ([PR #1951](https://github.com/alphagov/govuk_publishing_components/pull/1951))

## 24.3.1

* Show password fixes ([PR #1947](https://github.com/alphagov/govuk_publishing_components/pull/1947))
* Switch from `trackClick` to `gemTrackClick` script ([PR #1944](https://github.com/alphagov/govuk_publishing_components/pull/1944))
* Add spacing to cookie banner confirmation message ([PR #1936](https://github.com/alphagov/govuk_publishing_components/pull/1936))
* Fix Sass warning for extending a compound selector ([PR #1933](https://github.com/alphagov/govuk_publishing_components/pull/1933))
* Add default aria label for navigation items (PR [#1946](https://github.com/alphagov/govuk_publishing_components/pull/1946))

## 24.3.0

* Fix cookie banner preview in the component guide ([PR #1935](https://github.com/alphagov/govuk_publishing_components/pull/1935))
* Implements scroll tracking for the covid pages ([PR #1942](https://github.com/alphagov/govuk_publishing_components/pull/1942))
* Add anchor navigation feature to accordions ([PR #1937](https://github.com/alphagov/govuk_publishing_components/pull/1937))

## 24.2.0

* Update cookies banner to align it with govuk-frontend ([PR #1918](https://github.com/alphagov/govuk_publishing_components/pull/1918))

## 24.1.1

* Fix deprecation warnings when running tests ([PR #1899](https://github.com/alphagov/govuk_publishing_components/pull/1899))
* Update `govuk-frontend` base SCSS imports ([PR #1922](https://github.com/alphagov/govuk_publishing_components/pull/1922))
* Remove redundant import in accordion component ([PR #1923](https://github.com/alphagov/govuk_publishing_components/pull/1923))
* Fix toggle click tracking on step-by-steps ([PR #1925](https://github.com/alphagov/govuk_publishing_components/pull/1925))
* Accordion summary design adjustment ([PR #1926](https://github.com/alphagov/govuk_publishing_components/pull/1926))
* Fix `layout_header` layout and spacing issues ([PR #1924](https://github.com/alphagov/govuk_publishing_components/pull/1924))

## 24.1.0

* Fix auditing screens ([PR #1927](https://github.com/alphagov/govuk_publishing_components/pull/1927))
* Update `data-module` on layout header and footer ([PR #1913](https://github.com/alphagov/govuk_publishing_components/pull/1913))
* Update design of accordion component ([PR #1884](https://github.com/alphagov/govuk_publishing_components/pull/1884))

## 24.0.0

* Bump govuk-frontend from 3.10.2 to 3.11.0 ([PR #1911](https://github.com/alphagov/govuk_publishing_components/pull/1911))
* Rescope Brexit CTA on contextual sidebar ([PR #1910](https://github.com/alphagov/govuk_publishing_components/pull/1910))
* Update `govspeak` contact heading ([PR #1909](https://github.com/alphagov/govuk_publishing_components/pull/1909))
* Remove `listenForCrossOriginMessages` from CookieBanner ([PR #1906](https://github.com/alphagov/govuk_publishing_components/pull/1906))
* Further step by step nav sidebar design updates ([PR #1893](https://github.com/alphagov/govuk_publishing_components/pull/1893))
* Add rel attribute option to document list ([PR #1903](https://github.com/alphagov/govuk_publishing_components/pull/1903))
* BREAKING: Remove chevron banner component ([PR #1873](https://github.com/alphagov/govuk_publishing_components/pull/1873))
* BREAKING: Retire gem-level SCSS variables ([PR #1881](https://github.com/alphagov/govuk_publishing_components/pull/1881))
* BREAKING: Remove duplicate `lib/auto-track-event` script ([PR #1894](https://github.com/alphagov/govuk_publishing_components/pull/1894))
* BREAKING: Remove copies of files ([PR #1878](https://github.com/alphagov/govuk_publishing_components/pull/1878))
* BREAKING: Remove list stylesheet ([PR #1874](https://github.com/alphagov/govuk_publishing_components/pull/1874))

## 23.15.0

* Fix bugs on the feedback component ([PR #1900](https://github.com/alphagov/govuk_publishing_components/pull/1900))
* Add data attributes to layout footer component ([PR #1904](https://github.com/alphagov/govuk_publishing_components/pull/1904))
* Add option to remove border from document list items ([PR #1907](https://github.com/alphagov/govuk_publishing_components/pull/1907))
* Update layout header component ([PR #1902](https://github.com/alphagov/govuk_publishing_components/pull/1902))

## 23.14.0

* Update Brexit CTA on contextual sidebar ([PR #1888](https://github.com/alphagov/govuk_publishing_components/pull/1888))
* Fix footer classes ([PR #1898](https://github.com/alphagov/govuk_publishing_components/pull/1898))
* Update document list component with description text modifier and amended design ([PR #1883](https://github.com/alphagov/govuk_publishing_components/pull/1883))

## 23.13.1

* Bump govuk-frontend from 3.9.1 to 3.10.2 ([PR #1838](https://github.com/alphagov/govuk_publishing_components/pull/1838))
* Update design for step by step navigation to improve accessibility ([PR #1875](https://github.com/alphagov/govuk_publishing_components/pull/1875))

## 23.13.0

* Update documentation and add new tag options for the meta tags component ([PR #1870](https://github.com/alphagov/govuk_publishing_components/pull/1870))

## 23.12.3

* Fix text overflow bug in Firefox ([PR #1764](https://github.com/alphagov/govuk_publishing_components/pull/1764))
* Tidy component filenames ([PR #1848](https://github.com/alphagov/govuk_publishing_components/pull/1848))
* Add print styling for magna charta component ([PR #1867](https://github.com/alphagov/govuk_publishing_components/pull/1867))
* Add custom aria label option for layout header nav ([PR #1865](https://github.com/alphagov/govuk_publishing_components/pull/1865))
* Change GOVUK Modules scope to document ([PR #1869](https://github.com/alphagov/govuk_publishing_components/pull/1869))

## 23.12.2

* Hide native browser show password ([PR #1863](https://github.com/alphagov/govuk_publishing_components/pull/1863))
* Update magna charter experience for screen reader users ([PR #1787](https://github.com/alphagov/govuk_publishing_components/pull/1787))

## 23.12.1

* Escape dangerous HTML in 'Machine readable metadata' component ([PR #1858](https://github.com/alphagov/govuk_publishing_components/pull/1858))

## 23.12.0

* Get analytics code ready for use in production ([PR #1767](https://github.com/alphagov/govuk_publishing_components/pull/1767))

## 23.11.1

* Update Brexit CTA copy in contextual sidebar ([PR #1851](https://github.com/alphagov/govuk_publishing_components/pull/1851))
* Extend component auditing ([PR #1796](https://github.com/alphagov/govuk_publishing_components/pull/1796))

## 23.11.0

* Replace transition countdown component with sidebar partial (PR [#1845](https://github.com/alphagov/govuk_publishing_components/pull/1845))

## 23.10.2

* Fix Rails deprecation warning for autoloading during initialisation ([PR #1837](https://github.com/alphagov/govuk_publishing_components/pull/1837))
* Turn off the Brexit countdown clock at 23.30 on Brexit eve ([PR #1841](https://github.com/alphagov/govuk_publishing_components/pull/1841))

## 23.10.1

* Fixes youtube title bug ([PR #1835](https://github.com/alphagov/govuk_publishing_components/pull/1835))

## 23.10.0

* Add a data attribute to indicate a link or form should be decorated as if it were a cross-domain link ([PR #1811](https://github.com/alphagov/govuk_publishing_components/pull/1811))

## 23.9.2

* Fix for search input misalignment ([PR #1823](https://github.com/alphagov/govuk_publishing_components/pull/1823))
* Add type="button" to Show/Hide password button ([PR #1826](https://github.com/alphagov/govuk_publishing_components/pull/1826))
* Amend Show/Hide password button CSS ([PR #1828](https://github.com/alphagov/govuk_publishing_components/pull/1828))

## 23.9.1

* Disable the transition countdown on a certain page ([PR #1821](https://github.com/alphagov/govuk_publishing_components/pull/1821))

## 23.9.0

* Add support for secondary solid buttons ([PR #1814](https://github.com/alphagov/govuk_publishing_components/pull/1814))

## 23.8.0

* Add password reveal component ([PR #1794](https://github.com/alphagov/govuk_publishing_components/pull/1794))

## 23.7.7

* Add some GOV.UK Accounts specific PII redacts ([PR #1807](https://github.com/alphagov/govuk_publishing_components/pull/1807))

## 23.7.6

* Amend share links columns spacing ([PR #1800](https://github.com/alphagov/govuk_publishing_components/pull/1800))

## 23.7.5

* Update subscription-links default email link text ([PR #1804](https://github.com/alphagov/govuk_publishing_components/pull/1804))

## 23.7.4

* Fix to update the current list bullet numbered SVG into a responsive version so it scales correctly via zoom-text-only / improves a11y considerations ([PR #1799](https://github.com/alphagov/govuk_publishing_components/pull/1799))

## 23.7.3

* Fix to resolve input zoom-text overlap ([PR #1793](https://github.com/alphagov/govuk_publishing_components/pull/1793))

## 23.7.2

* Fix Brexit countdown in the contextual sidebar to use appropriate lang and text direction ([PR #1790](https://github.com/alphagov/govuk_publishing_components/pull/1790))

## 23.7.1

* Update contextual sidebar data track attributes ([PR #1788](https://github.com/alphagov/govuk_publishing_components/pull/1788))

## 23.7.0

* Add transition countdown component ([PR #1783](https://github.com/alphagov/govuk_publishing_components/pull/1783))

## 23.6.0

* Fix hide zeros values within stacked barcharts ([PR #1776](https://github.com/alphagov/govuk_publishing_components/pull/1776))
* Fix GitHub usage link not showing for all components ([PR #1780](https://github.com/alphagov/govuk_publishing_components/pull/1780))
* Add heading level to attachment component ([PR #1781](https://github.com/alphagov/govuk_publishing_components/pull/1781))

## 23.5.1

* Update Brexit sidebar navigation ([PR #1777](https://github.com/alphagov/govuk_publishing_components/pull/1777))

## 23.5.0

* Align JavaScript modules format in components ([PR #1769](https://github.com/alphagov/govuk_publishing_components/pull/1769))
* Converts track options correctly when passed in ([PR #1772](https://github.com/alphagov/govuk_publishing_components/pull/1772))

## 23.4.0

* Bump govuk-frontend from 3.8.1 to 3.9.1 ([PR #1705](https://github.com/alphagov/govuk_publishing_components/pull/1705))
* Fix image card link text in high contrast mode in IE ([PR #1732](https://github.com/alphagov/govuk_publishing_components/pull/1732))

## 23.3.0

* Change how analytics variables are passed ([PR #1762](https://github.com/alphagov/govuk_publishing_components/pull/1762))

## 23.2.1

* Fix layout header component in IE ([PR #1760](https://github.com/alphagov/govuk_publishing_components/pull/1760))
* Hide footnotes backlink in print version ([PR #1759](https://github.com/alphagov/govuk_publishing_components/pull/1759))

## 23.2.0

* Change analytics calls ([PR #1757](https://github.com/alphagov/govuk_publishing_components/pull/1757))

## 23.1.0

* Add custom margin support for print link ([PR #1753](https://github.com/alphagov/govuk_publishing_components/pull/1753))
* Fix orange outline on global site search ([PR #1752](https://github.com/alphagov/govuk_publishing_components/pull/1752))

## 23.0.0

Note - this is version 23.0.0 due to a previously yanked version using 22.0.0; this release is unrelated to the yanked version.

* Add track click code from static ([PR #1751](https://github.com/alphagov/govuk_publishing_components/pull/1751))
* Fix active state on action link ([PR #1749](https://github.com/alphagov/govuk_publishing_components/pull/1749))
* Add heading option to input component ([PR #1747](https://github.com/alphagov/govuk_publishing_components/pull/1747)) MINOR
* Add analytics from static ([PR #1745](https://github.com/alphagov/govuk_publishing_components/pull/1745)) MINOR
* **BREAKING:** Layout header component always displays product name and environment when provided ([PR #1736](https://github.com/alphagov/govuk_publishing_components/pull/1736))
* Add heading option to panel component ([PR #1741](https://github.com/alphagov/govuk_publishing_components/pull/1741)) MINOR
* **BREAKING:** Force contents list title to always be Contents or regional equivalent ([PR #1734](https://github.com/alphagov/govuk_publishing_components/pull/1734))
* **BREAKING:** Remove ability to pass Govspeak unsanitized HTML ([PR #1632](https://github.com/alphagov/govuk_publishing_components/pull/1632))

## 21.69.0

* Update action link component to support simple light arrow ([PR #1739](https://github.com/alphagov/govuk_publishing_components/pull/1739))
* Update print component to look like a button ([PR #1735](https://github.com/alphagov/govuk_publishing_components/pull/1735)) MINOR
* Add legacy colour to subscription links ([PR #1731](https://github.com/alphagov/govuk_publishing_components/pull/1731)) FIX

## 21.68.1

* Adding hover styling for action link ([PR #1728](https://github.com/alphagov/govuk_publishing_components/pull/1728))
* Feed subscription link accessibility fix ([PR #1721](https://github.com/alphagov/govuk_publishing_components/pull/1721))
* Update search component input label ([PR #1727](https://github.com/alphagov/govuk_publishing_components/pull/1727))

## 21.68.0

* Set feedback buttons to be transparent ([PR #1719](https://github.com/alphagov/govuk_publishing_components/pull/1719))

## 21.67.2

* Update step by step show/hide text to be more verbose for screen readers ([PR #1701](https://github.com/alphagov/govuk_publishing_components/pull/1701)) FIX

## 21.67.1

* Fix IE11 height bug on image card ([PR #1713](https://github.com/alphagov/govuk_publishing_components/pull/1713))

## 21.67.0

* Remove jQuery from select.js ([PR #1670](https://github.com/alphagov/govuk_publishing_components/pull/1670))
* Add language attribute to feed box ([PR #1706](https://github.com/alphagov/govuk_publishing_components/pull/1706))
* Replace feedback component links with buttons ([PR #1699](https://github.com/alphagov/govuk_publishing_components/pull/1699)) MINOR
* Extend contents list component ([PR #1710](https://github.com/alphagov/govuk_publishing_components/pull/1710))

## 21.66.4

* Reorder image card elements ([PR #1695](https://github.com/alphagov/govuk_publishing_components/pull/1695)) FIX

## 21.66.3

* Add default aria-label for contents list component ([PR #1698](https://github.com/alphagov/govuk_publishing_components/pull/1698))

## 21.66.2

* Swap out ol for ul on documents list ([PR #1694](https://github.com/alphagov/govuk_publishing_components/pull/1694)) FIX
* Search toggle inner text fix ([PR #1696](https://github.com/alphagov/govuk_publishing_components/pull/1696)) FIX

## 21.66.1

* Fix magna charta span width bug ([PR #1691](https://github.com/alphagov/govuk_publishing_components/pull/1691)) FIX

## 21.66.0

* Remove jQuery from toggle-input-class JS ([PR #1683](https://github.com/alphagov/govuk_publishing_components/pull/1683))
* Add locale attribute to notice component ([PR #1686](https://github.com/alphagov/govuk_publishing_components/pull/1686))
* Remove aria-expanded attribute from yes feedback button ([PR #1687](https://github.com/alphagov/govuk_publishing_components/pull/1687))
* Mobile search toggle button ([PR #1682](https://github.com/alphagov/govuk_publishing_components/pull/1682))

## 21.65.1

* Fix search box label colour ([PR #1680](https://github.com/alphagov/govuk_publishing_components/pull/1680))
* Feedback form errors frontend workaround ([PR #1684](https://github.com/alphagov/govuk_publishing_components/pull/1684))

## 21.65.0

* Step by step nav header updated to use heading ([PR #1671](https://github.com/alphagov/govuk_publishing_components/pull/1671))
* Increase icon size and allow transparent icons on action link component ([PR #1674](https://github.com/alphagov/govuk_publishing_components/pull/1674))

## 21.64.0

* Superbreadcrumb can have a priority taxon selected via query param ([PR #1666](https://github.com/alphagov/govuk_publishing_components/pull/1666))

## 21.63.3

* Remove jquery from govspeak ([PR #1657](https://github.com/alphagov/govuk_publishing_components/pull/1657))
* Add h2 tag into legend by default ([PR #1665](https://github.com/alphagov/govuk_publishing_components/pull/1665))

## 21.63.2

* Fix the on blue logic for the search component ([PR #1663](https://github.com/alphagov/govuk_publishing_components/pull/1663))

## 21.63.1

* Remove jquery from toggle code ([PR #1649](https://github.com/alphagov/govuk_publishing_components/pull/1649))
* Add role="alert" to cookie banner confirmation ([PR #1658](https://github.com/alphagov/govuk_publishing_components/pull/1658))
* Remove jquery from step by step component ([PR #1645](https://github.com/alphagov/govuk_publishing_components/pull/1645))
* Fix panel component disjointed heading ([PR #1660](https://github.com/alphagov/govuk_publishing_components/pull/1660))

## 21.63.0

* Hide priority breadcrumb from transition content tagged to a step by step ([PR #1654](https://github.com/alphagov/govuk_publishing_components/pull/1654))
* Use collapsible breadcrumbs from govuk-frontend ([PR #1552](https://github.com/alphagov/govuk_publishing_components/pull/1552))
* Add role alert to feedback component confirmation ([PR #1656](https://github.com/alphagov/govuk_publishing_components/pull/1656))
* Add locale attribute to document lists for rendering lang attributes ([PR #1643](https://github.com/alphagov/govuk_publishing_components/pull/1643))

## 21.62.0

* Add new brand colour for FCDO ([PR#1648](https://github.com/alphagov/govuk_publishing_components/pull/1648))

## 21.61.0

* Add public/frontend layout component ([PR #1265](https://github.com/alphagov/govuk_publishing_components/pull/1265))
* Replace jQuery in checkboxes.js ([PR #1620](https://github.com/alphagov/govuk_publishing_components/pull/1620))
* Add lang attribute to image card date/time element ([PR #1642](https://github.com/alphagov/govuk_publishing_components/pull/1642))
* Add priority breadcrumb to content tagged to the transition taxon ([PR #1646](https://github.com/alphagov/govuk_publishing_components/pull/1646))

## 21.60.3

* Fix display of embedded YouTube videos for Internet Explorer users ([PR #1640](https://github.com/alphagov/govuk_publishing_components/pull/1640))

## 21.60.2

* Add optional lang parameter to image card component ([PR #1634](https://github.com/alphagov/govuk_publishing_components/pull/1634))

## 21.60.1

* Change bar chart numbers and colours to be accessible ([PR #1608](https://github.com/alphagov/govuk_publishing_components/pull/1608))

## 21.60.0

* Make component auditing more resilient ([PR #1604](https://github.com/alphagov/govuk_publishing_components/pull/1604))
* Add more font sizes to heading component ([PR #1587](https://github.com/alphagov/govuk_publishing_components/pull/1587))
* Format machine-readable output ([PR #1617](https://github.com/alphagov/govuk_publishing_components/pull/1617))
* Add support for custom sizes for radio page headers ([PR #1616](https://github.com/alphagov/govuk_publishing_components/pull/1616))
* Add support for custom heading size for checkboxes ([PR #1623](https://github.com/alphagov/govuk_publishing_components/pull/1623))

## 21.59.0

* Add component auditing ([PR #1589](https://github.com/alphagov/govuk_publishing_components/pull/1589))
* Check that details component exists (to fix bug created in #1597) ([PR #1602](https://github.com/alphagov/govuk_publishing_components/pull/1602))

## 21.58.0

* Fix search component label accessibility ([PR #1594](https://github.com/alphagov/govuk_publishing_components/pull/1594))
* Add list component ([PR #1595](https://github.com/alphagov/govuk_publishing_components/pull/1595))
* Remove jQuery from details component ([PR #1597](https://github.com/alphagov/govuk_publishing_components/pull/1597))

## 21.57.1

* Minor adjustment to action link icon spacing ([PR #1593](https://github.com/alphagov/govuk_publishing_components/pull/1593))

## 21.57.0

* Hide services cookie banner when JavaScript is disabled ([PR #1586](https://github.com/alphagov/govuk_publishing_components/pull/1586))
* Improve print styles for govspeak info, help and call to action callouts ([PR #1588](https://github.com/alphagov/govuk_publishing_components/pull/1588) )
* Extend action link component with a small icon variant ([PR #1590](https://github.com/alphagov/govuk_publishing_components/pull/1590) )
* Add print link component ([PR #1582](https://github.com/alphagov/govuk_publishing_components/pull/1582))

## 21.56.2

* Fix layout on input with prefix/suffix ([PR #1581](https://github.com/alphagov/govuk_publishing_components/pull/1581))

## 21.56.1

* Replace bodged parent breadcrumbs with specialist topic breadcrumbs ([PR #1565](https://github.com/alphagov/govuk_publishing_components/pull/1565))
* Add worker support hub page to the priority breadcrumb list ([PR #1579](https://github.com/alphagov/govuk_publishing_components/pull/1579))

## 21.56.0

* Update summary list component to allow delete action at the group level and custom heading levels ([PR #1574](https://github.com/alphagov/govuk_publishing_components/pull/1574))

## 21.55.4

* Rework suggested imports functionality ([PR #1571](https://github.com/alphagov/govuk_publishing_components/pull/1571))
* Remove unnecessary margin around expanded feedback component ([PR #1547](https://github.com/alphagov/govuk_publishing_components/pull/1547))
* Show breadcrumbs alongside superbreadcrumbs everywhere they appear ([PR #1572](https://github.com/alphagov/govuk_publishing_components/pull/1572))

## 21.55.3

* Use video title as eventLabel for YT video event tracking ([PR #1562](https://github.com/alphagov/govuk_publishing_components/pull/1562))

## 21.55.2

* Reorder the breadcrumb so superbreadcrumb not top option ([PR #1556](https://github.com/alphagov/govuk_publishing_components/pull/1556))

## 21.55.1

* Find components within components ([PR #1541](https://github.com/alphagov/govuk_publishing_components/pull/1541))

## 21.55.0

* Add new options to action link component ([PR #1551](https://github.com/alphagov/govuk_publishing_components/pull/1551))
* Bump govuk-frontend from 3.6.0 to 3.7.0 ([PR #1549](https://github.com/alphagov/govuk_publishing_components/pull/1549))
* Fix FAQ Schemas for html publications ([PR #1543](https://github.com/alphagov/govuk_publishing_components/pull/1543)

## 21.54.0

* Modify Step nav header component to support custom tracking ([PR #1533](https://github.com/alphagov/govuk_publishing_components/pull/1533))
* Adds tracking for super breadcrumbs ([PR #1542](https://github.com/alphagov/govuk_publishing_components/pull/1542))
* Add margin bottom option to step nav header component ([PR #1544](https://github.com/alphagov/govuk_publishing_components/pull/1544))
* Bugfix to Step nav header on HTML publications ([PR #1545](https://github.com/alphagov/govuk_publishing_components/pull/1545))

## 21.53.0

* Add breadcrumbs from parent for html documents ([PR #1526](https://github.com/alphagov/govuk_publishing_components/pull/1526))

## 21.52.1

* Increase limit for steps bullet point images ([PR #1534](https://github.com/alphagov/govuk_publishing_components/pull/1534))

## 21.52.0

* Add prefix option to input component ([PR #1509](https://github.com/alphagov/govuk_publishing_components/pull/1509))
* Undo recursive FAQPage presenter ([PR #1527](https://github.com/alphagov/govuk_publishing_components/pull/1527))
* Allow arbitrary depth in priority taxonomy tagging([PR #1530](https://github.com/alphagov/govuk_publishing_components/pull/1530))

## 21.51.0

* Change `_all_components.scss` to use dependencies from support stylesheets  ([PR #1502](https://github.com/alphagov/govuk_publishing_components/pull/1502))
* Allow individual JavaScript imports ([PR #1472](https://github.com/alphagov/govuk_publishing_components/pull/1472))

  To import individual components refer to ['Include the assets section in docs'](https://github.com/alphagov/govuk_publishing_components/blob/master/docs/install-and-use.md) and the 'Suggested imports for this application' section available on `/component-guide` in your application.

## 21.50.1

* Tweak action link ([PR #1518](https://github.com/alphagov/govuk_publishing_components/pull/1518))

## 21.50.0

* Add is_page_heading to select ([PR #1516](https://github.com/alphagov/govuk_publishing_components/pull/1516))

## 21.49.0

* Add priority breadcrumb ([PR #1501](https://github.com/alphagov/govuk_publishing_components/pull/1501))

## 21.48.0

* Expand js classes code ([PR #1513](https://github.com/alphagov/govuk_publishing_components/pull/1513))
* Tweak size of action link subtext divider ([PR #1512](https://github.com/alphagov/govuk_publishing_components/pull/1512))

## 21.47.0

* Add action link component ([PR #1497](https://github.com/alphagov/govuk_publishing_components/pull/1497))
* Add `id` to checkboxes component ([PR #1503](https://github.com/alphagov/govuk_publishing_components/pull/1503))

## 21.46.0

* Prevent govspeak tables from breaking the layout ([PR #1493](https://github.com/alphagov/govuk_publishing_components/pull/1493))
* Prevent govspeak links from breaking the layout ([PR #1492](https://github.com/alphagov/govuk_publishing_components/pull/1492))
* Remove PHE brand colour ([PR #1489](https://github.com/alphagov/govuk_publishing_components/pull/1489))
* Add 'or' divider to checkboxes component ([PR #1488](https://github.com/alphagov/govuk_publishing_components/pull/1488))
* Fix legacy colour on input component ([PR #1487](https://github.com/alphagov/govuk_publishing_components/pull/1487))
* Add `exclusive` option to checkboxes component ([PR #1478](https://github.com/alphagov/govuk_publishing_components/pull/1478))

## 21.45.0

* Add suffix option to input component ([PR #1481](https://github.com/alphagov/govuk_publishing_components/pull/1481))

## 21.44.0

* Allow summary list custom link text ([PR #1483](https://github.com/alphagov/govuk_publishing_components/pull/1483))

## 21.43.0

* Fix margin on buttons with info text ([PR #1474](https://github.com/alphagov/govuk_publishing_components/pull/1474))
* Update step by step header component style ([PR #1476](https://github.com/alphagov/govuk_publishing_components/pull/1476))

## 21.42.0

* Add custom margin option to accordion component ([PR #1470](https://github.com/alphagov/govuk_publishing_components/pull/1470))
* Explicitly set accordion heading line height ([PR #1386](https://github.com/alphagov/govuk_publishing_components/pull/1386))

## 21.41.4

* Fix inverse option for title component context ([PR #1466](https://github.com/alphagov/govuk_publishing_components/pull/1466))

## 21.41.3

* Change title component context ([PR #1464](https://github.com/alphagov/govuk_publishing_components/pull/1464))
* Expand scope of suggested sass functionality ([PR #1461](https://github.com/alphagov/govuk_publishing_components/pull/1461))

## 21.41.2

* Make FAQs look deeper in the page for questions ([PR #1437](https://github.com/alphagov/govuk_publishing_components/pull/1437))

## 21.41.1

* Fix button alignment on cookie-banner ([PR #1450](https://github.com/alphagov/govuk_publishing_components/pull/1450))

## 21.41.0

* Fixes a bug with Youtube livestream introduced in #1440 ([PR #1447](https://github.com/alphagov/govuk_publishing_components/pull/1447))

## 21.40.0

* Adds tracking for youtube ([PR #1440](https://github.com/alphagov/govuk_publishing_components/pull/1440))
* Fix excess newlines for the Attachment Link component ([PR #1442](https://github.com/alphagov/govuk_publishing_components/pull/1442))
* Bugfix: Ensure cookie banner hide button always hides the cookie banner ([PR #1443](https://github.com/alphagov/govuk_publishing_components/pull/1443)).

## 21.39.0

* Add cookie banner variation for services ([PR #1438](https://github.com/alphagov/govuk_publishing_components/pull/1438))

## 21.38.5

* Add application stylesheet where needed ([PR #1436](https://github.com/alphagov/govuk_publishing_components/pull/1436))

## 21.38.4

* Add 'hide_order_copy_link' parameter to hide 'Order a copy' ([PR #1430](https://github.com/alphagov/govuk_publishing_components/pull/1430))

## 21.38.3

* Update yellow hex code for Public Health England ([PR #1428](https://github.com/alphagov/govuk_publishing_components/pull/1428))
* Remove ':visited' styling from 'Order a copy' link ([PR #1427](https://github.com/alphagov/govuk_publishing_components/pull/1427))

## 21.38.2

* Switch Public Health England branding colour from green to yellow ([PR #1425](https://github.com/alphagov/govuk_publishing_components/pull/1425))

## 21.38.1

* Correct CreativeWork to use name and text fields instead of headLine and description ([PR #1423](https://github.com/alphagov/govuk_publishing_components/pull/1423))

## 21.38.0

* Expand video player to support youtube livestream URLs ([PR #1418](https://github.com/alphagov/govuk_publishing_components/pull/1418))

## 21.37.0

* Add heading option to warning component ([PR #1415](https://github.com/alphagov/govuk_publishing_components/pull/1415))
* Add the "distribution" property to the dataset machine readable metadata ([PR #1416](https://github.com/alphagov/govuk_publishing_components/pull/1416))
* Fix the dataset machine readable metadata erroring if there is no description set ([PR #1416](https://github.com/alphagov/govuk_publishing_components/pull/1416))

## 21.36.1

* Fix back link arrow rendering in Safari ([PR #1411](https://github.com/alphagov/govuk_publishing_components/pull/1411))
* Change component guide sass ([PR #1409](https://github.com/alphagov/govuk_publishing_components/pull/1409))

## 21.36.0

* Update link accessibility criteria ([PR #1407](https://github.com/alphagov/govuk_publishing_components/pull/1407))
* Fix duplicate CSS for components loading in component guide ([PR #1356](https://github.com/alphagov/govuk_publishing_components/pull/1356))

## 21.35.0

* Set global_bar_cookie immediately when cookie consent given ([PR #1405](https://github.com/alphagov/govuk_publishing_components/pull/1405))

## 21.34.1

* Fix conditional reveal on checkboxes #1402 ([PR #1402](https://github.com/alphagov/govuk_publishing_components/pull/1402))

## 21.34.0

* Add custom multivariate test as essential cookie ([PR #1400](https://github.com/alphagov/govuk_publishing_components/pull/1400))

## 21.33.0

* Add PHE branding ([PR #1396](https://github.com/alphagov/govuk_publishing_components/pull/1396))
* Add invert option to heading component ([PR #1397](https://github.com/alphagov/govuk_publishing_components/pull/1397))

## 21.32.0

* Enable label as page heading ([PR #1389](https://github.com/alphagov/govuk_publishing_components/pull/1389))

## 21.31.0

* Prepare header component for public-facing usage ([PR #1384](https://github.com/alphagov/govuk_publishing_components/pull/1384))

## 21.30.0

* Update attachment component to accommodate publications ([PR #1375](https://github.com/alphagov/govuk_publishing_components/pull/1375))

## 21.29.1

* Patch: add missing legacy colour for dark-grey ([PR #1358](https://github.com/alphagov/govuk_publishing_components/pull/1358))

## 21.29.0

* Make feedback component more responsive and usable on mobile ([PR #1346](https://github.com/alphagov/govuk_publishing_components/pull/1346))
* Extend document-list component to show parts of a document ([PR #1326](https://github.com/alphagov/govuk_publishing_components/pull/1326))
* Update govspeak button styles again ([PR #1342](https://github.com/alphagov/govuk_publishing_components/pull/1342))

## 21.28.1

* Fix overflowing text in attachments ([PR #1352](https://github.com/alphagov/govuk_publishing_components/pull/1352))

## 21.28.0

* Improve numeric inputs ([PR #1345](https://github.com/alphagov/govuk_publishing_components/pull/1345))
* Enable custom classes and `aria-label` on button component ([PR #1344](https://github.com/alphagov/govuk_publishing_components/pull/1344))
* Tweak pagination component spacing and add border ([PR #1337](https://github.com/alphagov/govuk_publishing_components/pull/1337))

## 21.27.1

* Fix handling of `on_govuk_blue` parameter value in the search component ([PR #1334](https://github.com/alphagov/govuk_publishing_components/pull/1334))

## 21.27.0

* Remove font_size option on contents list ([PR #1325](https://github.com/alphagov/govuk_publishing_components/pull/1325))
* Fix feedback component tests ([PR #1329](https://github.com/alphagov/govuk_publishing_components/pull/1329))
* Revert 'Dont show breadcrumb item with no url' ([PR #1330](https://github.com/alphagov/govuk_publishing_components/pull/1330))
* Make breadcrumb collapsing behaviour opt-in and provide `collapse_on_mobile` flag ([PR #1330](https://github.com/alphagov/govuk_publishing_components/pull/1330))

## 21.26.2

* Streamline feedback component ([PR #1327](https://github.com/alphagov/govuk_publishing_components/pull/1327))
* Dont show breadcrumb item with no url ([PR #1324](https://github.com/alphagov/govuk_publishing_components/pull/1324))

## 21.26.1

* Add visually hidden text to share links component ([PR #1286](https://github.com/alphagov/govuk_publishing_components/pull/1286/))
* Update Sass documentation ([PR #1321](https://github.com/alphagov/govuk_publishing_components/pull/1321))
* Improve suggested sass functionality ([PR #1320](https://github.com/alphagov/govuk_publishing_components/pull/1320))
* Fix layout header width issue ([PR #1319](https://github.com/alphagov/govuk_publishing_components/pull/1319))

## 21.26.0

* Allow individual Sass imports ([PR #1159](https://github.com/alphagov/govuk_publishing_components/pull/1159))

## 21.25.0

* Make cookie banner text and preferences URL customisable ([PR #1310](https://github.com/alphagov/govuk_publishing_components/pull/1310))
* Add DGU-specific cookie ([PR #1315](https://github.com/alphagov/govuk_publishing_components/pull/1315))

## 21.24.0

* Change back link arrow to chevron ([PR #1299](https://github.com/alphagov/govuk_publishing_components/pull/1299))
* Mobile breadcrumb update guidance ([PR #1298](https://github.com/alphagov/govuk_publishing_components/pull/1298))
* Add page heading captions to checkboxes and radio boxes components ([PR #1304](https://github.com/alphagov/govuk_publishing_components/pull/1304))

## 21.23.1

* Change attachment request format text to match Whitehall ([PR #1306](https://github.com/alphagov/govuk_publishing_components/pull/1306))

## 21.23.0

* Enable custom margin top on title component ([PR #1302](https://github.com/alphagov/govuk_publishing_components/pull/1302))
* Enable aria-label on modal dialogue component ([PR #1300](https://github.com/alphagov/govuk_publishing_components/pull/1300))
* Fix component guide layout in IE11 ([PR #1293](https://github.com/alphagov/govuk_publishing_components/pull/1293))

## 21.22.2

* Mobile breadcrumb to wrap long taxon and correctly align chevron top ([PR #1296](https://github.com/alphagov/govuk_publishing_components/pull/1296))
* Mobile breadcrumb to show first and last items only ([PR #1290](https://github.com/alphagov/govuk_publishing_components/pull/1290))
* Increases spacing between document links ([PR #1294](https://github.com/alphagov/govuk_publishing_components/pull/1294))

## 21.22.1

* Update govspeak button styles ([PR #1282](https://github.com/alphagov/govuk_publishing_components/pull/1282))
* Make maxlength or maxwords required ([#1276](https://github.com/alphagov/govuk_publishing_components/pull/1276))

## 21.22.0

* Add cookie category lookup function ([#1272](https://github.com/alphagov/govuk_publishing_components/pull/1272))
* Fix a world location link for 'UK mission in the European Union' ([#1274](https://github.com/alphagov/govuk_publishing_components/pull/1274))

## 21.21.3

* Increase margin between related step by step links and adjust font weight ([#1269](https://github.com/alphagov/govuk_publishing_components/pull/1269))

## 21.21.2

* Remove limits on showing >5 step by step navigation sidebar elements ([#1267](https://github.com/alphagov/govuk_publishing_components/pull/1267))

## 21.21.1

* Update the text for the Transition contextual sidebar link ([#1264](https://github.com/alphagov/govuk_publishing_components/pull/1264))

## 21.21.0

* Update govuk-frontend to 3.5.0 ([#1262](https://github.com/alphagov/govuk_publishing_components/pull/1262))
* Add attribute parameter to meta links in layout footer component ([#1261](https://github.com/alphagov/govuk_publishing_components/pull/1261))
* Change the dataset schema description ([#1260](https://github.com/alphagov/govuk_publishing_components/pull/1260))


## 21.20.0

* Check for ordered related items and parent in breadcrumb logic ([#1257](https://github.com/alphagov/govuk_publishing_components/pull/1257))

## 21.19.1

* Increase notice border size ([#1254](https://github.com/alphagov/govuk_publishing_components/pull/1254))

## 21.19.0

* Add print icons ([#1251](https://github.com/alphagov/govuk_publishing_components/pull/1251))

## 21.18.0

* Remove Brexit CTA link from checker start page ([#1249](https://github.com/alphagov/govuk_publishing_components/pull/1249))

## 21.17.0

* Add Dataset schema.org schema to machine readable metadata component ([#1247](https://github.com/alphagov/govuk_publishing_components/pull/1247))

## 21.16.3

* Revert 'Simplify document list component markup when having only one item' ([#1244](https://github.com/alphagov/govuk_publishing_components/pull/1244))

## 21.16.2

* Fix stray closing tag in document list component ([#1242](https://github.com/alphagov/govuk_publishing_components/pull/1242))

## 21.16.1

* Create pageview on cookie consent ([#1238](https://github.com/alphagov/govuk_publishing_components/pull/1238))
* Simplify document list component markup when having only one item ([#1226](https://github.com/alphagov/govuk_publishing_components/pull/1226))

## 21.16.0

* Delete unconsented cookies automatically ([#1239](https://github.com/alphagov/govuk_publishing_components/pull/1239))

## 21.15.2

* Use correct grid row class in cookie banner ([#1233](https://github.com/alphagov/govuk_publishing_components/pull/1233))
* Fix categorisation of survey cookies ([#1234](https://github.com/alphagov/govuk_publishing_components/pull/1234))
* Improve cookie deletion code ([#1234](https://github.com/alphagov/govuk_publishing_components/pull/1234))
* Fix cookie banner layout on mobile ([#1237](https://github.com/alphagov/govuk_publishing_components/pull/1237))

## 21.15.1

* Fix URL in cookie banner component ([#1228](https://github.com/alphagov/govuk_publishing_components/pull/1228))

## 21.15.0

* Allow textarea to be described by an element outside the component ([#1225](https://github.com/alphagov/govuk_publishing_components/pull/1225))
* Add guidance_id to contextual guidance component ([#1225](https://github.com/alphagov/govuk_publishing_components/pull/1225))
* Update cookie banner component from an opt-out to an opt-in approach ([#1227](https://github.com/alphagov/govuk_publishing_components/pull/1227))

## 21.14.0

* Allow custom heading size on fieldset component ([#1223](https://github.com/alphagov/govuk_publishing_components/pull/1223))

## 21.13.5

* Fix checkbox small option ([#1221](https://github.com/alphagov/govuk_publishing_components/pull/1221))

## 21.13.4

* Fix 'Help us improve' feedback form button / link alignment ([#1217](https://github.com/alphagov/govuk_publishing_components/pull/1217))

* Simplify CSS Grid on feedback component ([#1216](https://github.com/alphagov/govuk_publishing_components/pull/1216))

* Add finder doc types to things that strip postcodes from GA. ([#1214](https://github.com/alphagov/govuk_publishing_components/pull/1214))

## 21.13.3

* Fix Feedback component layout on mobile ([#1211](https://github.com/alphagov/govuk_publishing_components/pull/1207))

* Fix header environment label layout on mobile ([PR #1212](https://github.com/alphagov/govuk_publishing_components/pull/1212))

## 21.13.2

* Change tags and styling for feedback component ([PR #1207](https://github.com/alphagov/govuk_publishing_components/pull/1207))

## 21.13.1

* Add a condition to check that we can use the content_security_policy feature supported from Rails 5.2. ([PR #1206](https://github.com/alphagov/govuk_publishing_components/pull/1206))

## 21.13.0

* Update govuk-frontend to 3.4.0 ([PR #1204](https://github.com/alphagov/govuk_publishing_components/pull/1204))

* Allow aria-controls attribute on search component ([PR #1203](https://github.com/alphagov/govuk_publishing_components/pull/1203))

## 21.12.0

* Migrate primary-links.js from frontend_toolkit ([PR #1201](https://github.com/alphagov/govuk_publishing_components/pull/1201))

## 21.11.0

* Update background colour for search buttons ([PR #1197](https://github.com/alphagov/govuk_publishing_components/pull/1197))
* Add option to wrap the organisation logo with a heading, and for the organisation logo to not take up the entire width of the parent element ([PR #1198](https://github.com/alphagov/govuk_publishing_components/pull/1198))
* Support document list items without links ([PR #1194](https://github.com/alphagov/govuk_publishing_components/pull/1194))

## 21.10.0

* Allow tracking on the details component ([PR #1187](https://github.com/alphagov/govuk_publishing_components/pull/1187))

## 21.9.0

* Fix string merge in summary-list component ([PR #1188](https://github.com/alphagov/govuk_publishing_components/pull/1188))
* Add Brexit call-to-action link as a related link in the contextual sidebar ([PR #1189](https://github.com/alphagov/govuk_publishing_components/pull/1189))

## 21.8.1

* Configure cookie banner to not appear in Google snippets ([PR #1185](https://github.com/alphagov/govuk_publishing_components/pull/1185))

## 21.8.0

* Add id option to fieldset ([PR #1183](https://github.com/alphagov/govuk_publishing_components/pull/1183))
* Fix edit link on summary-list component ([PR #1182](https://github.com/alphagov/govuk_publishing_components/pull/1182))
* Make chevron component more resilient ([PR #1181](https://github.com/alphagov/govuk_publishing_components/pull/1181))

## 21.7.0

* Add GovernmentService schema.org schema to machine readable metadata component ([PR #1177](https://github.com/alphagov/govuk_publishing_components/pull/1177))
* Fix print styles applying to all media in admin layout ([PR #1178](https://github.com/alphagov/govuk_publishing_components/pull/1178))

## 21.6.1

* Add a new essential cookie to the acceptance list ([PR #1175](https://github.com/alphagov/govuk_publishing_components/pull/1175))

## 21.6.0

* Add component print styles ([PR #1164](https://github.com/alphagov/govuk_publishing_components/pull/1164))
* Bring specific org focus states in line with others ([PR #1158](https://github.com/alphagov/govuk_publishing_components/pull/1158))
* Add inverse option to translation component ([PR #1173](https://github.com/alphagov/govuk_publishing_components/pull/1173))

## 21.5.0

* Add contextual guidance component ([PR #1156](https://github.com/alphagov/govuk_publishing_components/pull/1156))

## 21.4.1

* Add warning, file download and numbered steps icons that were originally fetched from govuk_frontend_toolkit ([PR #1154](https://github.com/alphagov/govuk_publishing_components/pull/1154))

## 21.4.0

* Move organisation crest images into the gem ([PR #1149](https://github.com/alphagov/govuk_publishing_components/pull/1149))

## 21.3.0

* Fix some minor issues with the FAQPage schema ([PR #1142](https://github.com/alphagov/govuk_publishing_components/pull/1142))
* Add select component error state without message ([PR #1143](https://github.com/alphagov/govuk_publishing_components/pull/1143))
* Add error state to select component ([PR #1141](https://github.com/alphagov/govuk_publishing_components/pull/1141))
* Add size option to label ([PR #1140](https://github.com/alphagov/govuk_publishing_components/pull/1140))

## 21.2.0

* Fieldset custom legend size ([PR #1134](https://github.com/alphagov/govuk_publishing_components/pull/1134))

## 21.1.1

* Update cookie banner text ([PR #1136](https://github.com/alphagov/govuk_publishing_components/pull/1136))

## 21.1.0

* Add label size option for select ([PR #1131](https://github.com/alphagov/govuk_publishing_components/pull/1131))
* Update search component styles [PR #1128](https://github.com/alphagov/govuk_publishing_components/pull/1128)
* Add name option to select component ([PR #1130](https://github.com/alphagov/govuk_publishing_components/pull/1130))

## 21.0.0

* **BREAKING** (in government-frontend) Iterate FAQ schema to split content around h2 headings. [PR #1127](https://github.com/alphagov/govuk_publishing_components/pull/1127)

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
