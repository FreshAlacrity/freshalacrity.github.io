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

function init () {
  let allSvgElements = ''
  let radius = settings.Size.value
  allSvgElements += svg.make(hand(center, radius, 24))
  allSvgElements += svg.make(svg.radialMarks(center, radius, 24, 3))
  // todo update this to create elements instead:
  allSvgElements += `<circle cx="0" cy="0" r="${radius}" fill="none" />`
  allSvgElements += `<circle cx="0" cy="0" r="${1}" fill="currentColor" />`
  $(svgId).innerHTML = allSvgElements
  fullscreen.setup(svgId, true)
}
init()




textOutput('Current Time: ' + now.toLocaleString(DateTime.TIME_SIMPLE)) // @todo - have this output in the text readout where the current time would be relative to other blocks
