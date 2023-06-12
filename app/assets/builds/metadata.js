(() => {
  // app/assets/javascripts/govuk_publishing_components/modules/metadata.js
  var Metadata = class {
    constructor($module) {
      this.$module = $module;
    }
    init() {
      var seeAllUpdates = this.$module.querySelector(".js-see-all-updates-link");
      if (seeAllUpdates) {
        var target = document.querySelector(seeAllUpdates.getAttribute("href"));
        if (target) {
          seeAllUpdates.addEventListener("click", function() {
            var targetToggleTrigger = target.querySelector("[aria-expanded]");
            if (targetToggleTrigger && targetToggleTrigger.getAttribute("aria-expanded") !== "true") {
              targetToggleTrigger.click();
            }
          });
        }
      }
    }
  };
  var metadata_default = Metadata;
})();
//# sourceMappingURL=assets/metadata.js.map
