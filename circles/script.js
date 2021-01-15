/* jshint esversion: 6 */
/* jshint undef: true */
/* globals alacrity, luxon, window, document, $, setInterval, setTimeout */
/* globals alert */
/*
- text that follows polygon, with the number of strings dictating the sides of the polygon (and then figure out how to nest them into a function that makes text contained in polygons)
- import all the wheel of the year data and functions
- get all those working together neatly and taking an array of bound functions to draw consecutive patterns
- go all the way from the year wheel to two-minute and three-minute timers with little progress circles


- radial STL
- titles/tooltips/hover text
*/
let a = alacrity;
let DateTime = luxon.DateTime;
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var targetSvg = "test";

function mid(pt1, pt2){
  return alacrity.lerp(pt1, pt2, 0.5);
}
function parts(num){
  return alacrity.range(num).map(a => a / num);
}

function make(...args){
  return alacrity.makeElement(alacrity.smoosh(...args));
}
/* Reference
- arcs: rx ry x-axis-rotation large-arc-flag sweep-flag x y
- hue: range of 0 to 360 - 0: red, 120: green, 240: blue, 50: gold
*/ // refs

// nifty resize-to-recolor thing
/*
function update(){
  hue+=2; document.getElementById("test").style.background = "hsl("+hue+",70%,20%)";
}
update();
onWindowResize(update);
*/

function circularPath(center,r,flipHorizontal = false,flipVertical = false) {
  // arcs: rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // clockwise:        d="M 0,-45 A 45,45 0 1,1 0,45     A 45,45 0 1,1 0,-45"
  // counterclockwise: d="M 0,-45 A 45,45 0 1,0 0,45     A 45,45 0 1,0 0,-45"
  let largeArc = 1;
  let sweep = 1;
  if (flipHorizontal){
    sweep = 0;
  }
  let fx = center[0]; let sx = center[0]; let fy = center[1]-r; let sy = center[1]+r;
  if (flipVertical){ //flip the y values
    fy = center[1]+r; sy = center[1]-r;
  }
  let arcPoints = `M ${fx}, ${fy}`;
  arcPoints += ` A ${r}, ${r} 0 ${largeArc}, ${sweep} ${sx}, ${sy}`;
  arcPoints += ` A ${r}, ${r} 0 ${largeArc}, ${sweep} ${fx}, ${fy}`;
  return arcPoints;
}
function line(points = [[0,0],[100, 100]], dTail = "") {
  let line = {
    _element: 'path',
    d: "M " + points.join(" ") + dTail
  };
  return make(line);
}
function radialMarks(center = [0,0], r = 40, num = 12, length = 5) {
  let pts = alacrity.transpose([dialPoints(center, r, num), dialPoints(center, r-length, num)]);
  return {
    _element:'g',
    _contents:(pts.map(a => line(a)).join("")),
    _innerRadius: (r - length)
  };
}


function simpleArcSegment(coords1, coords2, r, arcFlag = 0) {
  // have this support arc-to?
  // arcs: rx ry x-axis-rotation large-arc-flag sweep-flag x y
  return `M ${coords1} A ${r} ${r} 0 ${arcFlag} 1 ${coords2} `;
}
function dialPoints(center = [0,0], r = 1, num = 12, offset = 0) {
  return parts(num).map(a => alacrity.circPoint(center, r, a + offset));
}
function arc(center, r, start = 0, end = 0.4, longwayFlag = 0){
  if ((start - end) < 0){ longwayFlag = +!longwayFlag; }
  let startCoords = alacrity.circPoint(center, r, start);
  let endCoords = alacrity.circPoint(center, r, start);
  return {
    _element: 'path',
    d: simpleArcSegment(startCoords, endCoords, r, longwayFlag)
  };
}
function onCircle(points, center, r, offset){
  return points.map(a => alacrity.circPoint(center, r, a + offset));
}
function starPoints(num, stride, center, r, offset){
  let points = alacrity.range(num).map(a => a * (stride / num));
  return onCircle(points, center, r, offset);
}

/**
 * @param size - 5-20 in % of larger circle's circumference
 * @param protrusion - 20-70 in % of the larger circle's radius used
 * @param thickness - in % of larger circle's circumference (recommend size of 0.03 or less)
 known issues:
 - low size & high protrusion/high thickness compared to size -> inner arcs can flip outwards
 - low protrusion/high size -> arcs go on adventures outside the big circle (wrong flag)
 */
function redirectingBracings(center, r, size = 0.3, offset = 0, num = 3, protrusion = 0.1) {
  offset += 0.5;
  let clipId = `circle-clip-${center}-${r}`;
  let mask = alacrity.makeElement({
    _element: 'clipPath',
    _contents: alacrity.makeElement(circle(center, r)),
    id: clipId
  });
  let each = dialPoints(center, r * (1 - protrusion), num, offset);
  each = each.map(a => make(circle(a, r * size), {'clip-path':`url(#${clipId})`}));
  return {
    _element:'g',
    _contents:(mask + each.join("")),
    _innerRadius: (r * (1 - protrusion)) - (r * size)
  };
}
function circle(center, r) {
  return {
    _element: 'circle',
    cx: center[0],
    cy: center[1],
    r: r,
    _innerRadius: r
  };
}
function polygon(center, r, numPoints, offset, obj) {
  if (numPoints <= 1){ return circle(center, r); }
  let points = dialPoints(center, r, numPoints, offset);
  let innerR = alacrity.length(center, mid(points[0], points[1]));
  return alacrity.smoosh(obj, {
    _element:'path',
    d:`M ${points.join(",")} Z`,
    _innerRadius:innerR
  });
}
function star(center, r = 1, num = 5, stride = 2, offset = 0, obj = {}) {
  offset += 0.5;
  if (num <= 4 || stride == 1){ return polygon(center, r, num, offset, obj); }
  let points = [];
  let d = "";
  if (num % 2 === 0 && stride % 2 === 0){
    let adjust = (0.5 * (stride / num));
    num = num / 2;
    if (num % 2 === 0){
      stride = stride - 1;
    }
    points = starPoints(num, stride, center, r, offset + adjust);
    d += `M ${points.join(",")} Z `;
  }
  points = starPoints(num, stride, center, r, offset);
  d += `M ${points.join(",")} Z`;
  let innerR = alacrity.length(center, mid(points[0], points[1]));
  return alacrity.smoosh(obj, {
    _element:'path',
    d: d,
    _innerRadius:innerR
  });
}
function star2(center = [0,0], r = 40, num = 5, length = 5, offset = 0, obj = {}) {
  offset += 0.5;
  let tips = dialPoints(center, r, num, offset);
  let b1 = dialPoints(center, r-length, num, (0.5 / num) + offset);
  let pts = alacrity.transpose([tips, b1]);
  return alacrity.smoosh(obj, {
    _element:'path',
    d: "M " + pts.join(",") + " Z",
   _innerRadius: (r - length)
  });
}
function petal(center = [0,0], r = 42, a = 0.5, step = 0.05, l = 10, flip = false) {
  let b1 = alacrity.circPoint(center, r - l, a - step);
  let q1 = alacrity.circPoint(center, r - l / 2, a - step);
  let m1 = alacrity.circPoint(center, r - l / 2, a - step / 2);
  let tip = alacrity.circPoint(center, r, a);
  let q2 = alacrity.circPoint(center, r - l / 2, a);
  //let q3 = alacrity.circPoint(center, r - l * 0.87, a); //circular part
  let m2 = alacrity.circPoint(center, r - l / 2, a + step / 2);
  let q4 = alacrity.circPoint(center, r - l / 2, a + step);
  let b2 = alacrity.circPoint(center, r - l, a + step);
  let base = arc(center, r, a - step, a + step);
  return {
    id: "petal", //todo remove
    _element: 'path',
    d: `M ${b1} Q ${q1} ${m1} Q ${q2} ${tip} Q ${q2} ${m2} Q ${q4} ${b2} A ${r} ${r} 1 0 1 ${b1} Z`,
  };
}
function petals(center = [0,0], r = 40, num = 12, l = 5, flip = false, obj = {}) {
  let ir = r - l;
  if (flip) { r = ir; l = l * -1; }
  let tips = parts(num);
  tips = tips.map(a => petal(center, r, a, 0.5 / num, l));
  tips = tips.map(a => make(a, obj)).join("");
  return {
    _element:'g',
    _contents: tips,
    _innerRadius: ir
  };
}



// todo make this possible to place at any angle/make radial labelled segments
function makeText(num){
  return alacrity.range(num).map(a => "Hello World!");
}
function simpleText(coords, size = 3, text = makeText(3).join(" ")){
  return {
    _element: 'text',
    x: coords[0],
    y: coords[1],
    'dominant-baseline': 'middle',
    'text-anchor': 'middle',
    'font-size': size,
    _contents: text
  };
}
function tooltip(coords, foo, text){
  return {
    _element: 'g',
    _contents: alacrity.makeElement(simpleText(coords, 2, text)),
  };
}
function textPath(pathId, text, size, offset = 0){
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
  };
}
function circleText(center, r, text = makeText(8), l = 3, offset = 0, obj = {}) {
  let step = 1 / text.length;
  offset += 0.5 + (1 - (text.length % 2)) * 0.5 * step;
  let pathId = `text-path-${center}-${r}`;
  let svgElements = "";
  svgElements += '<defs>';
  if (typeof text === 'string'){
    text = [text];
  }
  svgElements += make({
    _element: 'path',
    class: 'hide',
    id: pathId,
    d: circularPath(center, (r - l / 2), false, true)
  }, obj);
  svgElements += '</defs>';
  svgElements += '<text>';
  svgElements += text.map((a, i) =>
    make(textPath(pathId, a, l, offset + ((i) * step)), obj)
  ).join('');
  svgElements += '</text>';
  return {
    _element: 'g',
    transform: `rotate(${step * -180} ${center.join(" ")})`,
    _contents: svgElements,
    _innerRadius: r - l
  };
}

let sample = [
  "",{
    function: petals,
    args: [12, 5, false, {fill: 'white', 'stroke-width': 0}]
  },{ function: circle },{
    function: circleText,
    adjust: 1
  },{ function: circle, adjust: 1 },{
    function: petals,
    args: [12, 5, true, {fill: 'white', 'stroke-width': 0}]
  },{ function: circle, adjust: 1 },{
    function: star,
    args: [11, 2, 0, {'stroke-linejoin':'bevel'}],
  },{ function: circle },{
    function: radialMarks,
    args: [],
  },{ function: circle },{
    function:redirectingBracings,
    args: [0.3, 0, 3, -0.05]
  },{ function: circle },{
    function: star2,
    args: [5, 5, 0, {'stroke-linejoin':'bevel'}]
  },{ function: circle },{
    function: star,
    args: [8, 3, 0, {'stroke-linejoin':'bevel'}]
  },{ function: circle },{
    function: simpleText,
    args: ["x"]
  },{
    function: tooltip
  }
];
function nested(list = sample, r = 40, padding = 0, center = [0,0]){
  let nestWithin = (string, obj) => {
    obj = alacrity.smoosh({args:[], adjust: 0}, obj);
    let fren = obj.function(center, r - obj.adjust, ...obj.args);
    r = fren._innerRadius - padding;
    return string + make(fren);
  };
  return list.reduce(nestWithin);
}

//testString += alacrity.log(redirectingBracings([0,0],tempRadius));
$("test").innerHTML = nested();
// rotation is generally applied after translation, but layering this allows rotation that doesn't change position
