/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Barchart enhancement', function () {
  var chartHtml = '<table class="js-barchart-table mc-auto-outdent">' +
                    '<tbody>' +
                      '<tr>' +
                        '<td>row 1</td><td>10</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td>row 2</td><td>15</td>' +
                      '</tr>' +
                    '</tbody>' +
                  '</table>'

  it('creates a barchart from a table', function () {
    var $element = $('<div>' + chartHtml + '</div>')

    var enhancement = new GOVUK.GovspeakBarchartEnhancement($element)
    enhancement.init()

    expect($element.find('.mc-chart').length).toBe(1)
  })

  it('marks a chart as initialised', function () {
    var $chart = $(chartHtml)
    var $element = $('<div />')
    $element.append($chart)

    var enhancement = new GOVUK.GovspeakBarchartEnhancement($element)
    enhancement.init()

    expect($chart.hasClass('js-barchart-table-init')).toBe(true)
  })

  it('doesn\'t create a chart if the chart is flagged as initialised', function () {
    var $chart = $(chartHtml)
    $chart.addClass('js-barchart-table-init')
    var $element = $('<div />')
    $element.append($chart)

    var enhancement = new GOVUK.GovspeakBarchartEnhancement($element)
    enhancement.init()

    expect($element.find('.mc-chart').length).toBe(0)
  })
})
