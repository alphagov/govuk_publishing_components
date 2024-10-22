# Changelog

- We use the [GOV.UK versioning guidelines](https://docs.publishing.service.gov.uk/manual/publishing-a-ruby-gem.html#versioning).
- Mark breaking changes with `BREAKING:`. Be sure to include instructions on how applications should be upgraded.
- Include a link to your pull request.
- Don't include changes that are purely internal. The CHANGELOG should be a
  useful summary for people upgrading their application, not a replication
  of the commit log.

## Unreleased

* Add component wrapper to error alert component ([PR #4287](https://github.com/alphagov/govuk_publishing_components/pull/4287))
* Add new chart component options ([PR #4318](https://github.com/alphagov/govuk_publishing_components/pull/4318))
* Add shared helper and component wrapper helper to govspeak component ([PR #4325](https://github.com/alphagov/govuk_publishing_components/pull/4325))
* Add component wrapper to emergency banner component ([PR #4283](https://github.com/alphagov/govuk_publishing_components/pull/4283))

## 44.4.2

* Fix ecommerce tracking of searches without query ([PR #4317](https://github.com/alphagov/govuk_publishing_components/pull/4317))

## 44.4.1

* Add chartkick path to gemspec ([PR #4312](https://github.com/alphagov/govuk_publishing_components/pull/4312))

## 44.4.0

* Add chart component ([PR #4301](https://github.com/alphagov/govuk_publishing_components/pull/4301))
* Add inverse option for organisation logo ([PR #4284](https://github.com/alphagov/govuk_publishing_components/pull/4284))
* New options for contents-list component ([PR #4305](https://github.com/alphagov/govuk_publishing_components/pull/4305))

## 44.3.0

* Add variants required for square blue icon share links ([PR #4292](https://github.com/alphagov/govuk_publishing_components/pull/4292))

## 44.2.0

* Upgrade to version 5.7.0 of govuk-frontend ([PR #4298](https://github.com/alphagov/govuk_publishing_components/pull/4298))

## 44.1.0

* Update organisation logos ([PR #4295](https://github.com/alphagov/govuk_publishing_components/pull/4295))

## 44.0.0

* Standardise inverse option for action link component ([PR #4288](https://github.com/alphagov/govuk_publishing_components/pull/4288))
* **BREAKING:** Remove Modernizr ([PR #4273](https://github.com/alphagov/govuk_publishing_components/pull/4273))
* Update accessibility criteria in component docs ([PR #4242](https://github.com/alphagov/govuk_publishing_components/pull/4242))
* Show all big_number symbol types in our docs ([PR #4271](https://github.com/alphagov/govuk_publishing_components/pull/4271))
* Remove incorrect search component example ([PR #4253](https://github.com/alphagov/govuk_publishing_components/pull/4253))
* Add component wrapper to contextual guidance component ([PR #4277](https://github.com/alphagov/govuk_publishing_components/pull/4277))
* Center text and icons vertically in the option select component ([PR #4256](https://github.com/alphagov/govuk_publishing_components/pull/4256))
* Remove instances of ga4_tracking ([PR #4282](https://github.com/alphagov/govuk_publishing_components/pull/4282))
* Add component wrapper to cookie banner ([PR #4279](https://github.com/alphagov/govuk_publishing_components/pull/4279))
* Update attachment link accessibility guidance ([PR #4278](https://github.com/alphagov/govuk_publishing_components/pull/4278))
* Global print link class ([PR #4275](https://github.com/alphagov/govuk_publishing_components/pull/4275))
* Add component wrapper to devolved nations component ([PR #4281](https://github.com/alphagov/govuk_publishing_components/pull/4281))
* Document list: Add option for equal item spacing ([PR #4293](https://github.com/alphagov/govuk_publishing_components/pull/4293))

## 43.5.0

* Add `ostruct` as an explicit dependency ([PR #4251](https://github.com/alphagov/govuk_publishing_components/pull/4251))
* Allow visually hiding legend on `radio` component ([PR #4252](https://github.com/alphagov/govuk_publishing_components/pull/4252))
* Remove breadcrumbs example from inverse_header docs ([PR #4244](https://github.com/alphagov/govuk_publishing_components/pull/4244))

## 43.4.1

* Add accessible-autocomplete node_modules to gemspec ([PR #4246](https://github.com/alphagov/govuk_publishing_components/pull/4246))

## 43.4.0

* Remove left search variant of layout header ([PR #4239](https://github.com/alphagov/govuk_publishing_components/pull/4239))
* Remove 'inverse' background style from phase banner ([PR #4241](https://github.com/alphagov/govuk_publishing_components/pull/4241))
* Add experimental `search_with_autocomplete` component ([PR #4218](https://github.com/alphagov/govuk_publishing_components/pull/4218))

## 43.3.0

* Remove unused cookies from cookie category ([PR #4234](https://github.com/alphagov/govuk_publishing_components/pull/4234))
* Allow custom name attribute on password input ([PR #4238](https://github.com/alphagov/govuk_publishing_components/pull/4238))
* Fix sortable table header issue on mobile ([PR #4233](https://github.com/alphagov/govuk_publishing_components/pull/4233))

## 43.2.0

* Make deploying meta tags changes easier ([PR #4236](https://github.com/alphagov/govuk_publishing_components/pull/4236))
* Update metatags for GA4 ([PR #4222](https://github.com/alphagov/govuk_publishing_components/pull/4222))
* Set aria-label text in govuk_logo.html to "GOV.UK" ([PR #4217](https://github.com/alphagov/govuk_publishing_components/pull/4217))
* Fix cookie expiration date potentially relying on user's timezone ([PR #4219](https://github.com/alphagov/govuk_publishing_components/pull/4219))
* Stop redacting dates in GA4 tracking on GOVUK search pages ([PR #4223](https://github.com/alphagov/govuk_publishing_components/pull/4223))
* Remove 100 character limit on search results ([PR #4230](https://github.com/alphagov/govuk_publishing_components/pull/4230))
* Add GA4 redaction to GWF and GB EORI numbers ([PR #4227](https://github.com/alphagov/govuk_publishing_components/pull/4227))
* Add files for secondary navigation: ([PR #4229](https://github.com/alphagov/govuk_publishing_components/pull/4229))
* New class to collapse columns for print ([PR #4224](https://github.com/alphagov/govuk_publishing_components/pull/4224))
* Fix homepage super navigation buttons when text scale is increased ([PR #4232](https://github.com/alphagov/govuk_publishing_components/pull/4232))

## 43.1.1

* Use component wrapper in hint component ([PR #4214](https://github.com/alphagov/govuk_publishing_components/pull/4214))
* Hide printed URLs when printing tables ([PR #4209](https://github.com/alphagov/govuk_publishing_components/pull/4209))
* Fix action link component print styles ([PR #4213](https://github.com/alphagov/govuk_publishing_components/pull/4213))
* Improve the password input component custom text feature ([PR #4211](https://github.com/alphagov/govuk_publishing_components/pull/4211))
* Make links to parts in `document_list` component respect `remove_underline` setting ([PR #4210](https://github.com/alphagov/govuk_publishing_components/pull/4210))

## 43.1.0

* Add the password input component ([PR #4176](https://github.com/alphagov/govuk_publishing_components/pull/4176))
* Add ga4 tracking to chat entry component ([PR #4196](https://github.com/alphagov/govuk_publishing_components/pull/4196))
* Add Summary Card component to Gem ([PR #4182](https://github.com/alphagov/govuk_publishing_components/pull/4182))

## 43.0.2

* LUX version 4.0.26 ([PR #4192](https://github.com/alphagov/govuk_publishing_components/pull/4192))
* Fix the search toggle in layout header ([PR #4163](https://github.com/alphagov/govuk_publishing_components/pull/4163))
* Replace 'unset' property in printed background colours ([PR #4184](https://github.com/alphagov/govuk_publishing_components/pull/4184))
* Improve print styles for layout-footer component ([PR #4178](https://github.com/alphagov/govuk_publishing_components/pull/4178))
* Improve print styles for inverse-header component ([PR #4179](https://github.com/alphagov/govuk_publishing_components/pull/4179))

## 43.0.1

* Fix card component padding based on heading ([PR #4169](https://github.com/alphagov/govuk_publishing_components/pull/4169))
* Fix print issues on layout-super-navigation-header ([PR #4165](https://github.com/alphagov/govuk_publishing_components/pull/4165))
* Remove unused org colour classes ([PR #4173](https://github.com/alphagov/govuk_publishing_components/pull/4173))

## 43.0.0

* **BREAKING:** Upgrade to govuk-frontend v5.5.0 ([PR #4160](https://github.com/alphagov/govuk_publishing_components/pull/4160))

## 42.1.0

* Ensure that organisation logos always print ([PR #4162](https://github.com/alphagov/govuk_publishing_components/pull/4162))
* Fix some layout_header search visual bugs ([PR #4156](https://github.com/alphagov/govuk_publishing_components/pull/4156))
* Fix issue with using special characters in content-list ([PR #4157](https://github.com/alphagov/govuk_publishing_components/pull/4157))
* Add 'Chat entry' component ([PR #4151](https://github.com/alphagov/govuk_publishing_components/pull/4151))
* Update and/or add component print styles ([PR #4073](https://github.com/alphagov/govuk_publishing_components/pull/4073))
* Move crown logo svgs into partials ([PR #4164](https://github.com/alphagov/govuk_publishing_components/pull/4164))

## 42.0.0

* **BREAKING:** Drop libsass support ([PR #4106](https://github.com/alphagov/govuk_publishing_components/pull/4106))
* **BREAKING:** Drop support for legacy browsers ([PR #4111](https://github.com/alphagov/govuk_publishing_components/pull/4111))

## 41.1.2

* Add icon for external in attachment component ([PR #4150](https://github.com/alphagov/govuk_publishing_components/pull/4150))
* New print styles for the table component ([PR #4139](https://github.com/alphagov/govuk_publishing_components/pull/4139))
* New print styles for the tabs component ([PR #4140](https://github.com/alphagov/govuk_publishing_components/pull/4140))
* New print styles for layout components ([PR #4137](https://github.com/alphagov/govuk_publishing_components/pull/4137))
* New print styles for step-by-step components ([PR #4138](https://github.com/alphagov/govuk_publishing_components/pull/4138))
* New print styles for govspeak components ([PR #4136](https://github.com/alphagov/govuk_publishing_components/pull/4136))
* Fix the print styles for inverse components ([PR #4135](https://github.com/alphagov/govuk_publishing_components/pull/4135))

## 41.1.1

* Update card component styles ([PR #4141](https://github.com/alphagov/govuk_publishing_components/pull/4141))

## 41.1.0

* Upgrade to LUX v4.0.25 ([PR #4129](https://github.com/alphagov/govuk_publishing_components/pull/4129))
* Resolve DartSass mixed declaration deprecations ([PR #4125](https://github.com/alphagov/govuk_publishing_components/pull/4125))
* Drop support for Ruby 3.1 ([PR #4124](https://github.com/alphagov/govuk_publishing_components/pull/4124))
* Update cards component design and use one column by default ([PR #4118](https://github.com/alphagov/govuk_publishing_components/pull/4118))

## 41.0.0

* **BREAKING:** Remove Universal Analytics ([PR #4068](https://github.com/alphagov/govuk_publishing_components/pull/4068))

## 40.1.0

* Allow disabling `search` component input spelling correction ([PR #4112](https://github.com/alphagov/govuk_publishing_components/pull/4112))
* Disable `search` component input spelling correction in `layout_super_navigation_header` and
  `layout_header` components ([PR #4115](https://github.com/alphagov/govuk_publishing_components/pull/4115))
* Add Brakeman to CI jobs ([PR #4108](https://github.com/alphagov/govuk_publishing_components/pull/4108))

## 40.0.0

* **BREAKING:** Upgrade to govuk frontend 5.1 ([PR #4041](https://github.com/alphagov/govuk_publishing_components/pull/4041))

## 39.2.5

* LUX version 4.0.23 ([PR #4102](https://github.com/alphagov/govuk_publishing_components/pull/4102))

## 39.2.4

* Add brand colour for MHCLG ([PR #4100](https://github.com/alphagov/govuk_publishing_components/pull/4100))

## 39.2.3

* Only set `gtm_cookies_win=x` for preview in Google Tag Manager script ([PR #4097](https://github.com/alphagov/govuk_publishing_components/pull/4097))

## 39.2.2

* Adjust govspeak chart label positioning ([PR #4094](https://github.com/alphagov/govuk_publishing_components/pull/4094))

## 39.2.1

* Update to LUX 4.0.20 ([PR #4089](https://github.com/alphagov/govuk_publishing_components/pull/4089))
* Fix missing number formatting in contents list component ([PR #4084](https://github.com/alphagov/govuk_publishing_components/pull/4084))

## 39.2.0

* Disable Universal Analytics ([PR #4083](https://github.com/alphagov/govuk_publishing_components/pull/4083))

## 39.1.0

* Add open attribute to component wrapper ([PR #4074](https://github.com/alphagov/govuk_publishing_components/pull/4074))
* Add guard to accordion component init method ([PR #4069](https://github.com/alphagov/govuk_publishing_components/pull/4069))
* Prevent screen readers from announcing document list child/parts items dashes ([PR #4066](https://github.com/alphagov/govuk_publishing_components/pull/4066))
* Align checkboxes component more toward Design System ([PR #4061](https://github.com/alphagov/govuk_publishing_components/pull/4061))
* Add govuk-frontend checking to the component auditing ([PR #4058](https://github.com/alphagov/govuk_publishing_components/pull/4058))

## 39.0.0

* Use `GOVUK_ENVIRONMENT` instead of `GOVUK_ENVIRONMENT_NAME` for current environment ([PR #4060](https://github.com/alphagov/govuk_publishing_components/pull/4060))

## 38.4.2

* Allow Date in YAML.load_file ([PR #4050](https://github.com/alphagov/govuk_publishing_components/pull/4050))
* Add global bar to GA4 page view tracking ([PR #4051](https://github.com/alphagov/govuk_publishing_components/pull/4051))
* Add a class to the page body when our global bar is present ([PR #4047](https://github.com/alphagov/govuk_publishing_components/pull/4047))
* Add "event_name: navigation" to start button tracking ([PR #4052](https://github.com/alphagov/govuk_publishing_components/pull/4052))

## 38.4.1

* Add missing Welsh translation to the devolved nations component ([PR #4036](https://github.com/alphagov/govuk_publishing_components/pull/4036))

## 38.4.0

* Update module.js ready for v5 of govuk-frontend ([PR #3992](https://github.com/alphagov/govuk_publishing_components/pull/3992))

## 38.3.2

* Reintroduce feedback survey path and new tab functionality ([PR #4024](https://github.com/alphagov/govuk_publishing_components/pull/4024))

## 38.3.1

* Remove Oxford comma from metadata component ([PR #4012](https://github.com/alphagov/govuk_publishing_components/pull/4012))
* Add null check for input element ([PR #4022](https://github.com/alphagov/govuk_publishing_components/pull/4022))

## 38.3.0

* Remove email from survey ([PR #4017](https://github.com/alphagov/govuk_publishing_components/pull/4017))
* Update Twitter logo ([PR #4011](https://github.com/alphagov/govuk_publishing_components/pull/4011))
* Use Terser instead of Uglifier ([PR #3990](https://github.com/alphagov/govuk_publishing_components/pull/3990))

## 38.2.0

* Limit GA4 view_item_list arrays to 15,000 UTF-16 code units ([PR #3994](https://github.com/alphagov/govuk_publishing_components/pull/3994))
* Add custom_header and a custom_layout options ([PR #4004](https://github.com/alphagov/govuk_publishing_components/pull/4004))
* Update LUX to 314 ([PR #4007](https://github.com/alphagov/govuk_publishing_components/pull/4007))
* Add No. 10 logo to organisation logo component ([PR #4008](https://github.com/alphagov/govuk_publishing_components/pull/4008))

## 38.1.1

* Update layout_for_admin component to take custom asset filenames ([PR #3993](https://github.com/alphagov/govuk_publishing_components/pull/3993))

## 38.1.0

* Fix rendering of unnumbered papers ([PR #3988](https://github.com/alphagov/govuk_publishing_components/pull/3988))
* Add PDF specific icon to attachment component ([PR #3985](https://github.com/alphagov/govuk_publishing_components/pull/3985))
* Add the hidden attribute to mobile menu button ([PR #3975](https://github.com/alphagov/govuk_publishing_components/pull/3975))
* Add tool_name to GA4 feedback component tracking ([PR #3984](https://github.com/alphagov/govuk_publishing_components/pull/3984))
* Update script snippet in view templates ([PR #3986](https://github.com/alphagov/govuk_publishing_components/pull/3986))
* Font changes ahead of apps being made compatible with govuk-frontend v5 ([PR #3981](https://github.com/alphagov/govuk_publishing_components/pull/3981))

## 38.0.1

* Explicitly require ostruct ([PR #3976](https://github.com/alphagov/govuk_publishing_components/pull/3976))

## 38.0.0

* **BREAKING:** Remove show password component ([PR #3973](https://github.com/alphagov/govuk_publishing_components/pull/3973))
* Complete the removal of specialist topic code from the gem ([PR #3955](https://github.com/alphagov/govuk_publishing_components/pull/3955))
* Remove support for specialist topics from contextual footer ([PR #3950](https://github.com/alphagov/govuk_publishing_components/pull/3950))
* Update HMRC organisation logos ([PR #3962](https://github.com/alphagov/govuk_publishing_components/pull/3962))

## 37.10.0

* Add discovery_engine_attribution_token to GA4 pageview ([PR #3951](https://github.com/alphagov/govuk_publishing_components/pull/3951))
* Remove support for specialist topics from contextual navigation ie breadcrumbs ([#3927](https://github.com/alphagov/govuk_publishing_components/pull/3927))
* Improve test coverage of contextual breadcrumb logic ([PR #3944](https://github.com/alphagov/govuk_publishing_components/pull/3944) and [PR #3945](https://github.com/alphagov/govuk_publishing_components/pull/3945))
* Remove GA4 callout tracking from the govspeak component ([PR #3946](https://github.com/alphagov/govuk_publishing_components/pull/3946))
* Remove GA4 callout tracking from notice & warning text components ([PR #3947](https://github.com/alphagov/govuk_publishing_components/pull/3947))
* Restores test and refactors component and test for layout-super-navigation-header ([PR #3939](https://github.com/alphagov/govuk_publishing_components/pull/3939))

## 37.9.1

* Track 'Start now' buttons with a specific GA4 type ([PR #3935](https://github.com/alphagov/govuk_publishing_components/pull/3935))
* Use component wrapper in document list component ([PR #3933](https://github.com/alphagov/govuk_publishing_components/pull/3933))

## 37.9.0

* Add a new GA4 'focus loss' tracker ([PR #3920](https://github.com/alphagov/govuk_publishing_components/pull/3920))
* Fix accessibility issue in option select component ([PR #3926](https://github.com/alphagov/govuk_publishing_components/pull/3926))

## 37.8.1

* Remove "Popular" links from super navigation header ([PR #3918](https://github.com/alphagov/govuk_publishing_components/pull/3918))

## 37.8.0

* Disable the single consent cookie API code ([PR #3916](https://github.com/alphagov/govuk_publishing_components/pull/3916))

## 37.7.1

* Move the single consent code ([PR #3913](https://github.com/alphagov/govuk_publishing_components/pull/3913))

## 37.7.0

* Reintroduce GA4 callout tracking and fix link tracker compatibility ([PR #3905](https://github.com/alphagov/govuk_publishing_components/pull/3905))
* Adjust keyboard functionality of dropdown menu ([PR #3888](https://github.com/alphagov/govuk_publishing_components/pull/3888))

## 37.6.1

* Include single consent api package ([PR #3908](https://github.com/alphagov/govuk_publishing_components/pull/3908))
* Fix accessibility issue in contents list component ([PR #3907](https://github.com/alphagov/govuk_publishing_components/pull/3907))

## 37.6.0

* Add single cookie consent API ([PR #3854](https://github.com/alphagov/govuk_publishing_components/pull/3854))
* Update popular links in super navigation header ([PR #3904](https://github.com/alphagov/govuk_publishing_components/pull/3904))
* Allow custom text for GA4 scroll tracker ([PR #3896](https://github.com/alphagov/govuk_publishing_components/pull/3896))
* Ensure analytics stops firing if a user disables usage cookies on our cookie settings page ([PR #3893](https://github.com/alphagov/govuk_publishing_components/pull/3893))
* Fix cookie settings page crash in IE11 ([PR #3894](https://github.com/alphagov/govuk_publishing_components/pull/3894))

## 37.5.1

* Remove GA4 callout tracking from govspeak component ([PR #3889](https://github.com/alphagov/govuk_publishing_components/pull/3889))

## 37.5.0

* Update LUX to 313 ([PR #3884](https://github.com/alphagov/govuk_publishing_components/pull/3884))
* Ensure whitehall content tagged to mainstream browse and the topic taxonomy has a topic taxonomy breadcrumb ([PR #3871](https://github.com/alphagov/govuk_publishing_components/pull/3871))
* Add GA4 tracking to the document list component ([PR #3874](https://github.com/alphagov/govuk_publishing_components/pull/3874))
* Remove GA4 'action' from navigation content history events ([PR #3877](https://github.com/alphagov/govuk_publishing_components/pull/3877))
* Add GA4 tracking to the notice link component ([PR #3885](https://github.com/alphagov/govuk_publishing_components/pull/3885))

## 37.4.0

* Bump govuk-frontend to 4.8 and implement tudor crown ([PR #3852](https://github.com/alphagov/govuk_publishing_components/pull/3852))

## 37.3.1

* Move the skip link after the cookie banner ([PR #3863](https://github.com/alphagov/govuk_publishing_components/pull/3863))
* Update border colours on email/print buttons for greater contrast ([PR #3855](https://github.com/alphagov/govuk_publishing_components/pull/3855))
* Fix some Sass deprecation warnings ([PR #3864](https://github.com/alphagov/govuk_publishing_components/pull/3864))
* Expand GA4 share link tracking to allow for extra values ([PR #3872](https://github.com/alphagov/govuk_publishing_components/pull/3872))

## 37.3.0

* Allow other applications to use GA4 code ([PR #3851](https://github.com/alphagov/govuk_publishing_components/pull/3851))
* Update cookie event listeners ([PR #3849](https://github.com/alphagov/govuk_publishing_components/pull/3849))
* Remove DI cookie consent code ([PR #3846](https://github.com/alphagov/govuk_publishing_components/pull/3846))
* Add tracking to back link ([PR #3840](https://github.com/alphagov/govuk_publishing_components/pull/3840))
* Allow attachment to pass tracking to details ([PR #3820](https://github.com/alphagov/govuk_publishing_components/pull/3820))
* Allow GA4 link tracker to track to multiple child classes ([PR #3835](https://github.com/alphagov/govuk_publishing_components/pull/3835))
* Add GA4 link tracking to govspeak callout links ([PR #3843](https://github.com/alphagov/govuk_publishing_components/pull/3843))
* Allow inputs to be exempt from GA4 form tracker [REDACT] code ([PR #3848](https://github.com/alphagov/govuk_publishing_components/pull/3848))
* Hide our cookie banner when JS is disabled ([PR #3830](https://github.com/alphagov/govuk_publishing_components/pull/3830))

## 37.2.4

* Fix analytics consent ([PR #3833](https://github.com/alphagov/govuk_publishing_components/pull/3833))
* Improve reliability of grabbing GA4 search term value ([PR #3818](https://github.com/alphagov/govuk_publishing_components/pull/3818))
* Update Cross Service Header component ([PR #3831](https://github.com/alphagov/govuk_publishing_components/pull/3831))
* Add GA4 tracking to warning text component ([PR #3832](https://github.com/alphagov/govuk_publishing_components/pull/3832))

## 37.2.3

* Add GOVUK logo to GovernmentOrganization schema.org schemas ([PR #3827](https://github.com/alphagov/govuk_publishing_components/pull/3827))

## 37.2.2

* Remove hyphens and downcase the GA4 publishing government value ([PR #3808](https://github.com/alphagov/govuk_publishing_components/pull/3808))
* Fix Sass negative mixin / value issue ([PR #3816](https://github.com/alphagov/govuk_publishing_components/pull/3816))
* Change social media links advice text ([PR #3814](https://github.com/alphagov/govuk_publishing_components/pull/3814))
* Remove current-location.js ([PR #3812](https://github.com/alphagov/govuk_publishing_components/pull/3812))

## 37.2.1

* Revert changes to fix Sass deprecation warnings ([PR #3810](https://github.com/alphagov/govuk_publishing_components/pull/3810))

## 37.2.0

* Add timestamp value to GA4 dataLayer pushes ([PR #3790](https://github.com/alphagov/govuk_publishing_components/pull/3790))
* Allow GA4 tracking on dev docs ([PR #3802](https://github.com/alphagov/govuk_publishing_components/pull/3802))
* Ensure all GA4 data values are strings ([PR #3800](https://github.com/alphagov/govuk_publishing_components/pull/3800))
* Refactor image card tracking ([PR #3789](https://github.com/alphagov/govuk_publishing_components/pull/3789))
* Details component GA4 tracking ([PR #3786](https://github.com/alphagov/govuk_publishing_components/pull/3786))
* Fix Sass deprecation warnings ([PR #3807](https://github.com/alphagov/govuk_publishing_components/pull/3807))

## 37.1.1

* Make global relative links absolute ([PR #3699](https://github.com/alphagov/govuk_publishing_components/pull/3699))
* Remove duplicate GA4 tracking ([PR #3781](https://github.com/alphagov/govuk_publishing_components/pull/3781))
* Delete unused builds folder ([PR #3778](https://github.com/alphagov/govuk_publishing_components/pull/3778))

## 37.1.0

* Remove hardcoded text from GA4 'Feedback component' tracking, and add disable_ga4 option ([PR #3769](https://github.com/alphagov/govuk_publishing_components/pull/3769))
* Add GA4 copy event tracker ([PR #3761](https://github.com/alphagov/govuk_publishing_components/pull/3761))
* Silence Sass deprecation warnings for dependencies ([PR #3771](https://github.com/alphagov/govuk_publishing_components/pull/3771))
* Fix duplicate font download issue ([PR #3772](https://github.com/alphagov/govuk_publishing_components/pull/3772))

## 37.0.0

* [BREAKING] Data attributes for option select button ([PR #3750](https://github.com/alphagov/govuk_publishing_components/pull/3750))
* Remove doNotTrack from GTM component ([PR #3760](https://github.com/alphagov/govuk_publishing_components/pull/3760))
* Fix rendering of the image card YouTube variation #3757 ([PR #3757](https://github.com/alphagov/govuk_publishing_components/pull/3757))
* Move image-card overrides from frontend app ([PR #3752](https://github.com/alphagov/govuk_publishing_components/pull/3752))
* Migrate to Dart Sass from LibSass ([PR #3604](https://github.com/alphagov/govuk_publishing_components/pull/3604))

## 36.1.0

* Add heading option to file input component ([PR #3755](https://github.com/alphagov/govuk_publishing_components/pull/3755))

## 36.0.3

* Standardise search term formatting across GA4 trackers ([PR #3746](https://github.com/alphagov/govuk_publishing_components/pull/3746))
* Add ZIP file support to attachment component ([PR #3751](https://github.com/alphagov/govuk_publishing_components/pull/3751))

## 36.0.2

* Prevent government_frontend test failure if meta tag key doesn't exist ([PR #3741](https://github.com/alphagov/govuk_publishing_components/pull/3741))

## 36.0.1

* Use component wrapper on option select ([PR #3738](https://github.com/alphagov/govuk_publishing_components/pull/3738))

## 36.0.0

* Let applications use the component wrapper helper ([PR #3736](https://github.com/alphagov/govuk_publishing_components/pull/3736))
* [BREAKING] Change action link component options ([PR #3729](https://github.com/alphagov/govuk_publishing_components/pull/3729))
* Remove attribute nesting handling from GA4 schemas ([PR #3718](https://github.com/alphagov/govuk_publishing_components/pull/3718))
* Allow GA4 to be disabled via query string parameters ([PR #3731](https://github.com/alphagov/govuk_publishing_components/pull/3731))
* Consolidate GA4 schema calls ([PR #3725](https://github.com/alphagov/govuk_publishing_components/pull/3725))
* Make data-ga4-set-indexes ignore links with no href ([PR #3723](https://github.com/alphagov/govuk_publishing_components/pull/3723))
* Improve PII date removal ([PR #3709](https://github.com/alphagov/govuk_publishing_components/pull/3709))
* Decommission GA4 link_path_parts and splitting of taxonomy_all and taxonomy_all_ids ([PR #3730](https://github.com/alphagov/govuk_publishing_components/pull/3730))
* Create new political meta tags for GA4 ([PR #3706](https://github.com/alphagov/govuk_publishing_components/pull/3706))

## 35.23.0

* Implement One Login "cross service header" ([PR #3659](https://github.com/alphagov/govuk_publishing_components/pull/3659))
* Add alt/option click tracking to GA4 link tracker ([PR #3720](https://github.com/alphagov/govuk_publishing_components/pull/3720))

## 35.22.0

* Enable GA4 by default on components ([PR #3705](https://github.com/alphagov/govuk_publishing_components/pull/3705))
* Change GA4 video tracking duration handling ([PR #3717](https://github.com/alphagov/govuk_publishing_components/pull/3717))

## 35.21.4

* Metadata component inverse option remove background ([PR #3711](https://github.com/alphagov/govuk_publishing_components/pull/3711))

## 35.21.3

* GA4 auto tracker add PII redaction ([PR #3707](https://github.com/alphagov/govuk_publishing_components/pull/3707))

## 35.21.2

* Revert nav menu font changes ([PR #3696](https://github.com/alphagov/govuk_publishing_components/pull/3696))

## 35.21.1

* Replace UA ecommerce tracking attributes with GA4 specific ones ([PR #3688](https://github.com/alphagov/govuk_publishing_components/pull/3688))
* Fix visual bug with contents list manually numbered headings ([PR #3694](https://github.com/alphagov/govuk_publishing_components/pull/3694))

## 35.21.0

* Add metadata inverse no padding option ([PR #3689](https://github.com/alphagov/govuk_publishing_components/pull/3689))
* Prevent GA4 data sending during Smokey tests ([PR #3680](https://github.com/alphagov/govuk_publishing_components/pull/3680))

## 35.20.1

* Adjustments to the navbar for the homepage ([PR #3666](https://github.com/alphagov/govuk_publishing_components/pull/3666))
* Adjust the size of large navbar super navigation header ([PR #3677](https://github.com/alphagov/govuk_publishing_components/pull/3677))
* Add visually hidden text to the navbar ([PR #3684](https://github.com/alphagov/govuk_publishing_components/pull/3684))
* Add data-ga4-form-no-answer-undefined to header search form ([PR #3682](https://github.com/alphagov/govuk_publishing_components/pull/3682))
* Stop search icon from moving up and down ([PR #3685](https://github.com/alphagov/govuk_publishing_components/pull/3685))

## 35.20.0

* Flatten GA4 data attributes ([PR #3649](https://github.com/alphagov/govuk_publishing_components/pull/3649))
* Use custom SVG for search 'cancel' icon ([PR #3673](https://github.com/alphagov/govuk_publishing_components/pull/3673))
* Add GA4 'print intent' tracker ([PR #3652](https://github.com/alphagov/govuk_publishing_components/pull/3652))
* Update LUX to version 312 ([PR #3672](https://github.com/alphagov/govuk_publishing_components/pull/3672))
* Grab data-ga4-ecommerce-content-id in GA4 ecommerce tracking ([PR #3676](https://github.com/alphagov/govuk_publishing_components/pull/3676))
* Update the styling of image-card two thirds variation ([PR #3671](https://github.com/alphagov/govuk_publishing_components/pull/3671))

## 35.19.0

* Improve attachment details styles ([PR #3668](https://github.com/alphagov/govuk_publishing_components/pull/3668))
* Fix GA4 contents list events ([PR #3667](https://github.com/alphagov/govuk_publishing_components/pull/3667))
* Add viewport size to GA4 page view ([PR #3665](https://github.com/alphagov/govuk_publishing_components/pull/3665))
* Replace '+' in GA4 search term values with an actual space ([PR #3653](https://github.com/alphagov/govuk_publishing_components/pull/3653))
* Update image card two thirds variation ([PR #3661](https://github.com/alphagov/govuk_publishing_components/pull/3661))
* Update logo spacing for new homepage design ([PR #3658](https://github.com/alphagov/govuk_publishing_components/pull/3658))
* Limit GA4 ecommerce arrays to 200 items ([PR #3662](https://github.com/alphagov/govuk_publishing_components/pull/3662))
* Allow GA4 Form text values to be undefined instead of 'No answer given' ([PR #3663](https://github.com/alphagov/govuk_publishing_components/pull/3663))
* Return undefined for meta tags if content is an empty string ([PR #3664](https://github.com/alphagov/govuk_publishing_components/pull/3664))

## 35.18.0

* Change GA4 type on contents lists ([PR #3647](https://github.com/alphagov/govuk_publishing_components/pull/3647))
* Bump Ruby version and use floating patch version ([PR #3646](https://github.com/alphagov/govuk_publishing_components/pull/3646))
* Add homepage variant of navbar for new design of homepage ([PR #3566](https://github.com/alphagov/govuk_publishing_components/pull/3566))

## 35.17.0

* Add new light action link variant ([PR #3602](https://github.com/alphagov/govuk_publishing_components/pull/3602))
* Add new homepage variant to search component ([PR #3599](https://github.com/alphagov/govuk_publishing_components/pull/3599))
* Change GA4 type for show/hide update links ([PR #3643](https://github.com/alphagov/govuk_publishing_components/pull/3643))
* Account for licence finder results count in GA4 ecommerce tracking ([PR #3641](https://github.com/alphagov/govuk_publishing_components/pull/3641))

## 35.16.1

* Add GA4 to nested contents item links ([PR #3638](https://github.com/alphagov/govuk_publishing_components/pull/3638))
* Change GA4 contents list type ([PR #3635](https://github.com/alphagov/govuk_publishing_components/pull/3635))
* Change prev and next GA4 type ([PR #3631](https://github.com/alphagov/govuk_publishing_components/pull/3631))
* Remove timestamps from GA4 video urls ([PR #3632](https://github.com/alphagov/govuk_publishing_components/pull/3632))
* Add stylistic plugin for stylelint ([PR #3629](https://github.com/alphagov/govuk_publishing_components/pull/3629))
* Remove option select GA4 attributes ([PR #3625](https://github.com/alphagov/govuk_publishing_components/pull/3625))
* Fix various bugs with the GA4 pageview tracker ([PR #3626](https://github.com/alphagov/govuk_publishing_components/pull/3626))
* Add 'ga4-browse-topic' meta tag to track the mainstream browse topic ([PR #3628](https://github.com/alphagov/govuk_publishing_components/pull/3628))
* Ensure cookie banner isn't tracked as visible when it is hidden via JS ([PR #3612](https://github.com/alphagov/govuk_publishing_components/pull/3612))
* Add spelling_suggestion meta tag to the GA4 pageview object ([PR #3633](https://github.com/alphagov/govuk_publishing_components/pull/3633))
* Add an `aria-label` to the attachment preview link ([PR #3630](https://github.com/alphagov/govuk_publishing_components/pull/3630))

## 35.16.0

* Add option select component ([PR #3623](https://github.com/alphagov/govuk_publishing_components/pull/3623))
* Image card Two Thirds variant ([PR #3597](https://github.com/alphagov/govuk_publishing_components/pull/3597))
* Add 'search_term' to GA4 pageview object ([PR #3615](https://github.com/alphagov/govuk_publishing_components/pull/3615))

## 35.15.5

* Use an absolute URL for og:image Open Graph property ([PR #3619](https://github.com/alphagov/govuk_publishing_components/pull/3619))

## 35.15.4

* Add query string to GA4 pageview tracking ([PR #3609](https://github.com/alphagov/govuk_publishing_components/pull/3609))
* Add large dark icon for action link ([PR #3594](https://github.com/alphagov/govuk_publishing_components/pull/3596))

## 35.15.3

* Improve GA URL parameter stripping ([PR #3603](https://github.com/alphagov/govuk_publishing_components/pull/3603))
* Fix bug with GA4 search results count ([PR #3594](https://github.com/alphagov/govuk_publishing_components/pull/3594))
* Check HTML attribute when populating GA4 language ([PR #3598](https://github.com/alphagov/govuk_publishing_components/pull/3598))
* Add GA4 tracking to the intervention banner ([PR #3567](https://github.com/alphagov/govuk_publishing_components/pull/3567))
* Add 6th link to popular links ([PR #3586](https://github.com/alphagov/govuk_publishing_components/pull/3586))

## 35.15.2

* Fix error in LUX script ([PR #3592](https://github.com/alphagov/govuk_publishing_components/pull/3592))
* Prepend page path when tracking anchor links in GA4 ([PR #3590](https://github.com/alphagov/govuk_publishing_components/pull/3590))

## 35.15.1

* Add new rule to fix accordion print style ([PR #3582](https://github.com/alphagov/govuk_publishing_components/pull/3582))
* Fix GA4 bug - all attachments links tracked with the same JSON ([PR #3577](https://github.com/alphagov/govuk_publishing_components/pull/3577))
* LUX version 311 ([PR #3572](https://github.com/alphagov/govuk_publishing_components/pull/3572))
* Enable GA4 tracking on the phase banner ([PR #3588](https://github.com/alphagov/govuk_publishing_components/pull/3588))
* Add expansion to print style for govspeak links ([PR #3584](https://github.com/alphagov/govuk_publishing_components/pull/3584))

## 35.15.0

* Change "Topics" to "Services and information" ([PR #3570](https://github.com/alphagov/govuk_publishing_components/pull/3570))
* Redact GA params from pageview data ([PR #3568](https://github.com/alphagov/govuk_publishing_components/pull/3568))
* Add GA4 tracking to devolved nations banners ([PR #3556](https://github.com/alphagov/govuk_publishing_components/pull/3556))
* Add GA4 tracking to the cookie banner ([PR #3564](https://github.com/alphagov/govuk_publishing_components/pull/3564))
* Fix row spacing on topics browse pages ([PR #3540](https://github.com/alphagov/govuk_publishing_components/pull/3540))

## 35.14.0

* Add GA4 tracking to the emergency banner ([PR #3549](https://github.com/alphagov/govuk_publishing_components/pull/3549))
* Ensure file attachments have the GA4 event_name 'file_download' ([PR #3553](https://github.com/alphagov/govuk_publishing_components/pull/3553))
* Add GA4 tracking to the phase banner ([PR #3552](https://github.com/alphagov/govuk_publishing_components/pull/3552))
* Use replace() instead of replaceAll() in removeCrossDomainParams() ([PR #3555](https://github.com/alphagov/govuk_publishing_components/pull/3555))

## 35.13.2

* Add a reset option into the GA4 scrolltracker ([PR #3544](https://github.com/alphagov/govuk_publishing_components/pull/3544))
* Expand GA4 form tracker ([PR #3546](https://github.com/alphagov/govuk_publishing_components/pull/3546))
* Adjust core functions setIndexes ([PR #3541](https://github.com/alphagov/govuk_publishing_components/pull/3541))
* GA4 pageview changes ([PR #3542](https://github.com/alphagov/govuk_publishing_components/pull/3542))
* Fix select width overlap bug ([PR #3538](https://github.com/alphagov/govuk_publishing_components/pull/3538))
* Add section attribute to scroll tracking ([PR #3537](https://github.com/alphagov/govuk_publishing_components/pull/3537))
* Add navigation-page-type GA4 pageview attribute ([PR #3529](https://github.com/alphagov/govuk_publishing_components/pull/3529))
* Update the documentation for loading component stylesheets individually ([PR #3543](https://github.com/alphagov/govuk_publishing_components/pull/3543))
* Add GA4 video tracking ([PR #3535](https://github.com/alphagov/govuk_publishing_components/pull/3535))
* Move GA4 attachment link tracking to all attachment links ([PR #3515](https://github.com/alphagov/govuk_publishing_components/pull/3515))

## 35.13.1

* Add GA4 pageview meta tag: ab_test ([PR #3523](https://github.com/alphagov/govuk_publishing_components/pull/3523))
* Wrap the text of `start` buttons in a `span` ([PR #3478](https://github.com/alphagov/govuk_publishing_components/pull/3478))

## 35.13.0

* Fix 100% scroll problem ([PR #3521](https://github.com/alphagov/govuk_publishing_components/pull/3521))
* Extend component wrapper helper and use on heading component ([PR #3519](https://github.com/alphagov/govuk_publishing_components/pull/3519))
* Remove licence-finder from list of audited applications ([PR #3518](https://github.com/alphagov/govuk_publishing_components/pull/3518))
* Fix inconsistent focus state on document list component ([PR #3468](https://github.com/alphagov/govuk_publishing_components/pull/3468))
* Render an outline for search button and input in Windows high contrast mode ([PR #3502](https://github.com/alphagov/govuk_publishing_components/pull/3502))

## 35.12.0

* Change how GA4 schema construction works ([PR #3436](https://github.com/alphagov/govuk_publishing_components/pull/3436))
* Add GA4 scroll tracker ([PR #3464](https://github.com/alphagov/govuk_publishing_components/pull/3464))
* Ensure search forms have their text sent to GA4 in lowercase ([PR #3504](https://github.com/alphagov/govuk_publishing_components/pull/3504))
* Add GA4 HTML attachment tracking to attachment component ([PR #3500](https://github.com/alphagov/govuk_publishing_components/pull/3500))
* Add functionality for preventing the redaction of publicly available information ([PR #3509](https://github.com/alphagov/govuk_publishing_components/pull/3509))
* Ensure extra spaces are removed from search forms ([PR #3512](https://github.com/alphagov/govuk_publishing_components/pull/3512))
* Add link option to tabs component ([PR #3486](https://github.com/alphagov/govuk_publishing_components/pull/3486))

## 35.11.0

* GA4 content navigation fixes ([PR #3495](https://github.com/alphagov/govuk_publishing_components/pull/3495))
* Fix feedback component spacing ([PR #3470](https://github.com/alphagov/govuk_publishing_components/pull/3470))
* Fix attachment metadata styling issue ([PR #3501](https://github.com/alphagov/govuk_publishing_components/pull/3501))
* Improve the govspeak table layout when text direction is right-to-left ([PR #3466](https://github.com/alphagov/govuk_publishing_components/pull/3466))

## 35.10.0

* Add margin_bottom param to Attachment component ([PR #3475](https://github.com/alphagov/govuk_publishing_components/pull/3475))

## 35.9.0

* Update single page notification button ([PR #3471](https://github.com/alphagov/govuk_publishing_components/pull/3471))
* Fix GA4 accordion tracking bugs ([PR #3461](https://github.com/alphagov/govuk_publishing_components/pull/3461))
* Add ga4 tracking to single page notifications button ([PR #3443](https://github.com/alphagov/govuk_publishing_components/pull/3443))
* Update notice component example ([PR #3465](https://github.com/alphagov/govuk_publishing_components/pull/3465))
* Ensure GA4 link text is 'image' when the event target is an image ([PR #3462](https://github.com/alphagov/govuk_publishing_components/pull/3462))

## 35.8.0

* Upgrade LUX to version 309 ([PR #3458](https://github.com/alphagov/govuk_publishing_components/pull/3458))
* Refactor document list component ([PR #3454](https://github.com/alphagov/govuk_publishing_components/pull/3454))
* Add option for blue bar background to public_layout ([PR #3380](https://github.com/alphagov/govuk_publishing_components/pull/3380))
* Add ga4-link attribute for other 'see all updates' link ([PR #3451](https://github.com/alphagov/govuk_publishing_components/pull/3451/))
* Change GA4 type ([PR #3456](https://github.com/alphagov/govuk_publishing_components/pull/3456))
* Use safe navigation operator in asset_helper.rb ([PR #3455](https://github.com/alphagov/govuk_publishing_components/pull/3455))

## 35.7.0

* Component auditing improvements ([PR #3423](https://github.com/alphagov/govuk_publishing_components/pull/3423))
* Fully implement loading of individual stylesheets in component guide ([PR #3379](https://github.com/alphagov/govuk_publishing_components/pull/3379))
* Add support for HTML and external attachment types ([PR #3442](https://github.com/alphagov/govuk_publishing_components/pull/3442))
* Add 'View online' preview link to Attachment ([PR #3449](https://github.com/alphagov/govuk_publishing_components/pull/3449))

## 35.6.0

* Remove GA4 index parsing code ([PR #3434](https://github.com/alphagov/govuk_publishing_components/pull/3434))
* Fix GA4 tracking on step nav related ([PR #3431](https://github.com/alphagov/govuk_publishing_components/pull/3431))
* Remove hardcoded examples in the component guide ([PR #3418](https://github.com/alphagov/govuk_publishing_components/pull/3418))
* Remove list-style for govspeak ordered lists ([PR #3413](https://github.com/alphagov/govuk_publishing_components/pull/3413))
* Fix some issues with GA4 indexes ([PR #3426](https://github.com/alphagov/govuk_publishing_components/pull/3426))
* Fix PII on referrer parameter ([PR #3430](https://github.com/alphagov/govuk_publishing_components/pull/3430))
* Add GA4 tracking for content navigation ([PR #3420](https://github.com/alphagov/govuk_publishing_components/pull/3420))
* Update setIndexes function ([PR #3435](https://github.com/alphagov/govuk_publishing_components/pull/3435))

## 35.5.0

* Allow ga4-form-tracker text to be overridden ([PR #3409](https://github.com/alphagov/govuk_publishing_components/pull/3409))
* Change GA4 share values ([PR #3407](https://github.com/alphagov/govuk_publishing_components/pull/3407))
* Add GA4 index_section_count to step by step links ([PR #3410](https://github.com/alphagov/govuk_publishing_components/pull/3410))
* Set GA4 link text to 'image' if there's only an image and no link text ([PR #3404](https://github.com/alphagov/govuk_publishing_components/pull/3404))

## 35.4.0

* Add auditing of application components to component auditing ([PR #3374](https://github.com/alphagov/govuk_publishing_components/pull/3374))
* Fix GA4 index parameters on step nav show/hide all control ([PR #3397](https://github.com/alphagov/govuk_publishing_components/pull/3397))
* Update to LUX 308 ([PR #3394](https://github.com/alphagov/govuk_publishing_components/pull/3394))
* Ensure PIIRemover is running on GA4 link clicks ([PR #3402](https://github.com/alphagov/govuk_publishing_components/pull/3402))
* Update hint component ([PR #3405](https://github.com/alphagov/govuk_publishing_components/pull/3405))
* [Fixes] World Locations Links From Base Path ([PR #3396](https://github.com/alphagov/govuk_publishing_components/pull/3396))
* Remove the blue background from search button ([PR #3393](https://github.com/alphagov/govuk_publishing_components/pull/3393))

## 35.3.5

* Add GA4 debugging assistance ([PR #3388](https://github.com/alphagov/govuk_publishing_components/pull/3388))
* Remove custom brand colours for Department for Business And Trade ([PR #3391](https://github.com/alphagov/govuk_publishing_components/pull/3391))
* Conditionally set GA4 type in related navigation ([PR #3390](https://github.com/alphagov/govuk_publishing_components/pull/3390))
* Change type 'html attachment' to just 'attachment' ([PR #3382](https://github.com/alphagov/govuk_publishing_components/pull/3382))
* Update popular on gov.uk links in search bar ([PR #3385](https://github.com/alphagov/govuk_publishing_components/pull/3385))

## 35.3.4

* Update organisation logo ([PR #3381](https://github.com/alphagov/govuk_publishing_components/pull/3381))
* Add missing background colour style for metadata block inverse option ([PR #3365](https://github.com/alphagov/govuk_publishing_components/pull/3365))
* Fix some GA4 index bugs ([PR #3375](https://github.com/alphagov/govuk_publishing_components/pull/3375))
* Rename type breadcrumbs to breadcrumb ([PR #3373](https://github.com/alphagov/govuk_publishing_components/pull/3373))
* Update AssetHelper documentation ([PR #3378](https://github.com/alphagov/govuk_publishing_components/pull/3378))
* Fix component guide previews for application components ([PR #3347](https://github.com/alphagov/govuk_publishing_components/pull/3347))

## 35.3.3

* Make Cookie Banner Implementation More Like Design System Implementation ([PR #3325](https://github.com/alphagov/govuk_publishing_components/pull/3325))
* Remove capitalisation on GA4 action property value ([PR #3367](https://github.com/alphagov/govuk_publishing_components/pull/3367))
* Add Welsh translation for `all_opens_in_new_tab` ([PR #3370](https://github.com/alphagov/govuk_publishing_components/pull/3370))

## 35.3.2

* Fix GA4 index_total parameter in various places ([PR #3358](https://github.com/alphagov/govuk_publishing_components/pull/3358))

## 35.3.1

* Add organisation brand colour for Department for Business & Trade ([PR #3361](https://github.com/alphagov/govuk_publishing_components/pull/3361))
* Add brand colour for DSIT ([PR #3349](https://github.com/alphagov/govuk_publishing_components/pull/3349))
* Update GA4 index parameter on related navigation ([PR #3346](https://github.com/alphagov/govuk_publishing_components/pull/3346))
* Update the Attachment component to accept a thumbnail parameter ([PR #3332](https://github.com/alphagov/govuk_publishing_components/pull/3332))

## 35.3.0

* Add data attributes to attachment links using JS ([PR #3330](https://github.com/alphagov/govuk_publishing_components/pull/3330))
* Ga4 accordion link tracking ([PR #3328](https://github.com/alphagov/govuk_publishing_components/pull/3328))
* Fix GA4 Step Nav link tracking bug ([PR #3334](https://github.com/alphagov/govuk_publishing_components/pull/3334))

## 35.2.0

* Update to Lux 307 ([PR #3329](https://github.com/alphagov/govuk_publishing_components/pull/3329))
* Drop support for Ruby 2.7 ([PR #3310](https://github.com/alphagov/govuk_publishing_components/pull/3310))
* Update GA4 index parameter ([PR #3297](https://github.com/alphagov/govuk_publishing_components/pull/3297))
* Make the component wrapper helper more robust ([PR #3324](https://github.com/alphagov/govuk_publishing_components/pull/3324))
* Make auditing aware of new asset loading model ([PR #3318](https://github.com/alphagov/govuk_publishing_components/pull/3318))
* Ga4 part of heading tracking fix ([PR #3321](https://github.com/alphagov/govuk_publishing_components/pull/3321))
* Ga4 fix index ([PR #3313](https://github.com/alphagov/govuk_publishing_components/pull/3313))
* Fix search icon cut-off in navbar ([PR #3322](https://github.com/alphagov/govuk_publishing_components/pull/3322))
* Update AssetHelper documentation ([PR #3323](https://github.com/alphagov/govuk_publishing_components/pull/3323))

## 35.1.1

* Remove links and sections count tracking for retired Cost of living hub page ([PR #3315](https://github.com/alphagov/govuk_publishing_components/pull/3315))
* Update the list of popular links in the super navigation header ([PR #3316](https://github.com/alphagov/govuk_publishing_components/pull/3316))

## 35.1.0

* Always require AssetHelpers so gem can operate without Rails ([PR #3309](https://github.com/alphagov/govuk_publishing_components/pull/3309))
* Update AssetHelper documentation ([PR #3298](https://github.com/alphagov/govuk_publishing_components/pull/3298))
* Ensure color contrast in code examples meets accessibility requirements ([PR #3311](https://github.com/alphagov/govuk_publishing_components/pull/3311))
* Update error summary to use component wrapper helper ([PR #3308](https://github.com/alphagov/govuk_publishing_components/pull/3308))
* Add GA4 tracking to footer links ([PR #3306](https://github.com/alphagov/govuk_publishing_components/pull/3306))
* Remove 'Cost of living support' from navbar and footer ([PR #3312](https://github.com/alphagov/govuk_publishing_components/pull/3312))

## 35.0.0

* Fix redaction bug in GA4 form tracker ([PR #3300](https://github.com/alphagov/govuk_publishing_components/pull/3300))
* Add GA4 tracking option to tabs component ([PR #3296](https://github.com/alphagov/govuk_publishing_components/pull/3296))
* Fix component auditing ([PR #3292](https://github.com/alphagov/govuk_publishing_components/pull/3292))
* Fix smart answer PII issue ([PR #3291](https://github.com/alphagov/govuk_publishing_components/pull/3291))
* Update accordion index parameter ([PR #3290](https://github.com/alphagov/govuk_publishing_components/pull/3290))
* Add GA4 tracking to step by step links ([PR #3289](https://github.com/alphagov/govuk_publishing_components/pull/3289))
* **BREAKING** Expand use of component wrapper helper ([PR #3254](https://github.com/alphagov/govuk_publishing_components/pull/3254))

## 34.14.0

* Change how GA4 index parameter works ([PR #3277](https://github.com/alphagov/govuk_publishing_components/pull/3277))
* Add GA4 tracking to the super breadcrumb ([PR #3272](https://github.com/alphagov/govuk_publishing_components/pull/3272))
* Add ga4 tracking to 'part of' heading ([PR #3284](https://github.com/alphagov/govuk_publishing_components/pull/3284))

## 34.13.0

* Set up gem so stylesheets can be loaded individually, **Note:** this change is experimental, it will be used in the `frontend` application first, please do not implement this feature in other applications ([PR #3014](https://github.com/alphagov/govuk_publishing_components/pull/3014))
* Set ga 4 related links locale as :en ([PR #3273](https://github.com/alphagov/govuk_publishing_components/pull/3273))

## 34.12.0

* Update link on Invasion of Ukraine sidebar ([PR #3274](https://github.com/alphagov/govuk_publishing_components/pull/3264))
* Add helpers by component to auditing ([PR #3263](https://github.com/alphagov/govuk_publishing_components/pull/3263))
* Apply GA4 tracking to site header search box ([PR #3269](https://github.com/alphagov/govuk_publishing_components/pull/3269))
* Add GA4 tracking to related navigation component 'show more' link ([PR #3268](https://github.com/alphagov/govuk_publishing_components/pull/3268))

## 34.11.0

* Increase clickable area for links in navbar ([PR #3238](https://github.com/alphagov/govuk_publishing_components/pull/3238))
* Cover all types of relative hrefs in hrefIsRelative function ([PR #3251](https://github.com/alphagov/govuk_publishing_components/pull/3251))
* Force English text on our GA4 related navigation section tracking ([PR #3259](https://github.com/alphagov/govuk_publishing_components/pull/3259))
* Add ga4 tracking smart answer results ([PR #3235](https://github.com/alphagov/govuk_publishing_components/pull/3235))
* Add GA4 tracking to our breadcrumbs ([PR #3257](https://github.com/alphagov/govuk_publishing_components/pull/3257))
* Make Navbar Menu Relatively Positioned Instead of Absolutely Positioned ([PR #3201](https://github.com/alphagov/govuk_publishing_components/pull/3201))
* Fix smart answer results tracking ([PR #3261](https://github.com/alphagov/govuk_publishing_components/pull/3261))
* Add indexing of links using JS ([PR #3262](https://github.com/alphagov/govuk_publishing_components/pull/3262))

## 34.10.1

* Remove the brand colour for Department for Energy Security and Net Zero ([PR #3255](https://github.com/alphagov/govuk_publishing_components/pull/3255))

## 34.10.0

* Add GA4 auto tracker ([PR #3240](https://github.com/alphagov/govuk_publishing_components/pull/3240))
* Add GA4 tracking to contextual sidebar Ukraine CTA ([PR #3236](https://github.com/alphagov/govuk_publishing_components/pull/3236))
* Use string splitter on taxonomyAll and taxonomyAllIds pageview values ([PR #3249](https://github.com/alphagov/govuk_publishing_components/pull/3249))
* Add a new brand colour for Department for Energy Security and Net Zero ([PR #3252](https://github.com/alphagov/govuk_publishing_components/pull/3252))

## 34.9.1

* Update Component Guide skip_account to mention GOV.UK One Login ([PR #3247](https://github.com/alphagov/govuk_publishing_components/pull/3247))
* Update "Account" copy to "GOV.UK One Login" ([PR #3246](https://github.com/alphagov/govuk_publishing_components/pull/3246))

## 34.9.0

* Allow single page notification button to skip the govuk-account ([PR #3229](https://github.com/alphagov/govuk_publishing_components/pull/3229))

## 34.8.1

* Reverts release 34.7.1 concerning related World Location links ([PR #3243](https://github.com/alphagov/govuk_publishing_components/pull/3243))

## 34.8.0

* Add GA4 Form tracker ([PR #3215](https://github.com/alphagov/govuk_publishing_components/pull/3215))
* Add component wrapper helper ([PR #3171](https://github.com/alphagov/govuk_publishing_components/pull/3171))
* Add aria attributes to Details component ([PR #3225](https://github.com/alphagov/govuk_publishing_components/pull/3225))

## 34.7.1

* Use base path to form URLs for related World Location links ([PR #3102](https://github.com/alphagov/govuk_publishing_components/pull/3102))

## 34.7.0

* Add GA4 modules error checking ([PR #3228](https://github.com/alphagov/govuk_publishing_components/pull/3228))
* Add classes to align text in Govspeak tables ([PR #3217](https://github.com/alphagov/govuk_publishing_components/pull/3217))
* Make links bold at all viewports on navbar menu ([PR #3219](https://github.com/alphagov/govuk_publishing_components/pull/3219))
* Add our 'assets' domain as a domain that should run our analytics ([PR #3224](https://github.com/alphagov/govuk_publishing_components/pull/3224))
* Add document list component option to remove first item top border ([PR #3221](https://github.com/alphagov/govuk_publishing_components/pull/3221))
* Allow a tracked ga4 link to be hardcoded via its ga4-link JSON ([PR #3227](https://github.com/alphagov/govuk_publishing_components/pull/3227))

## 34.6.0

* Revert load-analytics commits due to Smokey test failure ([PR #3212](https://github.com/alphagov/govuk_publishing_components/pull/3212))

## 34.5.1

* Change console.error to console.warn as it breaks Smokey tests ([PR #3210](https://github.com/alphagov/govuk_publishing_components/pull/3210))

## 34.5.0

* Catch errors when modules initialised ([PR #3190](https://github.com/alphagov/govuk_publishing_components/pull/3190))
* Add translation strings for cookie banner confirmation message ([PR #3191](https://github.com/alphagov/govuk_publishing_components/pull/3191))
* Add ga4-link-tracker to image card ([PR #3154](https://github.com/alphagov/govuk_publishing_components/pull/3154))
* Add ga4 tracking to header links ([PR #3152](https://github.com/alphagov/govuk_publishing_components/pull/3152))
* Ensure our analytics load at the earliest point possible in page load ([PR #3195](https://github.com/alphagov/govuk_publishing_components/pull/3195))

## 34.4.2

* Load modules after analytics has loaded ([PR #3187](https://github.com/alphagov/govuk_publishing_components/pull/3187))

## 34.4.1

* Fix bug where analytics tries to init in tests which don't import it ([PR #3185](https://github.com/alphagov/govuk_publishing_components/pull/3185))

## 34.4.0

* Add GA4 tracking to related navigation ([PR #3179](https://github.com/alphagov/govuk_publishing_components/pull/3179))
* Add Youtube Embed Support to the ImageCard Component ([PR #3156](https://github.com/alphagov/govuk_publishing_components/pull/3156))
* Remove dependency on .js.erb and puppet for loading our analytics ([PR #3145](https://github.com/alphagov/govuk_publishing_components/pull/3145))
* Disable axe-core rules for issues highlighted in component guide ([PR #3180](https://github.com/alphagov/govuk_publishing_components/pull/3180))

## 34.3.0

* Support Rails Content Security Policy nonce on inline JavaScript ([PR #3173](https://github.com/alphagov/govuk_publishing_components/pull/3173))
* Restyle subscription link ([PR #3177](https://github.com/alphagov/govuk_publishing_components/pull/3177))
* Change "+" to "Show" in related navigation and metadata block components ([PR #3038](https://github.com/alphagov/govuk_publishing_components/pull/3038))
* Extend the `input` and `textarea` components to use the `dir` attribute ([PR #3081](https://github.com/alphagov/govuk_publishing_components/pull/3081))
* Improve accessibility of button focus states ([PR #3146](https://github.com/alphagov/govuk_publishing_components/pull/3146))

## 34.2.0

* Update the list of popular links in the super navigation header ([PR #3167](https://github.com/alphagov/govuk_publishing_components/pull/3167))
* Replace input search icon data:image with file asset ([PR #3163](https://github.com/alphagov/govuk_publishing_components/pull/3163))
* Pure CSS approach to numbering Govspeak steps ([PR #3166](https://github.com/alphagov/govuk_publishing_components/pull/3166))

## 34.1.3

* Remove inline styling from feedback component ([PR #3159](https://github.com/alphagov/govuk_publishing_components/pull/3159))
* Increase space beneath list items on the image_card component ([PR #3153](https://github.com/alphagov/govuk_publishing_components/pull/3153))

## 34.1.2

* Bump govuk-frontend from 4.4.0 to 4.4.1 ([PR #3147](https://github.com/alphagov/govuk_publishing_components/pull/3147))

## 34.1.1

* Update component auditing following print style changes ([PR #3128](https://github.com/alphagov/govuk_publishing_components/pull/3128))
* Remove the redundant region role from the cookie banner ([PR #3075](https://github.com/alphagov/govuk_publishing_components/pull/3075))
* Change brand colour for No. 10 to be govuk-black ([PR #3143](https://github.com/alphagov/govuk_publishing_components/pull/3143))

## 34.1.0

* Use setAttribute to add GA4 JSONs to step by step nav ([PR #3131](https://github.com/alphagov/govuk_publishing_components/pull/3131))
* Add `id` attribute option to the label component ([PR #3093](https://github.com/alphagov/govuk_publishing_components/pull/3093))
* Make GA4 event tracker automatically get element text ([PR #3137](https://github.com/alphagov/govuk_publishing_components/pull/3137))
* Rename taxon parameters ([PR #3139](https://github.com/alphagov/govuk_publishing_components/pull/3139))
* Use one button in navbar ([PR #3058](https://github.com/alphagov/govuk_publishing_components/pull/3058))

## 34.0.0

* **BREAKING** Remove print stylesheets from components ([PR #3110](https://github.com/alphagov/govuk_publishing_components/pull/3110))

## 33.1.0

* Update feedback component tracking ([PR #3099](https://github.com/alphagov/govuk_publishing_components/pull/3099))
* Update to LUX 305 ([PR #3096](https://github.com/alphagov/govuk_publishing_components/pull/3096))
* Add the keyboard shim for link buttons ([PR #3027](https://github.com/alphagov/govuk_publishing_components/pull/3027))
* Remove unused axe-core option from options parameter ([PR #3094](https://github.com/alphagov/govuk_publishing_components/pull/3094))
* Minor ecommerce tracking refactor ([PR #3098](https://github.com/alphagov/govuk_publishing_components/pull/3098))
* Add step by step nav GA4 tracking ([PR #3052](https://github.com/alphagov/govuk_publishing_components/pull/3052))

## 33.0.0

* **BREAKING** Refactor GA4 analytics event and link trackers ([PR #3057](https://github.com/alphagov/govuk_publishing_components/pull/3057))
* Share links allow data attributes ([PR #3072](https://github.com/alphagov/govuk_publishing_components/pull/3072))
* Update to LUX 304 ([PR #3070](https://github.com/alphagov/govuk_publishing_components/pull/3070))
* Set attributes for single page notification button based on Account API response ([PR #3071](https://github.com/alphagov/govuk_publishing_components/pull/3071))
* Support custom text for the single page notification button component ([PR #2935](https://github.com/alphagov/govuk_publishing_components/pull/2935))
* Add `aria-controls` and `aria-describedby` attribute options to the button component ([PR #3088](https://github.com/alphagov/govuk_publishing_components/pull/3088))
* Simplify the way ga4 tracking is added to accordions ([PR #3082](https://github.com/alphagov/govuk_publishing_components/pull/3082))
* Rename section and themes property names ([PR #3092](https://github.com/alphagov/govuk_publishing_components/pull/3092))

## 32.1.0

* Calculate viewport width correctly for navbar in Chrome and Firefox when Mac scrollbars are enabled ([PR #3016](https://github.com/alphagov/govuk_publishing_components/pull/3016))
* Include the words 'opens in new tab' as part of the share link ([PR #3028](https://github.com/alphagov/govuk_publishing_components/pull/3028))
* Delete removed `restoreScroll` Axe API option ([PR #3029](https://github.com/alphagov/govuk_publishing_components/pull/3029))

## 32.0.0

* Track clicks on links with child elements ([PR #3042](https://github.com/alphagov/govuk_publishing_components/pull/3042))
* Fix issue with blue action link arrow svg ([PR #3039](https://github.com/alphagov/govuk_publishing_components/pull/3039))
* **BREAKING:** Fix referrer bug ([PR #3032](https://github.com/alphagov/govuk_publishing_components/pull/3032))
* Add GA4 analytics tracking to remaining feedback component buttons ([PR #3036](https://github.com/alphagov/govuk_publishing_components/pull/3036))

## 31.2.0

* Feedback component visual updates ([PR #2894](https://github.com/alphagov/govuk_publishing_components/pull/2894))
* Add tracking to super navigation header dropdowns ([PR #3024](https://github.com/alphagov/govuk_publishing_components/pull/3024))

## 31.1.2

* Move the GTM blocklist code ([PR #3011](https://github.com/alphagov/govuk_publishing_components/pull/3011))
* Fix issues with GA4 link tracking identified by performance analysts ([PR #3004](https://github.com/alphagov/govuk_publishing_components/pull/3004))

## 31.1.1

* Update to LUX 302 ([PR #3009](https://github.com/alphagov/govuk_publishing_components/pull/3009))
* Fix axe-core false positives for color-contrast tests ([PR #3007](https://github.com/alphagov/govuk_publishing_components/pull/3007))

## 31.1.0

* Resolve Plek.current deprecations ([PR #3000](https://github.com/alphagov/govuk_publishing_components/pull/3000))
* Add ecommerce tracking documentation ([PR #2997](https://github.com/alphagov/govuk_publishing_components/pull/2997))
* Use section for emergency banner ([PR #2973](https://github.com/alphagov/govuk_publishing_components/pull/2973))

## 31.0.0

* Fix bug when getting target element from URL hash in accordion component ([PR #2985](https://github.com/alphagov/govuk_publishing_components/pull/2985))
* **BREAKING:** Update GA4 naming conventions ([PR #2987](https://github.com/alphagov/govuk_publishing_components/pull/2987))
* Stop using .erb for ga4-core ([PR #2984](https://github.com/alphagov/govuk_publishing_components/pull/2984))

## 30.7.3

* Lint ga4-core ([PR #2982](https://github.com/alphagov/govuk_publishing_components/pull/2982))

## 30.7.2

* Refactor analytics code snippets ([PR #2980](https://github.com/alphagov/govuk_publishing_components/pull/2980))
* Add optional gtag snippet ([PR #2979](https://github.com/alphagov/govuk_publishing_components/pull/2979))

## 30.7.1

* Add new cookies set by gtag ([PR #2975](https://github.com/alphagov/govuk_publishing_components/pull/2975))
* Refactor ga4-link-tracker and add new features ([PR #2961](https://github.com/alphagov/govuk_publishing_components/pull/2961))

## 30.7.0

* Change GTM push of unset values from 'null' to 'undefined' ([PR #2971](https://github.com/alphagov/govuk_publishing_components/pull/2971))
* Add click tracking to Yes/No buttons on feedback component ([PR #2964](https://github.com/alphagov/govuk_publishing_components/pull/2964))
* Update popular links on search bar ([PR #2972](https://github.com/alphagov/govuk_publishing_components/pull/2972))

## 30.6.1

* Add require version ([PR #2965](https://github.com/alphagov/govuk_publishing_components/pull/2965))

## 30.6.0

* Add GA4 analytics GTM blocklist ([PR #2962](https://github.com/alphagov/govuk_publishing_components/pull/2962))
* GA4 analytics add single dataLayer push function ([PR #2960](https://github.com/alphagov/govuk_publishing_components/pull/2960))
* Remove unused classes in intervention component ([PR #2920](https://github.com/alphagov/govuk_publishing_components/pull/2920))
* Include size attributes on image card component ([PR #2895](https://github.com/alphagov/govuk_publishing_components/pull/2895))
* Add ecommerce tracking ([PR #2955](https://github.com/alphagov/govuk_publishing_components/pull/2955))

## 30.5.2

* Use Google snippet for GTM in analytics JavaScript ([PR #2951](https://github.com/alphagov/govuk_publishing_components/pull/2951))

## 30.5.1

* Update popular links for London Bridge ([PR #2952](https://github.com/alphagov/govuk_publishing_components/pull/2952))

## 30.5.0

* Fix underline on organisation logo component ([PR #2949](https://github.com/alphagov/govuk_publishing_components/pull/2949))
* Integrate GA4 analytics code with cookie consent mechanism ([PR #2915](https://github.com/alphagov/govuk_publishing_components/pull/2915))

## 30.4.1

* Revert addition of `awesome_print` gem ([PR #2943](https://github.com/alphagov/govuk_publishing_components/pull/2943))
* Resolve visual differences in navbar when JS not enabled ([PR #2756](https://github.com/alphagov/govuk_publishing_components/pull/2756))

## 30.4.0

* Modify GTM values for download links in response to analyst review ([PR #2923](https://github.com/alphagov/govuk_publishing_components/pull/2923/))
* Add Cost of Living hub links to side wide navbar and footer ([PR #2939](https://github.com/alphagov/govuk_publishing_components/pull/2939))
* Change the way we generate pretty print data for our documentations ([PR #2934](https://github.com/alphagov/govuk_publishing_components/pull/2934))

## 30.3.0

* Remove GOV.UK specific code for handling exclusive checkboxes ([PR #2896](https://github.com/alphagov/govuk_publishing_components/pull/2896))
* Add links and sections count tracking for Cost of living hub ([PR #2921](https://github.com/alphagov/govuk_publishing_components/pull/2921))
* Fix bugs with gtm external link tracking ([PR #2916](https://github.com/alphagov/govuk_publishing_components/pull/2916))

## 30.2.1

* Rename GA4EventTracker to Ga4EventTracker ([PR #2911](https://github.com/alphagov/govuk_publishing_components/pull/2911))

## 30.2.0

* Allow accordion to accept custom data module ([PR #2908](https://github.com/alphagov/govuk_publishing_components/pull/2908))
* Expand print link component ([PR #2900](https://github.com/alphagov/govuk_publishing_components/pull/2900))
* Add link click tracking ([PR #2904](https://github.com/alphagov/govuk_publishing_components/pull/2904))
* Ensure tab clicks grab the tabs href for gtm ([PR #2884](https://github.com/alphagov/govuk_publishing_components/pull/2884))
* Update gtm naming conventions ([PR #2906](https://github.com/alphagov/govuk_publishing_components/pull/2906))
* Update sendPageView object location ([PR #2909](https://github.com/alphagov/govuk_publishing_components/pull/2909))

## 30.1.0

* Fix GA4 analytics language on page views ([PR #2892](https://github.com/alphagov/govuk_publishing_components/pull/2892))
* Update GA4 schema to use null instead of 'n/a' for undefined values ([PR #2889](https://github.com/alphagov/govuk_publishing_components/pull/2889))
* Remove times from GA4 analytics page views ([PR #2891](https://github.com/alphagov/govuk_publishing_components/pull/2891))
* Remove axe-core workaround test ([PR #2882](https://github.com/alphagov/govuk_publishing_components/pull/2882))
* Move the emergency_banner from static ([PR #2795](https://github.com/alphagov/govuk_publishing_components/pull/2795))

## 30.0.0

* **BREAKING:** Remove the "PrimaryLinks" JS Module and related tests ([PR #2866](https://github.com/alphagov/govuk_publishing_components/pull/2866))

## 29.15.3

* Update GA4 analytics page view data structure ([PR #2878](https://github.com/alphagov/govuk_publishing_components/pull/2878))

## 29.15.2

* GA4 analytics schema rework ([PR #2864](https://github.com/alphagov/govuk_publishing_components/pull/2864))
* Change colour palette in graphs to match GSS guidance ([PR #2782](https://github.com/alphagov/govuk_publishing_components/pull/2782))

## 29.15.1

* Removes additional id argument from table_helper ([PR #2862](https://github.com/alphagov/govuk_publishing_components/pull/2862))

## 29.15.0

* Add js search to table component ([PR #2803](https://github.com/alphagov/govuk_publishing_components/pull/2803))

## 29.14.0

* Add White Arrow to Action Link Options ([PR #2851](https://github.com/alphagov/govuk_publishing_components/pull/2851))
* Bump govuk-frontend from 4.1.0 to 4.2.0 ([PR #2836](https://github.com/alphagov/govuk_publishing_components/pull/2836))
* Add file locations to component audits ([PR #2849](https://github.com/alphagov/govuk_publishing_components/pull/2849))
* Add personally identifiable information (PII) remover to GTM ([PR #2842](https://github.com/alphagov/govuk_publishing_components/pull/2842))
* Fix broken preview link for "previous and next navigation" component ([PR #2853](https://github.com/alphagov/govuk_publishing_components/pull/2853))
* Add extra options for show/hide all sections accordion click ([PR #2840](https://github.com/alphagov/govuk_publishing_components/pull/2840))

## 29.13.0

* Update the list of popular links in the super navigation header ([PR #2845](https://github.com/alphagov/govuk_publishing_components/pull/2845))
* Add timer field in attempt to reduce spam on feedback component ([PR #2830](https://github.com/alphagov/govuk_publishing_components/pull/2830))

## 29.12.1

* Standardise some analytics attributes ([PR #2831](https://github.com/alphagov/govuk_publishing_components/pull/2831))
* Check if primary_publisher nil OR empty in meta_tags ([PR #2829](https://github.com/alphagov/govuk_publishing_components/pull/2829))
* Add date of birth autocomplete option for date input ([PR #2802](https://github.com/alphagov/govuk_publishing_components/pull/2802))

## 29.12.0

* Remove accessible format request pilot support ([PR #2826](https://github.com/alphagov/govuk_publishing_components/pull/2826))
* GTM analytics add page views ([PR #2814](https://github.com/alphagov/govuk_publishing_components/pull/2814))
* Add id attribute to error alert component ([PR #2825](https://github.com/alphagov/govuk_publishing_components/pull/2825))
* Add gem-track-click to specific sections of layout_footer ([PR #2800](https://github.com/alphagov/govuk_publishing_components/pull/2800))
* Change menubar P elements to use H elements ([PR #2817](https://github.com/alphagov/govuk_publishing_components/pull/2817))
* Add Options to Accordion Section Tracking ([PR #2813](https://github.com/alphagov/govuk_publishing_components/pull/2813))
* Add gtm click tracking for details component ([PR #2811](https://github.com/alphagov/govuk_publishing_components/pull/2811/))
* Fix aria-expanded issue on gtm accordion click tracing ([PR #2822](https://github.com/alphagov/govuk_publishing_components/pull/2822))

## 29.11.0

* Extend GTM analytics click tracking ([PR #2786](https://github.com/alphagov/govuk_publishing_components/pull/2786))
* GOVUK Frontend 4.1.0 updates ([PR #2794](https://github.com/alphagov/govuk_publishing_components/pull/2794))
* Fix print styles for organisation logos ([PR #2751](https://github.com/alphagov/govuk_publishing_components/pull/2751))
* Change "governmentActivityLink" to "governmentactivityLink" ([PR #2798](https://github.com/alphagov/govuk_publishing_components/pull/2798))

## 29.10.0

* Add styles for Whitehall SVG icons ([PR #2788](https://github.com/alphagov/govuk_publishing_components/pull/2788))
* Make auditing check static for missing assets ([PR #2755](https://github.com/alphagov/govuk_publishing_components/pull/2755))
* Update analytics logic for new browse page metatags ([PR #2778](https://github.com/alphagov/govuk_publishing_components/pull/2778))
* Tracking changes for the footer ([PR #2774](https://github.com/alphagov/govuk_publishing_components/pull/2774))
* Update Ukraine CTA in the contextual sidebar ([PR #2779](https://github.com/alphagov/govuk_publishing_components/pull/2779))
* Small amends to sitewide menu ([PR #2776](https://github.com/alphagov/govuk_publishing_components/pull/2776))
* Remove DVSA email from attachment accessible format request pilot([PR #2792](https://github.com/alphagov/govuk_publishing_components/pull/2792))

## 29.9.0

* Update LUX to v301 ([PR #2773](https://github.com/alphagov/govuk_publishing_components/pull/2773))
* Fix http protocol reporting in Safari ([PR #2781](https://github.com/alphagov/govuk_publishing_components/pull/2781))

## 29.8.0

* Add GTM analytics click tracking ([PR #2760](https://github.com/alphagov/govuk_publishing_components/pull/2760))
* Add wrapper to the component card to ensure link spacing ([PR #2753](https://github.com/alphagov/govuk_publishing_components/pull/2753))
* Add new logic for counting links/sections on a second level browse page on page view #2733 ([PR #2733](https://github.com/alphagov/govuk_publishing_components/pull/2733))
* Update cross domain linking script to use init ([PR #2747](https://github.com/alphagov/govuk_publishing_components/pull/2747))
* Remove DWP email from attachment accessible format request pilot([PR #2764](https://github.com/alphagov/govuk_publishing_components/pull/2764))
* Add HTTP protocol measurement to RUM ([PR #2769](https://github.com/alphagov/govuk_publishing_components/pull/2769))

## 29.7.0

* Auditing enhancements ([PR #2428](https://github.com/alphagov/govuk_publishing_components/pull/2428))
* Fix JS bug in MagnaCharta for stacked charts ([PR #2731](https://github.com/alphagov/govuk_publishing_components/pull/2731))
* Remove coronavirus topic from menu bar ([PR #2745](https://github.com/alphagov/govuk_publishing_components/pull/2745))
* Realign list of topics in navigation header ([PR #2750](https://github.com/alphagov/govuk_publishing_components/pull/2750))

## 29.6.0

* Updated link for the Ukraine Invasion Call To Action #2739 ([PR #2739](https://github.com/alphagov/govuk_publishing_components/pull/2739))
* Use locale files to generate header links in public_layout instead of constant in public_layout_helper #2719 ([PR #2719](https://github.com/alphagov/govuk_publishing_components/pull/2719))

## 29.5.0

- Add DFE, DWP and DVSA emails to attachment accessible format request pilot ([PR #2736](https://github.com/alphagov/govuk_publishing_components/pull/2736))

## 29.4.0

* Update the list of popular links in the super navigation header #2728 ([PR #2728](https://github.com/alphagov/govuk_publishing_components/pull/2728))
* Remove tracking on load from intervention ([PR #2725](https://github.com/alphagov/govuk_publishing_components/pull/2725))
* Strip postcodes from more document types in meta_tags component #2720 ([PR #2720](https://github.com/alphagov/govuk_publishing_components/pull/2720))
* Add new custom dimension for new browse page template analytics #2722 ([PR #2722](https://github.com/alphagov/govuk_publishing_components/pull/2722))

## 29.3.0

* Remove Coronavirus and Brexit footers ([PR #2685](https://github.com/alphagov/govuk_publishing_components/pull/2685))

## 29.2.0

* Remove HMRC email from attachment for accessible format request pilot ([PR #2710](https://github.com/alphagov/govuk_publishing_components/pull/2710))
* Remove the last traces of jQuery ([PR #2702](https://github.com/alphagov/govuk_publishing_components/pull/2702))
* Add tracking on the accordion ([PR #2693](https://github.com/alphagov/govuk_publishing_components/pull/2693))

## 29.1.0

* Remove "priority breadcrumbs" ([PR #2666](https://github.com/alphagov/govuk_publishing_components/pull/2666))

## 29.0.1

* Add HMRC email to attachment accessible format request pilot ([PR #2695](https://github.com/alphagov/govuk_publishing_components/pull/2695))

## 29.0.0

* **BREAKING:** Remove all jQuery from the components gem ([PR #2613](https://github.com/alphagov/govuk_publishing_components/pull/2613))
* Add compatibility with Sprockets 4, see [Sprockets documentation](https://github.com/rails/sprockets/blob/master/UPGRADING.md) on how to upgrade your Rails app ([PR #2691](https://github.com/alphagov/govuk_publishing_components/pull/2691))
* Use a data attribute to specify RUM (real user monitoring) script location ([PR #2682](https://github.com/alphagov/govuk_publishing_components/pull/2682))
* Add variant tracking to card component ([PR #2689](https://github.com/alphagov/govuk_publishing_components/pull/2689))

## 28.9.2

* Migrate cross domain tracking script from static ([PR #2607](https://github.com/alphagov/govuk_publishing_components/pull/2607))
* Update card tracking ([PR #2679](https://github.com/alphagov/govuk_publishing_components/pull/2679))
* Remove accessible format request pilot emails from attachment ([PR #2687](https://github.com/alphagov/govuk_publishing_components/pull/2687))
* Update docs ([PR #2683](https://github.com/alphagov/govuk_publishing_components/pull/2683))
* Add border to search icon when JS disabled ([PR #2686](https://github.com/alphagov/govuk_publishing_components/pull/2686))

## 28.9.1

* Update the list of popular links in the super navigation header ([PR #2660](https://github.com/alphagov/govuk_publishing_components/pull/2660))
* Remove Brexit call to action from contextual sidebar ([PR #2518](https://github.com/alphagov/govuk_publishing_components/pull/2518))
* Add spellcheck to input ([PR #2654](https://github.com/alphagov/govuk_publishing_components/pull/2654))
* Increase font-size of `previous_and_next_navigation`, improve important icon ([PR #2659](https://github.com/alphagov/govuk_publishing_components/pull/2659))

## 28.9.0

* Add 'Invasion of Ukraine' CTA to pages tagged to the topical event ([PR #2657](https://github.com/alphagov/govuk_publishing_components/pull/2657))
* Update summary list ([PR #2622](https://github.com/alphagov/govuk_publishing_components/pull/2622))

## 28.8.1

* Drop dependency `psych >= 4` that was breaking downstream apps ([PR #2655](https://github.com/alphagov/govuk_publishing_components/pull/2655))

## 28.8.0

* Add cards component ([PR #2624](https://github.com/alphagov/govuk_publishing_components/pull/2624))
* Allow attachments to display link to accessible format request form ([PR #2636](https://github.com/alphagov/govuk_publishing_components/pull/2636))
* Improve custom dimensions code ([PR #2646](https://github.com/alphagov/govuk_publishing_components/pull/2646))
* Increase font size on Attachment ([PR #2650](https://github.com/alphagov/govuk_publishing_components/pull/2650))

## 28.7.1

* Re-release of 28.7.0 with the missing node dependencies restored. ([PR #2648](https://github.com/alphagov/govuk_publishing_components/pull/2648))

## 28.7.0 - Yanked due to missing node dependencies

* Update real user metrics LUX.js to v300 ([PR #2637](https://github.com/alphagov/govuk_publishing_components/pull/2637))
* Remove `header-navigation.js` ([PR #2632](https://github.com/alphagov/govuk_publishing_components/pull/2632))
* Add support for Rails 7; add support for Ruby 3.0 and 3.1; and drop support for Ruby 2.6 ([PR #2642](https://github.com/alphagov/govuk_publishing_components/pull/2642))
* Hide feedback component error summary on submission ([PR #2557](https://github.com/alphagov/govuk_publishing_components/pull/2557))
* Update accordion tests ([PR #2647](https://github.com/alphagov/govuk_publishing_components/pull/2647))

## 28.6.0

* Add margin top and margin bottom to inset text ([PR #2616](https://github.com/alphagov/govuk_publishing_components/pull/2616))
* Bump `govuk-frontend` from 3.14.0 to 4.0.0 ([PR #2355](https://github.com/alphagov/govuk_publishing_components/pull/2533))
* Change JavaScript modules from start to init ([PR #2605](https://github.com/alphagov/govuk_publishing_components/pull/2605))
* Share icons line-height ([PR #2602](https://github.com/alphagov/govuk_publishing_components/pull/2602))
* Update conditional reveal ([PR #2602](https://github.com/alphagov/govuk_publishing_components/pull/2612))
* Update Accordion design ([PR #2581](https://github.com/alphagov/govuk_publishing_components/pull/2581))
* Update step-by-step design ([PR #2601](https://github.com/alphagov/govuk_publishing_components/pull/2601))

## 28.5.0

* Add select component hint ([PR #2594](https://github.com/alphagov/govuk_publishing_components/pull/2594))
* Add name attribute to hidden spam input in feedback component ([PR #2586](https://github.com/alphagov/govuk_publishing_components/pull/2586))

## 28.4.0

* Remove COVID CTA from contextual sidebar component ([PR #2584](https://github.com/alphagov/govuk_publishing_components/pull/2584))

## 28.3.0

* Fix a bug in the scroll tracker ([PR #2554](https://github.com/alphagov/govuk_publishing_components/pull/2554))
* Add check to big number to convert plus suffixes to subscript elements ([PR #2570](https://github.com/alphagov/govuk_publishing_components/pull/2570))
* Update feedback component to resolve spam problem ([PR #2574](https://github.com/alphagov/govuk_publishing_components/pull/2574))
* Add pipes between buttons on super nav header ([PR #2575](https://github.com/alphagov/govuk_publishing_components/pull/2575))

## 28.2.0

* Remove almost the last of the miscellaneous jQuery ([PR #2556](https://github.com/alphagov/govuk_publishing_components/pull/2556))
* Make metadata component "See all updates" link href less generic ([PR #2562](https://github.com/alphagov/govuk_publishing_components/pull/2562))
* Update feedback component to add "display none" to "maybe" (spam prevention) button ([PR #2568](https://github.com/alphagov/govuk_publishing_components/pull/2568))
* Apply margin bottom helper to big number component ([PR #2566](https://github.com/alphagov/govuk_publishing_components/pull/2566))
* Update share link icons ([PR #2567](https://github.com/alphagov/govuk_publishing_components/pull/2567))

## 28.1.0

* Remove jQuery from mailto-link-tracker ([PR #2542](https://github.com/alphagov/govuk_publishing_components/pull/2542))
* Remove jQuery from static analytics ([PR #2526](https://github.com/alphagov/govuk_publishing_components/pull/2526))
* Remove unused scrolltracker ([PR #2551](https://github.com/alphagov/govuk_publishing_components/pull/2551))
* Tweak metadata component "See all updates" interaction ([PR #2552](https://github.com/alphagov/govuk_publishing_components/pull/2552))
* Change accordion language ([PR #2338](https://github.com/alphagov/govuk_publishing_components/pull/2338))

## 28.0.0

* **BREAKING:** Update feedback component to fix accessibility issues ([PR #2435](https://github.com/alphagov/govuk_publishing_components/pull/2435))
  You must make the following changes when you migrate to this release:
  - Upgrade `static` to the latest version before you upgrade your application
* **BREAKING:** Remove deprecated components: `admin_analytics`, `government_navigation`, `highlight_boxes` and `taxonomy_list` ([PR #2458](https://github.com/alphagov/govuk_publishing_components/pull/2458))
* Remove scroll tracking from government-frontend ([PR #2548](https://github.com/alphagov/govuk_publishing_components/pull/2548))
* Remove scroll tracking from frontend ([PR #2546](https://github.com/alphagov/govuk_publishing_components/pull/2546))
* Remove scroll tracking from collections ([PR #2543](https://github.com/alphagov/govuk_publishing_components/pull/2543))
* Remove jQuery from Google Analytics Universal Tracker ([PR #2540](https://github.com/alphagov/govuk_publishing_components/pull/2540))
* Remove jQuery from external link tracker ([PR #2538](https://github.com/alphagov/govuk_publishing_components/pull/2538))
* Remove jQuery from download link tracker ([PR #2534](https://github.com/alphagov/govuk_publishing_components/pull/2534))
* Remove duplicate link in menu header ([PR #2547](https://github.com/alphagov/govuk_publishing_components/pull/2547))

## 27.20.0

* Add signup link component ([PR #2525](https://github.com/alphagov/govuk_publishing_components/pull/2525))

## 27.19.0

* Fix `help-notice` spacing in `call-to-action` ([PR #2536](https://github.com/alphagov/govuk_publishing_components/pull/2536))
* Add COVID CTA to contextual sidebar component ([PR #2535](https://github.com/alphagov/govuk_publishing_components/pull/2535))
* Add flag to hide Intervention Banner component ([PR #2516](https://github.com/alphagov/govuk_publishing_components/pull/2516))
* Image card component design and API updates ([PR #2530](https://github.com/alphagov/govuk_publishing_components/pull/2530))

## 27.18.0

* Remove jQuery from page-content ([PR #2505](https://github.com/alphagov/govuk_publishing_components/pull/2505))
* Replace use of `includes()` in `explicit-cross-domain-links.js` with `indexOf()` alternative ([PR #2515](https://github.com/alphagov/govuk_publishing_components/pull/2515))
* Fix font for menu paragraphs ([PR #2509](https://github.com/alphagov/govuk_publishing_components/pull/2509))
* Add large mode on mobile only to search component ([PR #2510](https://github.com/alphagov/govuk_publishing_components/pull/2510))
* Port the grid_helper sass mixin to the components gem ([PR #2517](https://github.com/alphagov/govuk_publishing_components/pull/2517))
* Update super nav popular links ([PR #2519](https://github.com/alphagov/govuk_publishing_components/pull/2519))
* Fix single page notification button flash of unpersonalised content ([PR #2512](https://github.com/alphagov/govuk_publishing_components/pull/2512))
* Add missing class for slimmer header ([PR #2521](https://github.com/alphagov/govuk_publishing_components/pull/2521))

## 27.17.0

* Alter use of pseudo-underline mixin to allow for different button sizes ([PR #2501](https://github.com/alphagov/govuk_publishing_components/pull/2501))
* Re-work explicit-cross-domain-links.js ([PR #2502](https://github.com/alphagov/govuk_publishing_components/pull/2502))
* Update govspeak table styles ([PR #2470](https://github.com/alphagov/govuk_publishing_components/pull/2470))
* Increase big number label size ([PR #2506](https://github.com/alphagov/govuk_publishing_components/pull/2506))
* Fix typo in menu([#2503](https://github.com/alphagov/govuk_publishing_components/pull/2503))

## 27.16.0

* Remove jQuery from custom dimensions ([PR #2473](https://github.com/alphagov/govuk_publishing_components/pull/2473))
* Use the correct mixins for applying font in the big number component ([PR #2494](https://github.com/alphagov/govuk_publishing_components/pull/2494))
* Remove use of govuk-font from the big number component ([PR #2493](https://github.com/alphagov/govuk_publishing_components/pull/2493))
* Add `margin_bottom` option to success alert ([PR #2492](https://github.com/alphagov/govuk_publishing_components/pull/2492))

## 27.15.0

* Update Start button so info text is associated ([PR #2476](https://github.com/alphagov/govuk_publishing_components/pull/2476))
* Remove whitespace from pseudo-element content ([PR #2482](https://github.com/alphagov/govuk_publishing_components/pull/2482))
* Update navigation header toggle button spacing ([PR #2483](https://github.com/alphagov/govuk_publishing_components/pull/2483))
* Update search toggle / link hover state underline thickness ([PR #2484](https://github.com/alphagov/govuk_publishing_components/pull/2484))
* Add support to open Intervention links in new tab ([#2465](https://github.com/alphagov/govuk_publishing_components/pull/2465))

## 27.14.2

* Remove jQuery from ecommerce script ([PR #2478](https://github.com/alphagov/govuk_publishing_components/pull/2478))
* Update search component ([PR #2462](https://github.com/alphagov/govuk_publishing_components/pull/2462))
* Fix link to Crown Copyright in footer ([PR #2475](https://github.com/alphagov/govuk_publishing_components/pull/2475))
* Fix single page notification button data attributes for tracking ([PR #2471](https://github.com/alphagov/govuk_publishing_components/pull/2471))
* Amend `explicit-cross-domain-links.js` code ([PR #2464](https://github.com/alphagov/govuk_publishing_components/pull/2464))

## 27.14.1

* Remove redundant API value from big number component ([PR #2459](https://github.com/alphagov/govuk_publishing_components/pull/2459))
* Remove use of `govuk-list` from navigation header ([PR #2460](https://github.com/alphagov/govuk_publishing_components/pull/2460))
* Extend new scroll tracker functionality ([PR #2411](https://github.com/alphagov/govuk_publishing_components/pull/2411))

## 27.14.0

* Get single page notification button from personalisation API on load ([PR #2443](https://github.com/alphagov/govuk_publishing_components/pull/2443))

## 27.13.0

* Add brand colour for Department for Levelling Up, Housing and Communities (DLUHC) ([PR #2454](https://github.com/alphagov/govuk_publishing_components/pull/2454))
* Add `margin_bottom` option to the metadata component and update margin mixins to use the standard GOVUK spacing scale ([PR #2450](https://github.com/alphagov/govuk_publishing_components/pull/2450))
* Tweak to sidebar navigation on Brexit hub pages ([PR #2449](https://github.com/alphagov/govuk_publishing_components/pull/2449))
* Add an explicit margin zero to the super navigation mobile menu button ([PR #2445](https://github.com/alphagov/govuk_publishing_components/pull/2445))
* Remove brexit as a topic from the super navigation header ([PR #2446](https://github.com/alphagov/govuk_publishing_components/pull/2446))
* Update the pseudo underline mixin and its usage on the super navigation header ([PR #2439](https://github.com/alphagov/govuk_publishing_components/pull/2439))
* Fix layout glitch seen when scrollbar is permanently visible ([PR #2444](https://github.com/alphagov/govuk_publishing_components/pull/2444 ))
* Add draggable=false to links disguised as buttons ([PR #2448](https://github.com/alphagov/govuk_publishing_components/pull/2448))
* Remove summary styling from govspeak ([PR #2447](https://github.com/alphagov/govuk_publishing_components/pull/2447))
* Update "Government activity" dropdown menu layout ([PR #2442](https://github.com/alphagov/govuk_publishing_components/pull/2442 ))

## 27.12.0

* Add more spacing in the navigation header mobile layout ([PR #2421](https://github.com/alphagov/govuk_publishing_components/pull/2421 ))
* Adjust navigation header black bar height ([PR #2422](https://github.com/alphagov/govuk_publishing_components/pull/2422 ))
* Fix chevron rotation for the super navigation header and accordion components on IE9 ([PR #2429](https://github.com/alphagov/govuk_publishing_components/pull/2429))
* Add `enterkeyhint` attribute to input and search ([PR #2426](https://github.com/alphagov/govuk_publishing_components/pull/2426 ))
* Retire the Brexit checker part of the Brexit call to action ([PR #2432](https://github.com/alphagov/govuk_publishing_components/pull/2432)) (patch change)
* Reduce the weight of super navigation header chevrons ([PR #2436](https://github.com/alphagov/govuk_publishing_components/pull/2436))

## 27.11.0

* Bump `govuk-frontend` from 3.13.0 to 3.14.0 ([PR #2334](https://github.com/alphagov/govuk_publishing_components/pull/2334 ))
* Add single page notification component ([PR #2293](https://github.com/alphagov/govuk_publishing_components/pull/2293))
* Update the design of the mobile menu button on the super navigation ([PR #2382](https://github.com/alphagov/govuk_publishing_components/pull/2382))
* Update positioning and border colour on super navigation search button ([PR #2413](https://github.com/alphagov/govuk_publishing_components/pull/2413))

## 27.10.5

* Prevent `cookies_policy` cookie related issues ([PR #2406](https://github.com/alphagov/govuk_publishing_components/pull/2406))

## 27.10.4

* Add underlines to mobile menu links on super navigation no-js view ([PR #2404](https://github.com/alphagov/govuk_publishing_components/pull/2404))
* Add black border to the bottom of the closed header search button ([PR #2405](https://github.com/alphagov/govuk_publishing_components/pull/2405))
* Fix font size on super navigation header ([PR #2407](https://github.com/alphagov/govuk_publishing_components/pull/2407))

## 27.10.3

* Update navigation header focus states (take two) ([PR #2401](https://github.com/alphagov/govuk_publishing_components/pull/2401))

## 27.10.2

* Raise deprecation warnings on unused components: `admin_analytics`, `government_navigation`, `highlight_boxes` and `taxonomy_list` ([PR #2362](https://github.com/alphagov/govuk_publishing_components/pull/2362))
* Adjust cookie_consent parameter conditions ([PR #2399](https://github.com/alphagov/govuk_publishing_components/pull/2399))

## 27.10.1

* Amend account layout phase banner link ([PR #2397](https://github.com/alphagov/govuk_publishing_components/pull/2397))

## 27.10.0

* Revert "Update navigation header focus states" ([PR #2395](https://github.com/alphagov/govuk_publishing_components/pull/2395))
* Revert Revert "Fix layout jank when on slow connection" ([PR #2394](https://github.com/alphagov/govuk_publishing_components/pull/2394))
* Add option to render `layout_for_public` footer without a top border ([PR #2393](https://github.com/alphagov/govuk_publishing_components/pull/2393))

## 27.9.2

* Revert "Fix layout jank when on slow connection" ([PR #2390](https://github.com/alphagov/govuk_publishing_components/pull/2390))

## 27.9.1

* Update account template phase banner to match DI one ([PR #2386](https://github.com/alphagov/govuk_publishing_components/pull/2386))
* Update navigation header focus states ([PR #2319](https://github.com/alphagov/govuk_publishing_components/pull/2319)) MINOR

## 27.9.0

* Tidy up account layout template for DI launch ([PR #2380](https://github.com/alphagov/govuk_publishing_components/pull/2380))

## 27.8.2

* Replace search icon PNG with SVG ([PR # 2377](https://github.com/alphagov/govuk_publishing_components/pull/2377))
* Interventions: make more generic ([PR #2329](https://github.com/alphagov/govuk_publishing_components/pull/2329/))

## 27.8.1

* Add cross domain linking to main GA property ([PR #2378](https://github.com/alphagov/govuk_publishing_components/pull/2378))
* Fix organisation logo size when printing ([PR #2371](https://github.com/alphagov/govuk_publishing_components/pull/2371)) PATCH

## 27.8.0

* Remove Coronavirus priority taxons ([PR #2357](https://github.com/alphagov/govuk_publishing_components/pull/2357))
* Add `margin_bottom` spacing to list component ([PR #2363](https://github.com/alphagov/govuk_publishing_components/pull/2363))
* Fix auditing bug and add documentation ([PR #2351](https://github.com/alphagov/govuk_publishing_components/pull/2351))
* Make action link blue arrow smaller on mobile ([PR #2353](https://github.com/alphagov/govuk_publishing_components/pull/2353))
* Remove unneeded scroll tracking ([PR #2354](https://github.com/alphagov/govuk_publishing_components/pull/2354))
* Update CSS for input component (`with_search_icon` variation) ([PR #2355](https://github.com/alphagov/govuk_publishing_components/pull/2355))
* Fix focus state and update API for the big number ([PR #2359](https://github.com/alphagov/govuk_publishing_components/pull/2359))
* Add legend examples for radio input ([PR #2333](https://github.com/alphagov/govuk_publishing_components/pull/2333))

## 27.7.0

* Update devolved nations component to accept type property ([PR #2337](https://github.com/alphagov/govuk_publishing_components/pull/2337))

## 27.6.0

* Pass cookie consent to Digital Identity via query parameter ([PR #2344](https://github.com/alphagov/govuk_publishing_components/pull/2344))
* Add explicit-cross-domain-links to account manage & security links ([PR #2347](https://github.com/alphagov/govuk_publishing_components/pull/2347))
* update primaryLinks js module ([#2348](https://github.com/alphagov/govuk_publishing_components/pull/2348))

## 27.5.0

* Increase size of action link blue arrow ([PR #2343](https://github.com/alphagov/govuk_publishing_components/pull/2343))
* Remove scroll tracking on pages ([PR #2339](https://github.com/alphagov/govuk_publishing_components/pull/2339))
* Accept cookie consent from Digital Identity query parameter ([PR #2340](https://github.com/alphagov/govuk_publishing_components/pull/2340))

## 27.4.0

* Add blue arrow option to action link ([PR #2330](https://github.com/alphagov/govuk_publishing_components/pull/2330))

## 27.3.1

* Correctly translate the connector word in the Devolved Nations component ([PR #2326](https://github.com/alphagov/govuk_publishing_components/pull/2326))

## 27.3.0

* Allow custom logo link in navigation header ([PR #2320](https://github.com/alphagov/govuk_publishing_components/pull/2320)) MINOR
* Allow data attributes to be applied to big numbers when no link is present ([PR #2321](https://github.com/alphagov/govuk_publishing_components/pull/2321))

## 27.2.0

* Add new scroll tracking ([PR #2305](https://github.com/alphagov/govuk_publishing_components/pull/2305))
* Update crown fallback image ([PR #2313](https://github.com/alphagov/govuk_publishing_components/pull/2313)) PATCH
* Remove heading and use strong in step nav header ([PR #2311](https://github.com/alphagov/govuk_publishing_components/pull/2311))

## 27.1.0

* Add big number component ([PR #2278](https://github.com/alphagov/govuk_publishing_components/pull/2278))
* Add missing `govuk-template` class to public layout ([PR #2307](https://github.com/alphagov/govuk_publishing_components/pull/2307))
* Fix sticky hover on search button in navigation header([PR #2304](https://github.com/alphagov/govuk_publishing_components/pull/2304))
* Reorder the navigation lists vertically ([PR #2303](https://github.com/alphagov/govuk_publishing_components/pull/2303))

## 27.0.0

* **BREAKING:** Rename extra_links to extra_details (image card) ([PR #2300](https://github.com/alphagov/govuk_publishing_components/pull/2300))
* Create devolved nations component ([PR #2280](https://github.com/alphagov/govuk_publishing_components/pull/2280))
* Fix document list children ([PR #2296](https://github.com/alphagov/govuk_publishing_components/pull/2296))
* Reset margins for govspeak images ([PR #2297](https://github.com/alphagov/govuk_publishing_components/pull/2297))
* Fix global banner wrapper in public layout ([PR #2294](https://github.com/alphagov/govuk_publishing_components/pull/2294))

## 26.0.0

* **BREAKING:** Add a dependency on govuk_personalisation, and use it to generate account URLs in the account layout ([PR #2289](https://github.com/alphagov/govuk_publishing_components/pull/2289))

  You must make the following changes when you migrate to this release:
  - Upgrade to Rails 6

## 25.7.0

* Add text list to image card ([PR #2286](https://github.com/alphagov/govuk_publishing_components/pull/2286))

## 25.6.0

* Add element tracking to track click ([PR #2283](https://github.com/alphagov/govuk_publishing_components/pull/2283))
* Fix navigation header layout error that occurs when resizing browser window ([PR #2281](https://github.com/alphagov/govuk_publishing_components/pull/2281))
* Fix navigation header search toggle focus hover states ([PR #2284](https://github.com/alphagov/govuk_publishing_components/pull/2284))

## 25.5.0

* Restore underline on image card header link ([PR #2277](https://github.com/alphagov/govuk_publishing_components/pull/2277))
* Fix `line-height` on step-by-step nav header ([PR #2273](https://github.com/alphagov/govuk_publishing_components/pull/2273))
* Enable draft on public layout ([PR #2274](https://github.com/alphagov/govuk_publishing_components/pull/2274))
* Bump `govuk-frontend` from 3.12.0 to 3.13.0 ([PR #2164](https://github.com/alphagov/govuk_publishing_components/pull/2164))

## 25.4.0

* Add lazy loading to image card ([PR #2270](https://github.com/alphagov/govuk_publishing_components/pull/2270))
* GOVUK.Modules.start can accept DOM elements ([PR #2260](https://github.com/alphagov/govuk_publishing_components/pull/2260))

## 25.3.1

* Fix track click link tracking ([PR #2265](https://github.com/alphagov/govuk_publishing_components/pull/2265))
* Add language tag for Welsh link in public layout template ([PR #2258](https://github.com/alphagov/govuk_publishing_components/pull/2258))
* Revert "Fix cookie banner issue (IE10)" ([PR #2267](https://github.com/alphagov/govuk_publishing_components/pull/2267))

## 25.3.0

* Extend track click script ([PR #2263](https://github.com/alphagov/govuk_publishing_components/pull/2263))
* Fix cookie banner issue (IE10) ([PR #2231](https://github.com/alphagov/govuk_publishing_components/pull/2231))
* Extend layout for public with account components ([PR #2255](https://github.com/alphagov/govuk_publishing_components/pull/2255))
* Update search toggle tracking ([PR #2262](https://github.com/alphagov/govuk_publishing_components/pull/2262))

## 25.2.3

* Fix final issues with tracking on super nav header ([PR #2256](https://github.com/alphagov/govuk_publishing_components/pull/2256))

## 25.2.2

* Fix typo in tracking module on super navigation header ([PR #2253](https://github.com/alphagov/govuk_publishing_components/pull/2253))

## 25.2.1

* Add link tracking to super navigation header ([PR #2249](https://github.com/alphagov/govuk_publishing_components/pull/2249))
* Fix typos in super navigation link tracking ([PR #2251](https://github.com/alphagov/govuk_publishing_components/pull/2251))
* Update super navigation styles to avoid `govuk-layout` clashes ([PR #2250](https://github.com/alphagov/govuk_publishing_components/pull/2250))

## 25.2.0

* Add analytics tags to super navigation header ([PR #2244](https://github.com/alphagov/govuk_publishing_components/pull/2244))
* Update copy for Explore Super Menu Header ([PR #2247](https://github.com/alphagov/govuk_publishing_components/pull/2247))
* Add hover style for govspeak mc button ([PR #2239](https://github.com/alphagov/govuk_publishing_components/pull/2239))
* Load Youtube video instantly when cookies are accepted ([PR #2241](https://github.com/alphagov/govuk_publishing_components/pull/2241))
* Add dropdown menu to the super navigation header component ([PR #2223](https://github.com/alphagov/govuk_publishing_components/pull/2223))

## 25.1.0

* Convert a tags to buttons on load in header-navigation js ([PR #2235](https://github.com/alphagov/govuk_publishing_components/pull/2235))
* Allow label sizes for search component label ([PR #2236](https://github.com/alphagov/govuk_publishing_components/pull/2236)) MINOR
* Update notice component to better match DS notification banner ([PR #2214](https://github.com/alphagov/govuk_publishing_components/pull/2214))
* Add option to nest context within the h1 for title component ([PR #2226](https://github.com/alphagov/govuk_publishing_components/pull/2226))

## 25.0.0

* **BREAKING:** Remove ability to link contextual text on titles ([PR #2192](https://github.com/alphagov/govuk_publishing_components/pull/2192))
* Delete empty print stylesheets ([PR #2225](https://github.com/alphagov/govuk_publishing_components/pull/2225))
* **BREAKING:** Remove `is_page_heading` parameter from radio component ([PR #2061](https://github.com/alphagov/govuk_publishing_components/pull/2061))
* Intervention: add tracking code and design tweaks ([PR #2224](https://github.com/alphagov/govuk_publishing_components/pull/2224))
* **BREAKING:** Remove deprecated `em()` Sass mixin ([PR #2220](https://github.com/alphagov/govuk_publishing_components/pull/2220))

  You must make the following changes when you migrate to this release:
  - Replace `em()` calls with `govuk-em()`

* **BREAKING:** Group tracking scripts in `govuk_publishing_components/analytics` ([PR #2117](https://github.com/alphagov/govuk_publishing_components/pull/2117))

  You must make the following changes when you migrate to this release:
  - Remove any direct reference to `govuk_publishing_components/lib/track-click` and make sure `govuk_publishing_components/analytics` is imported

## 24.21.1

* Fix issue where metatag component throws an error when priority_brexit_taxon isn't available. ([PR #2227](https://github.com/alphagov/govuk_publishing_components/pull/2227))

## 24.21.0

* Add scroll tracking to travel advice pages ([PR #2217](https://github.com/alphagov/govuk_publishing_components/pull/2217))

* Make sure custom dimension 112 is sent for all pages tagged to Brexit ([PR #2212](https://github.com/alphagov/govuk_publishing_components/pull/2212))
* Allow the public layout to render without the footer navigation ([PR #2218](https://github.com/alphagov/govuk_publishing_components/pull/2218))

## 24.20.0

* Add Layout super navigation header component ([PR #2179](https://github.com/alphagov/govuk_publishing_components/pull/2179))
* Add inverse option for govspeak ([PR #2207](https://github.com/alphagov/govuk_publishing_components/pull/2207))
* Expand trigger event script options ([PR #2199](https://github.com/alphagov/govuk_publishing_components/pull/2199))

## 24.19.0

* Switch environment app helper to use GOVUK_ENVIRONMENT_NAME ([PR #2191](https://github.com/alphagov/govuk_publishing_components/pull/2191)) PATCH
* Add intervention component ([PR #2196](https://github.com/alphagov/govuk_publishing_components/pull/2196))
* Fix misaligned crown in heading component properly ([PR #2206](https://github.com/alphagov/govuk_publishing_components/pull/2206)) PATCH

## 24.18.5

* Add scroll tracking to welsh brexit child taxon pages ([PR #2201](https://github.com/alphagov/govuk_publishing_components/pull/2201))
* Fix arrow size on Brexit variation of action link ([PR #2203](https://github.com/alphagov/govuk_publishing_components/pull/2203))

## 24.18.4

* Change tracking on details component ([PR #2195](https://github.com/alphagov/govuk_publishing_components/pull/2195))
* Add Welsh translations for topics, transition and tabs ([PR #2193](https://github.com/alphagov/govuk_publishing_components/pull/2193))
* Add custom dimension for pages displaying the Brexit superbreadcrumb ([PR #2197](https://github.com/alphagov/govuk_publishing_components/pull/2197))

## 24.18.3

* Use correct locale key for the character count component ([PR #2189](https://github.com/alphagov/govuk_publishing_components/pull/2189))

## 24.18.2

* Fix misaligned crown in heading component ([PR #2134](https://github.com/alphagov/govuk_publishing_components/pull/2134)) PATCH

## 24.18.1

* Update LUX to activate when usage cookies are accepted ([PR #2154](https://github.com/alphagov/govuk_publishing_components/pull/2154)) PATCH
* Add custom dimension to the page view data for pages tagged to brexit taxons. And remove the custom dimension from superbreadcrumb clicks. ([PR #2186](https://github.com/alphagov/govuk_publishing_components/pull/2186))

## 24.18.0

* Add margin bottom to radio component ([PR #2175](https://github.com/alphagov/govuk_publishing_components/pull/2175))
* Add privacy and accessibility links to the layout footer ([PR #2177](https://github.com/alphagov/govuk_publishing_components/pull/2177))

## 24.17.0

* Allow multiple JavaScript modules on a certain element ([PR #2170](https://github.com/alphagov/govuk_publishing_components/pull/2170))
* Add Brexit variation to action links ([PR #2172](https://github.com/alphagov/govuk_publishing_components/pull/2172))
* Add faux `require_tree` for Govspeak and polyfills ([PR #2173](https://github.com/alphagov/govuk_publishing_components/pull/2173))

## 24.16.1

* Add links to privacy and accessibility statements in layout footer component ([PR #2168](https://github.com/alphagov/govuk_publishing_components/pull/2168))

## 24.16.0

* Allow custom font size on action links ([PR #2162](https://github.com/alphagov/govuk_publishing_components/pull/2162))
* Add scroll tracking to /guidance/import-and-export-goods-using-preference-agreements ([PR #2165](https://github.com/alphagov/govuk_publishing_components/pull/2165))
* Amend layout_for_public component ([PR #2160](https://github.com/alphagov/govuk_publishing_components/pull/2160))

## 24.15.3

* Add tracking on search submit to public layout ([PR #2157](https://github.com/alphagov/govuk_publishing_components/pull/2157))
* Turn off LUX's debug mode ([PR #2156](https://github.com/alphagov/govuk_publishing_components/pull/2156))
* Add scroll tracking for the brexit child taxon pages ([PR #2155](https://github.com/alphagov/govuk_publishing_components/pull/2155))

## 24.15.2

* Update LUX JavaScript from v214 to v216 ([PR #2152](https://github.com/alphagov/govuk_publishing_components/pull/2152))
* Add a custom dimension to clicks on super breadcrumbs tagged to a brexit taxon ([PR #2149](https://github.com/alphagov/govuk_publishing_components/pull/2149))

## 24.15.1

* Added tracking for the header menu toggle ([PR #2143](https://github.com/alphagov/govuk_publishing_components/pull/2143))

## 24.15.0

 * Set LUX's sampling rate to 1% ([PR #2145](https://github.com/alphagov/govuk_publishing_components/pull/2145))

## 24.14.1

* Fix wrong label value for event tracking on menu button ([PR #2139](https://github.com/alphagov/govuk_publishing_components/pull/2139))

## 24.14.0

* Add real user metrics using Speedcurve's LUX ([PR #2135](https://github.com/alphagov/govuk_publishing_components/pull/2135))
* Fix header tracking labels ([PR #2136](https://github.com/alphagov/govuk_publishing_components/pull/2136))

## 24.13.5

* Fix click tracking in government_navigation ([PR #2129](https://github.com/alphagov/govuk_publishing_components/pull/2129))
* Remove hide-only option from contextual guidance ([PR #2126](https://github.com/alphagov/govuk_publishing_components/pull/2126))
* Add superbreadcrumb to content tagged to a Brexit child taxon ([PR #2123](https://github.com/alphagov/govuk_publishing_components/pull/2123))
* Use the `init` API to initialise component modules ([PR #2095](https://github.com/alphagov/govuk_publishing_components/pull/2095))
* Add smart_answer to the document types excluded from Brexit navigation ([PR #2133](https://github.com/alphagov/govuk_publishing_components/pull/2133))

## 24.13.4

* Add tracking to government navigation ([PR #2127](https://github.com/alphagov/govuk_publishing_components/pull/2127))
* Make jasmine tests pass in Internet Explorer ([PR #2090](https://github.com/alphagov/govuk_publishing_components/pull/2090))
* Allow a custom link to be used on the header logo ([PR #2114](https://github.com/alphagov/govuk_publishing_components/pull/2114))
* Add custom tracking action to Brexit superbreadcrumbs ([PR #2118](https://github.com/alphagov/govuk_publishing_components/pull/2118))

## 24.13.3

* Add event tracking to header elements ([PR #2110](https://github.com/alphagov/govuk_publishing_components/pull/2110))

## 24.13.2

* Add alternate Brexit callout text ([PR #2115](https://github.com/alphagov/govuk_publishing_components/pull/2115))

## 24.13.1

* Rename /transition to /brexit ([PR #2112](https://github.com/alphagov/govuk_publishing_components/pull/2112))

## 24.13.0

* Update link styles for show password component ([PR #2074](https://github.com/alphagov/govuk_publishing_components/pull/2074))
* Update link styles for subscription links ([PR #2075](https://github.com/alphagov/govuk_publishing_components/pull/2075))
* Update inset text block example ([PR #2085](https://github.com/alphagov/govuk_publishing_components/pull/2085))
* Remove direct anchor styling on inverse header component ([PR #2084](https://github.com/alphagov/govuk_publishing_components/pull/2084))
* Update action link, contents list and image card components to use new link styles ([PR #2071](https://github.com/alphagov/govuk_publishing_components/pull/2071))
* Add govuk-link classes to government navigation links ([PR #2081](https://github.com/alphagov/govuk_publishing_components/pull/2081))
* Update share links to have new underline styles ([PR #2073](https://github.com/alphagov/govuk_publishing_components/pull/2073))
* Add govuk-link-common mixin to govspeak links ([PR #2078](https://github.com/alphagov/govuk_publishing_components/pull/2078))
* Update links styles for accordion component ([PR #2080](https://github.com/alphagov/govuk_publishing_components/pull/2080))
* New link styles for prev next navigation ([PR #2088](https://github.com/alphagov/govuk_publishing_components/pull/2088))
* Update organisation logos hover state ([PR #2089](https://github.com/alphagov/govuk_publishing_components/pull/2089))
* New link styles for step by step nav ([PR #2092](https://github.com/alphagov/govuk_publishing_components/pull/2092))
* Reset organisation logo margin ([PR #2109](https://github.com/alphagov/govuk_publishing_components/pull/2109))

## 24.12.0

* Move all hardcoded text from components into locale files ([PR #2100](https://github.com/alphagov/govuk_publishing_components/pull/2100))

## 24.11.1

* Update shape of tracking link ([PR #2101](https://github.com/alphagov/govuk_publishing_components/pull/2101))

## 24.11.0

* Add `[Withdrawn]` to the beginning of the `og:title` meta tag for withdrawn pages ([PR #2066](https://github.com/alphagov/govuk_publishing_components/pull/2066))
* Fix accordion anchor link navigation bug ([PR #2087](https://github.com/alphagov/govuk_publishing_components/pull/2087))
* Remove jQuery from the feedback component ([PR #2062](https://github.com/alphagov/govuk_publishing_components/pull/2062))
* Remove `display: none` rules from component print stylesheets, and use the `govuk-!-display-none-print` class instead. ([PR #1561](https://github.com/alphagov/govuk_publishing_components/pull/1561))
* Fix IE11 `initCustomEvent` error ([PR #2079](https://github.com/alphagov/govuk_publishing_components/pull/2079))
* If present, use the url_override field in breadcrumbs ([PR #2093](https://github.com/alphagov/govuk_publishing_components/pull/2093))

* Keep docs in line with incoming change in govspeak ([PR #2064](https://github.com/alphagov/govuk_publishing_components/pull/2064))

## 24.10.3

* Remove phase banner restrictions ([PR #2057](https://github.com/alphagov/govuk_publishing_components/pull/2057))

## 24.10.2

* Allow modules to start after cookie consent ([PR #2041](https://github.com/alphagov/govuk_publishing_components/pull/2041))
* Fix travel advice pages to use parent breadcrumbs ([PR #2050](https://github.com/alphagov/govuk_publishing_components/pull/2050))
* Refactor heading logic in radio component ([PR #2051](https://github.com/alphagov/govuk_publishing_components/pull/2051))
* Update design of metadata component ([PR #2046](https://github.com/alphagov/govuk_publishing_components/pull/2046))
* Update scroll tracker config entries ([PR #2052](https://github.com/alphagov/govuk_publishing_components/pull/2052))

## 24.10.1

* Remove unused i18n keys ([PR #2038](https://github.com/alphagov/govuk_publishing_components/pull/2038))
* Update postcode regex for PII stripping ([PR #2043](https://github.com/alphagov/govuk_publishing_components/pull/2043))
* Add legacy `govspeak` class alongside gem-c-govspeak ([PR #2044](https://github.com/alphagov/govuk_publishing_components/pull/2044))

## 24.10.0

* Resolve IE11 accordion gem doc duplication ([PR #2036](https://github.com/alphagov/govuk_publishing_components/pull/2036))
* Add data attributes to show password component ([PR #2025](https://github.com/alphagov/govuk_publishing_components/pull/2025))
* Update documentation about component conventions and visual regression testing ([PR #2015](https://github.com/alphagov/govuk_publishing_components/pull/2015))
* Remove `@extend` from notice component styles ([PR #2030](https://github.com/alphagov/govuk_publishing_components/pull/2030))
* Swap out Sass `em()` function for `govuk-em()` ([PR #2034](https://github.com/alphagov/govuk_publishing_components/pull/2034))

## 24.9.4

* Set up scroll tracking for the PCR test start page ([PR #2028](https://github.com/alphagov/govuk_publishing_components/pull/2028))

## 24.9.3

* Remove govuk-link class from headings ([PR #2020](https://github.com/alphagov/govuk_publishing_components/pull/2020))
* Change wording of report a problem button on feedback component ([PR #2021](https://github.com/alphagov/govuk_publishing_components/pull/2021))
* Remove traffic light indicators from Brexit nav ([#PR2024](https://github.com/alphagov/govuk_publishing_components/pull/2024))
* Convert Brexit CTA into a standard link ([#PR2026](https://github.com/alphagov/govuk_publishing_components/pull/2026))

## 24.9.2

* Tidy up untranslated content and formatting on accordion docs ([PR #1958](https://github.com/alphagov/govuk_publishing_components/pull/1958)) PATCH
* Add visual regression testing tool Percy ([PR #1013](https://github.com/alphagov/govuk_publishing_components/pull/1013)) PATCH
* Remove `@extend` from component Sass ([PR #2002](https://github.com/alphagov/govuk_publishing_components/pull/2002)) PATCH
* Remove grid overrides in layout-header ([PR #2013](https://github.com/alphagov/govuk_publishing_components/pull/2013)) PATCH

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

## 21.19.0

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
* Hide 'Accept Cookies' button when JavaScript not available ([PR #948](https://github.com/alphagov/govuk_publishing_components/pull/948))

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

* Update cookie-banner behaviour without JavaScript ([PR #843](https://github.com/alphagov/govuk_publishing_components/pull/843))

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
* Update the way we include JavaScript and Stylesheets in the admin layout
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
* You can now add require a single JavaScript to include all components, just like CSS.

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
