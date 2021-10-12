// some example, not called JS code, used by the auditing tests
function factorial (n) {
  if (n === 0) { return 1 }

  return n * factorial(n - 1)
}

factorial(3)
