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
