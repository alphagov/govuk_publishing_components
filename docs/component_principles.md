# Component Principles

What makes a good component?

A component is a package comprised of template, style, behaviour and documentation.

## A good component:

* is accessible
* is documented
* [follows convention](component_conventions.md)
* is isolated
* is tested
* can be translated

### A component is accessible when:

* it meets a set of defined accessibility acceptance criteria
* it passes [WCAG AA compliance](https://www.w3.org/WAI/WCAG20/quickref/)
* it has automated accessibility testing with good coverage to protect against regressions
* it is responsive
* it is progressively enhanced
* [it works for everyone](https://www.gov.uk/design-principles#sixth)

### A component is documented when:

* its purpose is clear
* it can be viewed as it would be used
* it can be viewed with a comprehensive set of inputs and outputs
* it is clear how to use it
* it defines what makes it accessible
* it lives in a guide with other components

### A component is isolated when:

* its styles and scripts have no effect on the page or other components
* it does not rely on external selectors to style its children

### A component is tested when it has:

* unit tests
* visual regression tests
* automated accessibility tests

## A good component architecture:

* provides a consistent component API to applications
* defines a convention for components to follow
* lints components for consistent coding style
* makes it easy to build, move or delete components
* makes it easy to arrange or compose components without further code to ‘glue’ them together
* makes components discoverable
* hides the internal implementation of a component from applications
