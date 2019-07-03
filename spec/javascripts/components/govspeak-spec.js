/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Govspeak component', function () {
  var govspeakModule = new GOVUK.Modules.Govspeak()

  it('embeds youtube videos', function () {
    var $element = $(
      '<div class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
        '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
      '<div>'
    )
    govspeakModule.start($element)
    expect($element.find('.media-player').length).toBe(1)
  })

  it('embeds barcharts', function () {
    var $element = $(
      '<div id="govspeak-barchart" class="gem-c-govspeak govuk-govspeak" data-module="govspeak">' +
        '<table class="js-barchart-table mc-auto-outdent">' +
          '<tbody>' +
            '<tr>' +
              '<td>row 1</td><td>10</td>' +
            '</tr>' +
          '</tbody>' +
        '</table>' +
      '<div>'
    )
    govspeakModule.start($element)
    expect($element.find('.mc-chart').length).toBe(1)
  })

  it('allows disabling embeds of youtube videos', function () {
    var $element = $(
      '<div class="gem-c-govspeak govuk-govspeak disable-youtube" data-module="govspeak">' +
        '<p><a href="https://www.youtube.com/watch?v=0XpAtr24uUQ">Agile at GDS</a></p>' +
      '<div>'
    )
    govspeakModule.start($element)
    expect($element.find('.media-player').length).toBe(0)
  })
})
