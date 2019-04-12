describe('An expander module', function () {
  "use strict";

  var $element;
  var expander;
  var html = '\
    <div class="gem-c-expander" data-module="expander">\
      <div class="gem-c-expander__title js-toggle">\
        Organisation\
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="gem-c-expander__icon gem-c-expander__icon--up"><path d="m798.16 609.84l-256-256c-16.683-16.683-43.691-16.683-60.331 0l-256 256c-16.683 16.683-16.683 43.691 0 60.331s43.691 16.683 60.331 0l225.84-225.84 225.84 225.84c16.683 16.683 43.691 16.683 60.331 0s16.683-43.691 0-60.331z"/></svg>\
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="gem-c-expander__icon gem-c-expander__icon--down"><path d="m225.84 414.16l256 256c16.683 16.683 43.691 16.683 60.331 0l256-256c16.683-16.683 16.683-43.691 0-60.331s-43.691-16.683-60.331 0l-225.84 225.84-225.84-225.84c-16.683-16.683-43.691-16.683-60.331 0s-16.683 43.691 0 60.331z"/></svg>\
      </div>\
      <div class="gem-c-expander__content js-content" id="expander-content-2386afad">\
        This is some content that could appear inside this component. Its not very interesting or complicated but its still here, and thats fine.\
      </div>\
    </div>';

  describe("a normal expander", function () {
    beforeEach(function () {
      expander = new GOVUK.Modules.Expander();
      $element = $(html);
      expander.start($element);
    });

    afterEach(function () {
      $(document).off();
    });

    it("collapses the content on page load", function () {
      expect($element.find('.gem-c-expander__content').css('display')).toBe('none');
    });

    it("replaces the title with a button and sets correct aria attributes", function () {
      expect($element.find('.gem-c-expander__button').text().trim()).toBe('Organisation');
      expect($element.find('.gem-c-expander__icon').length).toBe(2);
      expect($element.find('.gem-c-expander__button .gem-c-expander__icon').length).toBe(2);
      expect($element.find('.gem-c-expander__button').attr('type')).toBe('button');
      expect($element.find('.gem-c-expander__button').attr('aria-expanded')).toBe('false');
      expect($element.find('.gem-c-expander__button').attr('aria-controls')).toBe('expander-content-2386afad');
    });

    it("toggles the content when the button is clicked and updates aria attributes accordingly", function () {
      var $button = $element.find('.gem-c-expander__button');

      $button.click();
      expect($element.find('.gem-c-expander__content').css('display')).toBe('block');
      expect($element.find('.gem-c-expander__button').attr('aria-expanded')).toBe('true');

      $button.click();
      expect($element.find('.gem-c-expander__content').css('display')).toBe('none');
      expect($element.find('.gem-c-expander__button').attr('aria-expanded')).toBe('false');
    });
  });

  describe("an expander set to open on load", function () {
    beforeEach(function () {
      expander = new GOVUK.Modules.Expander();
      $element = $(html);
      $element.attr('data-open-on-load', true)
      expander.start($element);
    });

    afterEach(function () {
      $(document).off();
    });

    it("does not collapse the content on page load", function () {
      expect($element.find('.gem-c-expander__content').css('display')).not.toBe('none');
    });

    it("sets correct aria attributes on the button", function () {
      expect($element.find('.gem-c-expander__button').attr('aria-expanded')).toBe('true');
    });
  });
});
