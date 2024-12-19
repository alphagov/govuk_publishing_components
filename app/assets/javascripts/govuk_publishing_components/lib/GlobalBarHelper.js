function parseCookie(cookie) {
  var parsedCookie = JSON.parse(cookie)

  // Tests seem to run differently on CI, and require an extra parse
  if (typeof parsedCookie !== "object") {
    parsedCookie = JSON.parse(parsedCookie)
  }

  return parsedCookie
}
