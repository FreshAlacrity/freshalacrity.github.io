/* requires alacrity.js - https://freshalacrity.github.io/a/alacrity2.js */
/* globals alacrity */
/* last major change: refactor and consolidation on Sep 7, 2021 */
/*
- alacrity.makeElement => alacrity.make
- rotation is generally applied after translation, so transform, group and then translate the group to keep the same position

  = TO DO =
- get unit tests working where they're implemented here?
- troubleshoot arc so it's accurate to circles (like for petals)
- get '_contents' properties working
- add donutWedge like pie wedge but with hole in the middle
- figure out how to group svg elements so hovering over sections produces intutive results with css transitions
- figure out why tooltip text isn't resizing (and in general fix/implement tooltips)
- add the ability to include text in redirecting bracings (between the two arcs)
- figure out how to have it zoom when I use CTRL+ etc (based on rem maybe?)
  - pick this up from the timer codepen
- add that geometric font from Gravit
- add radial STL
- function with names of shapes etc return objects that must be passed through make() or create() to be used
- functions with Path in the name return fragments of a d='...' svg object property

*/

const svg = (function () {
  /* Setup for runUnitTests() - @later figure out if we wanna even do that for this mini lib */
  // const unitTests = []

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  function sayHello () {
    alacrity.log('Alacrity SVG supplement library loaded')
  }
  function getSvgAttributes (element) {
    const obj = {}
    const atts = element.attributes
    for (let i = 0; i < atts.length; i++) {
      const att = atts[i]
      obj[att.nodeName] = att.nodeValue
    }
    return obj
  }
  function setSvgAttributes (element, object) {
    Object.keys(object).forEach(key => {
      if (key[0] !== '_') {
        let ns = null
        if (key.slice(0, 6) === 'xlink:') { ns = 'http://www.w3.org/1999/xlink' }
        element.setAttributeNS(ns, key, object[key])
      }
    })
    return element
  }
  function newSvgElement (type, object) {
    const newElement = document.createElementNS('http://www.w3.org/2000/svg', type)
    if (object) { setSvgAttributes(newElement, object) }
    return newElement
  }
  /* @todo is this used/needed? */
  function make (...args) {
    return alacrity.makeElement(alacrity.smoosh(...args))
  }

  function mid (pt1, pt2) {
    return alacrity.lerp(pt1, pt2, 0.5)
  }
  function parts (num) {
    return alacrity.range(num).map(a => a / num)
  }
  // todo compare dialPoints and onCircle - they may be duplicates
  /**
   * @param offset a decimal value to rotate each decimal value by
   * @param {number} [center=[0, 0]]
   * @returns {number[][]} nested array of points around a circle, given an array of decimal values
   */
  function onCircle (decimalValues, radius, center = [0, 0], offset = 0) {
    return decimalValues.map(a => alacrity.circPoint(center, radius, a + offset))
  }
  function dialPoints (center = [0, 0], r = 1, num = 12, offset = 0) {
    return parts(num).map(a => alacrity.circPoint(center, r, a + offset))
  }

  function circularPath (center, r, flipHorizontal = false, flipVertical = false) {
    // todo use simpleArcSegment()?
    // arcs: rx ry x-axis-rotation large-arc-flag sweep-flag x y
    // clockwise:        d="M 0,-45 A 45,45 0 1,1 0,45     A 45,45 0 1,1 0,-45"
    // counterclockwise: d="M 0,-45 A 45,45 0 1,0 0,45     A 45,45 0 1,0 0,-45"
    const largeArc = 1
    let sweep = 1
    if (flipHorizontal) {
      sweep = 0
    }
    const fx = center[0]; const sx = center[0]; let fy = center[1] - r; let sy = center[1] + r
    if (flipVertical) { // flip the y values
      fy = center[1] + r; sy = center[1] - r
    }
    let arcPoints = `M ${fx}, ${fy}`
    arcPoints += ` A ${r}, ${r} 0 ${largeArc}, ${sweep} ${sx}, ${sy}`
    arcPoints += ` A ${r}, ${r} 0 ${largeArc}, ${sweep} ${fx}, ${fy}`
    return arcPoints
  }
  function line (points = [[0, 0], [100, 100]], dTail = '') {
    return {
      _element: 'path',
      d: 'M ' + points.join(' ') + dTail
    }
  }
  function radialMarks (center = [0, 0], r = 40, num = 12, length = 5, offset) {
    const pts = alacrity.transpose([dialPoints(center, r, num, offset), dialPoints(center, r - length, num, offset)])
    return {
      _element: 'g',
      _contents: (pts.map(a => make(line(a))).join('')),
      _innerRadius: (r - length)
    }
  }

  function arcPath (startCoords, endCoords, r, arcFlag = 0, sweepFlag = 1) {
    /* SVG arc path: x1 y1 x-axis-rotation large-arc-flag sweep-flag x2 y2
    * sweep flag dictates clockwise vs counterclockwise */
    return `M ${startCoords} A ${r} ${r} 0 ${arcFlag} ${sweepFlag} ${endCoords} `
  }

  function arc (centerCoords, radius, startDecimal = 0, endDecimal = 0.4, longwayFlag = 0) {
    /* If the arc overlaps the 0 point, switch the flag:
    * @later check that this is actually what is needed/happening */
    if ((startDecimal - endDecimal) < 0) { longwayFlag = +!longwayFlag }
    const startCoords = alacrity.circPoint(centerCoords, radius, startDecimal)
    const endCoords = alacrity.circPoint(centerCoords, radius, startDecimal)
    return {
      _element: 'path',
      d: arcPath(startCoords, endCoords, radius, longwayFlag)
    }
  }

  /** @todo fix this so it outputs an object, not a string */
  function pieWedge (centerCoords, radius, startDecimal, endDecimal, longwayFlag = 1) {
    const startCoords = alacrity.circPoint(centerCoords, radius, startDecimal)
    const endCoords = alacrity.circPoint(centerCoords, radius, endDecimal)
    /* If the arc overlaps the 0 point, switch the flag:
      * @later check that this is actually what is needed/happening */
    if ((startDecimal - endDecimal) < 0) { longwayFlag = +!longwayFlag }
    return `<path d="M ${startCoords} A ${radius} ${radius} 1 ${longwayFlag} 1 ${endCoords} Z" />`
  }
  /* unitTests.push(['getSvgPieWedgeElement()',
    [getSvgPieWedgeElement([100, 100], 50, 0.25, 0.5, 0, 'stroke="red"'), '<path d="M 150,100 A 50 50 1 1 1 100,50 Z" stroke="red" />']
  ]) */

  /**
   * @param size - % of larger circle's circumference
   * @param protrusion - % of the larger circle's radius used
   * @param thickness - % of larger circle's circumference (recommend size of 0.03 or less)
   known issues:
   - low size & high protrusion/high thickness compared to size -> inner arcs can flip outwards
   - low protrusion/high size -> arcs go on adventures outside the big circle (wrong flag)
   */
  function redirectingBracings (center, r, size = 0.3, offset = 0, num = 3, protrusion = 0.1) {
    offset += 0.5
    const clipId = `circle-clip-${center}-${r}`
    const mask = alacrity.makeElement({
      _element: 'clipPath',
      _contents: alacrity.makeElement(circle(center, r)),
      id: clipId
    })
    let each = dialPoints(center, r * (1 - protrusion), num, offset)
    each = each.map(a => make(circle(a, r * size), { 'clip-path': `url(#${clipId})` }))
    return {
      _element: 'g',
      _contents: (mask + each.join('')),
      _innerRadius: (r * (1 - protrusion)) - (r * size)
    }
  }

  function circle (center, r) {
    return {
      _element: 'circle',
      cx: center[0],
      cy: center[1],
      r: r,
      _innerRadius: r
    }
  }

  /**
   * @param stride - the number of points skipped by each line
   */
  function starPoints (num, stride, radius, center, offset = 0) {
    const points = alacrity.range(num).map(a => a * (stride / num))
    return onCircle(points, radius, center, offset)
  }
  function polygon (center, r, numPoints, offset, obj) {
    if (numPoints <= 1) { return circle(center, r) }
    const points = dialPoints(center, r, numPoints, offset + 0.5).reverse()
    const innerR = alacrity.length(center, mid(points[0], points[1]))
    return alacrity.smoosh(obj, {
      _element: 'path',
      d: `M ${points.join(',')} Z`,
      _innerRadius: innerR
    })
  }
  function star (center, r = 1, num = 5, stride = 2, offset = 0, obj = {}) {
    offset += 0.5
    if (num <= 4 || stride === 1) { return polygon(center, r, num, offset, obj) }
    let points = []
    let d = ''
    if (num % 2 === 0 && stride % 2 === 0) {
      const adjust = (0.5 * (stride / num))
      num = num / 2
      if (num % 2 === 0) {
        stride = stride - 1
      }
      points = starPoints(num, stride, r, center, offset + adjust)
      d += `M ${points.join(',')} Z `
    }
    points = starPoints(num, stride, r, center, offset)
    d += `M ${points.join(',')} Z`
    const innerR = alacrity.length(center, mid(points[0], points[1]))
    return alacrity.smoosh(obj, {
      _element: 'path',
      d: d,
      _innerRadius: innerR
    })
  }
  function star2 (center = [0, 0], r = 40, num = 5, length = 5, offset = 0, obj = {}) {
    offset += 0.5
    const tips = dialPoints(center, r, num, offset)
    const b1 = dialPoints(center, r - length, num, (0.5 / num) + offset)
    const pts = alacrity.transpose([tips, b1])
    return alacrity.smoosh(obj, {
      _element: 'path',
      d: 'M ' + pts.join(',') + ' Z',
      _innerRadius: (r - length)
    })
  }
  function petal (center = [0, 0], r = 42, a = 0, step = 0.05, l = 10, flip = false) {
    const b1 = alacrity.circPoint(center, r - l, a - step)
    const q1 = alacrity.circPoint(center, r - l / 2, a - step)
    const m1 = alacrity.circPoint(center, r - l / 2, a - step / 2)
    const tip = alacrity.circPoint(center, r, a)
    const q2 = alacrity.circPoint(center, r - l / 2, a)
    // let q3 = alacrity.circPoint(center, r - l * 0.87, a); //circular part
    const m2 = alacrity.circPoint(center, r - l / 2, a + step / 2)
    const q4 = alacrity.circPoint(center, r - l / 2, a + step)
    const b2 = alacrity.circPoint(center, r - l, a + step)
    // const base = arc(center, r, a - step, a + step)
    return {
      id: 'petal', // todo remove
      _element: 'path',
      d: `M ${b1} Q ${q1} ${m1} Q ${q2} ${tip} Q ${q2} ${m2} Q ${q4} ${b2} A ${r} ${r} 1 0 1 ${b1} Z`
    }
  }
  function petals (center = [0, 0], r = 40, num = 12, l = 5, offset = 0, flip = false, obj = {}) {
    const ir = r - l
    if (flip) { r = ir; l = l * -1 }
    let tips = parts(num)
    tips = tips.map(a => petal(center, r, a + offset, 0.5 / num, l))
    tips = tips.map(a => make(a, obj)).join('')
    return {
      _element: 'g',
      _contents: tips,
      _innerRadius: ir
    }
  }

  // todo make this possible to place at any angle/make radial labelled segments
  function makeText (num) {
    return alacrity.range(num).map(a => 'hello world!')
  }
  function simpleText (coords, size = 3, text = makeText(3).join(' ')) {
    return {
      _element: 'text',
      x: coords[0],
      y: coords[1],
      'dominant-baseline': 'middle',
      'text-anchor': 'middle',
      'font-size': size,
      _contents: text
    }
  }
  function tooltip (coords, foo, text) {
    // todo
    // see https://svgwg.org/svg2-draft/text.html#TermContentArea for wrapping text inside a rectangle
    // https://stackoverflow.com/questions/41768657/display-text-over-svg-element-on-hover
    // https://www.w3schools.com/cssref/tryit.asp?filename=trycss_sel_hover2
    const bg = {
      _element: 'rect',
      x: coords[0] - 7.5,
      y: coords[1] - 5,
      rx: 1,
      ry: 1,
      width: 15,
      height: 10,
      fill: 'black'
    }
    const txt = simpleText(coords, 1, text)

    return {
      _element: 'g',
      _contents: [bg, txt].map(alacrity.makeElement).join('')
    }
  }
  function textPath (pathId, text, size, offset = 0) {
    return {
      _element: 'textPath',
      'xlink:href': '#' + pathId,
      title: text,
      startOffset: alacrity.fix(offset * 100, 100) + '%',
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      spacing: 'auto',
      'font-size': size,
      stroke: 'none',
      _contents: text
    }
  }
  function circleText (center, r, text = months, l = 3, offset = 0, obj = {}) {
    const step = 1 / text.length
    const pathOffset = 0.5 + (1 - (text.length % 2)) * 0.5 * step
    const pathId = `text-path-${center}-${r}`
    let svgElements = ''
    svgElements += '<defs>'
    if (typeof text === 'string') {
      text = [text]
    }
    svgElements += make({
      _element: 'path',
      class: 'hide',
      id: pathId,
      d: circularPath(center, (r - l / 2), false, true)
    }, obj)
    svgElements += '</defs>'
    svgElements += '<text>'
    svgElements += text.map((a, i) =>
      make(textPath(pathId, a, l, pathOffset + ((i) * step)), obj)
    ).join('')
    svgElements += '</text>'
    return {
      _element: 'g',
      transform: `rotate(${(step * -180) + offset * 360} ${center.join(' ')})`,
      _contents: svgElements,
      _innerRadius: r - l
    }
  }
  function polygonTextLined (center, r, text = weekdays, l = 3, offset = 0, obj = {}) {
    offset += 0.5
    const pad1 = (Math.pow(1 / 3, text.length) * 60) - 0.2 // 3 * x = 1.5, 5 * x = 0
    let pad2 = pad1
    if (text.join('').search(/[gjqpy]/) < 0) {
      // todo make a flag to turn this on/off? might mess up sitelen telo etc
      pad2 -= l * 0.1
    }
    if (typeof text === 'string') { text = [text] }
    const inner = polygon(center, r - (l + pad2) * 2, text.length, offset - 0.5, obj)
    return {
      _element: 'g',
      _contents: [
        polygon(center, r, text.length, offset - 0.5, obj),
        polygonText(center, r - l - pad1, text, l, offset, obj),
        inner
      ].map(alacrity.makeElement).join(''),
      _innerRadius: inner._innerRadius
    }
  }
  function polygonText (center, r, text = makeText(3), l = 3, offset = 0.5, obj = {}) {
    const step = 1 / text.length
    offset += (1 - (text.length % 2)) * 0.5 * step
    const pathId = `text-path-${center}-${r}`
    if (typeof text === 'string') { text = [text] }
    let svgElements = ''
    svgElements += '<defs>'
    const path = polygon(center, r, text.length, offset, obj)
    path.id = pathId
    svgElements += alacrity.makeElement(path)
    svgElements += '</defs>'
    svgElements += '<text>'
    svgElements += text.map((a, i) =>
      make(textPath(pathId, a, l, offset + ((i) * step)), obj)
    ).join('')
    svgElements += '</text>'
    return {
      _element: 'g',
      transform: `rotate(${step * -180} ${center.join(' ')})`,
      _contents: svgElements,
      _innerRadius: path._innerRadius
    }
  }

  const sample = [
    '', {
      function: petals,
      args: [12, 5, 0, false, { fill: 'currentColor', 'stroke-width': 0 }]
    }, { function: circle }, {
      function: circleText,
      args: [undefined, undefined],
      adjust: 1
    }, { function: circle, adjust: 1 }, {
      function: petals,
      args: [12, 5, 0, true, { fill: 'currentColor', 'stroke-width': 0 }]
    }, { function: circle, adjust: 1 }, {
      function: polygonTextLined
      // args: [11, 2, 0, {'stroke-linejoin':'bevel'}],
    }, { function: circle }, {
      function: radialMarks,
      args: []
    }, { function: circle }, {
      function: redirectingBracings,
      args: [0.3, 0, 3, -0.05]
    }, { function: circle }, {
      function: star2,
      args: [5, 5, 0, { 'stroke-linejoin': 'bevel' }]
    }, { function: circle }, {
      function: star,
      args: [8, 3, 0, { 'stroke-linejoin': 'bevel' }]
    }, { function: circle }, {
      function: simpleText,
      args: ['x']
    }/*, {
      function: tooltip
    } */
  ]
  function nested (list = sample, r = 45, padding = 0, center = [0, 0]) {
    const nestWithin = (string, obj) => {
      obj = alacrity.smoosh({ args: [], adjust: 0 }, obj)
      const fren = obj.function(center, r - obj.adjust, ...obj.args)
      r = fren._innerRadius - padding
      return string + make(fren)
    }
    return list.reduce(nestWithin)
  }
  return {
    getAtts: getSvgAttributes, // svg.getAtts
    setAtts: setSvgAttributes, // svg.setAtts
    new: newSvgElement,
    make: make,
    line: line,
    circle: circle,
    polygon: polygon,
    star: star,
    onCircle: onCircle,
    circleText: circleText,
    polygonText: polygonText,
    polygonTextLined: polygonTextLined,
    arc: arc,
    wedge: pieWedge,
    petals: petals,
    radialMarks: radialMarks,
    dialPoints: dialPoints,
    nestedCircles: nested,
    tooltip: tooltip,
    text: simpleText,
    hello: sayHello
  }
}())

svg.hello()
