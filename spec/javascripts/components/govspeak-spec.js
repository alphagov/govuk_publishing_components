/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Govspeak', function () {
  var container

  afterEach(function () {
    document.body.removeChild(container)
  })

  describe('youtube enhancement', function () {
    beforeEach(function () {
      window.GOVUK.cookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
    })

    afterEach(function () {
      window.GOVUK.cookie('cookies_policy', null)
    })

    it('embeds youtube videos', function () {
      container = document.createElement('div')
      container.innerHTML =
        '<div class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('[data-module="govspeak"]')
      /* eslint-disable no-new */
      new GOVUK.Modules.Govspeak(element).init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(1)
    })

    it('allows disabling embeds of youtube videos', function () {
      container = document.createElement('div')
      container.innerHTML =
        '<div class="gem-c-govspeak govuk-govspeak disable-youtube" data-module="govspeak">' +
          '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('[data-module="govspeak"]')
      /* eslint-disable no-new */
      new GOVUK.Modules.Govspeak(element).init()

      expect(document.querySelectorAll('.gem-c-govspeak__youtube-video').length).toBe(0)
    })
  })

  describe('barchart enhancement', function () {
    it('embeds barcharts', function () {
      container = document.createElement('div')
      container.innerHTML =
        '<div id="govspeak-barchart" class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
          '<table class="js-barchart-table mc-auto-outdent">' +
            '<tbody>' +
              '<tr>' +
                '<td>row 1</td><td>10</td>' +
              '</tr>' +
            '</tbody>' +
          '</table>' +
        '<div>'
      document.body.appendChild(container)

      var element = document.querySelector('[data-module="govspeak"]')
      /* eslint-disable no-new */
      new GOVUK.Modules.Govspeak(element).init()

      expect(document.querySelectorAll('.mc-chart').length).toBe(1)
    })
  })
})
