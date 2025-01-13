(function () {
  /* global LUX, performance */
  if (typeof LUX === 'undefined') { return }

  const navigationPerformance = performance.getEntriesByType('navigation')[0]
  if (!navigationPerformance) { return }

  // As per RFC 147[1], this adds in monitoring of the type of HTTP protocol that
  // is used when a browser loads a page.
  // [1]: https://github.com/alphagov/govuk-rfcs/pull/148
  LUX.addData('http-protocol', navigationPerformance.nextHopProtocol)

  const serverTiming = navigationPerformance.serverTiming
  if (serverTiming) {
    const cacheState = serverTiming.find(entry => ['cacheHit', 'cacheMiss'].includes(entry.name))
    if (cacheState) { LUX.addData('cache', cacheState.name) }
  }
}())
