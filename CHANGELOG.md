# Changelog

- We use the [GOV.UK versioning guidelines](https://docs.publishing.service.gov.uk/manual/publishing-a-ruby-gem.html#versioning).
- Mark breaking changes with `BREAKING:`. Be sure to include instructions on how applications should be upgraded.
- Include a link to your pull request.
- Don't include changes that are purely internal. The CHANGELOG should be a
  useful summary for people upgrading their application, not a replication
  of the commit log.

## Unreleased

* Increase focus contrast of feedback links (PR #731)

## 13.8.1

* Fix autocomplete to allow it to handle HTML entities in the select list (PR #728)

## 13.8.0

* Update contextual breadcrumbs to not show taxonomy breadcrumbs when showing specialist documents (PR #725)

## 13.7.0

* Extend accessible autocomplete onConfirm function (PR #718)
* Add Accordion component based on GOV.UK Frontend (PR #714)
* Add type option to button component (PR #711)

## 13.6.1

* Extend toggle module (PR #712)

## 13.6.0

* Add search to component guide (PR #706)

## 13.5.4

* Allow navigation items to only show in collapsed menu (PR #691)
* Update panel component to support prepended and appended content (PR #701)

## 13.5.3

* Update error-summary component to use govuk-frontend styles (PR #692)
* Fix issues with data submission in the Feedback component (#698, #699, #700)

## 13.5.2

* Improve autocomplete appearance without js (PR #695)
* Adds tracking to select component (PR #690)

## 13.5.1

* Add value check to accessible autocomplete custom onConfirm function (PR #693)
* Move all commonly used imports into all_components.scss (PR #683)

## 13.5.0

* Allow heading on single checkbox (PR #686)

## 13.4.0

* Change heading/legend/hint options on checkboxes component (PR #684)

## 13.3.0

* Put margin bottom on autocomplete (PR #680)
* Adds hidden class to conditional reveals for radio to resolve flicker issue (PR #679)
* Limit hint styles to checkboxes (PR #681)

## 13.2.0

* Add guard for user agent and url being nil in feedback (PR #677)

## 13.1.0

* Accessible autocomplete triggers change if tracking data is supplied (PR #666)

## 13.0.0

* Encode feedback component to ensure UTF-8 characters are rendered (PR #673)
* Fix autocomplete styles (PR #671)
* BREAKING: Merge checkbox components (PR #659)
* Accept a maxlength attribute for input (PR #670)

## 12.21.0

* Retires the taxonomy navigation component (PR #606)
* Introduces a new contextual footer component (PR #606)
* Use ERB comments not HTML comments in template markup (PR #667)
* Layout footer component now accepts an attributes hash for each link element (PR #664)

## 12.20.0

* Error alert supports data attributes on root element (PR #662)
* Error summary supports data attributes on root element (PR #662)

## 12.19.0

* Tabs supports data attributes on the tab element (PR #660)
* Details supports data attributes on root element (PR #660)
* Copy to clipboard supports data attributes for the input element (PR #660)
* Put nested checkboxes into lists to add support for screen readers (PR 642)

## 12.18.0

* Add inverse option to metadata component (PR #657)
* Modify warning text component (PR #655)

## 12.17.0

* Add data attributes to select component (PR #650)

## 12.16.0

* Update components for finders (PR #643)

## 12.15.0

* Support embedding content inside textarea formgroup (PR #649)
* Accept a maxlength attribute for textarea (PR #649)

## 12.14.1

* Edit ERB view to prevent invalid HTML generation. (PR #647)

## 12.14.0

* Add accessible autocomplete component. (PR #621)
* Descope govuk-frontend styles in the admin layout (PR #646)

## 12.13.0

* Add heading options to radio component (PR #635)
* Add tests for checkbox JS (PR# 636)

## 12.12.1

* Corrects name for checkboxes documentation (PR #638)

## 12.12.0

* Add a readonly option to input component (PR #633)
* Copy to clipboard is readonly and selects input on click (PR #633)
* Copy to clipboard supports data attributes for the button element (PR #633)
* Update back link component to allow injection of custom text (PR #628)
* Update panel component to only render div if description is provided (PR #628)

## 12.11.0

* Make the legend as page heading optional (PR #630)

## 12.10.0

* Add support to checkboxes to allow nested checkboxes and add new checkbox component (PR #626)

## 12.9.1

* Fix showing multiple error items in a form field (PR #625)

## 12.9.0

* Add option to checkboxes to allow preselected items (PR #623)

## 12.8.0

* Add 'error_items' option for input, radio, textarea and file upload components (PR #615)
* Update layout header to allow a full width option (PR #616)
* Correctly import the govspeak-html-publication component (PR #618)

## 12.7.1

* Update phase banner component to use GOV.UK Frontend styles (PR #613)
* Update phase banner component to support application name (PR #613)

## 12.6.0

* Adds separate tracking data for a link to the homepage on breadcrumbs (PR #610)

## 12.5.0

* Add a hidden 'Maybe' option to the feedback component. (PR #608)

## 12.4.0

* Updates current breadcrumbs components to be based on GOV.UK Frontend (PR #593)
* Expands image card component to handle smaller images gracefully (PR #605)

## 12.3.0

* Expose a high resolution image in meta tags (PR #592)
* Add Warning text component based on GOV.UK Frontend (PR #588)
* Add Checkboxes component based on GOV.UK Frontend (PR #590)

## 12.2.0

* Fix regression for buttons in govspeak section (PR #582)
* Add character count component based on GOV.UK Frontend (PR #583)

## 12.1.0

* Add option to send the `user_organisation` in admin analytics component (PR #577)
* Add a bottom margin to the error-alert component (PR #578)
* Update the way we include Javascript and Stylesheets in the admin layout
  component. Make sure to follow the [installation instructions](docs/install-and-use.md) (PR #571) if your using the admin layout component.
* Fix background colour for focused buttons (PR #579)

## 12.0.1

* Add a bottom margin to the success-alert component (PR #573)

## 12.0.0

* Append the product name to the browser title (PR #563)
* BREAKING: Remove Slimmer as a dependency
This comprises many minor changes to components so they no longer rely on
Static provided stylesheets.
- If your app uses Slimmer, the component guide will no longer use it and you
  can no longer rely on any resets/global rules provided
- If your app removes the Slimmer middleware this will now break as Slimmer
  will be an undefined constant
- Apps which the admin layout no longer need to include jQuery as this comes
  bundled in the admin scripts.
* Use a purple environment colour on Heroku (#566). Make sure to add a `HEROKU` environment variable to Heroku instances.
* Use a red favicon colour on production (#566)

## 11.2.0

* Fix toggle behaviour in related navigation and taxonomy navigation when JS disabled (PR #551)
* Make "GOV.UK Publishing" the default product name (PR #557 #561)
* Change the colour of production to red (PR #557)
* Add environment tag in the header for all environments (PR #557)

## 11.1.0

* Add Admin analytics script (#555)
* You can now use `GovukPublishingComponents::AppHelpers::Environment.current_acceptance_environment` to get the current environment, for use in the admin layout components (PR #548)
* Update GOV.UK Frontend from 1.2.0 to 2.1.0 and manage breaking changes (PR #545)
* Add navigation and meta links to footer component (PR #550)
* Allow autofocus on input component (PR #552)
* Fix label in component guide (PR #553)

## 11.0.0

* BREAKING: Use time element in image card component, breaking change.
This will require an update to usages of the image card component.
The way in which context information is passed to the component has changed from `context: "some context"` to `context: {text: "some context", date: "2017-06-14"`}

## 10.2.0

* Add data-tracking-url for radio inputs for the purposes of cross domain tracking (PR #539)

## 10.1.0

* Add isPartOf schema to content with document collections (PR #542)

## 10.0.0

* BREAKING: Code related to `Policies` has been removed, including the
`related_policies` method. This shouldn't be used anymore, as all `Policies`
are being unpublished. Use the new single Topic Taxonomy instead. (#540)

## 9.28.0

* Show step by step when the navigation is disabled but a user is actively interacting with the step by step (PR #535)

## 9.27.0

* Remove 'Policies' link from government navbar (PR #529)

## 9.26.1

* Add parentOrganization and subOrganization properties to org schemas (PR #533)
* Remove RummagerTaxonomySidebarLinks from contextual navigation (PR #530)

## 9.26.0

* Add table component (PR #531)
* Add destructive modifier to button component (PR #523)

## 9.25.0

* Add a hasPart schema to collection pages (PR #522)

## 9.24.0

* Insert component guide script elements before closing body element (PR #525)

## 9.23.0

* Add half_width flag for higlight boxes (PR #520)

## 9.22.0

* Refactor header component to provide options for head or list (PR #516)

## 9.21.0

* Add file upload component based on GOV.UK Frontend (PR #515)
* Use divs for the alert message bodies (PR #517)

## 9.20.0

* Pass label params through for input component (PR #512)

## 9.19.0

* Make 'title' optional on error_summary component (PR #510)
* Make 'href' optional for items in the error_summary (PR #510)

## 9.18.0

* Show relevant step by step nav based on user journey (PR #501)
* Add Error alert component (PR #503)
* Add experimental panel component based on GOV.UK Frontend (PR #507)
* Adds step by step content ID to links inside steps (PR #502)
* Pass through label params from textarea component (PR #508)

## 9.17.1

* Fix bug in success alert component (PR #503)

## 9.17

* Support a description for Success Alert component (PR #499)
* Bugfix for Radios component (PR #496)
* Fix for Google Tag Manager component (PR #497)
* Add Copy to clipboard component (PR #494)

## 9.16.1

* Bugfix for Google Tag Manager component (PR #492)

## 9.16.0

* Allow target attribute for links generated with the button component (PR #488)
* Add Google Tag Manager script as component (PR #489)

## 9.15.0

* Update tabs component to make the heading inside the panel optional and to add a modifier for panel without border (PR #485)
* Add secondary and secondary quiet modifiers to button component (PR #484)

## 9.14.0

* Add the 'about' property for the schema.org schema for an Article with live taxons (PR #482)
* Improve step by step component double dot problem solving code (PR #473)

## 9.13.0

* Allow custom tags in `<head>` for admin layout (PR #480)
* Adds taxonomy list component (PR #476)

## 9.12.2

* Remove fixed 'name=button' attribute for buttons, to avoid them becoming a form param (PR #479)

## 9.12.1

* Renames the publishing-app metatag to publishing-application, to be consistent with rendering-application (PR #475)

## 9.12.0

* Adds publishing-app metatag (PR #470)

## 9.11.0

* Add data attributes and spellcheck support for textarea component (PR #468)
* Add data attributes support for input component (PR #469)
* Relevant step by step should now be open inside simple smart answers (PR #472)

## 9.10.0

* Enables bold styling in govspeak blocks, removes rich govspeak feature (PR #463)

## 9.9.1

* Stop document list rendering titles as headings (PR #465)

## 9.9.0

* Step by step component, Google snippet improvement (PR #461)
* Add tabs component (PR #455)
* Adds styling for singular related step by step navs (PR #458)
* Add schema.org `isPartOf` links from articles to step by steps (PR #384)

## 9.8.0

* Add error message and hint components based on GOV.UK Frontend (PR #446)
* Update feedback component to use GOV.UK Frontend styles (PR #447)
* Remove brackets from show/hide links (PR #448)
* Add experimental inset text component based on GOV.UK Frontend (PR #449)
* Add experimental textarea component based on GOV.UK Frontend (PR #450)
* Add reset styles to document list component (PR #451)
* Add tests for contextual breadcrumbs (PR #457)
* Allow prioritising taxonomy breadcrumbs (PR #457)
* Contextual breadcrumbs will show taxon based breadcrumbs if prioritise_taxon_breadcrumbs is true (defaults to false if not passed) (PR #457)

## 9.7.0

* Update radio component to use GOV.UK Frontend styles (PR #433)
* Update button component to use GOV.UK Frontend styles (PR #439)
* Update back-link component to use GOV.UK Frontend styles (PR #440)
* Add conditional reveal support for radios using GOV.UK Frontend scripts (PR #441)
* Update input component to use GOV.UK Frontend styles (PR #442)
* Update label component to use GOV.UK Frontend styles (PR #443)
* Upgrade to the latest version of the Design System (PR #444)

## 9.6.0

* Change breadcrumb class name (PR #435)
* Add admin component for select (PR #434)
* Extend the double dot problem solution (PR #432)

## 9.5.3

* Improve metadata positioning in document list for rtl layouts (PR #429)
* Add favicon to admin layout (PR #426)
* Disable GOV.UK Frontend global styles (PR #427)
* Replace the location URL sent to Google Analytics with one that masks email addresses (PR #428)

## 9.5.2

* Attempt to improve Google snippet display (PR #424)
* Add JavaScript detection, HTML5 shim and IE8 stylesheet to admin layout (PR #419)

## 9.5.1

* Extends the page title component to add in margin_bottom (PR #419)
* Fix the step by step title sizing and spacing on mobile when it appears as a footer (PR #413)

## 9.5.0

* Improve step nav 'remember open steps' code (PR #406)
* The Notice component now accepts blocks (PR #407)
* Add experimental layout-header component based on GOV.UK Frontend (PR #408)
* Add robots nofollow meta tag to admin layout (PR #409)
* Improve the accessibility of the previous/next arrows on mainstream guides (PR #410)
* Import and initialise GOV.UK Frontend scripts in the admin layout (PR #415)
* Remove unneeded options from step nav component (PR #416)
* Add experimental skip link component based on GOV.UK Frontend (PR #417)
* Add CSRF meta tag to admin layout (PR #418)

## 9.4.0

* Add experimental admin layout (PR #371)
* Add the [GOV.UK Frontend](https://design-system.service.gov.uk/) library to the gem (PR #398)
* Allow linking to the Design System on component pages (PR #401)
* Add govuk:analytics:organisations meta tag if the current page is an organisation (PR #397)
* Move the highlight box component from Collections to the gem (PR #403)
* Add experimental layout-footer component based on GOV.UK Frontend (PR #404)

## 9.3.6

* Make heading tag optional on image card (PR #394)

## 9.3.5

* Extend image card to support html description (PR #392)

## 9.3.4

* Adjust metadata spacing in image card (PR #390)
* Fix focus states in branding model (PR #389)

## 9.3.3

* Add explicit Civil Service branding (PR #387)

## 9.3.2

* Fix heading structure in feedback component (PR #385)

## 9.3.1

* Allow image card component to not have main link (PR #382)

## 9.3.0

* Add Metadata component from Static (PR #374)
* Remove the special casing to run this component in Static (#379)

## 9.2.3

* Add metadata to image card component (PR #377)
* Modify share links component (PR #376)
* Remove underline on image card title link (PR #375)

## 9.2.2

* Add no10 to the branding model (PR #372)

## 9.2.1

* Add no margin top option to translation nav (PR #368)

## 9.2.0

* Add organisation logo component from static (PR #365)
* Tweaks document list spacing for context text on smaller screens (PR #363)
* Makes heading component use h2 by default (PR #362)

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

* Extend the document list component (PR #355)
* Remove policies from the taxonomy navigation sidebar (PR #357)

## 9.0.1

* The component guide is no longer using `Slimmer::GovukComponents`, so this
  gem can now be used with [Slimmer 13.0.0][s13] (PR #353)

[s13]: https://github.com/alphagov/slimmer/blob/master/CHANGELOG.md#1300

## 9.0.0

* Import images for the button component from static (PR #338)
* Add contents list component (PR #342)
* BREAKING: Iterate share links component (PR #316)
* Add image card component (PR #322)
* Add notice component (PR #346)
* Iterate contents list component (PR #351)
* Add "person" schema to the Machine readable metadata component (PR #343)

### Upgrade instructions

Replace the govspeak component by running the following:

```
find app/views -type f -print0 | xargs -0 sed -i '' 's/govuk_component\/govspeak/govuk_publishing_components\/components\/govspeak/
```

The share links component has changed fundamentally, the PR to update it in [government-frontend is here](https://github.com/alphagov/government-frontend/pull/906) and it isn't used in any other app yet.

## 8.2.0

* Add better meta tags for third parties to the "Machine readable metadata"
  component. If you're using this component you should remove any canonical
  tags, OpenGraph tags and Twitter cards (#335)
* Move the Title component from static (PR #324)
* Move the Lead paragraph component from static (PR #325)
* Move the Next and previous component from static (PR #329)
* Move the Government navigation component from static (PR #334)
* Add a Phase banner component to replace the Alpha/Beta banners in Static (PR #333)

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

* Add the "Machine readable metadata" component (PR #318)

## 8.0.1

* Fix a bug in subscription links attributes (PR #314)

## 8.0.0

* BREAKING: The Button component no longer accepts unescaped HTML in the `info_text`,
  you'll have to call `html_safe` on it yourself. Probably the only affected
  application is `frontend` (#305)
* BREAKING: Remove optional `canonical` meta tag (applications can add this tag explicitly if they need it)
* BREAKING: Iterate heading component (PR #307)

* Use new breadcrumbs component in contextual breadcrumbs (PR #313)
* Add share links component (PR #308)
* Translation nav add brand and tracking (PR #298)
* Subscription links add colour and tracking (PR #299)
* Add breadcrumbs component (PR #309) with schema data (PR #310)

## 7.3.0

* Fix automated a11y test error with input (PR #303)
* Add an optional `canonical` meta tag (PR #302)
* Iterate branding model (PR #300)

## 7.2.0

* Add department colours to components (PR #296)
* Modify subscription links component (PR #294)

## 7.1.0

* Add subscription links component (PR #290)
* Add translation nav component (PR #289)
* Make components CSS available to static in the component guide (PR #286)
* Add heading component (PR #288)

## 7.0.0

* BREAKING: Breaks the search component (at the moment only used by finder-frontend, so if won't be breaking for other apps).
* Add an optional meta tag to signal dates should be stripped from
  data sent to Google Analytics. (#282)

## 6.7.0

* Feedback component: send users a different survey (#280)
* Add the Meta tags component. This component should be used in place of the
  "analytics meta tags" component in static. They have the same behaviour. (#278)

## 6.6.0

* Show all mainstream browse pages in the sidebar (#273)
* Show "normal" navigation in addition to step by step, make sidebars consistent (#275)
* Simplify the internal logic of breadcrumbs and sidebar (#277)

## 6.5.0

* Add button component (PR #271)

## 6.4.0

* Move text for JS appended elements into step nav template (PR #263)
* Add link to step nav research (PR #261)
* Add search component (PR #267)

## 6.3.0

* Remove bottom border for last item in document lists (PR #266)
* Create success alert component (PR #254)
* Add padding-top flag to inverse header

## 6.2.0

* Always use the related links sidebar for travel advice (PR #264)
* Add padding-top flag to inverse header

## 6.1.0

* Add taxonomy navigation component, this will eventually supersede the static component.
  It may well be possible to merge with parts of the related navigation component as some
  of the functionality is shared between the two.

## 6.0.0

* Fix visited link colour on focus for white feedback links (PR #239)
* Fix input error colour (PR #241)
* Add helper for generating breadcrumbs on taxon and taxonomy-based finder pages (PR #242)
* BREAKING: merge the [govuk_navigation_helpers][] gem into this project (#244). To upgrade, you will have to use the contextual navigation components ([sidebar](https://govuk-publishing-components.herokuapp.com/component-guide/contextual_sidebar) and [breadcrumbs](https://govuk-publishing-components.herokuapp.com/component-guide/contextual_breadcrumbs)) .

[govuk_navigation_helpers]: https://github.com/alphagov/govuk_navigation_helpers

## 5.7.0

* Restore underline to step nav related links links (PR #236)
* Improve substep creation (PR #231)
* Improve spacing of inverse header to allow it to replace publication header component in government-frontend (PR #238)
* Improve list and link classnames (PR #230)
* Remove preventLinkFollowingForCurrentTab code (PR #229)

## 5.6.0

* Restore 'referer' field to feedback component form submission (PR #232)
* Create single breadrumb and sidebar contextual navigation components. Not a breaking change, but you can drop `govuk_navigation_helpers` as a dependency now.
* You can now add require a single Javascript to include all components, just like CSS.

Replace all individual includes with:

```js
# application.js
//= require govuk_publishing_components/all_components
```

* Update document list component with smaller margin spacing (PR #234)

## 5.5.6

* Add optional margin top flag for feedback component (PR #222)

## 5.5.5

* Add optional flags for spacing around document list component (PR #217)

## 5.5.4

* Make changes released in 5.5.3 backwards compatible.

## 5.5.3

* Enforce white content in inverse component (PR #214).

## 5.5.2

* Add `full-width` flag to remove left and right padding when using a full width page header (PR #212).
* Update design of document list component for topic pages (PR #202)

## 5.5.1

* Fix bug in `related_navigation` helper that did not gracefully handle ordered
related items that aren't tagged to a mainstream browse page (PR #210).

## 5.5.0

* Add new inverse header component (PR #203).

## 5.4.1

* Remove worldwide organisation links from the payload used by the `related_navigation` component, as they're not required.
* Fix bug where the correct number of mainstream browse pages weren't displaying
in the `related_navigation` component in cases where a grandparent mainstream
browse page is present (PR #205).

## 5.4.0

* Add document_list component from government-frontend, so that it can be used by collections. This is not a breaking change, but it is not backwards compatible with previous versions of the component. (PR #199)

## 5.3.0

* Add step by step navigation component helpers

## 5.2.3

* Feedback: add role button to links (PR #193)
* Feedback: fix styling on older layouts (PR #194)

## 5.2.2

* Feedback: add spacing above component (PR #191)
* Feedback: set font sizes (PR #190)
* Feedback: improve link spacing (PR #188)

## 5.2.1

* Feedback: changes to the event tracking (PR #184)
* Related Navigation: accessibility improvements (PR #182)

## 5.2.0

* Add related_navigation component from government-frontend, so that it can also
be used by frontend. This is not a breaking change, but it is not backwards
compatible with previous versions of the component. (PR #164)

## 5.1.3

* Accessibility fixes for the feedback component (PR #173)

## 5.1.2

* Fix feedback component when JS disabled (PR #175)
* Step nav accessibility changes (PR #160)

## 5.1.1

* Improvements for the feedback component on mobile (PR #168 and #169)

## 5.1.0

* Support other a customisable type attribute for input component (PR #165)
* Add unique tracking to all GA events on step nav components (PR #162)
* Add feedback component (PR #163)

## 5.0.0

* BREAKING: Rename task list components (PR #156), breaking change
* BREAKING: Remove task list groups (PR #154), breaking change

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

* Fix Heroku review apps (PR #149)
* Remove doubly included stylesheets (PR #148)
* Update installation instructions (PR #147)
* Refactor task list component code (PR #143)
* Fix task list related namespace (PR #141)

## 4.1.0

* Move error summary component into gem (PR #138)

## 4.0.0

* BREAKING: Namespace hosted components with `govuk_publishing_components` (PR #136)
  * References to components hosted in gem need to point to `govuk_publishing_components/components` rather than `/components`. This includes stylesheets, partials and javascripts.
  * References to task list print styles must be updated to point at the new /print subdirectory

## 3.3.0

* Move back link component in gem (PR #131)

## 3.2.1

* Fix radio component not including welsh translation (PR #128)

## 3.2.0

* Remove unneeded CSS from component guide (PR #126)
* Add heading element into task list component and change get help link behaviour (PR #113)
* Improve task list print styles (PR #125)
* Move form components into gem (PR #116)

## 3.1.0

* Add support for components which accept a block (PR #117)

## 3.0.3

* Sort components by name in the component list (PR #114)
* Remove ES6 syntax (replace const with var) to fix uglifier errors when compiling assets (PR #114)
* Add procfile to allow running the dummy app (PR #115)

## 3.0.2

* Add styles for active link where active link is in a choice list, and fix focus states on same in Firefox (PR #110)

## 3.0.1

* Fix indent bug and number white background bug on newer iphones, overflow issue causing problem when text zoomed, fallback for older iphones, and improve print styles (PR #108)

## 3.0.0

* Allow the gem to host components (PR #105)
* Added task_list, task_list_header and task_list_related components which were
  in Static.  It's not a breaking change to this gem to include them, but they
  are not backwardly compatible with previous versions of the components. (PR #105)
* Work to tidy up the dummy application to more closely represent GOV.UK rails
  apps (PR #104)

## 2.0.0

BREAKING: breaking release, should be easy to migrate.

Previously with aXe we excluded all warnings relating to duplicate ids, this release allows you to exclude any rules you'd like to but removes this default.
Any components that relied on this default will need this rule adding to their documentation file.

See [test/.../docs/test-component-with-duplicate-ids.yml](spec/dummy/app/views/components/docs/test-component-with-duplicate-ids.yml) for an example of how this looks. (PR #101)

## 1.12.1

* Use lead paragraph component (PR #95)

## 1.12.0

* Add warnings and fail tests when no accessibility criteria are defined for a component (PR #90)

## 1.11.0

* Add task to check for components existing without corresponding docs (PR #86)
* Render aXe violations in component guide (PR #82)
* Remove component guide hover styles (PR #81)

## 1.10.0

* Add visual diff tool (PR #61)
* Disable duplicate ID aXe rule (PR #80)

## 1.9.0

* Use local govuk_components for static's component guide (PR #74)

## 1.8.2

* Force cookie and survey banner styling on (PR #76)

## 1.8.1

* Remove cookie and survey banner using CSS instead of setting cookies (PR #71)
* Fix syntax highlighting styles (PR #70 and #73)

## 1.8.0

* Add integration tests for apps to use when testing their component guide (PR #68)

## 1.7.0

* Remove cookie and survey banners from the component guide to allow visual diff tool comparison (PR #65)
* Make it clear when aXe has failed, succeeded or found errors (PR #64)

## 1.6.0

* Set X-Frame-Options header to allowall, to allow inclusion of component guide in iFrames (PR #53)
* Add shared accessibility criteria in component guide pages(PR #58)

## 1.5.0

* Add links to component guide homepage linking to conventions and principles (PR #52)

## 1.4.0

* Add dark_background context to examples (PR #49)

## 1.3.0

* Add optional descriptions to examples (PR #47)

## 1.2.0

* Exposes incomplete warnings from aXe in component guide pages (PR #40)

## 1.1.0

* Allow gem to be used with static (PR #43)

## 1.0.1

Fixes issue around page scrolling unexpectedly.

* Add context param to aXe so that options are passed correctly

## 1.0.0

All documentation will need updating when upgrading (see PR #37):
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

* Add aXe accessibility testing javascript to component guide pages (PR #33)
* Mark strings in YAML fixtures as HTML safe (PR #36)
* Refactor internal structs to use classes (PR #34)

## 0.8.0

* Add preview pages to component guide, to allow components to be viewed in isolation (PR #27)
* Includes addition of 'preview all' and 'preview' pages

## 0.7.0

* Relax required version of dependencies to allow gem to work with a Rails 5.1 project (PR #29)
* Fix text in generator yml template (PR #30)

## 0.6.0

* Add component generator (PR #24)

## 0.5.0

* Allow print styles to be shown in guide (PR #19)

## 0.4.2

* Relax slimmer version (PR #20)

## 0.4.1

* Fix overlap issue with code snippets (PR #15)

## 0.4.0

* Add syntax highlighting to code block showing how to call a component (PR #10)

## 0.3.1

* Remove ApplicationRecord files from gem (PR #8)

## 0.3.0

* Include body and accessibility acceptance criteria on component pages (PR #6)
* Fix load ordering bug which would sometimes cause the component guide to use the app’s layout (PR #5)

## 0.2.0

* Allow components to use application view helpers (PR #3)

## 0.1.0

* Initial release
