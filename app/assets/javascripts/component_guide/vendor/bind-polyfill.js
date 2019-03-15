if (typeof Function.prototype.bind === 'undefined') {
  Function.prototype.bind = function (target) {
    var f = this
    return function() {
      return f.apply(target, arguments)
    }
  }
}
