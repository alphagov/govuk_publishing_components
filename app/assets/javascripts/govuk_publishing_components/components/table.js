window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  // var cells
  var cellWidths = []

  function Table ($module) {
    this.$module = $module
    this.searchInput = $module.querySelector('input[name="filter"]')
    this.tableRows = $module.querySelectorAll('.js-govuk-table__row')
    this.filter = $module.querySelector('.js-gem-c-table__filter')
    this.filterCount = this.filter.querySelector('.js-filter-count')
    this.message = $module.querySelector('.js-gem-c-table__message')
    this.hiddenClass = 'govuk-!-display-none'
    this.filterCountText = this.filterCount.getAttribute('data-count-text')
    this.tableRowsContent = []
    // this.cellWidths = []

    for (var i = 0; i < this.tableRows.length; i++) {
      this.tableRowsContent.push(this.tableRows[i].textContent.toUpperCase())
    }

    // cells = this.tableRows[0].querySelectorAll('.govuk-table__cell')
  }

  Table.prototype.init = function () {
    var cells = this.tableRows[0].querySelectorAll('.govuk-table__cell')

    this.$module.updateRows = this.updateRows.bind(this)
    this.filter.classList.remove(this.hiddenClass)
    this.searchInput.addEventListener('input', this.$module.updateRows)

    // Calculate starting values for cell widths
    cells.forEach(function(cell) {
      cellWidths.push(cell.offsetWidth / this.tableRows[0].offsetWidth * 100  + '%');
    }.bind(this))

    // console.log('cellWidths: ', this.cellWidths);
  }


  // Reads value of input and filters content
  Table.prototype.updateRows = function () {
    var value = this.searchInput.value
    var hiddenRows = 0
    var length = this.tableRows.length
    // var firstRow = this.tableRows[0]
    // var cells

    for (var i = 0; i < length; i++) {
      var cells

      if (this.tableRowsContent[i].includes(value.toUpperCase())) {
        this.tableRows[i].classList.remove(this.hiddenClass)

        cells = this.tableRows[i].querySelectorAll('.govuk-table__cell')

        for(var i = 0; i < cells.length; i++) {
          cells[i].style.width = cellWidths[i];
        }
      } else {
        this.tableRows[i].classList.add(this.hiddenClass)
        hiddenRows++
      }
    }

    this.filterCount.textContent = (length - hiddenRows) + ' ' + this.filterCountText

    if (length === hiddenRows) {
      this.message.classList.remove(this.hiddenClass)
    } else {
      this.message.classList.add(this.hiddenClass)
    }

    // Apply the width values after the filter operation otherwise the first row may have been removed
    // cells = firstRow.querySelectorAll('.govuk-table__cell')

    // console.log('cells: ', cells)
    // console.log('cellWidths: ', cellWidths);

    // cells = Array.from(cells)

    // for(var i = 0; i < cells.length; i++) {
    //   console.log('cell width: ', cellWidths[i])

    //   cells[i].style.width = cellWidths[i];
    // }
  }

  Modules.Table = Table
})(window.GOVUK.Modules)
