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
