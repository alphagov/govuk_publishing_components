/*
  Toggle the display of elements

  Basic use:

  <div data-module="gem-toggle">
    <a href="#" data-controls="target1" data-expanded="false">
      Show/hide
    </a>
    <div id="target1" class="js-hidden">
      Content hidden on page load
    </div>
  </div>

  Use `data-controls` and `data-expanded` to indicate the
  starting state and the IDs of the elements that the toggle
  controls. This is synonymous with ARIA attributes, which
  get added when starting.

  If you want to set `data-expanded` to false, you must add
  the `js-hidden` class to the element you wish to hide in
  your template, the module will not do this for you.

  Use `data-toggle-class` on the parent element to set the
  class that is toggled. Defaults to `js-hidden`.

  Content shown by default:

  <div data-module="gem-toggle">
    <a href="#" data-controls="target2" data-expanded="true">
      Show/hide
    </a>
    <div id="target2">
      Content shown on page load
    </div>
  </div>

  Change text when clicked:

  <div data-module="gem-toggle">
    <a href="#" data-controls="target3" data-expanded="true" data-toggled-text="Show more">
      Show less
    </a>
    <div id="target3">
      Content shown on page load, toggle text changes depending on state
    </div>
  </div>

  Use `data-toggled-text` on the trigger element to set the
  text shown when the element is toggled. Defaults to not
  changing.

  Show/hide multiple elements:

  <div data-module="gem-toggle">
    <a href="#" data-controls="target4 target5" data-expanded="false">
      Show/hide
    </a>
    <div id="target4" class="js-hidden">
      Content hidden on page load
    </div>
    <div id="target5" class="js-hidden">
      Content hidden on page load
    </div>
  </div>

  `data-controls` can contain more than one element, space
  separated.
*/

(function (Modules) {
  function GemToggle ($module) {
    this.$module = $module
  }

  GemToggle.prototype.init = function () {
    this.$module.toggleTrigger = this.$module.querySelector('[data-controls][data-expanded]')

    if (this.$module.toggleTrigger) {
      this.$module.toggleClass = this.$module.getAttribute('data-toggle-class') || 'js-hidden'
      this.addAriaAttrs()
      this.toggleOnClick()
    }
  }

  // Add the ARIA attributes with JavaScript
  // If the JS fails and there's no interactive elements, having
  // no aria attributes is an accurate representation.
  GemToggle.prototype.addAriaAttrs = function () {
    this.$module.toggleTrigger.setAttribute('role', 'button')
    this.$module.toggleTrigger.setAttribute('aria-controls', this.$module.toggleTrigger.getAttribute('data-controls'))
    this.$module.toggleTrigger.setAttribute('aria-expanded', this.$module.toggleTrigger.getAttribute('data-expanded'))
    this.$module.targets = this.getTargetElements()

    for (var i = 0; i < this.$module.targets.length; i++) {
      this.$module.targets[i].setAttribute('aria-live', 'polite')
      this.$module.targets[i].setAttribute('role', 'region')
    }
  }

  GemToggle.prototype.getTargetElements = function () {
    var ids = this.$module.toggleTrigger.getAttribute('aria-controls').split(' ')
    var selector = '#' + ids.join(', #')

    return this.$module.querySelectorAll(selector)
  }

  GemToggle.prototype.toggleOnClick = function () {
    var that = this

    this.$module.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault()
      var expanded = this.getAttribute('aria-expanded') === 'true'

      if (expanded) {
        this.setAttribute('aria-expanded', false)
        for (var i = 0; i < that.$module.targets.length; i++) {
          that.$module.targets[i].classList.add(that.$module.toggleClass)
        }
      } else {
        this.setAttribute('aria-expanded', true)
        for (var j = 0; j < that.$module.targets.length; j++) {
          that.$module.targets[j].classList.remove(that.$module.toggleClass)
        }
      }

      var rawToggledText = this.getAttribute('data-toggled-text')
      var sanitisedText = sanitiseHTML(rawToggledText)

      if (typeof rawToggledText === 'string') {
        this.setAttribute('data-toggled-text', this.innerHTML)
        this.innerHTML = sanitisedText
      }
    })
  }

  /*
   * Sanitises a string representation of HTML so it can be safely rendered on the page
   * @param {string} htmlString - HTML string, eg <span>hello</span>
   * @returns {string} - the sanitised version of the string
   */
  const sanitiseHTML = function (htmlString) {
    /* global DOMParser, Node */

    const ALLOWED_TAGS = ['SPAN']
    const ALLOWED_ATTRS = [/class/, /aria/]

    const parser = new DOMParser()

    // Suppressing alert here because this is the HTML that will be sanitised
    // codeql[js/xss-through-dom]
    var htmlDoc = parser.parseFromString(htmlString, 'text/html')

    sanitiseNode(htmlDoc)
    return htmlDoc.body.innerHTML

    function sanitiseNode (node) {
      const childNodes = Array.from(node.childNodes)
      childNodes.forEach(childNode => {
        // only sanitize element type nodes
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          // forbidden nodes are replaced with their children (which might be nothing, ie they are removed)
          if (!ALLOWED_TAGS.includes(childNode.tagName)) {
            childNode.removeAttribute(childNode.children)
          } else {
            // allowed nodes have any forbidden attributes removed
            const attributes = Array.from(childNode.attributes)
            attributes.forEach(attribute => {
              if (!ALLOWED_ATTRS.some(pattern => pattern.test(attribute.name))) {
                childNode.removeAttribute(attribute.name)
              }
            })
          }
        }

        // sanitize all this node's children too
        sanitiseNode(childNode)
      })
    }
  }

  Modules.GemToggle = GemToggle
})(window.GOVUK.Modules)
