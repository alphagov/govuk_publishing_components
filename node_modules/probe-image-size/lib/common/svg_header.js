'use strict'


// Parse the XML prolog and the root element of an SVG document.
//
// All regexps below are anchored (`^`) and applied at a known offset, so the
// engine never rescans the input from every position. Alternatives inside
// PROLOG_RE have disjoint prefixes (`\s`, `<?`, `<!--`, `<![CDATA[`, `<!`+letter),
// which keeps the repetition deterministic. Both properties are required to
// stay linear on malformed input.

// max size for pre-svg-tag comments plus svg tag itself
exports.MAX_DATA_LENGTH = 1024 * 10


var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*'

var unquoted = '[^"\'=<>`\\x00-\\x20]+'
var single_quoted = "'[^']*'"
var double_quoted = '"[^"]*"'

var attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')'
var attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)'

// prolog ::= XMLDecl? Misc* (doctypedecl Misc*)?, Misc ::= Comment | PI | S
var pi = '<[?][\\s\\S]*?[?]>'
var comment = '<!--(?:[^-]|-[^-]|--[^>])*-->'
var cdata = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'
// doctypedecl, including the optional internal subset: <!DOCTYPE svg [ ... ]>
var doctype = '<![A-Za-z][^[>]*(?:\\[[\\s\\S]*?\\][^>]*)?>'

var PROLOG_RE = new RegExp('^(?:\\s+|' + pi + '|' + comment + '|' + cdata + '|' + doctype + ')*')

// root element: tag name + everything up to the closing bracket
var ROOT_RE = new RegExp('^<(' + attr_name + ')(' + attribute + '*)\\s*/?>')

// single attribute, iterated over the blob captured by ROOT_RE
var ATTR_RE = new RegExp(
  '\\s+(' + attr_name + ')(?:\\s*=\\s*(?:(' + unquoted + ")|'([^']*)'|\"([^\"]*)\"))?",
  'g'
)

var SVG_UNITS_RE = /in$|mm$|cm$|pt$|pc$|px$|em$|ex$/


// Filter NaN, Infinity, < 0
function isFinitePositive (val) {
  return typeof val === 'number' && isFinite(val) && val > 0
}


function units (str) {
  // all units are 2 chars long, no need to scan the whole value
  var suffix = str.slice(-2)

  var m = suffix.match(SVG_UNITS_RE)

  return m === null ? 'px' : m[0]
}


// Returns { width, height, type, mime, wUnits, hUnits } or undefined
//
exports.parse = function (str) {
  // skip prolog: xml declaration, comments, PIs, doctype
  var prolog = str.match(PROLOG_RE)[0]

  var root = ROOT_RE.exec(prolog.length ? str.slice(prolog.length) : str)
  if (!root) return

  // top level element must be svg (with optional namespace prefix),
  // used to skip svg embedded in html
  var tag = root[1]
  if (tag !== 'svg' && tag.slice(-4) !== ':svg') return

  // collect attributes by exact name, so that `stroke-width`, `data-height`
  // and values of unrelated attributes can't be picked up by accident
  var attrs = {}
  var m

  ATTR_RE.lastIndex = 0

  while ((m = ATTR_RE.exec(root[2])) !== null) {
    attrs[m[1]] = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : m[4])
  }

  var wAttr = attrs.width
  var hAttr = attrs.height
  var vbAttr = attrs.viewBox || attrs.viewbox

  // percentages are relative to the viewport, we can't resolve those
  if (wAttr && wAttr.indexOf('%') !== -1) wAttr = undefined
  if (hAttr && hAttr.indexOf('%') !== -1) hAttr = undefined

  var width = parseFloat(wAttr)
  var height = parseFloat(hAttr)

  // Extract from direct values

  if (wAttr && hAttr) {
    if (!isFinitePositive(width) || !isFinitePositive(height)) return

    return {
      width: width,
      height: height,
      type: 'svg',
      mime: 'image/svg+xml',
      wUnits: units(wAttr),
      hUnits: units(hAttr)
    }
  }

  // Extract from viewbox

  var parts = (vbAttr || '').trim().split(/[\s,]+/)
  var vbWidth = parseFloat(parts[2])
  var vbHeight = parseFloat(parts[3])

  if (!isFinitePositive(vbWidth) || !isFinitePositive(vbHeight)) return
  if (units(parts[2]) !== units(parts[3])) return

  var ratio = vbWidth / vbHeight

  if (wAttr) {
    if (!isFinitePositive(width)) return

    return {
      width: width,
      height: width / ratio,
      type: 'svg',
      mime: 'image/svg+xml',
      wUnits: units(wAttr),
      hUnits: units(wAttr)
    }
  }

  if (hAttr) {
    if (!isFinitePositive(height)) return

    return {
      width: height * ratio,
      height: height,
      type: 'svg',
      mime: 'image/svg+xml',
      wUnits: units(hAttr),
      hUnits: units(hAttr)
    }
  }

  return {
    width: vbWidth,
    height: vbHeight,
    type: 'svg',
    mime: 'image/svg+xml',
    wUnits: units(parts[2]),
    hUnits: units(parts[3])
  }
}
