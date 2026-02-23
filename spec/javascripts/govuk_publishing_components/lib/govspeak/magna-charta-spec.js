/* eslint-env jasmine */
/* global GOVUK */

describe('Magna charta', function () {
  'use strict'

  var element
  var magna
  var graphContainer
  var graph
  var table
  var toggle

  // widths are 65/max * val (65 by default)
  var cW = function (max, val, padding) {
    padding = padding || 0
    var result = ((65 / max) * val + padding).toString()
    // truncate the result to only 4 digits after the decimal place
    // e.g. 27.0833333333 becomes 27.0833, 27.1 and 27 remain the same
    var split = result.split('.')
    if (split.length > 1) {
      result = split[0] + '.' + split[1].substring(0, 4)
    }
    return result + '%'
  }

  var single =
    '<table id="single" class="some-table no-key mc-outdented">' +
      '<caption>Single Table</caption>' +
      '<thead>' +
        '<tr><th>Some Data</th><th>Values</th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><td>Testing One</td><td>5</td></tr>' +
        '<tr><td>Testing Two</td><td>4</td></tr>' +
        '<tr><td>Testing Three</td><td>3</td></tr>' +
      '</tbody>' +
    '</table>'

  var multiple =
    '<table id="multiple" class="mc-stacked">' +
      '<caption>Multiple Table</caption>' +
      '<thead>' +
        '<tr><th>Some Data</th><th>YES</th><th>NO</th><th>Total</th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><td>Testing One</td><td>5</td><td>6</td><td>11</td></tr>' +
        '<tr><td>Testing Two</td><td>6</td><td>2</td><td>8</td></tr>' +
        '<tr><td>Testing Three</td><td>3</td><td>9</td><td>12</td></tr>' +
      '</tbody>' +
    '</table>'

  var multiple2 =
    '<table id="multiple2" class="">' +
      '<caption>Multiple Table</caption>' +
      '<thead>' +
        '<tr><th>Some Data</th><th>YES</th><th>NO</th><th>MAYBE</th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><td>Testing One</td><td>5</td><td>6</td><td>11</td></tr>' +
        '<tr><td>Testing Two</td><td>6</td><td>2</td><td>8</td></tr>' +
        '<tr><td>Testing Three</td><td>3</td><td>9</td><td>12</td></tr>' +
      '</tbody>' +
    '</table>'

  var multiple3 =
    '<table id="multiple3" class="">' +
      '<caption>Multiple Table</caption>' +
      '<thead>' +
        '<tr><th>Some Data</th><th>YES</th><th>NO</th><th>MAYBE</th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><th>Testing One</th><td>5</td><td>6</td><td>11</td></tr>' +
        '<tr><th>Testing Two</th><td>6</td><td>2</td><td>8</td></tr>' +
        '<tr><th>Testing Three</th><td>3</td><td>9</td><td>12</td></tr>' +
      '</tbody>' +
    '</table>'

  var negative =
    '<table id="negative" class="mc-negative">' +
      '<thead>' +
        '<tr><th>Some Data</th><th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><td>Something Negative</td><td>-5</td></tr>' +
        '<tr><td>Something Positive</td><td>10</td></tr>' +
        '<tr><td>Something More Negative</td><td>-10</td></tr>' +
        '<tr><td>Something Less Positive</td><td>5</td></tr>' +
      '</tbody>' +
    '</table>'

  var negative2 =
    '<table id="negative2" class="mc-negative">' +
      '<thead>' +
        '<tr><th>Some Data</th><th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><td>Something Negative</td><td>-5</td></tr>' +
        '<tr><td>Something Positive</td><td>10</td></tr>' +
        '<tr><td>Something More Negative</td><td>-10</td></tr>' +
        '<tr><td>Something Less Positive</td><td>5</td></tr>' +
      '</tbody>' +
    '</table>'

  var outdentAll =
    '<table id="outdent-all" class="mc-outdented">' +
      '<thead>' +
        '<tr><th>Some Data</th><th></tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr><td>Something Negative</td><td>-5</td></tr>' +
        '<tr><td>Something Positive</td><td>10</td></tr>' +
        '<tr><td>Something More Negative</td><td>-10</td></tr>' +
        '<tr><td>Something Less Positive</td><td>5</td></tr>' +
      '</tbody>' +
    '</table>'

  var noHeader =
    '<table id="noHeader" class="mc-stacked">' +
      '<caption>No Table Header</caption>' +
      '<tbody>' +
        '<tr><td>Testing One</td><td>5</td><td>6</td><td>11</td></tr>' +
        '<tr><td>Testing Two</td><td>6</td><td>2</td><td>8</td></tr>' +
        '<tr><td>Testing Three</td><td>3</td><td>9</td><td>12</td></tr>' +
      '</tbody>' +
    '</table>'

  describe('creating a graph of a single table', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = single
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#single'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      graphContainer = element.querySelector('.mc-chart-container')
      table = element.querySelector('table')
      toggle = element.querySelector('.mc-toggle-button')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('creates a new div containing the chart', function () {
      expect(graph).not.toBeNull()
    })

    it('the new chart copies over any other classes', function () {
      expect(graph).toHaveClass('no-key')
    })

    it('running toggle switches between chart and table', function () {
      toggle.click()
      expect(table).not.toHaveClass('mc-hidden')
      expect(graphContainer).toHaveClass('mc-hidden')

      // toggle it back
      toggle.click()
      expect(table).toHaveClass('mc-hidden')
      expect(graphContainer).not.toHaveClass('mc-hidden')
    })

    it('new chart div contains all table bits as divs', function () {
      expect(graph.querySelectorAll('.mc-thead').length).toBe(1)
      expect(graph.querySelectorAll('.mc-tr').length).toBe(4)
      expect(graph.querySelectorAll('.mc-th').length).toBe(2)
      expect(graph.querySelectorAll('.mc-td').length).toBe(6)
    })

    it('new chart divs contain the right values', function () {
      var cells = graph.querySelectorAll('.mc-td')
      expect(cells[0].innerText).toBe('Testing One')
      expect(cells[1].innerText).toBe('5')
      expect(graph.querySelectorAll('.mc-th')[0].innerText).toBe('Some Data')
    })

    it('figures out the maximum graph value', function () {
      var test = magna.dimensions
      expect(test.max).toBe(parseFloat(5, 10))
      expect(test.single).toBe(parseFloat(65 / 5, 10))
    })

    it('divs that are bars or keys are given correct classes', function () {
      expect(graph.querySelectorAll('.mc-key-cell').length).toBe(3)
      expect(graph.querySelectorAll('.mc-bar-cell').length).toBe(3)
    })

    it('bar cells have their values wrapped in a span tag', function () {
      expect(graph.querySelectorAll('.mc-bar-cell span').length).toBe(3)
    })

    it('bars are given the correct width', function () {
      var bars = graph.querySelectorAll('.mc-bar-cell')
      expect(bars[0].style.width).toBe(cW(5, 5))
      expect(bars[1].style.width).toBe(cW(5, 4))
      expect(bars[2].style.width).toBe(cW(5, 3))
    })

    it('new chart is inserted into DOM after table', function () {
      var chartContainer = table.nextElementSibling
      expect(chartContainer).toHaveClass('mc-chart-container')
      expect(chartContainer.firstChild).toHaveClass('mc-chart')
    })

    it('bars are given classes to track what number they are', function () {
      graph.querySelectorAll('.mc-bar-cell').forEach((item) => {
        expect(item).toHaveClass('mc-bar-1')
      })
    })
  })

  describe('creating a graph of a multiple table', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = multiple2
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#multiple2'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('the graph of a multiple table is given a class', function () {
      expect(graph).toHaveClass('mc-multiple')
      expect(magna.options.multiple).toBe(true)
    })
  })

  describe('creating a graph of a multiple table with row headings', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = multiple3
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#multiple3'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('the graph of a multiple table is given a class', function () {
      expect(graph).toHaveClass('mc-multiple')
      expect(magna.options.multiple).toBe(true)
    })
  })

  describe('creating a graph of a stacked table', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = multiple
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#multiple'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('having the class of mc-stacked sets stacked to true', function () {
      expect(magna.options.stacked).toBe(true)
    })

    it('the cells that become bars are given the right classes', function () {
      expect(graph.querySelectorAll('.mc-bar-cell').length).toBe(6) // bar cells
      expect(graph.querySelectorAll('.mc-key-cell').length).toBe(3) // key cells
      expect(graph.querySelectorAll('.mc-stacked-total').length).toBe(3) // total cells
    })

    it('header cells get the right values', function () {
      var head = graph.querySelector('.mc-thead')
      expect(head.querySelectorAll('.mc-stacked-header').length).toBe(1)
      expect(head.querySelectorAll('.mc-th')[1]).toHaveClass('mc-key-1')
      expect(head.querySelectorAll('.mc-key-header').length).toBe(2)
    })

    it('the bar cells are given the right widths', function () {
      var cells = graph.querySelectorAll('.mc-bar-cell')
      expect(cells[0].style.width).toEqual(cW(12, 5))
      expect(cells[1].style.width).toEqual(cW(12, 6))
      expect(cells[2].style.width).toEqual(cW(12, 6))
      expect(cells[3].style.width).toEqual(cW(12, 2))
      expect(cells[4].style.width).toEqual(cW(12, 3))
      expect(cells[5].style.width).toEqual(cW(12, 9))
    })

    it('the bar cells are given classes denoting their index', function () {
      var rows = graph.querySelectorAll('.mc-tbody .mc-tr')
      rows.forEach((row) => {
        var cells = row.querySelectorAll('.mc-bar-cell')
        cells.forEach((cell, i) => {
          expect(cell).toHaveClass('mc-bar-' + (i + 1))
        })
      })
    })

    it('calulateMaxWidth returns object with right max value in', function () {
      var test = magna.calculateMaxWidth()
      expect(test.max).toEqual(parseFloat(12, 10))
      expect(test.single).toEqual(parseFloat(65 / 12, 10))
    })
  })

  describe('test applyOnInit', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = negative2
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#negative2'), {
        applyOnInit: false,
        returnReference: true
      })
      magna.init()
      graph = element.querySelector('.mc-chart')
      graphContainer = element.querySelector('.mc-chart-container')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('doesnt show the chart initially', function () {
      expect(table).not.toHaveClass('mc-hidden')
      expect(graphContainer).toHaveClass('mc-hidden')
    })

    it('graph is shown when toggle is called', function () {
      element.querySelector('.mc-toggle-button').click()
      expect(table).toHaveClass('mc-hidden')
      expect(graphContainer).not.toHaveClass('mc-hidden')
    })
  })

  describe('test negative', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = negative
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#negative'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('class mc-negative sets negative option to true', function () {
      expect(magna.options.negative).toBe(true)
    })

    it('cells are given positive and negative classes', function () {
      expect(graph.querySelectorAll('.mc-bar-negative').length).toBe(2)
      expect(graph.querySelectorAll('.mc-bar-positive').length).toBe(2)
    })

    it('cells are given the right width', function () {
      var cells = graph.querySelectorAll('.mc-bar-cell')
      expect(cells[0].style.width).toEqual(cW(10, 5))
      expect(cells[1].style.width).toEqual(cW(10, 10))
      expect(cells[2].style.width).toEqual(cW(10, 10))
      expect(cells[3].style.width).toEqual(cW(10, 5))
    })

    it('positive cells are given a left margin to align them with negative cells', function () {
      var cells = graph.querySelectorAll('.mc-bar-positive')
      expect(cells[0].style.marginLeft).toEqual(cW(10, 10))
    })

    it('calculateMaxWidth() returns extra info on negative chart', function () {
      var test = magna.calculateMaxWidth()
      // Gives back extra info for the negative charts
      expect(test.max).toEqual(parseFloat(10, 10))
      expect(test.single).toEqual(parseFloat(65 / 10, 10))
      expect(test.marginLeft).toEqual(parseFloat(10, 10) * parseFloat(65 / 10, 10))
      expect(test.maxNegative).toEqual(parseFloat(10, 10))
    })
  })

  describe('test outdent all', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = outdentAll
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#outdent-all'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('all cell values are pushed left', function () {
      graph.querySelectorAll('.mc-bar-cell span').forEach((item) => {
        expect(item.style.marginLeft).toBe('100%')
      })
    })
  })

  describe('creating a graph of a table missing header elements', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = noHeader
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#noHeader'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('marks a chart as not enabled and does not create a chart', function () {
      expect(magna.ENABLED).toBe(false)
      expect(graph).toBeNull()
    })
  })

  describe('test utils', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('id', 'test-magna-charta')
      element.innerHTML = single
      document.body.appendChild(element)
      magna = new GOVUK.Modules.MagnaCharta(element.querySelector('#single'), { returnReference: true })
      magna.init()
      graph = element.querySelector('.mc-chart')
      table = element.querySelector('table')
    })

    afterEach(function () {
      var testMagnaCharta = document.querySelector('#test-magna-charta')
      testMagnaCharta.remove()
    })

    it('utils.isFloat', function () {
      expect(magna.utils.isFloat(4.56)).toBe(true) // 4.56 is a float
      expect(magna.utils.isFloat(7)).toBe(true) // 7 is a float
      expect(magna.utils.isFloat('hello')).not.toBe(true) // hello is not a float
      expect(magna.utils.isFloat('hello1344')).not.toBe(true) // hello1344 is not a float
      expect(magna.utils.isFloat('-4')).toBe(true) // -4 is a float
      expect(magna.utils.isFloat('-4.56m')).toBe(true) // -4.56 is a float
    })

    it('utils.returnMax', function () {
      expect(magna.utils.returnMax([5, 6, 7, 1])).toBe(7)
      expect(magna.utils.returnMax([1, 2, 1, 6])).toBe(6)
      expect(magna.utils.returnMax([2, 2, 1, 3])).toBe(3)
      expect(magna.utils.returnMax([5, 4, 3])).toBe(5)
    })

    it('utils.stripValue', function () {
      expect(magna.utils.stripValue('1.23m')).toBe('1.23')
      expect(magna.utils.stripValue('£1.23m')).toBe('1.23')
      expect(magna.utils.stripValue('0.56%')).toBe('0.56')
      expect(magna.utils.stripValue('2,35m')).toBe('235')
    })

    it('utils.isNegative', function () {
      expect(magna.utils.isNegative(4)).toBe(false)
      expect(magna.utils.isNegative(-4)).toBe(true)
    })
  })
})
