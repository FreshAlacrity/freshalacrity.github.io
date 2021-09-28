// @ts-check
/* globals $, alacrity, svg, luxon */

// troubleshoot coordinates for mouse not being accurate when the window is taller than it is wide
// add a try catch to update to prevent errors stacking up hugely
// consolidate fullscreen support into functions for svg.js
//     main function adds all the event listeners
//     include zooming in and out and fetching mouse coordinates
//     have it check for a storage { window {}} with initialWidth/Height and log sample code to add if it's not found?
//          how useful would it be if it couldn't make global values anyhow? we'd at least need to store the initial values *somewhere*
// see also https://codepen.io/WanderingEnby/pen/ExaYeRB
// [ ] make arcs/pie wedges
//     [ ] use time in fraction of a day since the circle will be a 0-1; key objects to start time
//     [ ] show arcs for daily things (pie wedges for now)
//     [ ] show the 'tail' on caffeine consumption (~6 hrs) and also maybe how long it takes before withdrawals?
//     [ ] detect collisions
//        [ ] change position to avoid collisions
// [ ] get click-and drag working
//     [ ] align a wedge to the mouse
//         [ ] toggle alignment on click
// [ ] allow adding arcs for scheduled stuff (manually for now)
//     [ ] optionally add transit time
// [ ] text description/text readout

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
const storage = {}
const settings = {
  Time: {
    value: 'foo',
    type: 'time',
    title: 'Defines a control for entering a time (no timezone)'
  },
  Size: {
    value: 30,
    type: 'number',
    title: 'The radius of the dial'
  }
}
const svgId = 'test'
const center = [0, 0] // @later make this a setting?

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

function update () {
  const newHand = hand(center, settings.Size.value)
  svg.setAtts($('clockhand'), newHand)
}

const fullscreen = (function () {
  // @later start the mouse indicator offscreen
  // @todo figure out why mouse position isn't being correctly recalculated when the screen is zoomed
  // @todo troubleshoot view edges not working correctly when w < h

  const _internal = {
    indicator: false,
    // w and h are in svg units, vw and vh are in pixels - @later rename for clarity?
    window: { initialWidth: 100, initialHeight: 100, w: 100, h: 100, vw: 100, vh: 100, ratio: 1 },
    mouse: { clientX: 0, clientY: 0, x: 0, y: 0, down: false }
  }
  function updateWindow() {
      let w = alacrity.getPageWidth()
      let h = alacrity.getPageHeight()
      /* use the known view size to zoom in and out when it changes */
      let vw = (100 * w) / _internal.window.initialWidth
      let vh = (100 * h) / _internal.window.initialHeight
      $(svgId).setAttribute(
        "viewBox", `-${vw / 2} -${vh / 2} ${vw} ${vh}`
      )

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
      _internal.window.ratio = ratio;
      _internal.window.w = w * ratio - padding;
      _internal.window.h = h * ratio - padding;
      _internal.window.vw = w;
      _internal.window.vh = h;

      if (_internal.indicator) {
        // @todo get this working
        svg.setAtts($("view-edges"), {
          x: _internal.window.w * -0.5,
          y: _internal.window.h * -0.5,
          width: _internal.window.w,
          height: _internal.window.h
        })
      }
      mousePos() // @todo figure out why this isn't applying accurately to preserve mouse position when zooming
      update()
  }
  function changeView() {
    updateWindow()
    mousePos()
    /* check again just in case; sometimes the first one misses window resizing */
    delay(0.3).then(updateWindow)
  }
  function mouseDown (event) {
    mouseMove(event)
    _internal.mouse.down = true
    if (_internal.indicator) { svg.setAtts($('click-indicator'), { 'fill-opacity': 1 }) }
    update()
  }
  function mouseUp (event) {
    mouseMove(event)
    _internal.mouse.down = false
    if (_internal.indicator) { svg.setAtts($('click-indicator'), { 'fill-opacity': 0.2 }) }
    update()
  }
  function mousePos () {
    const x = (_internal.mouse.clientX - _internal.window.vw / 2) * _internal.window.ratio;
    const y = (_internal.mouse.clientY - _internal.window.vh / 2) * _internal.window.ratio;
    _internal.mouse.x = x
    _internal.mouse.y = y
    if (_internal.indicator) { svg.setAtts($('click-indicator'), { cx: x, cy: y }) }
  }
  function mouseMove(event) {
    _internal.mouse.clientX = event.clientX
    _internal.mouse.clientY = event.clientY
    mousePos()
  }
  function setup (showIndicator) {
    // @todo check for global svgId value here
    _internal.window.initialWidth = alacrity.getPageWidth()
    _internal.window.initialHeight = alacrity.getPageHeight()
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    alacrity.onWindowResize(changeView)
    if (showIndicator) { 
      _internal.indicator = true 
      $(svgId).appendChild(svg.new('circle', { id: 'click-indicator', cx: 0, cy: 0, r: 2, fill: 'currentColor', 'fill-opacity': 0.2, 'stroke-opacity': 0 }))
      $(svgId).appendChild(svg.new('rect', { 
        id: 'view-edges', x: 5, y: 5, width: 95, height: 95, 
        stroke: 'currentColor', 'stroke-width': 1, 'stroke-dasharray': '20,10,5,5,5,10', 
        'fill': 'none', 'fill-opacity':0, 'stroke-opacity': 0.2 
      }))
    }
    updateWindow()
  }
  return {
    setup: setup,
    window: _internal.window,
    mouse: _internal.mouse
  }
}())


function init () {
  let allSvgElements = ''
  let radius = settings.Size.value
  allSvgElements += svg.make(hand(center, radius, 24))
  allSvgElements += svg.make(svg.radialMarks(center, radius, 24, 3))
  // todo update this to create elements instead:
  allSvgElements += `<circle cx="0" cy="0" r="${radius}" fill="none" />`
  allSvgElements += `<circle cx="0" cy="0" r="${1}" fill="currentColor" />`
  $(svgId).innerHTML = allSvgElements
  fullscreen.setup(true)
}
init()




textOutput('Current Time: ' + now.toLocaleString(DateTime.TIME_SIMPLE)) // @todo - have this output in the text readout where the current time would be relative to other blocks
