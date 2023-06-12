(() => {
  // app/assets/javascripts/govuk_publishing_components/modules/details.js
  var GemDetails = class {
    constructor($module) {
      this.$module = $module;
      this.$summary = this.$module.querySelector(".govuk-details__summary");
      this.customTrackLabel = this.$summary.getAttribute("data-track-label");
      this.detailsClick = this.$module.querySelector("[data-details-track-click]");
    }
    init() {
      if (this.customTrackLabel) {
        var trackDetails = new window.GOVUK.Modules.GemTrackClick(this.$summary);
        trackDetails.init();
      } else if (this.detailsClick) {
        this.detailsClick.addEventListener("click", function(event) {
          this.trackDefault(this.$summary);
        }.bind(this));
      }
    }
    trackDefault(element) {
      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        var componentStatus = this.$module.getAttribute("open") == null ? "open" : "closed";
        var trackCategory = element.getAttribute("data-track-category");
        var trackAction = element.getAttribute("data-track-action");
        var trackOptions = element.getAttribute("data-track-options");
        if (trackOptions) {
          trackOptions = JSON.parse(trackOptions);
        }
        if (typeof trackOptions !== "object" || trackOptions === null) {
          trackOptions = {};
        }
        trackOptions.label = componentStatus;
        if (trackAction && trackCategory) {
          window.GOVUK.analytics.trackEvent(trackCategory, trackAction, trackOptions);
        }
      }
    }
  };
  var details_default = GemDetails;
})();
//# sourceMappingURL=assets/details.js.map
