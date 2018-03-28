# 6.1.0

* Add taxonomy navigation component, this will eventually supersede the static component.
  It may well be possible to merge with parts of the related navigation component as some
  of the functionality is shared between the two.

# 6.0.0

* Fix visited link colour on focus for white feedback links (PR #239)
* Fix input error colour (PR #241)
* Add helper for generating breadcrumbs on taxon and taxonomy-based finder pages (PR #242)
* Breaking: merge the [govuk_navigation_helpers][] gem into this project (#244). To upgrade, you will have to use the contextual navigation components ([sidebar](https://govuk-publishing-components.herokuapp.com/component-guide/contextual_sidebar) and [breadcrumbs](https://govuk-publishing-components.herokuapp.com/component-guide/contextual_breadcrumbs)) .

[govuk_navigation_helpers]: https://github.com/alphagov/govuk_navigation_helpers

# 5.7.0

* Restore underline to step nav related links links (PR #236)
* Improve substep creation (PR #231)
* Improve spacing of inverse header to allow it to replace publication header component in government-frontend (PR #238)
* Improve list and link classnames (PR #230)
* Remove preventLinkFollowingForCurrentTab code (PR #229)

# 5.6.0

* Restore 'referer' field to feedback component form submission (PR #232)
* Create single breadrumb and sidebar contextual navigation components. Not a breaking change, but you can drop `govuk_navigation_helpers` as a dependency now.
* You can now add require a single Javascript to include all components, just like CSS.

Replace all individual includes with:

```js
# application.js
//= require govuk_publishing_components/all_components
```

* Update document list component with smaller margin spacing (PR #234)

# 5.5.6

* Add optional margin top flag for feedback component (PR #222)

# 5.5.5

* Add optional flags for spacing around document list component (PR #217)

# 5.5.4

* Make changes released in 5.5.3 backwards compatible.

# 5.5.3

* Enforce white content in inverse component (PR #214).

# 5.5.2

* Add `full-width` flag to remove left and right padding when using a full width page header (PR #212).
* Update design of document list component for topic pages (PR #202)

# 5.5.1

* Fix bug in `related_navigation` helper that did not gracefully handle ordered
related items that aren't tagged to a mainstream browse page (PR #210).

# 5.5.0

* Add new inverse header component (PR #203).

# 5.4.1

* Remove worldwide organisation links from the payload used by the `related_navigation` component, as they're not required.
* Fix bug where the correct number of mainstream browse pages weren't displaying
in the `related_navigation` component in cases where a grandparent mainstream
browse page is present (PR #205).

# 5.4.0

* Add document_list component from government-frontend, so that it can be used by collections. This is not a breaking change, but it is not backwards compatible with previous versions of the component. (PR #199)

# 5.3.0

* Add step by step navigation component helpers

# 5.2.3

* Feedback: add role button to links (PR #193)
* Feedback: fix styling on older layouts (PR #194)

# 5.2.2

* Feedback: add spacing above component (PR #191)
* Feedback: set font sizes (PR #190)
* Feedback: improve link spacing (PR #188)

# 5.2.1

* Feedback: changes to the event tracking (PR #184)
* Related Navigation: accessibility improvements (PR #182)

# 5.2.0

* Add related_navigation component from government-frontend, so that it can also
be used by frontend. This is not a breaking change, but it is not backwards
compatible with previous versions of the component. (PR #164)

# 5.1.3

* Accessibility fixes for the feedback component (PR #173)

# 5.1.2

* Fix feedback component when JS disabled (PR #175)
* Step nav accessibility changes (PR #160)

# 5.1.1

* Improvements for the feedback component on mobile (PR #168 and #169)

# 5.1.0

* Support other a customisable type attribute for input component (PR #165)
* Add unique tracking to all GA events on step nav components (PR #162)
* Add feedback component (PR #163)

# 5.0.0

* Rename task list components (PR #156), breaking change
* Remove task list groups (PR #154), breaking change

* To include the CSS for all components in the gem, you can now do:

```css
# application.scss
@import "govuk_publishing_components/all_components";
```

And for print styles

```css
# print.scss
@import "govuk_publishing_components/all_components_print";
```

# 4.1.1

* Fix Heroku review apps (PR #149)
* Remove doubly included stylesheets (PR #148)
* Update installation instructions (PR #147)
* Refactor task list component code (PR #143)
* Fix task list related namespace (PR #141)

# 4.1.0

* Move error summary component into gem (PR #138)

# 4.0.0

* Namespace hosted components with `govuk_publishing_components` (PR #136)
  * References to components hosted in gem need to point to `govuk_publishing_components/components` rather than `/components`. This includes stylesheets, partials and javascripts.
  * References to task list print styles must be updated to point at the new /print subdirectory

# 3.3.0

* Move back link component in gem (PR #131)

# 3.2.1

* Fix radio component not including welsh translation (PR #128)

# 3.2.0

* Remove unneeded CSS from component guide (PR #126)
* Add heading element into task list component and change get help link behaviour (PR #113)
* Improve task list print styles (PR #125)
* Move form components into gem (PR #116)

# 3.1.0

* Add support for components which accept a block (PR #117)

# 3.0.3

* Sort components by name in the component list (PR #114)
* Remove ES6 syntax (replace const with var) to fix uglifier errors when compiling assets (PR #114)
* Add procfile to allow running the dummy app (PR #115)

# 3.0.2

* Add styles for active link where active link is in a choice list, and fix focus states on same in Firefox (PR #110)

# 3.0.1

* Fix indent bug and number white background bug on newer iphones, overflow issue causing problem when text zoomed, fallback for older iphones, and improve print styles (PR #108)

# 3.0.0

* Allow the gem to host components (PR #105)
* Added task_list, task_list_header and task_list_related components which were
  in Static.  It's not a breaking change to this gem to include them, but they
  are not backwardly compatible with previous versions of the components. (PR #105)
* Work to tidy up the dummy application to more closely represent GOVUK rails
  apps (PR #104)

# 2.0.0

Breaking release, should be easy to migrate.

Previously with aXe we excluded all warnings relating to duplicate ids, this release allows you to exclude any rules you'd like to but removes this default.
Any components that relied on this default will need this rule adding to their documentation file.

See [test/.../docs/test-component-with-duplicate-ids.yml](spec/dummy/app/views/components/docs/test-component-with-duplicate-ids.yml) for an example of how this looks. (PR #101)

# 1.12.1

* Use lead paragraph component (PR #95)

# 1.12.0

* Add warnings and fail tests when no accessibility criteria are defined for a component (PR #90)

# 1.11.0

* Add task to check for components existing without corresponding docs (PR #86)
* Render aXe violations in component guide (PR #82)
* Remove component guide hover styles (PR #81)

# 1.10.0

* Add visual diff tool (PR #61)
* Disable duplicate ID aXe rule (PR #80)

# 1.9.0

* Use local govuk_components for static's component guide (PR #74)

# 1.8.2

* Force cookie and survey banner styling on (PR #76)

# 1.8.1

* Remove cookie and survey banner using CSS instead of setting cookies (PR #71)
* Fix syntax highlighting styles (PR #70 and #73)

# 1.8.0

* Add integration tests for apps to use when testing their component guide (PR #68)

# 1.7.0

* Remove cookie and survey banners from the component guide to allow visual diff tool comparison (PR #65)
* Make it clear when aXe has failed, succeeded or found errors (PR #64)

# 1.6.0

* Set X-Frame-Options header to allowall, to allow inclusion of component guide in iFrames (PR #53)
* Add shared accessibility criteria in component guide pages(PR #58)

# 1.5.0

* Add links to component guide homepage linking to conventions and principles (PR #52)

# 1.4.0

* Add dark_background context to examples (PR #49)

# 1.3.0

* Add optional descriptions to examples (PR #47)

# 1.2.0

* Exposes incomplete warnings from aXe in component guide pages (PR #40)

# 1.1.0

* Allow gem to be used with static (PR #43)

# 1.0.1

Fixes issue around page scrolling unexpectedly.

* Add context param to aXe so that options are passed correctly

# 1.0.0

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

# 0.9.0

* Add aXe accessibility testing javascript to component guide pages (PR #33)
* Mark strings in YAML fixtures as HTML safe (PR #36)
* Refactor internal structs to use classes (PR #34)

# 0.8.0

* Add preview pages to component guide, to allow components to be viewed in isolation (PR #27)
* Includes addition of 'preview all' and 'preview' pages

# 0.7.0

* Relax required version of dependencies to allow gem to work with a Rails 5.1 project (PR #29)
* Fix text in generator yml template (PR #30)

# 0.6.0

* Add component generator (PR #24)

# 0.5.0

* Allow print styles to be shown in guide (PR #19)

# 0.4.2

* Relax slimmer version (PR #20)

# 0.4.1

* Fix overlap issue with code snippets (PR #15)

# 0.4.0

* Add syntax highlighting to code block showing how to call a component (PR #10)

# 0.3.1

* Remove ApplicationRecord files from gem (PR #8)

# 0.3.0

* Include body and accessibility acceptance criteria on component pages (PR #6)
* Fix load ordering bug which would sometimes cause the component guide to use the app’s layout (PR #5)

# 0.2.0

* Allow components to use application view helpers (PR #3)

# 0.1.0

* Initial release
