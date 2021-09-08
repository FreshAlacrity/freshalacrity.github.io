// @ts-check
/* globals $, alacrity, svg, luxon */

// known issue: line path not generating properly, seems to be an issue with coordinates getting into the string
// [ ] add text description
// [ ] add text readout
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
// see also https://codepen.io/WanderingEnby/pen/ExaYeRB

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

const DateTime = luxon.DateTime
const now = DateTime.now()
let settings = {
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
const center = [0, 0]
let radius = settings.Size.value / 2

function hand (center = [0, 0], r = 40, numHours = 12) {
  const time = (now.hour * (numHours / 24)) + (now.minute / 60)
  const decimal = Math.random(time / numHours)
  const handObj = svg.line([center, alacrity.clockPoint(center, r, decimal)])
  handObj.id = 'clockhand'
  handObj.class = 'attn'
  return handObj
}

function init () {
  let allSvgElements = ''
  allSvgElements += svg.make(hand(center, radius, 24))
  allSvgElements += svg.make(svg.radialMarks(center, radius, 24, 3))
  allSvgElements += `<circle cx="0" cy="0" r="${radius}" fill="none" />`
  allSvgElements += `<circle cx="0" cy="0" r="${1}" fill="currentColor" />`
  $('test').innerHTML = allSvgElements
}
init()

// @todo get click-and drag working
// [ ] have a ripple appear where the user clicks
// see tarot webapp for move-on-click: https://codepen.io/WanderingEnby/pen/QWveXbE?editors=1010
// const moveMe = document.getElementById('clockhand')
document.addEventListener('mousedown', mouseDown)
// document.addEventListener('mousemove', mouseMove)
// document.addEventListener('mouseup', mouseUp)

function mouseDown (event) {
  const y = event.clientY
  const x = event.clientX
  alacrity.log('click at', x, y, event)
  alacrity.addHtml('test', `<circle cx="${x}" cy="${y}" r="${1}" fill="currentColor" />`)
  update()
}

function update () {
  radius = settings.Size.value / 2
  const newHand = hand(center, radius)
  svg.setAtts($('clockhand'), newHand)
  alacrity.log('update complete')
}
update()

/* TEXT OUTPUT */
function textOutput (...args) {
  console.log(...args)
}

textOutput('Current Time: ' + now.toLocaleString(DateTime.TIME_SIMPLE)) // @todo - have this output in the text readout where the current time would be relative to other blocks
