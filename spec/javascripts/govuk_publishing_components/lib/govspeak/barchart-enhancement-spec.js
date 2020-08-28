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
    var $element = document.createElement('div')
    $element.innerHTML = chartHtml

    var enhancement = new GOVUK.GovspeakBarchartEnhancement($element)
    enhancement.init()

    expect($element.querySelectorAll('.mc-chart').length).toBe(1)
  })

  it('marks a chart as initialised', function () {
    var $element = document.createElement('div')
    $element.innerHTML = chartHtml

    var enhancement = new GOVUK.GovspeakBarchartEnhancement($element)
    enhancement.init()

    var $chart = $element.querySelectorAll('.js-barchart-table')[0]
    expect($chart.classList.contains('js-barchart-table-init')).toBe(true)
  })

  it('doesn\'t create a chart if the chart is flagged as initialised', function () {
    var $element = document.createElement('div')
    $element.innerHTML = chartHtml
    var $chart = $element.querySelectorAll('.js-barchart-table')[0]
    $chart.classList.add('js-barchart-table-init')

    var enhancement = new GOVUK.GovspeakBarchartEnhancement($element)
    enhancement.init()

    expect($element.querySelectorAll('.mc-chart').length).toBe(0)
  })
})
