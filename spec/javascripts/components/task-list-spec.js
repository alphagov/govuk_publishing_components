describe('A tasklist module', function () {
  "use strict";

  var $element;
  var tasklist;
  var html = '\
    <div data-module="gemtasklist" class="gem-c-task-list js-hidden">\
      <ol class="gem-c-task-list__groups">\
        <li class="gem-c-task-list__group">\
          <span class="gem-c-task-list__number">\
            <span class="visuallyhidden">Step </span>1\
          </span>\
          <div class="gem-c-task-list__step js-step" id="topic-step-one" data-track-count="tasklistStep">\
            <div class="gem-c-task-list__header js-toggle-panel" data-position="1.1">\
              <h2 class="gem-c-task-list__title js-step-title">Topic Step One</h2>\
            </div>\
            <div class="gem-c-task-list__panel js-panel" id="step-panel-10-0">\
              <ol class="gem-c-task-list__links" data-length="1">\
                <li class="gem-c-task-list__link js-list-item">\
                  <a href="/link1" class="gem-c-task-list__link-item js-link" data-position="1.1.1">Link 1</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
          <div class="gem-c-task-list__step js-step" id="topic-step-two" data-track-count="tasklistStep">\
            <div class="gem-c-task-list__header js-toggle-panel" data-position="1.2">\
              <h2 class="gem-c-task-list__title js-step-title">Topic Step Two</h2>\
            </div>\
            <div class="gem-c-task-list__panel js-panel" id="step-panel-11-1">\
              <ol class="gem-c-task-list__links" data-length="2">\
                <li class="gem-c-task-list__link gem-c-task-list__link--active js-list-item">\
                  <a href="/link2" class="gem-c-task-list__link-item js-link" data-position="1.2.1">Link 2</a>\
                </li>\
                <li class="gem-c-task-list__link js-list-item">\
                  <a href="/link3" class="gem-c-task-list__link-item js-link" data-position="1.2.2">Link 3</a>\
                </li>\
              </ol>\
              <div class="gem-c-task-list__help">\
                <a href="/learn#step-one" class="gem-c-task-list__help-link js-link" data-position="get-help">Get help</a>\
              </div>\
            </div>\
          </div>\
        </li>\
        <li class="gem-c-task-list__group gem-c-task-list__group--active">\
          <span class="gem-c-task-list__number">\
            <span class="visuallyhidden">Step </span>2\
          </span>\
          <div class="gem-c-task-list__step js-step" id="topic-step-one" data-track-count="tasklistStep">\
            <div class="gem-c-task-list__header js-toggle-panel" data-position="2.1">\
              <h2 class="gem-c-task-list__title js-step-title">Topic Step Three</h2>\
            </div>\
            <div class="gem-c-task-list__panel js-panel" id="step-panel-12-0">\
              <ol class="gem-c-task-list__links" data-length="5">\
                <li class="gem-c-task-list__link gem-c-task-list__link--active js-list-item">\
                  <a href="/link4" class="gem-c-task-list__link-item js-link" data-position="2.1.1">Link 4</a>\
                </li>\
                <li class="gem-c-task-list__link gem-c-task-list__link--active js-list-item">\
                  <a href="/link5" class="gem-c-task-list__link-item js-link" data-position="2.1.2">Link 5</a>\
                </li>\
                <li class="gem-c-task-list__link js-list-item">\
                  <a href="http://www.gov.uk" class="gem-c-task-list__link-item js-link" data-position="2.1.3" rel="external">Link 6</a>\
                </li>\
                <li class="gem-c-task-list__link gem-c-task-list__link--active js-list-item">\
                  <a href="#content" class="gem-c-task-list__link-item js-link" data-position="2.1.4">Link 7</a>\
                </li>\
                <li class="gem-c-task-list__link gem-c-task-list__link--active js-list-item">\
                  <a href="#content" class="gem-c-task-list__link-item js-link" data-position="2.1.5">Link 8</a>\
                </li>\
              </ol>\
            </div>\
          </div>\
        </li>\
      </ol>\
    </div>';

  var expectedTasklistStepCount = 0;
  var expectedTasklistContentCount = 0;
  var expectedTasklistLinkCount = 0;

  beforeEach(function () {
    tasklist = new GOVUK.Modules.Gemtasklist();
    $element = $(html);
    tasklist.start($element);
    expectedTasklistStepCount = $element.find('.gem-c-task-list__step').length;
    expectedTasklistContentCount = $element.find('.gem-c-task-list__step').first().find('.js-link').length;
    expectedTasklistLinkCount = $element.find('.gem-c-task-list__link-item').length;
  });

  afterEach(function () {
    $(document).off();
    location.hash = "#";
  });

  it("has a class of gem-c-task-list--active to indicate the js has loaded", function () {
    expect($element).toHaveClass("gem-c-task-list--active");
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
    expect($showHideAllButton).toHaveAttr('aria-controls', 'step-panel-10-0');
  });

  it("has no steps which have an shown state", function () {
    var shownSteps = $element.find('.step-is-shown').length;
    expect(shownSteps).toEqual(0);
  });

  it("inserts a button into each step to show/hide content", function () {
    var $titleButton = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');

    expect($titleButton).toHaveClass('gem-c-task-list__button--title');
    expect($titleButton).toHaveAttr('aria-expanded', 'false');
    expect($titleButton[0]).toHaveAttr('aria-controls', 'step-panel-10-0');
    expect($titleButton[1]).toHaveAttr('aria-controls', 'step-panel-11-1');
  });

  it("ensures all step content is hidden", function () {
    $element.find('.gem-c-task-list__step').each(function (index, $step) {
      expect($step).not.toHaveClass('step-is-shown');
    });
  });

  it("adds an show/hide to each step", function () {
    var $stepHeader = $element.find('.gem-c-task-list__header');
    expect($stepHeader).toContainElement('.gem-c-task-list__toggle-link');
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
      var stepCount = $element.find('.gem-c-task-list__step').length;
      expect($element.find('.step-is-shown').length).toEqual(stepCount);
    });

    it('adds an aria-expanded attribute to each step link', function () {
      var stepCount = $element.find('.gem-c-task-list__step').length;
      expect($element.find('.js-step-title-button[aria-expanded="true"]').length).toEqual(stepCount);
    });

    it('changes the Show/Hide all button text to "Hide all"', function () {
      expect($element.find('.js-step-controls-button')).toContainText("Hide all");
    });

    it("triggers a google analytics custom event", function () {
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllShown', {
        label: 'Show All: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
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

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllHidden', {
        label: 'Hide All: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
      });
    });
  });

  describe('Opening a step', function () {

    // When a step is open (testing: toggleStep, openStep)
    it("has a class of step-is-shown", function () {
      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      var $step = $element.find('.gem-c-task-list__step');
      $stepLink.click();
      expect($step).toHaveClass("step-is-shown");
    });

    // When a step is open (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is true", function () {
      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      $stepLink.click();
      expect($stepLink).toHaveAttr('aria-expanded', 'true');
    });

    it("triggers a google analytics custom event when clicking on the title", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistShown', {
        label: '1.1 - Topic Step One - Heading click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
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

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistShown', {
        label: '1.1 - Topic Step One - Plus click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.gem-c-task-list__header');
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistShown', {
        label: '1.1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  describe('Hiding a step', function () {

    // When a step is hidden (testing: toggleStep, hideStep)
    it("removes the step-is-shown class", function () {
      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      var $step = $element.find('.gem-c-task-list__step');
      $stepLink.click();
      expect($step).toHaveClass("step-is-shown");
      $stepLink.click();
      expect($step).not.toHaveClass("step-is-shown");
    });

    // When a step is hidden (testing: toggleState, setExpandedState)
    it("has a an aria-expanded attribute and the value is false", function () {
      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
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

      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      $stepLink.click();
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistHidden', {
        label: '1.1 - Topic Step One - Heading click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
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

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistHidden', {
        label: '1.1 - Topic Step One - Minus click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      tasklist.start($element);
      var $stepHeader = $element.find('.gem-c-task-list__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistHidden', {
        label: '1.1 - Topic Step One - Elsewhere click: Small',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });
  });

  describe('When linking to a topic step', function () {
    beforeEach(function () {
      spyOn(GOVUK, 'getCurrentLocation').and.returnValue({
        hash: '#topic-step-one'
      });

      // Restart tasklist after setting up mock location provider
      $element.attr('data-remember',true);
      tasklist.start($element);
    });

    it("opens the linked to topic step", function () {
      var $step = $element.find('#topic-step-one');
      expect($step).toHaveClass('step-is-shown');
    });

    it("leaves other steps hidden", function () {
      var $step = $element.find('#topic-step-two');
      expect($step).not.toHaveClass('step-is-shown');
    });
  });

  describe('When tracking a big task list', function () {
    beforeEach(function () {
      tasklist = new GOVUK.Modules.Gemtasklist();
      $element = $(html);
      $element.addClass('gem-c-task-list--large');
      tasklist.start($element);
    });

    it("triggers a google analytics custom event when clicking on the title on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistShown', {
        label: '1.1 - Topic Step One - Heading click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking on the icon on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistShown', {
        label: '1.1 - Topic Step One - Plus click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking in space in the header on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepHeader = $element.find('.gem-c-task-list__header');
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistShown', {
        label: '1.1 - Topic Step One - Elsewhere click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when hiding by clicking on the title on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepLink = $element.find('.gem-c-task-list__header .gem-c-task-list__button--title');
      $stepLink.click();
      $stepLink.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistHidden', {
        label: '1.1 - Topic Step One - Heading click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when hiding by clicking on the icon on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $stepIcon = $element.find('.js-toggle-link');
      $stepIcon.click();
      $stepIcon.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistHidden', {
        label: '1.1 - Topic Step One - Minus click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when hiding by clicking in space in the header on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      tasklist.start($element);
      var $stepHeader = $element.find('.gem-c-task-list__header');
      $stepHeader.click();
      $stepHeader.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistHidden', {
        label: '1.1 - Topic Step One - Elsewhere click: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking the 'Show all' button on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllShown', {
        label: 'Show All: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking the 'Hide all' button on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      clickShowHideAll();
      clickShowHideAll();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('pageElementInteraction', 'tasklistAllHidden', {
        label: 'Hide All: Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
      });
    });

    it("triggers a google analytics custom event when clicking a panel link on a big tasklist", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');
      $element.find('.js-link').first().click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('taskAccordionLinkClicked', '1.1.1', {
        label: '/link1 : Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString(),
        dimension28: expectedTasklistContentCount.toString()
      });
    });

    it("triggers a google analytics event when clicking a get more help with this step link", function () {
      GOVUK.analytics = {
        trackEvent: function () {
        }
      };
      spyOn(GOVUK.analytics, 'trackEvent');

      var $link = $element.find('.gem-c-task-list__help-link.js-link');
      $link.click();

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('taskAccordionLinkClicked', 'get-help', {
        label: '/learn#step-one : Big',
        dimension26: expectedTasklistStepCount.toString(),
        dimension27: expectedTasklistLinkCount.toString()
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

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('taskAccordionLinkClicked', '1.1.1', {
      label: '/link1 : Small',
      dimension26: expectedTasklistStepCount.toString(),
      dimension27: expectedTasklistLinkCount.toString(),
      dimension28: expectedTasklistContentCount.toString()
    });
  });

  it("triggers a google analytics event when clicking a get more help with this step link", function () {
    GOVUK.analytics = {
      trackEvent: function () {
      }
    };
    spyOn(GOVUK.analytics, 'trackEvent');

    var $link = $element.find('.gem-c-task-list__help-link.js-link');
    $link.click();

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('taskAccordionLinkClicked', 'get-help', {
      label: '/learn#step-one : Small',
      dimension26: expectedTasklistStepCount.toString(),
      dimension27: expectedTasklistLinkCount.toString()
    });
  });

  describe('in a double dot situation', function () {
    beforeEach(function () {
      tasklist = new GOVUK.Modules.Gemtasklist();
      $element = $(html);
      tasklist.start($element);
    });

    it("puts a clicked link in session storage", function () {
      $element.find('.js-link[data-position="2.1.2"]').click();
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe('2.1.2');
    });

    it("does not put an external clicked link in session storage", function () {
      $element.find('.js-link[data-position="2.1.3"]').click();
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe(null);
    });

    it("highlights the first active link in the first active group if no sessionStorage value is set", function () {
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe(null);
      expect($element.find('.js-link[data-position="2.1.1"]').closest('.js-list-item')).toHaveClass('gem-c-task-list__link--active');
      expect($element.find(('.gem-c-task-list__link--active')).length).toBe(1);
    });

    it("highlights a clicked #content link and removes other highlights", function () {
      expect($element.find(('.gem-c-task-list__link--active')).length).toBe(1);

      var $firstLink = $element.find('.js-link[data-position="2.1.4"]');
      $firstLink.click();
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe('2.1.4');
      expect($firstLink.closest('.js-list-item')).toHaveClass('gem-c-task-list__link--active');
      expect($element.find(('.gem-c-task-list__link--active')).length).toBe(1);

      var $secondLink = $element.find('.js-link[data-position="2.1.5"]');
      $secondLink.click();
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe('2.1.5');
      expect($secondLink.closest('.js-list-item')).toHaveClass('gem-c-task-list__link--active');
      expect($element.find(('.gem-c-task-list__link--active')).length).toBe(1);
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

      tasklist = new GOVUK.Modules.Gemtasklist();
      $element = $(html);
      sessionStorage.setItem('govuk-task-list-active-link', '2.1.5');
      tasklist.start($element);
    });

    afterEach(function () {
      sessionStorage.removeItem('govuk-task-list-active-link');
    });

    it("highlights only one link", function () {
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe('2.1.5');
      expect($element.find(('.gem-c-task-list__link--active')).length).toBe(1);
    });
  });

  describe('in a double dot situation where there is no active group', function () {
    beforeEach(function () {
      $element = $(html);
      $element.find('.gem-c-task-list__group').removeClass('gem-c-task-list__group--active');
      tasklist = new GOVUK.Modules.Gemtasklist();
      tasklist.start($element);
    });

    it("highlights the first active link if no sessionStorage value is set", function () {
      expect(sessionStorage.getItem('govuk-task-list-active-link')).toBe(null);
      expect($element.find('.js-link[data-position="1.2.1"]').closest('.js-list-item')).toHaveClass('gem-c-task-list__link--active');
      expect($element.find(('.gem-c-task-list__link--active')).length).toBe(1);
    });
  });

  function clickShowHideAll() {
    $element.find('.js-step-controls-button').click();
  }
});
