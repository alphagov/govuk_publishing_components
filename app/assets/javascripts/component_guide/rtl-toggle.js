(function (Modules) {
  function RtlToggle ($module) {
    this.module = $module
    this.heading = this.module.querySelector('.js-toggle-heading')
    this.example = this.module.querySelector('.component-guide-preview')
  }

  RtlToggle.prototype.init = function () {
    if (!this.heading || !this.example || this.heading.textContent.includes('ight to left')) {
      return
    }

    const triggerWrapper = document.createElement('small')
    triggerWrapper.classList.add('rtl-trigger')
    const trigger = document.createElement('a')
    trigger.classList.add('govuk-link')
    trigger.textContent = 'show right to left'
    trigger.href = '#'
    triggerWrapper.append(trigger)

    trigger.addEventListener('click', (e) => {
      e.preventDefault()
      const classes = this.example.classList
      const result = classes.toggle('direction-rtl')
      e.target.textContent = result ? 'show left to right' : 'show right to left'
    })

    this.heading.append(triggerWrapper)
  }

  Modules.RtlToggle = RtlToggle
})(window.GOVUK.Modules)
