window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function TableFilter ($module) {
    this.$module = $module
    this.searchInput = $module.querySelector('input[name="filter"]')
    this.tableRows = $module.querySelectorAll('.js-govuk-table__row')
    this.filter = $module.querySelector('.js-gem-c-table__filter')
    this.message = $module.querySelector('.js-gem-c-table__message')
    this.hiddenClass = 'govuk-!-display-none'
  }

  TableFilter.prototype.init = function () {
    this.$module.updateRows = this.updateRows.bind(this)
    this.filter.classList.remove(this.hiddenClass)
    this.searchInput.addEventListener('input', this.$module.updateRows)
  }

  // Reads value of input and filters content
  TableFilter.prototype.updateRows = function () {
    var value = this.searchInput.value
    var hiddenClass = this.hiddenClass
    var hiddenRows = 0
    var length = this.tableRows.length

    for (var i = 0; i < length; i++) {
      var row = this.tableRows[i]

      row.classList.remove(hiddenClass)

      if (!row.textContent.toUpperCase().includes(value.toUpperCase())) {
        row.classList.add(hiddenClass)
        hiddenRows++
      }
    }

    if (length === hiddenRows) {
      this.message.classList.remove(this.hiddenClass)
    } else {
      this.message.classList.add(this.hiddenClass)
    }
  }

  Modules.TableFilter = TableFilter
})(window.GOVUK.Modules)
