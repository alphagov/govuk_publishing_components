(() => {
  // app/assets/javascripts/govuk_publishing_components/modules/accordion.js
  var GemAccordion = class {
    constructor($module) {
      this.$module = $module;
      this.sectionClass = "govuk-accordion__section";
      this.sectionExpandedClass = "govuk-accordion__section--expanded";
      this.sectionInnerContentClass = "govuk-accordion__section-content";
      this.sectionHeader = ".govuk-accordion__section-header";
      this.showAllControls = ".govuk-accordion__show-all";
      this.sectionButton = ".govuk-accordion__section-button";
      this.headingText = ".govuk-accordion__section-heading-text";
      this.$module.actions = {};
      this.$module.actions.locale = this.$module.getAttribute("data-locale");
    }
    init() {
      this.$module.querySelector(this.showAllControls).classList.add("gem-c-accordion__show-all");
      if (this.$module.getAttribute("data-anchor-navigation") === "true") {
        this.openByAnchorOnLoad();
        this.addEventListenersForAnchors();
      }
      if (this.$module.getAttribute("data-track-show-all-clicks") === "true") {
        this.addAccordionOpenAllTracking();
      }
      if (this.$module.getAttribute("data-track-sections") === "true") {
        this.addEventListenerSections();
      }
      var showAllAttributes = this.$module.getAttribute("data-show-all-attributes");
      var showAll;
      if (showAllAttributes) {
        try {
          showAll = this.$module.querySelector(this.showAllControls);
          var values = JSON.parse(showAllAttributes);
          var keys = Object.keys(values);
          for (var i = 0; i < keys.length; i++) {
            showAll.setAttribute("data-" + keys[i], values[keys[i]]);
          }
        } catch (e) {
          console.error("Could not read accordion data attributes error: " + e.message, window.location);
        }
      }
      var dataModule = this.$module.getAttribute("data-module");
      var isGa4Enabled = dataModule ? dataModule.indexOf("ga4-event-tracker") !== -1 : false;
      if (isGa4Enabled) {
        var indexTotal = this.$module.querySelectorAll(".govuk-accordion__section").length;
        var showAllAttributesGa4 = { event_name: "select_content", type: "accordion", index: 0, index_total: indexTotal };
        showAll = this.$module.querySelector(this.showAllControls);
        showAll.setAttribute("data-ga4-event", JSON.stringify(showAllAttributesGa4));
      }
    }
    // Navigate to and open accordions with anchored content on page load if a hash is present
    openByAnchorOnLoad() {
      if (!window.location.hash)
        return;
      var splitHash = window.location.hash.split("#")[1];
      this.openForAnchor(splitHash);
    }
    // Add event listeners for links to open accordion sections when navigated to using said anchor links on the page
    // Adding an event listener to all anchor link a tags in an accordion is risky but we circumvent this risk partially by only being a layer of accordion behaviour instead of any sort of change to link behaviour
    addEventListenersForAnchors() {
      var links = this.$module.querySelectorAll(this.sectionInnerContentClass + ' a[href*="#"]');
      nodeListForEach(links, function(link) {
        if (link.pathname === window.location.pathname) {
          link.addEventListener("click", this.openForAnchor.bind(this, link.hash.split("#")[1]));
        }
      }.bind(this));
    }
    // Find the parent accordion section for the given id and open it
    openForAnchor(hash) {
      hash = hash.replace(":", "\\:");
      var target = this.$module.querySelector("#" + hash);
      if (!target)
        return;
      var $section = this.getContainingSection(target);
      var $header = $section.querySelector(this.sectionHeader);
      var $expanded = this.getContainingSection($section);
      var $parent = $header.parentElement;
      if ($expanded && !$parent.classList.contains(this.sectionExpandedClass)) {
        $header.click();
      }
    }
    // Loop through the given id's ancestors until the parent section class is found
    getContainingSection(target) {
      while (!target.classList.contains(this.sectionClass)) {
        target = target.parentElement;
      }
      return target;
    }
    filterLocale(key) {
      if (this.$module.actions.locale && this.$module.actions.locale.indexOf("{") !== -1) {
        var locales = JSON.parse(this.$module.actions.locale);
        return locales[key];
      } else if (this.$module.actions.locale) {
        return this.$module.actions.locale;
      }
    }
    // To track the Accordion's "Show all sections" / "Hide all sections" button click events and pass them to the GA event tracking
    addAccordionOpenAllTracking() {
      this.$module.querySelector(this.showAllControls).addEventListener("click", function(event) {
        var expanded = event.target.getAttribute("aria-expanded") === "true";
        var label = expanded ? "Show all sections" : "Hide all sections";
        var action = expanded ? "accordionOpened" : "accordionClosed";
        var options = { transport: "beacon", label };
        var extraOptions = event.target && event.target.getAttribute("data-track-options");
        if (extraOptions) {
          extraOptions = JSON.parse(extraOptions);
          for (var k in extraOptions)
            options[k] = extraOptions[k];
        }
        if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
          window.GOVUK.analytics.trackEvent("pageElementInteraction", action, options);
        }
      });
    }
    addEventListenerSections() {
      var sections = this.$module.querySelectorAll(this.sectionButton);
      nodeListForEach(sections, function(section) {
        section.addEventListener("click", this.addAccordionSectionTracking.bind(this, section));
      }.bind(this));
    }
    // If the Accordion's sections are opened on click, then pass them to the GA event tracking
    addAccordionSectionTracking(section) {
      var expanded = section.getAttribute("aria-expanded") === "false";
      var label = section.querySelector(this.headingText).textContent;
      var action = expanded ? "accordionOpened" : "accordionClosed";
      var options = { transport: "beacon", label };
      var extraOptions = section.parentElement && section.parentElement.getAttribute("data-track-options");
      if (extraOptions) {
        extraOptions = JSON.parse(extraOptions);
        for (var k in extraOptions)
          options[k] = extraOptions[k];
      }
      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        window.GOVUK.analytics.trackEvent("pageElementInteraction", action, options);
      }
    }
  };
  var accordion_default = GemAccordion;

  // app/assets/javascripts/govuk_publishing_components/modules/lets-try-to-use-modules.js
  console.log("HELLO");
  console.log(accordion_default);
  console.log("BYE");
})();
//# sourceMappingURL=assets/lets-try-to-use-modules.js.map
