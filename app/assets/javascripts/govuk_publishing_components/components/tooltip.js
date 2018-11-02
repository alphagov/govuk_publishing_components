window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  window.GOVUK = window.GOVUK || {};

  Modules.Tooltip = function () {
    this.start = function (tooltip) {
        var initiator = $(tooltip).attr('data-initiator');
        var trigger = $(tooltip).attr('data-trigger');
        var hideOnBlur = $(tooltip).attr('data-hide-on-blur');
        var overlay = $(tooltip).find('#tooltip-overlay');
        var closeBtn = $(tooltip).find('.tooltip-close--button');
        var _this = this;

        if (initiator && trigger) {
            $(initiator).on(trigger, function(e){
                _this._initiator = $(e.target);
                _this.initiatorZIndex = _this._initiator.css('z-index');
                _this.show(tooltip, _this._initiator);
            });
            if (hideOnBlur == 'true') {
                $(initiator).on('blur mouseout', function(e){
                    _this.hide(tooltip, _this._initiator);
                });
            }

            $(overlay).on('click', function(e) {
                _this.hide(tooltip, _this._initiator);
            });

            $(closeBtn).on('click', function(e) {
                _this.hide(tooltip, _this._initiator);
            });
        }
    }

    this.setPosition = function(tooltip, initiator) {
        var _initiator = $(initiator);
        var _tooltipContent = $(tooltip).find('.tooltip-content');
        var initiatorPosition = _initiator.position();
        initiatorPosition.top += _initiator.outerHeight() + 10;
        if (initiatorPosition.left > ($(document).width() / 2) ) {
            initiatorPosition.left -= ( $(tooltip).width() / 2 ) + 20;
            _tooltipContent.addClass('right');
        } else {
            initiatorPosition.left += 5;
            _tooltipContent.removeClass('right');
        }
        $(tooltip).css(initiatorPosition);
    }

    this.show = function(tooltip, initiator) {
        this.setPosition(tooltip, initiator);
        $(tooltip).removeClass('gem-c-tooltip--hidden');

        var blur = $(tooltip).attr('data-blur-background');
        if (blur == "true") {
            $('#tooltip-overlay').addClass('gem-c-tooltip-background-blur');
            $(initiator).css('z-index', 40);
        }
    }

    this.hide = function(tooltip, initiator) {
        $(tooltip).addClass('gem-c-tooltip--hidden');
        $(tooltip).find('#tooltip-overlay').removeClass('gem-c-tooltip-background-blur');
        $(initiator).css('z-index', this.initiatorZIndex);
    }
  }
})(window.GOVUK.Modules);
