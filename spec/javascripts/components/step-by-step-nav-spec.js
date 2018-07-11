describe('A stepnav module', function () {
  "use strict";

  var $element;
  var stepnav;
  var html = '\
    <div data-module="gemstepnav" class="gem-c-step-nav js-hidden" data-id="unique-id" data-show-text="Show" data-hide-text="Hide" data-show-all-text="Show all" data-hide-all-text="Hide all">\
      <ol class="gem-c-step-nav__steps">\
        <li class="gem-c-step-nav__step js-step" id="topic-step-one" data-track-count="stepnavStep">\
          <div class="gem-c-step-nav__header js-toggle-panel" data-position="1">\
            <h2 class="gem-c-step-nav__title">\
              <div class="gem-c-step-nav__circle">\
                <span class="gem-c-step-nav__circle-inner">\
                  <span class="gem-c-step-nav__circle-background">\
                    <span class="visuallyhidden">Step</span> 1\
                  </span>\
                </span>\
              </div>\
              <span class="js-step-title">Topic Step One</span>\
            </h2>\
          </div>\
          <div class="gem-c-step-nav__panel js-panel" id="step-panel-topic-step-one-1">\
            <ol class="gem-c-step-nav__list" data-length="1">\
              <li class="gem-c-step-nav__list-item js-list-item">\
                <a href="/link1" class="gem-c-step-nav__link js-link" data-position="1.1">Link 1</a>\
              </li>\
            </ol>\
          </div>\
        </li>\
        <li class="gem-c-step-nav__step js-step" id="topic-step-two" data-track-count="stepnavStep">\
          <div class="gem-c-step-nav__header js-toggle-panel" data-position="2">\
            <h2 class="gem-c-step-nav__title">\
              <div class="gem-c-step-nav__circle">\
                <span class="gem-c-step-nav__circle-inner">\
                  <span class="gem-c-step-nav__circle-background">\
                    <span class="visuallyhidden">Step</span> 2\
                  </span>\
                </span>\
              </div>\
              <span class="js-step-title">Topic Step Two</span>\
            </h2>\
          </div>\
          <div class="gem-c-step-nav__panel js-panel" id="step-panel-topic-step-two-1">\
            <ol class="gem-c-step-nav__list" data-length="2">\
              <li class="gem-c-step-nav__list-item gem-c-step-nav__list-item--active js-list-item">\
                <a href="/link2" class="gem-c-step-nav__link js-link" data-position="2.1">Link 2</a>\
              </li>\
              <li class="gem-c-step-nav__list-item js-list-item">\
                <a href="/link3" class="gem-c-step-nav__link js-link" data-position="2.2">Link 3</a>\
              </li>\
            </ol>\
            <div class="gem-c-step-nav__help">\
              <a href="/learn#step-one" class="gem-c-step-nav__help-link js-link" data-position="get-help">Get help</a>\
            </div>\
          </div>\
        </li>\
        <li class="gem-c-step-nav__step gem-c-step-nav__step--active js-step" id="topic-step-three" data-track-count="stepnavStep" data-optional>\
          <div class="gem-c-step-nav__header js-toggle-panel" data-position="3">\
            <h2 class="gem-c-step-nav__title">\
              <div class="gem-c-step-nav__circle">\
                <span class="gem-c-step-nav__circle-inner">\
                  <span class="gem-c-step-nav__circle-background">\
                    <span class="visuallyhidden">Step</span> 3\
                  </span>\
                </span>\
              </div>\
              <span class="js-step-title">Topic Step Three</span>\
            </h2>\
          </div>\
          <div class="gem-c-step-nav__panel js-panel" id="step-panel-topic-step-three-1">\
            <ol class="gem-c-step-nav__list" data-length="5">\
              <li class="gem-c-step-nav__list-item gem-c-step-nav__list-item--active js-list-item">\
                <a href="/link4" class="gem-c-step-nav__link js-link" data-position="3.1">Link 4</a>\
              </li>\
              <li class="gem-c-step-nav__list-item gem-c-step-nav__list-item--active js-list-item">\
                <a href="/link5" class="gem-c-step-nav__link js-link" data-position="3.2">Link 5</a>\
              </li>\
              <li class="gem-c-step-nav__list-item js-list-item">\
                <a href="http://www.gov.uk" class="gem-c-step-nav__link js-link" data-position="3.3" rel="external">Link 6</a>\
              </li>\
              <li class="gem-c-step-nav__list-item gem-c-step-nav__list-item--active js-list-item">\
                <a href="#content" class="gem-c-step-nav__link js-link" data-position="3.4">Link 7</a>\
              </li>\
              <li class="gem-c-step-nav__list-item gem-c-step-nav__list-item--active js-list-item">\
                <a href="#content" class="gem-c-step-nav__link js-link" data-position="3.5">Link 8</a>\
              </li>\
            </ol>\
          </div>\
        </li>\
      </ol>\
    </div>';

  var expectedstepnavStepCount = 0;
  var expectedstepnavContentCount = 0;
  var expectedstepnavLinkCount = 0;

  beforeEach(function () {
    stepnav = new GOVUK.Modules.Gemstepnav();
    $element = $(html);
    stepnav.start($element);
    expectedstepnavStepCount = $element.find('.gem-c-step-nav__step').length;
    expectedstepnavContentCount = $element.find('.gem-c-step-nav__step').first().find('.js-link').length;
    expectedstepnavLinkCount = $element.find('.gem-c-step-nav__list-item').length;
  });

  afterEach(function () {
    $(document).off();
  });

  it("has a class of gem-c-step-nav--active to indicate the js has loaded", function () {
    expect($element).toHaveClass("gem-c-step-nav--active");
  });

  it("is not hidden", function () {
    expect($element).not.toHaveClass("js-hidden");
  });

  it("has an show/hide all button", function () {
    var $showHideAllButton = $element.find('.js-step-controls-button');

    expect($showHideAllButton).toExist();
    expect($showHideAllButton).toHaveText("Show all");
    // It has an aria-expanded false attribute as all steps are hidden
    expect($showHideAllButton).toHaveAttr("aria-expanded", "false");
    // It has an aria-controls attribute that includes all the step_content IDs
    expect($showHideAllButton).toHaveAttr('aria-controls', 'step-panel-topic-step-one-1');
  });

  it("has no steps which have an shown state", function () {
    var shownSteps = $element.find('.step-is-shown').length;
    expect(shownSteps).toEqual(0);
  });

  it("inserts a button into each step to show/hide content", function () {
    var $titleButton = $element.find('.js-step-title-button');

    expect($titleButton).toHaveClass('gem-c-step-nav__button--title');
    expect($titleButton).toHaveAttr('aria-expanded', 'false');
    expect($titleButton[0]).toHaveAttr('aria-controls', 'step-panel-topic-step-one-1');
    expect($titleButton[1]).toHaveAttr('aria-controls', 'step-panel-topic-step-two-1');
  });

  it("ensures all step content is hidden", function () {
    $element.find('.gem-c-step-nav__step').each(function (index, $step) {
      expect($step).not.toHaveClass('step-is-shown');
    });
  });

  it("adds an show/hide to each step", function () {
    var $stepHeader = $element.find('.gem-c-step-nav__header');
    expect($stepHeader).toContainElement('.gem-c-step-nav__toggle-link');
  });

  describe('Clicking the "Show all" button', function () {
    beforeEach(function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      clickShowHideAll();
    });

    it('adds a .step-is-shown class to each step to hide the icon', function () {
      var stepCount = $element.find('.gem-c-step-nav__step').length;
      expect($element.find('.step-is-shown').length).toEqual(stepCount);
    });

    it('adds an aria-expanded attribute to each step link', function () {
      var stepCount = $element.find('.gem-c-step-nav__step').length;
      expect($element.find('.js-step-title-button[aria-expanded="true"]').length).toEqual(stepCount);
    });

    it('changes the Show/Hide all button text to "Hide all"', function () {
      expect($element.find('.js-step-controls-button')).toContainText("Hide all");
    });

    it("triggers a google analytics custom event", function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavAllShown', {
        label: 'Show all: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: "unique-id"
      });
    });
  });

  describe('Clicking the "Hide all" button', function () {
    it("triggers a google analytics custom event", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      clickShowHideAll();
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavAllHidden', {
        label: 'Hide all: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: "unique-id"
      });
    });
  });

  describe('Opening a step', function () {
    // When a step is open (testing: toggleStep, openStep)
    it("has a class of step-is-shown", function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title');
      var $step = $element.find('.gem-c-step-nav__step');
      $stepLink.click();
      expect($step).toHaveClass("step-is-shown");
    });

    // When a step is open (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is true", function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'true');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-step-nav__header .js-step-title-text');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Heading click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking on the icon", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Plus click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.gem-c-step-nav__header');
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });
  });

  describe('Hiding a step', function () {
    // When a step is hidden (testing: toggleStep, hideStep)
    it("removes the step-is-shown class", function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title');
      var $step = $element.find('.gem-c-step-nav__step');
      $stepLink.click();
      expect($step).toHaveClass("step-is-shown");
      $stepLink.click();
      expect($step).not.toHaveClass("step-is-shown");
    });

    // When a step is hidden (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is false", function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .gem-c-step-nav__button--title');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'true');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'false');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-step-nav__header .js-step-title-text');
      $stepLink.click(); // show
      $stepLink.click(); // hide

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Heading click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking on the icon", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Minus click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.gem-c-step-nav__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });
  });

  describe('when the option to remember which steps are open is on', function () {
    beforeEach(function () {
      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      $element.attr('data-remember',true);
      $element.addClass('gem-c-step-nav--large');
      stepnav.start($element);
    });

    afterEach(function () {
      sessionStorage.removeItem('unique-id');
    });

    it("remembers individually opened steps", function () {
      var $stepLink1 = $element.find('#topic-step-one .js-toggle-panel');
      var $stepLink2 = $element.find('#topic-step-two .js-toggle-panel');

      $stepLink1.click(); // open
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-one"]');

      $stepLink2.click(); // open
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two"]');

      $stepLink1.click(); // close
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-two"]');

      $stepLink2.click(); // close
      expect(sessionStorage.getItem('unique-id')).toBe('[]');
    });

    it("remembers opened and closed steps using show/hide all", function () {
      var $showHideAllButton = $element.find('.js-step-controls-button');
      var $stepLink2 = $element.find('#topic-step-two .js-toggle-panel');

      $showHideAllButton.click(); // show all
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]');

      $stepLink2.click(); // close
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-three"]');

      $showHideAllButton.click(); // show all
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]');

      $showHideAllButton.click(); // hide all
      expect(sessionStorage.getItem('unique-id')).toBe(null); // 'hide all' removes the session data entirely
    });
  });

  describe('when open steps have been remembered', function () {
    beforeEach(function () {
      var store = {};

      spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
        return store[key];
      });
      spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(sessionStorage, 'removeItem').and.callFake(function () {
        store = {};
      });

      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      $element.attr('data-remember',true);
      $element.addClass('gem-c-step-nav--large');
      sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-three"]');
      stepnav.start($element);
    });

    afterEach(function () {
      sessionStorage.removeItem('unique-id');
    });

    it("opens the steps it has remembered", function () {
      var $step1 = $element.find('#topic-step-one');
      expect($step1).toHaveClass('step-is-shown');
      expect($step1.find('.js-panel')).not.toHaveClass('js-hidden');

      var $step3 = $element.find('#topic-step-three');
      expect($step3).toHaveClass('step-is-shown');
      expect($step3.find('.js-panel')).not.toHaveClass('js-hidden');
    });

    it("leaves the other steps hidden", function () {
      var $step2 = $element.find('#topic-step-two');
      expect($step2).not.toHaveClass('step-is-shown');
    });

    it("sets the show/hide link text to 'hide'", function () {
      var $step1 = $element.find('#topic-step-one');
      expect($step1.find('.js-toggle-link')).toHaveText("Hide");
    });

    it("sets the show all/hide all button text correctly", function () {
      var $showHideAllButton = $element.find('.js-step-controls-button');
      expect($showHideAllButton).toHaveText("Show all");
    });
  });

  describe('when all steps have been opened and remembered', function () {
    beforeEach(function () {
      var store = {};

      spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
        return store[key];
      });
      spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(sessionStorage, 'removeItem').and.callFake(function () {
        store = {};
      });

      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      $element.attr('data-remember',true);
      $element.addClass('gem-c-step-nav--large');
      sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-two","topic-step-three"]');
      stepnav.start($element);
    });

    afterEach(function () {
      sessionStorage.removeItem('unique-id');
    });

    it("sets the show all/hide all button text correctly", function () {
      var $showHideAllButton = $element.find('.js-step-controls-button');
      expect($showHideAllButton).toHaveText("Hide all");
    });
  });

  describe('when the remember open steps option is applied to a small step nav', function() {
    beforeEach(function () {
      var store = {};

      spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
        return store[key];
      });
      spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(sessionStorage, 'removeItem').and.callFake(function () {
        store = {};
      });

      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      $element.attr('data-remember',true);
      sessionStorage.setItem('unique-id', '["topic-step-one","topic-step-two","topic-step-three"]');
      stepnav.start($element);
    });

    afterEach(function () {
      sessionStorage.removeItem('unique-id');
    });

    it("doesn't do anything", function () {
      var $step1 = $element.find('#topic-step-one');
      var $step2 = $element.find('#topic-step-two');
      var $step3 = $element.find('#topic-step-three');

      expect($step1).not.toHaveClass('step-is-shown');
      expect($step2).not.toHaveClass('step-is-shown');
      expect($step3).not.toHaveClass('step-is-shown');

      $step1.click();
      expect(sessionStorage.getItem('unique-id')).toBe('["topic-step-one","topic-step-two","topic-step-three"]'); // i.e. unchanged
    });
  });

  describe('When tracking a big step nav', function () {
    beforeEach(function () {
      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      $element.addClass('gem-c-step-nav--large');
      stepnav.start($element);
    });

    it("triggers a google analytics custom event when clicking on the title on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-step-nav__header .js-step-title-text');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Heading click: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking on the icon on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Plus click: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.gem-c-step-nav__header').first();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Elsewhere click: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when hiding by clicking on the title on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-step-nav__header .js-step-title-text');
      $stepLink.click();
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Heading click: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when hiding by clicking on the icon on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Minus click: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when hiding by clicking in space in the header on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.gem-c-step-nav__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Elsewhere click: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking the 'Show all' button on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavAllShown', {
        label: 'Show all: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking the 'Hide all' button on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      clickShowHideAll();
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavAllHidden', {
        label: 'Hide all: Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics custom event when clicking a panel link on a big stepnav", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      $element.find('.js-link').first().click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('stepNavLinkClicked', '1.1', {
        label: '/link1 : Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: "unique-id"
      });
    });

    it("triggers a google analytics event when clicking a get more help with this step link", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $link = $element.find('.gem-c-step-nav__help-link.js-link');
      $link.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('stepNavLinkClicked', 'get-help', {
        label: '/learn#step-one : Big',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: "unique-id"
      });
    });
  });

  it("triggers a google analytics event when clicking a panel link", function () {
    GOVUK.analytics = {
      trackEvent: function () {
      }
    };
    spyOn(GOVUK.analytics, 'trackEvent');

    var $panelLink = $element.find('.js-link').first();
    $panelLink.click();

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('stepNavLinkClicked', '1.1', {
      label: '/link1 : Small',
      dimension26: expectedstepnavStepCount.toString(),
      dimension27: expectedstepnavLinkCount.toString(),
      dimension28: expectedstepnavContentCount.toString(),
      dimension96: "unique-id"
    });
  });

  it("triggers a google analytics event when clicking a get more help with this step link", function () {
    GOVUK.analytics = {
      trackEvent: function () {
      }
    };
    spyOn(GOVUK.analytics, 'trackEvent');

    var $link = $element.find('.gem-c-step-nav__help-link.js-link');
    $link.click();

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('stepNavLinkClicked', 'get-help', {
      label: '/learn#step-one : Small',
      dimension26: expectedstepnavStepCount.toString(),
      dimension27: expectedstepnavLinkCount.toString(),
      dimension96: "unique-id"
    });
  });

  it("triggers a google analytics event when clicking to show an optional step", function () {
    GOVUK.analytics = {
      trackEvent: function () {
      }
    };
    spyOn(GOVUK.analytics, 'trackEvent');

    var $stepHeader = $element.find('.js-step:nth-child(3) .gem-c-step-nav__header');
    $stepHeader.click();

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
      label: '3 - Topic Step Three - Elsewhere click: Small ; optional',
      dimension26: '3',
      dimension27: '8',
      dimension28: '5',
      dimension96: 'unique-id'
    });
  });

  describe('in a double dot situation', function () {
    beforeEach(function () {
      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      stepnav.start($element);
    });

    it("puts a clicked link in session storage", function () {
      $element.find('.js-link[data-position="3.1"]').click();
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe('3.1');
    });

    it("does not put an external clicked link in session storage", function () {
      $element.find('.js-link[data-position="3.3"]').click();
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe(null);
    });

    it("highlights the first active link in the first active step if no sessionStorage value is set", function () {
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe(null);
      expect($element.find('.js-link[data-position="3.1"]').closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active');
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1);
    });

    it("highlights a clicked #content link and removes other highlights", function () {
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1);

      var $firstLink = $element.find('.js-link[data-position="3.4"]');
      $firstLink.click();
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe('3.4');
      expect($firstLink.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active');
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1);

      var $secondLink = $element.find('.js-link[data-position="3.5"]');
      $secondLink.click();
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe('3.5');
      expect($secondLink.closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active');
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1);
    });
  });

  describe('in a double dot situation where a clicked link is already stored on page load', function() {
    beforeEach(function () {
      var store = {};

      spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
        return store[key];
      });
      spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(sessionStorage, 'clear').and.callFake(function () {
        store = {};
      });

      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      sessionStorage.setItem('govuk-step-nav-active-link', '3.5');
      stepnav.start($element);
    });

    afterEach(function () {
      sessionStorage.removeItem('govuk-step-nav-active-link');
    });

    it("highlights only one link", function () {
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe('3.5');
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1);
    });
  });

  describe('in a double dot situation where there is no active step', function () {
    beforeEach(function () {
      $element = $(html);
      $element.find('.gem-c-step-nav__step').removeClass('gem-c-step-nav__step--active');
      stepnav = new GOVUK.Modules.Gemstepnav();
      stepnav.start($element);
    });

    it("highlights the first active link if no sessionStorage value is set", function () {
      expect(sessionStorage.getItem('govuk-step-nav-active-link')).toBe(null);
      expect($element.find('.js-link[data-position="2.1"]').closest('.js-list-item')).toHaveClass('gem-c-step-nav__list-item--active');
      expect($element.find(('.gem-c-step-nav__list-item--active')).length).toBe(1);
    });
  });

  describe('if no unique id is set', function () {
    beforeEach(function () {
      stepnav = new GOVUK.Modules.Gemstepnav();
      $element = $(html);
      $element.removeAttr('data-id');
      stepnav.start($element);
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
    });

    it("triggers a google analytics custom event on show all", function () {
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavAllShown', {
        label: 'Show all: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on hide all", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      clickShowHideAll();
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavAllHidden', {
        label: 'Hide all: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on step show when clicking on the title", function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .js-step-title-text');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Heading click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on step show when clicking on the icon", function () {
      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Plus click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on step show when clicking on space in the header", function () {
      var $stepHeader = $element.find('.gem-c-step-nav__header');
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavShown', {
        label: '1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on step hide when clicking on the title", function () {
      var $stepLink = $element.find('.gem-c-step-nav__header .js-step-title-text');
      $stepLink.click();
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Heading click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on step hide when clicking on the icon", function () {
      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Minus click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event on step hide when clicking on space in the header", function () {
      var $stepHeader = $element.find('.gem-c-step-nav__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'stepNavHidden', {
        label: '1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event when clicking on a panel link", function () {
      $element.find('.js-link').first().click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('stepNavLinkClicked', '1.1', {
        label: '/link1 : Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension28: expectedstepnavContentCount.toString(),
        dimension96: false
      });
    });

    it("triggers a google analytics custom event when clicking on a get help link", function () {
      var $link = $element.find('.gem-c-step-nav__help-link.js-link');
      $link.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('stepNavLinkClicked', 'get-help', {
        label: '/learn#step-one : Small',
        dimension26: expectedstepnavStepCount.toString(),
        dimension27: expectedstepnavLinkCount.toString(),
        dimension96: false
      });
    });
  });

  function clickShowHideAll() {
    $element.find('.js-step-controls-button').click();
  }
});
