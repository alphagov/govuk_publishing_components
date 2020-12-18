//= require govuk/vendor/polyfills/Element/prototype/classList.js
// This is a non-jQuery version of Magna Charta: https://github.com/alphagov/magna-charta
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function MagnaCharta () { }

  MagnaCharta.prototype.start = function ($module, options) {
    this.$module = $module[0]
    this.options = {
      outOf: 65,
      applyOnInit: true,
      toggleText: 'Toggle between Chart and Table',
      autoOutdent: false,
      outdentAll: false,
      chartVisibleText: 'Change between chart and table, chart visible',
      tableVisibleText: 'Change between chart and table, table visible',
      toggleAfter: false, // BOOL set TRUE to append the toggle link
      returnReference: false // for testing purposes
    }

    for (var k in options) this.options[k] = options[k]
    this.detectIEVersion()

    // Magna Charta doesn't work in IE7 or less - so plain tables are shown to those browsers
    this.ENABLED = !(this.ie && this.ie < 8)

    // store a reference to the table in the object
    this.$table = $module

    // lets make what will become the new graph
    this.$graph = document.createElement('div')

    // set the graph to aria-hidden, which isn't changed at any point
    // the graph is totally inaccessible, so we let screen readers navigate the table
    // and ignore the graph entirely
    this.$graph.setAttribute('aria-hidden', 'true')

    // copy over classes from the table, and add the extra one
    this.$graph.setAttribute('class', this.$table.className)
    this.$graph.classList.add('mc-chart')

    // get the id of the current chart within the page so that it can be used during the generation of the toggleLink
    this.chartId = this.getChartId($module)

    // set the stacked option based on
    // giving the table a class of mc-stacked
    this.options.stacked = this.$table.classList.contains('mc-stacked')

    // set the negative option based on
    // giving the table a class of mc-negative
    this.options.negative = this.$table.classList.contains('mc-negative')

    // true if it's a 'multiple' table
    // this means multiple bars per rows, but not stacked.
    var moreThanTwoCells = this.$table.querySelectorAll('tbody tr')[0].querySelectorAll('th, td').length > 2

    this.options.multiple = !this.options.stacked && (this.$table.classList.contains('mc-multiple') || moreThanTwoCells)

    // set the outdent options
    // which can be set via classes or overriden by setting the value to true
    // in the initial options object that's passed in
    this.options.autoOutdent = this.options.autoOutdent || this.$table.classList.contains('mc-auto-outdent')

    this.options.outdentAll = this.options.outdentAll || this.$table.classList.contains('mc-outdented')

    // add a mc-multiple class if it is
    if (this.options.multiple) {
      this.$graph.classList.add('mc-multiple')
    }

    this.options.hasCaption = !!this.$table.querySelectorAll('caption').length

    if (this.ENABLED) {
      this.apply()
      // if applyOnInit is false, toggle immediately to show the table and hide the graph
      if (!this.options.applyOnInit) {
        this.toggleLink.click()
      }
    }

    if (this.options.returnReference) {
      return this
    }
  }

  MagnaCharta.prototype.detectIEVersion = function () {
    // detect IE version: James Padolsey, https://gist.github.com/527683
    this.ie = (function () {
      var undef
      var v = 3
      var div = document.createElement('div')
      var all = div.getElementsByTagName('i')

      do {
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->'
      } while (v < 10 && all[0])

      return (v > 4) ? v : undef
    })()
  }

  MagnaCharta.prototype.apply = function () {
    if (this.ENABLED) {
      this.constructChart()
      this.addClassesToHeader()
      this.applyWidths()
      this.insert()
      this.$table.classList.add('mc-hidden')
      this.applyOutdent()
    }
  }

  // methods for constructing the chart
  MagnaCharta.prototype.construct = {}

  // constructs the header
  MagnaCharta.prototype.construct.thead = function () {
    var thead = document.createElement('div')
    thead.classList.add('mc-thead')

    var tr = document.createElement('div')
    tr.classList.add('mc-tr')

    var output = ''
    var allTheTHsInTableHead = this.$table.querySelectorAll('thead th')

    for (var i = 0; i < allTheTHsInTableHead.length; i++) {
      output += '<div class="mc-th">'
      output += allTheTHsInTableHead[i].innerHTML
      output += '</div>'
    }

    tr.innerHTML = output
    thead.appendChild(tr)

    return thead
  }

  MagnaCharta.prototype.construct.tbody = function () {
    var tbody = document.createElement('div')
    tbody.classList.add('mc-tbody')

    var allTheTbodyTrs = this.$table.querySelectorAll('tbody tr')

    for (var i = 0; i < allTheTbodyTrs.length; i++) {
      var tr = document.createElement('div')
      tr.classList.add('mc-tr')

      var cellsOutput = ''
      var allTheTableBodyCells = allTheTbodyTrs[i].querySelectorAll('th, td')

      for (var j = 0; j < allTheTableBodyCells.length; j++) {
        cellsOutput += '<div class="mc-td">'
        cellsOutput += allTheTableBodyCells[j].innerHTML
        cellsOutput += '</div>'
      }
      tr.innerHTML = cellsOutput
      tbody.appendChild(tr)
    }

    return tbody
  }

  MagnaCharta.prototype.construct.caption = function () {
    var cap = this.$table.querySelector('caption')
    return cap.cloneNode(true)
  }

  // construct a link to allow the user to toggle between chart and table
  MagnaCharta.prototype.construct.toggleLink = function (toggleText, chartId, chartVisibleText) {
    var link = document.createElement('a')
    var span = document.createElement('span')
    var id = 'mc-display-state-' + chartId

    link.setAttribute('href', '#')
    link.classList.add('mc-toggle-link')
    link.innerHTML = toggleText
    link.setAttribute('aria-labelledby', id)

    // construct a visually hidden span that we use as a means to communicate to screen reader users the state of the chart (if table or chart is showing)
    // the span will change based on if the table or chart are visible at any one time and use aria-live to communicate this change to screen reader users
    // the reason for this approach is that a user being a screen reader user isn't an automatic indication that they can't see at all so we need to communicate the state of the toggle button to accommodate those users
    span.classList.add('govuk-visually-hidden', 'mc-display-state')
    span.id = id
    span.setAttribute('aria-live', 'assertive')
    span.innerHTML = chartVisibleText
    link.appendChild(span)

    return link
  }

  // toggles between showing the table and showing the chart
  MagnaCharta.prototype.addToggleClick = function (chartVisible, tableVisible) {
    var that = this

    this.toggleLink.addEventListener('click', function (e) {
      e.preventDefault()
      var displayState = that.toggleLink.querySelector('.mc-display-state')

      that.$graph.classList.toggle('mc-hidden')
      that.$table.classList.toggle('mc-hidden')

      displayState.innerHTML = displayState.innerHTML === chartVisible ? tableVisible : chartVisible
    })
  }

  MagnaCharta.prototype.constructChart = function () {
    // turn every element in the table into divs with appropriate classes
    // call them and define this as scope so it's easier to
    // get at options and properties
    var thead = this.construct.thead.call(this)
    var tbody = this.construct.tbody.call(this)
    this.toggleLink = this.construct.toggleLink(this.options.toggleText, this.chartId, this.options.chartVisibleText)
    this.addToggleClick(this.options.chartVisibleText, this.options.tableVisibleText)

    if (this.options.hasCaption) {
      var caption = this.construct.caption.call(this)
      this.$graph.appendChild(caption)
    }

    if (this.options.toggleAfter) {
      this.$table.insertAdjacentElement('afterend', this.toggleLink)
    } else {
      this.$table.insertAdjacentElement('beforebegin', this.toggleLink)
    }

    this.$graph.appendChild(thead)
    this.$graph.appendChild(tbody)
  }

  // some handy utility methods
  MagnaCharta.prototype.utils = {
    isFloat: function (val) {
      return !isNaN(parseFloat(val))
    },
    stripValue: function (val) {
      return val.replace(/,|£|%|[a-z]/gi, '')
    },
    returnMax: function (values) {
      var max = 0
      for (var i = 0; i < values.length; i++) {
        if (values[i] > max) { max = values[i] }
      }
      return max
    },
    isNegative: function (value) {
      return (value < 0)
    }
  }

  MagnaCharta.prototype.addClassesToHeader = function () {
    var headerCells = this.$graph.querySelectorAll('.mc-th')
    var looplength = headerCells.length

    if (this.options.stacked) {
      var last = looplength - 1
      headerCells[last].classList.add('mc-stacked-header', 'mc-header-total')
      looplength -= 1
    }

    // we deliberately don't apply this to the first cell
    for (var i = 1; i < looplength; i++) {
      headerCells[i].classList.add('mc-key-header')
      if (!headerCells[i].classList.contains('mc-stacked-header')) {
        headerCells[i].classList.add('mc-key-' + i)
      }
    }
  }

  MagnaCharta.prototype.calculateMaxWidth = function () {
    // store the cell values in here so we can figure out the maximum value later
    var values = []

    // var to store the maximum negative value (used only for negative charts)
    var maxNegativeValue = 0

    // loop through every tr in the table
    var trs = this.$graph.querySelectorAll('.mc-tr')
    for (var i = 0; i < trs.length; i++) {
      var $this = trs[i]

      // the first td is going to be the key, so ignore it
      // we'd use $this.querySelectorAll('.mc-td:not(:first-child)') but for IE8
      var $bodyCellsOriginal = $this.querySelectorAll('.mc-td')
      var $bodyCells = []
      for (var k = 1; k < $bodyCellsOriginal.length; k++) {
        $bodyCells.push($bodyCellsOriginal[k])
      }

      var bodyCellsLength = $bodyCells.length

      // might be the row containing th elements, so we need to check
      if (bodyCellsLength) {
        // if it's stacked, the last column is a totals
        // so we don't want that in our calculations
        if (this.options.stacked) {
          $bodyCells[bodyCellsLength - 1].classList.add('mc-stacked-total')
          bodyCellsLength -= 1
        }

        // first td in each row is key
        var firstCell = $this.querySelector('.mc-td')
        if (firstCell) {
          firstCell.classList.add('mc-key-cell')
        }

        // store the total value of the bar cells in a row
        // for anything but stacked, this is just the value of one <td>
        var cellsTotalValue = 0

        for (var j = 0; j < bodyCellsLength; j++) {
          var $cell = $bodyCells[j]
          $cell.classList.add('mc-bar-cell')
          $cell.classList.add('mc-bar-' + (j + 1))
          var cellVal = this.utils.stripValue($cell.innerText)

          if (this.utils.isFloat(cellVal)) {
            var parsedVal = parseFloat(cellVal, 10)
            var absParsedVal = Math.abs(parsedVal)
            if (parsedVal === 0) {
              $cell.classList.add('mc-bar-zero')
            }

            if (this.options.negative) {
              if (this.utils.isNegative(parsedVal)) {
                $cell.classList.add('mc-bar-negative')
                if (absParsedVal > maxNegativeValue) {
                  maxNegativeValue = absParsedVal
                }
              } else {
                $cell.classList.add('mc-bar-positive')
              }
            }
            // now we are done with our negative calculations
            // set parsedVal to absParsedVal
            parsedVal = absParsedVal

            if (!this.options.stacked) {
              cellsTotalValue = parsedVal
              values.push(parsedVal)
            } else {
              cellsTotalValue += parsedVal
            }
          }
        }
      }

      // if stacked, we need to push the total value of the row to the values array
      if (this.options.stacked) { values.push(cellsTotalValue) }
    }

    var resp = {}
    resp.max = parseFloat(this.utils.returnMax(values), 10)
    resp.single = parseFloat(this.options.outOf / resp.max, 10)

    if (this.options.negative) {
      resp.marginLeft = parseFloat(maxNegativeValue, 10) * resp.single
      resp.maxNegative = parseFloat(maxNegativeValue, 10)
    }

    return resp
  }

  MagnaCharta.prototype.applyWidths = function () {
    this.dimensions = this.calculateMaxWidth()
    var trs = this.$graph.querySelectorAll('.mc-tr')

    for (var i = 0; i < trs.length; i++) {
      var cells = trs[i].querySelectorAll('.mc-bar-cell')

      for (var j = 0; j < cells.length; j++) {
        var $cell = cells[j]
        var parsedCellVal = parseFloat(this.utils.stripValue($cell.innerText), 10)
        var parsedVal = parsedCellVal * this.dimensions.single
        var absParsedCellVal = Math.abs(parsedCellVal)
        var absParsedVal = Math.abs(parsedVal)

        // apply the left margin to the positive bars
        if (this.options.negative) {
          if ($cell.classList.contains('mc-bar-positive')) {
            $cell.style.marginLeft = this.dimensions.marginLeft + '%'
          } else {
            // if its negative but not the maximum negative
            // we need to give it enough margin to push it further right to align
            if (absParsedCellVal < this.dimensions.maxNegative) {
              // left margin needs to be (largestNegVal - thisNegVal) * single
              var leftMarg = (this.dimensions.maxNegative - absParsedCellVal) * this.dimensions.single
              $cell.style.marginLeft = leftMarg + '%'
            }
          }
        }

        // wrap the cell value in a span tag
        $cell.innerHTML = '<span>' + $cell.innerHTML + '</span>'
        $cell.style.width = absParsedVal + '%'
      }
    }
  }

  MagnaCharta.prototype.insert = function () {
    this.$table.insertAdjacentElement('afterend', this.$graph)
  }

  MagnaCharta.prototype.applyOutdent = function () {
    /*
     * this figures out if a cell needs an outdent and applies it
     * it needs an outdent if the width of the text is greater than the width of the bar
     * if this is the case, wrap the value in a span, and use absolute positioning
     * to push it out (the bar is styled to be relative)
     * unfortunately this has to be done once the chart has been inserted
     */
    var cells = this.$graph.querySelectorAll('.mc-bar-cell')

    for (var i = 0; i < cells.length; i++) {
      var $cell = cells[i]
      var cellVal = parseFloat(this.utils.stripValue($cell.innerText), 10)
      var $cellSpan = $cell.querySelector('span')
      var spanWidth = $cell.querySelector('span').offsetWidth + 5 // +5 just for extra padding
      var cellWidth = $cell.offsetWidth

      if (!this.options.stacked) {
      // if it's 0, it is effectively outdented
        if (cellVal === 0) { $cell.classList.add('mc-bar-outdented') }

        if ((this.options.autoOutdent && spanWidth >= cellWidth) || this.options.outdentAll) {
          $cell.classList.add('mc-bar-outdented')
          $cellSpan.style.marginLeft = '100%'
          $cellSpan.style.display = 'inline-block'
        } else {
          $cell.classList.add('mc-bar-indented')
        }
      } else {
        // if it's a stacked graph
        if ((spanWidth > cellWidth && cellVal > 0) || (cellVal < 1)) {
          $cell.classList.add('mc-value-overflow')
        }
      }
    }
  }

  MagnaCharta.prototype.getChartId = function (module) {
    var allCharts = document.querySelectorAll('table.js-barchart-table')
    var id = null

    allCharts.forEach(function (chart, i) {
      if (chart === module) {
        id = i
      }
    })

    return id
  }

  Modules.MagnaCharta = MagnaCharta
})(window.GOVUK.Modules)
