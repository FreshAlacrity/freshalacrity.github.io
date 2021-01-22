/* jshint esversion: 6 */
/* jshint undef: true */
/* globals alacrity, luxon, window, document, $, setInterval, setTimeout */
/* globals alert, nested, svg */
/*
- remove offsets from dateTimeToAngle() and allow date input
- make a 180 degree rotation animation with linear progression and test
- put current weekday then current month and day of month at the top
- figure out a clock hand line to display at the right angle
  - animate the clock hand
  - make it an actual custom shape
- set up a new sample object
- implement class for top level groups/things that react to being hovered (maybe just hover-react?)
- show line indicating current time as if the full circle was a 12 hour clock
- get month and weekday wheels rotated properly on init (to current time)
- import all the wheel of the year data and functions
- get all those working together neatly and taking an array of bound functions to draw consecutive patterns
- go all the way from the year wheel to two-minute and three-minute timers with little progress circles
- animation that rotates in a full circle on a set timescale
- for year show travel dates and holidays and eventually location info
- for month show lunar cycle, therapy + shot days/all-day calendar events
- for day show calendar appointments inc. wake/sleep
- for 12 hours show current time, rotate others to match
- timers: click to begin animation and reset time until it makes a noise, show ## representing time in minutes as part of the dial
- base on circular timer/progress meter from codepen
    https://codepen.io/WanderingEnby/pen/eYdKLbQ
- 6 hour timer
- 1 hour timer
- 20 minute timer
- center: click to change number of minutes for custom timer
- show only current month name and weekday name in attn color
*/

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
var targetSvg = "test";
let DateTime = luxon.DateTime;

function dateTimeToAngle(key = '12-hour'){
  let refs = {
    week: {
      mils: 86400000 * 7,
      offset: 1/7,
      begin: DateTime.local().startOf('week')
    },
    year: {
      mils: 86400000 * 356,
      offset: 0,
      begin: DateTime.fromObject({month: 1, day: 1, hour: 0})
    },
    day: {
      mils: 86400000,
      offset: 0,
      begin: DateTime.fromObject({hour: 0})
    },
    '12-hour': {
      mils: 86400000 / 2,
      offset: 0.5,
      begin: DateTime.fromObject({hour: 0})
    }
  };
  let time = luxon.Interval.fromDateTimes(
    refs[key].begin,
    DateTime.local()
  ).length();
  //let time = DateTime.local().valueOf() % refs[key].mils;
  return refs[key].offset + (time / refs[key].mils);
}
function ro(key){
  alacrity.log(key, dateTimeToAngle(key));
  return dateTimeToAngle(key);// + dateTimeToAngle();
}

function hand(r){
  let end = alacrity.circPoint([0,0], r, dateTimeToAngle());
  let points = [[0,0], end];
  let line = {
    _element: 'path',
    d: "M " + points.join(" ") + "Z",
    class: "attn"
  };
  return svg.make(line);
}

let clockdial = [
  "",{
    function: svg.circle,
    //args: [12, 8, ro('year'), false]
  },{
    adjust: 1,
    function: svg.circleText,
    args: [months, 3]//, ro('year') + 0.5/12],
  },{
    adjust: -4,
    function: svg.radialMarks,
    args: [12, 5, ro('year') + 0.5/12],
  },{
    function: svg.circle,
    adjust: 0
  },{
    adjust: 1,
    function: svg.circleText,
    args: [weekdays, 3, ro('week'), {'stroke-linejoin':'bevel'}],
  },{
    adjust: -4,
    function: svg.radialMarks,
    args: [7, 5, ro('week') + 0.5],
  },{
    function: svg.circle,
    adjust: 0
  },{
    adjust: 3,
    function: svg.circleText,
    args: [[1,2,3,4,5,6,7,8,9,10,11,12], 3, 1/12, {'stroke-linejoin':'bevel'}],
  },{
    function: svg.circle,
    adjust: 1
  },{
    function: svg.radialMarks,
    args: [12, 5],
  },{ function: svg.circle },{
    function: svg.text,
    args: ["x"]
  }
];
let test = svg.make(svg.circle(alacrity.circPoint([0,0], 42, dateTimeToAngle('year')), 5), {class:"attn"});
$("test").innerHTML = svg.nestedCircles(clockdial, 45) + hand(45) + test;
