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

  describe('initLegacy', function () {
    beforeEach(function () {
      setFixtures(
        '<div id="non-component-govspeak" class="govuk-govspeak">' +
          chartHtml +
        '</div>' +
        '<div id="component-govspeak" class="gem-c-govspeak govuk-govspeak">' +
          chartHtml +
        '</div>'
      )
    })

    it('creates charts in non-component govspeak elements', function () {
      GOVUK.GovspeakBarchartEnhancement.initLegacy()
      var $nonComponentGovspeak = $('#non-component-govspeak')
      expect($nonComponentGovspeak.find('.mc-chart').length).toBe(1)
    })

    it('doesn\'t create charts for component govspeak elements', function () {
      GOVUK.GovspeakBarchartEnhancement.initLegacy()
      var $componentGovspeak = $('#component-govspeak')
      expect($componentGovspeak.find('.mc-chart').length).toBe(0)
    })
  })
})
