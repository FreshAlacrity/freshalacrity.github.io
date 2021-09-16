// @ts-check
/* globals $, alacrity, svg, luxon */

// troubleshoot click positions being too far away
// see also https://codepen.io/WanderingEnby/pen/ExaYeRB
// @todo get click-and drag working
// [ ] have a ripple appear where the user clicks
//     [ ] align a wedge to the click
// known issue: line path not generating properly, seems to be an issue with coordinates getting into the string

// [x] make a red 24 hour clock hand
//     [x] clockPoint function that goes clockwise from the top (added to alacrity)
// [ ] make arcs/pie wedge
//     [ ] allow click to drag arcs
// [ ] show arcs for daily things (pie wedges for now)
// [ ] detect collisions
//     [ ] change position to avoid collisions
// [ ] use time in fraction of a day since the circle will be a 0-1; key objects to start time
// [ ] allow adding arcs for scheduled stuff (manually for now)
//     [ ] optionally add transit time
// [ ] adjust other arcs around the dragged ones with some elasticity
// [ ] show the 'tail' on caffeine consumption (~6 hrs) and also maybe how long it takes before withdrawals?
// [ ] add text description
// [ ] add text readout

/*
- caffeine
- meals
- drinks
- brushing teeth
- sleep
- pomodoro units
- scheduled events (assume drinking is possible but not eating, toggle for auto-add transit?)
- rush hour/things that effect other things only indirectly?
https://docs.google.com/spreadsheets/d/1tEiAZ5rt_Vp4kerZXpFG9Xe9OuFOqpuipM-CAHOAV7I/edit#gid=489565883
*/

console.clear()
const DateTime = luxon.DateTime
const now = DateTime.now()
const viewFrame = {}
const storage = { window: {} }
const settings = {
  Time: {
    value: 'foo',
    type: 'time',
    title: 'Defines a control for entering a time (no timezone)'
  },
  Size: {
    value: 60,
    type: 'number',
    title: 'The % of the screen the dial fills'
  }
}
const svgId = 'test'
const initialWidth = alacrity.getPageWidth()
const initialHeight = alacrity.getPageHeight()
const center = [0, 0]
let radius = settings.Size.value / 2

/* TEXT OUTPUT */
function textOutput (...args) {
  console.log(...args)
}

function hand (center = [0, 0], r = 40, numHours = 12) {
  const time = (now.hour * (numHours / 24)) + (now.minute / 60)
  const decimal = time / numHours
  const handObj = svg.line([center, alacrity.clockPoint(center, r, decimal)])
  handObj.id = 'clockhand'
  handObj.class = 'attn'
  return handObj
}
function delay(seconds) {
  // via https://javascript.info/task/delay-promise
  return new Promise((resolve) => setTimeout(resolve, seconds / 1000));
}
function updateWindow() {
    let w = alacrity.getPageWidth();
    let h = alacrity.getPageHeight();

    /* use the known view size to zoom in and out when it changes */
    let vw = (100 * w) / initialWidth;
    let vh = (100 * h) / initialHeight;
    $(svgId).setAttribute(
      "viewBox",
      `-${vw / 2} -${vh / 2} ${vw} ${vh}`
    );

    /* track the relationship between screen size and svg coordinates */
    let ratio = 1;
    let padding = 10;
    if (w < h) {
      ratio = vw / w;
      padding = w * ratio * 0.1;
    } else {
      ratio = vh / h;
      padding = h * ratio * 0.1;
    }
    storage.window.ratio = ratio;
    storage.window.w = w * ratio - padding;
    storage.window.h = h * ratio - padding;
    storage.window.vw = w;
    storage.window.vh = h;

    /* debug - need to create the element first for this to work
    svg.setAtts($("view-edges"), {
      x: storage.window.w * -0.5,
      y: storage.window.h * -0.5,
      width: storage.window.w,
      height: storage.window.h
    });
    */
    update();
}
function changeView() {
  updateWindow()
  /* check again just in case; sometimes the first one misses window resizing */
  delay(0.3).then(updateWindow)
}
alacrity.onWindowResize(changeView);

function mouseDown (event) {
  mouseMove()
  update()
}
function mouseMove(event) {
  // @todo change this to store mouse coordinates in the window property
  const x = (event.clientX - storage.window.vw / 2) * storage.window.ratio;
  const y = (event.clientY - storage.window.vh / 2) * storage.window.ratio;
  svg.setAtts($('click-indicator'), { cx: x, cy: y })
}
document.addEventListener('mousedown', mouseDown)
document.addEventListener('mousemove', mouseMove)
// document.addEventListener('mouseup', mouseUp)

function update () {
  radius = settings.Size.value / 2
  const newHand = hand(center, radius)
  svg.setAtts($('clockhand'), newHand)
}

function init () {
  let allSvgElements = ''
  allSvgElements += svg.make(hand(center, radius, 24))
  allSvgElements += svg.make(svg.radialMarks(center, radius, 24, 3))
  // todo update this to create elements instead:
  allSvgElements += `<circle cx="0" cy="0" r="${radius}" fill="none" />`
  allSvgElements += `<circle cx="0" cy="0" r="${1}" fill="currentColor" />`
  $(svgId).innerHTML = allSvgElements
  $(svgId).appendChild(svg.new('circle', { id: 'click-indicator', cx: 0, cy: 0, r: 2, fill: 'currentColor', 'fill-opacity': 0.2, 'stroke-opacity': 0 }))
  updateWindow()
}
init()



textOutput('Current Time: ' + now.toLocaleString(DateTime.TIME_SIMPLE)) // @todo - have this output in the text readout where the current time would be relative to other blocks
